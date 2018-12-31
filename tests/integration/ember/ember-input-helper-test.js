import { module, test } from 'qunit';
import { w } from 'tests/support/utils';

module('ember: input helper test', function (hooks) {
  test('example 1', function (assert) {
    const emblem = "input value=name oninput={ action (mut myValue) value='target.value' }";

    assert.compilesTo(emblem, "<input value={{name}} oninput={{action (mut myValue) value='target.value'}}>");
  });

  test('example 2', function (assert) {
    const emblem = "= input value=name itemChanged=(action (mut myValue))";

    assert.compilesTo(emblem, "{{input value=name itemChanged=(action (mut myValue))}}");
  });
});
