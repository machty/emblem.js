/*global QUnit*/

import { w } from '../support/utils';
import Emblem from '../../emblem';
import { compilesTo } from '../support/integration-assertions';

var runTextLineSuite;

/*
  Default plaintext format
 */

QUnit.module("text lines: starting with '|'");

test("basic", function() {
  compilesTo("| What what", "What what");
});

test("with html", function() {
  compilesTo('| What <span id="woot" data-t="oof" class="f">what</span>!',
                    'What <span id="woot" data-t="oof" class="f">what</span>!');
});

test("multiline", function() {
  var emblem;
  emblem = "| Blork\n  Snork";
  compilesTo(emblem, "Blork Snork");
});

test("triple multiline", function() {
  var emblem;
  emblem = "| Blork\n  Snork\n  Bork";
  compilesTo(emblem, "Blork Snork Bork");
});

test("quadruple multiline", function() {
  var emblem;
  emblem = "| Blork\n  Snork\n  Bork\n  Fork";
  compilesTo(emblem, "Blork Snork Bork Fork");
});

test("multiline w/ trailing whitespace", function() {
  var emblem;
  emblem = "| Blork \n  Snork";
  compilesTo(emblem, "Blork  Snork");
});

test("secondline", function() {
  var emblem;
  emblem = "|\n  Good";
  compilesTo(emblem, "Good");
});

test("secondline multiline", function() {
  var emblem;
  emblem = "| \n  Good\n  Bork";
  compilesTo(emblem, "Good Bork");
});

test("with a mustache", function() {
  var emblem;
  emblem = "| Bork {{foo}}!";
  compilesTo(emblem, 'Bork {{foo}}!');
});

test("with mustaches", function() {
  var emblem;
  emblem = "| Bork {{foo}} {{{bar}}}!";
  compilesTo(emblem, 'Bork {{foo}} {{{bar}}}!');
});

test("on each line", function() {
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

test("with blank", function() {
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

test("basic", function() {
  compilesTo("` What what", "What what\n");
});

test("with html", function() {
  compilesTo('` What <span id="woot" data-t="oof" class="f">what</span>!',
                    'What <span id="woot" data-t="oof" class="f">what</span>!\n');
});

test("multiline", function() {
  var emblem;
  emblem = w('` Blork',
             '  Snork');
  compilesTo(emblem, "Blork Snork\n");
});

test("triple multiline", function() {
  var emblem;
  emblem = w('` Blork',
             '  Snork',
             '  Bork');
  compilesTo(emblem, "Blork Snork Bork\n");
});

test("quadruple multiline", function() {
  var emblem;
  emblem = w('` Blork',
             '  Snork',
             '  Bork',
             '  Fork');
  compilesTo(emblem, "Blork Snork Bork Fork\n");
});

test("multiline w/ trailing whitespace", function() {
  var emblem;
  emblem = w('` Blork ',
             '  Snork');
  compilesTo(emblem, "Blork  Snork\n");
});

test("secondline", function() {
  var emblem;
  emblem = w('`',
             '  Good');
  compilesTo(emblem, "Good\n");
});

test("secondline multiline", function() {
  var emblem;
  emblem = w('` ',
             '  Good',
             '  Bork');
  compilesTo(emblem, "Good Bork\n");
});

test("with a mustache", function() {
  var emblem;
  emblem = "` Bork {{foo}}!";
  compilesTo(emblem, 'Bork {{foo}}!\n');
});

test("with mustaches", function() {
  var emblem;
  emblem = "` Bork {{foo}} {{{bar}}}!";
  compilesTo(emblem, 'Bork {{foo}} {{{bar}}}!\n');
});

test("on each line", function() {
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

test("with blank", function() {
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

test("basic", function() {
  compilesTo("' What what", "What what ");
});

test("with html", function() {
  compilesTo('\' What <span id="woot" data-t="oof" class="f">what</span>!',
                    'What <span id="woot" data-t="oof" class="f">what</span>! ');
});

test("multiline", function() {
  var emblem;
  emblem = `' Blork
              Snork`;
  compilesTo(emblem, "Blork Snork ");
});

test("triple multiline", function() {
  var emblem;
  emblem = `' Blork
              Snork
              Bork`;
  compilesTo(emblem, "Blork Snork Bork ");
});

test("quadruple multiline", function() {
  var emblem;
  emblem = `' Blork
              Snork
              Bork
              Fork`;
  compilesTo(emblem, "Blork Snork Bork Fork ");
});

test("multiline w/ trailing whitespace", function() {
  var emblem;
  emblem = `' Blork 
              Snork`;
  compilesTo(emblem, "Blork  Snork ");
});

test("secondline", function() {
  var emblem;
  emblem = "'\n  Good";
  compilesTo(emblem, "Good ");
});

test("secondline multiline", function() {
  var emblem;
  emblem = "' \n  Good\n  Bork";
  compilesTo(emblem, "Good Bork ");
});

test("with a mustache", function() {
  var emblem;
  emblem = "' Bork {{foo}}!";
  compilesTo(emblem, 'Bork {{foo}}! ');
});

test("with mustaches", function() {
  var emblem;
  emblem = "' Bork {{foo}} {{{bar}}}!";
  compilesTo(emblem, 'Bork {{foo}} {{{bar}}}! ');
});

test("on each line", function() {
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

test("with blank", function() {
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

test("basic", function() {
  compilesTo("+ What what", " What what");
});

test("with html", function() {
  compilesTo('+ What <span id="woot" data-t="oof" class="f">what</span>!',
      ' What <span id="woot" data-t="oof" class="f">what</span>!');
});

test("multiline", function() {
  var emblem;
  emblem = `+ Blork
  Snork`;
  compilesTo(emblem, " Blork Snork");
});

test("triple multiline", function() {
  var emblem;
  emblem = `+ Blork
  Snork
  Bork`;
  compilesTo(emblem, " Blork Snork Bork");
});

test("quadruple multiline", function() {
  var emblem;
  emblem = `+ Blork
  Snork
  Bork
  Fork`;
  compilesTo(emblem, " Blork Snork Bork Fork");
});

test("multiline w/ trailing whitespace", function() {
  var emblem;
  emblem = `+ Blork
  Snork`;
  compilesTo(emblem, " Blork Snork");
});

test("secondline", function() {
  var emblem;
  emblem = "+\n  Good";
  compilesTo(emblem, " Good");
});

test("secondline multiline", function() {
  var emblem;
  emblem = "+ \n  Good\n  Bork";
  compilesTo(emblem, " Good Bork");
});

test("with a mustache", function() {
  var emblem;
  emblem = "+ Bork {{foo}}!";
  compilesTo(emblem, ' Bork {{foo}}!');
});

test("with mustaches", function() {
  var emblem;
  emblem = "+ Bork {{foo}} {{{bar}}}!";
  compilesTo(emblem, ' Bork {{foo}} {{{bar}}}!');
});

test("on each line", function() {
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

test("with blank", function() {
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

test("basic", function() {
  var emblem;
  emblem = `" What what`;
  compilesTo(emblem, " What what ");
});

test("with html", function() {
  compilesTo('" What <span id="woot" data-t="oof" class="f">what</span>!',
      ' What <span id="woot" data-t="oof" class="f">what</span>! ');
});

test("multiline", function() {
  var emblem;
  emblem = `" Blork
  Snork`;
  compilesTo(emblem, " Blork Snork ");
});

test("triple multiline", function() {
  var emblem;
  emblem = `" Blork
  Snork
  Bork`;
  compilesTo(emblem, " Blork Snork Bork ");
});

test("quadruple multiline", function() {
  var emblem;
  emblem = `" Blork
  Snork
  Bork
  Fork`;
  compilesTo(emblem, " Blork Snork Bork Fork ");
});

test("multiline w/ trailing whitespace", function() {
  var emblem;
  emblem = `" Blork
  Snork`;
  compilesTo(emblem, " Blork Snork ");
});

test("secondline", function() {
  var emblem;
  emblem = `"\n  Good`;
  compilesTo(emblem, " Good ");
});

test("secondline multiline", function() {
  var emblem;
  emblem = `"\n  Good\n  Bork`;
  compilesTo(emblem, " Good Bork ");
});

test("with a mustache", function() {
  var emblem;
  emblem = `" Bork {{foo}}!`;
  compilesTo(emblem, ' Bork {{foo}}! ');
});

test("with mustaches", function() {
  var emblem;
  emblem = `" Bork {{foo}} {{{bar}}}!`;
  compilesTo(emblem, ' Bork {{foo}} {{{bar}}}! ');
});

test("on each line", function() {
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

test("with blank", function() {
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