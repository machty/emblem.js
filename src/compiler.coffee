Emblem.precompile = (string, options = {}) ->
  if typeof string isnt 'string'
    throw new Handlebars.Exception("You must pass a string to Emblem.precompile. You passed " + string)
  options.data = true unless 'data' in options

  ast = Emblem.parse string
  environment = new Handlebars.Compiler().compile(ast, options)
  return new Handlebars.JavaScriptCompiler().compile(environment, options)

Emblem.compile = (string, options = {}) ->
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

