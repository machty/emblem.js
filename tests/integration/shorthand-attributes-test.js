/*global QUnit*/
var bindAttrHelper,
  __hasProp = {}.hasOwnProperty;

QUnit.module("class shorthand and explicit declaration is coalesced");

test("when literal class is used", function(assert) {
  return assert.compilesTo('p.foo class="bar"', '<p class="foo bar"></p>');
});

test("when ember expression is used with variable", function(assert) {
  return assert.compilesTo('p.foo class=bar',
                           '<p {{bind-attr class=":foo bar"}}></p>');
});

/*
test("when ember expression is used with variable in braces", function(assert) {
  var result;
  result = shouldEmberPrecompileToHelper('p.foo class={ bar }');
  return ok(-1 !== result.indexOf('\'class\': (":foo bar")'));
});

test("when ember expression is used with constant in braces", function(assert) {
  var result;
  result = shouldEmberPrecompileToHelper('p.foo class={ :bar }');
  return ok(-1 !== result.indexOf('\'class\': (":foo :bar")'));
});

test("when ember expression is used with constant and variable in braces", function(assert) {
  var result;
  result = shouldEmberPrecompileToHelper('p.foo class={ :bar bar }');
  return ok(-1 !== result.indexOf('\'class\': (":foo :bar bar")'));
});

test("when ember expression is used with bind-attr", function(assert) {
  var result;
  result = shouldEmberPrecompileToHelper('p.foo{ bind-attr class="bar" }');
  return ok(-1 !== result.indexOf('\'class\': (":foo bar")'));
});

test("when ember expression is used with bind-attr and multiple attrs", function(assert) {
  var result;
  result = shouldEmberPrecompileToHelper('p.foo{ bind-attr something=bind class="bar" }');
  return ok(-1 !== result.indexOf('\'class\': (":foo bar")'));
});

test("only with bind-attr helper", function(assert) {
  var result;
  result = shouldEmberPrecompileToHelper('p.foo{ someHelper class="bar" }', 'someHelper');
  ok(-1 !== result.indexOf('\'class\': ("bar")'));
  return ok(-1 !== result.indexOf('class=\\"foo\\"'));
});
*/
