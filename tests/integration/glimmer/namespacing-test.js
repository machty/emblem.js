import { module, test } from 'qunit';
import { w } from 'tests/support/utils';

module('glimmer: namespacing', function (hooks) {
  test("names with :", function (assert) {
    const emblem = w(
      "% inputs:MyComponent @value=foo"
    );

    assert.compilesTo(emblem,
      '<inputs:MyComponent @value={{foo}}/>');
  });

  test('module namespaces', function (assert) {
    const emblem = w(
      '% my-addon::foo'
    );

    assert.compilesTo(emblem, '<my-addon::foo/>');
  });
});
