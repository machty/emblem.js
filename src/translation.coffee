Handlebars = require 'handlebars'
Emblem     = require './emblem'

"BEGIN BROWSER"

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

#Handlebars.AST.ProgramNode = function(statements, inverse) {

# We basically need to "unpeel" Emblem's ast, which consists
# of "statements" of html elements or mustache invocations, both
# of which can have nested content. Handlebars' AST on the other
# hand features ContentNodes (i.e. any static text between 
# mustache nodes) and all the nodes for describing a mustache.

# Handlebar's root ProgramNode statements that we'll be building
# up and nesting over the course of the translation.

processNodes = (nodes, stack, program = []) ->

  for node in nodes
    if node.type == 'html'
      # TODO defaults
      tagName = node.tagName || 'div'

      classes = node.attrs.classes || []
      classNames = classes.join ' '
      attributesString = ""
      attributesString += """#{name}="#{value}" """ for own name, value of node.attrs || {}

      stack.append """<#{tagName} #{attributesString}>"""

      processNodes(node.nodes || [], stack, program)

      stack.append """</#{tagName}>"""

    else if node.type == 'mustache'

      # Create content node if we've stored up some.
      c = stack.flatten()
      program.push new Handlebars.AST.ContentNode c if c

      # Check for uppercase special case.
      firstChar = node.params[0].charAt(0)
      if firstChar == firstChar.toUpperCase()
        # TODO defaults
        helper = "view"
        node.params.unshift helper

      # Block
      # Need array of hash key value pairs
      pairs = []
      pairs.push [k,v] for own k,v of node.hash
      hash = new Handlebars.AST.HashNode(pairs)

      # Determine whether this is just a single mustache
      # or a blockstache.
      if node.nodes.length

        closeId = new Handlebars.AST.IdNode(node.params[0].split('.'))
        program = processNodes node.nodes, new ContentStack
        openStache = new Handlebars.AST.MustacheNode(node.params, hash, node.escaped) # TODO reverse polarity on `escape`. whoops.

        # TODO handle else statements
        program.push new Handlebars.AST.BlockNode(openStache, program, [], closeId) 
      else
        # Singlestache
        program.push new Handlebars.AST.MustacheNode(node.params, hash, node.escaped) # TODO escaped polarity

    else if node instanceof String
      stack.append node
    else if node instanceof Array
      # One liner, could be strings or mustaches
      processNodes node
    else throw new Error 'Unrecognized node type.'
  program

Emblem.parse = (string) -> 
  stack = new ContentStack

  # Pre-process, parse, translate.
  processed = Emblem.Preprocessor.processSync string
  emblemAST = Emblem.Parser.parse(processed)
  hbAST = processNodes emblemAST, stack

  # Flush out any remaining static text content
  c = stack.flatten()
  hbAST.push new Handlebars.AST.ContentNode c if c

  hbAST


"END BROWSER"


