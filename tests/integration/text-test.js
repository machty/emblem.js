/*global QUnit*/

import { w } from '../support/utils';
import Emblem from '../emblem';

QUnit.module("text: inline block helper");

test("text only", function(assert) {
  var emblem;
  emblem = "view SomeView | Hello";
  assert.compilesTo(emblem, '{{#view SomeView}}Hello{{/view}}');
});

test("multiline", function(assert) {
  var emblem;
  emblem = "view SomeView | Hello, \n  How are you? \n  Sup?";
  assert.compilesTo(emblem, '{{#view SomeView}}Hello, \nHow are you? \nSup?{{/view}}');
});

test("more complicated", function(assert) {
  var emblem;
  emblem = "view SomeView borf=\"yes\" | Hello, How are you? Sup?";
  assert.compilesTo(emblem, '{{#view SomeView borf="yes"}}Hello, How are you? Sup?{{/view}}');
});

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

// FIXME this is the way it should work -- newlines
// in the emblem should not be turned into newines in the
// output by default.
test('multiple text lines', function(assert){
  var emblem = `
     span Your name is name
       and my name is name
  `;
  assert.compilesTo(emblem, '<span>Your name is name and my name is name</span>');
});

test('use an "\'" to add a space', function(assert){
  var emblem = `span
                 ' trailing space`;
  assert.compilesTo(emblem, '<span>trailing space </span>');
});

QUnit.module("text: copy paste html");

test("indented", function(assert) {
  var emblem;
  emblem = "<p>\n  <span>This be some text</span>\n  <title>Basic HTML Sample Page</title>\n</p>";
  assert.compilesTo(emblem, '<p>\n<span>This be some text</span>\n<title>Basic HTML Sample Page</title></p>');
});

test("flatlina", function(assert) {
  var emblem;
  emblem = "<p>\n<span>This be some text</span>\n<title>Basic HTML Sample Page</title>\n</p>";
  assert.compilesTo(emblem, '<p><span>This be some text</span><title>Basic HTML Sample Page</title></p>');
});

QUnit.module("text: indentation");

test("it doesn't throw when indenting after a line with inline content", function(assert){
  var emblem = w(
    "p Hello",
    "  p invalid"
  );
  assert.compilesTo(emblem, "<p>Hello p invalid</p>");
});

test("it throws on half dedent", function(assert){
  var emblem = w(
    "p",
    "    span This is ok",
    "  span This aint"
  );
  assert.throws(function(){
    Emblem.compile(emblem);
  });
});

test("new indentation levels don't have to match parents'", function(assert){
  var emblem = w(
    "p ",
    "  span",
    "     div",
    "      span yes"
  );
  assert.compilesTo(emblem, "<p><span><div><span>yes</span></div></span></p>");
});


// FIXME maybe -- this test was commented out in the original test suite
/*
test("bigass", function(assert) {
  var emblem, expected;
  emblem = "<div class=\"content\">\n  <p>\n    We design and develop ambitious web and mobile applications, \n  </p>\n  <p>\n    A more official portfolio page is on its way, but in the meantime, \n    check out\n  </p>\n</div>";
  expected = '<div class="content">\n<p>  We design and develop ambitious web and mobile applications, \n</p>\n<p>  A more official portfolio page is on its way, but in the meantime, check out\n</p></div>';
  assert.compilesTo(emblem, expected);
});
*/
