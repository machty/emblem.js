/*global QUnit*/
QUnit.module("whitespace fussiness");

test("spaces after html elements", function(assert){
  assert.compilesTo("p \n  span asd", "<p><span>asd</span></p>");
  assert.compilesTo("p \nspan  \n\ndiv\nspan",
    "<p></p><span></span><div></div><span></span>");
});

test("spaces after mustaches", function(assert){
  assert.compilesTo("each foo    \n  p \n  span",
    "{{#each foo}}<p></p><span></span>{{/each}}");
});

