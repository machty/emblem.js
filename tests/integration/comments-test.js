/*global QUnit*/

import { w } from '../support/utils';
import { compilesTo } from '../support/integration-assertions';

QUnit.module("comments");

QUnit.test("it strips out single line '/' comments", function(){
  var emblem = w(
    "p Hello",
    "",
    "/ A comment",
    "",
    "h1 How are you?"
  );
  compilesTo(emblem, "<p>Hello</p><h1>How are you?</h1>");
});

QUnit.test("it strips out multi-line '/' comments", function(){
  var emblem = w(
    "p Hello",
    "",
    "/ A comment",
    "  that goes on to two lines",
    "  even three!",
    "",
    "h1 How are you?"
  );
  compilesTo(emblem, "<p>Hello</p><h1>How are you?</h1>");
});

QUnit.test("it strips out multi-line '/' comments without text on the first line", function(){
  var emblem = w(
    "p Hello",
    "",
    "/ ",
    "  A comment",
    "  that goes on to two lines",
    "  even three!",
    "",
    "h1 How are you?"
  );
  compilesTo(emblem, "<p>Hello</p><h1>How are you?</h1>");
});


QUnit.test("mix and match with various indentation", function(){
  var emblem = w(
    "/ A test",
    "p Hello",
    "",
    "span",
    "  / This is gnarly",
    "  p Yessir nope.",
    "",
    "/ Nothin but comments",
    "  so many comments.",
    "",
    "/",
    "  p Should not show up"
  );
  compilesTo(emblem, "<p>Hello</p><span><p>Yessir nope.</p></span>");
});

QUnit.test("uneven indentation", function(){
  var emblem = w(
    "/ nop",
    "  nope",
    "    nope"
  );
  compilesTo(emblem, "");
});

QUnit.test("uneven indentation 2", function(){
  var emblem = w(
    "/ n",
    "  no",
    "    nop",
    "  nope"
  );
  compilesTo(emblem, "");
});

QUnit.test("uneven indentation 3", function(){
  var emblem = w(
    "/ n",
    "  no",
    "    nop",
    "  nope"
  );
  compilesTo(emblem, "");
});


QUnit.test("empty first line", function(){
  var emblem = w(
    "/ ",
    "  nop",
    "  nope",
    "    nope",
    "  no"
  );
  compilesTo(emblem, "");
});

QUnit.test("on same line as html content", function(){
  var emblem = w(
    ".container / This comment doesn't show up",
    "  .row / Nor does this",
    "    p Hello"
  );
  compilesTo(emblem, '<div class="container"><div class="row"><p>Hello</p></div></div>');
});

QUnit.test("on same line as mustache content", function(){
  compilesTo('frank text="YES" text2="NO" / omg',
    '{{frank text="YES" text2="NO"}}');
});

QUnit.test("on same line as colon syntax", function(){
  var emblem = w(
    "ul: li: span / omg",
    "  | Hello"
  );
  compilesTo(emblem, "<ul><li><span>Hello</span></li></ul>");
});

