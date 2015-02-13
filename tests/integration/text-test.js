/*global QUnit*/

import { w } from '../support/utils';

QUnit.module("text: inline block helper");

/*
test("text only", function(assert) {
  var emblem;
  emblem = "view SomeView | Hello";
  assert.compilesTo(emblem, '<SomeView nohash>Hello</SomeView>');
});

test("multiline", function(assert) {
  var emblem;
  emblem = "view SomeView | Hello, \n  How are you? \n  Sup?";
  assert.compilesTo(emblem, '<SomeView nohash>Hello, How are you? Sup?</SomeView>');
});

test("more complicated", function(assert) {
  var emblem;
  emblem = "view SomeView borf=\"yes\" | Hello, \n  How are you? \n  Sup?";
  assert.compilesTo(emblem, '<SomeView borf=yes>Hello, How are you? Sup?</SomeView>');
});
*/

QUnit.module("text: whitespace fussiness");

test("spaces after html elements", function(assert){
  assert.compilesTo("p \n  span asd", "<p><span>asd</span></p>");
  assert.compilesTo("p \nspan  \n\ndiv\nspan",
    "<p></p><span></span><div></div><span></span>");
});

test("spaces after mustaches", function(assert){
  assert.compilesTo("each foo    \n  p \n  span",
    "{{#each foo}}<p></p><span></span>{{/each}}");
});


QUnit.module("text: preprocessor");

QUnit.test("it strips out preceding whitespace", function(assert){
  var emblem = w(
    "",
    "p Hello"
  );
  assert.compilesTo(emblem, "<p>Hello</p>");
});

QUnit.test("it handles preceding indentation", function(assert){
  var emblem = w(
    "  p Woot",
    "  p Ha"
  );
  assert.compilesTo(emblem, "<p>Woot</p><p>Ha</p>");
});

QUnit.test("it handles preceding indentation and newlines", function(assert){
  var emblem = w(
    "",
    "  p Woot",
    "  p Ha"
  );
  assert.compilesTo(emblem, "<p>Woot</p><p>Ha</p>");
});

QUnit.test("it handles preceding indentation and newlines pt 2", function(assert){
  var emblem = w(
    "  ",
    "  p Woot",
    "  p Ha"
  );
  assert.compilesTo(emblem, "<p>Woot</p><p>Ha</p>");
});

