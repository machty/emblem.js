import { module, test } from 'qunit';
import { w } from 'tests/support/utils';

module('mustache: block statements', function (hooks) {
  test("text only", function (assert) {
    const emblem = "view SomeView | Hello";

    assert.compilesTo(emblem, '{{#view SomeView}}Hello{{/view}}');
  });

  test("multiline", function (assert) {
    const emblem = w(
      "view SomeView | Hello,",
      "  How are you?",
      "  Sup?"
    );

    assert.compilesTo(emblem, '{{#view SomeView}}Hello, How are you? Sup?{{/view}}');
  });

  test("with nesting", function (assert) {
    const emblem = "p{{bind-attr class=\"foo\"}}\n  span Hello";

    assert.compilesTo(emblem, '<p {{bind-attr class="foo"}}><span>Hello</span></p>');
  });

  test('more nesting', function (assert) {
    const emblem = w(
      '',
      'sally',
      '  p Hello'
    );

    assert.compilesTo(emblem, '{{#sally}}<p>Hello</p>{{/sally}}');
  });

  test("block as #each", function (assert) {
    const emblem = w(
      'thangs',
      '  p Woot #{yeah}'
    );

    assert.compilesTo(emblem, '{{#thangs}}<p>Woot {{yeah}}</p>{{/thangs}}');
  });

  test("w/ mustaches", function (assert) {
    const emblem = w(
      "div",
      "  span Hello,",
      "       {{foo}} are you?",
      "       Excellent."
    );

    assert.compilesTo(emblem,
      "<div><span>Hello, {{foo}} are you? Excellent.</span></div>");
  });

  test("nested combo syntax", function (assert) {
    const emblem = w(
      "ul = each items",
      "  li = foo"
    );

    assert.compilesTo(emblem,
      '<ul>{{#each items}}<li>{{foo}}</li>{{/each}}</ul>');
  });

  test('recursive nesting', function (assert) {
    const emblem = w(
      '',
      'sally',
      '  sally',
      '    p Hello'
    );

    assert.compilesTo(emblem, '{{#sally}}{{#sally}}<p>Hello</p>{{/sally}}{{/sally}}');
  });

  test('recursive nesting part 2', function (assert) {
    const emblem = w(
      '',
      'sally',
      '  sally thing',
      '    p Hello'
    );

    assert.compilesTo(emblem, '{{#sally}}{{#sally thing}}<p>Hello</p>{{/sally}}{{/sally}}');
  });

  test("single-line mustaches can have elements right after", function (assert) {
    const emblem = w(
      'div',
      '  = thing',
      '  div' // significantly, this has no return character
    );

    assert.compilesTo(emblem, '<div>{{thing}}<div></div></div>');
  });

  test("multi-line mustaches can have array indexes with blocks", function (assert) {
    const emblem = w(
      'my-component [',
      '  value=child.[0] ]',
      '  | Thing'
    );

    assert.compilesTo(emblem, '{{#my-component value=child.[0]}}Thing{{/my-component}}');
  });
});
