import { module, test } from 'qunit';
import { w } from 'tests/support/utils';

module('mustache: multi-line parameters', function (hooks) {
  test('bracketed statement with blank lines', function (assert) {
    const emblem = w(
      'sally [',
      '',
      '  \'foo\'',
      '',
      '  ',
      '',
      '  baz=true',
      ']'
    );

    assert.compilesTo(emblem, '{{sally \'foo\' baz=true}}');
  });

  test('bracketed statement with comments', function (assert) {
    const emblem = w(
      'sally [ /blah',
      '  / foo',
      '  \'foo\'',
      '  / bar',
      '    what is this madness?',
      '  baz=true',
      ']'
    );

    assert.compilesTo(emblem, '{{sally \'foo\' baz=true}}');
  });

  test('bracketed nested statement', function (assert) {
    const emblem = w(
      '',
      'sally [',
      '  \'foo\'',
      '  something="false" ]',
      '  | Bracketed helper attrs!'
    );

    assert.compilesTo(emblem, '{{#sally \'foo\' something="false"}}Bracketed helper attrs!{{/sally}}');
  });

  test('bracketed nested block params with block', function (assert) {
    const emblem = w(
      '',
      'sally [',
      '  \'foo\'',
      '  something="false" ]',
      '  p Bracketed helper attrs!'
    );

    assert.compilesTo(emblem, '{{#sally \'foo\' something="false"}}<p>Bracketed helper attrs!</p>{{/sally}}');
  });

  test('bracketed nested block params with newline then block 1', function (assert) {
    const emblem = w(
      '',
      '= foo [',
      '  bar=1 ]',
      '',
      '  p baz');

    assert.compilesTo(emblem, '{{#foo bar=1}}<p>baz</p>{{/foo}}');
  });

  // Make sure there are tests with block params and different bracket arrangements

  test('bracketed nested block params with newline then block 2', function (assert) {
    const emblem = w(
      '',
      '= foo [',
      '  bar=1',
      ']',
      '',
      '  p baz'
    );

    assert.compilesTo(emblem, '{{#foo bar=1}}<p>baz</p>{{/foo}}');
  });

  test('bracketed statement with multiple initial arguments', function (assert) {
    const emblem = w(
      '= component foo [',
      '  bar=baz',
      ']'
    );
    assert.compilesTo(emblem, '{{component foo bar=baz}}');
  });

  test('bracketed nested block params', function (assert) {
    const emblem = w(
      '',
      'sally [',
      '  \'foo\'',
      '  something="false" ] as |foo|'
    );

    assert.compilesTo(emblem, '{{sally \'foo\' something="false" as |foo|}}');
  });

  test('bracketed with block params and block', function (assert) {
    const emblem = w(
      '',
      'sally [',
      '  \'foo\'',
      '  something="false" ] as |foo|',
      '  p = foo'
    );

    assert.compilesTo(emblem, '{{#sally \'foo\' something="false" as |foo|}}<p>{{foo}}</p>{{/sally}}');
  });

  test('bracketed with close on newline and with block', function (assert) {
    const emblem = w(
      '',
      'sally [',
      '  \'foo\'',
      '  something="false"',
      ']',
      '  p = foo'
    );

      assert.compilesTo(emblem, '{{#sally \'foo\' something="false"}}<p>{{foo}}</p>{{/sally}}');
  });

  test('bracketed with close on newline, with block params and block', function (assert) {
    const emblem = w(
      '',
      'sally [',
      '  \'foo\'',
      '  something="false"',
      '] as |foo|',
      '  p = foo'
    );

      assert.compilesTo(emblem, '{{#sally \'foo\' something="false" as |foo|}}<p>{{foo}}</p>{{/sally}}');
  });

  test('bracketed action attribute', function (assert) {
    const emblem = w(
      '',
      'button [',
      '  click="doSomething" ]',
      '  | click here'
    );

    assert.compilesTo(emblem, '<button {{action "doSomething" on="click"}}>click here</button>');
  });

  test("several bracketed attributes with closing bracket on final line", function (assert) {
    const emblem = w(
      "= asdf-asdf [",
      "  thing=res1",
      "  thi2ng='res2'",
      "  otherThing=res3",
      "]"
    );

    assert.compilesTo(emblem, '{{asdf-asdf thing=res1 thi2ng=\'res2\' otherThing=res3}}');
  });

  test("several bracketed attributes without a block", function (assert) {
    const emblem = w(
      "= asdf-asdf [",
      "  thing=res1",
      "  thi2ng='res2'",
      "  otherThing=res3",
      "]",
      "p Hi there"
    );

    assert.compilesTo(emblem, '{{asdf-asdf thing=res1 thi2ng=\'res2\' otherThing=res3}}<p>Hi there</p>');
  });

  test("several brackets with closing bracket on final line with a view", function (assert) {
    const emblem = w(
      "Ember.Select [",
      "  thing=res1",
      "  thi2ng='res2'",
      "  otherThing=\"res3\"",
      "]"
    );

    assert.compilesTo(emblem, '{{view Ember.Select thing=res1 thi2ng=\'res2\' otherThing="res3"}}');
  });
});
