/*global QUnit*/
QUnit.module("attribute shorthand");

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

QUnit.module("full attributes - tags with content");

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
  return assert.compilesTo(emblem, '<p class="hello" data-foo="gnarly"><span>Yes</span></p>');
});
