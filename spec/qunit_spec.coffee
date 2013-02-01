
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
  """
  shouldCompileTo emblem, "<div><span>Hello, How are you? Excellent.</span></div>"

  emblem =
  """
  div
    span Hello, 
         How are you? 
       Excellent.
  """
  shouldThrow -> CompilerContext.compile emblem

test "w/ mustaches", ->
  emblem =
  """
  div
    span Hello, 
         {{foo}} are you? 
         Excellent.
  """
  shouldCompileTo emblem, { foo: "YEAH" }, "<div><span>Hello, YEAH are you? Excellent.</span></div>"

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

test "with a mustache", ->
  emblem =
  """
  | Bork {{foo}}!
  """
  shouldCompileTo emblem, 
    { foo: "YEAH" },
    'Bork YEAH!'

test "with mustaches", ->
  emblem =
  """
  | Bork {{foo}} {{{bar}}}!
  """
  shouldCompileTo emblem, 
    { foo: "YEAH", bar: "<span>NO</span>"},
    'Bork YEAH <span>NO</span>!'

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


suite "indentation"

# This test used to make sure the emblem code threw, but now we
# support multi-line syntax.
test "it doesn't throw when indenting after a line with inline content", ->
  emblem =
  """
  p Hello
    p invalid
  """
  shouldCompileTo emblem, "<p>Hellop invalid</p>"

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


suite "full attributes - tags without content"

test "class only", ->
  shouldCompileTo 'p class="yes"', '<p class="yes"></p>'
test "id only", ->
  shouldCompileTo 'p id="yes"', '<p id="yes"></p>'
test "class and i", ->
  shouldCompileTo 'p id="yes" class="no"', '<p id="yes" class="no"></p>'
  
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

Handlebars.registerHelper 'ahelper', (param) ->
  "HELPED #{param}"

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

test "basic", -> shouldCompileTo 'ahelper foo', {foo: "YES"}, 'HELPED YES'

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
  #Handlebars.logger.log 9, ""
  new Handlebars.SafeString """<view class="#{param}">#{content}</view>"""

suite "capitalized line-starter"

test "should invoke `view` helper by default", ->
  emblem =
  """
  SomeView
  """
  shouldCompileToString emblem, '<view class="SomeView">SomeView</view>'

test "should support block mode", ->
  emblem =
  """
  SomeView
    p View content
  """
  shouldCompileToString emblem, '<view class="SomeView"><p>View content</p></view>'

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

Handlebars.registerHelper 'bindAttr', ->
  options = arguments[arguments.length - 1]
  params = Array::slice.call arguments, 0, -1
  bindingString = ""
  for own k,v of options.hash
    bindingString += " #{k} to #{v}"
  bindingString = " narf" unless bindingString
  param = params[0] || 'none'
  "bindAttr#{bindingString}"

suite "bindAttr behavior for unquoted attribute values"

test "basic", ->
  shouldCompileTo 'p class=foo', '<p bindAttr class to foo></p>'

test "multiple", ->
  shouldCompileTo 'p class=foo id="yup" data-thinger=yeah Hooray', 
                  '<p bindAttr class to foo id="yup" bindAttr data-thinger to yeah>Hooray</p>'

test "class bindAttr special syntax", ->
  shouldCompileTo 'p class=foo:bar:baz', '<p bindAttr class to foo:bar:baz></p>'

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

test "line number is provided for preprocessor error", ->
  emblem =
  """
  p
    span Hello
   nope
  """
  shouldThrow (-> CompilerContext.compile emblem), /line 3.*indentation/

suite "misc."

test "Emblem has a VERSION defined", ->
  ok(Emblem.VERSION, "Emblem.VERSION should be defined")

