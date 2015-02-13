/*global QUnit*/
QUnit.module("class shorthand and explicit declaration is coalesced");

test("when literal class is used", function(assert) {
  return assert.compilesTo('p.foo class="bar"', '<p class="foo bar"></p>');
});

test("when ember expression is used with variable", function(assert) {
  return assert.compilesTo('p.foo class=bar',
                           '<p {{bind-attr class=":foo bar"}}></p>');
});

test("when ember expression is used with variable in braces", function(assert) {
  assert.compilesTo('p.foo class={ bar }', '<p {{bind-attr class=":foo bar"}}></p>');
});

test("when ember expression is used with constant in braces", function(assert) {
  assert.compilesTo('p.foo class={ :bar }', '<p {{bind-attr class=":foo :bar"}}></p>');
});

test("when ember expression is used with constant and variable in braces", function(assert) {
  assert.compilesTo('p.foo class={ :bar bar }', '<p {{bind-attr class=":foo :bar bar"}}></p>');
});

/*
 * FIXME using an explicit bind-attr inside isn't yet supported
test("when ember expression is used with bind-attr", function(assert) {
  assert.compilesTo('p.foo{ bind-attr class="bar" }', '<p {{bind-attr class=":foo :bar"}}></p>');
});


test("when ember expression is used with bind-attr and multiple attrs", function(assert) {
  assert.compilesTo('p.foo{ bind-attr something=bind class="bar" }',
                    '<p {{bind-attr class=":foo :bar}} {{bind-attr something=bind}}></p>');
});

test("only with bind-attr helper", function(assert) {
  assert.compilesTo('p.foo{ someHelper class="bar" }',
                    '<p {{bind-attr class=":foo :bar"}} {{someHelper}}></p>');
});
*/
