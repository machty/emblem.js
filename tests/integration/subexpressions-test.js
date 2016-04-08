/*global QUnit*/

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
