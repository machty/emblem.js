/*global QUnit*/

import { w } from '../support/utils';
import { compilesTo } from '../support/integration-assertions';

QUnit.module("attributes: shorthand");

test("id shorthand", function() {
  compilesTo("#woot", '<div id="woot"></div>');
  return compilesTo("span#woot", '<span id="woot"></span>');
});

test("class shorthand", function() {
  compilesTo(".woot", '<div class="woot"></div>');
  compilesTo("span.woot", '<span class="woot"></span>');
  return compilesTo("span.woot.loot", '<span class="woot loot"></span>');
});

test("class can come first", function() {
  compilesTo(".woot#hello", '<div id="hello" class="woot"></div>');
  compilesTo("span.woot#hello", '<span id="hello" class="woot"></span>');
  compilesTo("span.woot.loot#hello", '<span id="hello" class="woot loot"></span>');
  return compilesTo("span.woot.loot#hello.boot", '<span id="hello" class="woot loot boot"></span>');
});

QUnit.module("attributes: full attributes - tags with content");

test("class only", function() {
  return compilesTo('p class="yes" Blork', '<p class="yes">Blork</p>');
});

test("id only", function() {
  return compilesTo('p id="yes" Hyeah', '<p id="yes">Hyeah</p>');
});

test("class and id", function() {
  return compilesTo('p id="yes" class="no" Blork', '<p id="yes" class="no">Blork</p>');
});

test("class and id and embedded html one-liner", function() {
  return compilesTo('p id="yes" class="no" One <b>asd</b>!', '<p id="yes" class="no">One <b>asd</b>!</p>');
});

test("bracketed attributes", function() {
  var emblem;
  emblem = "p [\n  id=\"yes\"\n  class=\"no\" ]\n  | Bracketed Attributes FTW!";
  return compilesTo(emblem, '<p id="yes" class="no">Bracketed Attributes FTW!</p>');
});

test("bracketed text", function() {
  var emblem;
  emblem = "p [ Bracketed text is cool ]";
  return compilesTo(emblem, '<p>[ Bracketed text is cool ]</p>');
});

test("bracketed text indented", function() {
  var emblem;
  emblem = "p\n  | [ Bracketed text is cool ]";
  return compilesTo(emblem, '<p>[ Bracketed text is cool ]</p>');
});

test("nesting", function() {
  var emblem;
  emblem = "p class=\"hello\" data-foo=\"gnarly\"\n  span Yes";
  return compilesTo(emblem, '<p data-foo="gnarly" class="hello"><span>Yes</span></p>');
});


QUnit.module("attributes: full attributes - mixed quotes");

test("single empty", function() {
  return compilesTo("p class=''", '<p class=""></p>');
});

test("single full", function() {
  return compilesTo("p class='woot yeah'", '<p class="woot yeah"></p>');
});

test("mixed", function() {
  return compilesTo("p class='woot \"oof\" yeah'", '<p class="woot \\"oof\\" yeah"></p>');
});

QUnit.module("attributes: full attributes - tags without content");

test("empty", function() {
  return compilesTo('p class=""', '<p class=""></p>');
});

test("class only", function() {
  return compilesTo('p class="yes"', '<p class="yes"></p>');
});

test("id only", function() {
  return compilesTo('p id="yes"', '<p id="yes"></p>');
});

test("class and id", function() {
  return compilesTo('p id="yes" class="no"', '<p id="yes" class="no"></p>');
});

QUnit.module("attributes: full attributes w/ mustaches");

test("with mustache", function() {
  var emblem;
  compilesTo('p class="foo {{yes}}"', '<p class="foo {{yes}}"></p>');
  compilesTo('p class="foo {{yes}}" Hello', '<p class="foo {{yes}}">Hello</p>');
  emblem = "p class=\"foo {{yes}}\"\n  | Hello";
  return compilesTo(emblem, '<p class="foo {{yes}}">Hello</p>');
});

test("with mustache calling helper", function() {
  var emblem;

  compilesTo('p class="foo {{{echo "YES"}}}"',
             '<p class="foo {{{echo \\"YES\\"}}}"></p>');

  compilesTo('p class="foo #{echo "NO"} and {{{echo "YES"}}}" Hello',
             '<p class="foo {{echo \\"NO\\"}} and {{{echo \\"YES\\"}}}">Hello</p>');

  emblem = "p class=\"foo {{echo \"BORF\"}}\"\n  | Hello";
  compilesTo(emblem, '<p class="foo {{echo \\"BORF\\"}}">Hello</p>');
});

QUnit.module("attributes: boolean");

test("static", function() {
  compilesTo('p borf=true', '<p borf></p>');
  compilesTo('p borf=true Woot', '<p borf>Woot</p>');
  compilesTo('p borf=false', '<p></p>');
  compilesTo('p borf=false Nork', '<p>Nork</p>');
  compilesTo('option selected=true Thingeroo', '<option selected>Thingeroo</option>');
});

QUnit.module("attributes: class name coalescing");

test("when literal class is used", function() {
  return compilesTo('p.foo class="bar"', '<p class="foo bar"></p>');
});

test("when ember expression is used with variable", function() {
  compilesTo('p.foo class=bar',
             '<p class="foo {{bar}}"></p>');
});

test("when ember expression is used with variable in braces", function() {
  compilesTo('p.foo class={ bar }',
             '<p class="foo {{bar}}"></p>');
});

test("when ember expression is used with constant in braces", function() {
  compilesTo('p.foo class={ :bar }',
             '<p class="foo bar"></p>');
});

test("when ember expression is used with constant and variable in braces", function() {
  compilesTo('p.foo class={ :bar bar }',
             '<p class="foo bar {{bar}}"></p>');
});

QUnit.module("attributes: shorthand: mustache DOM attribute shorthand");

test("tagName w/o space", function() {
  var emblem = "App.FunView%span";
  compilesTo(emblem, '{{view App.FunView tagName="span"}}');
});

test("tagName w/ space", function() {
  var emblem = "App.FunView %span";
  compilesTo(emblem, '{{view App.FunView tagName="span"}}');
});

test("tagName block", function() {
  var emblem = "App.FunView%span\n  p Hello";
  compilesTo(emblem, '{{#view App.FunView tagName="span"}}<p>Hello</p>{{/view}}');
});

test("class w/ space (needs space)", function() {
  var emblem = "App.FunView .bork";
  compilesTo(emblem, '{{view App.FunView class="bork"}}');
});

test("multiple classes", function() {
  var emblem = "App.FunView .bork.snork";
  compilesTo(emblem, '{{view App.FunView class="bork snork"}}');
});

test("elementId", function() {
  var emblem = "App.FunView#ohno";
  compilesTo(emblem, '{{view App.FunView elementId="ohno"}}');
});

test("mixed w/ hash`", function() {
  var emblem = "App.FunView .bork.snork funbags=\"yeah\"";
  compilesTo(emblem, '{{view App.FunView funbags="yeah" class="bork snork"}}');
});

test("mixture of all`", function() {
  var emblem = 'App.FunView%alex#hell.bork.snork funbags="yeah"';
  compilesTo(emblem, '{{view App.FunView funbags="yeah" tagName="alex" elementId="hell" class="bork snork"}}');
});

QUnit.module("attributes: bound and unbound");

test("path with dot", function(){
  var emblem = 'iframe src=post.pdfAttachment';
  compilesTo(emblem, '<iframe src={{post.pdfAttachment}}></iframe>');

  emblem = 'iframe src=post.pdfAttachmentUrl width="96%" height="400" view="FitV" frameborder="0" style="z-index: 0 !important;"';
  compilesTo(emblem,
                    '<iframe src={{post.pdfAttachmentUrl}} width="96%" height="400" view="FitV" frameborder="0" style="z-index: 0 !important;"></iframe>');
});

test('mustache in attribute', function(){
  var emblem = 'img src="{{unbound post.showLogoUrl}}" onerror="this.src=\'{{unbound orgSettings.onErrorBlankLogoImage}}\'"';
  compilesTo(emblem, '<img src="{{unbound post.showLogoUrl}}" onerror="this.src=\'{{unbound orgSettings.onErrorBlankLogoImage}}\'">');
});

test('mustache in attribute with exclamation point', function(){
  var emblem = "a href=postLink! target='_blank'";
  compilesTo(emblem, '<a href="{{unbound postLink}}" target="_blank"></a>');
});

test('mustache attribute value has comma', function(){
  var emblem = "a name='my, cool, name'";
  compilesTo(emblem, '<a name="my, cool, name"></a>');
});

test("mustache class binding", function(){
  var emblem = 'iframe.foo class=dog';
  compilesTo(emblem, '<iframe class="foo {{dog}}"></iframe>');
});

test("numbers in shorthand", function() {
  compilesTo('#4a', '<div id="4a"></div>');
  compilesTo('.4a', '<div class="4a"></div>');
  compilesTo('.4', '<div class="4"></div>');
  compilesTo('#4', '<div id="4"></div>');
  compilesTo('%4', '<4></4>');
  compilesTo('%4 ermagerd', '<4>ermagerd</4>');
  compilesTo('%4#4.4 ermagerd', '<4 id="4" class="4">ermagerd</4>');
});

test("negative numbers should work", function(){
  compilesTo("foo positive=100 negative=-100", '{{foo positive=100 negative=-100}}');
});

test("booleans with and without quoting", function(){
  compilesTo('foo what=false', '{{foo what=false}}');
  compilesTo('foo what="false"', '{{foo what="false"}}');
  compilesTo("foo what='false'", '{{foo what=\'false\'}}');
});

test("bound attributes from within strings", function() {
  var emblem = 'div style="width: {{userProvidedWidth}}px;"';
  compilesTo(emblem, '<div style="width: {{userProvidedWidth}}px;"></div>');
});

QUnit.module("attributes with inline if");

test("with attribute and bound values", function() {
  var emblem = 'div style={ if isActive foo bar }';
  compilesTo(emblem, '<div style={{if isActive foo bar}}></div>');
});

test("with attribute", function() {
  var emblem = 'a href={ if isActive \'http://google.com\' \'http://bing.com\' }';
  compilesTo(emblem, '<a href={{if isActive \'http://google.com\' \'http://bing.com\'}}></a>');
});

test("with attribute and bound values", function() {
  var emblem = 'a href={ if isActive google bing }';
  compilesTo(emblem, '<a href={{if isActive google bing}}></a>');
});

test("unbound attributes", function() {
  var emblem = 'div class={ if isActive \'foo\' \'bar\' }';
  compilesTo(emblem, '<div class={{if isActive \'foo\' \'bar\'}}></div>');
});

test("bound attributes", function() {
  var emblem = 'div class={ if isActive foo bar }';
  compilesTo(emblem, '<div class={{if isActive foo bar}}></div>');
});

test("mixed attributes", function() {
  var emblem = 'div class={ if isActive \'foo\' bar }';
  compilesTo(emblem, '<div class={{if isActive \'foo\' bar}}></div>');
});

test("unbound attributes with full quote", function() {
  var emblem = 'div class={ if isActive \"foo\" bar }';
  compilesTo(emblem, '<div class={{if isActive \"foo\" bar}}></div>');
});

test("one unbound option", function() {
  var emblem = 'div class={ if isActive \"foo\" }';
  compilesTo(emblem, '<div class={{if isActive \"foo\"}}></div>');
});

test("one bound option", function() {
  var emblem = 'div class={ if isActive foo }';
  compilesTo(emblem, '<div class={{if isActive foo}}></div>');
});

test("within a string", function() {
  var emblem = 'div style="{{ if isActive \"15\" \"25\" }}px"';
  compilesTo(emblem, '<div style=\"{{if isActive \\"15\\" \\"25\\" }}px\"></div>');
});

test("with dot params", function() {
  var emblem = w(
    "li class={ if content.length 'just-one' }",
    "  |Thing"
  );
  compilesTo(emblem, "<li class={{if content.length 'just-one'}}>Thing</li>");
});

test("mixed with subexpressions", function() {
  var emblem = w(
    "li class={ if (has-one content.length) 'just-one' }",
    "  |Thing"
  );
  compilesTo(emblem, "<li class={{if (has-one content.length) 'just-one'}}>Thing</li>");
});
