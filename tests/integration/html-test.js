/*global QUnit*/

import Emblem from '../../emblem';
import { w } from '../support/utils';
import { compilesTo } from '../support/integration-assertions';

QUnit.module("html: single line");

QUnit.test("element only", function(){
  compilesTo("p", "<p></p>");
});

QUnit.test("with text", function(){
  compilesTo("p Hello", "<p>Hello</p>");
});

QUnit.test("with more complex text", function(){
  compilesTo(
    "p Hello, how's it going with you today?",
    "<p>Hello, how's it going with you today?</p>"
  );
});

QUnit.test("with trailing space", function(){
  compilesTo("p Hello   ", "<p>Hello   </p>");
});

QUnit.test("can start with angle bracket html", function(){
  var emblem = "<span>Hello</span>";
  compilesTo(emblem, "<span>Hello</span>");
});

QUnit.module("html: multiple lines");

QUnit.test("two lines", function(){
  var emblem = w(
    "p This is",
    "  pretty cool."
  );
  compilesTo(emblem, "<p>This is pretty cool.</p>");
});

QUnit.test("three lines", function(){
  var emblem = w(
    "p This is",
    "  pretty damn",
    "  cool."
  );
  compilesTo(emblem, "<p>This is pretty damn cool.</p>");
});

QUnit.test("three lines w/ embedded html", function(){
  var emblem = w(
    "p This is",
    "  pretty <span>damn</span>",
    "  cool."
  );
  compilesTo(emblem, "<p>This is pretty <span>damn</span> cool.</p>");
});

QUnit.test("indentation doesn't need to match starting inline content's", function(){
  var emblem = w(
    "  span Hello,",
    "    How are you?"
  );
  compilesTo(emblem, "<span>Hello, How are you?</span>");
});

QUnit.test("indentation may vary between parent/child, must be consistent within inline-block", function(){
  var emblem = w(
    "div",
    "      span Hello,",
    "           How are you?",
    "           Excellent.",
    "      p asd"
  );
  compilesTo(emblem,
    "<div><span>Hello, How are you? Excellent.</span><p>asd</p></div>");

  emblem = w(
    "div",
    "  span Hello,",
    "       How are you?",
    "     Excellent."
  );
  QUnit.throws(function(){
    Emblem.compile(emblem);
  });
});

QUnit.test("indentation may vary between parent/child, must be consistent within inline-block pt 2", function(){
  var emblem = w(
    "div",
    "  span Hello,",
    "       How are you?",
    "       Excellent."
  );

  compilesTo(emblem,
    "<div><span>Hello, How are you? Excellent.</span></div>");
});


QUnit.test("w/ mustaches", function(){
  var emblem = w(
    "div",
    "  span Hello,",
    "       {{foo}} are you?",
    "       Excellent."
  );

  compilesTo(emblem,
    "<div><span>Hello, {{foo}} are you? Excellent.</span></div>");
});

// FIXME: This test seems to test nonsense syntax ?
QUnit.test("w/ block mustaches", function(){
  var emblem = w(
    "p Hello, #{ sally | Hello},",
    "  and {{sally: span Hello}}!"
  );

  compilesTo(emblem,
    '<p>Hello, {{sally | Hello}}, and {{sally: span Hello}}!</p>');

  emblem = "p Hello, #{ sally: span: a Hello}!";
  compilesTo(emblem,
    '<p>Hello, {{sally: span: a Hello}}!</p>');
});

QUnit.test("with followup", function(){
  var emblem = w(
    "p This is",
    "  pretty cool.",
    "p Hello."
  );
  compilesTo(emblem, "<p>This is pretty cool.</p><p>Hello.</p>");
});

QUnit.test("can start with angle bracket html and go to multiple lines", function(){
  var emblem = w(
    "<span>Hello dude,",
    "      what's up?</span>"
  );
  compilesTo(emblem, "<span>Hello dude, what's up?</span>");
});

QUnit.module("html: nested");

test("basic", function(){
  var emblem = w(
    "p",
    "  span Hello",
    "  strong Hi",
    "div",
    "  p Hooray"
  );
  compilesTo(emblem,
    '<p><span>Hello</span><strong>Hi</strong></p><div><p>Hooray</p></div>');
});

test("empty nest", function(){
  var emblem = w(
    "p",
    "  span",
    "    strong",
    "      i"
  );
  compilesTo(emblem, '<p><span><strong><i></i></strong></span></p>');
});

test("empty nest w/ attribute shorthand", function(){
  var emblem = w(
    "p.woo",
    "  span#yes",
    "    strong.no.yes",
    "      i"
  );
  compilesTo(emblem,
    '<p class="woo"><span id="yes"><strong class="no yes"><i></i></strong></span></p>');
});

QUnit.module("html: self-closing html tags");

test("br", function() {
  var emblem;
  emblem = "br";
  compilesTo(emblem, '<br>');
});

test("hr", function(assert) {
  var emblem;
  emblem = "hr";
  compilesTo(emblem, '<hr>');
});

test("br paragraph example", function() {
  var emblem;
  emblem = "p\n  | LOL!\n  br\n  | BORF!";
  compilesTo(emblem, '<p>LOL!<br>BORF!</p>');
});

test("input", function() {
  var emblem;
  emblem = "input type=\"text\"";
  compilesTo(emblem, '<input type="text">');
});

test("nested content under self-closing tag should fail", function() {
  var emblem = "hr\n | here is text";
  QUnit.throws( function(){
    Emblem.compile(emblem);
  }, /cannot nest/i);
});
