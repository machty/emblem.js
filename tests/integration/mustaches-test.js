/*global QUnit*/

import { w } from '../support/utils';
import { compilesTo } from '../support/integration-assertions';

QUnit.module("mustache: simple");

QUnit.test("various one-liners", function(assert) {
  var emblem = w(
    "= foo",
    "arf",
    "p = foo",
    "span.foo",
    'p data-foo="yes" = goo'
  );
  assert.compilesTo(emblem,
    '{{foo}}{{arf}}<p>{{foo}}</p><span class="foo"></span><p data-foo="yes">{{goo}}</p>');
});

QUnit.test('named argument syntax', function(assert) {
  assert.compilesTo('= @bar', '{{@bar}}');
});

QUnit.test("double =='s un-escape", function(assert) {
  var emblem = w(
    "== foo",
    "foo",
    "p == foo"
  );
  assert.compilesTo(emblem,
    '{{{foo}}}{{foo}}<p>{{{foo}}}</p>');
});

QUnit.test("nested combo syntax", function(assert) {
  var emblem = w(
    "ul = each items",
    "  li = foo"
  );
  assert.compilesTo(emblem,
    '<ul>{{#each items}}<li>{{foo}}</li>{{/each}}</ul>');
});

QUnit.module("mustache: block params");

QUnit.test("anything after 'as' goes in block params", function(assert) {
  var emblem = w(
    "= each foos as |foo|"
  );
  assert.compilesTo(emblem,
    '{{each foos as |foo|}}');
});

QUnit.test("spaces between '||' and params are removed", function(assert) {
  assert.compilesTo("= each foos as |foo|", '{{each foos as |foo|}}');
  assert.compilesTo("= each foos as | foo |", '{{each foos as |foo|}}');
});

QUnit.test("multiple words work too", function(assert) {
  var emblem = w(
    "= my-helper as |foo bar|"
  );
  assert.compilesTo(emblem,
    '{{my-helper as |foo bar|}}');
});

QUnit.test("block form works for the 'with' helper", function(assert) {
  var emblem = w(
    "= with car.manufacturer as |make|",
    "  p {{make.name}}"
  );
  assert.compilesTo(emblem,
    '{{#with car.manufacturer as |make|}}<p>{{make.name}}</p>{{/with}}');
});

QUnit.test("block form works for components", function(assert) {
  var emblem = w(
    "= my-component as |item|",
    "  p {{item.name}}"
  );
  assert.compilesTo(emblem,
    '{{#my-component as |item|}}<p>{{item.name}}</p>{{/my-component}}');
});

QUnit.module("mustache: capitalized line-starter");

QUnit.test("should invoke `view` helper by default", function(assert) {
  var emblem = w(
    "SomeView"
  );
  assert.compilesTo(emblem, '{{view SomeView}}');
});

QUnit.test("should support block mode", function(assert) {
  var emblem = w(
    "SomeView",
    "  p View content"
  );
  assert.compilesTo(emblem, '{{#view SomeView}}<p>View content</p>{{/view}}');
});

QUnit.test("should not kick in if preceded by equal sign", function(assert) {
  var emblem = w(
    "= SomeView"
  );
  assert.compilesTo(emblem, '{{SomeView}}');
});

QUnit.test("should not kick in explicit {{mustache}}", function(assert) {
  var emblem = w(
    "p Yeah {{SomeView}}"
  );
  assert.compilesTo(emblem, '<p>Yeah {{SomeView}}</p>');
});

QUnit.module('mustache: lower-case starting string');

QUnit.test("recognizes double-quoted attrs", function(assert) {
  var emblem = 'frank text="yes"';
  assert.compilesTo(emblem, '{{frank text="yes"}}');
});

QUnit.test("recognizes single-quoted attrs", function(assert) {
  var emblem = "frank text='yes'";
  assert.compilesTo(emblem, "{{frank text='yes'}}");
});

QUnit.test("recognizes unquoted attrs", function(assert) {
  var emblem = "frank foo=bar";
  assert.compilesTo(emblem, "{{frank foo=bar}}");
});

QUnit.test("sub-expressions are ok", function(assert) {
  var emblem = `
    = link-to 'content-manage.social' (query-params groupId=defaultGroup.id) tagName="li"
  `;
  assert.compilesTo(emblem,
                    '{{link-to \'content-manage.social\' (query-params groupId=defaultGroup.id) tagName="li"}}');
});

QUnit.test('percent sign in quoted attr value', function(assert) {
  var emblem = `
      = input placeholder="100%"
  `;
  assert.compilesTo(emblem, '{{input placeholder="100%"}}');
});

QUnit.test('colon and semicolon in quoted attr value', function(assert) {
  var emblem = `
      = input style="outline:blue; color:red"
  `;
  assert.compilesTo(emblem, '{{input style="outline:blue; color:red"}}');
});

QUnit.module('mustache: raw mustache unescaped');
    // _ Bork {{foo}} {{{bar}}}!

QUnit.test('triple mustache in text line', function(assert) {
  var emblem = `| bork {{{bar}}}`;
  assert.compilesTo(emblem, 'bork {{{bar}}}');
});

QUnit.test('double mustache in text line', function(assert) {
  var emblem = `| bork {{bar}}`;
  assert.compilesTo(emblem, 'bork {{bar}}');
});

QUnit.test('hash stache in text line', function(assert) {
  var emblem = `| bork #{bar}`;
  assert.compilesTo(emblem, 'bork {{bar}}');
});

QUnit.module("mustache: hash brace syntax, #{}");

QUnit.test('acts like {{}}', function(assert) {
  var emblem = "span Yo #{foo}, I herd.";
  assert.compilesTo(emblem,
    "<span>Yo {{foo}}, I herd.</span>");
});

QUnit.test('can start inline content', function(assert) {
  var emblem = "span #{foo}, I herd.";
  assert.compilesTo(emblem,
    "<span>{{foo}}, I herd.</span>");
});

QUnit.test('can end inline content', function(assert) {
  var emblem = "span I herd #{foo}";
  assert.compilesTo(emblem,
    "<span>I herd {{foo}}</span>");
});

QUnit.test("doesn't screw up parsing when # used in text nodes", function(assert) {
  var emblem = "span OMG #YOLO";
  assert.compilesTo(emblem,
    "<span>OMG #YOLO</span>");
});

QUnit.test("# can be only thing on line", function(assert) {
  var emblem = "span #";
  assert.compilesTo(emblem,
    "<span>#</span>");
});

QUnit.test("brace works with text pipe", function(assert) {
  var emblem = `= link-to 'users.view' user | View user #{ user.name } #{ user.id }`;
  assert.compilesTo(emblem, '{{#link-to \'users.view\' user}}View user {{user.name }} {{user.id }}{{/link-to}}');
});


QUnit.module("mustache: inline block helper");

QUnit.test("text only", function(assert) {
  var emblem;
  emblem = "view SomeView | Hello";
  assert.compilesTo(emblem, '{{#view SomeView}}Hello{{/view}}');
});

QUnit.test("multiline", function(assert) {
  var emblem;
  emblem = w("view SomeView | Hello,",
             "  How are you?",
             "  Sup?");
  assert.compilesTo(emblem, '{{#view SomeView}}Hello, How are you? Sup?{{/view}}');
});

QUnit.test("more complicated", function(assert) {
  var emblem;
  emblem = "view SomeView borf=\"yes\" | Hello, How are you? Sup?";
  assert.compilesTo(emblem, '{{#view SomeView borf="yes"}}Hello, How are you? Sup?{{/view}}');
});

QUnit.test("GH-26: no need for space before equal sign", function(assert) {
  var emblem;
  emblem = "span= foo";
  assert.compilesTo(emblem, '<span>{{foo}}</span>');
  emblem = "span.foo= foo";
  assert.compilesTo(emblem, '<span class="foo">{{foo}}</span>');
  emblem = "span#hooray.foo= foo";
  assert.compilesTo(emblem, '<span id="hooray" class="foo">{{foo}}</span>');
  emblem = "#hooray= foo";
  assert.compilesTo(emblem, '<div id="hooray">{{foo}}</div>');
  emblem = ".hooray= foo";
  assert.compilesTo(emblem, '<div class="hooray">{{foo}}</div>');
});

QUnit.module('mustache: in-tag explicit mustache');

QUnit.test("single", function(assert) {
  assert.compilesTo('p{inTagHelper foo}', '<p {{inTagHelper foo}}></p>');
});

QUnit.test("double", function(assert) {
  assert.compilesTo('p{{inTagHelper foo}}', '<p {{inTagHelper foo}}></p>');
});

QUnit.test("triple", function(assert) {
  assert.compilesTo('p{{{inTagHelper foo}}}', '<p {{{inTagHelper foo}}}></p>');
});

QUnit.test("with singlestache", function(assert) {
  assert.compilesTo('p{insertClass foo} Hello', '<p {{insertClass foo}}>Hello</p>');
});

QUnit.test("singlestache can be used in text nodes", function(assert) {
  assert.compilesTo('p Hello {dork}', '<p>Hello {dork}</p>');
});

QUnit.test("with doublestache", function(assert) {
  assert.compilesTo('p{{insertClass foo}} Hello', '<p {{insertClass foo}}>Hello</p>');
});

QUnit.test("with triplestache", function(assert) {
  assert.compilesTo('p{{{insertClass foo}}} Hello', '<p {{{insertClass foo}}}>Hello</p>');
});

QUnit.test("multiple", function(assert) {
  assert.compilesTo('p{{{insertClass foo}}}{{{insertClass boo}}} Hello', '<p {{{insertClass foo}}} {{{insertClass boo}}}>Hello</p>');
});

QUnit.test("with nesting", function(assert) {
  var emblem;
  emblem = "p{{bind-attr class=\"foo\"}}\n  span Hello";
  assert.compilesTo(emblem, '<p {{bind-attr class="foo"}}><span>Hello</span></p>');
});

QUnit.test('more nesting', function(assert) {
  var emblem = w('',
                 'sally',
                 '  p Hello');
  assert.compilesTo(emblem, '{{#sally}}<p>Hello</p>{{/sally}}');
});

QUnit.test('recursive nesting', function(assert) {
  var emblem = w('',
                 'sally',
                 '  sally',
                 '    p Hello');
  assert.compilesTo(emblem, '{{#sally}}{{#sally}}<p>Hello</p>{{/sally}}{{/sally}}');
});

QUnit.test('recursive nesting part 2', function(assert) {
  var emblem = w('',
                 'sally',
                 '  sally thing',
                 '    p Hello');
  assert.compilesTo(emblem, '{{#sally}}{{#sally thing}}<p>Hello</p>{{/sally}}{{/sally}}');
});

QUnit.test('use of "this"', function(assert) {
  var emblem = w('',
                 'each foo',
                 '  p = this',
                 '  this');
  assert.compilesTo(emblem,'{{#each foo}}<p>{{this}}</p>{{this}}{{/each}}');
});

QUnit.test('mustache attr with underscore', function(assert) {
  var emblem = 'input placeholder=cat_name';
  assert.compilesTo(emblem,'<input placeholder={{cat_name}}>');
});

QUnit.test('mustache with empty attr value (single-quoted string)', function(assert) {
  var emblem = "= input placeholder=''";
  assert.compilesTo(emblem, "{{input placeholder=''}}");
});

QUnit.test('mustache with empty attr value (double-quoted string)', function(assert) {
  var emblem = '= input placeholder=""';
  assert.compilesTo(emblem, '{{input placeholder=""}}');
});

QUnit.test('explicit mustache with "/" in name', function(assert) {
  var emblem = '= navigation/button-list';
  assert.compilesTo(emblem, '{{navigation/button-list}}');
});

QUnit.test('bracketed statement with comment and blank lines', function(assert) {
  var emblem = w('sally [',
                 '  \'foo\'',
                 '',
                 '  ',
                 '  / We need to add more',
                 ']');
  assert.compilesTo(
    emblem, '{{sally \'foo\'}}');
});

QUnit.test('bracketed nested statement', function(assert) {
  var emblem = w('',
                 'sally [',
                 '  \'foo\'',
                 '  something="false" ]',
                 '  | Bracketed helper attrs!');
  assert.compilesTo(
    emblem, '{{#sally \'foo\' something="false"}}Bracketed helper attrs!{{/sally}}');
});

QUnit.test('bracketed nested block params with block', function(assert) {
  var emblem = w('',
                 'sally [',
                 '  \'foo\'',
                 '  something="false" ]',
                 '  p Bracketed helper attrs!');
  assert.compilesTo(
    emblem, '{{#sally \'foo\' something="false"}}<p>Bracketed helper attrs!</p>{{/sally}}');
});

QUnit.test('bracketed statement with multiple initial arguments', function(assert) {
  var emblem = w('= component foo [',
                 '  bar=baz',
                 ']');
  assert.compilesTo(emblem, '{{component foo bar=baz}}');
});

QUnit.test('bracketed nested block params', function(assert) {
  var emblem = w('',
                 'sally [',
                 '  \'foo\'',
                 '  something="false" ] as |foo|');
  assert.compilesTo(
    emblem, '{{sally \'foo\' something="false" as |foo|}}');
});

QUnit.test('bracketed with block params and block', function(assert) {
  var emblem = w('',
                 'sally [',
                 '  \'foo\'',
                 '  something="false" ] as |foo|',
                 '  p = foo');
  assert.compilesTo(
    emblem, '{{#sally \'foo\' something="false" as |foo|}}<p>{{foo}}</p>{{/sally}}');
});

QUnit.test('bracketed with close on newline and with block', function(assert) {
  var emblem = w('',
                 'sally [',
                 '  \'foo\'',
                 '  something="false"',
                 ']',
                 '  p = foo');
  assert.compilesTo(
    emblem, '{{#sally \'foo\' something="false"}}<p>{{foo}}</p>{{/sally}}');
});

QUnit.test('bracketed with close on newline, with block params and block', function(assert) {
  var emblem = w('',
                 'sally [',
                 '  \'foo\'',
                 '  something="false"',
                 '] as |foo|',
                 '  p = foo');
  assert.compilesTo(
    emblem, '{{#sally \'foo\' something="false" as |foo|}}<p>{{foo}}</p>{{/sally}}');
});

QUnit.test('bracketed action attribute', function(assert) {
  var emblem = w('',
                 'button [',
                 '  click="doSomething" ]',
                 '  | click here');
  assert.compilesTo(
      emblem, '<button {{action "doSomething" on="click"}}>click here</button>');
});

QUnit.test("single-line mustaches can have elements right after", function(assert) {
  var emblem = w(
    'div',
    '  = thing',
    '  div' // significantly, this has no return character
  );
  assert.compilesTo(emblem,
    '<div>{{thing}}<div></div></div>');
});

QUnit.test("several bracketed attributes with closing bracket on final line", function(assert) {
  var emblem = w(
    "= asdf-asdf [",
    "  thing=res1",
    "  thi2ng='res2'",
    "  otherThing=res3",
    "]"
  );
  assert.compilesTo(emblem, '{{asdf-asdf thing=res1 thi2ng=\'res2\' otherThing=res3}}');
});

QUnit.test("several bracketed attributes without a block", function(assert) {
  var emblem = w(
    "= asdf-asdf [",
    "  thing=res1",
    "  thi2ng='res2'",
    "  otherThing=res3",
    "]",
    "p Hi there"
  );
  assert.compilesTo(emblem, '{{asdf-asdf thing=res1 thi2ng=\'res2\' otherThing=res3}}<p>Hi there</p>');
});

QUnit.test("several brackets with closing bracket on final line with a view", function(assert) {
  var emblem = w(
    "Ember.Select [",
    "  thing=res1",
    "  thi2ng='res2'",
    "  otherThing=\"res3\"",
    "]"
  );
  assert.compilesTo(emblem, '{{view Ember.Select thing=res1 thi2ng=\'res2\' otherThing="res3"}}');
});

QUnit.test("single-line mustaches can have array indexes", function(assert) {
  var emblem = w('my-component value=child.[0]');
  assert.compilesTo(emblem,
    '{{my-component value=child.[0]}}');
});

QUnit.test("single-line mustaches can have array indexes with bound indexes (not supported by Ember)", function(assert) {
  var emblem = w('my-component value=child.[someIndex]');
  assert.compilesTo(emblem,
    '{{my-component value=child.[someIndex]}}');
});

QUnit.test("multi-line mustaches can have array indexes with blocks", function(assert) {
  var emblem = w(
    'my-component [',
    '  value=child.[0] ]',
    '  | Thing'
  );
  assert.compilesTo(emblem,
    '{{#my-component value=child.[0]}}Thing{{/my-component}}');
});

QUnit.test("mustaches with else statement", function(assert) {
  var emblem = w(
    'some-component-with-inverse-yield',
    '  |foo',
    'else',
    '  |bar'
  );
  assert.compilesTo(emblem,
    '{{#some-component-with-inverse-yield}}foo{{else}}bar{{/some-component-with-inverse-yield}}');
});

QUnit.test('mustache with else if', function(assert) {
  var emblem = w(
    '= if foo',
    '  p Hi!',
    '= else if foo',
    '  p bye'
  );

  assert.compilesTo(emblem,
    '{{#if foo}}<p>Hi!</p>{{else if foo}}<p>bye</p>{{/if}}');
});

QUnit.test("mustaches with blocks and comments", function(assert) {
  var emblem = w(
    '/ Hi',
    '= if foo',
    '  p Hi',
    '/ Bye',
    '= else if bar',
    '  p bye'
  );
  assert.compilesTo(emblem,
    '{{#if foo}}<p>Hi</p>{{else if bar}}<p>bye</p>{{/if}}');
});

QUnit.test('mustache with else if and complex statements', function(assert) {
  var emblem = w(
    '= if foo',
    '  p Hi!',
    '= else if (eq 1 (and-or [',
    '  a=b',
    '  showHidden=(eq 1 2)',
    ']))',
    '  p Wow what was that?'
  );

  assert.compilesTo(emblem,
    '{{#if foo}}<p>Hi!</p>{{else if (eq 1 (and-or a=b showHidden=(eq 1 2)))}}<p>Wow what was that?</p>{{/if}}');
});

QUnit.test('named block support', function(assert) {
  var emblem = w(
    '= x-modal',
    '  % @header as |@title|',
    '    |Header #{title}',
    '  % @body',
    '    |Body',
    '  % @footer',
    '    |Footer'
  )

  assert.compilesTo(emblem, '{{#x-modal}}<@header as |@title|>Header {{title}}</@header><@body>Body</@body><@footer>Footer</@footer>{{/x-modal}}');
});

QUnit.test('named block with block param', function(assert) {
  var emblem = w(
    '= x-layout as |@widget|',
    '  = @widget as |a b c|',
    '    |Hi.'
  )

  assert.compilesTo(emblem, '{{#x-layout as |@widget|}}{{#@widget as |a b c|}}Hi.{{/@widget}}{{/x-layout}}');
});
