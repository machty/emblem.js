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

test('multiple text lines', function(assert){
  var emblem = `
     span Your name is name
       and my name is name
  `;
  assert.compilesTo(emblem, '<span>Your name is name and my name is name</span>');
});

test('use an "\'" to add a space', function(assert){
  var emblem = `span
                 ' trailing space`;
  assert.compilesTo(emblem, '<span>trailing space </span>');
});

/*
QUnit.module("mustache helpers");

Handlebars.registerHelper 'booltest', (options) function(assert){
  hash = options.hash
  result = if hash.what == true
    "true"
  else if hash.what == false
    "false"
  else "neither"
  result

Handlebars.registerHelper 'hashtypetest', (options) function(assert){
  hash = options.hash
  typeof hash.what

Handlebars.registerHelper 'typetest', (num, options) function(assert){
  typeof num

Handlebars.registerHelper 'frank', function(assert){
  options = arguments[arguments.length - 1]
  "WOO: #{options.hash.text} #{options.hash.text2}"

Handlebars.registerHelper 'sally', function(assert){
  options = arguments[arguments.length - 1]
  params = Array::slice.call arguments, 0, -1
  param = params[0] || 'none'
  if options.fn
    content = options.fn @
    new Handlebars.SafeString """<sally class="#{param}">#{content}</sally>"""
  else
    content = param
    new Handlebars.SafeString """<sally class="#{param}">#{content}</sally>"""

test("basic", function(assert){ shouldCompileTo 'echo foo', {foo: "YES"}, 'ECHO YES'

test("hashed parameters should work", function(assert){
  shouldCompileTo 'frank text="YES" text2="NO"', 'WOO: YES NO'

Handlebars.registerHelper 'concatenator', function(assert){
  options = arguments[arguments.length - 1]
  new Handlebars.SafeString ("'#{key}'='#{value}'" for key, value of options.hash).sort().join( " " )

test("negative integers should work", function(assert){
  shouldCompileTo 'concatenator positive=100 negative=-100', "'negative'='-100' 'positive'='100'"

test("booleans", function(assert){
  shouldCompileToString 'typetest true', 'boolean'
  shouldCompileToString 'typetest false', 'boolean'
  shouldCompileTo 'booltest what=false', 'false'
  shouldCompileTo 'booltest what=true',  'true'
  shouldCompileTo 'booltest what="false"',  'neither'
  shouldCompileTo 'booltest what="true"',  'neither'

test("integers", function(assert){
  shouldCompileToString 'typetest 200', 'number'
  shouldCompileTo 'hashtypetest what=1', 'number'
  shouldCompileTo 'hashtypetest what=200', 'number'

test("nesting", function(assert){
  var emblem = w(
  """
  sally
    p Hello
  """
  shouldCompileTo emblem, '<sally class="none"><p>Hello</p></sally>'

test("recursive nesting", function(assert){
  var emblem = w(
  """
  sally
    sally
      p Hello
  """
  shouldCompileTo emblem, '<sally class="none"><sally class="none"><p>Hello</p></sally></sally>'

test("recursive nesting pt 2", function(assert){
  var emblem = w(
  """
  sally
    sally thing
      p Hello
  """
  shouldCompileTo emblem, { thing: "woot" }, '<sally class="none"><sally class="woot"><p>Hello</p></sally></sally>'

test("bracketed nested statement", function(assert){
  var emblem = w(
  """
  sally [
    'foo'
    something="false" ]
    | Bracketed helper attrs!
  """
  shouldCompileTo emblem, '<sally class="foo">Bracketed helper attrs!</sally>'

test("bracketed nested block", function(assert){
  var emblem = w(
  """
  sally [
    'foo'
    something="false" ]
    p Bracketed helper attrs!
  """
  shouldCompileTo emblem, '<sally class="foo"><p>Bracketed helper attrs!</p></sally>'

Handlebars.registerHelper 'view', (param, a, b, c) function(assert){
  options = arguments[arguments.length - 1]
  content = param
  content = options.fn @ if options.fn
  hashString = ""
  for own k,v of options.hash
    hashString += " #{k}=#{v}"
  hashString = " nohash" unless hashString

  new Handlebars.SafeString """<#{param}#{hashString}>#{content}</#{param}>"""

 */
