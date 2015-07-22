/*global QUnit*/

import { w } from '../support/utils';
import { compilesTo } from '../support/integration-assertions';

QUnit.module("mustache: simple");

test("various one-liners", function(){
  var emblem = w(
    "= foo",
    "arf",
    "p = foo",
    "span.foo",
    'p data-foo="yes" = goo'
  );
  compilesTo(emblem,
    '{{foo}}{{arf}}<p>{{foo}}</p><span class="foo"></span><p data-foo="yes">{{goo}}</p>');
});


test("double =='s un-escape", function(){
  var emblem = w(
    "== foo",
    "foo",
    "p == foo"
  );
  compilesTo(emblem,
    '{{{foo}}}{{foo}}<p>{{{foo}}}</p>');
});

test("nested combo syntax", function(){
  var emblem = w(
    "ul = each items",
    "  li = foo"
  );
  compilesTo(emblem,
    '<ul>{{#each items}}<li>{{foo}}</li>{{/each}}</ul>');
});

QUnit.module("mustache: block params");

test("anything after 'as' goes in block params", function(){
  var emblem = w(
    "= each foos as |foo|"
  );
  compilesTo(emblem,
    '{{each foos as |foo|}}');
});

test("spaces between '||' and params are removed", function(){
  compilesTo("= each foos as |foo|", '{{each foos as |foo|}}');
  compilesTo("= each foos as | foo |", '{{each foos as |foo|}}');
});

test("multiple words work too", function(){
  var emblem = w(
    "= my-helper as |foo bar|"
  );
  compilesTo(emblem,
    '{{my-helper as |foo bar|}}');
});

test("block form works for the 'with' helper", function(){
  var emblem = w(
    "= with car.manufacturer as |make|",
    "  p {{make.name}}"
  );
  compilesTo(emblem,
    '{{#with car.manufacturer as |make|}}<p>{{make.name}}</p>{{/with}}');
});

test("block form works for components", function(){
  var emblem = w(
    "= my-component as |item|",
    "  p {{item.name}}"
  );
  compilesTo(emblem,
    '{{#my-component as |item|}}<p>{{item.name}}</p>{{/my-component}}');
});

QUnit.module("mustache: capitalized line-starter");

test("should invoke `view` helper by default", function(){
  var emblem = w(
    "SomeView"
  );
  compilesTo(emblem, '{{view SomeView}}');
});

test("should support block mode", function(){
  var emblem = w(
    "SomeView",
    "  p View content"
  );
  compilesTo(emblem, '{{#view SomeView}}<p>View content</p>{{/view}}');
});

test("should not kick in if preceded by equal sign", function(){
  var emblem = w(
    "= SomeView"
  );
  compilesTo(emblem, '{{SomeView}}');
});

test("should not kick in explicit {{mustache}}", function(){
  var emblem = w(
    "p Yeah {{SomeView}}"
  );
  compilesTo(emblem, '<p>Yeah {{SomeView}}</p>');
});

QUnit.module('mustache: lower-case starting string');

test("recognizes double-quoted attrs", function() {
  var emblem = 'frank text="yes"';
  compilesTo(emblem, '{{frank text="yes"}}');
});

test("recognizes single-quoted attrs", function() {
  var emblem = "frank text='yes'";
  compilesTo(emblem, "{{frank text='yes'}}");
});

test("recognizes unquoted attrs", function() {
  var emblem = "frank foo=bar";
  compilesTo(emblem, "{{frank foo=bar}}");
});

test("sub-expressions are ok", function() {
  var emblem = `
    = link-to 'content-manage.social' (query-params groupId=defaultGroup.id) tagName="li"
  `;
  compilesTo(emblem,
                    '{{link-to \'content-manage.social\' (query-params groupId=defaultGroup.id) tagName="li"}}');
});

test('percent sign in quoted attr value', function(){
  var emblem = `
      = input placeholder="100%"
  `;
  compilesTo(emblem, '{{input placeholder="100%"}}');
});

test('colon and semicolon in quoted attr value', function(){
  var emblem = `
      = input style="outline:blue; color:red"
  `;
  compilesTo(emblem, '{{input style="outline:blue; color:red"}}');
});

QUnit.module('mustache: raw mustache unescaped');
    // _ Bork {{foo}} {{{bar}}}!

test('triple mustache in text line', function(){
  var emblem = `| bork {{{bar}}}`;
  compilesTo(emblem, 'bork {{{bar}}}');
});

test('double mustache in text line', function(){
  var emblem = `| bork {{bar}}`;
  compilesTo(emblem, 'bork {{bar}}');
});

test('hash stache in text line', function(){
  var emblem = `| bork #{bar}`;
  compilesTo(emblem, 'bork {{bar}}');
});

QUnit.module("mustache: hash brace syntax, #{}");

test('acts like {{}}', function(){
  var emblem = "span Yo #{foo}, I herd.";
  compilesTo(emblem,
    "<span>Yo {{foo}}, I herd.</span>");
});

test('can start inline content', function(){
  var emblem = "span #{foo}, I herd.";
  compilesTo(emblem,
    "<span>{{foo}}, I herd.</span>");
});

test('can end inline content', function(){
  var emblem = "span I herd #{foo}";
  compilesTo(emblem,
    "<span>I herd {{foo}}</span>");
});

test("doesn't screw up parsing when # used in text nodes", function(){
  var emblem = "span OMG #YOLO";
  compilesTo(emblem,
    "<span>OMG #YOLO</span>");
});

test("# can be only thing on line", function(){
  var emblem = "span #";
  compilesTo(emblem,
    "<span>#</span>");
});

test("brace works with text pipe", function() {
  var emblem = `= link-to 'users.view' user | View user #{ user.name } #{ user.id }`;
  compilesTo(emblem, '{{#link-to \'users.view\' user}}View user {{user.name }} {{user.id }}{{/link-to}}');
});


QUnit.module("mustache: inline block helper");

test("text only", function() {
  var emblem;
  emblem = "view SomeView | Hello";
  compilesTo(emblem, '{{#view SomeView}}Hello{{/view}}');
});

test("multiline", function() {
  var emblem;
  emblem = w("view SomeView | Hello,",
             "  How are you?",
             "  Sup?");
  compilesTo(emblem, '{{#view SomeView}}Hello, How are you? Sup?{{/view}}');
});

test("more complicated", function() {
  var emblem;
  emblem = "view SomeView borf=\"yes\" | Hello, How are you? Sup?";
  compilesTo(emblem, '{{#view SomeView borf="yes"}}Hello, How are you? Sup?{{/view}}');
});

test("GH-26: no need for space before equal sign", function() {
  var emblem;
  emblem = "span= foo";
  compilesTo(emblem, '<span>{{foo}}</span>');
  emblem = "span.foo= foo";
  compilesTo(emblem, '<span class="foo">{{foo}}</span>');
  emblem = "span#hooray.foo= foo";
  compilesTo(emblem, '<span id="hooray" class="foo">{{foo}}</span>');
  emblem = "#hooray= foo";
  compilesTo(emblem, '<div id="hooray">{{foo}}</div>');
  emblem = ".hooray= foo";
  return compilesTo(emblem, '<div class="hooray">{{foo}}</div>');
});

QUnit.module('mustache: in-tag explicit mustache');

test("single", function() {
  return compilesTo('p{inTagHelper foo}', '<p {{inTagHelper foo}}></p>');
});

test("double", function() {
  return compilesTo('p{{inTagHelper foo}}', '<p {{inTagHelper foo}}></p>');
});

test("triple", function() {
  return compilesTo('p{{{inTagHelper foo}}}', '<p {{{inTagHelper foo}}}></p>');
});

test("with singlestache", function() {
  return compilesTo('p{insertClass foo} Hello', '<p {{insertClass foo}}>Hello</p>');
});

test("singlestache can be used in text nodes", function() {
  return compilesTo('p Hello {dork}', '<p>Hello {dork}</p>');
});

test("with doublestache", function() {
  return compilesTo('p{{insertClass foo}} Hello', '<p {{insertClass foo}}>Hello</p>');
});

test("with triplestache", function() {
  return compilesTo('p{{{insertClass foo}}} Hello', '<p {{{insertClass foo}}}>Hello</p>');
});

test("multiple", function() {
  return compilesTo('p{{{insertClass foo}}}{{{insertClass boo}}} Hello', '<p {{{insertClass foo}}} {{{insertClass boo}}}>Hello</p>');
});

test("with nesting", function() {
  var emblem;
  emblem = "p{{bind-attr class=\"foo\"}}\n  span Hello";
  return compilesTo(emblem, '<p {{bind-attr class="foo"}}><span>Hello</span></p>');
});

test('more nesting', function(){
  var emblem = w('',
                 'sally',
                 '  p Hello');
  compilesTo(emblem, '{{#sally}}<p>Hello</p>{{/sally}}');
});

test('recursive nesting', function(){
  var emblem = w('',
                 'sally',
                 '  sally',
                 '    p Hello');
  compilesTo(emblem, '{{#sally}}{{#sally}}<p>Hello</p>{{/sally}}{{/sally}}');
});

test('recursive nesting part 2', function(){
  var emblem = w('',
                 'sally',
                 '  sally thing',
                 '    p Hello');
  compilesTo(emblem, '{{#sally}}{{#sally thing}}<p>Hello</p>{{/sally}}{{/sally}}');
});

test('use of "this"', function(){
  var emblem = w('',
                 'each foo',
                 '  p = this',
                 '  this');
  compilesTo(emblem,'{{#each foo}}<p>{{this}}</p>{{this}}{{/each}}');
});

test('mustache attr with underscore', function(){
  var emblem = 'input placeholder=cat_name';
  compilesTo(emblem,'<input placeholder={{cat_name}}>');
});

test('mustache with empty attr value (single-quoted string)', function(){
  var emblem = "= input placeholder=''";
  compilesTo(emblem, "{{input placeholder=''}}");
});

test('mustache with empty attr value (double-quoted string)', function(){
  var emblem = '= input placeholder=""';
  compilesTo(emblem, '{{input placeholder=""}}');
});

test('explicit mustache with "/" in name', function(){
  var emblem = '= navigation/button-list';
  compilesTo(emblem, '{{navigation/button-list}}');
});

test('bracketed nested statement', function(){
  var emblem = w('',
                 'sally [',
                 '  \'foo\'',
                 '  something="false" ]',
                 '  | Bracketed helper attrs!');
  compilesTo(
    emblem, '{{#sally \'foo\' something="false"}}Bracketed helper attrs!{{/sally}}');
});

test('bracketed nested block', function(){
  var emblem = w('',
                 'sally [',
                 '  \'foo\'',
                 '  something="false" ]',
                 '  p Bracketed helper attrs!');
  compilesTo(
    emblem, '{{#sally \'foo\' something="false"}}<p>Bracketed helper attrs!</p>{{/sally}}');
});

test('bracketed action attribute', function(){
  var emblem = w('',
                 'button [',
                 '  click="doSomething" ]',
                 '  | click here');
  compilesTo(
      emblem, '<button {{action "doSomething" on="click"}}>click here</button>');
});

test("single-line mustaches can have elements right after", function(){
  var emblem = w(
    'div',
    '  = thing',
    '  div' // significantly, this has no return character
  );
  compilesTo(emblem,
    '<div>{{thing}}<div></div></div>');
});

test("several bracketed attributes with closing bracket on final line", function() {
  var emblem = w(
    "= asdf-asdf [",
    "  thing=res1",
    "  thi2ng='res2'",
    "  otherThing=res3",
    "]"
  );
  return compilesTo(emblem, '{{asdf-asdf thing=res1 thi2ng=\'res2\' otherThing=res3}}');
});

test("several bracketed attributes without a block", function() {
  var emblem = w(
    "= asdf-asdf [",
    "  thing=res1",
    "  thi2ng='res2'",
    "  otherThing=res3",
    "]",
    "p Hi there"
  );
  return compilesTo(emblem, '{{asdf-asdf thing=res1 thi2ng=\'res2\' otherThing=res3}}<p>Hi there</p>');
});

test("several brackets with closing bracket on final line with a view", function() {
  var emblem = w(
    "Ember.Select [",
    "  thing=res1",
    "  thi2ng='res2'",
    "  otherThing=\"res3\"",
    "]"
  );
  return compilesTo(emblem, '{{view Ember.Select thing=res1 thi2ng=\'res2\' otherThing="res3"}}');
});

test("single-line mustaches can have array indexes", function(){
  var emblem = w('my-component value=child.[0]');
  compilesTo(emblem,
    '{{my-component value=child.[0]}}');
});

test("single-line mustaches can have array indexes with bound indexes (not supported by Ember)", function(){
  var emblem = w('my-component value=child.[someIndex]');
  compilesTo(emblem,
    '{{my-component value=child.[someIndex]}}');
});

test("multi-line mustaches can have array indexes with blocks", function(){
  var emblem = w(
    'my-component [',
    '  value=child.[0] ]',
    '  | Thing'
  );
  compilesTo(emblem,
    '{{#my-component value=child.[0]}}Thing{{/my-component}}');
});
