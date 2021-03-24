import { module, test } from 'qunit';
import { w } from 'tests/support/utils';

module('ember: blocks', function (hooks) {
  test('example 1', function(assert) {
    const emblem = w(
      '= my-greeter',
      '  div Hello',
      '= else',
      '  div Goodbye'
    );

    assert.compilesTo(emblem, "{{#my-greeter}}<div>Hello</div>{{else}}<div>Goodbye</div>{{/my-greeter}}");
  });

  test('example 2', function(assert) {
    const emblem = w(
      'ul',
      '  = each people as |person|',
      '    li = person'
    );

    assert.compilesTo(emblem, "<ul>{{#each people as |person|}}<li>{{person}}</li>{{/each}}</ul>");
  });

  test('example 3', function(assert) {
    const emblem = w(
      '= my-component [',
      '  foo',
      '  bar=baz',
      '] as |left right|',
      '  span class={ left } = right'
    );

    assert.compilesTo(emblem, "{{#my-component foo bar=baz as |left right|}}<span class={{left}}>{{right}}</span>{{/my-component}}");
  });

  test('example 4', function(assert) {
    const emblem = w(
      "= component 'my-component' [",
      '  foo',
      '  bar=baz',
      '] as |left right|',
      '  span class={ left } = right'
    );

    assert.compilesTo(emblem, "{{#component 'my-component' foo bar=baz as |left right|}}<span class={{left}}>{{right}}</span>{{/component}}");
  });

  test('named block support', function (assert) {
    const emblem = w(
      '= x-modal',
      '  % @header as |@title|',
      '    |Header #{title}',
      '  % @body',
      '    |Body ${title}',
      '  % @footer',
      '    |Footer'
    );

    assert.compilesTo(emblem, '{{#x-modal}}<@header as |@title|>Header {{title}}</@header><@body>Body {{title}}</@body><@footer>Footer</@footer>{{/x-modal}}');
  });

  test('named block with block param', function (assert) {
    const emblem = w(
      '= x-layout as |@widget|',
      '  = @widget as |a b c|',
      '    |Hi.'
    );

    assert.compilesTo(emblem, '{{#x-layout as |@widget|}}{{#@widget as |a b c|}}Hi.{{/@widget}}{{/x-layout}}');
  });

  module('block params', function () {
    test("anything after 'as' goes in block params", function (assert) {
      const emblem = w(
        "= each foos as |foo|"
      );

      assert.compilesTo(emblem,
        '{{each foos as |foo|}}');
    });

    test("spaces between '||' and params are removed", function (assert) {
      assert.compilesTo("= each foos as |foo|", '{{each foos as |foo|}}');
      assert.compilesTo("= each foos as | foo |", '{{each foos as |foo|}}');
    });

    test("multiple words work too", function (assert) {
      const emblem = w(
        "= my-helper as |foo bar|"
      );

      assert.compilesTo(emblem,
        '{{my-helper as |foo bar|}}');
    });

    test("values can have @", function (assert) {
      const emblem = w(
        "= my-helper as |@foo @bar|"
      );

      assert.compilesTo(emblem,
        '{{my-helper as |@foo @bar|}}');
    });

    test("block form works for the 'with' helper", function (assert) {
      const emblem = w(
        "= with car.manufacturer as |make|",
        "  p {{make.name}}"
      );

      assert.compilesTo(emblem,
        '{{#with car.manufacturer as |make|}}<p>{{make.name}}</p>{{/with}}');
    });

    test("block form works for components", function (assert) {
      const emblem = w(
        "= my-component as |item|",
        "  p {{item.name}}"
      );

      assert.compilesTo(emblem,
        '{{#my-component as |item|}}<p>{{item.name}}</p>{{/my-component}}');
    });
  });
});
