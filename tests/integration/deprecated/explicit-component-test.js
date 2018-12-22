import { module, test } from 'qunit';
import { w } from 'tests/support/utils';

module('deprecations: explicit components', function (hooks) {
  test("should invoke `view` helper by default", function (assert) {
    const emblem = w(
      "SomeView"
    );

    assert.compilesTo(emblem, '{{view SomeView}}');
  });

  test("should support block mode", function (assert) {
    const emblem = w(
      "SomeView",
      "  p View content"
    );

    assert.compilesTo(emblem, '{{#view SomeView}}<p>View content</p>{{/view}}');
  });
});
