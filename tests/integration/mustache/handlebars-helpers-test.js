import { module, test } from 'qunit';
import { w } from 'tests/support/utils';

module('mustache: handlebars helpers', function (hooks) {
  test('double mustache in text line', function (assert) {
    const emblem = `| bork {{bar}}`;

    assert.compilesTo(emblem, 'bork {{bar}}');
  });

  module('tripple stash', function () {
    test("with mustache calling helper 1", function (assert) {
      assert.compilesTo('p class="foo {{{echo "YES"}}}"',
        '<p class="foo {{{echo \\"YES\\"}}}"></p>');
    });

    test("with mustache calling helper 2", function (assert) {
      assert.compilesTo('p class="foo #{echo "NO"}, ${echo "MAYBE"} and {{{echo "YES"}}}" Hello',
        '<p class="foo {{echo \\"NO\\"}}, {{echo \\"MAYBE\\"}} and {{{echo \\"YES\\"}}}">Hello</p>');
    });

    test("with mustache calling helper 3", function (assert) {
      const emblem = "p class=\"foo {{echo \"BORF\"}}\"\n  | Hello";

      assert.compilesTo(emblem, '<p class="foo {{echo \\"BORF\\"}}">Hello</p>');
    });

    test('triple mustache in text line', function (assert) {
      const emblem = `| bork {{{bar}}}`;

      assert.compilesTo(emblem, 'bork {{{bar}}}');
    });

    test("with triplestache", function (assert) {
      assert.compilesTo('p{{{insertClass foo}}} Hello', '<p {{{insertClass foo}}}>Hello</p>');
    });

    test("multiple", function (assert) {
      assert.compilesTo('p{{{insertClass foo}}}{{{insertClass boo}}} Hello', '<p {{{insertClass foo}}} {{{insertClass boo}}}>Hello</p>');
    });
  });

  module('hash brace syntax', function() {
    test('hash stache in text line', function (assert) {
      const emblem = "| bork #{bar} ${baz}";

      assert.compilesTo(emblem, 'bork {{bar}} {{baz}}');
    });

    test('acts like {{}}', function (assert) {
      const emblem = "span Yo #{foo}, I ${herd}.";

      assert.compilesTo(emblem, "<span>Yo {{foo}}, I {{herd}}.</span>");
    });

    test('can start inline content', function (assert) {
      const emblem = "span #{foo}, I ${herd}.";

      assert.compilesTo(emblem, "<span>{{foo}}, I {{herd}}.</span>");
    });

    test('can end inline content', function (assert) {
      const emblem = "span I ${herd} #{foo}";

      assert.compilesTo(emblem, "<span>I {{herd}} {{foo}}</span>");
    });

    test("doesn't screw up parsing when # used in text nodes", function (assert) {
      const emblem = "span OMG #YOLO";

      assert.compilesTo(emblem, "<span>OMG #YOLO</span>");
    });

    test("# can be only thing on line", function (assert) {
      const emblem = "span #";

      assert.compilesTo(emblem, "<span>#</span>");
    });
  });
});
