Handlebars = require 'handlebars'
Emblem = require './emblem'

Emblem.throwCompileError = (line, msg) ->
  throw new Error "Emblem syntax error, line #{line}: #{msg}"

Emblem.parse = (string) -> 
  # Pre-process, parse
  try
    processed = Emblem.Preprocessor.processSync string
    new Handlebars.AST.ProgramNode(Emblem.Parser.parse(processed), []) 
  catch e
    if e instanceof Emblem.Parser.SyntaxError
      #Emblem.throwCompileError(msg, code, col, line)
      lines = string.split("\n")
      line = lines[e.line - 1]
      msg = "#{e.message}\n#{line}\n"
      msg += new Array(e.column).join("-")
      msg += "^"
      Emblem.throwCompileError e.line, msg
    else
      throw e

Emblem.precompileRaw = (string, options = {}) ->
  if typeof string isnt 'string'
    throw new Handlebars.Exception("You must pass a string to Emblem.precompile. You passed " + string)
  #options.stringParams = true unless 'stringParams' in options
  options.data = true unless 'data' in options

  ast = Emblem.parse string
  environment = new Handlebars.Compiler().compile(ast, options)
  return new Handlebars.JavaScriptCompiler().compile(environment, options)

Emblem.compileRaw = (string, options = {}) ->
  if typeof string isnt 'string'
    throw new Handlebars.Exception("You must pass a string to Emblem.compile. You passed " + string)
  #options.stringParams = true unless 'stringParams' in options
  options.data = true unless 'data' in options

  compiled = null
  compile = ->
    ast = Emblem.parse string
    environment = new Handlebars.Compiler().compile(ast, options)
    templateSpec = new Handlebars.JavaScriptCompiler().compile(environment, options, undefined, true)
    Handlebars.template(templateSpec)

  (context, options) ->
    compiled = compile() unless compiled
    return compiled.call(this, context, options);

Emblem.precompile = Emblem.precompileRaw
Emblem.compile = Emblem.compileRaw

# See ember-handlebars-compiler code in Ember.js codebase
# for where the following functions came from
Emblem.precompileEmber = (string) ->
  ast = Emblem.parse(string)

  options =
    knownHelpers:
      action: true
      unbound: true
      bindAttr: true
      template: true
      view: true
      _triageMustache: true
    data: true
    stringParams: true

  environment = new Ember.Handlebars.Compiler().compile(ast, options)
  new Ember.Handlebars.JavaScriptCompiler().compile(environment, options, undefined, true)

Emblem.compileEmber = (string) ->
  ast = Emblem.parse(string)
  options = { data: true, stringParams: true }
  environment = new Ember.Handlebars.Compiler().compile(ast, options);
  templateSpec = new Ember.Handlebars.JavaScriptCompiler().compile(environment, options, undefined, true)
  Ember.Handlebars.template(templateSpec)

