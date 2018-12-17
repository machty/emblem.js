/*global QUnit*/

import { w } from '../support/utils';
import { compilesTo } from '../support/integration-assertions';

QUnit.module("attributes: shorthand");

QUnit.test("id shorthand", function() {
  compilesTo("#woot", '<div id="woot"></div>');
  return compilesTo("span#woot", '<span id="woot"></span>');
});

QUnit.test("class shorthand", function() {
  compilesTo(".woot", '<div class="woot"></div>');
  compilesTo("span.woot", '<span class="woot"></span>');
  return compilesTo("span.woot.loot", '<span class="woot loot"></span>');
});

QUnit.test("class can come first", function() {
  compilesTo(".woot#hello", '<div id="hello" class="woot"></div>');
  compilesTo("span.woot#hello", '<span id="hello" class="woot"></span>');
  compilesTo("span.woot.loot#hello", '<span id="hello" class="woot loot"></span>');
  return compilesTo("span.woot.loot#hello.boot", '<span id="hello" class="woot loot boot"></span>');
});

QUnit.module("attributes: full attributes - tags with content");

QUnit.test("class only", function() {
  return compilesTo('p class="yes" Blork', '<p class="yes">Blork</p>');
});

QUnit.test("id only", function() {
  return compilesTo('p id="yes" Hyeah', '<p id="yes">Hyeah</p>');
});

QUnit.test("class and id", function() {
  return compilesTo('p id="yes" class="no" Blork', '<p id="yes" class="no">Blork</p>');
});

QUnit.test("class and id and embedded html one-liner", function() {
  return compilesTo('p id="yes" class="no" One <b>asd</b>!', '<p id="yes" class="no">One <b>asd</b>!</p>');
});

QUnit.test("bracketed attributes", function() {
  var emblem;
  emblem = "p [\n  id=\"yes\"\n  class=\"no\" ]\n  | Bracketed Attributes FTW!";
  return compilesTo(emblem, '<p id="yes" class="no">Bracketed Attributes FTW!</p>');
});

QUnit.test("bracketed mustache attributes", function() {
  var emblem;
  emblem = "p [\n  onclick={ action 'foo' }\n  class=\"no\" ]\n  | Bracketed Attributes FTW!";
  return compilesTo(emblem, '<p onclick={{action \'foo\'}} class="no">Bracketed Attributes FTW!</p>');
});

QUnit.test("bracketed text", function() {
  var emblem;
  emblem = "p [ Bracketed text is cool ]";
  return compilesTo(emblem, '<p>[ Bracketed text is cool ]</p>');
});

QUnit.test("bracketed text indented", function() {
  var emblem;
  emblem = "p\n  | [ Bracketed text is cool ]";
  return compilesTo(emblem, '<p>[ Bracketed text is cool ]</p>');
});

QUnit.test('bracketed statement with comment and blank lines', function() {
  var emblem = w('div [',
                 '  foo=bar',
                 '',
                 '  ',
                 '  / We need to add more',
                 ']');
  compilesTo(
    emblem, '<div foo={{bar}}></div>');
});

QUnit.test('bracketed statement end bracket', function() {
  var emblem = w('div [',
                 '  foo=bar',
                 '  ',
                 '  data=baz ]');
  compilesTo(
    emblem, '<div foo={{bar}} data={{baz}}></div>');
});

QUnit.test("nesting", function() {
  var emblem;
  emblem = "p class=\"hello\" data-foo=\"gnarly\"\n  span Yes";
  return compilesTo(emblem, '<p data-foo="gnarly" class="hello"><span>Yes</span></p>');
});


QUnit.module("attributes: full attributes - mixed quotes");

QUnit.test("single empty", function() {
  return compilesTo("p class=''", '<p class=""></p>');
});

QUnit.test("single full", function() {
  return compilesTo("p class='woot yeah'", '<p class="woot yeah"></p>');
});

QUnit.test("mixed", function() {
  return compilesTo("p class='woot \"oof\" yeah'", '<p class="woot \\"oof\\" yeah"></p>');
});

QUnit.module("attributes: full attributes - tags without content");

QUnit.test("empty", function() {
  return compilesTo('p class=""', '<p class=""></p>');
});

QUnit.test("class only", function() {
  return compilesTo('p class="yes"', '<p class="yes"></p>');
});

QUnit.test("id only", function() {
  return compilesTo('p id="yes"', '<p id="yes"></p>');
});

QUnit.test("class and id", function() {
  return compilesTo('p id="yes" class="no"', '<p id="yes" class="no"></p>');
});

QUnit.module("attributes: full attributes w/ mustaches");

QUnit.test("with mustache", function() {
  var emblem;
  compilesTo('p class="foo {{yes}}"', '<p class="foo {{yes}}"></p>');
  compilesTo('p class="foo {{yes}}" Hello', '<p class="foo {{yes}}">Hello</p>');
  emblem = "p class=\"foo {{yes}}\"\n  | Hello";
  return compilesTo(emblem, '<p class="foo {{yes}}">Hello</p>');
});

QUnit.test("with mustache calling helper", function() {
  var emblem;

  compilesTo('p class="foo {{{echo "YES"}}}"',
             '<p class="foo {{{echo \\"YES\\"}}}"></p>');

  compilesTo('p class="foo #{echo "NO"} and {{{echo "YES"}}}" Hello',
             '<p class="foo {{echo \\"NO\\"}} and {{{echo \\"YES\\"}}}">Hello</p>');

  emblem = "p class=\"foo {{echo \"BORF\"}}\"\n  | Hello";
  compilesTo(emblem, '<p class="foo {{echo \\"BORF\\"}}">Hello</p>');
});

QUnit.module("attributes: boolean");

QUnit.test("static", function() {
  compilesTo('p borf=true', '<p borf></p>');
  compilesTo('p borf=true Woot', '<p borf>Woot</p>');
  compilesTo('p borf=false', '<p></p>');
  compilesTo('p borf=false Nork', '<p>Nork</p>');
  compilesTo('option selected=true Thingeroo', '<option selected>Thingeroo</option>');
});

QUnit.module("attributes: numbers");

QUnit.test('number literals as attributes', function() {
  compilesTo('td colspan=3', '<td colspan=3></td>');
});

QUnit.test('large number literals as attributes', function() {
  compilesTo('td colspan=35234', '<td colspan=35234></td>');
});

QUnit.module("attributes: class name coalescing");

QUnit.test("when literal class is used", function() {
  return compilesTo('p.foo class="bar"', '<p class="foo bar"></p>');
});

QUnit.test("when ember expression is used with variable", function() {
  compilesTo('p.foo class=bar',
             '<p class="foo {{bar}}"></p>');
});

QUnit.test("when ember expression is used with variable in braces", function() {
  compilesTo('p.foo class={ bar }',
             '<p class="foo {{bar}}"></p>');
});

QUnit.test("when ember expression is used with constant in braces", function() {
  compilesTo('p.foo class={ :bar }',
             '<p class="foo bar"></p>');
});

QUnit.test("when ember expression is used with constant and variable in braces", function() {
  compilesTo('p.foo class={ :bar bar }',
             '<p class="foo bar {{bar}}"></p>');
});

QUnit.module("attributes: shorthand: mustache DOM attribute shorthand");

QUnit.test("tagName w/o space", function() {
  var emblem = "App.FunView%span";
  compilesTo(emblem, '{{view App.FunView tagName="span"}}');
});

QUnit.test("tagName w/ space", function() {
  var emblem = "App.FunView %span";
  compilesTo(emblem, '{{view App.FunView tagName="span"}}');
});

QUnit.test("tagName block", function() {
  var emblem = "App.FunView%span\n  p Hello";
  compilesTo(emblem, '{{#view App.FunView tagName="span"}}<p>Hello</p>{{/view}}');
});

QUnit.test("class w/ space (needs space)", function() {
  var emblem = "App.FunView .bork";
  compilesTo(emblem, '{{view App.FunView class="bork"}}');
});

QUnit.test("multiple classes", function() {
  var emblem = "App.FunView .bork.snork";
  compilesTo(emblem, '{{view App.FunView class="bork snork"}}');
});

QUnit.test("elementId", function() {
  var emblem = "App.FunView#ohno";
  compilesTo(emblem, '{{view App.FunView elementId="ohno"}}');
});

QUnit.test("mixed w/ hash`", function() {
  var emblem = "App.FunView .bork.snork funbags=\"yeah\"";
  compilesTo(emblem, '{{view App.FunView funbags="yeah" class="bork snork"}}');
});

QUnit.test("mixture of all`", function() {
  var emblem = 'App.FunView%alex#hell.bork.snork funbags="yeah"';
  compilesTo(emblem, '{{view App.FunView funbags="yeah" tagName="alex" elementId="hell" class="bork snork"}}');
});

QUnit.module("attributes: bound and unbound");

QUnit.test("path with dot", function(){
  var emblem = 'iframe src=post.pdfAttachment';
  compilesTo(emblem, '<iframe src={{post.pdfAttachment}}></iframe>');

  emblem = 'iframe src=post.pdfAttachmentUrl width="96%" height="400" view="FitV" frameborder="0" style="z-index: 0 !important;"';
  compilesTo(emblem,
                    '<iframe src={{post.pdfAttachmentUrl}} width="96%" height="400" view="FitV" frameborder="0" style="z-index: 0 !important;"></iframe>');
});

QUnit.test('mustache in attribute', function(){
  var emblem = 'img src="{{unbound post.showLogoUrl}}" onerror="this.src=\'{{unbound orgSettings.onErrorBlankLogoImage}}\'"';
  compilesTo(emblem, '<img src="{{unbound post.showLogoUrl}}" onerror="this.src=\'{{unbound orgSettings.onErrorBlankLogoImage}}\'">');
});

QUnit.test('mustache in attribute with exclamation point', function(){
  var emblem = "a href=postLink! target='_blank'";
  compilesTo(emblem, '<a href="{{unbound postLink}}" target="_blank"></a>');
});

QUnit.test('mustache attribute value has comma', function(){
  var emblem = "a name='my, cool, name'";
  compilesTo(emblem, '<a name="my, cool, name"></a>');
});

QUnit.test("mustache class binding", function(){
  var emblem = 'iframe.foo class=dog';
  compilesTo(emblem, '<iframe class="foo {{dog}}"></iframe>');
});

QUnit.test("numbers in shorthand", function() {
  compilesTo('#4a', '<div id="4a"></div>');
  compilesTo('.4a', '<div class="4a"></div>');
  compilesTo('.4', '<div class="4"></div>');
  compilesTo('#4', '<div id="4"></div>');
  compilesTo('%4', '<4></4>');
  compilesTo('%4 ermagerd', '<4>ermagerd</4>');
  compilesTo('%4#4.4 ermagerd', '<4 id="4" class="4">ermagerd</4>');
});

QUnit.test("negative numbers should work", function(){
  compilesTo("foo positive=100 negative=-100", '{{foo positive=100 negative=-100}}');
});

QUnit.test("booleans with and without quoting", function(){
  compilesTo('foo what=false', '{{foo what=false}}');
  compilesTo('foo what="false"', '{{foo what="false"}}');
  compilesTo("foo what='false'", '{{foo what=\'false\'}}');
});

QUnit.test("bound attributes from within strings", function() {
  var emblem = 'div style="width: {{userProvidedWidth}}px;"';
  compilesTo(emblem, '<div style="width: {{userProvidedWidth}}px;"></div>');
});

QUnit.module("attributes with inline if");

QUnit.test("with attribute and bound values", function() {
  var emblem = 'div style={ if isActive foo bar }';
  compilesTo(emblem, '<div style={{if isActive foo bar}}></div>');
});

QUnit.test("with attribute and bound values and legacy quoting", function() {
  var emblem = 'div style={ if isActive foo bar }';
  compilesTo(emblem, '<div style=\"{{if isActive foo bar}}\"></div>', null, {
    legacyAttributeQuoting: true
  });
});

QUnit.test("with attribute", function() {
  var emblem = 'a href={ if isActive \'http://google.com\' \'http://bing.com\' }';
  compilesTo(emblem, '<a href={{if isActive \'http://google.com\' \'http://bing.com\'}}></a>');
});

QUnit.test("with attribute and legacy quoting", function() {
  var emblem = 'a href={ if isActive \'http://google.com\' \'http://bing.com\' }';
  compilesTo(emblem, '<a href=\"{{if isActive \'http://google.com\' \'http://bing.com\'}}\"></a>', null, {
    legacyAttributeQuoting: true
  });
});

QUnit.test("with attribute and bound values", function() {
  var emblem = 'a href={ if isActive google bing }';
  compilesTo(emblem, '<a href={{if isActive google bing}}></a>');
});

QUnit.test("unbound attributes", function() {
  var emblem = 'div class={ if isActive \'foo\' \'bar\' }';
  compilesTo(emblem, '<div class={{if isActive \'foo\' \'bar\'}}></div>');
});

QUnit.test("bound attributes", function() {
  var emblem = 'div class={ if isActive foo bar }';
  compilesTo(emblem, '<div class={{if isActive foo bar}}></div>');
});

QUnit.test("mixed attributes", function() {
  var emblem = 'div class={ if isActive \'foo\' bar }';
  compilesTo(emblem, '<div class={{if isActive \'foo\' bar}}></div>');
});

QUnit.test("unbound attributes with full quote", function() {
  var emblem = 'div class={ if isActive \"foo\" bar }';
  compilesTo(emblem, '<div class={{if isActive \"foo\" bar}}></div>');
});

QUnit.test("one unbound option", function() {
  var emblem = 'div class={ if isActive \"foo\" }';
  compilesTo(emblem, '<div class={{if isActive \"foo\"}}></div>');
});

QUnit.test("one bound option", function() {
  var emblem = 'div class={ if isActive foo }';
  compilesTo(emblem, '<div class={{if isActive foo}}></div>');
});

QUnit.test('with unless', function() {
  compilesTo("div class={ unless isActive 'bar' }", '<div class={{unless isActive \'bar\'}}></div>')
});

QUnit.test("within a string", function() {
  var emblem = 'div style="{{ if isActive \"15\" \"25\" }}px"';
  compilesTo(emblem, '<div style=\"{{if isActive \\"15\\" \\"25\\" }}px\"></div>');
});

QUnit.test("with dot params", function() {
  var emblem = w(
    "li class={ if content.length 'just-one' }",
    "  |Thing"
  );
  compilesTo(emblem, "<li class={{if content.length 'just-one'}}>Thing</li>");
});

QUnit.test("mixed with subexpressions", function() {
  var emblem = w(
    "li class={ if (has-one content.length) 'just-one' }",
    "  |Thing"
  );
  compilesTo(emblem, "<li class={{if (has-one content.length) 'just-one'}}>Thing</li>");
});

QUnit.module("binding behavior for unquoted attribute values");

QUnit.test("basic", function() {
  var emblem = 'p class=foo';
  compilesTo(emblem, '<p class={{foo}}></p>');
});

QUnit.test("basic w/ underscore", function() {
  var emblem = 'p class=foo_urns';
  compilesTo(emblem, '<p class={{foo_urns}}></p>');
});

QUnit.test("subproperties", function() {
  var emblem = 'p class=foo._death.woot';
  compilesTo(emblem, '<p class={{foo._death.woot}}></p>');
});

QUnit.test("multiple", function() {
  var emblem = 'p class=foo id="yup" data-thinger=yeah Hooray';
  compilesTo(emblem, '<p id="yup" data-thinger={{yeah}} class={{foo}}>Hooray</p>');
});

QUnit.test("multiple with legacy quoting", function() {
  var emblem = 'p class=foo id="yup" data-thinger=yeah Hooray';
  compilesTo(emblem, '<p id="yup" data-thinger=\"{{yeah}}\" class={{foo}}>Hooray</p>', null, {
    legacyAttributeQuoting: true
  });
});

QUnit.test("in brackets", function() {
  var emblem;
  emblem = "p [\n  id=id some-data=data.ok]\n";
  return compilesTo(emblem, '<p id={{id}} some-data={{data.ok}}></p>');
});

QUnit.test('brackets with empty lines', function() {
  var emblem = w('p [',
                 '  id=id',
                 '  ',
                 '',
                 '  some-data=data.ok]');
  compilesTo(emblem, '<p id={{id}} some-data={{data.ok}}></p>');
});

QUnit.test("class special syntax with 2 vals", function() {
  var emblem = 'p class=foo:bar:baz';
  compilesTo(emblem, '<p class={{if foo \'bar\' \'baz\'}}></p>');
});

QUnit.test("class special syntax with only 2nd val", function() {
  var emblem = 'p class=foo::baz';
  compilesTo(emblem, '<p class={{if foo \'\' \'baz\'}}></p>');
});

QUnit.test("class special syntax with only 1st val", function() {
  var emblem = 'p class=foo:baz';
  compilesTo(emblem, '<p class={{if foo \'baz\'}}></p>');
});

QUnit.test("class special syntax with slashes", function() {
  var emblem = 'p class=foo/bar:baz';
  compilesTo(emblem, '<p class={{if foo/bar \'baz\'}}></p>');
});

QUnit.test("Inline binding with mixed classes", function() {
  var emblem = ".notice class={ test::active }";
  compilesTo(emblem, '<div class=\"notice {{if test \'\' \'active\'}}\"></div>');
});

QUnit.test("class braced syntax w/ underscores and dashes", function() {
  compilesTo('p class={f-oo:bar :b_az}', '<p class="b_az {{if f-oo \'bar\'}}"></p>');
  compilesTo('p class={ f-oo:bar :b_az }', '<p class="b_az {{if f-oo \'bar\'}}"></p>');
  compilesTo('p class={ f-oo:bar :b_az } Hello', '<p class="b_az {{if f-oo \'bar\'}}">Hello</p>');
  var emblem = w(
    ".input-prepend class={ filterOn:input-append }",
    "  span.add-on"
  );
  compilesTo(emblem, '<div class="input-prepend {{if filterOn \'input-append\'}}"><span class="add-on"></span></div>');
});

QUnit.test("multiple bindings with inline conditionals", function() {
  var emblem = "button class={ thing1:active thing2:alert }";
  compilesTo(emblem, '<button class=\"{{if thing1 \'active\'}} {{if thing2 \'alert\'}}\"></button>');
});

QUnit.test("exclamation modifier (ember)", function() {
  var emblem = 'p class=foo!';
  compilesTo(emblem, '<p class="{{unbound foo}}"></p>');
});

QUnit.test("block as #each", function() {
  var emblem = w(
    'thangs',
    '  p Woot #{yeah}'
  );
  compilesTo(emblem, '{{#thangs}}<p>Woot {{yeah}}</p>{{/thangs}}');
});
