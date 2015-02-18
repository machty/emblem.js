/* global QUnit */
import parse from 'emblem/mustache-parser';

QUnit.module('mustache-parser');

test('capitalized start', function(assert){
  var text = 'App.Funview';

  assert.deepEqual( parse(text), {
    name: 'App.Funview',
    attrs: []
  });
});

test('lowercase start', function(assert){
  var text = 'frank';

  assert.deepEqual( parse(text), {
    name: 'frank',
    attrs: []
  });
});

test('lowercase unquoted attr value', function(assert){
  var text = 'frank foo=bar';

  assert.deepEqual( parse(text), {
    name: 'frank',
    attrs: ['foo=bar']
  });
});

test('attrs with spaces', function(assert){
  var text = 'frank foo = bar boo = far';

  assert.deepEqual( parse(text), {
    name: 'frank',
    attrs: ['foo=bar', 'boo=far']
  });
});

test('multiple attrs', function(assert){
  var text = 'frank foo=bar boo=far';

  assert.deepEqual( parse(text), {
    name: 'frank',
    attrs: ['foo=bar', 'boo=far']
  });
});

test('lowercase double-quoted attr value', function(assert){
  var doubleQuote = 'input placeholder="\'100% /^%&*()x12#"';

  assert.deepEqual( parse(doubleQuote), {
    name: 'input',
    attrs: ['placeholder="\'100% /^%&*()x12#"']
  });
});

test('lowercase single-quoted attr value', function(assert){
  var singleQuote = "input placeholder='\"100% /^%&*()x12#'";

  assert.deepEqual( parse(singleQuote), {
    name: 'input',
    attrs: ["placeholder='\"100% /^%&*()x12#'"]
  });
});

test('query-params', function(assert){
  var text = 'frank (query-params groupId=defaultGroup.id)';

  assert.deepEqual( parse(text), {
    name: 'frank',
    attrs: ['(query-params groupId=defaultGroup.id)']
  });
});

test('nested query-params', function(assert){
  var text = 'frank (query-params groupId=defaultGroup.id (more-qp x=foo))';

  assert.deepEqual( parse(text), {
    name: 'frank',
    attrs: ['(query-params groupId=defaultGroup.id (more-qp x=foo))']
  });
});

test('mixed query-params and key-value attrs', function(assert){
  var text = 'frank (query-params abc=def) fob=bob (qp-2 dog=fog) dab=tab  ';

  assert.deepEqual( parse(text), {
    attrs: ['(query-params abc=def)',
            'fob=bob',
            '(qp-2 dog=fog)',
            'dab=tab'],
    name: 'frank'
  });
});

test('mustache name with dash', function(assert){
  var text = 'link-to foo=bar';

  assert.deepEqual( parse(text), {
    name: 'link-to',
    attrs: ['foo=bar']
  });
});

test('mustache with quoted param', function(assert){
  var text = 'link-to "abc.def"';

  assert.deepEqual( parse(text), {
    name: 'link-to',
    attrs: ['"abc.def"']
  });
});

test('mustache with unquoted param', function(assert){
  var text = 'link-to dog';

  assert.deepEqual( parse(text), {
    name: 'link-to',
    attrs: ['dog']
  });
});

test('mustache with multiple params', function(assert){
  var text = 'link-to "dog.tag" dog';

  assert.deepEqual( parse(text), {
    name: 'link-to',
    attrs: ['"dog.tag"', 'dog']
  });
});

test('mustache with shorthand % syntax', function(assert){
  var text = 'frank%span';

  assert.deepEqual( parse(text), {
    name: 'frank',
    attrs: ['tagName="span"']
  });
});

test('mustache with shorthand # syntax', function(assert){
  var text = 'frank#id-name';

  assert.deepEqual( parse(text), {
    name: 'frank',
    attrs: ['elementId="id-name"']
  });
});

test('mustache with shorthand . syntax with required space', function(assert){
  var text = 'frank .class-name';

  assert.deepEqual( parse(text), {
    name: 'frank',
    attrs: ['class="class-name"']
  });
});

test('mustache with multiple classes', function(assert){
  var text = 'frank .class-name1.class-name2';

  assert.deepEqual( parse(text), {
    name: 'frank',
    attrs: ['class="class-name1"',
            'class="class-name2"']
  });
});

test('mustache with multiple shorthands', function(assert){
  var text = 'frank%span#my-id.class-name';

  assert.deepEqual( parse(text), {
    name: 'frank',
    attrs: ['tagName="span"', 'elementId="my-id"', 'class="class-name"']
  });
});

test('mustache cannot start with a dot, a dash or a digit', function(assert){
  assert.throws( function() { parse('.frank'); } );
  assert.throws( function() { parse('-frank'); } );
  assert.throws( function() { parse('9frank'); } );
});

test("bang modifier", function(assert) {
  var text = 'foo!';

  assert.deepEqual( parse(text), {
    name: 'foo',
    attrs: [],
    modifier: '!'
  });
});

test("conditional modifier", function(assert) {
  var text = 'foo?';

  assert.deepEqual( parse(text), {
    name: 'foo',
    attrs: [],
    modifier: '?'
  });
});
