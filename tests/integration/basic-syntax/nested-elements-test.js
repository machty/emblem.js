import { module, test } from 'qunit';
import { w } from 'tests/support/utils';

module('basic syntax: nested-elements', function (hooks) {
  test('nesting', function (assert) {
    const emblem = "p class=\"hello\" data-foo=\"gnarly\"\n  span Yes";

    assert.compilesTo(emblem, '<p data-foo="gnarly" class="hello"><span>Yes</span></p>');
  });

  test("basic", function (assert) {
    const emblem = w(
      "p",
      "  span Hello",
      "  strong Hi",
      "div",
      "  p Hooray"
    );
    assert.compilesTo(emblem,
      '<p><span>Hello</span><strong>Hi</strong></p><div><p>Hooray</p></div>');
  });

  test("empty nest", function (assert) {
    const emblem = w(
      "p",
      "  span",
      "    strong",
      "      i"
    );

    assert.compilesTo(emblem, '<p><span><strong><i></i></strong></span></p>');
  });

  test("empty nest w/ attribute shorthand", function (assert) {
    const emblem = w(
      "p.woo",
      "  span#yes",
      "    strong.no.yes",
      "      i"
    );

    assert.compilesTo(emblem,
      '<p class="woo"><span id="yes"><strong class="no yes"><i></i></strong></span></p>');
  });

  test("indentation doesn't need to match starting inline content's", function (assert) {
    const emblem = w(
      "  span Hello,",
      "    How are you?"
    );

    assert.compilesTo(emblem, "<span>Hello, How are you?</span>");
  });

  test("indentation may consty between parent/child, must be consistent within inline-block", function (assert) {
    const emblem = w(
      "div",
      "      span Hello,",
      "           How are you?",
      "           Excellent.",
      "      p asd"
    );

    assert.compilesTo(emblem,
      "<div><span>Hello, How are you? Excellent.</span><p>asd</p></div>");
  });

  test("indentation may consty between parent/child, will throw", function (assert) {
    const emblem = w(
      "div",
      "  span Hello,",
      "       How are you?",
      "     Excellent."
    );

    assert.compilerThrows(emblem)
  });

  test("indentation may consty between parent/child, must be consistent within inline-block pt 2", function (assert) {
    const emblem = w(
      "div",
      "  span Hello,",
      "       How are you?",
      "       Excellent."
    );

    assert.compilesTo(emblem,
      "<div><span>Hello, How are you? Excellent.</span></div>");
  });

  test("with followup", function (assert) {
    const emblem = w(
      "p This is",
      "  pretty cool.",
      "p Hello."
    );

    assert.compilesTo(emblem, "<p>This is pretty cool.</p><p>Hello.</p>");
  });
});
