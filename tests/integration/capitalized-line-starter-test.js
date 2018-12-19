/*global QUnit*/

import { w } from '../support/utils';
import { compilesTo } from '../support/integration-assertions';

QUnit.module("capitalized line-starter");

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

QUnit.test("should not kick in if preceded by equal sign (example with partial)", function(assert) {
  var emblem = w(
    '= partial "cats"'
  );
  assert.compilesTo(emblem, '{{partial "cats"}}');
});

QUnit.test("should not kick in explicit {{mustache}}", function(assert) {
  var emblem = w(
    "p Yeah {{SomeView}}"
  );
  assert.compilesTo(emblem, '<p>Yeah {{SomeView}}</p>');
});
