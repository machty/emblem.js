/*global QUnit*/
import { w } from '../support/utils';

QUnit.module("mustache: simple");

test("various one-liners", function(assert){
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


test("double =='s un-escape", function(assert){
  var emblem = w(
    "== foo",
    "foo",
    "p == foo"
  );
  assert.compilesTo(emblem,
    '{{{foo}}}{{foo}}<p>{{{foo}}}</p>');
});

test("nested combo syntax", function(assert){
  var emblem = w(
    "ul = each items",
    "  li = foo"
  );
  assert.compilesTo(emblem,
    '<ul>{{#each items}}<li>{{foo}}</li>{{/each}}</ul>');
});

QUnit.module("mustache: capitalized line-starter");

test("should invoke `view` helper by default", function(assert){
  var emblem = w(
    "SomeView"
  );
  assert.compilesTo(emblem, '{{view SomeView}}');
});

test("should support block mode", function(assert){
  var emblem = w(
    "SomeView",
    "  p View content"
  );
  assert.compilesTo(emblem, '{{#view SomeView}}<p>View content</p>{{/view}}');
});

test("should not kick in if preceded by equal sign", function(assert){
  var emblem = w(
    "= SomeView"
  );
  assert.compilesTo(emblem, '{{SomeView}}');
});

test("should not kick in explicit {{mustache}}", function(assert){
  var emblem = w(
    "p Yeah {{SomeView}}"
  );
  assert.compilesTo(emblem, '<p>Yeah {{SomeView}}</p>');
});

QUnit.module('mustache: lower-case starting string');

test("recognizes double-quoted attrs", function(assert) {
  var emblem = 'frank text="yes"';
  assert.compilesTo(emblem, '{{frank text="yes"}}');
});

test("recognizes single-quoted attrs", function(assert) {
  var emblem = "frank text='yes'";
  assert.compilesTo(emblem, "{{frank text='yes'}}");
});

test("recognizes unquoted attrs", function(assert) {
  var emblem = "frank foo=bar";
  assert.compilesTo(emblem, "{{frank foo=bar}}");
});

test("sub-expressions are ok", function(assert) {
  var emblem = `
    = link-to 'content-manage.social' (query-params groupId=defaultGroup.id) tagName="li"
  `;
  assert.compilesTo(emblem,
                    '{{link-to \'content-manage.social\' (query-params groupId=defaultGroup.id) tagName="li"}}');
});

test('percent sign in quoted attr value', function(assert){
  var emblem = `
      = input placeholder="100%"
  `;
  assert.compilesTo(emblem, '{{input placeholder="100%"}}');
});

test('colon and semicolon in quoted attr value', function(assert){
  var emblem = `
      = input style="outline:blue; color:red"
  `;
  assert.compilesTo(emblem, '{{input style="outline:blue; color:red"}}');
});

QUnit.module('mustache: raw mustache unescaped');
    // _ Bork {{foo}} {{{bar}}}!

test('triple mustache in text line', function(assert){
  var emblem = `| bork {{{bar}}}`;
  assert.compilesTo(emblem, 'bork {{{bar}}}');
});

test('double mustache in text line', function(assert){
  var emblem = `| bork {{bar}}`;
  assert.compilesTo(emblem, 'bork {{bar}}');
});

test('hash stache in text line', function(assert){
  var emblem = `| bork #{bar}`;
  assert.compilesTo(emblem, 'bork {{bar}}');
});

QUnit.module("mustache: hash brace syntax, #{}");

test('acts like {{}}', function(assert){
  var emblem = "span Yo #{foo}, I herd.";
  assert.compilesTo(emblem,
    "<span>Yo {{foo}}, I herd.</span>");
});

test('can start inline content', function(assert){
  var emblem = "span #{foo}, I herd.";
  assert.compilesTo(emblem,
    "<span>{{foo}}, I herd.</span>");
});

test('can end inline content', function(assert){
  var emblem = "span I herd #{foo}";
  assert.compilesTo(emblem,
    "<span>I herd {{foo}}</span>");
});

test("doesn't screw up parsing when # used in text nodes", function(assert){
  var emblem = "span OMG #YOLO";
  assert.compilesTo(emblem,
    "<span>OMG #YOLO</span>");
});

test("# can be only thing on line", function(assert){
  var emblem = "span #";
  assert.compilesTo(emblem,
    "<span>#</span>");
});

QUnit.module("mustache: inline block helper");

test("text only", function(assert) {
  var emblem;
  emblem = "view SomeView | Hello";
  assert.compilesTo(emblem, '{{#view SomeView}}Hello{{/view}}');
});

test("multiline", function(assert) {
  var emblem;
  emblem = w("view SomeView | Hello,",
             "  How are you?",
             "  Sup?");
  assert.compilesTo(emblem, '{{#view SomeView}}Hello, How are you? Sup?{{/view}}');
});

test("more complicated", function(assert) {
  var emblem;
  emblem = "view SomeView borf=\"yes\" | Hello, How are you? Sup?";
  assert.compilesTo(emblem, '{{#view SomeView borf="yes"}}Hello, How are you? Sup?{{/view}}');
});

test("GH-26: no need for space before equal sign", function(assert) {
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
  return assert.compilesTo(emblem, '<div class="hooray">{{foo}}</div>');
});

QUnit.module('mustache: in-tag explicit mustache');

test("single", function(assert) {
  return assert.compilesTo('p{inTagHelper foo}', '<p {{inTagHelper foo}}></p>');
});

test("double", function(assert) {
  return assert.compilesTo('p{{inTagHelper foo}}', '<p {{inTagHelper foo}}></p>');
});

test("triple", function(assert) {
  return assert.compilesTo('p{{{inTagHelper foo}}}', '<p {{{inTagHelper foo}}}></p>');
});

test("with singlestache", function(assert) {
  return assert.compilesTo('p{insertClass foo} Hello', '<p {{insertClass foo}}>Hello</p>');
});

test("singlestache can be used in text nodes", function(assert) {
  return assert.compilesTo('p Hello {dork}', '<p>Hello {dork}</p>');
});

test("with doublestache", function(assert) {
  return assert.compilesTo('p{{insertClass foo}} Hello', '<p {{insertClass foo}}>Hello</p>');
});

test("with triplestache", function(assert) {
  return assert.compilesTo('p{{{insertClass foo}}} Hello', '<p {{{insertClass foo}}}>Hello</p>');
});

test("multiple", function(assert) {
  return assert.compilesTo('p{{{insertClass foo}}}{{{insertClass boo}}} Hello', '<p {{{insertClass foo}}} {{{insertClass boo}}}>Hello</p>');
});

test("with nesting", function(assert) {
  var emblem;
  emblem = "p{{bind-attr class=\"foo\"}}\n  span Hello";
  return assert.compilesTo(emblem, '<p {{bind-attr class="foo"}}><span>Hello</span></p>');
});

test('more nesting', function(assert){
  var emblem = w('',
                 'sally',
                 '  p Hello');
  assert.compilesTo(emblem, '{{#sally}}<p>Hello</p>{{/sally}}');
});

test('recursive nesting', function(assert){
  var emblem = w('',
                 'sally',
                 '  sally',
                 '    p Hello');
  assert.compilesTo(emblem, '{{#sally}}{{#sally}}<p>Hello</p>{{/sally}}{{/sally}}');
});

test('recursive nesting part 2', function(assert){
  var emblem = w('',
                 'sally',
                 '  sally thing',
                 '    p Hello');
  assert.compilesTo(emblem, '{{#sally}}{{#sally thing}}<p>Hello</p>{{/sally}}{{/sally}}');
});

test('use of "this"', function(assert){
  var emblem = w('',
                 'each foo',
                 '  p = this',
                 '  this');
  assert.compilesTo(emblem,'{{#each foo}}<p>{{this}}</p>{{this}}{{/each}}');
});

// FIXME
/*
test('bracketed nested statement', function(assert){
  var emblem = w('',
                 'sally [',
                 '  \'foo\'',
                 '  something="false" ]',
                 '  |  Bracketed helper attrs!');
  assert.compilesTo(
    emblem, '{{#sally \'foo\' something="false"}}Bracketed helper attrs!{{/sally}}');
});

test('bracketed nested block', function(assert){
  var emblem = w('',
                 'sally [',
                 '  \'foo\'',
                 '  something="false" ]',
                 '  p Bracketed helper attrs!');
  assert.compilesTo(
    emblem, '{{#sally \'foo\' something="false"}}<p>Bracketed helper attrs!</p>{{/sally}}');
});
*/
