import { module, test } from 'qunit';
import { w } from 'tests/support/utils';

module('mustache: conditional shorthand', function (hooks) {
  test("? helper defaults to `if` invocation", function (assert) {
    const emblem = "foo?\n  p Yeah";

    assert.compilesTo(emblem, '{{#if foo}}<p>Yeah</p>{{/if}}');
  });

  test("else works", function (assert) {
    const emblem = "foo?\n  p Yeah\nelse\n  p No";

    assert.compilesTo(emblem, '{{#if foo}}<p>Yeah</p>{{else}}<p>No</p>{{/if}}');
  });

  test("compound with text", function (assert) {
    const emblem = w(
      "p = foo? ",
      "  | Hooray",
      "else",
      "  | No",
      "p = bar? ",
      "  | Hooray",
      "else",
      "  | No"
    );

    assert.compilesTo(emblem,
      '<p>{{#if foo}}Hooray{{else}}No{{/if}}</p>' +
      '<p>{{#if bar}}Hooray{{else}}No{{/if}}</p>'
    );
  });

  test("compound with variables", function (assert) {
    const emblem = w(
      "p = foo? ",
      "  bar",
      "else",
      "  baz"
    );

    assert.compilesTo(emblem, '<p>{{#if foo}}{{bar}}{{else}}{{baz}}{{/if}}</p>');
  });
});
