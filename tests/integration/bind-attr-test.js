/*global QUnit*/

import { w } from '../support/utils';
import { compilesTo } from '../support/integration-assertions';

QUnit.module("binding behavior for unquoted attribute values");

test("basic", function() {
  var emblem = 'p class=foo';
  compilesTo(emblem, '<p class={{foo}}></p>');
});

test("basic w/ underscore", function() {
  var emblem = 'p class=foo_urns';
  compilesTo(emblem, '<p class={{foo_urns}}></p>');
});

test("subproperties", function() {
  var emblem = 'p class=foo._death.woot';
  compilesTo(emblem, '<p class={{foo._death.woot}}></p>');
});

test("multiple", function() {
  var emblem = 'p class=foo id="yup" data-thinger=yeah Hooray';
  compilesTo(emblem, '<p id="yup" data-thinger={{yeah}} class={{foo}}>Hooray</p>');
});

test("class special syntax with 2 vals", function() {
  var emblem = 'p class=foo:bar:baz';
  compilesTo(emblem, '<p class={{if foo \'bar\' \'baz\'}}></p>');
});

test("class special syntax with only 2nd val", function() {
  var emblem = 'p class=foo::baz';
  compilesTo(emblem, '<p class={{if foo \'\' \'baz\'}}></p>');
});

test("class special syntax with only 1st val", function() {
  var emblem = 'p class=foo:baz';
  compilesTo(emblem, '<p class={{if foo \'baz\'}}></p>');
});

test("Inline binding with mixed classes", function() {
  var emblem = ".notice class={ test::active }";
  compilesTo(emblem, '<div class=\"notice {{if test \'\' \'active\'}}\"></div>');
});

test("class braced syntax w/ underscores and dashes", function() {
  compilesTo('p class={f-oo:bar :b_az}', '<p class="b_az {{if f-oo \'bar\'}}"></p>');
  compilesTo('p class={ f-oo:bar :b_az }', '<p class="b_az {{if f-oo \'bar\'}}"></p>');
  compilesTo('p class={ f-oo:bar :b_az } Hello', '<p class="b_az {{if f-oo \'bar\'}}">Hello</p>');
  var emblem = w(
    ".input-prepend class={ filterOn:input-append }",
    "  span.add-on"
  );
  compilesTo(emblem, '<div class="input-prepend {{if filterOn \'input-append\'}}"><span class="add-on"></span></div>');
});

test("multiple bindings with inline conditionals", function() {
  var emblem = "button class={ thing1:active thing2:alert }";
  compilesTo(emblem, '<button class=\"{{if thing1 \'active\'}} {{if thing2 \'alert\'}}\"></button>');
});

test("exclamation modifier (ember)", function() {
  var emblem = 'p class=foo!';
  compilesTo(emblem, '<p class="{{unbound foo}}"></p>');
});

test("block as #each", function() {
  var emblem = w(
    'thangs',
    '  p Woot #{yeah}'
  );
  compilesTo(emblem, '{{#thangs}}<p>Woot {{yeah}}</p>{{/thangs}}');
});
