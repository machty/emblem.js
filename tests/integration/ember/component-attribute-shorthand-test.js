import { module, test } from 'qunit';
import { w } from 'tests/support/utils';

module('ember: component attribute shorthand', function (hooks) {
  test('example 1', function(assert) {
    const emblem = "= my-component .foo.bar";

    assert.compilesTo(emblem, '{{my-component class="foo bar"}}');
  });

  test('example 2', function(assert) {
    const emblem = "= my-other-component #foo";

    assert.compilesTo(emblem, '{{my-other-component elementId="foo"}}');
  });

  test('example 3', function(assert) {
    const emblem = "= special-component %span";

    assert.compilesTo(emblem, '{{special-component tagName="span"}}');
  });
});
