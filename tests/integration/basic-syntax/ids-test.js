import { module, test } from 'qunit';

module('basic syntax: ids', function (hooks) {
  test('id only', function (assert) {
    assert.compilesTo('p id="yes" Hyeah', '<p id="yes">Hyeah</p>');
  });

  test('id shorthand', function (assert) {
    assert.compilesTo("#woot", '<div id="woot"></div>');
    assert.compilesTo("span#woot", '<span id="woot"></span>');
  });

  test('ids + classes', function (assert) {
    assert.compilesTo("#woot.foo", '<div id="woot" class="foo"></div>');
    assert.compilesTo("span#woot.bar.baz", '<span id="woot" class="bar baz"></span>');
  });

  test('numbers in shorthand', function (assert) {
    assert.compilesTo('#4a', '<div id="4a"></div>');
    assert.compilesTo('#4', '<div id="4"></div>');
  });
});
