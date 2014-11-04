Emblem = require './emblem'

Emblem.throwCompileError = (line, msg) ->
  throw new Error "Emblem syntax error, line #{line}: #{msg}"

Emblem.registerPartial = (handlebarsVariant, partialName, text) ->
  # Handle 2-arg
  unless text
    text = partialName
    partialName = handlebarsVariant

    # Always assume Handlebars. No one uses vanilla HB partials in Ember.
    handlebarsVariant = Handlebars

  handlebarsVariant.registerPartial partialName, Emblem.compile handlebarsVariant, text

Emblem.parse = (string) ->
  # Pre-process, parse
  try
    processed = Emblem.Preprocessor.processSync string
    Emblem.Parser.parse(processed)
  catch e
    # TODO: strip non printaable chars, e.g. TERM, INDENT, DEDENT, etc. ?
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

Emblem.precompile = (handlebarsVariant, string, options = {}) ->
  Emblem.handlebarsVariant = handlebarsVariant
  ast = Emblem.parse string
  handlebarsVariant.precompile ast, false

Emblem.compile = (handlebarsVariant, string, options = {}) ->
  Emblem.handlebarsVariant = handlebarsVariant
  ast = Emblem.parse string
  handlebarsVariant.compile ast, options
