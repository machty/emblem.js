/*global QUnit*/
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

test("arg-less helper", function(assert) {
  var emblem = 'p {{echo (hello)}}';
  assert.compilesTo(emblem, '<p>{{echo (hello)}}</p>');

  emblem = '= echo (hello)';
  assert.compilesTo(emblem, '{{echo (hello)}}');
});

test("helper w args", function(assert) {
  var emblem = 'p {{echo (equal 1 1)}}';
  assert.compilesTo(emblem, '<p>{{echo (equal 1 1)}}</p>');

  emblem = '= echo (equal 1 1)';
  assert.compilesTo(emblem, '{{echo (equal 1 1)}}');
});

test("supports much nesting", function(assert) {
  var emblem  = 'p {{echo (equal (equal 1 1) true)}}';
  assert.compilesTo(emblem, '<p>{{echo (equal (equal 1 1) true)}}</p>');
  emblem = '= echo (equal (equal 1 1) true)';
  assert.compilesTo(emblem, '{{echo (equal (equal 1 1) true)}}');
});

test("with hashes", function(assert) {
  var emblem  = 'p {{echo (equal (equal 1 1) true fun="yes")}}';
  assert.compilesTo(emblem, '<p>{{echo (equal (equal 1 1) true fun="yes")}}</p>');
  emblem = '= echo (equal (equal 1 1) true fun="yes")';
  assert.compilesTo(emblem, '{{echo (equal (equal 1 1) true fun="yes")}}');
});


test("as hashes", function(assert) {
  var emblem  = 'p {{echofun fun=(equal 1 1)}}';
  assert.compilesTo(emblem, '<p>{{echofun fun=(equal 1 1)}}</p>');

  // FIXME failing test:
  /*
  emblem = '= echofun fun=(equal 1 1)';
  assert.compilesTo(emblem, '{{echofun fun=(equal 1 1)}}');
  */
});

test("complex expression", function(assert) {
  var emblem  = 'p {{echofun true (hello how="are" you=false) 1 not=true fun=(equal "ECHO hello" (echo (hello))) win="yes"}}';
  assert.compilesTo(emblem, '<p>{{echofun true (hello how="are" you=false) 1 not=true fun=(equal "ECHO hello" (echo (hello))) win="yes"}}</p>');

  // FIXME failing tests:
  /*
  emblem = '= echofun true (hello how="are" you=false) 1 not=true fun=(equal "ECHO hello" (echo (hello))) win="yes"';
  assert.compilesTo(emblem, '{{echofun true (hello how="are" you=false) 1 not=true fun=(equal "ECHO hello" (echo (hello))) win="yes"}}');
  */
});
