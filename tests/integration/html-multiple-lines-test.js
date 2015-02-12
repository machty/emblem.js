import Emblem from '../../emblem';
import { w } from '../support/utils';

QUnit.module("html multiple lines");

QUnit.test("two lines", function(assert){
  var emblem = w(
    "p This is",
    "  pretty cool."
  );
  assert.compilesTo(emblem, "<p>This is pretty cool.</p>");
});

QUnit.test("three lines", function(assert){
  var emblem = w(
    "p This is",
    "  pretty damn",
    "  cool."
  );
  assert.compilesTo(emblem, "<p>This is pretty damn cool.</p>");
});

QUnit.test("three lines w/ embedded html", function(assert){
  var emblem = w(
    "p This is",
    "  pretty <span>damn</span>",
    "  cool."
  );
  assert.compilesTo(emblem, "<p>This is pretty <span>damn</span> cool.</p>");
});

QUnit.test("indentation doesn't need to match starting inline content's", function(assert){
  var emblem = w(
    "span Hello,",
    "  How are you?"
  );
  assert.compilesTo(emblem, "<span>Hello, How are you?</span>");
});

QUnit.test("indentation may vary between parent/child, must be consistent within inline-block", function(assert){
  var emblem = w(
    "div",
    "      span Hello,",
    "           How are you?",
    "           Excellent.",
    "      p asd"
  );
  assert.compilesTo(emblem,
    "<div><span>Hello, How are you? Excellent.</span><p>asd</p></div>");

  emblem = w(
    "div",
    "  span Hello,",
    "       How are you?",
    "     Excellent."
  );
  assert.throws(function(){
    Emblem.compile(emblem);
  });
});

QUnit.test("indentation may vary between parent/child, must be consistent within inline-block pt 2", function(assert){
  var emblem = w(
    "div",
    "  span Hello,",
    "       How are you?",
    "       Excellent."
  );

  assert.compilesTo(emblem,
    "<div><span>Hello, How are you? Excellent.</span></div>");
});


QUnit.test("w/ mustaches", function(assert){
  var emblem = w(
    "div",
    "  span Hello,",
    "       {{foo}} are you?",
    "       Excellent."
  );

  assert.compilesTo(emblem,
    "<div><span>Hello, {{foo}} are you? Excellent.</span></div>");
});

// This test seems to test nonsense syntax
QUnit.test("w/ block mustaches", function(assert){
  var emblem = w(
    "p Hello, #{ sally | Hello},",
    "  and {{sally: span Hello}}!"
  );

  assert.compilesTo(emblem,
    '<p>Hello, {{sally | Hello}}, and {{sally: span Hello}}!</p>');

  emblem = "p Hello, #{ sally: span: a Hello}!";
  assert.compilesTo(emblem,
    '<p>Hello, {{sally: span: a Hello}}!</p>');
});

QUnit.test("with followup", function(assert){
  var emblem = w(
    "p This is",
    "  pretty cool.",
    "p Hello."
  );
  assert.compilesTo(emblem, "<p>This is pretty cool.</p><p>Hello.</p>");
});

QUnit.test("can start with angle bracket html and go to multiple lines", function(assert){
  var emblem = w(
    "<span>Hello dude,",
    "      what's up?</span>"
  );
  assert.compilesTo(emblem, "<span>Hello dude,\nwhat's up?</span>");
});
