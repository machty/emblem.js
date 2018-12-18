/*global QUnit*/

import { w } from '../support/utils';
import { compilesTo } from '../support/integration-assertions';

QUnit.module("syntax helpers: bang syntax");

QUnit.test("simple bang helper defaults to `unbound` invocation", function(assert) {
  var emblem;
  emblem = w("foo!");
  assert.compilesTo(emblem, '{{unbound foo}}');
});

QUnit.test("bang helper defaults to `unbound` invocation", function(assert) {
  var emblem;
  emblem = w("foo! Yar",
             "= foo!");
  assert.compilesTo(emblem,
                    '{{unbound foo Yar}}{{unbound foo}}');
});

QUnit.test("bang helper works with blocks", function(assert) {
  var emblem;
  emblem = w("hey! you suck",
             "  = foo!");
  assert.compilesTo(emblem,
                    '{{#unbound hey you suck}}{{unbound foo}}{{/unbound}}');
});

QUnit.module("syntax helpers: question mark");

QUnit.test("? helper defaults to `if` invocation", function(assert) {
  var emblem;
  emblem = "foo?\n  p Yeah";
  assert.compilesTo(emblem, '{{#if foo}}<p>Yeah</p>{{/if}}');
});

QUnit.test("else works", function(assert) {
  var emblem;
  emblem = "foo?\n  p Yeah\nelse\n  p No";
  assert.compilesTo(emblem, '{{#if foo}}<p>Yeah</p>{{else}}<p>No</p>{{/if}}');
});

QUnit.test("compound with text", function(assert) {
  var emblem;
  emblem = w("p = foo? ",
             "  | Hooray",
             "else",
             "  | No",
             "p = bar? ",
             "  | Hooray",
             "else",
             "  | No");
  assert.compilesTo(emblem,
                           '<p>{{#if foo}}Hooray{{else}}No{{/if}}</p>' +
                           '<p>{{#if bar}}Hooray{{else}}No{{/if}}</p>');
});

QUnit.test("compound with variables", function(assert) {
  var emblem;
  emblem = w("p = foo? ",
             "  bar",
             "else",
             "  baz");
  assert.compilesTo(emblem,
                           '<p>{{#if foo}}{{bar}}{{else}}{{baz}}{{/if}}</p>');
});
