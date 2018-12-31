import { module, test } from 'qunit';

module('basic syntax: html-attributes', function (hooks) {
  module('boolean', function() {
    test('static', function (assert) {
      assert.compilesTo('p borf=true', '<p borf></p>');
      assert.compilesTo('p borf=true Woot', '<p borf>Woot</p>');
      assert.compilesTo('p borf=false', '<p></p>');
      assert.compilesTo('p borf=false Nork', '<p>Nork</p>');
      assert.compilesTo('option selected=true Thingeroo', '<option selected>Thingeroo</option>');
    });

    test('numbers in shorthand', function (assert) {
      assert.compilesTo('%4', '<4></4>');
      assert.compilesTo('%4 ermagerd', '<4>ermagerd</4>');
      assert.compilesTo('%4#4.4 ermagerd', '<4 id="4" class="4">ermagerd</4>');
    });
  });

  module('numbers', function() {
    test('number literals as attributes', function (assert) {
      assert.compilesTo('td colspan=3', '<td colspan=3></td>');
    });

    test('large number literals as attributes', function (assert) {
      assert.compilesTo('td colspan=35234', '<td colspan=35234></td>');
    });

    test('negative numbers should work', function (assert) {
      assert.compilesTo("foo positive=100 negative=-100", '{{foo positive=100 negative=-100}}');
    });
  });

  module('tags without content', function() {
    test('empty', function (assert) {
      assert.compilesTo('p class=""', '<p class=""></p>');
    });

    test('class only', function (assert) {
      assert.compilesTo('p class="yes"', '<p class="yes"></p>');
    });

    test('id only', function (assert) {
      assert.compilesTo('p id="yes"', '<p id="yes"></p>');
    });

    test('class and id', function (assert) {
      assert.compilesTo('p id="yes" class="no"', '<p id="yes" class="no"></p>');
    });
  });

  module('mixed quotes', function() {
    test('single empty', function (assert) {
      assert.compilesTo("p class=''", '<p class=""></p>');
    });

    test('single full', function (assert) {
      assert.compilesTo("p class='woot yeah'", '<p class="woot yeah"></p>');
    });

    test('mixed', function (assert) {
      assert.compilesTo("p class='woot \"oof\" yeah'", '<p class="woot \\"oof\\" yeah"></p>');
    });
  });
});
