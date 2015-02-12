`import Emblem from '../emblem'`

###
precompileEmber = (emblem) ->
  Emblem.precompile(Handlebars, emblem).toString()

shouldEmberPrecompileToHelper = (emblem, helper = 'bind-attr') ->
  result = precompileEmber emblem
  ok (result.match "helpers.#{helper}") or (result.match "helpers\\['#{helper}'\\]")
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
  equal(result, expected, "'" + result + "' should === '" + expected + "': " + message)

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


THE FOLLOWING TESTS HAVE NOT BEEN PORTED

runTextLineSuite = (ch) ->

  sct = (emblem, obj, expected) ->
    unless expected?
      expected = obj
      obj = {}

    unless ch == '`'
      expected = expected.replace /\n/g, ""

    # Replace tabs with optional trailing whitespace.
    if ch == "'"
      expected = expected.replace /\t/g, " "
    else
      expected = expected.replace /\t/g, ""

    emblem = emblem.replace /_/g, ch

    shouldCompileTo emblem, obj, expected


  QUnit.module "text lines starting with '#{ch}'"

  test "basic", -> sct "_ What what", "What what\n\t"
  test "with html", -> 
    sct '_ What <span id="woot" data-t="oof" class="f">what</span>!',
                      'What <span id="woot" data-t="oof" class="f">what</span>!\n\t'

  test "multiline", ->
    emblem =
    """
    _ Blork
      Snork
    """
    sct emblem, "Blork\nSnork\n\t"

  test "triple multiline", ->
    emblem =
    """
    _ Blork
      Snork
      Bork
    """
    sct emblem, "Blork\nSnork\nBork\n\t"

  test "quadruple multiline", ->
    emblem =
    """
    _ Blork
      Snork
      Bork
      Fork
    """
    sct emblem, "Blork\nSnork\nBork\nFork\n\t"

  test "multiline w/ trailing whitespace", ->
    emblem =
    """
    _ Blork 
      Snork
    """
    sct emblem, "Blork \nSnork\n\t"

  test "secondline", ->
    emblem =
    """
    _
      Good
    """
    sct emblem, "Good\n\t"

  test "secondline multiline", ->
    emblem =
    """
    _ 
      Good
      Bork
    """
    sct emblem, "Good\nBork\n\t"

  test "with a mustache", ->
    emblem =
    """
    _ Bork {{foo}}!
    """
    sct emblem, 
      { foo: "YEAH" },
      'Bork YEAH!\n\t'

  test "with mustaches", ->
    emblem =
    """
    _ Bork {{foo}} {{{bar}}}!
    """
    sct emblem, 
      { foo: "YEAH", bar: "<span>NO</span>"},
      'Bork YEAH <span>NO</span>!\n\t'

  test "indented, then in a row", ->
    expect(0)
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
    sct emblem, "Good\n  riddance2\n  dude\n  gnar\n  foo\n\t"

  test "indented, then in a row, then indented", ->
    expect(0)
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
    sct emblem, "Good \n  riddance2 \n  dude \n  gnar \n    foo \n    far \n    faz \n\t"



  test "uneven indentation megatest", ->
    expect(0)
    return "PENDING"
    emblem =
    """
    _ 
      Good
        riddance
      dude
    """
    sct emblem, "Good\n  riddance\ndude\n\t"

    emblem =
    """
    _ 
      Good
       riddance3
        dude
    """
    sct emblem, "Good\n riddance3\n  dude\n\t"

    emblem =
    """
    _ Good
      riddance
       dude
    """
    sct emblem, "Good\nriddance\n dude\n\t"

  test "on each line", ->
    emblem =
    """
    pre
      _ This
      _   should
      _  hopefully
      _    work, and work well.
    """
    sct emblem, '<pre>This\n\t  should\n\t hopefully\n\t   work, and work well.\n\t</pre>'

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
    sct emblem, '<pre>This\n\t  should\n\t\n\t hopefully\n\t   work, and work well.\n\t</pre>'


runTextLineSuite '|'
runTextLineSuite '`'
runTextLineSuite "'"

QUnit.module "comments"

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

test "on same line as html content", ->
  emblem = 
  """
  .container / This comment doesn't show up
    .row / Nor does this
      p Hello
  """
  shouldCompileTo emblem, '<div class="container"><div class="row"><p>Hello</p></div></div>'

test "on same line as mustache content", ->
  shouldCompileTo 'frank text="YES" text2="NO" / omg', 'WOO: YES NO'

test "on same line as colon syntax", ->
  emblem =
  """
  ul: li: span / omg
    | Hello
  """
  shouldCompileTo emblem, '<ul><li><span>Hello</span></li></ul>'

QUnit.module "indentation"

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

QUnit.module "whitespace fussiness"

test "spaces after html elements", ->
  shouldCompileTo "p \n  span asd", "<p><span>asd</span></p>"
  shouldCompileTo "p \nspan  \n\ndiv\nspan", "<p></p><span></span><div></div><span></span>"

test "spaces after mustaches", ->
  shouldCompileTo "each foo    \n  p \n  span", { foo: [1,2] }, "<p></p><span></span><p></p><span></span>"

QUnit.module "attribute shorthand"

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

QUnit.module "full attributes - tags with content"

test "class only", ->
  shouldCompileTo 'p class="yes" Blork', '<p class="yes">Blork</p>'
test "id only", ->
  shouldCompileTo 'p id="yes" Hyeah', '<p id="yes">Hyeah</p>'
test "class and id", ->
  shouldCompileTo 'p id="yes" class="no" Blork', '<p id="yes" class="no">Blork</p>'
test "class and id and embedded html one-liner", ->
  shouldCompileTo 'p id="yes" class="no" One <b>asd</b>!', '<p id="yes" class="no">One <b>asd</b>!</p>'

test "bracketed attributes", ->
  emblem =
  """
  p [
    id="yes"
    class="no" ]
    | Bracketed Attributes FTW!
  """
  shouldCompileTo emblem, '<p id="yes" class="no">Bracketed Attributes FTW!</p>'
test "bracketed text", ->
  emblem =
  """
  p [ Bracketed text is cool ]
  """
  shouldCompileTo emblem, '<p>[ Bracketed text is cool ]</p>'

test "bracketed text indented", ->
  emblem =
  """
  p
    | [ Bracketed text is cool ]
  """
  shouldCompileTo emblem, '<p>[ Bracketed text is cool ]</p>'

test "nesting", ->
  emblem =
  """
  p class="hello" data-foo="gnarly"
    span Yes
  """
  shouldCompileTo emblem, '<p class="hello" data-foo="gnarly"><span>Yes</span></p>'

QUnit.module "full attributes - mixed quotes"

test "single empty", ->
  shouldCompileTo "p class=''", '<p class=""></p>'
test "single full", ->
  shouldCompileTo "p class='woot yeah'", '<p class="woot yeah"></p>'
test "mixed", ->
  shouldCompileTo "p class='woot \"oof\" yeah'", '<p class="woot "oof" yeah"></p>'

QUnit.module "full attributes - tags without content"

test "empty", ->
  shouldCompileTo 'p class=""', '<p class=""></p>'
test "class only", ->
  shouldCompileTo 'p class="yes"', '<p class="yes"></p>'
test "id only", ->
  shouldCompileTo 'p id="yes"', '<p id="yes"></p>'
test "class and id", ->
  shouldCompileTo 'p id="yes" class="no"', '<p id="yes" class="no"></p>'

QUnit.module "full attributes w/ mustaches"

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

QUnit.module "boolean attributes"

test "static", ->
  shouldCompileTo 'p borf=true',  '<p borf></p>'
  shouldCompileTo 'p borf=true Woot', '<p borf>Woot</p>'
  shouldCompileTo 'p borf=false', '<p></p>'
  shouldCompileTo 'p borf=false Nork', '<p>Nork</p>'
  shouldCompileTo 'option selected=true Thingeroo', '<option selected>Thingeroo</option>'

#test "dynamic", ->
  ## TODO
  #shouldCompileTo 'p borf=foo',      { foo: true },  '<p borf></p>'
  #shouldCompileTo 'p borf=foo',      { foo: false }, '<p></p>'
  #shouldCompileTo 'p borf=foo Yeah', { foo: true },  '<p borf>Yeah</p>'
  #shouldCompileTo 'p borf=foo Naww', { foo: false }, '<p>Naww</p>'
  #shouldCompileTo 'p borf=foo Naww', { foo: null },  '<p>Naww</p>'
  #shouldCompileTo 'p borf=foo Naww', { foo: undefined }, '<p>Naww</p>'
  #shouldCompileTo 'p borf=foo Naww', { foo: 0 },     '<p borf="0">Naww</p>'
  
QUnit.module "html nested"

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


QUnit.module "simple mustache"

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

QUnit.module "mustache helpers"

Handlebars.registerHelper 'booltest', (options) ->
  hash = options.hash
  result = if hash.what == true
    "true"
  else if hash.what == false
    "false"
  else "neither"
  result

Handlebars.registerHelper 'hashtypetest', (options) ->
  hash = options.hash
  typeof hash.what

Handlebars.registerHelper 'typetest', (num, options) ->
  typeof num

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

Handlebars.registerHelper 'concatenator', ->
  options = arguments[arguments.length - 1]
  new Handlebars.SafeString ("'#{key}'='#{value}'" for key, value of options.hash).sort().join( " " )

test "negative integers should work", ->
  shouldCompileTo 'concatenator positive=100 negative=-100', "'negative'='-100' 'positive'='100'"

test "booleans", ->
  shouldCompileToString 'typetest true', 'boolean'
  shouldCompileToString 'typetest false', 'boolean'
  shouldCompileTo 'booltest what=false', 'false'
  shouldCompileTo 'booltest what=true',  'true'
  shouldCompileTo 'booltest what="false"',  'neither'
  shouldCompileTo 'booltest what="true"',  'neither'

test "integers", ->
  shouldCompileToString 'typetest 200', 'number'
  shouldCompileTo 'hashtypetest what=1', 'number'
  shouldCompileTo 'hashtypetest what=200', 'number'

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

test "bracketed nested statement", ->
  emblem =
  """
  sally [
    'foo'
    something="false" ]
    | Bracketed helper attrs!
  """
  shouldCompileTo emblem, '<sally class="foo">Bracketed helper attrs!</sally>'

test "bracketed nested block", ->
  emblem =
  """
  sally [
    'foo'
    something="false" ]
    p Bracketed helper attrs!
  """
  shouldCompileTo emblem, '<sally class="foo"><p>Bracketed helper attrs!</p></sally>'

Handlebars.registerHelper 'view', (param, a, b, c) ->
  options = arguments[arguments.length - 1]
  content = param
  content = options.fn @ if options.fn
  hashString = ""
  for own k,v of options.hash
    hashString += " #{k}=#{v}"
  hashString = " nohash" unless hashString

  new Handlebars.SafeString """<#{param}#{hashString}>#{content}</#{param}>"""

QUnit.module "capitalized line-starter"

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


QUnit.module "bang syntax defaults to `unbound` helper syntax"

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


QUnit.module "question mark syntax defaults to `if` helper syntax"

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

QUnit.module "conditionals"

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

test "else with preceding `=`", ->
  emblem =
  """
  = if foo
    p Yeah
  = else
    p No
  = if bar
    p Yeah!
  = else
    p No!
  =if bar
    p Yeah!
  =else
    p No!
  """
  shouldCompileTo emblem, {foo: true, bar: false}, '<p>Yeah</p><p>No!</p><p>No!</p>'


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

test "else followed by newline doesn't gobble else content", ->
  emblem =
  """
  if something
    p something
  else
  
    if nothing
      p nothing
    else
      p not nothing
  """
  shouldCompileTo emblem, {}, '<p>not nothing</p>'

QUnit.module "class shorthand and explicit declaration is coalesced"

test "when literal class is used", ->
  shouldCompileTo 'p.foo class="bar"', '<p class="foo bar"></p>'

test "when ember expression is used with variable", ->
  shouldCompileTo 'p.foo class=bar', {bar: 'baz'}, '<p bind-attr class to :foo bar></p>'

test "when ember expression is used with variable in braces", ->
  result = shouldEmberPrecompileToHelper 'p.foo class={ bar }'
  ok -1  != result.indexOf '\'class\': (":foo bar")'

test "when ember expression is used with constant in braces", ->
  result = shouldEmberPrecompileToHelper 'p.foo class={ :bar }'
  ok -1  != result.indexOf '\'class\': (":foo :bar")'

test "when ember expression is used with constant and variable in braces", ->
  result = shouldEmberPrecompileToHelper 'p.foo class={ :bar bar }'
  ok -1  != result.indexOf '\'class\': (":foo :bar bar")'

test "when ember expression is used with bind-attr", ->
  result = shouldEmberPrecompileToHelper 'p.foo{ bind-attr class="bar" }'
  ok -1  != result.indexOf '\'class\': (":foo bar")'
  
test "when ember expression is used with bind-attr and multiple attrs", ->
  result = shouldEmberPrecompileToHelper 'p.foo{ bind-attr something=bind class="bar" }'
  ok -1 != result.indexOf '\'class\': (":foo bar")'

test "only with bind-attr helper", ->
  result = shouldEmberPrecompileToHelper 'p.foo{ someHelper class="bar" }', 'someHelper'
  ok -1 != result.indexOf '\'class\': ("bar")'
  ok -1 != result.indexOf 'class=\\"foo\\"'

bindAttrHelper = ->
  options = arguments[arguments.length - 1]
  params = Array::slice.call arguments, 0, -1
  bindingString = ""
  for own k,v of options.hash
    bindingString += " #{k} to #{v}"
  bindingString = " narf" unless bindingString
  param = params[0] || 'none'
  "bind-attr#{bindingString}"

Handlebars.registerHelper 'bind-attr', bindAttrHelper

QUnit.module "bind-attr behavior for unquoted attribute values"

test "basic", ->
  emblem = 'p class=foo'
  shouldCompileTo emblem, {foo:"YEAH"}, '<p class="YEAH"></p>'
  shouldEmberPrecompileToHelper emblem

test "basic w/ underscore", ->
  emblem = 'p class=foo_urns'
  shouldCompileTo emblem, {foo_urns: "YEAH"}, '<p class="YEAH"></p>'
  shouldEmberPrecompileToHelper emblem

test "subproperties", ->
  emblem = 'p class=foo._death.woot'
  shouldCompileTo emblem, {foo: { _death: { woot: "YEAH" } }}, '<p class="YEAH"></p>'
  shouldEmberPrecompileToHelper emblem

test "multiple", ->
  shouldCompileTo 'p class=foo id="yup" data-thinger=yeah Hooray', { foo: "FOO", yeah: "YEAH" },
                  '<p class="FOO" id="yup" data-thinger="YEAH">Hooray</p>'

test "class bind-attr special syntax", ->
  emblem = 'p class=foo:bar:baz'
  shouldEmberPrecompileToHelper emblem
  shouldThrow (-> CompilerContext.compile emblem)

test "class bind-attr braced syntax w/ underscores and dashes", ->
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


QUnit.module "in-tag explicit mustache"

Handlebars.registerHelper 'inTagHelper', (p) ->
  return p

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
  p{{bind-attr class="foo"}}
    span Hello
  """
  shouldCompileTo emblem, {foo: "yar"}, 
    '<p bind-attr class to foo><span>Hello</span></p>'

QUnit.module "actions"

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

test "basic (click) followed by attr", ->
  emblem =
  """
  button click="submitComment" class="foo" Submit Comment
  """
  shouldCompileToString emblem, '<button action submitComment on=click class="foo">Submit Comment</button>'

  emblem =
  """
  button click="submitComment 'omg'" class="foo" Submit Comment
  """
  shouldCompileToString emblem, '<button action submitComment|omg on=click class="foo">Submit Comment</button>'

test "nested (mouseEnter)", ->
  emblem =
  """
  a mouseEnter='submitComment target="view"'
    | Submit Comment
  """
  shouldCompileToString emblem, '<a action submitComment on=mouseEnter target=view>Submit Comment</a>'

test "nested (mouseEnter, doublequoted)", ->
  emblem =
  """
  a mouseEnter="submitComment target='view'"
    | Submit Comment
  """
  shouldCompileToString emblem, '<a action submitComment on=mouseEnter target=view>Submit Comment</a>'

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

QUnit.module "haml style"

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

QUnit.module "line-based errors"

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

QUnit.module "mustache DOM attribute shorthand"

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

QUnit.module "self-closing html tags"

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

QUnit.module "ember."

test "should precompile with Handlebars", ->
  emblem =
  """
  input type="text"
  """
  result = Emblem.precompile(Handlebars, 'p Hello').toString()
  ok result.match '<p>Hello</p>'

QUnit.module "old school handlebars"

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
  shouldCompileToString '> emblemPartial', { id: 666, name: "Death" }, '<a href="/people/666">Death</a>'

test "calling emblem partial with context", ->
  shouldCompileToString '> emblemPartialC foo', { foo: { a: "YES" } }, '<p>YES</p>'

test "partials in mustaches", ->
  emblem =
  """
  | Hello, {{> emblemPartialC foo}}{{>emblemPartialB}}{{>emblemPartialB }}
  """
  shouldCompileToString emblem, { foo: { a: "YES" } }, 'Hello, <p>YES</p><p>Grr</p><p>Grr</p>'

test "handlebars dot-separated paths with segment-literal notation", ->
  emblem =
  '''
  p = articles.[3]
  '''
  shouldCompileTo emblem, { articles: ['zero', 'one', 'two', 'three']}, '<p>three</p>'

test "handlebars dot-separated paths with segment-literal notation, more nesting", ->
  emblem =
  '''
  p = articles.[3].[#comments].[0]
  '''
  shouldCompileTo emblem, { articles: [{}, {}, {}, {'#comments': ['bazinga']}]}, '<p>bazinga</p>'

test "../path as inMustacheParam recognized correctly as pathIdNode instead of classShorthand", ->
  Handlebars.registerHelper 'jumpToParent', (link) ->
    new Handlebars.SafeString "<a href='#{link}'>Jump to parent top</a>"
  emblem =
  '''
  each children
    jumpToParent ../parentLink
  '''
  shouldCompileTo emblem, {parentLink: '#anchor', children: [{}]}, '<a href=\'#anchor\'>Jump to parent top</a>'

test "block as #each", ->
  emblem =
  '''
  thangs
    p Woot #{yeah}
  '''
  shouldCompileToString emblem, { thangs: [{yeah: 123}, {yeah:456}] }, '<p>Woot 123</p><p>Woot 456</p>'

if supportsEachHelperDataKeywords

  QUnit.module "each block helper keywords prefixed by @"
  
  test "#each with @index", ->
    emblem =
    '''
    thangs
      p #{@index} Woot #{yeah}
    '''
    shouldCompileToString emblem, { thangs: [{yeah: 123}, {yeah:456}] }, '<p>0 Woot 123</p><p>1 Woot 456</p>'

  test "#each with @key", ->
    emblem =
    '''
    each thangs
      p #{@key}: #{this}
    '''
    shouldCompileTo emblem, { thangs: {'@key': 123, 'works!':456} }, '<p>@key: 123</p><p>works!: 456</p>'

  test "#each with @key, @index", ->
    emblem =
    '''
    each thangs
      p #{@index} #{@key}: #{this}
    '''
    shouldCompileTo emblem, { thangs: {'@key': 123, 'works!':456} }, '<p>0 @key: 123</p><p>1 works!: 456</p>'

  test "#each with @key, @first", ->
    emblem =
    '''
    each thangs
      if @first
        p First item
      else
        p #{@key}: #{this}
    '''
    shouldCompileTo emblem, { thangs: {'@key': 123, 'works!':456} }, '<p>First item</p><p>works!: 456</p>'

// test "partial in block", ->
//   emblem =
//   """
//   ul = people
//     > link
//   """
//   data = 
//     people: [
//       { "name": "Alan", "id": 1 }
//       { "name": "Yehuda", "id": 2 }
//     ]
//   shouldCompileToString emblem, data, '<ul><a href="/people/1">Alan</a><a href="/people/2">Yehuda</a><ul>'


#QUnit.module "helper hash"

#test "quoteless values get treated as bindings", ->
  #emblem =
  #"""
  #view SomeView a=b
    #| Yes
  #"""
  #shouldCompileToString emblem, '<SomeView aBinding=b>Yes</SomeView>'

#test "more complex", ->
  #emblem =
  #"""
  #view SomeView a=b foo=thing.gnar
  #"""
  #shouldCompileToString emblem, '<SomeView aBinding=b fooBinding=thing.gnar>SomeView</SomeView>'

QUnit.module "inline block helper"

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

QUnit.module "copy paste html"

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
  expect(0)
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

QUnit.module "`this` keyword"

test "basic", ->
  emblem = '''
  each foo
    p = this
    this
  '''
  shouldCompileTo emblem,
    { foo: [ "Alex", "Emily" ] },
    '<p>Alex</p>Alex<p>Emily</p>Emily'

QUnit.module "colon separator"

test "basic", ->
  emblem = 'each foo: p Hello, #{this}'
  shouldCompileTo emblem,
    { foo: [ "Alex", "Emily", "Nicole" ] },
    '<p>Hello, Alex</p><p>Hello, Emily</p><p>Hello, Nicole</p>'

test "html stack", ->
  emblem = '.container: .row: .span5: span Hello'
  shouldCompileToString emblem,
    '<div class="container"><div class="row"><div class="span5"><span>Hello</span></div></div></div>'

test "epic", ->
  emblem = '''
  .container: .row: .span5
    ul#list data-foo="yes": each foo: li
      span: this
  '''
  shouldCompileTo emblem, { foo: ["a","b"] },
    '<div class="container"><div class="row"><div class="span5"><ul id="list" data-foo="yes"><li><span>a</span></li><li><span>b</span></li></ul></div></div></div>'

test "html stack elements only", ->
  emblem = 'p: span: div: p: foo'
  shouldCompileToString emblem, { foo: "alex" },
    '<p><span><div><p>alex</p></div></span></p>'

test "mixed separators", ->
  emblem = '.fun = each foo: %nork = this'
  shouldCompileTo emblem,
    { foo: [ "Alex", "Emily", "Nicole" ] },
    '<div class="fun"><nork>Alex</nork><nork>Emily</nork><nork>Nicole</nork></div>'

test "mixed separators rewritten", ->
  emblem = '.fun: each foo: %nork: this'
  shouldCompileTo emblem,
    { foo: [ "Alex", "Emily", "Nicole" ] },
    '<div class="fun"><nork>Alex</nork><nork>Emily</nork><nork>Nicole</nork></div>'

test "with text terminator", ->
  emblem = '.fun: view SomeView | Hello'
  shouldCompileToString emblem, '<div class="fun"><SomeView nohash>Hello</SomeView></div>'

test "test from heartsentwined", ->
  shouldCompileTo 'li data-foo=bar: a', { bar: "abc" }, '<li data-foo="abc"><a></a></li>'
  shouldCompileTo "li data-foo='bar': a", '<li data-foo="bar"><a></a></li>'

test "mixture of colon and indentation", ->
  emblem = """
  li data-foo=bar: a
    baz
  """
  shouldCompileTo emblem, { bar: "abc", baz: "Hello" }, '<li data-foo="abc"><a>Hello</a></li>'

test "mixture of colon and indentation pt.2", ->
  emblem = """
  ul
    li data-foo=bar: a quux
    li data-foo='bar': a quux
    li data-foo=bar href='#': a quux
  """
  result = precompileEmber emblem
  ok(!result.match "a quux")

QUnit.module "base indent / predent"

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

QUnit.module "EOL Whitespace"

test "shouldn't be necessary to insert a space", ->
  emblem =
  """
  p Hello,
    How are you?
  p I'm fine, thank you.
  """
  shouldCompileToString emblem, "<p>Hello, How are you?</p><p>I'm fine, thank you.</p>"


QUnit.module "misc."

test "end with indent", ->
  expect(0)
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

test "numbers in shorthand", ->
  shouldCompileToString '#4a', '<div id="4a"></div>'
  shouldCompileToString '.4a', '<div class="4a"></div>'
  shouldCompileToString '.4', '<div class="4"></div>'
  shouldCompileToString '#4', '<div id="4"></div>'
  shouldCompileToString '%4', '<4></4>'
  shouldCompileToString '%4 ermagerd', '<4>ermagerd</4>'
  shouldCompileToString '%4#4.4 ermagerd', '<4 id="4" class="4">ermagerd</4>'

test "Emblem has a VERSION defined", ->
  ok(Emblem.VERSION, "Emblem.VERSION should be defined")

test "Windows line endings", ->
  emblem = ".navigation\r\n  p Hello\r\n#main\r\n  | hi"
  shouldCompileToString emblem, '<div class="navigation"><p>Hello</p></div><div id="main">hi</div>'

test "backslash doesn't cause infinite loop", ->
  emblem =
  '''
  | \\
  '''
  shouldCompileTo emblem, "\\"

test "backslash doesn't cause infinite loop with letter", ->
  emblem =
  '''
  | \\a
  '''
  shouldCompileTo emblem, "\\a"

test "self closing tag with forward slash", ->
  emblem =
  '''
  p/
  %bork/
  .omg/
  #hello.boo/
  p/ class="asdasd"
  '''
  shouldCompileTo emblem, '<p /><bork /><div class="omg" /><div id="hello" class="boo" /><p class="asdasd" />'

test "tagnames and attributes with colons", ->
  emblem =
  '''
  %al:ex match:neer="snork" Hello!
  '''
  shouldCompileTo emblem, '<al:ex match:neer="snork">Hello!</al:ex>'

test "windows newlines", ->
  emblem = "\r\n  \r\n  p Hello\r\n\r\n"
  shouldCompileTo emblem, '<p>Hello</p>'

if supportsSubexpressions

  QUnit.module "subexpressions"

  Handlebars.registerHelper 'echo', (param) ->
    "ECHO #{param}"

  Handlebars.registerHelper 'echofun', ->
    options = Array.prototype.pop.call(arguments)
    "FUN = #{options.hash.fun}"

  Handlebars.registerHelper 'hello', (param) ->
    "hello"

  Handlebars.registerHelper 'equal', (x, y) ->
    x == y

  test "arg-less helper", ->
    emblem = 'p {{echo (hello)}}'
    shouldCompileTo emblem, '<p>ECHO hello</p>'

    emblem = '= echo (hello)'
    shouldCompileTo emblem, 'ECHO hello'

  test "helper w args", ->
    emblem = 'p {{echo (equal 1 1)}}'
    shouldCompileTo emblem, '<p>ECHO true</p>'

    emblem = '= echo (equal 1 1)'
    shouldCompileTo emblem, 'ECHO true'

  test "supports much nesting", ->
    emblem = 'p {{echo (equal (equal 1 1) true)}}'
    shouldCompileTo emblem, '<p>ECHO true</p>'

    emblem = '= echo (equal (equal 1 1) true)'
    shouldCompileTo emblem, 'ECHO true'

  test "with hashes", ->
    emblem = 'p {{echo (equal (equal 1 1) true fun="yes")}}'
    shouldCompileTo emblem, '<p>ECHO true</p>'

    emblem = '= echo (equal (equal 1 1) true fun="yes")'
    shouldCompileTo emblem, 'ECHO true'

  test "as hashes", ->
    emblem = 'p {{echofun fun=(equal 1 1)}}'
    shouldCompileTo emblem, '<p>FUN = true</p>'

    emblem = '= echofun fun=(equal 1 1)'
    shouldCompileTo emblem, 'FUN = true'

  test "complex expression", ->
    emblem = 'p {{echofun true (hello how="are" you=false) 1 not=true fun=(equal "ECHO hello" (echo (hello))) win="yes"}}'
    shouldCompileTo emblem, '<p>FUN = true</p>'

    emblem = '= echofun true (hello how="are" you=false) 1 not=true fun=(equal "ECHO hello" (echo (hello))) win="yes"'
    shouldCompileTo emblem, 'FUN = true'
###
