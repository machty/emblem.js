/*global QUnit*/

import { w } from '../support/utils';
import { compilesTo } from '../support/integration-assertions';

QUnit.module("preprocessor");

QUnit.test("it strips out preceding whitespace", function(assert) {
  var emblem = w(
    "",
    "p Hello"
  );
  assert.compilesTo(emblem, "<p>Hello</p>");
});

QUnit.test("it handles preceding indentation", function(assert) {
  var emblem = w(
    "  p Woot",
    "  p Ha"
  );
  assert.compilesTo(emblem, "<p>Woot</p><p>Ha</p>");
});

QUnit.test("it handles preceding indentation and newlines", function(assert) {
  var emblem = w(
    "",
    "  p Woot",
    "  p Ha"
  );
  assert.compilesTo(emblem, "<p>Woot</p><p>Ha</p>");
});

QUnit.test("it handles preceding indentation and newlines pt 2", function(assert) {
  var emblem = w(
    "  ",
    "  p Woot",
    "  p Ha"
  );
  assert.compilesTo(emblem, "<p>Woot</p><p>Ha</p>");
});
