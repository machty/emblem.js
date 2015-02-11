QUnit.module("html single line");

QUnit.test("element only", function(assert){
  assert.compilesTo("p", "<p></p>");
});

QUnit.test("with text", function(assert){
  assert.compilesTo("p Hello", "<p>Hello</p>");
});

QUnit.test("with more complex text", function(assert){
  assert.compilesTo(
    "p Hello, how's it going with you today?",
    "<p>Hello, how's it going with you today?</p>"
  );
});

QUnit.test("with trailing space", function(assert){
  assert.compilesTo("p Hello   ", "<p>Hello   </p>");
});
