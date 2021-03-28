import { module, test } from 'qunit';
import { w } from 'tests/support/utils';

module('basic syntax: multi-line-parameters', function (hooks) {
  test('bracketed attributes', function (assert) {
    const emblem = "p [\n  id=\"yes\"\n  class=\"no\" \n]\n  | Bracketed Attributes FTW!";

    assert.compilesTo(emblem, '<p id="yes" class="no">Bracketed Attributes FTW!</p>');
  });

  test('bracketed mustache attributes', function (assert) {
    const emblem = "p [\n  onclick={ action 'foo' }\n  class=\"no\" \n]\n  | Bracketed Attributes FTW!";

    assert.compilesTo(emblem, '<p onclick={{action \'foo\'}} class="no">Bracketed Attributes FTW!</p>');
  });

  test('bracketed text', function (assert) {
    const emblem = "p [ Bracketed text is cool ]";

    assert.compilerThrows(emblem);
  });

  test('bracketed text indented', function (assert) {
    const emblem = "p\n  | [ Bracketed text is cool ]";

    assert.compilerThrows(emblem);
  });

  test('bracketed statement with comment and blank lines', function (assert) {
    const emblem = w('div [',
      '  foo=bar',
      '',
      '  ',
      '  / We need to add more',
      ']');

    assert.compilesTo(emblem, '<div foo={{bar}}></div>');
  });

  test('bracketed statement end bracket', function (assert) {
    const emblem = w(
      'div [',
      '  foo=bar',
      '  ',
      '  data=baz',
      ']'
    );

    assert.compilesTo(emblem, '<div foo={{bar}} data={{baz}}></div>');
  });

  test('bracketed statement and block', function (assert) {
    const emblem = w(
      'a [',
      '  href={ generate-link foo.bar }',
      '  ',
      ']',
      '  | Foo',
    );

    assert.compilesTo(emblem, '<a href={{generate-link foo.bar}}>Foo</a>');
  });

  test('bracketed statement and block - case 2', function (assert) {
    const emblem = w(
      'a [',
      '  href={ generate-link foo.bar }',
      '  ',
      '] ',
      '  | Foo',
    );

    assert.compilesTo(emblem, '<a href={{generate-link foo.bar}}>Foo</a>');
  });

  test('bracketed statement and block - case 3', function (assert) {
    const emblem = w(
      'a [',
      '  href={ generate-link foo.bar }',
      '  ',
      ']: foo',
    );

    assert.compilesTo(emblem, '<a href={{generate-link foo.bar}}>{{foo}}</a>');
  });

  test('bracketed statement and block - case 4', function (assert) {
    const emblem = w(
      'a [',
      '  href={ generate-link foo.bar }',
      '  ',
      ']: = foo',
    );

    assert.compilesTo(emblem, '<a href={{generate-link foo.bar}}>{{foo}}</a>');
  });

  test('bracketed statement and block - case 5', function (assert) {
    const emblem = w(
      'a [',
      '  href={generate-link foo.bar}',
      '  ',
      ']: | Foo',
    );

    assert.compilesTo(emblem, '<a href={{generate-link foo.bar}}>Foo</a>');
  });
});
