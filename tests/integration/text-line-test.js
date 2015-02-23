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
  assert.compilesTo(emblem, " Good");
});

test("secondline multiline", function(assert) {
  var emblem;
  emblem = "| \n  Good\n  Bork";
  assert.compilesTo(emblem, " Good Bork");
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

// FIXME
/*
test("on each line", function(assert) {
  var emblem;
  emblem = "pre\n  | This\n  |   should\n  |  hopefully\n  |    work, and work well.";
  assert.compilesTo(emblem, '<pre>This\n\t  should\n\t hopefully\n\t   work, and work well.\n\t</pre>');
});

test("with blank", function(assert) {
  var emblem;
  emblem = "pre\n  | This\n  |   should\n  |\n  |  hopefully\n  |    work, and work well.";
  assert.compilesTo(emblem, '<pre>This\n\t  should\n\t\n\t hopefully\n\t   work, and work well.\n\t</pre>');
});
*/

// FIXME -- should remove trailing newlines, these test assertions are all wrong
QUnit.module("text lines: starting with '`'");

test("basic", function(assert) {
  assert.compilesTo("` What what", "What what");
});

test("with html", function(assert) {
  assert.compilesTo('` What <span id="woot" data-t="oof" class="f">what</span>!',
                    'What <span id="woot" data-t="oof" class="f">what</span>!');
});

test("multiline", function(assert) {
  var emblem;
  emblem = "` Blork\n  Snork";
  assert.compilesTo(emblem, "Blork Snork");
});

test("triple multiline", function(assert) {
  var emblem;
  emblem = "` Blork\n  Snork\n  Bork";
  assert.compilesTo(emblem, "Blork Snork Bork");
});

test("quadruple multiline", function(assert) {
  var emblem;
  emblem = "` Blork\n  Snork\n  Bork\n  Fork";
  assert.compilesTo(emblem, "Blork Snork Bork Fork");
});

test("multiline w/ trailing whitespace", function(assert) {
  var emblem;
  emblem = "` Blork \n  Snork";
  assert.compilesTo(emblem, "Blork  Snork");
});

test("secondline", function(assert) {
  var emblem;
  emblem = "`\n  Good";
  assert.compilesTo(emblem, " Good");
});

test("secondline multiline", function(assert) {
  var emblem;
  emblem = "` \n  Good\n  Bork";
  assert.compilesTo(emblem, " Good Bork");
});

test("with a mustache", function(assert) {
  var emblem;
  emblem = "` Bork {{foo}}!";
  assert.compilesTo(emblem, 'Bork {{foo}}!');
});

test("with mustaches", function(assert) {
  var emblem;
  emblem = "` Bork {{foo}} {{{bar}}}!";
  assert.compilesTo(emblem, 'Bork {{foo}} {{{bar}}}!');
});

// FIXME
/*
test("on each line", function(assert) {
  var emblem;
  emblem = "pre\n  ` This\n  `   should\n  `  hopefully\n  `    work, and work well.";
  assert.compilesTo(emblem, '<pre>This\n\t  should\n\t hopefully\n\t   work, and work well.\n\t</pre>');
});

test("with blank", function(assert) {
  var emblem;
  emblem = "pre\n  ` This\n  `   should\n  `\n  `  hopefully\n  `    work, and work well.";
  assert.compilesTo(emblem, '<pre>This\n\t  should\n\t\n\t hopefully\n\t   work, and work well.\n\t</pre>');
});
*/

// FIXME -- should add an extra space at the end of the line
/*
QUnit.module("text lines: starting with \"'\"");

test("basic", function(assert) {
  assert.compilesTo("' What what", "What what");
});

test("with html", function(assert) {
  assert.compilesTo('\' What <span id="woot" data-t="oof" class="f">what</span>!',
                    'What <span id="woot" data-t="oof" class="f">what</span>!');
});

test("multiline", function(assert) {
  var emblem;
  emblem = "' Blork\n  Snork";
  assert.compilesTo(emblem, "Blork Snork");
});

test("triple multiline", function(assert) {
  var emblem;
  emblem = "' Blork\n  Snork\n  Bork";
  assert.compilesTo(emblem, "Blork Snork Bork");
});

test("quadruple multiline", function(assert) {
  var emblem;
  emblem = "' Blork\n  Snork\n  Bork\n  Fork";
  assert.compilesTo(emblem, "Blork Snork Bork Fork");
});

test("multiline w/ trailing whitespace", function(assert) {
  var emblem;
  emblem = "' Blork \n  Snork";
  assert.compilesTo(emblem, "Blork  Snork");
});

test("secondline", function(assert) {
  var emblem;
  emblem = "'\n  Good";
  assert.compilesTo(emblem, " Good");
});

test("secondline multiline", function(assert) {
  var emblem;
  emblem = "' \n  Good\n  Bork";
  assert.compilesTo(emblem, " Good Bork");
});

test("with a mustache", function(assert) {
  var emblem;
  emblem = "' Bork {{foo}}!";
  assert.compilesTo(emblem, 'Bork {{foo}}!');
});

test("with mustaches", function(assert) {
  var emblem;
  emblem = "' Bork {{foo}} {{{bar}}}!";
  assert.compilesTo(emblem, 'Bork {{foo}} {{{bar}}}!');
});

test("on each line", function(assert) {
  var emblem;
  emblem = "pre\n  ' This\n  '   should\n  '  hopefully\n  '    work, and work well.";
  assert.compilesTo(emblem, '<pre>This\n\t  should\n\t hopefully\n\t   work, and work well.\n\t</pre>');
});

test("with blank", function(assert) {
  var emblem;
  emblem = "pre\n  ' This\n  '   should\n  '\n  '  hopefully\n  '    work, and work well.";
  assert.compilesTo(emblem, '<pre>This\n\t  should\n\t\n\t hopefully\n\t   work, and work well.\n\t</pre>');
});
*/
