/*global QUnit*/

import { w } from '../support/utils';
import { compilesTo } from '../support/integration-assertions';

QUnit.module("attributes: shorthand");

QUnit.test("id shorthand", function(assert) {
  assert.compilesTo("#woot", '<div id="woot"></div>');
  assert.compilesTo("span#woot", '<span id="woot"></span>');
});

QUnit.test("class shorthand", function(assert) {
  assert.compilesTo(".woot", '<div class="woot"></div>');
  assert.compilesTo("span.woot", '<span class="woot"></span>');
  assert.compilesTo("span.woot.loot", '<span class="woot loot"></span>');
});

QUnit.test("class can come first", function(assert) {
  assert.compilesTo(".woot#hello", '<div id="hello" class="woot"></div>');
  assert.compilesTo("span.woot#hello", '<span id="hello" class="woot"></span>');
  assert.compilesTo("span.woot.loot#hello", '<span id="hello" class="woot loot"></span>');
  assert.compilesTo("span.woot.loot#hello.boot", '<span id="hello" class="woot loot boot"></span>');
});

QUnit.module("attributes: full attributes - tags with content");

QUnit.test("class only", function(assert) {
  assert.compilesTo('p class="yes" Blork', '<p class="yes">Blork</p>');
});

QUnit.test("id only", function(assert) {
  assert.compilesTo('p id="yes" Hyeah', '<p id="yes">Hyeah</p>');
});

QUnit.test("class and id", function(assert) {
  assert.compilesTo('p id="yes" class="no" Blork', '<p id="yes" class="no">Blork</p>');
});

QUnit.test("class and id and embedded html one-liner", function(assert) {
  assert.compilesTo('p id="yes" class="no" One <b>asd</b>!', '<p id="yes" class="no">One <b>asd</b>!</p>');
});

QUnit.test("bracketed attributes", function(assert) {
  var emblem;
  emblem = "p [\n  id=\"yes\"\n  class=\"no\" ]\n  | Bracketed Attributes FTW!";
  assert.compilesTo(emblem, '<p id="yes" class="no">Bracketed Attributes FTW!</p>');
});

QUnit.test("bracketed mustache attributes", function(assert) {
  var emblem;
  emblem = "p [\n  onclick={ action 'foo' }\n  class=\"no\" ]\n  | Bracketed Attributes FTW!";
  assert.compilesTo(emblem, '<p onclick={{action \'foo\'}} class="no">Bracketed Attributes FTW!</p>');
});

QUnit.test("bracketed text", function(assert) {
  var emblem;
  emblem = "p [ Bracketed text is cool ]";
  assert.compilesTo(emblem, '<p>[ Bracketed text is cool ]</p>');
});

QUnit.test("bracketed text indented", function(assert) {
  var emblem;
  emblem = "p\n  | [ Bracketed text is cool ]";
  assert.compilesTo(emblem, '<p>[ Bracketed text is cool ]</p>');
});

QUnit.test('bracketed statement with comment and blank lines', function(assert) {
  var emblem = w('div [',
                 '  foo=bar',
                 '',
                 '  ',
                 '  / We need to add more',
                 ']');
  assert.compilesTo(
    emblem, '<div foo={{bar}}></div>');
});

QUnit.test('bracketed statement end bracket', function(assert) {
  var emblem = w('div [',
                 '  foo=bar',
                 '  ',
                 '  data=baz ]');
  assert.compilesTo(
    emblem, '<div foo={{bar}} data={{baz}}></div>');
});

QUnit.test("nesting", function(assert) {
  var emblem;
  emblem = "p class=\"hello\" data-foo=\"gnarly\"\n  span Yes";
  assert.compilesTo(emblem, '<p data-foo="gnarly" class="hello"><span>Yes</span></p>');
});


QUnit.module("attributes: full attributes - mixed quotes");

QUnit.test("single empty", function(assert) {
  assert.compilesTo("p class=''", '<p class=""></p>');
});

QUnit.test("single full", function(assert) {
  assert.compilesTo("p class='woot yeah'", '<p class="woot yeah"></p>');
});

QUnit.test("mixed", function(assert) {
  assert.compilesTo("p class='woot \"oof\" yeah'", '<p class="woot \\"oof\\" yeah"></p>');
});

QUnit.module("attributes: full attributes - tags without content");

QUnit.test("empty", function(assert) {
  assert.compilesTo('p class=""', '<p class=""></p>');
});

QUnit.test("class only", function(assert) {
  assert.compilesTo('p class="yes"', '<p class="yes"></p>');
});

QUnit.test("id only", function(assert) {
  assert.compilesTo('p id="yes"', '<p id="yes"></p>');
});

QUnit.test("class and id", function(assert) {
  assert.compilesTo('p id="yes" class="no"', '<p id="yes" class="no"></p>');
});

QUnit.module("attributes: full attributes w/ mustaches");

QUnit.test("with mustache", function(assert) {
  var emblem;
  assert.compilesTo('p class="foo {{yes}}"', '<p class="foo {{yes}}"></p>');
  assert.compilesTo('p class="foo {{yes}}" Hello', '<p class="foo {{yes}}">Hello</p>');
  emblem = "p class=\"foo {{yes}}\"\n  | Hello";
  assert.compilesTo(emblem, '<p class="foo {{yes}}">Hello</p>');
});

QUnit.test("with mustache calling helper", function(assert) {
  var emblem;

  assert.compilesTo('p class="foo {{{echo "YES"}}}"',
             '<p class="foo {{{echo \\"YES\\"}}}"></p>');

  assert.compilesTo('p class="foo #{echo "NO"} and {{{echo "YES"}}}" Hello',
             '<p class="foo {{echo \\"NO\\"}} and {{{echo \\"YES\\"}}}">Hello</p>');

  emblem = "p class=\"foo {{echo \"BORF\"}}\"\n  | Hello";
  assert.compilesTo(emblem, '<p class="foo {{echo \\"BORF\\"}}">Hello</p>');
});

QUnit.module("attributes: boolean");

QUnit.test("static", function(assert) {
  assert.compilesTo('p borf=true', '<p borf></p>');
  assert.compilesTo('p borf=true Woot', '<p borf>Woot</p>');
  assert.compilesTo('p borf=false', '<p></p>');
  assert.compilesTo('p borf=false Nork', '<p>Nork</p>');
  assert.compilesTo('option selected=true Thingeroo', '<option selected>Thingeroo</option>');
});

QUnit.module("attributes: numbers");

QUnit.test('number literals as attributes', function(assert) {
  assert.compilesTo('td colspan=3', '<td colspan=3></td>');
});

QUnit.test('large number literals as attributes', function(assert) {
  assert.compilesTo('td colspan=35234', '<td colspan=35234></td>');
});

QUnit.module("attributes: class name coalescing");

QUnit.test("when literal class is used", function(assert) {
  assert.compilesTo('p.foo class="bar"', '<p class="foo bar"></p>');
});

QUnit.test("when ember expression is used with variable", function(assert) {
  assert.compilesTo('p.foo class=bar',
             '<p class="foo {{bar}}"></p>');
});

QUnit.test("when ember expression is used with variable in braces", function(assert) {
  assert.compilesTo('p.foo class={ bar }',
             '<p class="foo {{bar}}"></p>');
});

QUnit.test("when ember expression is used with constant in braces", function(assert) {
  assert.compilesTo('p.foo class={ :bar }',
             '<p class="foo bar"></p>');
});

QUnit.test("when ember expression is used with constant and variable in braces", function(assert) {
  assert.compilesTo('p.foo class={ :bar bar }',
             '<p class="foo bar {{bar}}"></p>');
});

QUnit.module("attributes: shorthand: mustache DOM attribute shorthand");

QUnit.test("tagName w/o space", function(assert) {
  var emblem = "App.FunView%span";
  assert.compilesTo(emblem, '{{view App.FunView tagName="span"}}');
});

QUnit.test("tagName w/ space", function(assert) {
  var emblem = "App.FunView %span";
  assert.compilesTo(emblem, '{{view App.FunView tagName="span"}}');
});

QUnit.test("tagName block", function(assert) {
  var emblem = "App.FunView%span\n  p Hello";
  assert.compilesTo(emblem, '{{#view App.FunView tagName="span"}}<p>Hello</p>{{/view}}');
});

QUnit.test("class w/ space (needs space)", function(assert) {
  var emblem = "App.FunView .bork";
  assert.compilesTo(emblem, '{{view App.FunView class="bork"}}');
});

QUnit.test("multiple classes", function(assert) {
  var emblem = "App.FunView .bork.snork";
  assert.compilesTo(emblem, '{{view App.FunView class="bork snork"}}');
});

QUnit.test("elementId", function(assert) {
  var emblem = "App.FunView#ohno";
  assert.compilesTo(emblem, '{{view App.FunView elementId="ohno"}}');
});

QUnit.test("mixed w/ hash`", function(assert) {
  var emblem = "App.FunView .bork.snork funbags=\"yeah\"";
  assert.compilesTo(emblem, '{{view App.FunView funbags="yeah" class="bork snork"}}');
});

QUnit.test("mixture of all`", function(assert) {
  var emblem = 'App.FunView%alex#hell.bork.snork funbags="yeah"';
  assert.compilesTo(emblem, '{{view App.FunView funbags="yeah" tagName="alex" elementId="hell" class="bork snork"}}');
});

QUnit.module("attributes: bound and unbound");

QUnit.test("path with dot", function(assert) {
  var emblem = 'iframe src=post.pdfAttachment';
  assert.compilesTo(emblem, '<iframe src={{post.pdfAttachment}}></iframe>');

  emblem = 'iframe src=post.pdfAttachmentUrl width="96%" height="400" view="FitV" frameborder="0" style="z-index: 0 !important;"';
  assert.compilesTo(emblem,
                    '<iframe src={{post.pdfAttachmentUrl}} width="96%" height="400" view="FitV" frameborder="0" style="z-index: 0 !important;"></iframe>');
});

QUnit.test('mustache in attribute', function(assert) {
  var emblem = 'img src="{{unbound post.showLogoUrl}}" onerror="this.src=\'{{unbound orgSettings.onErrorBlankLogoImage}}\'"';
  assert.compilesTo(emblem, '<img src="{{unbound post.showLogoUrl}}" onerror="this.src=\'{{unbound orgSettings.onErrorBlankLogoImage}}\'">');
});

QUnit.test('mustache in attribute with exclamation point', function(assert) {
  var emblem = "a href=postLink! target='_blank'";
  assert.compilesTo(emblem, '<a href="{{unbound postLink}}" target="_blank"></a>');
});

QUnit.test('mustache attribute value has comma', function(assert) {
  var emblem = "a name='my, cool, name'";
  assert.compilesTo(emblem, '<a name="my, cool, name"></a>');
});

QUnit.test("mustache class binding", function(assert) {
  var emblem = 'iframe.foo class=dog';
  assert.compilesTo(emblem, '<iframe class="foo {{dog}}"></iframe>');
});

QUnit.test("numbers in shorthand", function(assert) {
  assert.compilesTo('#4a', '<div id="4a"></div>');
  assert.compilesTo('.4a', '<div class="4a"></div>');
  assert.compilesTo('.4', '<div class="4"></div>');
  assert.compilesTo('#4', '<div id="4"></div>');
  assert.compilesTo('%4', '<4></4>');
  assert.compilesTo('%4 ermagerd', '<4>ermagerd</4>');
  assert.compilesTo('%4#4.4 ermagerd', '<4 id="4" class="4">ermagerd</4>');
});

QUnit.test("negative numbers should work", function(assert) {
  assert.compilesTo("foo positive=100 negative=-100", '{{foo positive=100 negative=-100}}');
});

QUnit.test("booleans with and without quoting", function(assert) {
  assert.compilesTo('foo what=false', '{{foo what=false}}');
  assert.compilesTo('foo what="false"', '{{foo what="false"}}');
  assert.compilesTo("foo what='false'", '{{foo what=\'false\'}}');
});

QUnit.test("bound attributes from within strings", function(assert) {
  var emblem = 'div style="width: {{userProvidedWidth}}px;"';
  assert.compilesTo(emblem, '<div style="width: {{userProvidedWidth}}px;"></div>');
});

QUnit.module("attributes with inline if");

QUnit.test("with attribute and bound values", function(assert) {
  var emblem = 'div style={ if isActive foo bar }';
  assert.compilesTo(emblem, '<div style={{if isActive foo bar}}></div>');
});

QUnit.test("with attribute and bound values and legacy quoting", function(assert) {
  var emblem = 'div style={ if isActive foo bar }';
  assert.compilesTo(emblem, '<div style=\"{{if isActive foo bar}}\"></div>', null, {
    legacyAttributeQuoting: true
  });
});

QUnit.test("with attribute", function(assert) {
  var emblem = 'a href={ if isActive \'http://google.com\' \'http://bing.com\' }';
  assert.compilesTo(emblem, '<a href={{if isActive \'http://google.com\' \'http://bing.com\'}}></a>');
});

QUnit.test("with attribute and legacy quoting", function(assert) {
  var emblem = 'a href={ if isActive \'http://google.com\' \'http://bing.com\' }';
  assert.compilesTo(emblem, '<a href=\"{{if isActive \'http://google.com\' \'http://bing.com\'}}\"></a>', null, {
    legacyAttributeQuoting: true
  });
});

QUnit.test("with attribute and bound values", function(assert) {
  var emblem = 'a href={ if isActive google bing }';
  assert.compilesTo(emblem, '<a href={{if isActive google bing}}></a>');
});

QUnit.test("unbound attributes", function(assert) {
  var emblem = 'div class={ if isActive \'foo\' \'bar\' }';
  assert.compilesTo(emblem, '<div class={{if isActive \'foo\' \'bar\'}}></div>');
});

QUnit.test("bound attributes", function(assert) {
  var emblem = 'div class={ if isActive foo bar }';
  assert.compilesTo(emblem, '<div class={{if isActive foo bar}}></div>');
});

QUnit.test("mixed attributes", function(assert) {
  var emblem = 'div class={ if isActive \'foo\' bar }';
  assert.compilesTo(emblem, '<div class={{if isActive \'foo\' bar}}></div>');
});

QUnit.test("unbound attributes with full quote", function(assert) {
  var emblem = 'div class={ if isActive \"foo\" bar }';
  assert.compilesTo(emblem, '<div class={{if isActive \"foo\" bar}}></div>');
});

QUnit.test("one unbound option", function(assert) {
  var emblem = 'div class={ if isActive \"foo\" }';
  assert.compilesTo(emblem, '<div class={{if isActive \"foo\"}}></div>');
});

QUnit.test("one bound option", function(assert) {
  var emblem = 'div class={ if isActive foo }';
  assert.compilesTo(emblem, '<div class={{if isActive foo}}></div>');
});

QUnit.test('with unless', function(assert) {
  assert.compilesTo("div class={ unless isActive 'bar' }", '<div class={{unless isActive \'bar\'}}></div>')
});

QUnit.test("within a string", function(assert) {
  var emblem = 'div style="{{ if isActive \"15\" \"25\" }}px"';
  assert.compilesTo(emblem, '<div style=\"{{if isActive \\"15\\" \\"25\\" }}px\"></div>');
});

QUnit.test("with dot params", function(assert) {
  var emblem = w(
    "li class={ if content.length 'just-one' }",
    "  |Thing"
  );
  assert.compilesTo(emblem, "<li class={{if content.length 'just-one'}}>Thing</li>");
});

QUnit.test("mixed with subexpressions", function(assert) {
  var emblem = w(
    "li class={ if (has-one content.length) 'just-one' }",
    "  |Thing"
  );
  assert.compilesTo(emblem, "<li class={{if (has-one content.length) 'just-one'}}>Thing</li>");
});

QUnit.module("binding behavior for unquoted attribute values");

QUnit.test("basic", function(assert) {
  var emblem = 'p class=foo';
  assert.compilesTo(emblem, '<p class={{foo}}></p>');
});

QUnit.test("basic w/ underscore", function(assert) {
  var emblem = 'p class=foo_urns';
  assert.compilesTo(emblem, '<p class={{foo_urns}}></p>');
});

QUnit.test("subproperties", function(assert) {
  var emblem = 'p class=foo._death.woot';
  assert.compilesTo(emblem, '<p class={{foo._death.woot}}></p>');
});

QUnit.test("multiple", function(assert) {
  var emblem = 'p class=foo id="yup" data-thinger=yeah Hooray';
  assert.compilesTo(emblem, '<p id="yup" data-thinger={{yeah}} class={{foo}}>Hooray</p>');
});

QUnit.test("multiple with legacy quoting", function(assert) {
  var emblem = 'p class=foo id="yup" data-thinger=yeah Hooray';
  assert.compilesTo(emblem, '<p id="yup" data-thinger=\"{{yeah}}\" class={{foo}}>Hooray</p>', null, {
    legacyAttributeQuoting: true
  });
});

QUnit.test("in brackets", function(assert) {
  var emblem;
  emblem = "p [\n  id=id some-data=data.ok]\n";
  assert.compilesTo(emblem, '<p id={{id}} some-data={{data.ok}}></p>');
});

QUnit.test('brackets with empty lines', function(assert) {
  var emblem = w('p [',
                 '  id=id',
                 '  ',
                 '',
                 '  some-data=data.ok]');
  assert.compilesTo(emblem, '<p id={{id}} some-data={{data.ok}}></p>');
});

QUnit.test("class special syntax with 2 vals", function(assert) {
  var emblem = 'p class=foo:bar:baz';
  assert.compilesTo(emblem, '<p class={{if foo \'bar\' \'baz\'}}></p>');
});

QUnit.test("class special syntax with only 2nd val", function(assert) {
  var emblem = 'p class=foo::baz';
  assert.compilesTo(emblem, '<p class={{if foo \'\' \'baz\'}}></p>');
});

QUnit.test("class special syntax with only 1st val", function(assert) {
  var emblem = 'p class=foo:baz';
  assert.compilesTo(emblem, '<p class={{if foo \'baz\'}}></p>');
});

QUnit.test("class special syntax with slashes", function(assert) {
  var emblem = 'p class=foo/bar:baz';
  assert.compilesTo(emblem, '<p class={{if foo/bar \'baz\'}}></p>');
});

QUnit.test("Inline binding with mixed classes", function(assert) {
  var emblem = ".notice class={ test::active }";
  assert.compilesTo(emblem, '<div class=\"notice {{if test \'\' \'active\'}}\"></div>');
});

QUnit.test("class braced syntax w/ underscores and dashes", function(assert) {
  assert.compilesTo('p class={f-oo:bar :b_az}', '<p class="b_az {{if f-oo \'bar\'}}"></p>');
  assert.compilesTo('p class={ f-oo:bar :b_az }', '<p class="b_az {{if f-oo \'bar\'}}"></p>');
  assert.compilesTo('p class={ f-oo:bar :b_az } Hello', '<p class="b_az {{if f-oo \'bar\'}}">Hello</p>');
  var emblem = w(
    ".input-prepend class={ filterOn:input-append }",
    "  span.add-on"
  );
  assert.compilesTo(emblem, '<div class="input-prepend {{if filterOn \'input-append\'}}"><span class="add-on"></span></div>');
});

QUnit.test("multiple bindings with inline conditionals", function(assert) {
  var emblem = "button class={ thing1:active thing2:alert }";
  assert.compilesTo(emblem, '<button class=\"{{if thing1 \'active\'}} {{if thing2 \'alert\'}}\"></button>');
});

QUnit.test("exclamation modifier (ember)", function(assert) {
  var emblem = 'p class=foo!';
  assert.compilesTo(emblem, '<p class="{{unbound foo}}"></p>');
});

QUnit.test("block as #each", function(assert) {
  var emblem = w(
    'thangs',
    '  p Woot #{yeah}'
  );
  assert.compilesTo(emblem, '{{#thangs}}<p>Woot {{yeah}}</p>{{/thangs}}');
});
