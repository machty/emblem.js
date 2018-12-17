/*global QUnit*/

import { w } from '../support/utils';
import { compilesTo } from '../support/integration-assertions';

QUnit.module("syntax helpers: bang syntax");

QUnit.test("simple bang helper defaults to `unbound` invocation", function() {
  var emblem;
  emblem = w("foo!");
  compilesTo(emblem, '{{unbound foo}}');
});

QUnit.test("bang helper defaults to `unbound` invocation", function() {
  var emblem;
  emblem = w("foo! Yar",
             "= foo!");
  compilesTo(emblem,
                    '{{unbound foo Yar}}{{unbound foo}}');
});

QUnit.test("bang helper works with blocks", function() {
  var emblem;
  emblem = w("hey! you suck",
             "  = foo!");
  compilesTo(emblem,
                    '{{#unbound hey you suck}}{{unbound foo}}{{/unbound}}');
});

QUnit.module("syntax helpers: question mark");

QUnit.test("? helper defaults to `if` invocation", function() {
  var emblem;
  emblem = "foo?\n  p Yeah";
  return compilesTo(emblem, '{{#if foo}}<p>Yeah</p>{{/if}}');
});

QUnit.test("else works", function() {
  var emblem;
  emblem = "foo?\n  p Yeah\nelse\n  p No";
  return compilesTo(emblem, '{{#if foo}}<p>Yeah</p>{{else}}<p>No</p>{{/if}}');
});

QUnit.test("compound with text", function() {
  var emblem;
  emblem = w("p = foo? ",
             "  | Hooray",
             "else",
             "  | No",
             "p = bar? ",
             "  | Hooray",
             "else",
             "  | No");
  return compilesTo(emblem,
                           '<p>{{#if foo}}Hooray{{else}}No{{/if}}</p>' +
                           '<p>{{#if bar}}Hooray{{else}}No{{/if}}</p>');
});

QUnit.test("compound with variables", function() {
  var emblem;
  emblem = w("p = foo? ",
             "  bar",
             "else",
             "  baz");
  return compilesTo(emblem,
                           '<p>{{#if foo}}{{bar}}{{else}}{{baz}}{{/if}}</p>');
});
