/*global QUnit*/
QUnit.module("attributes: shorthand");

test("id shorthand", function(assert) {
  assert.compilesTo("#woot", '<div id="woot"></div>');
  return assert.compilesTo("span#woot", '<span id="woot"></span>');
});

test("class shorthand", function(assert) {
  assert.compilesTo(".woot", '<div class="woot"></div>');
  assert.compilesTo("span.woot", '<span class="woot"></span>');
  return assert.compilesTo("span.woot.loot", '<span class="woot loot"></span>');
});

test("class can come first", function(assert) {
  assert.compilesTo(".woot#hello", '<div id="hello" class="woot"></div>');
  assert.compilesTo("span.woot#hello", '<span id="hello" class="woot"></span>');
  assert.compilesTo("span.woot.loot#hello", '<span id="hello" class="woot loot"></span>');
  return assert.compilesTo("span.woot.loot#hello.boot", '<span id="hello" class="woot loot boot"></span>');
});

QUnit.module("attributes: full attributes - tags with content");

test("class only", function(assert) {
  return assert.compilesTo('p class="yes" Blork', '<p class="yes">Blork</p>');
});

test("id only", function(assert) {
  return assert.compilesTo('p id="yes" Hyeah', '<p id="yes">Hyeah</p>');
});

test("class and id", function(assert) {
  return assert.compilesTo('p id="yes" class="no" Blork', '<p id="yes" class="no">Blork</p>');
});

test("class and id and embedded html one-liner", function(assert) {
  return assert.compilesTo('p id="yes" class="no" One <b>asd</b>!', '<p id="yes" class="no">One <b>asd</b>!</p>');
});

test("bracketed attributes", function(assert) {
  var emblem;
  emblem = "p [\n  id=\"yes\"\n  class=\"no\" ]\n  | Bracketed Attributes FTW!";
  return assert.compilesTo(emblem, '<p id="yes" class="no">Bracketed Attributes FTW!</p>');
});

test("bracketed text", function(assert) {
  var emblem;
  emblem = "p [ Bracketed text is cool ]";
  return assert.compilesTo(emblem, '<p>[ Bracketed text is cool ]</p>');
});

test("bracketed text indented", function(assert) {
  var emblem;
  emblem = "p\n  | [ Bracketed text is cool ]";
  return assert.compilesTo(emblem, '<p>[ Bracketed text is cool ]</p>');
});

test("nesting", function(assert) {
  var emblem;
  emblem = "p class=\"hello\" data-foo=\"gnarly\"\n  span Yes";
  return assert.compilesTo(emblem, '<p data-foo="gnarly" class="hello"><span>Yes</span></p>');
});


QUnit.module("attributes: full attributes - mixed quotes");

test("single empty", function(assert) {
  return assert.compilesTo("p class=''", '<p class=""></p>');
});

test("single full", function(assert) {
  return assert.compilesTo("p class='woot yeah'", '<p class="woot yeah"></p>');
});

test("mixed", function(assert) {
  return assert.compilesTo("p class='woot \"oof\" yeah'", '<p class="woot \\"oof\\" yeah"></p>');
});

QUnit.module("attributes: full attributes - tags without content");

test("empty", function(assert) {
  return assert.compilesTo('p class=""', '<p class=""></p>');
});

test("class only", function(assert) {
  return assert.compilesTo('p class="yes"', '<p class="yes"></p>');
});

test("id only", function(assert) {
  return assert.compilesTo('p id="yes"', '<p id="yes"></p>');
});

test("class and id", function(assert) {
  return assert.compilesTo('p id="yes" class="no"', '<p id="yes" class="no"></p>');
});

// FIXME
/*
QUnit.module("attributes: full attributes w/ mustaches");

test("with mustache", function(assert) {
  var emblem;
  assert.compilesTo('p class="foo {{yes}}"', '<p class="foo {{yes}}"></p>');
  assert.compilesTo('p class="foo {{yes}}" Hello', '<p class="foo {{yes}}">Hello</p>');
  emblem = "p class=\"foo {{yes}}\"\n  | Hello";
  return assert.compilesTo(emblem, '<p class="foo {{yes}}">Hello</p>');
});

test("with mustache calling helper", function(assert) {
  var emblem;
  assert.compilesTo('p class="foo {{{echo "YES"}}}"',
                    '<p class="foo {{{echo "YES"}}}"></p>');
  assert.compilesTo('p class="foo #{echo "NO"} and {{{echo "YES"}}}" Hello',
                    '<p class="foo ECHO NO and ECHO YES">Hello</p>');
  emblem = "p class=\"foo {{echo \"BORF\"}}\"\n  | Hello";
  return assert.compilesTo(emblem, '<p class="foo ECHO BORF">Hello</p>');
});
*/

QUnit.module("attributes: boolean");

test("static", function(assert) {
  assert.compilesTo('p borf=true', '<p borf></p>');
  assert.compilesTo('p borf=true Woot', '<p borf>Woot</p>');
  assert.compilesTo('p borf=false', '<p></p>');
  assert.compilesTo('p borf=false Nork', '<p>Nork</p>');
  assert.compilesTo('option selected=true Thingeroo', '<option selected>Thingeroo</option>');
});

QUnit.module("attributes: class name coalescing");

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
