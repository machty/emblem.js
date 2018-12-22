import { module, test } from 'qunit';
import { w } from 'tests/support/utils';

module('basic syntax: comments', function (hooks) {
  test("it strips out single line '/' comments", function (assert) {
    const emblem = w(
      "p Hello",
      "",
      "/ A comment",
      "",
      "h1 How are you?"
    );

    assert.compilesTo(emblem, "<p>Hello</p><h1>How are you?</h1>");
  });

  test("it strips out multi-line '/' comments", function (assert) {
    const emblem = w(
      "p Hello",
      "",
      "/ A comment",
      "  that goes on to two lines",
      "  even three!",
      "",
      "h1 How are you?"
    );

    assert.compilesTo(emblem, "<p>Hello</p><h1>How are you?</h1>");
  });

  test("it strips out multi-line '/' comments without text on the first line", function (assert) {
    const emblem = w(
      "p Hello",
      "",
      "/ ",
      "  A comment",
      "  that goes on to two lines",
      "  even three!",
      "",
      "h1 How are you?"
    );

    assert.compilesTo(emblem, "<p>Hello</p><h1>How are you?</h1>");
  });


  test("mix and match with various indentation", function (assert) {
    const emblem = w(
      "/ A test",
      "p Hello",
      "",
      "span",
      "  / This is gnarly",
      "  p Yessir nope.",
      "",
      "/ Nothin but comments",
      "  so many comments.",
      "",
      "/",
      "  p Should not show up"
    );
    assert.compilesTo(emblem, "<p>Hello</p><span><p>Yessir nope.</p></span>");
  });

  test("uneven indentation", function (assert) {
    const emblem = w(
      "/ nop",
      "  nope",
      "    nope"
    );
    assert.compilesTo(emblem, "");
  });

  test("uneven indentation 2", function (assert) {
    const emblem = w(
      "/ n",
      "  no",
      "    nop",
      "  nope"
    );
    assert.compilesTo(emblem, "");
  });

  test("uneven indentation 3", function (assert) {
    const emblem = w(
      "/ n",
      "  no",
      "    nop",
      "  nope"
    );

    assert.compilesTo(emblem, "");
  });


  test("empty first line", function (assert) {
    const emblem = w(
      "/ ",
      "  nop",
      "  nope",
      "    nope",
      "  no"
    );

    assert.compilesTo(emblem, "");
  });

  test("on same line as html content", function (assert) {
    const emblem = w(
      ".container / This comment doesn't show up",
      "  .row / Nor does this",
      "    p Hello"
    );

    assert.compilesTo(emblem, '<div class="container"><div class="row"><p>Hello</p></div></div>');
  });

  test("on same line as mustache content", function (assert) {
    assert.compilesTo('frank text="YES" text2="NO" / omg',
      '{{frank text="YES" text2="NO"}}');
  });

  test("on same line as colon syntax", function (assert) {
    const emblem = w(
      "ul: li: span / omg",
      "  | Hello"
    );

    assert.compilesTo(emblem, "<ul><li><span>Hello</span></li></ul>");
  });

  test("mustaches with blocks and comments", function (assert) {
    const emblem = w(
      '/ Hi',
      '= if foo',
      '  p Hi',
      '/ Bye',
      '= else if bar',
      '  p bye'
    );
    assert.compilesTo(emblem,
      '{{#if foo}}<p>Hi</p>{{else if bar}}<p>bye</p>{{/if}}');
  });
});
