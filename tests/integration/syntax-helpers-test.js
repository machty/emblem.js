/*global QUnit*/
import { w } from '../support/utils';
QUnit.module("syntax helpers: bang syntax");

test("simple bang helper defaults to `unbound` invocation", function(assert) {
  var emblem;
  emblem = w("foo!");
  assert.compilesTo(emblem, '{{unbound foo}}');
});

test("bang helper defaults to `unbound` invocation", function(assert) {
  var emblem;
  emblem = w("foo! Yar",
             "= foo!");
  assert.compilesTo(emblem,
                    '{{unbound foo Yar}}{{unbound foo}}');
});

test("bang helper works with blocks", function(assert) {
  var emblem;
  emblem = w("hey! you suck",
             "  = foo!");
  assert.compilesTo(emblem,
                    '{{#unbound hey you suck}}{{unbound foo}}{{/unbound}}');
});
