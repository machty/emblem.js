/*global QUnit*/

import { compilesTo } from '../support/integration-assertions';

QUnit.module("haml style");

QUnit.test("basic", function() {
  var emblem;
  emblem = "%borf";
  return compilesTo(emblem, '<borf></borf>');
});

QUnit.test("nested", function() {
  var emblem;
  emblem = "%borf\n    %sporf Hello";
  return compilesTo(emblem, '<borf><sporf>Hello</sporf></borf>');
});

QUnit.test("capitalized", function() {
  var emblem;
  emblem = "%Alex alex\n%Alex\n  %Woot";
  return compilesTo(emblem, '<Alex>alex</Alex><Alex><Woot></Woot></Alex>');
});

QUnit.test("funky chars", function() {
  var emblem;
  emblem = "%borf:narf\n%borf:narf Hello, {{foo}}.\n%alex = foo";
  return compilesTo(emblem,
                           '<borf:narf></borf:narf><borf:narf>Hello, {{foo}}.</borf:narf><alex>{{foo}}</alex>');
});
