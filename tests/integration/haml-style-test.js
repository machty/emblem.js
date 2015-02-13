/*global QUnit*/

QUnit.module("haml style");

test("basic", function(assert) {
  var emblem;
  emblem = "%borf";
  return assert.compilesTo(emblem, '<borf></borf>');
});

test("nested", function(assert) {
  var emblem;
  emblem = "%borf\n    %sporf Hello";
  return assert.compilesTo(emblem, '<borf><sporf>Hello</sporf></borf>');
});

test("capitalized", function(assert) {
  var emblem;
  emblem = "%Alex alex\n%Alex\n  %Woot";
  return assert.compilesTo(emblem, '<Alex>alex</Alex><Alex><Woot></Woot></Alex>');
});

test("funky chars", function(assert) {
  var emblem;
  emblem = "%borf:narf\n%borf:narf Hello, {{foo}}.\n%alex = foo";
  return assert.compilesTo(emblem,
                           '<borf:narf></borf:narf><borf:narf>Hello, {{foo}}.</borf:narf><alex>{{foo}}</alex>');
});
