/*global QUnit*/

import { w } from '../support/utils';
import { compilesTo } from '../support/integration-assertions';

QUnit.module("bind-attr behavior for unquoted attribute values");

test("basic", function() {
  var emblem = 'p class=foo';
  compilesTo(emblem, '<p {{bind-attr class="foo"}}></p>');
});

test("basic w/ underscore", function() {
  var emblem = 'p class=foo_urns';
  compilesTo(emblem, '<p {{bind-attr class="foo_urns"}}></p>');
});

test("subproperties", function() {
  var emblem = 'p class=foo._death.woot';
  compilesTo(emblem, '<p {{bind-attr class="foo._death.woot"}}></p>');
});

test("multiple", function() {
  var emblem = 'p class=foo id="yup" data-thinger=yeah Hooray';
  compilesTo(emblem, '<p id="yup" {{bind-attr data-thinger=yeah}} {{bind-attr class="foo"}}>Hooray</p>');
});

test("class bind-attr special syntax", function() {
  var emblem = 'p class=foo:bar:baz';
  compilesTo(emblem, '<p {{bind-attr class="foo:bar:baz"}}></p>');
});

test("class bind-attr braced syntax w/ underscores and dashes", function() {
  compilesTo('p class={f-oo:bar :b_az}', '<p {{bind-attr class="f-oo:bar :b_az"}}></p>');
  compilesTo('p class={ f-oo:bar :b_az }', '<p {{bind-attr class="f-oo:bar :b_az"}}></p>');
  compilesTo('p class={ f-oo:bar :b_az } Hello', '<p {{bind-attr class="f-oo:bar :b_az"}}>Hello</p>');
  var emblem = w(
    ".input-prepend class={ filterOn:input-append }",
    "  span.add-on"
  );
  compilesTo(emblem, '<div {{bind-attr class=":input-prepend filterOn:input-append"}}><span class="add-on"></span></div>');
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
