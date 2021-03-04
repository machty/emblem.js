import { module, test } from 'qunit';
import { w } from 'tests/support/utils';

module('mustache: html attributes', function (hooks) {
  test('names with multiple underscores', function (assert) {
    const emblem = "= link-to .nav__item 'dashboard' | Foo Bar";

    assert.compilesTo(emblem, "{{#link-to 'dashboard' class=\"nav__item\"}}Foo Bar{{/link-to}}");
  });

  test('attributes and values with $ in them', function (assert) {
    assert.compilesTo('= my-component $foo=bar.$baz', '{{my-component $foo=bar.$baz}}');
  });

  test("single", function (assert) {
    assert.compilesTo('p{inTagHelper foo}', '<p {{inTagHelper foo}}></p>');
  });

  test("double", function (assert) {
    assert.compilesTo('p{{inTagHelper foo}}', '<p {{inTagHelper foo}}></p>');
  });

  test("triple", function (assert) {
    assert.compilesTo('p{{{inTagHelper foo}}}', '<p {{{inTagHelper foo}}}></p>');
  });

  test("with singlestache", function (assert) {
    assert.compilesTo('p{insertClass foo} Hello', '<p {{insertClass foo}}>Hello</p>');
  });

  test("singlestache can be used in text nodes", function (assert) {
    assert.compilesTo('p Hello {dork}', '<p>Hello {dork}</p>');
  });

  test("with doublestache", function (assert) {
    assert.compilesTo('p{{insertClass foo}} Hello', '<p {{insertClass foo}}>Hello</p>');
  });

  test("bracketed modifiers", function (assert) {
    const emblem = w(
      'div [',
      '  {did-insert this.handler}',
      '  {on "input" @onInput}',
      "  class='test'",
      "]",
    );

    assert.compilesTo(emblem, '<div {{did-insert this.handler}} {{on "input" @onInput}} class="test"></div>');
  });

  test("tag modifiers with multi-line", function (assert) {
    const emblem = w(
      'div{did-insert this.handler}{on "input" @onInput} [',
      "  class='test'",
      "]",
    );

    assert.compilesTo(emblem, '<div {{did-insert this.handler}} {{on "input" @onInput}} class="test"></div>');
  });

  test("tag modifier with multi-line modifier", function (assert) {
    const emblem = w(
      "div{did-insert this.handler} [",
      '  {on "input" @onInput}',
      '  ',
      '  class="test" ]',
    );

    assert.compilesTo(emblem, '<div {{did-insert this.handler}} {{on "input" @onInput}} class="test"></div>');
  });
});
