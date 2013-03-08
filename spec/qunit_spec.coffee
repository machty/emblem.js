
Ember = @Emblem

unless Emblem?
  # Setup for Node package testing
  Handlebars = require('handlebars')
  EmberHandlebars = require('./support/ember-template-compiler.js').emberHandlebars
  Emblem = require('../lib/emblem')

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
      Emblem.compile(Handlebars, template, options)
      #templateSpec = Emblem.precompile(Handlebars, template, options)
      #Handlebars.template eval "(#{templateSpec})"  
      #compileWithPartial: (template, options) ->

precompileEmber = (emblem) ->
  Emblem.precompile(EmberHandlebars, emblem).toString()

shouldEmberPrecompileToHelper = (emblem, helper = 'bindAttr') ->
  result = precompileEmber emblem
  ok result.match "helpers.#{helper}"
  result

shouldCompileToString = (string, hashOrArray, expected) ->

  if hashOrArray.constructor == String
    shouldCompileToWithPartials(string, {}, false, hashOrArray, null, true)
  else
    shouldCompileToWithPartials(string, hashOrArray, false, expected, null, true)

shouldCompileTo = (string, hashOrArray, expected, message) ->
  if hashOrArray.constructor == String
    shouldCompileToWithPartials(string, {}, false, hashOrArray, message)
  else
    shouldCompileToWithPartials(string, hashOrArray, false, expected, message)

shouldCompileToWithPartials = (string, hashOrArray, partials, expected, message, strings) ->
  options = null
  if strings
    options = {}
    options.stringParams = true

  result = compileWithPartials(string, hashOrArray, partials, options)
  equal(expected, result, "'" + expected + "' should === '" + result + "': " + message)

compileWithPartials = (string, hashOrArray, partials, options = {}) ->
  template = CompilerContext.compile(string, options)
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

shouldThrow = (fn, exMessage) ->
  caught = false

  try 
    fn()
  catch e
    caught = true
    if exMessage
      ok e.message.match(exMessage), "exception message matched"

  ok(caught, "an exception was thrown")

Handlebars.registerHelper 'echo', (param) ->
  "ECHO #{param}"

suite "html one-liners"

test "element only", ->
  shouldCompileTo "p", "<p></p>"

test "with text", ->
  shouldCompileTo "p Hello", "<p>Hello</p>"

test "with more complex text", ->
  shouldCompileTo "p Hello, how's it going with you today?", "<p>Hello, how's it going with you today?</p>"

test "with trailing space", ->
  shouldCompileTo "p Hello   ", "<p>Hello   </p>"

suite "html multi-lines"

test "two lines", ->
  emblem =
  """
  p This is
    pretty cool.
  """
  shouldCompileTo emblem, "<p>This is pretty cool.</p>"

test "three lines", ->
  emblem =
  """
  p This is
    pretty damn
    cool.
  """
  shouldCompileTo emblem, "<p>This is pretty damn cool.</p>"

test "three lines w/ embedded html", ->
  emblem =
  """
  p This is
    pretty <span>damn</span>
    cool.
  """
  shouldCompileTo emblem, "<p>This is pretty <span>damn</span> cool.</p>"

test "indentation doesn't need to match starting inline content's", ->
  emblem =
  """
  span Hello,
    How are you?
  """
  shouldCompileTo emblem, "<span>Hello, How are you?</span>"

test "indentation may vary between parent/child, must be consistent within inline-block", ->
  emblem =
  """
  div
        span Hello,
             How are you?
             Excellent.
        p asd
  """
  shouldCompileTo emblem, "<div><span>Hello, How are you? Excellent.</span><p>asd</p></div>"

  emblem =
  """
  div
    span Hello,
         How are you?
       Excellent.
  """
  shouldThrow -> CompilerContext.compile emblem

test "indentation may vary between parent/child, must be consistent within inline-block pt 2", ->
  emblem =
  """
  div
    span Hello,
         How are you?
         Excellent.
  """
  shouldCompileTo emblem, "<div><span>Hello, How are you? Excellent.</span></div>"


test "w/ mustaches", ->
  emblem =
  """
  div
    span Hello,
         {{foo}} are you?
         Excellent.
  """
  shouldCompileTo emblem, { foo: "YEAH" }, "<div><span>Hello, YEAH are you? Excellent.</span></div>"


test "with followup", ->
  emblem =
  """
  p This is
    pretty cool.
  p Hello.
  """
  shouldCompileTo emblem, "<p>This is pretty cool.</p><p>Hello.</p>"



suite '#{} syntax'
  
test 'acts like {{}}', ->
  emblem =
  '''
  span Yo #{foo}, I herd.
  '''
  shouldCompileTo emblem, 
    { foo: '<span>123</span>' },
    "<span>Yo &lt;span&gt;123&lt;/span&gt;, I herd.</span>"
 
test 'can start inline content', ->
  emblem =
  '''
  span #{foo}, I herd.
  '''
  shouldCompileTo emblem, { foo: "dawg" }, "<span>dawg, I herd.</span>"
 
test 'can end inline content', ->
  emblem =
  '''
  span I herd #{foo}
  '''
  shouldCompileTo emblem, { foo: "dawg" }, "<span>I herd dawg</span>"

test "doesn't screw up parsing when # used in text nodes", ->
  emblem =
  '''
  span OMG #YOLO
  '''
  shouldCompileTo emblem, "<span>OMG #YOLO</span>"

test "# can be only thing on line", ->
  emblem =
  '''
  span #
  '''
  shouldCompileTo emblem, "<span>#</span>"

### TODO: this
test "can be escaped", ->
  emblem =
  '''
  span #\\{yes}
  '''
  shouldCompileTo emblem, '<span>#{yes}</span>'
###

runTextLineSuite = (ch) ->

  sct = (emblem, obj, expected) ->
    unless expected?
      expected = obj
      obj = {}

    if ch == '|'
      expected = expected.replace /\n/g, ""
    emblem = emblem.replace /_/g, ch

    shouldCompileTo emblem, obj, expected


  suite "text lines starting with '#{ch}'"

  test "basic", -> sct "_ What what", "What what\n"
  test "with html", -> 
    sct '_ What <span id="woot" data-t="oof" class="f">what</span>!',
                      'What <span id="woot" data-t="oof" class="f">what</span>!\n'

  test "multiline", ->
    emblem =
    """
    _ Blork
      Snork
    """
    sct emblem, "Blork\nSnork\n"

  test "triple multiline", ->
    emblem =
    """
    _ Blork
      Snork
      Bork
    """
    sct emblem, "Blork\nSnork\nBork\n"

  test "quadruple multiline", ->
    emblem =
    """
    _ Blork
      Snork
      Bork
      Fork
    """
    sct emblem, "Blork\nSnork\nBork\nFork\n"

  test "multiline w/ trailing whitespace", ->
    emblem =
    """
    _ Blork 
      Snork
    """
    sct emblem, "Blork \nSnork\n"

  test "secondline", ->
    emblem =
    """
    _
      Good
    """
    sct emblem, "Good\n"

  test "secondline multiline", ->
    emblem =
    """
    _ 
      Good
      Bork
    """
    sct emblem, "Good\nBork\n"

  test "with a mustache", ->
    emblem =
    """
    _ Bork {{foo}}!
    """
    sct emblem, 
      { foo: "YEAH" },
      'Bork YEAH!\n'

  test "with mustaches", ->
    emblem =
    """
    _ Bork {{foo}} {{{bar}}}!
    """
    sct emblem, 
      { foo: "YEAH", bar: "<span>NO</span>"},
      'Bork YEAH <span>NO</span>!\n'

  test "indented, then in a row", ->
    return "PENDING"
    emblem =
    """
    _ 
      Good
        riddance2
        dude
        gnar
        foo
    """
    sct emblem, "Good\n  riddance2\n  dude\n  gnar\n  foo\n"

  test "indented, then in a row, then indented", ->
    return "PENDING"
    emblem =
    """
    _ 
      Good
        riddance2
        dude
        gnar
          foo
          far
          faz
    """
    sct emblem, "Good \n  riddance2 \n  dude \n  gnar \n    foo \n    far \n    faz \n"



  test "uneven indentation megatest", ->
    return "PENDING"
    emblem =
    """
    _ 
      Good
        riddance
      dude
    """
    sct emblem, "Good\n  riddance\ndude\n"

    emblem =
    """
    _ 
      Good
       riddance3
        dude
    """
    sct emblem, "Good\n riddance3\n  dude\n"

    emblem =
    """
    _ Good
      riddance
       dude
    """
    sct emblem, "Good\nriddance\n dude\n"

  test "on each line", ->
    emblem =
    """
    pre
      _ This
      _   should
      _  hopefully
      _    work, and work well.
    """
    sct emblem, '<pre>This\n  should\n hopefully\n   work, and work well.\n</pre>'

  test "with blank", ->
    emblem =
    """
    pre
      _ This
      _   should
      _
      _  hopefully
      _    work, and work well.
    """
    sct emblem, '<pre>This\n  should\n\n hopefully\n   work, and work well.\n</pre>'


runTextLineSuite '|'
runTextLineSuite '`'

suite "text line starting with angle bracket"

test "can start with angle bracket html", ->
  emblem =
  """
  <span>Hello</span>
  """
  shouldCompileTo emblem, "<span>Hello</span>"

test "can start with angle bracket html and go to multiple lines", ->
  emblem =
  """
  <span>Hello dude, 
        what's up?</span>
  """
  shouldCompileTo emblem, "<span>Hello dude, what's up?</span>"

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

suite "comments"

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


test "mix and match with various indentation", ->
  emblem =
  """
  / A test
  p Hello
  
  span
    / This is gnarly
    p Yessir nope.

  / Nothin but comments
    so many comments.

  /
    p Should not show up
  """
  shouldCompileTo emblem, "<p>Hello</p><span><p>Yessir nope.</p></span>"

test "uneven indentation", ->
  emblem =
  """
  / nop
    nope
      nope
  """
  shouldCompileTo emblem, ""

test "uneven indentation 2", ->
  emblem =
  """
  / n
    no
      nop
    nope
  """
  shouldCompileTo emblem, ""

test "uneven indentation 3", ->
  emblem =
  """
  / n
    no
      nop
    nope
  """
  shouldCompileTo emblem, ""


test "empty first line", ->
  emblem =
  """
  / 
    nop
    nope
      nope
    no
  """
  shouldCompileTo emblem, ""

suite "indentation"

# This test used to make sure the emblem code threw, but now we
# support multi-line syntax.
test "it doesn't throw when indenting after a line with inline content", ->
  emblem =
  """
  p Hello
    p invalid
  """
  shouldCompileTo emblem, "<p>Hello p invalid</p>"

test "it throws on half dedent", ->
  emblem =
  """
  p
      span This is ok
    span This aint
  """
  shouldThrow -> CompilerContext.compile emblem

test "new indentation levels don't have to match parents'", ->
  emblem =
  """
  p 
    span
       div
        span yes
  """
  shouldCompileTo emblem, "<p><span><div><span>yes</span></div></span></p>"

suite "attribute shorthand"

test "id shorthand", ->
  shouldCompileTo "#woot", '<div id="woot"></div>'
  shouldCompileTo "span#woot", '<span id="woot"></span>'

test "class shorthand", ->
  shouldCompileTo ".woot", '<div class="woot"></div>'
  shouldCompileTo "span.woot", '<span class="woot"></span>'
  shouldCompileTo "span.woot.loot", '<span class="woot loot"></span>'

test "class can come first", ->
  shouldCompileTo ".woot#hello", '<div id="hello" class="woot"></div>'
  shouldCompileTo "span.woot#hello", '<span id="hello" class="woot"></span>'
  shouldCompileTo "span.woot.loot#hello", '<span id="hello" class="woot loot"></span>'
  shouldCompileTo "span.woot.loot#hello.boot", '<span id="hello" class="woot loot boot"></span>'

suite "full attributes - tags with content"

test "class only", ->
  shouldCompileTo 'p class="yes" Blork', '<p class="yes">Blork</p>'
test "id only", ->
  shouldCompileTo 'p id="yes" Hyeah', '<p id="yes">Hyeah</p>'
test "class and id", ->
  shouldCompileTo 'p id="yes" class="no" Blork', '<p id="yes" class="no">Blork</p>'
test "class and id and embedded html one-liner", ->
  shouldCompileTo 'p id="yes" class="no" One <b>asd</b>!', '<p id="yes" class="no">One <b>asd</b>!</p>'

test "nesting", ->
  emblem =
  """
  p class="hello" data-foo="gnarly"
    span Yes
  """
  shouldCompileTo emblem, '<p class="hello" data-foo="gnarly"><span>Yes</span></p>'

suite "full attributes - tags without content"

test "empty", ->
  shouldCompileTo 'p class=""', '<p class=""></p>'
test "class only", ->
  shouldCompileTo 'p class="yes"', '<p class="yes"></p>'
test "id only", ->
  shouldCompileTo 'p id="yes"', '<p id="yes"></p>'
test "class and id", ->
  shouldCompileTo 'p id="yes" class="no"', '<p id="yes" class="no"></p>'

suite "full attributes w/ mustaches"

test "with mustache", ->
  shouldCompileTo 'p class="foo {{yes}}"', {yes: "ALEX"}, '<p class="foo ALEX"></p>'
  shouldCompileTo 'p class="foo {{yes}}" Hello', {yes: "ALEX"}, '<p class="foo ALEX">Hello</p>'
  emblem =
  """
  p class="foo {{yes}}"
    | Hello
  """
  shouldCompileTo emblem, {yes: "ALEX"}, '<p class="foo ALEX">Hello</p>'

test "with mustache calling helper", ->
  shouldCompileTo 'p class="foo {{{echo "YES"}}}"', '<p class="foo ECHO YES"></p>'
  shouldCompileTo 'p class="foo #{echo "NO"} and {{{echo "YES"}}}" Hello', '<p class="foo ECHO NO and ECHO YES">Hello</p>'
  emblem =
  """
  p class="foo {{echo "BORF"}}"
    | Hello
  """
  shouldCompileTo emblem, '<p class="foo ECHO BORF">Hello</p>'
  

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


suite "simple mustache"

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
    li = foo
  """
  shouldCompileTo emblem,
    { items: [ { foo: "YEAH"}, { foo: "BOI" } ] },
    '<ul><li>YEAH</li><li>BOI</li></ul>'

suite "mustache helpers"

Handlebars.registerHelper 'frank', ->
  options = arguments[arguments.length - 1]
  "WOO: #{options.hash.text} #{options.hash.text2}"

Handlebars.registerHelper 'sally', ->
  options = arguments[arguments.length - 1]
  params = Array::slice.call arguments, 0, -1
  param = params[0] || 'none'
  if options.fn
    content = options.fn @ 
    new Handlebars.SafeString """<sally class="#{param}">#{content}</sally>"""
  else
    content = param
    new Handlebars.SafeString """<sally class="#{param}">#{content}</sally>"""

test "basic", -> shouldCompileTo 'echo foo', {foo: "YES"}, 'ECHO YES'

test "hashed parameters should work", ->
  shouldCompileTo 'frank text="YES" text2="NO"', 'WOO: YES NO'

test "nesting", ->
  emblem =
  """
  sally
    p Hello
  """
  shouldCompileTo emblem, '<sally class="none"><p>Hello</p></sally>'

test "recursive nesting", ->
  emblem =
  """
  sally
    sally
      p Hello
  """
  shouldCompileTo emblem, '<sally class="none"><sally class="none"><p>Hello</p></sally></sally>'

test "recursive nesting pt 2", ->
  emblem =
  """
  sally
    sally thing
      p Hello
  """
  shouldCompileTo emblem, { thing: "woot" }, '<sally class="none"><sally class="woot"><p>Hello</p></sally></sally>'


Handlebars.registerHelper 'view', (param, a, b, c) ->
  options = arguments[arguments.length - 1]
  content = param
  content = options.fn @ if options.fn
  hashString = ""
  for own k,v of options.hash
    hashString += " #{k}=#{v}"
  hashString = " nohash" unless hashString

  new Handlebars.SafeString """<#{param}#{hashString}>#{content}</#{param}>"""

suite "capitalized line-starter"

test "should invoke `view` helper by default", ->
  emblem =
  """
  SomeView
  """
  shouldEmberPrecompileToHelper emblem, 'view'
  #shouldCompileToString emblem, '<SomeView nohash>SomeView</SomeView>'

test "should not invoke `view` helper for vanilla HB", ->
  emblem =
  """
  SomeView
  """
  shouldCompileToString emblem, {SomeView: "ALEX"}, 'ALEX'

test "should support block mode", ->
  emblem =
  """
  SomeView
    p View content
  """
  #shouldCompileToString emblem, '<SomeView nohash><p>View content</p></SomeView>'
  shouldEmberPrecompileToHelper emblem, 'view'

test "should not kick in if preceded by equal sign", ->
  emblem =
  """
  = SomeView
  """
  shouldCompileTo emblem, { SomeView: 'erp' }, 'erp'

test "should not kick in explicit {{mustache}}", ->
  emblem =
  """
  p Yeah {{SomeView}}
  """
  shouldCompileTo emblem, { SomeView: 'erp' }, '<p>Yeah erp</p>'


# TODO test overriding the default helper name (instead of always "view")


suite "bang syntax defaults to `unbound` helper syntax"

Handlebars.registerHelper 'unbound', ->
  options = arguments[arguments.length - 1]
  params = Array::slice.call arguments, 0, -1
  stringedParams = params.join(' ')
  content = if options.fn then options.fn @ else stringedParams
  new Handlebars.SafeString """<unbound class="#{stringedParams}">#{content}</unbound>"""

test "bang helper defaults to `unbound` invocation", ->
  emblem =
  """
  foo! Yar
  = foo!
  """
  shouldCompileToString emblem, '<unbound class="foo Yar">foo Yar</unbound><unbound class="foo">foo</unbound>'

test "bang helper works with blocks", ->
  emblem =
  """
  hey! you suck
    = foo!
  """
  shouldCompileToString emblem, '<unbound class="hey you suck"><unbound class="foo">foo</unbound></unbound>'


suite "question mark syntax defaults to `if` helper syntax"

test "? helper defaults to `if` invocation", ->
  emblem =
  """
  foo?
    p Yeah
  """
  shouldCompileTo emblem, { foo: true }, '<p>Yeah</p>'


test "else works", ->
  emblem =
  """
  foo?
    p Yeah
  else
    p No
  """
  shouldCompileTo emblem, { foo: false }, '<p>No</p>'


test "compound", ->
  emblem =
  """
  p = foo? 
    | Hooray
  else
    | No
  p = bar? 
    | Hooray
  else
    | No
  """
  shouldCompileTo emblem, { foo: true, bar: false }, '<p>Hooray</p><p>No</p>'


test "compound", ->
  emblem =
  """
  p = foo? 
    bar
  else
    baz
  """
  shouldCompileTo emblem, { foo: true, bar: "borf", baz: "narsty" }, '<p>borf</p>'

suite "conditionals"

test "simple if statement", ->
  emblem =
  """
  if foo
    | Foo
  if bar
    | Bar
  """
  shouldCompileTo emblem, {foo: true, bar: false}, 'Foo'

test "if else ", ->
  emblem =
  """
  if foo
    | Foo
    if bar
      | Bar
    else
      | Woot
  else
    | WRONG
  if bar
    | WRONG
  else
    | Hooray
  """
  shouldCompileTo emblem, {foo: true, bar: false}, 'FooWootHooray'

test "unless", ->
  emblem =
  """
  unless bar
    | Foo
    unless foo
      | Bar
    else
      | Woot
  else
    | WRONG
  unless foo
    | WRONG
  else
    | Hooray
  """
  shouldCompileTo emblem, {foo: true, bar: false}, 'FooWootHooray'

bindAttrHelper = ->
  options = arguments[arguments.length - 1]
  params = Array::slice.call arguments, 0, -1
  bindingString = ""
  for own k,v of options.hash
    bindingString += " #{k} to #{v}"
  bindingString = " narf" unless bindingString
  param = params[0] || 'none'
  "bindAttr#{bindingString}"

Handlebars.registerHelper 'bindAttr', bindAttrHelper
EmberHandlebars.registerHelper 'bindAttr', bindAttrHelper

suite "bindAttr behavior for unquoted attribute values"

test "basic", ->
  emblem = 'p class=foo'
  shouldCompileTo emblem, {foo:"YEAH"}, '<p class="YEAH"></p>'
  shouldEmberPrecompileToHelper emblem

test "basic w/ underscore", ->
  emblem = 'p class=foo_urns'
  shouldCompileTo emblem, {foo_urns: "YEAH"}, '<p class="YEAH"></p>'
  shouldEmberPrecompileToHelper emblem

test "multiple", ->
  shouldCompileTo 'p class=foo id="yup" data-thinger=yeah Hooray', { foo: "FOO", yeah: "YEAH" },
                  '<p class="FOO" id="yup" data-thinger="YEAH">Hooray</p>'

test "class bindAttr special syntax", ->
  emblem = 'p class=foo:bar:baz'
  shouldEmberPrecompileToHelper emblem
  shouldThrow (-> CompilerContext.compile emblem)

test "class bindAttr braced syntax w/ underscores and dashes", ->
  shouldEmberPrecompileToHelper 'p class={f-oo:bar :b_az}'
  shouldEmberPrecompileToHelper 'p class={ f-oo:bar :b_az }'
  shouldEmberPrecompileToHelper 'p class={ f-oo:bar :b_az } Hello'
  emblem = 
  """
  .input-prepend class={ filterOn:input-append }
    span.add-on
  """
  shouldEmberPrecompileToHelper emblem

test "exclamation modifier (vanilla)", ->
  emblem = 'p class=foo!'
  # exclamation is no-op in vanilla HB
  shouldCompileTo emblem, {foo:"YEAH"}, '<p class="YEAH"></p>'

test "exclamation modifier (ember)", ->
  emblem = 'p class=foo!'

  result = precompileEmber emblem

  ok result.match /p class/
  ok result.match /helpers\.unbound.*foo/


suite "in-tag explicit mustache"

Handlebars.registerHelper 'inTagHelper', (p) ->
  return p;

test "single", ->
  shouldCompileTo 'p{inTagHelper foo}', {foo: "ALEX"}, '<p ALEX></p>'

test "double", ->
  shouldCompileTo 'p{inTagHelper foo}', {foo: "ALEX"}, '<p ALEX></p>'

test "triple", ->
  shouldCompileTo 'p{inTagHelper foo}', {foo: "ALEX"}, '<p ALEX></p>'

Handlebars.registerHelper 'insertClass', (p) ->
  return 'class="' + p + '"'

test "with singlestache", ->
  shouldCompileTo 'p{insertClass foo} Hello', {foo: "yar"}, '<p class=&quot;yar&quot;>Hello</p>'

test "singlestache can be used in text nodes", ->
  shouldCompileTo 'p Hello {dork}', '<p>Hello {dork}</p>'

test "with doublestache", ->
  shouldCompileTo 'p{{insertClass foo}} Hello', {foo: "yar"}, '<p class=&quot;yar&quot;>Hello</p>'

test "with triplestache", ->
  shouldCompileTo 'p{{{insertClass foo}}} Hello', {foo: "yar"}, '<p class="yar">Hello</p>'

test "multiple", ->
  shouldCompileTo 'p{{{insertClass foo}}}{{{insertClass boo}}} Hello', 
                  {foo: "yar", boo: "nar"}, 
                  '<p class="yar" class="nar">Hello</p>'


test "with nesting", ->
  emblem =
  """
  p{{bindAttr class="foo"}}
    span Hello
  """
  shouldCompileTo emblem, {foo: "yar"}, 
    '<p bindAttr class to foo><span>Hello</span></p>'

suite "actions"

Handlebars.registerHelper 'action', ->
  options = arguments[arguments.length - 1]
  params = Array::slice.call arguments, 0, -1

  hashString = ""
  paramsString = params.join('|')

  # TODO: bad because it relies on hash ordering?
  # is this guaranteed? guess it doesn't rreeeeeally
  # matter since order's not being tested.
  for own k,v of options.hash
    hashString += " #{k}=#{v}"
  hashString = " nohash" unless hashString
  "action #{paramsString}#{hashString}"


test "basic (click)", ->
  emblem =
  """
  button click="submitComment" Submit Comment
  """
  shouldCompileToString emblem, '<button action submitComment on=click>Submit Comment</button>'

test "nested (mouseEnter)", ->
  emblem =
  """
  a mouseEnter='submitComment target="view"'
    | Submit Comment
  """
  shouldCompileToString emblem, '<a action submitComment target=view on=mouseEnter>Submit Comment</a>'

test "nested (mouseEnter, doublequoted)", ->
  emblem =
  """
  a mouseEnter="submitComment target='view'"
    | Submit Comment
  """
  shouldCompileToString emblem, '<a action submitComment target=view on=mouseEnter>Submit Comment</a>'

test "manual", ->
  emblem =
  """
  a{action submitComment target="view"} Submit Comment
  """
  shouldCompileToString emblem, '<a action submitComment target=view>Submit Comment</a>'

test "manual nested", ->
  emblem =
  """
  a{action submitComment target="view"}
    p Submit Comment
  """
  shouldCompileToString emblem, '<a action submitComment target=view><p>Submit Comment</p></a>'

suite "haml style"

test "basic", ->
  emblem =
  """
  %borf
  """
  shouldCompileToString emblem, '<borf></borf>'

test "nested", ->
  emblem =
  """
  %borf
      %sporf Hello
  """
  shouldCompileToString emblem, '<borf><sporf>Hello</sporf></borf>'

test "capitalized", ->
  emblem =
  """
  %Alex alex
  %Alex
    %Woot
  """
  shouldCompileToString emblem, '<Alex>alex</Alex><Alex><Woot></Woot></Alex>'

test "funky chars", ->
  emblem =
  """
  %borf:narf
  %borf:narf Hello, {{foo}}.
  %alex = foo
  """
  shouldCompileToString emblem, 
    { foo: "Alex" }, 
    '<borf:narf></borf:narf><borf:narf>Hello, Alex.</borf:narf><alex>Alex</alex>'

suite "line-based errors"

test "line number is provided for pegjs error", ->
  emblem =
  """
  p Hello
  p Hello {{narf}
  """
  shouldThrow (-> CompilerContext.compile emblem), "line 2"

# https://github.com/machty/emblem.js/issues/6
test "single quote test", ->
  emblem =
  """
  button click='p' Frank
        
  / form s='d target="App"'
    label I'm a label!
  """
  shouldCompileToString emblem, '<button action p on=click>Frank</button>'

test "double quote test", ->
  emblem =
  """
  button click="p" Frank
        
  / form s='d target="App"'
    label I'm a label!
  """
  shouldCompileToString emblem, '<button action p on=click>Frank</button>'

test "no quote test", ->
  emblem =
  """
  button click=p Frank
        
  / form s='d target="App"'
    label I'm a label!
  """
  shouldCompileToString emblem, '<button action p on=click>Frank</button>'

suite "mustache DOM attribute shorthand"

test "tagName w/o space", ->
  emblem =
  """
  App.FunView%span
  """
  result = precompileEmber emblem
  ok result.match /helpers\.view/
  ok result.match /App\.FunView/
  ok result.match /tagName.*span/

test "tagName w/ space", ->
  emblem =
  """
  App.FunView %span
  """
  result = precompileEmber emblem
  ok result.match /helpers\.view/
  ok result.match /App\.FunView/
  ok result.match /tagName.*span/

test "tagName block", ->
  emblem =
  """
  view App.FunView%span
    p Hello
  """
  shouldCompileToString emblem, '<App.FunView tagName=span><p>Hello</p></App.FunView>'

test "class w/ space (needs space)", ->
  emblem =
  """
  App.FunView .bork
  """
  result = precompileEmber emblem
  ok result.match /helpers\.view/
  ok result.match /App\.FunView/
  ok result.match /class.*bork/

test "multiple classes", ->
  emblem =
  """
  App.FunView .bork.snork
  """
  result = precompileEmber emblem
  ok result.match /helpers\.view/
  ok result.match /App\.FunView/
  ok result.match /class.*bork.*snork/

test "elementId", ->
  emblem =
  """
  App.FunView#ohno
  """
  result = precompileEmber emblem
  ok result.match /helpers\.view/
  ok result.match /App\.FunView/
  ok result.match /elementId.*ohno/

test "mixed w/ hash`", ->
  emblem =
  """
  App.FunView .bork.snork funbags="yeah"
  """
  result = precompileEmber emblem
  ok result.match /helpers\.view/
  ok result.match /App\.FunView/
  ok result.match /class.*bork.*snork/
  ok result.match /hash/
  ok result.match /funbags/
  ok result.match /yeah/

test "mixture of all`", ->
  emblem =
  """
  App.FunView%alex#hell.bork.snork funbags="yeah"
  """
  result = precompileEmber emblem
  ok result.match /helpers\.view/
  ok result.match /App\.FunView/
  ok result.match /tagName.*alex/
  ok result.match /elementId.*hell/
  ok result.match /class.*bork.*snork/
  ok result.match /hash/
  ok result.match /funbags/
  ok result.match /yeah/

suite "self-closing html tags"

test "br", ->
  emblem =
  """
  br
  """
  shouldCompileToString emblem, '<br />'

test "br paragraph example", ->
  emblem =
  """
  p
    | LOL!
    br
    | BORF!
  """
  shouldCompileToString emblem, '<p>LOL!<br />BORF!</p>'

test "input", ->
  emblem =
  """
  input type="text"
  """
  shouldCompileToString emblem, '<input type="text" />'

suite "ember."

test "should precompile with EmberHandlebars", ->
  emblem =
  """
  input type="text"
  """
  result = Emblem.precompile(EmberHandlebars, 'p Hello').toString()
  ok result.match '<p>Hello</p>'

suite "old school handlebars"

test "array", ->
  emblem =
  '''
  goodbyes
    | #{text}! 
  | cruel #{world}!
  '''
  hash = {goodbyes: [{text: "goodbye"}, {text: "Goodbye"}, {text: "GOODBYE"}], world: "world"}
  shouldCompileToString emblem, hash, "goodbye! Goodbye! GOODBYE! cruel world!"

  hash = {goodbyes: [], world: "world"}
  shouldCompileToString emblem, hash, "cruel world!"


Handlebars.registerPartial('hbPartial', '<a href="/people/{{id}}">{{name}}</a>')

test "calling handlebars partial", ->
  emblem =
  '''
  > hbPartial
  | Hello #{> hbPartial}
  '''
  shouldCompileToString emblem, 
    { id: 666, name: "Death" }, 
    '<a href="/people/666">Death</a>Hello <a href="/people/666">Death</a>'

Emblem.registerPartial(Handlebars, 'emblemPartial', 'a href="/people/{{id}}" = name')
Emblem.registerPartial(Handlebars, 'emblemPartialB', 'p Grr')
Emblem.registerPartial(Handlebars, 'emblemPartialC', 'p = a')

test "calling emblem partial", ->
  emblem =
  """
  > emblemPartial
  """
  shouldCompileToString emblem, { id: 666, name: "Death" }, '<a href="/people/666">Death</a>'

test "calling emblem partial with context", ->
  emblem =
  """
  > emblemPartialC foo
  """
  shouldCompileToString emblem, { foo: { a: "YES" } }, '<p>YES</p>'

test "partials in mustaches", ->
  emblem =
  """
  | Hello, {{> emblemPartialC foo}}{{>emblemPartialB}}{{>emblemPartialB }}
  """
  shouldCompileToString emblem, { foo: { a: "YES" } }, 'Hello, <p>YES</p><p>Grr</p><p>Grr</p>'

test "block as #each", ->
  emblem =
  '''
  thangs
    p Woot #{yeah}
  '''
  shouldCompileToString emblem, { thangs: [{yeah: 123}, {yeah:456}] }, '<p>Woot 123</p><p>Woot 456</p>'

###
test "partial in block", ->
  emblem =
  """
  ul = people
    > link
  """
  data = 
    people: [
      { "name": "Alan", "id": 1 }
      { "name": "Yehuda", "id": 2 }
    ]
  shouldCompileToString emblem, data, '<ul><a href="/people/1">Alan</a><a href="/people/2">Yehuda</a><ul>'
###

suite "inline block helper"

test "text only", ->
  emblem =
  """
  view SomeView | Hello
  """
  shouldCompileToString emblem, '<SomeView nohash>Hello</SomeView>'

test "multiline", ->
  emblem =
  """
  view SomeView | Hello, 
    How are you? 
    Sup?
  """
  shouldCompileToString emblem, '<SomeView nohash>Hello, How are you? Sup?</SomeView>'

test "more complicated", ->
  emblem =
  """
  view SomeView borf="yes" | Hello, 
    How are you? 
    Sup?
  """
  shouldCompileToString emblem, '<SomeView borf=yes>Hello, How are you? Sup?</SomeView>'

suite "copy paste html"

test "indented", ->
  emblem =
  """
  <p>
    <span>This be some text</span>
    <title>Basic HTML Sample Page</title>
  </p>
  """
  shouldCompileToString emblem, '<p><span>This be some text</span><title>Basic HTML Sample Page</title></p>'

test "flatlina", ->
  emblem =
  """
  <p>
  <span>This be some text</span>
  <title>Basic HTML Sample Page</title>
  </p>
  """
  shouldCompileToString emblem, '<p><span>This be some text</span><title>Basic HTML Sample Page</title></p>'

test "bigass", ->
  return "PENDING"
  emblem =
  """
  <div class="content">
    <p>
      We design and develop ambitious web and mobile applications, 
    </p>
    <p>
      A more official portfolio page is on its way, but in the meantime, 
      check out
    </p>
  </div>
  """
  expected = '<div class="content"><p>  We design and develop ambitious web and mobile applications, </p><p>  A more official portfolio page is on its way, but in the meantime, check out</p></div>'
  shouldCompileToString emblem, expected

suite "base indent / predent"

test "predent", ->
  emblem = "        \n"
  s = 
  """
  pre
    ` This
    `   should
    `  hopefully
    `    work, and work well.

  """
  emblem += s
  shouldCompileToString emblem, '<pre>This\n  should\n hopefully\n   work, and work well.\n</pre>'

test "mixture", ->
  emblem =  "        \n"
  emblem += "  p Hello\n"
  emblem += "  p\n"
  emblem += "    | Woot\n"
  emblem += "  span yes\n"
  shouldCompileToString emblem, '<p>Hello</p><p>Woot</p><span>yes</span>'

test "mixture w/o opening blank", ->
  emblem = "  p Hello\n"
  emblem += "  p\n"
  emblem += "    | Woot\n"
  emblem += "  span yes\n"
  shouldCompileToString emblem, '<p>Hello</p><p>Woot</p><span>yes</span>'

test "w/ blank lines", ->
  emblem = "  p Hello\n"
  emblem += "  p\n"
  emblem += "\n"
  emblem += "    | Woot\n"
  emblem += "\n"
  emblem += "  span yes\n"
  shouldCompileToString emblem, '<p>Hello</p><p>Woot</p><span>yes</span>'

test "w/ blank whitespaced lines", ->
  emblem =  "  p Hello\n"
  emblem += "  p\n"
  emblem += "\n"
  emblem += "    | Woot\n"
  emblem += "        \n"
  emblem += "       \n"
  emblem += "         \n"
  emblem += "\n"
  emblem += "  span yes\n"
  emblem += "\n"
  emblem += "  sally\n"
  emblem += "\n"
  emblem += "         \n"
  emblem += "    | Woot\n"
  shouldCompileToString emblem, '<p>Hello</p><p>Woot</p><span>yes</span><sally class="none">Woot</sally>'

suite "EOL Whitespace"

test "shouldn't be necessary to insert a space", ->
  emblem =
  """
  p Hello,
    How are you?
  p I'm fine, thank you.
  """
  shouldCompileToString emblem, "<p>Hello, How are you?</p><p>I'm fine, thank you.</p>"


suite "misc."

test "end with indent", ->
  return "PENDING"
  emblem =
  """
  div
    p
      span Butts
        em fpokasd
        iunw
          paosdk
  """
  shouldCompileToString emblem, '<div><p><span>Buttsem fpokasdiunw  paosdk</span></p></div>'

test "capitalized view helper should not kick in if suffix modifiers present", ->
  emblem =
  """
  Foo!
  """
  shouldCompileToString emblem, '<unbound class="Foo">Foo</unbound>'

test "GH-26: no need for space before equal sign", ->
  emblem =
  """
  span= foo
  """
  shouldCompileToString emblem, {foo: "YEAH"}, '<span>YEAH</span>'

  emblem =
  """
  span.foo= foo
  """
  shouldCompileToString emblem, {foo: "YEAH"}, '<span class="foo">YEAH</span>'

  emblem =
  """
  span#hooray.foo= foo
  """
  shouldCompileToString emblem, {foo: "YEAH"}, '<span id="hooray" class="foo">YEAH</span>'

  emblem =
  """
  #hooray= foo
  """
  shouldCompileToString emblem, {foo: "YEAH"}, '<div id="hooray">YEAH</div>'

  emblem =
  """
  .hooray= foo
  """
  shouldCompileToString emblem, {foo: "YEAH"}, '<div class="hooray">YEAH</div>'





test "Emblem has a VERSION defined", ->
  ok(Emblem.VERSION, "Emblem.VERSION should be defined")

