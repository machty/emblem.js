/*global QUnit*/

import { compilesTo } from '../support/integration-assertions';

QUnit.module("haml style");

QUnit.test("basic", function(assert) {
  var emblem;
  emblem = "%borf";
  assert.compilesTo(emblem, '<borf></borf>');
});

QUnit.test("nested", function(assert) {
  var emblem;
  emblem = "%borf\n    %sporf Hello";
  assert.compilesTo(emblem, '<borf><sporf>Hello</sporf></borf>');
});

QUnit.test("capitalized", function(assert) {
  var emblem;
  emblem = "%Alex alex\n%Alex\n  %Woot";
  assert.compilesTo(emblem, '<Alex>alex</Alex><Alex><Woot></Woot></Alex>');
});

QUnit.test("funky chars", function(assert) {
  var emblem;
  emblem = "%borf:narf\n%borf:narf Hello, {{foo}}.\n%alex = foo";
  assert.compilesTo(emblem,
                           '<borf:narf></borf:narf><borf:narf>Hello, {{foo}}.</borf:narf><alex>{{foo}}</alex>');
});
