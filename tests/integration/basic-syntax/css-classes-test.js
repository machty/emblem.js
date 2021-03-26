import { module, test } from 'qunit';

module('basic syntax: css-classes', function (hooks) {
  test('class only', function (assert) {
    assert.compilesTo('p class="yes" Blork', '<p class="yes">Blork</p>');
  });

  test('class shorthand', function (assert) {
    assert.compilesTo(".woot", '<div class="woot"></div>');
    assert.compilesTo("span.woot", '<span class="woot"></span>');
    assert.compilesTo("span.woot.loot", '<span class="woot loot"></span>');
    assert.compilesTo("span .woot.loot", '<span class="woot loot"></span>');
    assert.compilesTo("span.woot .loot", '<span class="woot loot"></span>');
  });

  test('classes + ids', function (assert) {
    assert.compilesTo(".woot#hello", '<div id="hello" class="woot"></div>');
    assert.compilesTo("#hello .woot", '<div id="hello" class="woot"></div>');
    assert.compilesTo(".woot #hello", '<div id="hello" class="woot"></div>');
    assert.compilesTo("#id.woot #hello", '<div id="hello" class="woot"></div>');
    assert.compilesTo("span.woot#hello", '<span id="hello" class="woot"></span>');
    assert.compilesTo("span .woot#hello", '<span id="hello" class="woot"></span>');
    assert.compilesTo("span.woot #hello", '<span id="hello" class="woot"></span>');
    assert.compilesTo("span.woot.loot#hello", '<span id="hello" class="woot loot"></span>');
    assert.compilesTo("span .woot.loot#hello", '<span id="hello" class="woot loot"></span>');
    assert.compilesTo("span.woot.loot #hello", '<span id="hello" class="woot loot"></span>');
    assert.compilesTo("span.woot.loot#hello.boot", '<span id="hello" class="woot loot boot"></span>');
    assert.compilesTo("span.woot.loot #hello.boot", '<span id="hello" class="woot loot boot"></span>');
    assert.compilesTo("span#id.woot.loot #hello.boot", '<span id="hello" class="woot loot boot"></span>');
    assert.compilesTo("span.woot#id.loot #hello.boot", '<span id="hello" class="woot loot boot"></span>');
  });

  test('class and id', function (assert) {
    assert.compilesTo('p id="yes" class="no" Blork', '<p id="yes" class="no">Blork</p>');
  });

  test('class and id and embedded html one-liner', function (assert) {
    assert.compilesTo('p id="yes" class="no" One <b>asd</b>!', '<p id="yes" class="no">One <b>asd</b>!</p>');
  });

  test('numbers in shorthand', function (assert) {
    assert.compilesTo('.4a', '<div class="4a"></div>');
    assert.compilesTo('.4', '<div class="4"></div>');
  });

  module('class name coalescing', function() {
    test('when literal class is used', function (assert) {
      assert.compilesTo('p.foo class="bar"', '<p class="foo bar"></p>');
    });

    test('when ember expression is used with variable', function (assert) {
      assert.compilesTo('p.foo class=bar',
        '<p class="foo {{bar}}"></p>');
    });

    test('when ember expression is used with variable in braces', function (assert) {
      assert.compilesTo('p.foo class={ bar }',
        '<p class="foo {{bar}}"></p>');
    });

    test('when ember expression is used with constant in braces', function (assert) {
      assert.compilesTo('p.foo class={ :bar }',
        '<p class="foo bar"></p>');
    });

    test('when ember expression is used with constant and variable in braces', function (assert) {
      assert.compilesTo('p.foo class={ :bar bar }',
        '<p class="foo bar {{bar}}"></p>');
    });
  });
});
