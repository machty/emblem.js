/*global QUnit*/

import { w } from '../support/utils';
import { compilesTo } from '../support/integration-assertions';

var runTextLineSuite;

/*
  Default plaintext format
 */

QUnit.module("text lines: starting with '|'");

QUnit.test("basic", function() {
  compilesTo("| What what", "What what");
});

QUnit.test("with html", function() {
  compilesTo('| What <span id="woot" data-t="oof" class="f">what</span>!',
                    'What <span id="woot" data-t="oof" class="f">what</span>!');
});

QUnit.test("multiline", function() {
  var emblem;
  emblem = "| Blork\n  Snork";
  compilesTo(emblem, "Blork Snork");
});

QUnit.test("triple multiline", function() {
  var emblem;
  emblem = "| Blork\n  Snork\n  Bork";
  compilesTo(emblem, "Blork Snork Bork");
});

QUnit.test("quadruple multiline", function() {
  var emblem;
  emblem = "| Blork\n  Snork\n  Bork\n  Fork";
  compilesTo(emblem, "Blork Snork Bork Fork");
});

QUnit.test("multiline w/ trailing whitespace", function() {
  var emblem;
  emblem = "| Blork \n  Snork";
  compilesTo(emblem, "Blork  Snork");
});

QUnit.test("secondline", function() {
  var emblem;
  emblem = "|\n  Good";
  compilesTo(emblem, "Good");
});

QUnit.test("secondline multiline", function() {
  var emblem;
  emblem = "| \n  Good\n  Bork";
  compilesTo(emblem, "Good Bork");
});

QUnit.test("with a mustache", function() {
  var emblem;
  emblem = "| Bork {{foo}}!";
  compilesTo(emblem, 'Bork {{foo}}!');
});

QUnit.test("with mustaches", function() {
  var emblem;
  emblem = "| Bork {{foo}} {{{bar}}}!";
  compilesTo(emblem, 'Bork {{foo}} {{{bar}}}!');
});

QUnit.test("on each line", function() {
  var emblem;
  emblem = `
  pre
    | This
    |   should
    |  hopefully
    |    work, and work well.`;
  compilesTo(
    emblem, `<pre>This  should hopefully   work, and work well.</pre>`);
});

QUnit.test("with blank", function() {
  var emblem;
  emblem = `
  pre
    | This
    |   should
    |
    |  hopefully
    |    work, and work well.`;
  compilesTo(
    emblem, '<pre>This  should hopefully   work, and work well.</pre>');
});

/*
  Add a newline after formatting the plaintext
 */

QUnit.module("text lines: starting with '`' -- backtick ADDS a trailing newline");

QUnit.test("basic", function() {
  compilesTo("` What what", "What what\n");
});

QUnit.test("with html", function() {
  compilesTo('` What <span id="woot" data-t="oof" class="f">what</span>!',
                    'What <span id="woot" data-t="oof" class="f">what</span>!\n');
});

QUnit.test("multiline", function() {
  var emblem;
  emblem = w('` Blork',
             '  Snork');
  compilesTo(emblem, "Blork Snork\n");
});

QUnit.test("triple multiline", function() {
  var emblem;
  emblem = w('` Blork',
             '  Snork',
             '  Bork');
  compilesTo(emblem, "Blork Snork Bork\n");
});

QUnit.test("quadruple multiline", function() {
  var emblem;
  emblem = w('` Blork',
             '  Snork',
             '  Bork',
             '  Fork');
  compilesTo(emblem, "Blork Snork Bork Fork\n");
});

QUnit.test("multiline w/ trailing whitespace", function() {
  var emblem;
  emblem = w('` Blork ',
             '  Snork');
  compilesTo(emblem, "Blork  Snork\n");
});

QUnit.test("secondline", function() {
  var emblem;
  emblem = w('`',
             '  Good');
  compilesTo(emblem, "Good\n");
});

QUnit.test("secondline multiline", function() {
  var emblem;
  emblem = w('` ',
             '  Good',
             '  Bork');
  compilesTo(emblem, "Good Bork\n");
});

QUnit.test("with a mustache", function() {
  var emblem;
  emblem = "` Bork {{foo}}!";
  compilesTo(emblem, 'Bork {{foo}}!\n');
});

QUnit.test("with mustaches", function() {
  var emblem;
  emblem = "` Bork {{foo}} {{{bar}}}!";
  compilesTo(emblem, 'Bork {{foo}} {{{bar}}}!\n');
});

QUnit.test("on each line", function() {
  var emblem;
  emblem = `
  pre
    \` This
    \`   should
    \`  hopefully
    \`    work, and work well.`;
  var expected = `<pre>This\n  should\n hopefully\n   work, and work well.\n</pre>`;
  compilesTo(emblem, expected);
});

QUnit.test("with blank", function() {
  var emblem;
  emblem = `
  pre
    \` This
    \`   should
    \`
    \`  hopefully
    \`    work, and work well.`;
  compilesTo(
    emblem, '<pre>This\n  should\n\n hopefully\n   work, and work well.\n</pre>');
});

/*
  Add an extra space after
 */

QUnit.module('text lines: starting with "\'" should add an extra space');

QUnit.test("basic", function() {
  compilesTo("' What what", "What what ");
});

QUnit.test("with html", function() {
  compilesTo('\' What <span id="woot" data-t="oof" class="f">what</span>!',
                    'What <span id="woot" data-t="oof" class="f">what</span>! ');
});

QUnit.test("multiline", function() {
  var emblem;
  emblem = `' Blork
              Snork`;
  compilesTo(emblem, "Blork Snork ");
});

QUnit.test("triple multiline", function() {
  var emblem;
  emblem = `' Blork
              Snork
              Bork`;
  compilesTo(emblem, "Blork Snork Bork ");
});

QUnit.test("quadruple multiline", function() {
  var emblem;
  emblem = `' Blork
              Snork
              Bork
              Fork`;
  compilesTo(emblem, "Blork Snork Bork Fork ");
});

QUnit.test("multiline w/ trailing whitespace", function() {
  var emblem;
  emblem = `' Blork
              Snork`;
  compilesTo(emblem, "Blork Snork ");
});

QUnit.test("secondline", function() {
  var emblem;
  emblem = "'\n  Good";
  compilesTo(emblem, "Good ");
});

QUnit.test("secondline multiline", function() {
  var emblem;
  emblem = "' \n  Good\n  Bork";
  compilesTo(emblem, "Good Bork ");
});

QUnit.test("with a mustache", function() {
  var emblem;
  emblem = "' Bork {{foo}}!";
  compilesTo(emblem, 'Bork {{foo}}! ');
});

QUnit.test("with mustaches", function() {
  var emblem;
  emblem = "' Bork {{foo}} {{{bar}}}!";
  compilesTo(emblem, 'Bork {{foo}} {{{bar}}}! ');
});

QUnit.test("on each line", function() {
  var emblem;
  emblem = `
  pre
    ' This
    '   should
    '  hopefully
    '    work, and work well.`;
  compilesTo(
    emblem, `<pre>This   should  hopefully    work, and work well. </pre>`);
});

QUnit.test("with blank", function() {
  var emblem;
  emblem = `
  pre
    ' This
    '   should
    '
    '  hopefully
    '    work, and work well.`;
  var expected = '<pre>This   should   hopefully    work, and work well. </pre>';
  compilesTo(emblem, expected);
});

/*
  Add an extra space before
 */

QUnit.module('text lines: starting with "+" should add an extra space before');

QUnit.test("basic", function() {
  compilesTo("+ What what", " What what");
});

QUnit.test("with html", function() {
  compilesTo('+ What <span id="woot" data-t="oof" class="f">what</span>!',
      ' What <span id="woot" data-t="oof" class="f">what</span>!');
});

QUnit.test("multiline", function() {
  var emblem;
  emblem = `+ Blork
  Snork`;
  compilesTo(emblem, " Blork Snork");
});

QUnit.test("triple multiline", function() {
  var emblem;
  emblem = `+ Blork
  Snork
  Bork`;
  compilesTo(emblem, " Blork Snork Bork");
});

QUnit.test("quadruple multiline", function() {
  var emblem;
  emblem = `+ Blork
  Snork
  Bork
  Fork`;
  compilesTo(emblem, " Blork Snork Bork Fork");
});

QUnit.test("multiline w/ trailing whitespace", function() {
  var emblem;
  emblem = `+ Blork
  Snork`;
  compilesTo(emblem, " Blork Snork");
});

QUnit.test("secondline", function() {
  var emblem;
  emblem = "+\n  Good";
  compilesTo(emblem, " Good");
});

QUnit.test("secondline multiline", function() {
  var emblem;
  emblem = "+ \n  Good\n  Bork";
  compilesTo(emblem, " Good Bork");
});

QUnit.test("with a mustache", function() {
  var emblem;
  emblem = "+ Bork {{foo}}!";
  compilesTo(emblem, ' Bork {{foo}}!');
});

QUnit.test("with mustaches", function() {
  var emblem;
  emblem = "+ Bork {{foo}} {{{bar}}}!";
  compilesTo(emblem, ' Bork {{foo}} {{{bar}}}!');
});

QUnit.test("on each line", function() {
  var emblem;
  emblem = `
  pre
    + This
    +   should
    +  hopefully
    +    work, and work well.`;
  compilesTo(
      emblem, `<pre> This   should  hopefully    work, and work well.</pre>`);
});

QUnit.test("with blank", function() {
  var emblem;
  emblem = `
  pre
    + This
    +   should
    +
    +  hopefully
    +    work, and work well.`;
  var expected = '<pre> This   should   hopefully    work, and work well.</pre>';
  compilesTo(emblem, expected);
});

/*
 Add an extra space before and after
 */

QUnit.module('text lines: starting with "\"" should add an extra space before and after');

QUnit.test("basic", function() {
  var emblem;
  emblem = `" What what`;
  compilesTo(emblem, " What what ");
});

QUnit.test("with html", function() {
  compilesTo('" What <span id="woot" data-t="oof" class="f">what</span>!',
      ' What <span id="woot" data-t="oof" class="f">what</span>! ');
});

QUnit.test("multiline", function() {
  var emblem;
  emblem = `" Blork
  Snork`;
  compilesTo(emblem, " Blork Snork ");
});

QUnit.test("triple multiline", function() {
  var emblem;
  emblem = `" Blork
  Snork
  Bork`;
  compilesTo(emblem, " Blork Snork Bork ");
});

QUnit.test("quadruple multiline", function() {
  var emblem;
  emblem = `" Blork
  Snork
  Bork
  Fork`;
  compilesTo(emblem, " Blork Snork Bork Fork ");
});

QUnit.test("multiline w/ trailing whitespace", function() {
  var emblem;
  emblem = `" Blork
  Snork`;
  compilesTo(emblem, " Blork Snork ");
});

QUnit.test("secondline", function() {
  var emblem;
  emblem = `"\n  Good`;
  compilesTo(emblem, " Good ");
});

QUnit.test("secondline multiline", function() {
  var emblem;
  emblem = `"\n  Good\n  Bork`;
  compilesTo(emblem, " Good Bork ");
});

QUnit.test("with a mustache", function() {
  var emblem;
  emblem = `" Bork {{foo}}!`;
  compilesTo(emblem, ' Bork {{foo}}! ');
});

QUnit.test("with mustaches", function() {
  var emblem;
  emblem = `" Bork {{foo}} {{{bar}}}!`;
  compilesTo(emblem, ' Bork {{foo}} {{{bar}}}! ');
});

QUnit.test("on each line", function() {
  var emblem;
  emblem = `
  pre
    " This
    "   should
    "  hopefully
    "    work, and work well.`;
  compilesTo(
      emblem, '<pre> This    should   hopefully     work, and work well. </pre>');
});

QUnit.test("with blank", function() {
  var emblem;
  emblem = `
  pre
   " This
   "   should
   "
   "  hopefully
   "    work, and work well.`;
  var expected = '<pre> This    should     hopefully     work, and work well. </pre>';
  compilesTo(emblem, expected);
});
