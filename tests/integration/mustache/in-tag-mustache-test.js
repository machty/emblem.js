import { module, test } from 'qunit';
import { w } from 'tests/support/utils';

module('mustache: in tag mustache', function (hooks) {
  test('embedded mustache', function(assert) {
    assert.compilesTo('p class="foo {{yes}}"', '<p class="foo {{yes}}"></p>');
  });

  test('embedded mustache with inline block', function(assert) {
    assert.compilesTo('p class="foo {{yes}}" Hello', '<p class="foo {{yes}}">Hello</p>');
  });

  test('embedded mustache with pipe helper', function(assert) {
    const emblem = "p class=\"foo {{yes}}\"\n  | Hello";

    assert.compilesTo(emblem, '<p class="foo {{yes}}">Hello</p>');
  })

  test("single-line mustaches can have array indexes", function (assert) {
    const emblem = w('my-component value=child.[0]');

    assert.compilesTo(emblem, '{{my-component value=child.[0]}}');
  });

  test("single-line mustaches can have array indexes with bound indexes (not supported by Ember)", function (assert) {
    const emblem = w('my-component value=child.[someIndex]');

    assert.compilesTo(emblem, '{{my-component value=child.[someIndex]}}');
  });
});
