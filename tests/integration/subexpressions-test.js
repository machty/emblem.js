/*global QUnit*/

import { w } from '../support/utils';
import { compilesTo } from '../support/integration-assertions';

QUnit.module("subexpressions");

/*
Handlebars.registerHelper('echo', function(param) {
  return "ECHO " + param;
});

Handlebars.registerHelper('echofun', function() {
  var options;
  options = Array.prototype.pop.call(arguments);
  return "FUN = " + options.hash.fun;
});

Handlebars.registerHelper('hello', function(param) {
  return "hello";
});

Handlebars.registerHelper('equal', function(x, y) {
  return x === y;
});
*/

test("arg-less helper", function() {
  var emblem = 'p {{echo (hello)}}';
  compilesTo(emblem, '<p>{{echo (hello)}}</p>');

  emblem = '= echo (hello)';
  compilesTo(emblem, '{{echo (hello)}}');
});

test("helper w args", function() {
  var emblem = 'p {{echo (equal 1 1)}}';
  compilesTo(emblem, '<p>{{echo (equal 1 1)}}</p>');

  emblem = '= echo (equal 1 1)';
  compilesTo(emblem, '{{echo (equal 1 1)}}');
});

test("supports much nesting", function() {
  var emblem  = 'p {{echo (equal (equal 1 1) true)}}';
  compilesTo(emblem, '<p>{{echo (equal (equal 1 1) true)}}</p>');
  emblem = '= echo (equal (equal 1 1) true)';
  compilesTo(emblem, '{{echo (equal (equal 1 1) true)}}');
});

test("with hashes", function() {
  var emblem  = 'p {{echo (equal (equal 1 1) true fun="yes")}}';
  compilesTo(emblem, '<p>{{echo (equal (equal 1 1) true fun="yes")}}</p>');
  emblem = '= echo (equal (equal 1 1) true fun="yes")';
  compilesTo(emblem, '{{echo (equal (equal 1 1) true fun="yes")}}');
});

test("with multiple", function() {
  var emblem  = 'if (and (or true true) true)';
  compilesTo(emblem, '{{if (and (or true true) true)}}');
});

test("with multiple p2", function() {
  var emblem  = 'if (and (or true true) (or true true))';
  compilesTo(emblem, '{{if (and (or true true) (or true true))}}');
});

test("with multiple (mixed) p3", function() {
  var emblem = 'yield (hash title=(component "panel-title") body=(component "panel-content"))'
  compilesTo(emblem, '{{yield (hash title=(component \"panel-title\") body=(component \"panel-content\"))}}');
});

test("as hashes", function() {
  var emblem  = 'p {{echofun fun=(equal 1 1)}}';
  compilesTo(emblem, '<p>{{echofun fun=(equal 1 1)}}</p>');

  emblem = '= echofun fun=(equal 1 1)';
  compilesTo(emblem, '{{echofun fun=(equal 1 1)}}');
});

test("complex expression", function() {
  var emblem  = 'p {{echofun true (hello how="are" you=false) 1 not=true fun=(equal "ECHO hello" (echo (hello))) win="yes"}}';
  compilesTo(emblem, '<p>{{echofun true (hello how="are" you=false) 1 not=true fun=(equal "ECHO hello" (echo (hello))) win="yes"}}</p>');

  emblem = '= echofun true (hello how="are" you=false) 1 not=true fun=(equal "ECHO hello" (echo (hello))) win="yes"';
  var expected = '{{echofun true (hello how="are" you=false) 1 not=true fun=(equal "ECHO hello" (echo (hello))) win="yes"}}';
  compilesTo(emblem, expected);
});


test('subexpression brackets', function() {
  var emblem = w(
    '= my-component (hash [',
    '  foo',
    '])'
  );
  compilesTo(emblem,
    '{{my-component (hash foo)}}');
});

test('subexpression brackets and comment', function() {
  var emblem = w(
    '= my-component (hash [',
    '  foo',
    '  / There was another thing but oh well',
    '])'
  );
  compilesTo(emblem,
    '{{my-component (hash foo)}}');
});

test('subexpression brackets with subexpression', function() {
  var emblem = w(
    '= my-component (hash [',
    '  foo',
    '  bar=(eq 1 2)',
    '])'
  );
  compilesTo(emblem,
    '{{my-component (hash foo bar=(eq 1 2))}}');
});

test('subexpression brackets with nested brackets', function() {
  var emblem = w(
    '= my-component (hash [',
    '  foo',
    '  bar=(eq [',
    '    1',
    '    2',
    '    overwrite=true',
    '  ])',
    '])'
  );
  compilesTo(emblem,
    '{{my-component (hash foo bar=(eq 1 2 overwrite=true))}}');
});

test('yield with hash example (I-292)', function() {
  var emblem = w(
    '= yield (hash buttons=(hash [',
    '  saveSheet=(component [',
    '    \'save-sheet\'',
    '    isReadonly=isReadonly',
    '    buttonAction=(action saveComponent)',
    '  ])',
    '  fontFamily=(component [',
    '    \'font-family\'',
    '    isReadonly=isReadonly',
    '    buttonAction=(action applyStyles)',
    '  ])',
    ']))'
  );

  compilesTo(emblem,
    '{{yield (hash buttons=(hash saveSheet=(component \'save-sheet\' isReadonly=isReadonly buttonAction=(action saveComponent)) fontFamily=(component \'font-family\' isReadonly=isReadonly buttonAction=(action applyStyles))))}}');
});
