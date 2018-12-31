import { module, test } from 'qunit';
import { w } from 'tests/support/utils';

module('mustache: class shorthand', function (hooks) {
  test("mustache class binding", function (assert) {
    const emblem = 'iframe.foo class=dog';

    assert.compilesTo(emblem, '<iframe class="foo {{dog}}"></iframe>');
  });

  test("class special syntax with 2 vals", function (assert) {
    const emblem = 'p class=foo:bar:baz';
    assert.compilesTo(emblem, '<p class={{if foo \'bar\' \'baz\'}}></p>');
  });

  test("class special syntax with only 2nd val", function (assert) {
    const emblem = 'p class=foo::baz';
    assert.compilesTo(emblem, '<p class={{if foo \'\' \'baz\'}}></p>');
  });

  test("class special syntax with only 1st val", function (assert) {
    const emblem = 'p class=foo:baz';
    assert.compilesTo(emblem, '<p class={{if foo \'baz\'}}></p>');
  });

  test("class special syntax with slashes", function (assert) {
    const emblem = 'p class=foo/bar:baz';
    assert.compilesTo(emblem, '<p class={{if foo/bar \'baz\'}}></p>');
  });

  test("Inline binding with mixed classes", function (assert) {
    const emblem = ".notice class={ test::active }";
    assert.compilesTo(emblem, '<div class=\"notice {{if test \'\' \'active\'}}\"></div>');
  });

  test("class braced syntax w/ underscores and dashes 1", function (assert) {
    assert.compilesTo('p class={f-oo:bar :b_az}', '<p class="b_az {{if f-oo \'bar\'}}"></p>');
  });

  test("class braced syntax w/ underscores and dashes 2", function (assert) {
    assert.compilesTo('p class={ f-oo:bar :b_az }', '<p class="b_az {{if f-oo \'bar\'}}"></p>');
  });

  test("class braced syntax w/ underscores and dashes 3", function (assert) {
    assert.compilesTo('p class={ f-oo:bar :b_az } Hello', '<p class="b_az {{if f-oo \'bar\'}}">Hello</p>');
  });

  test("class braced syntax w/ underscores and dashes 4", function (assert) {
    const emblem = w(
      ".input-prepend class={ filterOn:input-append }",
      "  span.add-on"
    );

    assert.compilesTo(emblem, '<div class="input-prepend {{if filterOn \'input-append\'}}"><span class="add-on"></span></div>');
  });

  test("multiple bindings with inline conditionals", function (assert) {
    const emblem = "button class={ thing1:active thing2:alert }";

    assert.compilesTo(emblem, '<button class=\"{{if thing1 \'active\'}} {{if thing2 \'alert\'}}\"></button>');
  });
});
