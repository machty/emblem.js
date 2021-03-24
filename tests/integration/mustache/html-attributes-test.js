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

  test("bracketed multi-line modifiers", function (assert) {
    const emblem = w(
      'div [',
      '  {did-insert (queue [',
      '    (action this.closeWizard)',
      '    (transition-to "home")',
      '  ])}',
      '  {on "input" @onInput}',
      "  class='test'",
      "]",
    );

    assert.compilesTo(emblem, '<div {{did-insert (queue (action this.closeWizard) (transition-to "home"))}} {{on "input" @onInput}} class="test"></div>');
  });

  test("bracketed multi-line modifiers - second case", function (assert) {
    const emblem = w(
      'div [',
      '  {queue [',
      '    (action this.closeWizard)',
      '    (transition-to "home")',
      '  ]}',
      '  {on "input" @onInput}',
      "  class='test'",
      "]",
    );

    assert.compilesTo(emblem, '<div {{queue (action this.closeWizard) (transition-to "home")}} {{on "input" @onInput}} class="test"></div>');
  });

  test("bracketed multi-line modifiers - third case", function (assert) {
    const emblem = w(
      'div [',
      '  {action (queue [',
      '    (action this.closeWizard)',
      '    (transition-to "home")',
      '  ])}',
      '  {on "input" @onInput}',
      "  class='test'",
      "]",
    );

    assert.compilesTo(emblem, '<div {{action (queue (action this.closeWizard) (transition-to "home"))}} {{on "input" @onInput}} class="test"></div>');
  });

  test("tag multi-line modifier", function (assert) {
    const emblem = w(
      'div{did-insert (queue [',
      '  (action this.closeWizard)',
      '  (transition-to "home")',
      '])} [',
      "  class='test'",
      "]",
    );

    assert.compilesTo(emblem, '<div {{did-insert (queue (action this.closeWizard) (transition-to "home"))}} class="test"></div>');
  });

  test("tag multi-line modifier - second case", function (assert) {
    const emblem = w(
      'div{queue [',
      '  (action this.closeWizard)',
      '  (transition-to "home")',
      ']} [',
      "  class='test'",
      "]",
    );

    assert.compilesTo(emblem, '<div {{queue (action this.closeWizard) (transition-to "home")}} class="test"></div>');
  });

  test("tag multi-line modifier - third case", function (assert) {
    const emblem = w(
      'div{action (queue [',
      '  (action this.closeWizard)',
      '  (transition-to "home")',
      '])} [',
      "  class='test'",
      "]",
    );

    assert.compilesTo(emblem, '<div {{action (queue (action this.closeWizard) (transition-to "home"))}} class="test"></div>');
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
      '  class="test"',
      ']'
    );

    assert.compilesTo(emblem, '<div {{did-insert this.handler}} {{on "input" @onInput}} class="test"></div>');
  });

  test("tag bracketed from first with Sub-expressions", function (assert) {
    const emblem = w(
      'input [',
      '  value={calc [',
      '    (action this.closeWizard)',
      '    (transition-to "home")',
      '  ]}',
      ']'
    );

    assert.compilesTo(emblem,
      '<input value={{calc (action this.closeWizard) (transition-to "home")}}>');
  });

  test("tag bracketed from first with Sub-expressions - second case", function (assert) {
    const emblem = w(
      'input [',
      '  value={calc (or [',
      '    (action this.closeWizard)',
      '    (transition-to "home")',
      '  ])}',
      ']'
    );

    assert.compilesTo(emblem,
      '<input value={{calc (or (action this.closeWizard) (transition-to "home"))}}>');
  });

  test("new-tag bracketed modifiers", function (assert) {
    const emblem = w(
      '%some-new-tag [',
      '  {did-insert this.handler}',
      '  {on "input" @onInput}',
      "  class='test'",
      "]",
    );

    assert.compilesTo(emblem, '<some-new-tag {{did-insert this.handler}} {{on "input" @onInput}} class="test"></some-new-tag>');
  });

  test("new-tag bracketed multi-line modifiers", function (assert) {
    const emblem = w(
      '%some-new-tag [',
      '  {did-insert (queue [',
      '    (action this.closeWizard)',
      '    (transition-to "home")',
      '  ])}',
      '  {on "input" @onInput}',
      "  class='test'",
      "]",
    );

    assert.compilesTo(emblem, '<some-new-tag {{did-insert (queue (action this.closeWizard) (transition-to "home"))}} {{on "input" @onInput}} class="test"></some-new-tag>');
  });

  test("new-tag multi-line modifier", function (assert) {
    const emblem = w(
      '%some-new-tag{action (queue [',
      '  (action this.closeWizard)',
      '  (transition-to "home")',
      '])} [',
      "  class='test'",
      "]",
    );

    assert.compilesTo(emblem, '<some-new-tag {{action (queue (action this.closeWizard) (transition-to "home"))}} class="test"></some-new-tag>');
  });

  test("new-tag multi-line modifier - second case", function (assert) {
    const emblem = w(
      '%some-new-tag{queue [',
      '  (action this.closeWizard)',
      '  (transition-to "home")',
      ']} [',
      "  class='test'",
      "]",
    );

    assert.compilesTo(emblem, '<some-new-tag {{queue (action this.closeWizard) (transition-to "home")}} class="test"></some-new-tag>');
  });

  test("new-tag modifiers with multi-line", function (assert) {
    const emblem = w(
      '%some-new-tag{did-insert this.handler}{on "input" @onInput} [',
      "  class='test'",
      "]",
    );

    assert.compilesTo(emblem, '<some-new-tag {{did-insert this.handler}} {{on "input" @onInput}} class="test"></some-new-tag>');
  });

  test("new-tag modifier with multi-line modifier", function (assert) {
    const emblem = w(
      "%some-new-tag{did-insert this.handler} [",
      '  {on "input" @onInput}',
      '  ',
      '  class="test"',
      ']'
    );

    assert.compilesTo(emblem, '<some-new-tag {{did-insert this.handler}} {{on "input" @onInput}} class="test"></some-new-tag>');
  });

  test("bracketed from first with Sub-expressions", function (assert) {
    const emblem = w(
      '%some-new-tag [',
      '  value={calc [',
      '    (action this.closeWizard)',
      '    (transition-to "home")',
      '  ]}',
      '  class="test"',
      ']',
      '  |ggggg'
    );

    assert.compilesTo(emblem,
      '<some-new-tag value={{calc (action this.closeWizard) (transition-to "home")}} class="test">ggggg</some-new-tag>');
  });
});
