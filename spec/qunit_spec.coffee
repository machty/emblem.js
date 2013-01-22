
unless Handlebars? && Emblem?
  # Setup for Node package testing
  Emblem = require('../lib/emblem')
  Handlebars = require('handlebars')

  assert = require("assert")
  equal = assert.equal
  equals = assert.equal
  ok = assert.ok

else
  _equal = equal
  equals = equal = (a, b, msg) ->
    # Allow exec with missing message params
    _equal(a, b, msg || '')

unless CompilerContext?
  # Note that this doesn't have the same context separation as the rspec test.
  # Both should be run for full acceptance of the two libary modes.
  CompilerContext = 
    compile: (template, options) ->
      templateSpec = Emblem.precompile(template, options)
      Handlebars.template eval "(#{templateSpec})"  

shouldCompileTo = (string, hashOrArray, expected, message) ->
  shouldCompileToWithPartials(string, hashOrArray, false, expected, message)

shouldCompileToWithPartials = (string, hashOrArray, partials, expected, message) ->
  result = compileWithPartials(string, hashOrArray, partials)
  equal(result, expected, "'" + expected + "' should === '" + result + "': " + message)

compileWithPartials = (string, hashOrArray, partials) ->
  template = CompilerContext.compile(string)
  if Object::toString.call(hashOrArray) == "[object Array]"
    if helpers = hashOrArray[1]
      for prop of Handlebars.helpers
        helpers[prop] = helpers[prop] || Handlebars.helpers[prop]

    ary = []
    ary.push(hashOrArray[0])
    ary.push
      helpers: hashOrArray[1]
      partials: hashOrArray[2]

  else
    ary = [hashOrArray]

  template.apply(this, ary)

shouldThrow = (fn, exception, message) ->
  caught = false

  if exception instanceof Array
    exType = exception[0];
    exMessage = exception[1];
  else if typeof exception == 'string'
    exType = Error
    exMessage = exception
  else
    exType = exception

  try 
    fn()
  catch e
    if e instanceof exType
      if !exMessage || e.message == exMessage
        caught = true

  ok(caught, message || null)

suite("html one-liners")

test "element only", ->
  shouldCompileTo("p", {}, "<p></p>")

test "with text", ->
  shouldCompileTo("p Hello", {}, "<p>Hello</p>")

test "with more complex text", ->
  shouldCompileTo("p Hello, how's it going with you today?", {}, "<p>Hello, how's it going with you today?</p>")

test "with trailing space", ->
  shouldCompileTo("p Hello   ", {}, "<p>Hello   </p>")

suite("html more complex")

test "multiple lines", ->
  emblem =
  """
  p Hello
  h1 How are you?
  """
  shouldCompileTo emblem, {}, "<p>Hello</p><h1>How are you?</h1>"
