import { module, test } from 'qunit';
import { w } from 'tests/support/utils';

module('mustache: each / else', function (hooks) {
  test('example 1', function(assert) {
    const emblem = w(
      '= each things',
      '  p = name',
      '= else',
      '  p There are no things!'
    );

    assert.compilesTo(emblem, '{{#each things}}<p>{{name}}</p>{{else}}<p>There are no things!</p>{{/each}}');
  });

  test('example 2', function(assert) {
    const emblem = w(
      '= my-component',
      '  p Foo',
      '= else',
      '  p Bar'
      );

    assert.compilesTo(emblem, '{{#my-component}}<p>Foo</p>{{else}}<p>Bar</p>{{/my-component}}');
  });
});
