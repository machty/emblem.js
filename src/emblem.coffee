fs = require 'fs'
path = require 'path'

#{formatParserError} = require './helpers'
#Nodes = require './nodes'
{Preprocessor} = require './preprocessor'
Parser = require './parser'
#{Optimiser} = require './optimiser'
#{Compiler} = require './compiler'

pkg = require './../../package.json'

module.exports =

  Compiler: Compiler
  Optimiser: Optimiser
  Parser: Parser
  Preprocessor: Preprocessor
  Nodes: Nodes

  VERSION: pkg.version

  parse: (coffee, options = {}) ->
    try
      preprocessed = Preprocessor.processSync coffee
      parsed = Parser.parse preprocessed,
        raw: options.raw
        inputSource: options.inputSource
      if options.optimise then Optimiser.optimise parsed else parsed
    catch e
      throw e unless e instanceof Parser.SyntaxError
      throw new Error "GOT SOME BAD"# formatParserError preprocessed, e

  compile: (csAst, options) ->
    Compiler.compile csAst, options

Emblem = module.exports.Emblem = module.exports

require './run'

