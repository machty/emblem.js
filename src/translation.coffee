Handlebars = require 'handlebars'
Emblem     = require './emblem'
  
# Simple wrapped around a string. Gets passed around for the purpose
# of coalescing adjacent content nodes into one
class ContentStack
  constructor: ->
    @current = ""

  append: (s) ->
    @current += s

  flatten: ->
    ret = @current
    @current = ""
    ret

# We basically need to "unpeel" Emblem's ast, which consists
# of "statements" of html elements or mustache invocations, both
# of which can have nested content. Handlebars' AST on the other
# hand features ContentNodes (i.e. any static text between 
# mustache nodes) and all the nodes for describing a mustache.

# Handlebar's root ProgramNode statements that we'll be building
# up and nesting over the course of the translation.

processNodes = (nodes, stack, statements = []) ->

  for node in nodes
    if node.type == 'html'
      # TODO defaults
      tagName = node.tagName || 'div'

      # Coalesce attributes

      classes = node.attrs.classes || []
      classNames = classes.join ' '
      attributesString = ""
      attributesString += ' ' + name + '=' + '"' + value + '"' for own name, value of node.attrs || {}

      stack.append """<#{tagName}#{attributesString}>"""

      processNodes(node.nodes || [], stack, statements)

      stack.append """</#{tagName}>"""

    else if node.type == 'mustache'

      # Create content node if we've stored up some.
      c = stack.flatten()
      statements.push new Handlebars.AST.ContentNode c if c

      # Check for uppercase special case.
      firstChar = node.params[0].charAt(0)
      if !node.forced && firstChar == firstChar.toUpperCase()
        # TODO defaults
        helper = "view"
        node.params.unshift helper

      # The Mustache node expects params as an array of IdNode's
      params = []
      for param in node.params
        # an IdNode has a parts array which includes the period separators
        # between identifiers, e.g. ['App', '.', 'Whatever']
        # TODO: clean this up, use grammar parse to do thie splitting
        ids = param.split('.')
        result = []
        for id in ids
          result.push id
          result.push '.'
        result.pop()
        
        params.push new Handlebars.AST.IdNode(result)

      # Block
      # Need array of hash key value pairs
      pairs = []
      pairs.push [k,v] for own k,v of node.hash
      hash = null
      hash = new Handlebars.AST.HashNode(pairs) if pairs.length

      # Determine whether this is just a single mustache
      # or a blockstache.
      if node.nodes && node.nodes.length

        closeId = params[0]
        substatements = processNodes node.nodes, new ContentStack
        statements.push new Handlebars.AST.ProgramNode(substatements, [])
        # TODO handle else substatements
        openStache = new Handlebars.AST.MustacheNode(params, hash, node.escaped) # TODO reverse polarity on `escape`. whoops.

        statements.push new Handlebars.AST.BlockNode(openStache, statements, [], closeId) 
      else
        # Singlestache
        statements.push new Handlebars.AST.MustacheNode(params, hash, node.escaped) # TODO escaped polarity

    else if node instanceof Array
      # One liner, could be strings or mustaches
      processNodes node, stack, statements
    else
      # Assume string
      stack.append node.toString()
  statements

Emblem.parse = (string) -> 
  stack = new ContentStack

  # Pre-process, parse, translate.
  processed = Emblem.Preprocessor.processSync string

  emblemAST = Emblem.Parser.parse(processed)

  statements = processNodes emblemAST, stack

  # Flush out any remaining static text content
  c = stack.flatten()
  statements.push new Handlebars.AST.ContentNode c if c

  new Handlebars.AST.ProgramNode(statements, [])



