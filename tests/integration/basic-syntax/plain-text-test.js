import { module, test } from 'qunit';
import { w } from 'tests/support/utils';

module('basic syntax: plain-text', function (hooks) {
  module('` helper', function () {
    test("basic", function (assert) {
      assert.compilesTo("` What what", "What what\n");
    });

    test("with html", function (assert) {
      assert.compilesTo('` What <span id="woot" data-t="oof" class="f">what</span>!',
        'What <span id="woot" data-t="oof" class="f">what</span>!\n');
    });

    test('multiline', function (assert) {
      const emblem = w(
        '` Blork',
        '  Snork');

      assert.compilesTo(emblem, "Blork Snork\n");
    });

    test('triple multiline', function (assert) {
      const emblem = w(
        '` Blork',
        '  Snork',
        '  Bork');

      assert.compilesTo(emblem, "Blork Snork Bork\n");
    });

    test('quadruple multiline', function (assert) {
      const emblem = w(
        '` Blork',
        '  Snork',
        '  Bork',
        '  Fork');

      assert.compilesTo(emblem, "Blork Snork Bork Fork\n");
    });

    test('multiline w/ trailing whitespace', function (assert) {
      const emblem = w(
        '` Blork ',
        '  Snork'
      );

      assert.compilesTo(emblem, "Blork  Snork\n");
    });

    test('secondline', function (assert) {
      const emblem = w(
        '`',
        '  Good');

      assert.compilesTo(emblem, "Good\n");
    });

    test('secondline multiline', function (assert) {
      const emblem = w(
        '` ',
        '  Good',
        '  Bork');

      assert.compilesTo(emblem, "Good Bork\n");
    });

    test('with a mustache', function (assert) {
      const emblem = "` Bork {{foo}}!";

      assert.compilesTo(emblem, 'Bork {{foo}}!\n');
    });

    test('with mustaches', function (assert) {
      const emblem = "` Bork {{foo}} {{{bar}}}!";

      assert.compilesTo(emblem, 'Bork {{foo}} {{{bar}}}!\n');
    });

    test('on each line', function (assert) {
      const emblem = w(
        'pre',
        '  \` This',
        '  \`   should',
        '  \`  hopefully',
        '  \`    work, and work well.'
      );

      assert.compilesTo(emblem, `<pre>This\n  should\n hopefully\n   work, and work well.\n</pre>`);
    });

    test("with blank", function (assert) {
      const emblem = w(
        'pre',
        '  \` This',
        '  \`   should',
        '  \`',
        '  \`  hopefully',
        '  \`    work, and work well.'
      );

      assert.compilesTo(
        emblem, '<pre>This\n  should\n\n hopefully\n   work, and work well.\n</pre>');
    });
  });

  module('\' helper', function () {
    test("basic", function (assert) {
      assert.compilesTo("' What what", "What what ");
    });

    test('after a tag', function (assert) {
      const emblem = w(
        'span',
        "  ' trailing space",
      );

      assert.compilesTo(emblem, '<span>trailing space </span>');
    });

    test("with html", function (assert) {
      assert.compilesTo('\' What <span id="woot" data-t="oof" class="f">what</span>!',
        'What <span id="woot" data-t="oof" class="f">what</span>! ');
    });

    test('multiline', function (assert) {
      const emblem = w(
        "' Blork",
        '  Snork'
      );

      assert.compilesTo(emblem, "Blork Snork ");
    });

    test('triple multiline', function (assert) {
      const emblem = w(
        '\' Blork',
        '    Snork',
        '    Bork'
      );

      assert.compilesTo(emblem, "Blork Snork Bork ");
    });

    test('quadruple multiline', function (assert) {
      const emblem = w(
        '\' Blork',
        '      Snork',
        '      Bork',
        '      Fork'
      );

      assert.compilesTo(emblem, "Blork Snork Bork Fork ");
    });

    test('multiline w/ trailing whitespace', function (assert) {
      const emblem = w(
        '\' Blork ',
        '  Snork'
      );

      assert.compilesTo(emblem, "Blork  Snork ");
    });

    test('secondline', function (assert) {
      const emblem = "'\n  Good";

      assert.compilesTo(emblem, "Good ");
    });

    test('secondline multiline', function (assert) {
      const emblem = "' \n  Good\n  Bork";

      assert.compilesTo(emblem, "Good Bork ");
    });

    test('with a mustache', function (assert) {
      const emblem = "' Bork {{foo}}!";

      assert.compilesTo(emblem, 'Bork {{foo}}! ');
    });

    test('with mustaches', function (assert) {
      const emblem = "' Bork {{foo}} {{{bar}}}!";

      assert.compilesTo(emblem, 'Bork {{foo}} {{{bar}}}! ');
    });

    test('on each line', function (assert) {
      const emblem = w(
        'pre',
        '  \' This',
        '  \'   should',
        '  \'  hopefully',
        '  \'    work, and work well.',
      );

      assert.compilesTo(emblem, `<pre>This   should  hopefully    work, and work well. </pre>`);
    });

    test("with blank", function (assert) {
      const emblem = w(
        'pre',
        '  \' This',
        '  \'   should',
        '  \'',
        '  \'  hopefully',
        '  \'    work, and work well.',
      );

      assert.compilesTo(emblem, '<pre>This   should   hopefully    work, and work well. </pre>');
    });
  });

  module('+ helper', function() {
    test("basic", function (assert) {
      assert.compilesTo("+ What what", " What what");
    });

    test("with html", function (assert) {
      assert.compilesTo('+ What <span id="woot" data-t="oof" class="f">what</span>!',
        ' What <span id="woot" data-t="oof" class="f">what</span>!');
    });

    test('multiline', function (assert) {
      const emblem = w(
        '+ Blork',
        '  Snork'
      );

      assert.compilesTo(emblem, " Blork Snork");
    });

    test('triple multiline', function (assert) {
      const emblem = w(
        '+ Blork',
        '  Snork',
        '  Bork'
      );

      assert.compilesTo(emblem, " Blork Snork Bork");
    });

    test('quadruple multiline', function (assert) {
      const emblem = w(
        '+ Blork',
        '  Snork',
        '  Bork',
        '  Fork'
      );

      assert.compilesTo(emblem, " Blork Snork Bork Fork");
    });

    test('multiline w/ trailing whitespace', function (assert) {
      const emblem = w(
        '+ Blork',
        '  Snork'
      );

      assert.compilesTo(emblem, " Blork Snork");
    });


    test('secondline', function (assert) {
      const emblem = "+\n  Good";

      assert.compilesTo(emblem, " Good");
    });

    test('secondline multiline', function (assert) {
      const emblem = "+ \n  Good\n  Bork";

      assert.compilesTo(emblem, " Good Bork");
    });

    test('with a mustache', function (assert) {
      const emblem = "+ Bork {{foo}}!";

      assert.compilesTo(emblem, ' Bork {{foo}}!');
    });

    test('with mustaches', function (assert) {
      const emblem = "+ Bork {{foo}} {{{bar}}}!";

      assert.compilesTo(emblem, ' Bork {{foo}} {{{bar}}}!');
    });

    test('on each line', function (assert) {
      const emblem = w(
        'pre',
        '  + This',
        '  +   should',
        '  +  hopefully',
        '  +    work, and work well.'
      );

      assert.compilesTo(
        emblem, `<pre> This   should  hopefully    work, and work well.</pre>`);
    });

    test("with blank", function (assert) {
      const emblem = w(
        'pre',
        '  + This',
        '  +   should',
        '  +',
        '  +  hopefully',
        '  +    work, and work well.'
      );

      assert.compilesTo(emblem, '<pre> This   should   hopefully    work, and work well.</pre>');
    });
  });

  module('" helper', function() {
    test("basic", function (assert) {
      const emblem = `" What what`;

      assert.compilesTo(emblem, " What what ");
    });

    test("with html", function (assert) {
      assert.compilesTo('" What <span id="woot" data-t="oof" class="f">what</span>!',
        ' What <span id="woot" data-t="oof" class="f">what</span>! ');
    });

    test('multiline', function (assert) {
      const emblem = w(
        '" Blork',
        '  Snork'
      );

      assert.compilesTo(emblem, " Blork Snork ");
    });

    test('triple multiline', function (assert) {
      const emblem = w(
        '" Blork',
        '  Snork',
        '  Bork'
      );

      assert.compilesTo(emblem, " Blork Snork Bork ");
    });

    test('quadruple multiline', function (assert) {
      const emblem = w(
        '" Blork',
        '  Snork',
        '  Bork',
        '  Fork'
      );

      assert.compilesTo(emblem, " Blork Snork Bork Fork ");
    });

    test('secondline', function (assert) {
      const emblem = `"\n  Good`;

      assert.compilesTo(emblem, " Good ");
    });

    test('secondline multiline', function (assert) {
      const emblem = `"\n  Good\n  Bork`;

      assert.compilesTo(emblem, " Good Bork ");
    });

    test('with a mustache', function (assert) {
      const emblem = `" Bork {{foo}}!`;

      assert.compilesTo(emblem, ' Bork {{foo}}! ');
    });

    test('with mustaches', function (assert) {
      const emblem = `" Bork {{foo}} {{{bar}}}!`;

      assert.compilesTo(emblem, ' Bork {{foo}} {{{bar}}}! ');
    });

    test('on each line', function (assert) {
      const emblem = w(
        'pre',
        '  " This',
        '  "   should',
        '  "  hopefully',
        '  "    work, and work well.'
      );

      assert.compilesTo(emblem, '<pre> This    should   hopefully     work, and work well. </pre>');
    });

    test("with blank", function (assert) {
      const emblem = w(
        'pre',
        '  " This',
        '  "   should',
        '  "',
        '  "  hopefully',
        '  "    work, and work well.'
      );

      assert.compilesTo(emblem, '<pre> This    should     hopefully     work, and work well. </pre>');
    });
  });

  module('pipe helper', function() {
    test("basic", function (assert) {
      assert.compilesTo("| What what", "What what");
    });

    test('pipe (|) multiline creates text', function (assert) {
      assert.compilesTo(w(
        '| hello there',
        '   and more'
      ), 'hello there and more');
    });

    test('pipe lines preserves leading spaces', function (assert) {
      let fourSpaces = '    ';
      let threeSpaces = '   ';

      assert.compilesTo(
        '|' + fourSpaces + 'hello there',
        threeSpaces + 'hello there');
    });

    test('multiple pipe lines are concatenated', function (assert) {
      assert.compilesTo(w(
        '| hi there',
        '| and more'
      ), 'hi thereand more');
    });

    test("with html", function (assert) {
      assert.compilesTo('| What <span id="woot" data-t="oof" class="f">what</span>!',
        'What <span id="woot" data-t="oof" class="f">what</span>!');
    });

    test('multiline', function (assert) {
      const emblem = "| Blork\n  Snork";

      assert.compilesTo(emblem, "Blork Snork");
    });

    test('triple multiline', function (assert) {
      const emblem = "| Blork\n  Snork\n  Bork";

      assert.compilesTo(emblem, "Blork Snork Bork");
    });

    test('quadruple multiline', function (assert) {
      const emblem = "| Blork\n  Snork\n  Bork\n  Fork";

      assert.compilesTo(emblem, "Blork Snork Bork Fork");
    });

    test('multiline w/ trailing whitespace', function (assert) {
      const emblem = "| Blork \n  Snork";

      assert.compilesTo(emblem, "Blork  Snork");
    });

    test('secondline', function (assert) {
      const emblem = "|\n  Good";

      assert.compilesTo(emblem, "Good");
    });

    test('secondline multiline', function (assert) {
      const emblem = "| \n  Good\n  Bork";

      assert.compilesTo(emblem, "Good Bork");
    });

    test('with a mustache', function (assert) {
      const emblem = "| Bork {{foo}}!";

      assert.compilesTo(emblem, 'Bork {{foo}}!');
    });

    test('with mustaches', function (assert) {
      const emblem = "| Bork {{foo}} {{{bar}}}!";

      assert.compilesTo(emblem, 'Bork {{foo}} {{{bar}}}!');
    });

    test('on each line', function (assert) {
      const emblem = w(
        'pre',
        '  | This',
        '  |   should',
        '  |  hopefully',
        '  |    work, and work well.'
      );

      assert.compilesTo(
        emblem, `<pre>This  should hopefully   work, and work well.</pre>`);
    });

    test("with blank", function (assert) {
      const emblem = w(
        'pre',
        '  | This',
        '  |   should',
        '  |',
        '  |  hopefully',
        '  |    work, and work well.'
      );

      assert.compilesTo(
        emblem, '<pre>This  should hopefully   work, and work well.</pre>');
    });
  });

  module('indentation', function() {
    test('mixture', function (assert) {
      const emblem = w(
        '        \n',
        '  p Hello\n',
        '  p\n',
        '    | Woot\n',
        '  span yes\n'
      );

      assert.compilesTo(emblem, '<p>Hello</p><p>Woot</p><span>yes</span>');
    });

    test('mixture w/o opening blank', function (assert) {
      const emblem = w(
        '  p Hello\n',
        '  p\n',
        '    | Woot\n',
        '  span yes\n'
      );

      assert.compilesTo(emblem, '<p>Hello</p><p>Woot</p><span>yes</span>');
    });

    test('w/ blank lines', function (assert) {
      const emblem = w(
        '  p Hello\n',
        '  p\n',
        '\n',
        '    | Woot\n',
        '\n',
        '  span yes\n'
      );

      assert.compilesTo(emblem, '<p>Hello</p><p>Woot</p><span>yes</span>');
    });

    test('w/ blank whitespaced lines', function (assert) {
      const emblem = w(
        '  p Hello\n',
        '  p\n',
        '\n',
        '    | Woot\n',
        '        \n',
        '       \n',
        '         \n',
        '\n',
        '  span yes\n',
        '\n',
        '  sally\n',
        '\n',
        '         \n',
        '    | Woot\n'
      );

      assert.compilesTo(emblem, '<p>Hello</p><p>Woot</p><span>yes</span>{{#sally}}Woot{{/sally}}');
    });

    test("it doesn't throw when indenting after a line with inline content", function (assert) {
      const emblem= w(
        "p Hello",
        "  p invalid"
      );

      assert.compilesTo(emblem, "<p>Hello p invalid</p>");
    });

    test("it throws on half dedent", function (assert) {
      const emblem= w(
        "p",
        "    span This is ok",
        "  span This aint"
      );

      assert.compilerThrows(emblem);
    });

    test("new indentation levels don't have to match parents'", function (assert) {
      const emblem= w(
        "p ",
        "  span",
        "     div",
        "      span yes"
      );

      assert.compilesTo(emblem, "<p><span><div><span>yes</span></div></span></p>");
    });

    test("Windows line endings", function (assert) {
      const emblem = ".navigation\r\n  p Hello\r\n#main\r\n  | hi";

      assert.compilesTo(emblem, '<div class="navigation"><p>Hello</p></div><div id="main">hi</div>');
    });

    test("backslash doesn't cause infinite loop", function (assert) {
      const emblem = '| \\';

      assert.compilesTo(emblem, "\\");
    });

    test("backslash doesn't cause infinite loop with letter", function (assert) {
      const emblem = '| \\a';

      assert.compilesTo(emblem, "\\a");
    });

    test("self closing tag with forward slash", function (assert) {
      const emblem = 'hr/';

      assert.compilesTo(emblem, '<hr/>');
    });

    test("non-void elements are still closed correctly", function (assert) {
      const emblem = 'p/';

      assert.compilesTo(emblem, '<p></p>');
    });

    test("tagnames and attributes with colons", function (assert) {
      const emblem = '%al:ex match:neer="snork" Hello!';

      assert.compilesTo(emblem, '<al:ex match:neer="snork">Hello!</al:ex>');
    });

    test("windows newlines", function (assert) {
      const emblem = "\r\n  \r\n  p Hello\r\n\r\n";

      assert.compilesTo(emblem, '<p>Hello</p>');
    });
  });

  module('whitespaces', function() {
    test("spaces after html elements", function (assert) {
      assert.compilesTo("p \n  span asd", "<p><span>asd</span></p>");
      assert.compilesTo("p \nspan  \n\ndiv\nspan",
        "<p></p><span></span><div></div><span></span>");
    });

    test("spaces after mustaches", function (assert) {
      assert.compilesTo("each foo    \n  p \n  span",
        "{{#each foo}}<p></p><span></span>{{/each}}");
    });

    test("it strips out preceding whitespace", function (assert) {
      const emblem= w(
        "",
        "p Hello"
      );

      assert.compilesTo(emblem, "<p>Hello</p>");
    });

    test("it handles preceding indentation", function (assert) {
      const emblem= w(
        "  p Woot",
        "  p Ha"
      );

      assert.compilesTo(emblem, "<p>Woot</p><p>Ha</p>");
    });

    test("it handles preceding indentation and newlines", function (assert) {
      const emblem= w(
        "",
        "  p Woot",
        "  p Ha"
      );

      assert.compilesTo(emblem, "<p>Woot</p><p>Ha</p>");
    });

    test("it handles preceding indentation and newlines pt 2", function (assert) {
      const emblem= w(
        "  ",
        "  p Woot",
        "  p Ha"
      );

      assert.compilesTo(emblem, "<p>Woot</p><p>Ha</p>");
    });

    test('multiple text lines', function (assert) {
      const emblem = w(
        'span Your name is name',
        '  and my name is name'
      );

      assert.compilesTo(emblem, '<span>Your name is name and my name is name</span>');
    });

    test("shouldn't be necessary to insert a space", function (assert) {
      const emblem = "p Hello,\n  How are you?\np I'm fine, thank you.";

      assert.compilesTo(emblem, "<p>Hello, How are you?</p><p>I'm fine, thank you.</p>");
    });

    test("it strips out preceding whitespace", function (assert) {
      const emblem= w(
        "",
        "p Hello"
      );

      assert.compilesTo(emblem, "<p>Hello</p>");
    });

    test("it handles preceding indentation", function (assert) {
      const emblem= w(
        "  p Woot",
        "  p Ha"
      );

      assert.compilesTo(emblem, "<p>Woot</p><p>Ha</p>");
    });

    test("it handles preceding indentation and newlines", function (assert) {
      const emblem= w(
        "",
        "  p Woot",
        "  p Ha"
      );

      assert.compilesTo(emblem, "<p>Woot</p><p>Ha</p>");
    });

    test("it handles preceding indentation and newlines pt 2", function (assert) {
      const emblem= w(
        "  ",
        "  p Woot",
        "  p Ha"
      );

      assert.compilesTo(emblem, "<p>Woot</p><p>Ha</p>");
    });
  });

  module('html', function() {
    test("indented", function (assert) {
      const emblem = w(
        "<p>",
        "  <span>This be some text</span>",
        "  <title>Basic HTML Sample Page</title>",
        "</p>");

        assert.compilesTo(emblem, '<p> <span>This be some text</span> <title>Basic HTML Sample Page</title></p>');
    });

    test("flatlina", function (assert) {
      const emblem = "<p>\n<span>This be some text</span>\n<title>Basic HTML Sample Page</title>\n</p>";

      assert.compilesTo(emblem, '<p><span>This be some text</span><title>Basic HTML Sample Page</title></p>');
    });
  });
});
