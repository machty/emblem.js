`import Emblem from '../emblem'`

###
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

test "block as #each", ->
  emblem =
  '''
  thangs
    p Woot #{yeah}
  '''
  shouldCompileToString emblem, { thangs: [{yeah: 123}, {yeah:456}] }, '<p>Woot 123</p><p>Woot 456</p>'

QUnit.module "misc."

test "capitalized view helper should not kick in if suffix modifiers present", ->
  emblem =
  """
  Foo!
  """
  shouldCompileToString emblem, '<unbound class="Foo">Foo</unbound>'

test "Emblem has a VERSION defined", ->
  ok(Emblem.VERSION, "Emblem.VERSION should be defined")

###
