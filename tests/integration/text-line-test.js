/*global QUnit*/
import { w } from '../support/utils';
import Emblem from '../emblem';
var runTextLineSuite;

QUnit.module("text lines: starting with '|'");

test("basic", function(assert) {
  assert.compilesTo("| What what", "What what");
});

test("with html", function(assert) {
  assert.compilesTo('| What <span id="woot" data-t="oof" class="f">what</span>!',
                    'What <span id="woot" data-t="oof" class="f">what</span>!');
});

test("multiline", function(assert) {
  var emblem;
  emblem = "| Blork\n  Snork";
  assert.compilesTo(emblem, "Blork Snork");
});

test("triple multiline", function(assert) {
  var emblem;
  emblem = "| Blork\n  Snork\n  Bork";
  assert.compilesTo(emblem, "Blork Snork Bork");
});

test("quadruple multiline", function(assert) {
  var emblem;
  emblem = "| Blork\n  Snork\n  Bork\n  Fork";
  assert.compilesTo(emblem, "Blork Snork Bork Fork");
});

test("multiline w/ trailing whitespace", function(assert) {
  var emblem;
  emblem = "| Blork \n  Snork";
  assert.compilesTo(emblem, "Blork  Snork");
});

test("secondline", function(assert) {
  var emblem;
  emblem = "|\n  Good";
  assert.compilesTo(emblem, "Good");
});

test("secondline multiline", function(assert) {
  var emblem;
  emblem = "| \n  Good\n  Bork";
  assert.compilesTo(emblem, "Good Bork");
});

test("with a mustache", function(assert) {
  var emblem;
  emblem = "| Bork {{foo}}!";
  assert.compilesTo(emblem, 'Bork {{foo}}!');
});

test("with mustaches", function(assert) {
  var emblem;
  emblem = "| Bork {{foo}} {{{bar}}}!";
  assert.compilesTo(emblem, 'Bork {{foo}} {{{bar}}}!');
});

test("on each line", function(assert) {
  var emblem;
  emblem = `
  pre
    | This
    |   should
    |  hopefully
    |    work, and work well.`;
  assert.compilesTo(
    emblem, `<pre>This  should hopefully   work, and work well.</pre>`);
});

test("with blank", function(assert) {
  var emblem;
  emblem = `
  pre
    | This
    |   should
    |
    |  hopefully
    |    work, and work well.`;
  assert.compilesTo(
    emblem, '<pre>This  should hopefully   work, and work well.</pre>');
});

QUnit.module("text lines: starting with '`' -- backtick ADDS a trailing newline");

test("basic", function(assert) {
  assert.compilesTo("` What what", "What what\n");
});

test("with html", function(assert) {
  assert.compilesTo('` What <span id="woot" data-t="oof" class="f">what</span>!',
                    'What <span id="woot" data-t="oof" class="f">what</span>!\n');
});

test("multiline", function(assert) {
  var emblem;
  emblem = w('` Blork',
             '  Snork');
  assert.compilesTo(emblem, "Blork Snork\n");
});

test("triple multiline", function(assert) {
  var emblem;
  emblem = w('` Blork',
             '  Snork',
             '  Bork');
  assert.compilesTo(emblem, "Blork Snork Bork\n");
});

test("quadruple multiline", function(assert) {
  var emblem;
  emblem = w('` Blork',
             '  Snork',
             '  Bork',
             '  Fork');
  assert.compilesTo(emblem, "Blork Snork Bork Fork\n");
});

test("multiline w/ trailing whitespace", function(assert) {
  var emblem;
  emblem = w('` Blork ',
             '  Snork');
  assert.compilesTo(emblem, "Blork  Snork\n");
});

test("secondline", function(assert) {
  var emblem;
  emblem = w('`',
             '  Good');
  assert.compilesTo(emblem, "Good\n");
});

test("secondline multiline", function(assert) {
  var emblem;
  emblem = w('` ',
             '  Good',
             '  Bork');
  assert.compilesTo(emblem, "Good Bork\n");
});

test("with a mustache", function(assert) {
  var emblem;
  emblem = "` Bork {{foo}}!";
  assert.compilesTo(emblem, 'Bork {{foo}}!\n');
});

test("with mustaches", function(assert) {
  var emblem;
  emblem = "` Bork {{foo}} {{{bar}}}!";
  assert.compilesTo(emblem, 'Bork {{foo}} {{{bar}}}!\n');
});

test("on each line", function(assert) {
  var emblem;
  emblem = `
  pre
    \` This
    \`   should
    \`  hopefully
    \`    work, and work well.`;
  var expected = `<pre>This\n  should\n hopefully\n   work, and work well.\n</pre>`;
  assert.compilesTo(emblem, expected);
});

test("with blank", function(assert) {
  var emblem;
  emblem = `
  pre
    \` This
    \`   should
    \`
    \`  hopefully
    \`    work, and work well.`;
  assert.compilesTo(
    emblem, '<pre>This\n  should\n\n hopefully\n   work, and work well.\n</pre>');
});

QUnit.module('text lines: starting with "\'" should add an extra space');

test("basic", function(assert) {
  assert.compilesTo("' What what", "What what ");
});

test("with html", function(assert) {
  assert.compilesTo('\' What <span id="woot" data-t="oof" class="f">what</span>!',
                    'What <span id="woot" data-t="oof" class="f">what</span>! ');
});

test("multiline", function(assert) {
  var emblem;
  emblem = `' Blork
              Snork`;
  assert.compilesTo(emblem, "Blork Snork ");
});

test("triple multiline", function(assert) {
  var emblem;
  emblem = `' Blork
              Snork
              Bork`;
  assert.compilesTo(emblem, "Blork Snork Bork ");
});

test("quadruple multiline", function(assert) {
  var emblem;
  emblem = `' Blork
              Snork
              Bork
              Fork`;
  assert.compilesTo(emblem, "Blork Snork Bork Fork ");
});

test("multiline w/ trailing whitespace", function(assert) {
  var emblem;
  emblem = `' Blork 
              Snork`;
  assert.compilesTo(emblem, "Blork  Snork ");
});

test("secondline", function(assert) {
  var emblem;
  emblem = "'\n  Good";
  assert.compilesTo(emblem, "Good ");
});

test("secondline multiline", function(assert) {
  var emblem;
  emblem = "' \n  Good\n  Bork";
  assert.compilesTo(emblem, "Good Bork ");
});

test("with a mustache", function(assert) {
  var emblem;
  emblem = "' Bork {{foo}}!";
  assert.compilesTo(emblem, 'Bork {{foo}}! ');
});

test("with mustaches", function(assert) {
  var emblem;
  emblem = "' Bork {{foo}} {{{bar}}}!";
  assert.compilesTo(emblem, 'Bork {{foo}} {{{bar}}}! ');
});

test("on each line", function(assert) {
  var emblem;
  emblem = `
  pre
    ' This
    '   should
    '  hopefully
    '    work, and work well.`;
  assert.compilesTo(
    emblem, `<pre>This   should  hopefully    work, and work well. </pre>`);
});

test("with blank", function(assert) {
  var emblem;
  emblem = `
  pre
    ' This
    '   should
    '
    '  hopefully
    '    work, and work well.`;
  var expected = '<pre>This   should   hopefully    work, and work well. </pre>';
  assert.compilesTo(emblem, expected);
});
