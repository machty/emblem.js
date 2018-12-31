import { module, test } from 'qunit';
import { w } from 'tests/support/utils';

module('mustache: conditionals', function (hooks) {
  test("simple if statement", function (assert) {
    const emblem = w(
      "= if foo",
      "  | Foo",
      "= if bar",
      "  | Bar"
    );

    assert.compilesTo(emblem, "{{#if foo}}Foo{{/if}}{{#if bar}}Bar{{/if}}");
  });

  test("simple if else statement", function (assert) {
    const emblem = w(
      "= if foo",
      "  | Foo",
      "= else",
      "  | Bar"
    );

    assert.compilesTo(emblem, "{{#if foo}}Foo{{else}}Bar{{/if}}");
  });

  test("if else ", function (assert) {
    const emblem = w(
      "= if foo",
      "  | Foo",
      "  = if bar",
      "    | Bar",
      "  = else",
      "    | Woot",
      "= else",
      "  | WRONG",
      "= if bar",
      "  | WRONG",
      "= else",
      "  | Hooray"
    );

    assert.compilesTo(emblem, "{{#if foo}}Foo{{#if bar}}Bar{{else}}Woot{{/if}}{{else}}WRONG{{/if}}{{#if bar}}WRONG{{else}}Hooray{{/if}}");
  });

  test("else without preceding `=`", function (assert) {
    const emblem = w(
      "if foo",
      "  p Yeah",
      "else",
      "  p No",
      "if bar",
      "  p Yeah!",
      "else",
      "  p No!",
      "if bar",
      "  p Yeah!",
      "=else",
      "  p No!"
    );

    assert.compilesTo(emblem, "{{#if foo}}<p>Yeah</p>{{else}}<p>No</p>{{/if}}{{#if bar}}<p>Yeah!</p>{{else}}<p>No!</p>{{/if}}{{#if bar}}<p>Yeah!</p>{{else}}<p>No!</p>{{/if}}");
  });

  test("unless", function (assert) {
    const emblem = w(
      "= unless bar",
      "  | Foo",
      "  = unless foo",
      "    | Bar",
      "  = else",
      "    | Woot",
      "= else",
      "  | WRONG",
      "= unless foo",
      "  | WRONG",
      "= else",
      "  | Hooray"
    );

    assert.compilesTo(emblem, "{{#unless bar}}Foo{{#unless foo}}Bar{{else}}Woot{{/unless}}{{else}}WRONG{{/unless}}{{#unless foo}}WRONG{{else}}Hooray{{/unless}}");
  });

  test("else followed by newline doesn't gobble else content", function (assert) {
    const emblem = w(
      "= if something",
      "  p something",
      "= else",
      "",
      "  = if nothing",
      "    p nothing",
      "  = else",
      "    p not nothing"
    );

    assert.compilesTo(emblem, "{{#if something}}<p>something</p>{{else}}{{#if nothing}}<p>nothing</p>{{else}}<p>not nothing</p>{{/if}}{{/if}}");
  });

  test("else if block", function (assert) {
    const emblem = w(
      "= if something",
      "  p something",
      "= else if somethingElse",
      "  p nothing"
    );

    assert.compilesTo(emblem, "{{#if something}}<p>something</p>{{else if somethingElse}}<p>nothing</p>{{/if}}");
  });

  test("else if with else block", function (assert) {
    const emblem = w(
      "= if something",
      "  p something",
      "= else if somethingElse",
      "  p otherThing",
      "= else",
      "  p nothing"
    );

    assert.compilesTo(emblem, "{{#if something}}<p>something</p>{{else if somethingElse}}<p>otherThing</p>{{else}}<p>nothing</p>{{/if}}");
  });

  test("else if twice with else block", function (assert) {
    const emblem = w(
      "= if something",
      "  p something",
      "= else if somethingElse",
      "  p otherThing",
      "= else if anotherSomethingElse",
      "  p otherThing2",
      "= else",
      "  p nothing"
    );

    assert.compilesTo(emblem, "{{#if something}}<p>something</p>{{else if somethingElse}}<p>otherThing</p>{{else if anotherSomethingElse}}<p>otherThing2</p>{{else}}<p>nothing</p>{{/if}}");
  });

  test("else if with extra nodes", function (assert) {
    const emblem = w(
      "= if something",
      "  p something",
      "  h2",
      "    p something",
      "= else if somethingElse",
      "  p otherThing",
      "  = if twoThree",
      "    strong 2:3",
      "  = else if twoFour",
      "    strong 2:4",
      "= else if anotherSomethingElse",
      "  p otherThing2",
      "  h2",
      "    h4",
      "      p something",
      "= else",
      "  p nothing"
    );

    assert.compilesTo(emblem, "{{#if something}}<p>something</p><h2><p>something</p></h2>" +
      "{{else if somethingElse}}<p>otherThing</p>{{#if twoThree}}<strong>2:3</strong>{{else if twoFour}}<strong>2:4</strong>{{/if}}" +
      "{{else if anotherSomethingElse}}<p>otherThing2</p><h2><h4><p>something</p></h4></h2>" +
      "{{else}}<p>nothing</p>{{/if}}");
  });

  test("else if with component block", function (assert) {
    const emblem = w(
      "= if something",
      "  = my-component/widget-a value=model.options as |component indexWidget|",
      "    p The current value is #{ indexWidget }",
      "    strong = component.warningMessage",
      "= else if somethingElse",
      "  h5 Danger!"
    );

    assert.compilesTo(emblem, '{{#if something}}{{#my-component/widget-a value=model.options as |component indexWidget|}}<p>The current value is {{indexWidget }}</p><strong>{{component.warningMessage}}</strong>{{/my-component/widget-a}}' +
      '{{else if somethingElse}}<h5>Danger!</h5>{{/if}}');
  });

  test("inline if with unbound statements", function (assert) {
    const emblem = w(
      "= if something 'something' 'somethingElse'"
    );

    assert.compilesTo(emblem, "{{if something 'something' 'somethingElse'}}");
  });

  test("inline if with bound statements", function (assert) {
    const emblem = w(
      "= if something something 'somethingElse'"
    );

    assert.compilesTo(emblem, "{{if something something 'somethingElse'}}");
  });

  test("truth helpers syntax test 1", function (assert) {
    const emblem = w(
      "= if (eq 1 2)",
      "  |1 == 2",
      "= unless (eq 1 2)",
      "  |1 != 2"
    );

    assert.compilesTo(emblem, "{{#if (eq 1 2)}}1 == 2{{/if}}{{#unless (eq 1 2)}}1 != 2{{/unless}}");
  });

  test("truth helpers syntax test 2", function (assert) {
    const emblem = w(
      "= if (is-array siblings)",
      "  = each siblings as |sibling|",
      "    |My sibling: #{ sibling }",
      "= else if (and (not model.isLoading) model.isError)",
      "  p Hey!"
    );

    assert.compilesTo(emblem, "{{#if (is-array siblings)}}{{#each siblings as |sibling|}}My sibling: {{sibling }}{{/each}}" +
      "{{else if (and (not model.isLoading) model.isError)}}<p>Hey!</p>{{/if}}");
  });

  test("mustaches with else statement", function (assert) {
    const emblem = w(
      'some-component-with-inverse-yield',
      '  |foo',
      'else',
      '  |bar'
    );
    assert.compilesTo(emblem,
      '{{#some-component-with-inverse-yield}}foo{{else}}bar{{/some-component-with-inverse-yield}}');
  });

  test('mustache with else if', function (assert) {
    const emblem = w(
      '= if foo',
      '  p Hi!',
      '= else if foo',
      '  p bye'
    );

    assert.compilesTo(emblem,
      '{{#if foo}}<p>Hi!</p>{{else if foo}}<p>bye</p>{{/if}}');
  });

  test('mustache with else if and complex statements', function (assert) {
    const emblem = w(
      '= if foo',
      '  p Hi!',
      '= else if (eq 1 (and-or [',
      '  a=b',
      '  showHidden=(eq 1 2)',
      ']))',
      '  p Wow what was that?'
    );

    assert.compilesTo(emblem,
      '{{#if foo}}<p>Hi!</p>{{else if (eq 1 (and-or a=b showHidden=(eq 1 2)))}}<p>Wow what was that?</p>{{/if}}');
  });
});
