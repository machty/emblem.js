import Emblem from '../../emblem'

QUnit.module("html multiple lines");

QUnit.test("two lines", function(assert){
  var emblem = [
    "p This is",
    "  pretty cool."
  ].join('\n');
  assert.compilesTo(emblem, "<p>This is pretty cool.</p>");
});

QUnit.test("three lines", function(assert){
  var emblem = [
    "p This is",
    "  pretty damn",
    "  cool."
  ].join('\n');
  assert.compilesTo(emblem, "<p>This is pretty damn cool.</p>");
});

QUnit.test("three lines w/ embedded html", function(assert){
  var emblem = [
    "p This is",
    "  pretty <span>damn</span>",
    "  cool."
  ].join('\n');
  assert.compilesTo(emblem, "<p>This is pretty <span>damn</span> cool.</p>");
});

QUnit.test("indentation doesn't need to match starting inline content's", function(assert){
  var emblem = [
    "span Hello,",
    "  How are you?"
  ].join('\n');
  assert.compilesTo(emblem, "<span>Hello, How are you?</span>");
});

QUnit.test("indentation may vary between parent/child, must be consistent within inline-block", function(assert){
  var emblem = [
    "div",
    "      span Hello,",
    "           How are you?",
    "           Excellent.",
    "      p asd"
  ].join('\n');
  assert.compilesTo(emblem,
    "<div><span>Hello, How are you? Excellent.</span><p>asd</p></div>");

  emblem = [
    "div",
    "  span Hello,",
    "       How are you?",
    "     Excellent."
  ].join('\n');
  assert.throws(function(){
    Emblem.compile(emblem);
  });
});

QUnit.test("indentation may vary between parent/child, must be consistent within inline-block pt 2", function(assert){
  var emblem = [
    "div",
    "  span Hello,",
    "       How are you?",
    "       Excellent."
  ].join('\n');

  assert.compilesTo(emblem,
    "<div><span>Hello, How are you? Excellent.</span></div>");
});


QUnit.test("w/ mustaches", function(assert){
  var emblem =[
    "div",
    "  span Hello,",
    "       {{foo}} are you?",
    "       Excellent."
  ].join('\n');

  assert.compilesTo(emblem,
    "<div><span>Hello, {{foo}} are you? Excellent.</span></div>");
});

QUnit.test("w/ block mustaches", function(assert){
  var emblem = [
    "p Hello, #{ sally | Hello},",
    "  and {{sally: span Hello}}!"
  ].join('\n');

  assert.compilesTo(emblem,
    '<p>Hello, <sally class="none">Hello</sally>, and <sally class="none"><span>Hello</span></sally>!</p>');

  emblem = "p Hello, #{ sally: span: a Hello}!";
  assert.compilesTo(emblem,
    '<p>Hello, <sally class="none"><span><a>Hello</a></span></sally>!</p>');
});

QUnit.test("with followup", function(assert){
  var emblem = [
    "p This is",
    "  pretty cool.",
    "p Hello."
  ].join('\n');
  assert.compilesTo(emblem, "<p>This is pretty cool.</p><p>Hello.</p>");
});
