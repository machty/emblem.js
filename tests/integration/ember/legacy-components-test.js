import { module, test } from 'qunit';
import { w } from 'tests/support/utils';

module('ember: legacy components', function (hooks) {
  test('example 1', function (assert) {
    const emblem = w(
      "= my-component value='firstName'"
    );

    assert.compilesTo(emblem, "{{my-component value='firstName'}}");
  });

  test('example 2', function (assert) {
    const emblem = w(
      "= my-component [",
      "  value='firstName'",
      "  title='Name'",
      "  model=model",
      "  changed=(action 'nameChanged')",
      "]",
    );

    assert.compilesTo(emblem, "{{my-component value='firstName' title='Name' model=model changed=(action 'nameChanged')}}");
  });

  test('subexpression brackets', function (assert) {
    const emblem = w(
      '= my-component (hash [',
      '  foo',
      '])'
    );

    assert.compilesTo(emblem,
      '{{my-component (hash foo)}}');
  });

  test('subexpression brackets and comment', function (assert) {
    const emblem = w(
      '= my-component (hash [',
      '  foo',
      '  / There was another thing but oh well',
      '])'
    );

    assert.compilesTo(emblem,
      '{{my-component (hash foo)}}');
  });

  test('subexpression brackets with subexpression', function (assert) {
    const emblem = w(
      '= my-component (hash [',
      '  foo',
      '  bar=(eq 1 2)',
      '])'
    );

    assert.compilesTo(emblem,
      '{{my-component (hash foo bar=(eq 1 2))}}');
  });

  test('subexpression brackets with nested brackets', function (assert) {
    const emblem = w(
      '= my-component (hash [',
      '  foo',
      '  bar=(eq [',
      '    1',
      '    2',
      '    overwrite=true',
      '  ])',
      '])'
    );

    assert.compilesTo(emblem,
      '{{my-component (hash foo bar=(eq 1 2 overwrite=true))}}');
  });

  test('yield with hash example (I-292)', function (assert) {
    const emblem = w(
      '= yield (hash buttons=(hash [',
      '  saveSheet=(component [',
      '    \'save-sheet\'',
      '    isReadonly=isReadonly',
      '    buttonAction=(action saveComponent)',
      '  ])',
      '  fontFamily=(component [',
      '    \'font-family\'',
      '    isReadonly=isReadonly',
      '    buttonAction=(action applyStyles)',
      '  ])',
      ']))'
    );

    assert.compilesTo(emblem,
      '{{yield (hash buttons=(hash saveSheet=(component \'save-sheet\' isReadonly=isReadonly buttonAction=(action saveComponent)) fontFamily=(component \'font-family\' isReadonly=isReadonly buttonAction=(action applyStyles))))}}');
  });

  test('module namespaces', function (assert) {
    const emblem = w(
      '= my-addon::foo'
    );

    assert.compilesTo(emblem, '{{my-addon::foo}}');
  });
});
