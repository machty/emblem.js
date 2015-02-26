/*global QUnit*/

import { w } from '../support/utils';
import { compilesTo } from '../support/integration-assertions';

QUnit.module("preprocessor");

QUnit.test("it strips out preceding whitespace", function(){
  var emblem = w(
    "",
    "p Hello"
  );
  compilesTo(emblem, "<p>Hello</p>");
});

QUnit.test("it handles preceding indentation", function(){
  var emblem = w(
    "  p Woot",
    "  p Ha"
  );
  compilesTo(emblem, "<p>Woot</p><p>Ha</p>");
});

QUnit.test("it handles preceding indentation and newlines", function(){
  var emblem = w(
    "",
    "  p Woot",
    "  p Ha"
  );
  compilesTo(emblem, "<p>Woot</p><p>Ha</p>");
});

QUnit.test("it handles preceding indentation and newlines pt 2", function(){
  var emblem = w(
    "  ",
    "  p Woot",
    "  p Ha"
  );
  compilesTo(emblem, "<p>Woot</p><p>Ha</p>");
});

