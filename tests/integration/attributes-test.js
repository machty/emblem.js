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

/* FIXME multiple classes is not well-defined
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
*/

QUnit.module("attributes: shorthand: mustache DOM attribute shorthand");

test("tagName w/o space", function(assert) {
  var emblem = "App.FunView%span";
  assert.compilesTo(emblem, '{{view App.FunView tagName="span"}}');
});

test("tagName w/ space", function(assert) {
  var emblem = "App.FunView %span";
  assert.compilesTo(emblem, '{{view App.FunView tagName="span"}}');
});

test("tagName block", function(assert) {
  var emblem = "App.FunView%span\n  p Hello";
  assert.compilesTo(emblem, '{{#view App.FunView tagName="span"}}<p>Hello</p>{{/view}}');
});

test("class w/ space (needs space)", function(assert) {
  var emblem = "App.FunView .bork";
  assert.compilesTo(emblem, '{{view App.FunView class="bork"}}');
});

test("multiple classes", function(assert) {
  var emblem = "App.FunView .bork.snork";
  assert.compilesTo(emblem, '{{view App.FunView class="bork snork"}}');
});

test("elementId", function(assert) {
  var emblem = "App.FunView#ohno";
  assert.compilesTo(emblem, '{{view App.FunView elementId="ohno"}}');
});

test("mixed w/ hash`", function(assert) {
  var emblem = "App.FunView .bork.snork funbags=\"yeah\"";
  assert.compilesTo(emblem, '{{view App.FunView funbags="yeah" class="bork snork"}}');
});

test("mixture of all`", function(assert) {
  var emblem = 'App.FunView%alex#hell.bork.snork funbags="yeah"';
  assert.compilesTo(emblem, '{{view App.FunView funbags="yeah" tagName="alex" elementId="hell" class="bork snork"}}');
});

QUnit.module("attributes: bound and unbound");

test("path with dot", function(assert){
  var emblem = 'iframe src=post.pdfAttachment';
  assert.compilesTo(emblem, '<iframe {{bind-attr src=post.pdfAttachment}}></iframe>');

  emblem = 'iframe src=post.pdfAttachmentUrl width="96%" height="400" view="FitV" frameborder="0" style="z-index: 0 !important;"';
  assert.compilesTo(emblem,
                    '<iframe {{bind-attr src=post.pdfAttachmentUrl}} width="96%" height="400" view="FitV" frameborder="0" style="z-index: 0 !important;"></iframe>');
});

test('mustache in attribute', function(assert){
  var emblem = 'img src="{{unbound post.showLogoUrl}}" onerror="this.src=\'{{unbound orgSettings.onErrorBlankLogoImage}}\'"';
  assert.compilesTo(emblem, '<img src="{{unbound post.showLogoUrl}}" onerror="this.src=\'{{unbound orgSettings.onErrorBlankLogoImage}}\'"></img>');
});

test('mustache in attribute with exclamation point', function(assert){
  var emblem = "a href=postLink! target='_blank'";
  assert.compilesTo(emblem, '<a href="{{unbound postLink}}" target="_blank"></a>');
});

test('mustache attribute value has comma', function(assert){
  var emblem = "a name='my, cool, name'";
  assert.compilesTo(emblem, '<a name="my, cool, name"></a>');
});

test("numbers in shorthand", function(assert) {
  assert.compilesTo('#4a', '<div id="4a"></div>');
  assert.compilesTo('.4a', '<div class="4a"></div>');
  assert.compilesTo('.4', '<div class="4"></div>');
  assert.compilesTo('#4', '<div id="4"></div>');
  assert.compilesTo('%4', '<4></4>');
  assert.compilesTo('%4 ermagerd', '<4>ermagerd</4>');
  assert.compilesTo('%4#4.4 ermagerd', '<4 id="4" class="4">ermagerd</4>');
});
