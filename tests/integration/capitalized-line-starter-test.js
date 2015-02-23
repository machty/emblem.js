/*global QUnit*/
import { w } from '../support/utils';

QUnit.module("capitalized line-starter");

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

test("should not kick in if preceded by equal sign (example with partial)", function(assert){
  var emblem = w(
    '= partial "cats"'
  );
  assert.compilesTo(emblem, '{{partial "cats"}}');
});

test("should not kick in explicit {{mustache}}", function(assert){
  var emblem = w(
    "p Yeah {{SomeView}}"
  );
  assert.compilesTo(emblem, '<p>Yeah {{SomeView}}</p>');
});

