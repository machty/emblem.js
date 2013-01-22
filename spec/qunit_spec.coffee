
unless Handlebars? && Emblem?
  # Setup for Node package testing
  Emblem = require('../lib/emblem')
  Handlebars = require('handlebars')

  assert = require("assert")
  {equal, equals, ok, throws} = assert

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
  if hashOrArray.constructor == String
    shouldCompileToWithPartials(string, {}, false, hashOrArray, message)
  else
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
    exType = exception[0] 
    exMessage = exception[1]
  else if typeof exception == 'string'
    exType = Error
    exMessage = exception
  else
    exType = exception

  try 
    fn()
  catch e

    #}, [Error, "Could not find property 'link_to'"], "Should throw exception");
    unless exType
      caught = true
    else 
      if e instanceof exType
        if !exMessage || e.message == exMessage
          caught = true

  ok(caught, message || null)

suite "html one-liners"

test "element only", ->
  shouldCompileTo("p", "<p></p>")

test "with text", ->
  shouldCompileTo("p Hello", "<p>Hello</p>")

test "with more complex text", ->
  shouldCompileTo("p Hello, how's it going with you today?", "<p>Hello, how's it going with you today?</p>")

test "with trailing space", ->
  shouldCompileTo("p Hello   ", "<p>Hello   </p>")

suite "text lines"

test "basic", -> shouldCompileTo("| What what", "What what")
test "with html", -> 
  shouldCompileTo '| What <span id="woot" data-t="oof" class="f">what</span>!',
                    'What <span id="woot" data-t="oof" class="f">what</span>!'

test "multiline", ->
  emblem =
  """
  | Blork
    Snork
  """
  shouldCompileTo emblem, "BlorkSnork"

test "multiline w/ trailing whitespace", ->
  emblem =
  """
  | Blork 
    Snork
  """
  shouldCompileTo emblem, "Blork Snork"

test "multiline with empty first line", ->
  emblem =
  """
  | 
    Good
  """
  shouldCompileTo emblem, "Good"

suite "preprocessor"

test "it strips out preceding whitespace", ->
  emblem =
  """

  p Hello
  """
  shouldCompileTo emblem, "<p>Hello</p>"

test "it handles preceding indentation", ->
  emblem = "  p Woot\n  p Ha"
  shouldCompileTo emblem, "<p>Woot</p><p>Ha</p>"

test "it handles preceding indentation and newlines", ->
  emblem = "\n  p Woot\n  p Ha"
  shouldCompileTo emblem, "<p>Woot</p><p>Ha</p>"

test "it handles preceding indentation and newlines pt 2", ->
  emblem = "  \n  p Woot\n  p Ha"
  shouldCompileTo emblem, "<p>Woot</p><p>Ha</p>"

test "it strips out single line '/' comments", ->
  emblem =
  """
  p Hello

  / A comment

  h1 How are you?
  """
  shouldCompileTo emblem, "<p>Hello</p><h1>How are you?</h1>"

test "it strips out multi-line '/' comments", ->
  emblem =
  """
  p Hello

  / A comment
    that goes on to two lines
    even three!

  h1 How are you?
  """
  shouldCompileTo emblem, "<p>Hello</p><h1>How are you?</h1>"

test "it strips out multi-line '/' comments without text on the first line", ->
  emblem =
  """
  p Hello

  / 
    A comment
    that goes on to two lines
    even three!

  h1 How are you?
  """
  shouldCompileTo emblem, "<p>Hello</p><h1>How are you?</h1>"






suite "indentation"

test "it throws when indenting after a line with inline content", ->
  emblem =
  """
  p Hello
    p invalid
  """
  shouldThrow -> CompilerContext.compile emblem

test "it throws on half dedent", ->
  emblem =
  """
  p
      span This is ok
    span This aint
  """
  shouldThrow -> CompilerContext.compile emblem


suite "attribute shorthand"

test "id shorthand", ->
  shouldCompileTo "#woot", '<div id="woot"></div>'
  shouldCompileTo "span#woot", '<span id="woot"></span>'

test "class shorthand", ->
  shouldCompileTo ".woot", '<div class="woot"></div>'
  shouldCompileTo "span.woot", '<span class="woot"></span>'
  shouldCompileTo "span.woot.loot", '<span class="woot loot"></span>'


suite "full attributes"

test "tags without content", ->
  shouldCompileTo 'p class="yes"', '<p class="yes"></p>'
  shouldCompileTo 'p id="yes"', '<p id="yes"></p>'
  shouldCompileTo 'p id="yes" class="no"', '<p id="yes" class="no"></p>'

test "tags with content", ->
  shouldCompileTo 'p class="yes" Blork', '<p class="yes">Blork</p>'
  shouldCompileTo 'p id="yes" Hyeah', '<p id="yes">Hyeah</p>'
  shouldCompileTo 'p id="yes" class="no" Blork', '<p id="yes" class="no">Blork</p>'
  shouldCompileTo 'p id="yes" class="no" One <b>asd</b>!', '<p id="yes" class="no">One <b>asd</b>!</p>'

test "nesting", ->
  emblem =
  """
  p class="hello" data-foo="gnarly"
    span Yes
  """
  shouldCompileTo emblem, '<p class="hello" data-foo="gnarly"><span>Yes</span></p>'




suite "html nested"

test "basic", ->
  emblem =
  """
  p
    span Hello
    strong Hi
  div
    p Hooray
  """
  shouldCompileTo emblem, '<p><span>Hello</span><strong>Hi</strong></p><div><p>Hooray</p></div>'

test "empty nest", ->
  emblem =
  """
  p
    span
      strong
        i
  """
  shouldCompileTo emblem, '<p><span><strong><i></i></strong></span></p>'

test "empty nest w/ attribute shorthand", ->
  emblem =
  """
  p.woo
    span#yes
      strong.no.yes
        i
  """
  shouldCompileTo emblem, '<p class="woo"><span id="yes"><strong class="no yes"><i></i></strong></span></p>'


suite "mustache"

test "various one-liners", ->
  emblem =
  """
  = foo
  arf
  p = foo
  span.foo
  p data-foo="yes" = goo
  """
  shouldCompileTo emblem,
    { foo: "ASD", arf: "QWE", goo: "WER" },
    'ASDQWE<p>ASD</p><span class="foo"></span><p data-foo="yes">WER</p>'

test "double =='s un-escape", ->
  emblem =
  """
  == foo
  foo
  p == foo
  """
  shouldCompileTo emblem,
    { foo: '<span>123</span>' },
    '<span>123</span>&lt;span&gt;123&lt;/span&gt;<p><span>123</span></p>'

test "nested combo syntax", ->
  emblem =
  """
  ul = each items
    = foo
  """
  # TODO LEFT OFF HEREREERER
  shouldCompileTo emblem,
    { foo: '<span>123</span>' },
    '<span>123</span>&lt;span&gt;123&lt;/span&gt;<p><span>123</span></p>'


