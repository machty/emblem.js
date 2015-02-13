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

QUnit.module("syntax helpers: question mark");

test("? helper defaults to `if` invocation", function(assert) {
  var emblem;
  emblem = "foo?\n  p Yeah";
  return assert.compilesTo(emblem, '{{#if foo}}<p>Yeah</p>{{/if}}');
});

test("else works", function(assert) {
  var emblem;
  emblem = "foo?\n  p Yeah\nelse\n  p No";
  return assert.compilesTo(emblem, '{{#if foo}}<p>Yeah</p>{{else}}<p>No</p>{{/if}}');
});

test("compound with text", function(assert) {
  var emblem;
  emblem = w("p = foo? ",
             "  | Hooray",
             "else",
             "  | No",
             "p = bar? ",
             "  | Hooray",
             "else",
             "  | No");
  return assert.compilesTo(emblem,
                           '<p>{{#if foo}}Hooray{{else}}No{{/if}}</p>' +
                           '<p>{{#if bar}}Hooray{{else}}No{{/if}}</p>');
});

test("compound with variables", function(assert) {
  var emblem;
  emblem = w("p = foo? ",
             "  bar",
             "else",
             "  baz");
  return assert.compilesTo(emblem,
                           '<p>{{#if foo}}{{bar}}{{else}}{{baz}}{{/if}}</p>');
});
