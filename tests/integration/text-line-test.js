/*global QUnit*/

import { w } from '../support/utils';
import { compilesTo } from '../support/integration-assertions';

/*
  Default plaintext format
 */

QUnit.module("text lines: starting with '|'");

QUnit.test("basic", function(assert) {
  assert.compilesTo("| What what", "What what");
});

QUnit.test("with html", function(assert) {
  assert.compilesTo('| What <span id="woot" data-t="oof" class="f">what</span>!',
                    'What <span id="woot" data-t="oof" class="f">what</span>!');
});

QUnit.test("multiline", function(assert) {
  var emblem;
  emblem = "| Blork\n  Snork";
  assert.compilesTo(emblem, "Blork Snork");
});

QUnit.test("triple multiline", function(assert) {
  var emblem;
  emblem = "| Blork\n  Snork\n  Bork";
  assert.compilesTo(emblem, "Blork Snork Bork");
});

QUnit.test("quadruple multiline", function(assert) {
  var emblem;
  emblem = "| Blork\n  Snork\n  Bork\n  Fork";
  assert.compilesTo(emblem, "Blork Snork Bork Fork");
});

QUnit.test("multiline w/ trailing whitespace", function(assert) {
  var emblem;
  emblem = "| Blork \n  Snork";
  assert.compilesTo(emblem, "Blork  Snork");
});

QUnit.test("secondline", function(assert) {
  var emblem;
  emblem = "|\n  Good";
  assert.compilesTo(emblem, "Good");
});

QUnit.test("secondline multiline", function(assert) {
  var emblem;
  emblem = "| \n  Good\n  Bork";
  assert.compilesTo(emblem, "Good Bork");
});

QUnit.test("with a mustache", function(assert) {
  var emblem;
  emblem = "| Bork {{foo}}!";
  assert.compilesTo(emblem, 'Bork {{foo}}!');
});

QUnit.test("with mustaches", function(assert) {
  var emblem;
  emblem = "| Bork {{foo}} {{{bar}}}!";
  assert.compilesTo(emblem, 'Bork {{foo}} {{{bar}}}!');
});

QUnit.test("on each line", function(assert) {
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

QUnit.test("with blank", function(assert) {
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

/*
  Add a newline after formatting the plaintext
 */

QUnit.module("text lines: starting with '`' -- backtick ADDS a trailing newline");

QUnit.test("basic", function(assert) {
  assert.compilesTo("` What what", "What what\n");
});

QUnit.test("with html", function(assert) {
  assert.compilesTo('` What <span id="woot" data-t="oof" class="f">what</span>!',
                    'What <span id="woot" data-t="oof" class="f">what</span>!\n');
});

QUnit.test("multiline", function(assert) {
  var emblem;
  emblem = w('` Blork',
             '  Snork');
  assert.compilesTo(emblem, "Blork Snork\n");
});

QUnit.test("triple multiline", function(assert) {
  var emblem;
  emblem = w('` Blork',
             '  Snork',
             '  Bork');
  assert.compilesTo(emblem, "Blork Snork Bork\n");
});

QUnit.test("quadruple multiline", function(assert) {
  var emblem;
  emblem = w('` Blork',
             '  Snork',
             '  Bork',
             '  Fork');
  assert.compilesTo(emblem, "Blork Snork Bork Fork\n");
});

QUnit.test("multiline w/ trailing whitespace", function(assert) {
  var emblem;
  emblem = w('` Blork ',
             '  Snork');
  assert.compilesTo(emblem, "Blork  Snork\n");
});

QUnit.test("secondline", function(assert) {
  var emblem;
  emblem = w('`',
             '  Good');
  assert.compilesTo(emblem, "Good\n");
});

QUnit.test("secondline multiline", function(assert) {
  var emblem;
  emblem = w('` ',
             '  Good',
             '  Bork');
  assert.compilesTo(emblem, "Good Bork\n");
});

QUnit.test("with a mustache", function(assert) {
  var emblem;
  emblem = "` Bork {{foo}}!";
  assert.compilesTo(emblem, 'Bork {{foo}}!\n');
});

QUnit.test("with mustaches", function(assert) {
  var emblem;
  emblem = "` Bork {{foo}} {{{bar}}}!";
  assert.compilesTo(emblem, 'Bork {{foo}} {{{bar}}}!\n');
});

QUnit.test("on each line", function(assert) {
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

QUnit.test("with blank", function(assert) {
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

/*
  Add an extra space after
 */

QUnit.module('text lines: starting with "\'" should add an extra space');

QUnit.test("basic", function(assert) {
  assert.compilesTo("' What what", "What what ");
});

QUnit.test("with html", function(assert) {
  assert.compilesTo('\' What <span id="woot" data-t="oof" class="f">what</span>!',
                    'What <span id="woot" data-t="oof" class="f">what</span>! ');
});

QUnit.test("multiline", function(assert) {
  var emblem;
  emblem = `' Blork
              Snork`;
  assert.compilesTo(emblem, "Blork Snork ");
});

QUnit.test("triple multiline", function(assert) {
  var emblem;
  emblem = `' Blork
              Snork
              Bork`;
  assert.compilesTo(emblem, "Blork Snork Bork ");
});

QUnit.test("quadruple multiline", function(assert) {
  var emblem;
  emblem = `' Blork
              Snork
              Bork
              Fork`;
  assert.compilesTo(emblem, "Blork Snork Bork Fork ");
});

QUnit.test("multiline w/ trailing whitespace", function(assert) {
  var emblem;
  emblem = `' Blork
              Snork`;
  assert.compilesTo(emblem, "Blork Snork ");
});

QUnit.test("secondline", function(assert) {
  var emblem;
  emblem = "'\n  Good";
  assert.compilesTo(emblem, "Good ");
});

QUnit.test("secondline multiline", function(assert) {
  var emblem;
  emblem = "' \n  Good\n  Bork";
  assert.compilesTo(emblem, "Good Bork ");
});

QUnit.test("with a mustache", function(assert) {
  var emblem;
  emblem = "' Bork {{foo}}!";
  assert.compilesTo(emblem, 'Bork {{foo}}! ');
});

QUnit.test("with mustaches", function(assert) {
  var emblem;
  emblem = "' Bork {{foo}} {{{bar}}}!";
  assert.compilesTo(emblem, 'Bork {{foo}} {{{bar}}}! ');
});

QUnit.test("on each line", function(assert) {
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

QUnit.test("with blank", function(assert) {
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

/*
  Add an extra space before
 */

QUnit.module('text lines: starting with "+" should add an extra space before');

QUnit.test("basic", function(assert) {
  assert.compilesTo("+ What what", " What what");
});

QUnit.test("with html", function(assert) {
  assert.compilesTo('+ What <span id="woot" data-t="oof" class="f">what</span>!',
      ' What <span id="woot" data-t="oof" class="f">what</span>!');
});

QUnit.test("multiline", function(assert) {
  var emblem;
  emblem = `+ Blork
  Snork`;
  assert.compilesTo(emblem, " Blork Snork");
});

QUnit.test("triple multiline", function(assert) {
  var emblem;
  emblem = `+ Blork
  Snork
  Bork`;
  assert.compilesTo(emblem, " Blork Snork Bork");
});

QUnit.test("quadruple multiline", function(assert) {
  var emblem;
  emblem = `+ Blork
  Snork
  Bork
  Fork`;
  assert.compilesTo(emblem, " Blork Snork Bork Fork");
});

QUnit.test("multiline w/ trailing whitespace", function(assert) {
  var emblem;
  emblem = `+ Blork
  Snork`;
  assert.compilesTo(emblem, " Blork Snork");
});

QUnit.test("secondline", function(assert) {
  var emblem;
  emblem = "+\n  Good";
  assert.compilesTo(emblem, " Good");
});

QUnit.test("secondline multiline", function(assert) {
  var emblem;
  emblem = "+ \n  Good\n  Bork";
  assert.compilesTo(emblem, " Good Bork");
});

QUnit.test("with a mustache", function(assert) {
  var emblem;
  emblem = "+ Bork {{foo}}!";
  assert.compilesTo(emblem, ' Bork {{foo}}!');
});

QUnit.test("with mustaches", function(assert) {
  var emblem;
  emblem = "+ Bork {{foo}} {{{bar}}}!";
  assert.compilesTo(emblem, ' Bork {{foo}} {{{bar}}}!');
});

QUnit.test("on each line", function(assert) {
  var emblem;
  emblem = `
  pre
    + This
    +   should
    +  hopefully
    +    work, and work well.`;
  assert.compilesTo(
      emblem, `<pre> This   should  hopefully    work, and work well.</pre>`);
});

QUnit.test("with blank", function(assert) {
  var emblem;
  emblem = `
  pre
    + This
    +   should
    +
    +  hopefully
    +    work, and work well.`;
  var expected = '<pre> This   should   hopefully    work, and work well.</pre>';
  assert.compilesTo(emblem, expected);
});

/*
 Add an extra space before and after
 */

QUnit.module('text lines: starting with "\"" should add an extra space before and after');

QUnit.test("basic", function(assert) {
  var emblem;
  emblem = `" What what`;
  assert.compilesTo(emblem, " What what ");
});

QUnit.test("with html", function(assert) {
  assert.compilesTo('" What <span id="woot" data-t="oof" class="f">what</span>!',
      ' What <span id="woot" data-t="oof" class="f">what</span>! ');
});

QUnit.test("multiline", function(assert) {
  var emblem;
  emblem = `" Blork
  Snork`;
  assert.compilesTo(emblem, " Blork Snork ");
});

QUnit.test("triple multiline", function(assert) {
  var emblem;
  emblem = `" Blork
  Snork
  Bork`;
  assert.compilesTo(emblem, " Blork Snork Bork ");
});

QUnit.test("quadruple multiline", function(assert) {
  var emblem;
  emblem = `" Blork
  Snork
  Bork
  Fork`;
  assert.compilesTo(emblem, " Blork Snork Bork Fork ");
});

QUnit.test("multiline w/ trailing whitespace", function(assert) {
  var emblem;
  emblem = `" Blork
  Snork`;
  assert.compilesTo(emblem, " Blork Snork ");
});

QUnit.test("secondline", function(assert) {
  var emblem;
  emblem = `"\n  Good`;
  assert.compilesTo(emblem, " Good ");
});

QUnit.test("secondline multiline", function(assert) {
  var emblem;
  emblem = `"\n  Good\n  Bork`;
  assert.compilesTo(emblem, " Good Bork ");
});

QUnit.test("with a mustache", function(assert) {
  var emblem;
  emblem = `" Bork {{foo}}!`;
  assert.compilesTo(emblem, ' Bork {{foo}}! ');
});

QUnit.test("with mustaches", function(assert) {
  var emblem;
  emblem = `" Bork {{foo}} {{{bar}}}!`;
  assert.compilesTo(emblem, ' Bork {{foo}} {{{bar}}}! ');
});

QUnit.test("on each line", function(assert) {
  var emblem;
  emblem = `
  pre
    " This
    "   should
    "  hopefully
    "    work, and work well.`;
  assert.compilesTo(
      emblem, '<pre> This    should   hopefully     work, and work well. </pre>');
});

QUnit.test("with blank", function(assert) {
  var emblem;
  emblem = `
  pre
   " This
   "   should
   "
   "  hopefully
   "    work, and work well.`;
  var expected = '<pre> This    should     hopefully     work, and work well. </pre>';
  assert.compilesTo(emblem, expected);
});
