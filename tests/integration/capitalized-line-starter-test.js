/*global QUnit*/

import { w } from '../support/utils';
import { compilesTo } from '../support/integration-assertions';

QUnit.module("capitalized line-starter");

QUnit.test("should invoke `view` helper by default", function(){
  var emblem = w(
    "SomeView"
  );
  compilesTo(emblem, '{{view SomeView}}');
});

QUnit.test("should support block mode", function(){
  var emblem = w(
    "SomeView",
    "  p View content"
  );
  compilesTo(emblem, '{{#view SomeView}}<p>View content</p>{{/view}}');
});

QUnit.test("should not kick in if preceded by equal sign", function(){
  var emblem = w(
    "= SomeView"
  );
  compilesTo(emblem, '{{SomeView}}');
});

QUnit.test("should not kick in if preceded by equal sign (example with partial)", function(){
  var emblem = w(
    '= partial "cats"'
  );
  compilesTo(emblem, '{{partial "cats"}}');
});

QUnit.test("should not kick in explicit {{mustache}}", function(){
  var emblem = w(
    "p Yeah {{SomeView}}"
  );
  compilesTo(emblem, '<p>Yeah {{SomeView}}</p>');
});
