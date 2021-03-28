import { module, test } from 'qunit';
import { w } from 'tests/support/utils';

module('ember: link-to', function (hooks) {
  test('example 1', function (assert) {
    const emblem = w(
      '= link-to "home.index"',
      '  | Home'
    );

    assert.compilesTo(emblem, '{{#link-to "home.index"}}Home{{/link-to}}');
  });

  test('example 2', function (assert) {
    const emblem = w(
      '= link-to "Home" "home.index"'
    );

    assert.compilesTo(emblem, '{{link-to "Home" "home.index"}}');
  });

  test('example 3', function (assert) {
    const emblem = w(
      '= link-to "home.index" | Home'
    );

    assert.compilesTo(emblem, '{{#link-to "home.index"}}Home{{/link-to}}');
  });

  test('example 4', function (assert) {
    const emblem = w(
      '= link-to "items.list" (query-params page=2) | Go to page 2'
    );

    assert.compilesTo(emblem, '{{#link-to "items.list" (query-params page=2)}}Go to page 2{{/link-to}}');
  });

  test('example 5', function (assert) {
    const emblem = w(
      'ul',
      '  li = link-to "index" | Home',
      '  li = link-to "about" | About Us'
    );

    assert.compilesTo(emblem, '<ul><li>{{#link-to "index"}}Home{{/link-to}}</li><li>{{#link-to "about"}}About Us{{/link-to}}</li></ul>');
  });

  test('example 6', function (assert) {
    const emblem = w(
      '= link-to "items.list" (query-params page=2): | Go to page 2'
    );

    assert.compilesTo(emblem, '{{#link-to "items.list" (query-params page=2)}}Go to page 2{{/link-to}}');
  });

  test("brace works with text pipe", function (assert) {
    const emblem = "= link-to 'users.view' user | View user #{ user.name } ${ user.id }";

    assert.compilesTo(emblem, '{{#link-to \'users.view\' user}}View user {{user.name}} {{user.id}}{{/link-to}}');
  });
});
