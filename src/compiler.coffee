Handlebars = require 'handlebars'
Emblem = require './emblem'

Emblem.precompileRaw = (string, options = {}) ->
  if typeof string isnt 'string'
    throw new Handlebars.Exception("You must pass a string to Emblem.precompile. You passed " + string)
  options.data = true unless 'data' in options

  ast = Emblem.parse string
  environment = new Handlebars.Compiler().compile(ast, options)
  return new Handlebars.JavaScriptCompiler().compile(environment, options)

Emblem.compileRaw = (string, options = {}) ->
  if typeof string isnt 'string'
    throw new Handlebars.Exception("You must pass a string to Emblem.compile. You passed " + string)
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

