import { module, test } from 'qunit';
import { w } from 'tests/support/utils';

module('glimmer: brackets', function (hooks) {
  test('brackets with string', function (assert) {
    const emblem = w(
      '',
      '%MyComponent [',
      '  @foo=bar',
      '  @baz=\'food\' ]'
    );

    assert.compilesTo(emblem, '<MyComponent @foo={{bar}} @baz=\"food\"></MyComponent>');
  });

  test('brackets with dedent end', function (assert) {
    const emblem = w(
      '',
      '%MyComponent [',
      '  @foo=bar',
      '  @baz=\'food\'',
      ']'
    );

    assert.compilesTo(emblem, '<MyComponent @foo={{bar}} @baz=\"food\"></MyComponent>');
  });

  test('bracketed nested block 1', function (assert) {
    const emblem = w(
      '',
      '%MyComponent [',
      '  ',
      '  @something="false" ]',
      '  p Bracketed helper attrs!'
    );

    assert.compilesTo(emblem, '<MyComponent @something=\"false\"><p>Bracketed helper attrs!</p></MyComponent>');
  });

  test('bracketed nested block 2', function (assert) {
    const emblem = w(
      '%MyComponent [',
      '  ',
      '  @something="false"',
      ']',
      '  p Bracketed helper attrs!'
    );

    assert.compilesTo(emblem, '<MyComponent @something=\"false\"><p>Bracketed helper attrs!</p></MyComponent>');
  });

  test('bracketed nested with actions', function (assert) {
    const emblem = w(
      '',
      '%MyComponent [',
      '  onclick={ action \'doSometing\' foo bar }',
      '  change=\'otherAction\'',
      '  @something="false" ]',
      '  p Bracketed helper attrs!'
    );

    assert.compilesTo(emblem, '<MyComponent onclick={{action \'doSometing\' foo bar}} {{action \"otherAction\" on=\"change\"}} @something=\"false\"><p>Bracketed helper attrs!</p></MyComponent>');
  });

  test('bracketed modifiers', function (assert) {
    const emblem = w(
      '%MyComponent [',
      '  {did-insert this.handler}',
      '  {on "input" @onInput}',
      '',
      '  @something="false"',
      ']',
      '  p Bracketed helper attrs!'
    );

    assert.compilesTo(emblem, '<MyComponent {{did-insert this.handler}} {{on "input" @onInput}} @something=\"false\"><p>Bracketed helper attrs!</p></MyComponent>');
  });

  test('bracketed with in-tag modifier', function (assert) {
    const emblem = w(
      '%MyComponent{did-insert this.handler} [',
      '',
      '  @something="false"',
      ']',
      '  p Bracketed helper attrs!'
    );

    assert.compilesTo(emblem, '<MyComponent {{did-insert this.handler}} @something=\"false\"><p>Bracketed helper attrs!</p></MyComponent>');
  });

  test('tag modifiers with multi-line', function (assert) {
    const emblem = w(
      '%MyComponent{did-insert this.handler} [',
      '  {on "input" @onInput}',
      '  ',
      '  @something="false" ]',
      '  p Bracketed helper attrs!'
    );

    assert.compilesTo(emblem, '<MyComponent {{did-insert this.handler}} {{on "input" @onInput}} @something=\"false\"><p>Bracketed helper attrs!</p></MyComponent>');
  });
});
