import { module, test } from 'qunit';
import { w } from 'tests/support/utils';

module('deprecations: legacy-views', function (hooks) {
  test("should invoke `view` helper by default", function (assert) {
    const emblem = w(
      "SomeView"
    );

    assert.compilesTo(emblem, '{{view SomeView}}');
  });

  test("should support block mode", function (assert) {
    const emblem = w(
      "SomeView",
      "  p View content"
    );

    assert.compilesTo(emblem, '{{#view SomeView}}<p>View content</p>{{/view}}');
  });

  test("should not kick in if preceded by equal sign", function (assert) {
    const emblem = w(
      "= SomeView"
    );

    assert.compilesTo(emblem, '{{SomeView}}');
  });

  test("should not kick in explicit {{mustache}}", function (assert) {
    const emblem = w(
      "p Yeah {{SomeView}}"
    );

    assert.compilesTo(emblem, '<p>Yeah {{SomeView}}</p>');
  });

  test("tagName w/o space", function (assert) {
    const emblem = "App.FunView%span";

    assert.compilesTo(emblem, '{{view App.FunView tagName="span"}}');
  });

  test("tagName w/ space", function (assert) {
    const emblem = "App.FunView %span";

    assert.compilesTo(emblem, '{{view App.FunView tagName="span"}}');
  });

  test("tagName block", function (assert) {
    const emblem = "App.FunView%span\n  p Hello";

    assert.compilesTo(emblem, '{{#view App.FunView tagName="span"}}<p>Hello</p>{{/view}}');
  });

  test("class w/ space (needs space)", function (assert) {
    const emblem = "App.FunView .bork";

    assert.compilesTo(emblem, '{{view App.FunView class="bork"}}');
  });

  test("multiple classes", function (assert) {
    const emblem = "App.FunView .bork.snork";

    assert.compilesTo(emblem, '{{view App.FunView class="bork snork"}}');
  });

  test("elementId", function (assert) {
    const emblem = "App.FunView#ohno";

    assert.compilesTo(emblem, '{{view App.FunView elementId="ohno"}}');
  });

  test("mixed w/ hash`", function (assert) {
    const emblem = "App.FunView .bork.snork funbags=\"yeah\"";

    assert.compilesTo(emblem, '{{view App.FunView funbags="yeah" class="bork snork"}}');
  });

  test("mixture of all`", function (assert) {
    const emblem = 'App.FunView%alex#hell.bork.snork funbags="yeah"';

    assert.compilesTo(emblem, '{{view App.FunView funbags="yeah" tagName="alex" elementId="hell" class="bork snork"}}');
  });
});
