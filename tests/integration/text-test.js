/*global QUnit*/

import { w } from '../support/utils';
import { compilesTo } from '../support/integration-assertions';
import { compile } from 'emblem';

QUnit.module("text: pipe character");

QUnit.test('pipe (|) creates text', function(assert) {
  assert.compilesTo('| hello there', 'hello there');
});

QUnit.test('pipe (|) multiline creates text', function(assert) {
  assert.compilesTo(w(
    '| hello there',
    '   and more'
  ), 'hello there and more');
});

QUnit.test('pipe lines preserves leading spaces', function(assert) {
  let fourSpaces = '    ';
  let threeSpaces = '   ';
  assert.compilesTo(
    '|' + fourSpaces + 'hello there',
    threeSpaces + 'hello there');
});

QUnit.test('multiple pipe lines are concatenated', function(assert) {
  assert.compilesTo(w(
    '| hi there',
    '| and more'
  ), 'hi thereand more');
});

QUnit.module("text: whitespace fussiness");

QUnit.test("spaces after html elements", function(assert) {
  assert.compilesTo("p \n  span asd", "<p><span>asd</span></p>");
  assert.compilesTo("p \nspan  \n\ndiv\nspan",
    "<p></p><span></span><div></div><span></span>");
});

QUnit.test("spaces after mustaches", function(assert) {
  assert.compilesTo("each foo    \n  p \n  span",
    "{{#each foo}}<p></p><span></span>{{/each}}");
});

QUnit.module("text: preprocessor");

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

QUnit.test('multiple text lines', function(assert) {
  var emblem = `
     span Your name is name
       and my name is name`;
  assert.compilesTo(emblem, '<span>Your name is name and my name is name</span>');
});

QUnit.test('use an "\'" to add a space', function(assert) {
  var emblem = `span
                 ' trailing space`;
  assert.compilesTo(emblem, '<span>trailing space </span>');
});

QUnit.module("text: copy paste html");

QUnit.test("indented", function(assert) {
  var emblem;
  emblem = w("<p>",
             "  <span>This be some text</span>",
             "  <title>Basic HTML Sample Page</title>",
             "</p>");
  assert.compilesTo(emblem, '<p> <span>This be some text</span> <title>Basic HTML Sample Page</title></p>');
});

QUnit.test("flatlina", function(assert) {
  var emblem;
  emblem = "<p>\n<span>This be some text</span>\n<title>Basic HTML Sample Page</title>\n</p>";
  assert.compilesTo(emblem, '<p><span>This be some text</span><title>Basic HTML Sample Page</title></p>');
});

QUnit.module("text: indentation");

QUnit.test("it doesn't throw when indenting after a line with inline content", function(assert) {
  var emblem = w(
    "p Hello",
    "  p invalid"
  );
  assert.compilesTo(emblem, "<p>Hello p invalid</p>");
});

QUnit.test("it throws on half dedent", function(assert) {
  var emblem = w(
    "p",
    "    span This is ok",
    "  span This aint"
  );
  assert.throws(function(assert) {
    compile(emblem);
  });
});

QUnit.test("new indentation levels don't have to match parents'", function(assert) {
  var emblem = w(
    "p ",
    "  span",
    "     div",
    "      span yes"
  );
  assert.compilesTo(emblem, "<p><span><div><span>yes</span></div></span></p>");
});

QUnit.test("Windows line endings", function(assert) {
  var emblem;
  emblem = ".navigation\r\n  p Hello\r\n#main\r\n  | hi";
  assert.compilesTo(
    emblem, '<div class="navigation"><p>Hello</p></div><div id="main">hi</div>');
});

QUnit.test("backslash doesn't cause infinite loop", function(assert) {
  var emblem;
  emblem = '| \\';
  assert.compilesTo(emblem, "\\");
});

QUnit.test("backslash doesn't cause infinite loop with letter", function(assert) {
  var emblem;
  emblem = '| \\a';
  assert.compilesTo(emblem, "\\a");
});

QUnit.test("self closing tag with forward slash", function(assert) {
  var emblem = 'hr/';
  assert.compilesTo(emblem, '<hr>');

  // non-void elements are still closed correctly
  emblem = 'p/';
  assert.compilesTo(emblem, '<p></p>');
});

QUnit.test("tagnames and attributes with colons", function(assert) {
  var emblem;
  emblem = '%al:ex match:neer="snork" Hello!';
  assert.compilesTo(emblem, '<al:ex match:neer="snork">Hello!</al:ex>');
});

QUnit.test("windows newlines", function(assert) {
  var emblem;
  emblem = "\r\n  \r\n  p Hello\r\n\r\n";
  assert.compilesTo(emblem, '<p>Hello</p>');
});

QUnit.module("text: EOL Whitespace");

QUnit.test("shouldn't be necessary to insert a space", function(assert) {
  var emblem;
  emblem = "p Hello,\n  How are you?\np I'm fine, thank you.";
  assert.compilesTo(emblem, "<p>Hello, How are you?</p><p>I'm fine, thank you.</p>");
});

QUnit.module('text: indent/predent');

QUnit.test("mixture", function(assert) {
  var emblem;
  emblem = "        \n";
  emblem += "  p Hello\n";
  emblem += "  p\n";
  emblem += "    | Woot\n";
  emblem += "  span yes\n";
  assert.compilesTo(emblem, '<p>Hello</p><p>Woot</p><span>yes</span>');
});

QUnit.test("mixture w/o opening blank", function(assert) {
  var emblem;
  emblem = "  p Hello\n";
  emblem += "  p\n";
  emblem += "    | Woot\n";
  emblem += "  span yes\n";
  assert.compilesTo(emblem, '<p>Hello</p><p>Woot</p><span>yes</span>');
});

QUnit.test("w/ blank lines", function(assert) {
  var emblem;
  emblem = "  p Hello\n";
  emblem += "  p\n";
  emblem += "\n";
  emblem += "    | Woot\n";
  emblem += "\n";
  emblem += "  span yes\n";
  assert.compilesTo(emblem, '<p>Hello</p><p>Woot</p><span>yes</span>');
});

QUnit.test("w/ blank whitespaced lines", function(assert) {
  var emblem;
  emblem = "  p Hello\n";
  emblem += "  p\n";
  emblem += "\n";
  emblem += "    | Woot\n";
  emblem += "        \n";
  emblem += "       \n";
  emblem += "         \n";
  emblem += "\n";
  emblem += "  span yes\n";
  emblem += "\n";
  emblem += "  sally\n";
  emblem += "\n";
  emblem += "         \n";
  emblem += "    | Woot\n";
  assert.compilesTo(emblem, '<p>Hello</p><p>Woot</p><span>yes</span>{{#sally}}Woot{{/sally}}');
});
