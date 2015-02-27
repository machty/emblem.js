/*global QUnit*/

import { w } from '../support/utils';
import Emblem from '../../emblem';
import { compilesTo } from '../support/integration-assertions';

QUnit.module("text: pipe character");

test('pipe (|) creates text', function(){
  compilesTo('| hello there', 'hello there');
});

test('pipe (|) multiline creates text', function(){
  compilesTo(w(
    '| hello there',
    '   and more'
  ), 'hello there and more');
});

test('pipe lines preserves leading spaces', function(){
  let fourSpaces = '    ';
  let threeSpaces = '   ';
  compilesTo(
    '|' + fourSpaces + 'hello there',
    threeSpaces + 'hello there');
});

test('multiple pipe lines are concatenated', function(){
  compilesTo(w(
    '| hi there',
    '| and more'
  ), 'hi thereand more');
});

QUnit.module("text: whitespace fussiness");

test("spaces after html elements", function(){
  compilesTo("p \n  span asd", "<p><span>asd</span></p>");
  compilesTo("p \nspan  \n\ndiv\nspan",
    "<p></p><span></span><div></div><span></span>");
});

test("spaces after mustaches", function(){
  compilesTo("each foo    \n  p \n  span",
    "{{#each foo}}<p></p><span></span>{{/each}}");
});

QUnit.module("text: preprocessor");

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

test('multiple text lines', function(){
  var emblem = `
     span Your name is name
       and my name is name`;
  compilesTo(emblem, '<span>Your name is name and my name is name</span>');
});

test('use an "\'" to add a space', function(){
  var emblem = `span
                 ' trailing space`;
  compilesTo(emblem, '<span>trailing space </span>');
});

QUnit.module("text: copy paste html");

test("indented", function() {
  var emblem;
  emblem = w("<p>",
             "  <span>This be some text</span>",
             "  <title>Basic HTML Sample Page</title>",
             "</p>");
  compilesTo(emblem, '<p> <span>This be some text</span> <title>Basic HTML Sample Page</title></p>');
});

test("flatlina", function() {
  var emblem;
  emblem = "<p>\n<span>This be some text</span>\n<title>Basic HTML Sample Page</title>\n</p>";
  compilesTo(emblem, '<p><span>This be some text</span><title>Basic HTML Sample Page</title></p>');
});

QUnit.module("text: indentation");

test("it doesn't throw when indenting after a line with inline content", function(){
  var emblem = w(
    "p Hello",
    "  p invalid"
  );
  compilesTo(emblem, "<p>Hello p invalid</p>");
});

test("it throws on half dedent", function(){
  var emblem = w(
    "p",
    "    span This is ok",
    "  span This aint"
  );
  QUnit.throws(function(){
    Emblem.compile(emblem);
  });
});

test("new indentation levels don't have to match parents'", function(){
  var emblem = w(
    "p ",
    "  span",
    "     div",
    "      span yes"
  );
  compilesTo(emblem, "<p><span><div><span>yes</span></div></span></p>");
});

test("Windows line endings", function() {
  var emblem;
  emblem = ".navigation\r\n  p Hello\r\n#main\r\n  | hi";
  compilesTo(
    emblem, '<div class="navigation"><p>Hello</p></div><div id="main">hi</div>');
});

test("backslash doesn't cause infinite loop", function() {
  var emblem;
  emblem = '| \\';
  compilesTo(emblem, "\\");
});

test("backslash doesn't cause infinite loop with letter", function() {
  var emblem;
  emblem = '| \\a';
  compilesTo(emblem, "\\a");
});

test("self closing tag with forward slash", function() {
  var emblem = 'hr/';
  compilesTo(emblem, '<hr>');

  // non-void elements are still closed correctly
  emblem = 'p/';
  compilesTo(emblem, '<p></p>');
});

test("tagnames and attributes with colons", function() {
  var emblem;
  emblem = '%al:ex match:neer="snork" Hello!';
  compilesTo(emblem, '<al:ex match:neer="snork">Hello!</al:ex>');
});

test("windows newlines", function() {
  var emblem;
  emblem = "\r\n  \r\n  p Hello\r\n\r\n";
  compilesTo(emblem, '<p>Hello</p>');
});

QUnit.module("text: EOL Whitespace");

test("shouldn't be necessary to insert a space", function() {
  var emblem;
  emblem = "p Hello,\n  How are you?\np I'm fine, thank you.";
  compilesTo(emblem, "<p>Hello, How are you?</p><p>I'm fine, thank you.</p>");
});

QUnit.module('text: indent/predent');

test("mixture", function() {
  var emblem;
  emblem = "        \n";
  emblem += "  p Hello\n";
  emblem += "  p\n";
  emblem += "    | Woot\n";
  emblem += "  span yes\n";
  return compilesTo(emblem, '<p>Hello</p><p>Woot</p><span>yes</span>');
});

test("mixture w/o opening blank", function() {
  var emblem;
  emblem = "  p Hello\n";
  emblem += "  p\n";
  emblem += "    | Woot\n";
  emblem += "  span yes\n";
  return compilesTo(emblem, '<p>Hello</p><p>Woot</p><span>yes</span>');
});

test("w/ blank lines", function() {
  var emblem;
  emblem = "  p Hello\n";
  emblem += "  p\n";
  emblem += "\n";
  emblem += "    | Woot\n";
  emblem += "\n";
  emblem += "  span yes\n";
  return compilesTo(emblem, '<p>Hello</p><p>Woot</p><span>yes</span>');
});

test("w/ blank whitespaced lines", function() {
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
  return compilesTo(emblem, '<p>Hello</p><p>Woot</p><span>yes</span>{{#sally}}Woot{{/sally}}');
});
