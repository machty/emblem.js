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

# TODO test overriding the default helper name (instead of always "view")

bindAttrHelper = function(assert) {
  var bindingString, k, options, param, params, v, _ref;
  options = arguments[arguments.length - 1];
  params = Array.prototype.slice.call(arguments, 0, -1);
  bindingString = "";
  _ref = options.hash;
  for (k in _ref) {
    if (!__hasProp.call(_ref, k)) continue;
    v = _ref[k];
    bindingString += " " + k + " to " + v;
  }
  if (!bindingString) {
    bindingString = " narf";
  }
  param = params[0] || 'none';
  return "bind-attr" + bindingString;
};

Handlebars.registerHelper('bind-attr', bindAttrHelper);

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


QUnit.module "line-based errors"

test "line number is provided for pegjs error", ->
  emblem =
  """
  p Hello
  p Hello {{narf}
  """
  shouldThrow (-> CompilerContext.compile emblem), "line 2"

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

test "Emblem has a VERSION defined", ->
  ok(Emblem.VERSION, "Emblem.VERSION should be defined")

###
