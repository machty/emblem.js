define("tests/integration/basic-syntax/colon-syntax-test", ["qunit", "tests/support/utils"], function (_qunit, _utils) {
  "use strict";

  (0, _qunit.module)('basic syntax: colon-syntax', function (hooks) {
    (0, _qunit.test)('basic', function (assert) {
      const emblem = 'each foo: p Hello, #{this}, ${this.name}';
      assert.compilesTo(emblem, '{{#each foo}}<p>Hello, {{this}}, {{this.name}}</p>{{/each}}');
    });
    (0, _qunit.test)('html stack', function (assert) {
      const emblem = '.container: .row: .span5: span Hello';
      assert.compilesTo(emblem, '<div class="container"><div class="row"><div class="span5"><span>Hello</span></div></div></div>');
    });
    (0, _qunit.test)('epic', function (assert) {
      const emblem = '.container: .row: .span5\n  ul#list data-foo="yes": each foo: li\n    span: this';
      assert.compilesTo(emblem, '<div class="container"><div class="row"><div class="span5"><ul id="list" data-foo="yes">{{#each foo}}<li><span>{{this}}</span></li>{{/each}}</ul></div></div></div>');
    });
    (0, _qunit.test)('html stack elements only', function (assert) {
      const emblem = 'p: span: div: p: foo';
      assert.compilesTo(emblem, '<p><span><div><p>{{foo}}</p></div></span></p>');
    });
    (0, _qunit.test)('mixed separators', function (assert) {
      const emblem = '.fun = each foo: %nork = this';
      assert.compilesTo(emblem, '<div class="fun">{{#each foo}}<nork>{{this}}</nork>{{/each}}</div>');
    });
    (0, _qunit.test)('mixed separators rewritten', function (assert) {
      const emblem = '.fun: each foo: %nork: this';
      assert.compilesTo(emblem, '<div class="fun">{{#each foo}}<nork>{{this}}</nork>{{/each}}</div>');
    });
    (0, _qunit.test)('with text terminator', function (assert) {
      const emblem = '.fun: view SomeView | Hello';
      assert.compilesTo(emblem, '<div class="fun">{{#view SomeView}}Hello{{/view}}</div>');
    });
    (0, _qunit.test)('test from heartsentwined', function (assert) {
      assert.compilesTo('li data-foo=bar: a', '<li data-foo={{bar}}><a></a></li>');
      assert.compilesTo("li data-foo='bar': a", '<li data-foo="bar"><a></a></li>');
    });
    (0, _qunit.test)('mixture of colon and indentation', function (assert) {
      const emblem = "li data-foo=bar: a\n  baz";
      assert.compilesTo(emblem, '<li data-foo={{bar}}><a>{{baz}}</a></li>');
    });
    (0, _qunit.test)('mixture of colon and indentation pt.2', function (assert) {
      const emblem = (0, _utils.w)('ul', '  li data-foo=bar: a quux', "  li data-foo='bar': a quux", "  li data-foo=bar href='#': a quux");
      assert.compilesTo(emblem, '<ul><li data-foo={{bar}}><a>quux</a></li><li data-foo="bar"><a>quux</a></li><li data-foo={{bar}} href="#"><a>quux</a></li></ul>');
    });
    (0, _qunit.test)('condensed nesting', function (assert) {
      const emblem = `
    #content-frame: .container: .row
      .span4: render "sidebar"
      .span8: render "main"
    `;
      assert.compilesTo(emblem, '<div id="content-frame"><div class="container"><div class="row"><div class="span4">{{render "sidebar"}}</div><div class="span8">{{render "main"}}</div></div></div></div>');
    });
  });
});
define("tests/integration/basic-syntax/comments-test", ["qunit", "tests/support/utils"], function (_qunit, _utils) {
  "use strict";

  (0, _qunit.module)('basic syntax: comments', function (hooks) {
    (0, _qunit.test)("it strips out single line '/' comments", function (assert) {
      const emblem = (0, _utils.w)("p Hello", "", "/ A comment", "", "h1 How are you?");
      assert.compilesTo(emblem, "<p>Hello</p><h1>How are you?</h1>");
    });
    (0, _qunit.test)("it strips out multi-line '/' comments", function (assert) {
      const emblem = (0, _utils.w)("p Hello", "", "/ A comment", "  that goes on to two lines", "  even three!", "", "h1 How are you?");
      assert.compilesTo(emblem, "<p>Hello</p><h1>How are you?</h1>");
    });
    (0, _qunit.test)("it strips out multi-line '/' comments without text on the first line", function (assert) {
      const emblem = (0, _utils.w)("p Hello", "", "/ ", "  A comment", "  that goes on to two lines", "  even three!", "", "h1 How are you?");
      assert.compilesTo(emblem, "<p>Hello</p><h1>How are you?</h1>");
    });
    (0, _qunit.test)("mix and match with various indentation", function (assert) {
      const emblem = (0, _utils.w)("/ A test", "p Hello", "", "span", "  / This is gnarly", "  p Yessir nope.", "", "/ Nothin but comments", "  so many comments.", "", "/", "  p Should not show up");
      assert.compilesTo(emblem, "<p>Hello</p><span><p>Yessir nope.</p></span>");
    });
    (0, _qunit.test)("uneven indentation", function (assert) {
      const emblem = (0, _utils.w)("/ nop", "  nope", "    nope");
      assert.compilesTo(emblem, "");
    });
    (0, _qunit.test)("uneven indentation 2", function (assert) {
      const emblem = (0, _utils.w)("/ n", "  no", "    nop", "  nope");
      assert.compilesTo(emblem, "");
    });
    (0, _qunit.test)("uneven indentation 3", function (assert) {
      const emblem = (0, _utils.w)("/ n", "  no", "    nop", "  nope");
      assert.compilesTo(emblem, "");
    });
    (0, _qunit.test)("empty first line", function (assert) {
      const emblem = (0, _utils.w)("/ ", "  nop", "  nope", "    nope", "  no");
      assert.compilesTo(emblem, "");
    });
    (0, _qunit.test)("on same line as html content", function (assert) {
      const emblem = (0, _utils.w)(".container / This comment doesn't show up", "  .row / Nor does this", "    p Hello");
      assert.compilesTo(emblem, '<div class="container"><div class="row"><p>Hello</p></div></div>');
    });
    (0, _qunit.test)("on same line as mustache content", function (assert) {
      assert.compilesTo('frank text="YES" text2="NO" / omg', '{{frank text="YES" text2="NO"}}');
    });
    (0, _qunit.test)("on same line as colon syntax", function (assert) {
      const emblem = (0, _utils.w)("ul: li: span / omg", "  | Hello");
      assert.compilesTo(emblem, "<ul><li><span>Hello</span></li></ul>");
    });
    (0, _qunit.test)("mustaches with blocks and comments", function (assert) {
      const emblem = (0, _utils.w)('/ Hi', '= if foo', '  p Hi', '/ Bye', '= else if bar', '  p bye');
      assert.compilesTo(emblem, '{{#if foo}}<p>Hi</p>{{else if bar}}<p>bye</p>{{/if}}');
    });
  });
});
define("tests/integration/basic-syntax/css-classes-test", ["qunit"], function (_qunit) {
  "use strict";

  (0, _qunit.module)('basic syntax: css-classes', function (hooks) {
    (0, _qunit.test)('class only', function (assert) {
      assert.compilesTo('p class="yes" Blork', '<p class="yes">Blork</p>');
    });
    (0, _qunit.test)('class shorthand', function (assert) {
      assert.compilesTo(".woot", '<div class="woot"></div>');
      assert.compilesTo("span.woot", '<span class="woot"></span>');
      assert.compilesTo("span.woot.loot", '<span class="woot loot"></span>');
      assert.compilesTo("span .woot.loot", '<span class="woot loot"></span>');
      assert.compilesTo("span.woot .loot", '<span class="woot loot"></span>');
    });
    (0, _qunit.test)('classes + ids', function (assert) {
      assert.compilesTo(".woot#hello", '<div id="hello" class="woot"></div>');
      assert.compilesTo("#hello .woot", '<div id="hello" class="woot"></div>');
      assert.compilesTo(".woot #hello", '<div id="hello" class="woot"></div>');
      assert.compilesTo("#id.woot #hello", '<div id="hello" class="woot"></div>');
      assert.compilesTo("span.woot#hello", '<span id="hello" class="woot"></span>');
      assert.compilesTo("span .woot#hello", '<span id="hello" class="woot"></span>');
      assert.compilesTo("span.woot #hello", '<span id="hello" class="woot"></span>');
      assert.compilesTo("span.woot.loot#hello", '<span id="hello" class="woot loot"></span>');
      assert.compilesTo("span .woot.loot#hello", '<span id="hello" class="woot loot"></span>');
      assert.compilesTo("span.woot.loot #hello", '<span id="hello" class="woot loot"></span>');
      assert.compilesTo("span.woot.loot#hello.boot", '<span id="hello" class="woot loot boot"></span>');
      assert.compilesTo("span.woot.loot #hello.boot", '<span id="hello" class="woot loot boot"></span>');
      assert.compilesTo("span#id.woot.loot #hello.boot", '<span id="hello" class="woot loot boot"></span>');
      assert.compilesTo("span.woot#id.loot #hello.boot", '<span id="hello" class="woot loot boot"></span>');
    });
    (0, _qunit.test)('class and id', function (assert) {
      assert.compilesTo('p id="yes" class="no" Blork', '<p id="yes" class="no">Blork</p>');
    });
    (0, _qunit.test)('class and id and embedded html one-liner', function (assert) {
      assert.compilesTo('p id="yes" class="no" One <b>asd</b>!', '<p id="yes" class="no">One <b>asd</b>!</p>');
    });
    (0, _qunit.test)('numbers in shorthand', function (assert) {
      assert.compilesTo('.4a', '<div class="4a"></div>');
      assert.compilesTo('.4', '<div class="4"></div>');
    });
    (0, _qunit.module)('class name coalescing', function () {
      (0, _qunit.test)('when literal class is used', function (assert) {
        assert.compilesTo('p.foo class="bar"', '<p class="foo bar"></p>');
      });
      (0, _qunit.test)('when ember expression is used with variable', function (assert) {
        assert.compilesTo('p.foo class=bar', '<p class="foo {{bar}}"></p>');
      });
      (0, _qunit.test)('when ember expression is used with variable in braces', function (assert) {
        assert.compilesTo('p.foo class={ bar }', '<p class="foo {{bar}}"></p>');
      });
      (0, _qunit.test)('when ember expression is used with constant in braces', function (assert) {
        assert.compilesTo('p.foo class={ :bar }', '<p class="foo bar"></p>');
      });
      (0, _qunit.test)('when ember expression is used with constant and variable in braces', function (assert) {
        assert.compilesTo('p.foo class={ :bar bar }', '<p class="foo bar {{bar}}"></p>');
      });
    });
  });
});
define("tests/integration/basic-syntax/html-attributes-test", ["qunit"], function (_qunit) {
  "use strict";

  (0, _qunit.module)('basic syntax: html-attributes', function (hooks) {
    (0, _qunit.module)('boolean', function () {
      (0, _qunit.test)('static', function (assert) {
        assert.compilesTo('p borf=true', '<p borf></p>');
        assert.compilesTo('p borf=true Woot', '<p borf>Woot</p>');
        assert.compilesTo('p borf=false', '<p></p>');
        assert.compilesTo('p borf=false Nork', '<p>Nork</p>');
        assert.compilesTo('option selected=true Thingeroo', '<option selected>Thingeroo</option>');
      });
      (0, _qunit.test)('numbers in shorthand', function (assert) {
        assert.compilesTo('%4', '<4/>');
        assert.compilesTo('%4 ermagerd', '<4>ermagerd</4>');
        assert.compilesTo('%4#4.4 ermagerd', '<4 id="4" class="4">ermagerd</4>');
      });
    });
    (0, _qunit.module)('numbers', function () {
      (0, _qunit.test)('number literals as attributes', function (assert) {
        assert.compilesTo('td colspan=3', '<td colspan=3></td>');
      });
      (0, _qunit.test)('large number literals as attributes', function (assert) {
        assert.compilesTo('td colspan=35234', '<td colspan=35234></td>');
      });
      (0, _qunit.test)('negative numbers should work', function (assert) {
        assert.compilesTo("foo positive=100 negative=-100", '{{foo positive=100 negative=-100}}');
      });
    });
    (0, _qunit.module)('tags without content', function () {
      (0, _qunit.test)('empty', function (assert) {
        assert.compilesTo('p class=""', '<p class=""></p>');
      });
      (0, _qunit.test)('class only', function (assert) {
        assert.compilesTo('p class="yes"', '<p class="yes"></p>');
      });
      (0, _qunit.test)('id only', function (assert) {
        assert.compilesTo('p id="yes"', '<p id="yes"></p>');
      });
      (0, _qunit.test)('class and id', function (assert) {
        assert.compilesTo('p id="yes" class="no"', '<p id="yes" class="no"></p>');
      });
    });
    (0, _qunit.module)('mixed quotes', function () {
      (0, _qunit.test)('single empty', function (assert) {
        assert.compilesTo("p class=''", '<p class=""></p>');
      });
      (0, _qunit.test)('single full', function (assert) {
        assert.compilesTo("p class='woot yeah'", '<p class="woot yeah"></p>');
      });
      (0, _qunit.test)('mixed', function (assert) {
        assert.compilesTo("p class='woot \"oof\" yeah'", '<p class="woot \\"oof\\" yeah"></p>');
      });
    });
  });
});
define("tests/integration/basic-syntax/ids-test", ["qunit"], function (_qunit) {
  "use strict";

  (0, _qunit.module)('basic syntax: ids', function (hooks) {
    (0, _qunit.test)('id only', function (assert) {
      assert.compilesTo('p id="yes" Hyeah', '<p id="yes">Hyeah</p>');
    });
    (0, _qunit.test)('id shorthand', function (assert) {
      assert.compilesTo("#woot", '<div id="woot"></div>');
      assert.compilesTo("span#woot", '<span id="woot"></span>');
    });
    (0, _qunit.test)('ids + classes', function (assert) {
      assert.compilesTo("#woot.foo", '<div id="woot" class="foo"></div>');
      assert.compilesTo("span#woot.bar.baz", '<span id="woot" class="bar baz"></span>');
    });
    (0, _qunit.test)('numbers in shorthand', function (assert) {
      assert.compilesTo('#4a', '<div id="4a"></div>');
      assert.compilesTo('#4', '<div id="4"></div>');
    });
  });
});
define("tests/integration/basic-syntax/multi-line-parameters-test", ["qunit", "tests/support/utils"], function (_qunit, _utils) {
  "use strict";

  (0, _qunit.module)('basic syntax: multi-line-parameters', function (hooks) {
    (0, _qunit.test)('bracketed attributes', function (assert) {
      const emblem = "p [\n  id=\"yes\"\n  class=\"no\" \n]\n  | Bracketed Attributes FTW!";
      assert.compilesTo(emblem, '<p id="yes" class="no">Bracketed Attributes FTW!</p>');
    });
    (0, _qunit.test)('bracketed mustache attributes', function (assert) {
      const emblem = "p [\n  onclick={ action 'foo' }\n  class=\"no\" \n]\n  | Bracketed Attributes FTW!";
      assert.compilesTo(emblem, '<p onclick={{action \'foo\'}} class="no">Bracketed Attributes FTW!</p>');
    });
    (0, _qunit.test)('bracketed text', function (assert) {
      const emblem = "p [ Bracketed text is cool ]";
      assert.compilerThrows(emblem);
    });
    (0, _qunit.test)('bracketed text indented', function (assert) {
      const emblem = "p\n  | [ Bracketed text is cool ]";
      assert.compilerThrows(emblem);
    });
    (0, _qunit.test)('bracketed statement with comment and blank lines', function (assert) {
      const emblem = (0, _utils.w)('div [', '  foo=bar', '', '  ', '  / We need to add more', ']');
      assert.compilesTo(emblem, '<div foo={{bar}}></div>');
    });
    (0, _qunit.test)('bracketed statement end bracket', function (assert) {
      const emblem = (0, _utils.w)('div [', '  foo=bar', '  ', '  data=baz', ']');
      assert.compilesTo(emblem, '<div foo={{bar}} data={{baz}}></div>');
    });
    (0, _qunit.test)('bracketed statement and block', function (assert) {
      const emblem = (0, _utils.w)('a [', '  href={ generate-link foo.bar }', '  ', ']', '  | Foo');
      assert.compilesTo(emblem, '<a href={{generate-link foo.bar}}>Foo</a>');
    });
    (0, _qunit.test)('bracketed statement and block - case 2', function (assert) {
      const emblem = (0, _utils.w)('a [', '  href={ generate-link foo.bar }', '  ', '] ', '  | Foo');
      assert.compilesTo(emblem, '<a href={{generate-link foo.bar}}>Foo</a>');
    });
    (0, _qunit.test)('bracketed statement and block - case 3', function (assert) {
      const emblem = (0, _utils.w)('a [', '  href={ generate-link foo.bar }', '  ', ']: foo');
      assert.compilesTo(emblem, '<a href={{generate-link foo.bar}}>{{foo}}</a>');
    });
    (0, _qunit.test)('bracketed statement and block - case 4', function (assert) {
      const emblem = (0, _utils.w)('a [', '  href={ generate-link foo.bar }', '  ', ']: = foo');
      assert.compilesTo(emblem, '<a href={{generate-link foo.bar}}>{{foo}}</a>');
    });
    (0, _qunit.test)('bracketed statement and block - case 5', function (assert) {
      const emblem = (0, _utils.w)('a [', '  href={generate-link foo.bar}', '  ', ']: | Foo');
      assert.compilesTo(emblem, '<a href={{generate-link foo.bar}}>Foo</a>');
    });
  });
});
define("tests/integration/basic-syntax/nested-elements-test", ["qunit", "tests/support/utils"], function (_qunit, _utils) {
  "use strict";

  (0, _qunit.module)('basic syntax: nested-elements', function (hooks) {
    (0, _qunit.test)('nesting', function (assert) {
      const emblem = "p class=\"hello\" data-foo=\"gnarly\"\n  span Yes";
      assert.compilesTo(emblem, '<p data-foo="gnarly" class="hello"><span>Yes</span></p>');
    });
    (0, _qunit.test)("basic", function (assert) {
      const emblem = (0, _utils.w)("p", "  span Hello", "  strong Hi", "div", "  p Hooray");
      assert.compilesTo(emblem, '<p><span>Hello</span><strong>Hi</strong></p><div><p>Hooray</p></div>');
    });
    (0, _qunit.test)("empty nest", function (assert) {
      const emblem = (0, _utils.w)("p", "  span", "    strong", "      i");
      assert.compilesTo(emblem, '<p><span><strong><i></i></strong></span></p>');
    });
    (0, _qunit.test)("empty nest w/ attribute shorthand", function (assert) {
      const emblem = (0, _utils.w)("p.woo", "  span#yes", "    strong.no.yes", "      i");
      assert.compilesTo(emblem, '<p class="woo"><span id="yes"><strong class="no yes"><i></i></strong></span></p>');
    });
    (0, _qunit.test)("indentation doesn't need to match starting inline content's", function (assert) {
      const emblem = (0, _utils.w)("  span Hello,", "    How are you?");
      assert.compilesTo(emblem, "<span>Hello, How are you?</span>");
    });
    (0, _qunit.test)("indentation may consty between parent/child, must be consistent within inline-block", function (assert) {
      const emblem = (0, _utils.w)("div", "      span Hello,", "           How are you?", "           Excellent.", "      p asd");
      assert.compilesTo(emblem, "<div><span>Hello, How are you? Excellent.</span><p>asd</p></div>");
    });
    (0, _qunit.test)("indentation may consty between parent/child, will throw", function (assert) {
      const emblem = (0, _utils.w)("div", "  span Hello,", "       How are you?", "     Excellent.");
      assert.compilerThrows(emblem);
    });
    (0, _qunit.test)("indentation may consty between parent/child, must be consistent within inline-block pt 2", function (assert) {
      const emblem = (0, _utils.w)("div", "  span Hello,", "       How are you?", "       Excellent.");
      assert.compilesTo(emblem, "<div><span>Hello, How are you? Excellent.</span></div>");
    });
    (0, _qunit.test)("with followup", function (assert) {
      const emblem = (0, _utils.w)("p This is", "  pretty cool.", "p Hello.");
      assert.compilesTo(emblem, "<p>This is pretty cool.</p><p>Hello.</p>");
    });
  });
});
define("tests/integration/basic-syntax/plain-text-test", ["qunit", "tests/support/utils"], function (_qunit, _utils) {
  "use strict";

  (0, _qunit.module)('basic syntax: plain-text', function (hooks) {
    (0, _qunit.module)('` helper', function () {
      (0, _qunit.test)("basic", function (assert) {
        assert.compilesTo("` What what", "What what\n");
      });
      (0, _qunit.test)("with html", function (assert) {
        assert.compilesTo('` What <span id="woot" data-t="oof" class="f">what</span>!', 'What <span id="woot" data-t="oof" class="f">what</span>!\n');
      });
      (0, _qunit.test)('multiline', function (assert) {
        const emblem = (0, _utils.w)('` Blork', '  Snork');
        assert.compilesTo(emblem, "Blork Snork\n");
      });
      (0, _qunit.test)('triple multiline', function (assert) {
        const emblem = (0, _utils.w)('` Blork', '  Snork', '  Bork');
        assert.compilesTo(emblem, "Blork Snork Bork\n");
      });
      (0, _qunit.test)('quadruple multiline', function (assert) {
        const emblem = (0, _utils.w)('` Blork', '  Snork', '  Bork', '  Fork');
        assert.compilesTo(emblem, "Blork Snork Bork Fork\n");
      });
      (0, _qunit.test)('multiline w/ trailing whitespace', function (assert) {
        const emblem = (0, _utils.w)('` Blork ', '  Snork');
        assert.compilesTo(emblem, "Blork  Snork\n");
      });
      (0, _qunit.test)('secondline', function (assert) {
        const emblem = (0, _utils.w)('`', '  Good');
        assert.compilesTo(emblem, "Good\n");
      });
      (0, _qunit.test)('secondline multiline', function (assert) {
        const emblem = (0, _utils.w)('` ', '  Good', '  Bork');
        assert.compilesTo(emblem, "Good Bork\n");
      });
      (0, _qunit.test)('with a mustache', function (assert) {
        const emblem = "` Bork {{foo}}!";
        assert.compilesTo(emblem, 'Bork {{foo}}!\n');
      });
      (0, _qunit.test)('with mustaches', function (assert) {
        const emblem = "` Bork {{foo}} {{{bar}}}!";
        assert.compilesTo(emblem, 'Bork {{foo}} {{{bar}}}!\n');
      });
      (0, _qunit.test)('on each line', function (assert) {
        const emblem = (0, _utils.w)('pre', '  \` This', '  \`   should', '  \`  hopefully', '  \`    work, and work well.');
        assert.compilesTo(emblem, `<pre>This\n  should\n hopefully\n   work, and work well.\n</pre>`);
      });
      (0, _qunit.test)("with blank", function (assert) {
        const emblem = (0, _utils.w)('pre', '  \` This', '  \`   should', '  \`', '  \`  hopefully', '  \`    work, and work well.');
        assert.compilesTo(emblem, '<pre>This\n  should\n\n hopefully\n   work, and work well.\n</pre>');
      });
    });
    (0, _qunit.module)('\' helper', function () {
      (0, _qunit.test)("basic", function (assert) {
        assert.compilesTo("' What what", "What what ");
      });
      (0, _qunit.test)('after a tag', function (assert) {
        const emblem = (0, _utils.w)('span', "  ' trailing space");
        assert.compilesTo(emblem, '<span>trailing space </span>');
      });
      (0, _qunit.test)("with html", function (assert) {
        assert.compilesTo('\' What <span id="woot" data-t="oof" class="f">what</span>!', 'What <span id="woot" data-t="oof" class="f">what</span>! ');
      });
      (0, _qunit.test)('multiline', function (assert) {
        const emblem = (0, _utils.w)("' Blork", '  Snork');
        assert.compilesTo(emblem, "Blork Snork ");
      });
      (0, _qunit.test)('triple multiline', function (assert) {
        const emblem = (0, _utils.w)('\' Blork', '    Snork', '    Bork');
        assert.compilesTo(emblem, "Blork Snork Bork ");
      });
      (0, _qunit.test)('quadruple multiline', function (assert) {
        const emblem = (0, _utils.w)('\' Blork', '      Snork', '      Bork', '      Fork');
        assert.compilesTo(emblem, "Blork Snork Bork Fork ");
      });
      (0, _qunit.test)('multiline w/ trailing whitespace', function (assert) {
        const emblem = (0, _utils.w)('\' Blork ', '  Snork');
        assert.compilesTo(emblem, "Blork  Snork ");
      });
      (0, _qunit.test)('secondline', function (assert) {
        const emblem = "'\n  Good";
        assert.compilesTo(emblem, "Good ");
      });
      (0, _qunit.test)('secondline multiline', function (assert) {
        const emblem = "' \n  Good\n  Bork";
        assert.compilesTo(emblem, "Good Bork ");
      });
      (0, _qunit.test)('with a mustache', function (assert) {
        const emblem = "' Bork {{foo}}!";
        assert.compilesTo(emblem, 'Bork {{foo}}! ');
      });
      (0, _qunit.test)('with mustaches', function (assert) {
        const emblem = "' Bork {{foo}} {{{bar}}}!";
        assert.compilesTo(emblem, 'Bork {{foo}} {{{bar}}}! ');
      });
      (0, _qunit.test)('on each line', function (assert) {
        const emblem = (0, _utils.w)('pre', '  \' This', '  \'   should', '  \'  hopefully', '  \'    work, and work well.');
        assert.compilesTo(emblem, `<pre>This   should  hopefully    work, and work well. </pre>`);
      });
      (0, _qunit.test)("with blank", function (assert) {
        const emblem = (0, _utils.w)('pre', '  \' This', '  \'   should', '  \'', '  \'  hopefully', '  \'    work, and work well.');
        assert.compilesTo(emblem, '<pre>This   should   hopefully    work, and work well. </pre>');
      });
    });
    (0, _qunit.module)('+ helper', function () {
      (0, _qunit.test)("basic", function (assert) {
        assert.compilesTo("+ What what", " What what");
      });
      (0, _qunit.test)("with html", function (assert) {
        assert.compilesTo('+ What <span id="woot" data-t="oof" class="f">what</span>!', ' What <span id="woot" data-t="oof" class="f">what</span>!');
      });
      (0, _qunit.test)('multiline', function (assert) {
        const emblem = (0, _utils.w)('+ Blork', '  Snork');
        assert.compilesTo(emblem, " Blork Snork");
      });
      (0, _qunit.test)('triple multiline', function (assert) {
        const emblem = (0, _utils.w)('+ Blork', '  Snork', '  Bork');
        assert.compilesTo(emblem, " Blork Snork Bork");
      });
      (0, _qunit.test)('quadruple multiline', function (assert) {
        const emblem = (0, _utils.w)('+ Blork', '  Snork', '  Bork', '  Fork');
        assert.compilesTo(emblem, " Blork Snork Bork Fork");
      });
      (0, _qunit.test)('multiline w/ trailing whitespace', function (assert) {
        const emblem = (0, _utils.w)('+ Blork', '  Snork');
        assert.compilesTo(emblem, " Blork Snork");
      });
      (0, _qunit.test)('secondline', function (assert) {
        const emblem = "+\n  Good";
        assert.compilesTo(emblem, " Good");
      });
      (0, _qunit.test)('secondline multiline', function (assert) {
        const emblem = "+ \n  Good\n  Bork";
        assert.compilesTo(emblem, " Good Bork");
      });
      (0, _qunit.test)('with a mustache', function (assert) {
        const emblem = "+ Bork {{foo}}!";
        assert.compilesTo(emblem, ' Bork {{foo}}!');
      });
      (0, _qunit.test)('with mustaches', function (assert) {
        const emblem = "+ Bork {{foo}} {{{bar}}}!";
        assert.compilesTo(emblem, ' Bork {{foo}} {{{bar}}}!');
      });
      (0, _qunit.test)('on each line', function (assert) {
        const emblem = (0, _utils.w)('pre', '  + This', '  +   should', '  +  hopefully', '  +    work, and work well.');
        assert.compilesTo(emblem, `<pre> This   should  hopefully    work, and work well.</pre>`);
      });
      (0, _qunit.test)("with blank", function (assert) {
        const emblem = (0, _utils.w)('pre', '  + This', '  +   should', '  +', '  +  hopefully', '  +    work, and work well.');
        assert.compilesTo(emblem, '<pre> This   should   hopefully    work, and work well.</pre>');
      });
    });
    (0, _qunit.module)('" helper', function () {
      (0, _qunit.test)("basic", function (assert) {
        const emblem = `" What what`;
        assert.compilesTo(emblem, " What what ");
      });
      (0, _qunit.test)("with html", function (assert) {
        assert.compilesTo('" What <span id="woot" data-t="oof" class="f">what</span>!', ' What <span id="woot" data-t="oof" class="f">what</span>! ');
      });
      (0, _qunit.test)('multiline', function (assert) {
        const emblem = (0, _utils.w)('" Blork', '  Snork');
        assert.compilesTo(emblem, " Blork Snork ");
      });
      (0, _qunit.test)('triple multiline', function (assert) {
        const emblem = (0, _utils.w)('" Blork', '  Snork', '  Bork');
        assert.compilesTo(emblem, " Blork Snork Bork ");
      });
      (0, _qunit.test)('quadruple multiline', function (assert) {
        const emblem = (0, _utils.w)('" Blork', '  Snork', '  Bork', '  Fork');
        assert.compilesTo(emblem, " Blork Snork Bork Fork ");
      });
      (0, _qunit.test)('secondline', function (assert) {
        const emblem = `"\n  Good`;
        assert.compilesTo(emblem, " Good ");
      });
      (0, _qunit.test)('secondline multiline', function (assert) {
        const emblem = `"\n  Good\n  Bork`;
        assert.compilesTo(emblem, " Good Bork ");
      });
      (0, _qunit.test)('with a mustache', function (assert) {
        const emblem = `" Bork {{foo}}!`;
        assert.compilesTo(emblem, ' Bork {{foo}}! ');
      });
      (0, _qunit.test)('with mustaches', function (assert) {
        const emblem = `" Bork {{foo}} {{{bar}}}!`;
        assert.compilesTo(emblem, ' Bork {{foo}} {{{bar}}}! ');
      });
      (0, _qunit.test)('on each line', function (assert) {
        const emblem = (0, _utils.w)('pre', '  " This', '  "   should', '  "  hopefully', '  "    work, and work well.');
        assert.compilesTo(emblem, '<pre> This    should   hopefully     work, and work well. </pre>');
      });
      (0, _qunit.test)("with blank", function (assert) {
        const emblem = (0, _utils.w)('pre', '  " This', '  "   should', '  "', '  "  hopefully', '  "    work, and work well.');
        assert.compilesTo(emblem, '<pre> This    should     hopefully     work, and work well. </pre>');
      });
    });
    (0, _qunit.module)('pipe helper', function () {
      (0, _qunit.test)("basic", function (assert) {
        assert.compilesTo("| What what", "What what");
      });
      (0, _qunit.test)('pipe (|) multiline creates text', function (assert) {
        assert.compilesTo((0, _utils.w)('| hello there', '   and more'), 'hello there and more');
      });
      (0, _qunit.test)('pipe lines preserves leading spaces', function (assert) {
        let fourSpaces = '    ';
        let threeSpaces = '   ';
        assert.compilesTo('|' + fourSpaces + 'hello there', threeSpaces + 'hello there');
      });
      (0, _qunit.test)('multiple pipe lines are concatenated', function (assert) {
        assert.compilesTo((0, _utils.w)('| hi there', '| and more'), 'hi thereand more');
      });
      (0, _qunit.test)("with html", function (assert) {
        assert.compilesTo('| What <span id="woot" data-t="oof" class="f">what</span>!', 'What <span id="woot" data-t="oof" class="f">what</span>!');
      });
      (0, _qunit.test)('multiline', function (assert) {
        const emblem = "| Blork\n  Snork";
        assert.compilesTo(emblem, "Blork Snork");
      });
      (0, _qunit.test)('triple multiline', function (assert) {
        const emblem = "| Blork\n  Snork\n  Bork";
        assert.compilesTo(emblem, "Blork Snork Bork");
      });
      (0, _qunit.test)('quadruple multiline', function (assert) {
        const emblem = "| Blork\n  Snork\n  Bork\n  Fork";
        assert.compilesTo(emblem, "Blork Snork Bork Fork");
      });
      (0, _qunit.test)('multiline w/ trailing whitespace', function (assert) {
        const emblem = "| Blork \n  Snork";
        assert.compilesTo(emblem, "Blork  Snork");
      });
      (0, _qunit.test)('secondline', function (assert) {
        const emblem = "|\n  Good";
        assert.compilesTo(emblem, "Good");
      });
      (0, _qunit.test)('secondline multiline', function (assert) {
        const emblem = "| \n  Good\n  Bork";
        assert.compilesTo(emblem, "Good Bork");
      });
      (0, _qunit.test)('with a mustache', function (assert) {
        const emblem = "| Bork {{foo}}!";
        assert.compilesTo(emblem, 'Bork {{foo}}!');
      });
      (0, _qunit.test)('with mustaches', function (assert) {
        const emblem = "| Bork {{foo}} {{{bar}}}!";
        assert.compilesTo(emblem, 'Bork {{foo}} {{{bar}}}!');
      });
      (0, _qunit.test)('on each line', function (assert) {
        const emblem = (0, _utils.w)('pre', '  | This', '  |   should', '  |  hopefully', '  |    work, and work well.');
        assert.compilesTo(emblem, `<pre>This  should hopefully   work, and work well.</pre>`);
      });
      (0, _qunit.test)("with blank", function (assert) {
        const emblem = (0, _utils.w)('pre', '  | This', '  |   should', '  |', '  |  hopefully', '  |    work, and work well.');
        assert.compilesTo(emblem, '<pre>This  should hopefully   work, and work well.</pre>');
      });
    });
    (0, _qunit.module)('indentation', function () {
      (0, _qunit.test)('mixture', function (assert) {
        const emblem = (0, _utils.w)('        \n', '  p Hello\n', '  p\n', '    | Woot\n', '  span yes\n');
        assert.compilesTo(emblem, '<p>Hello</p><p>Woot</p><span>yes</span>');
      });
      (0, _qunit.test)('mixture w/o opening blank', function (assert) {
        const emblem = (0, _utils.w)('  p Hello\n', '  p\n', '    | Woot\n', '  span yes\n');
        assert.compilesTo(emblem, '<p>Hello</p><p>Woot</p><span>yes</span>');
      });
      (0, _qunit.test)('w/ blank lines', function (assert) {
        const emblem = (0, _utils.w)('  p Hello\n', '  p\n', '\n', '    | Woot\n', '\n', '  span yes\n');
        assert.compilesTo(emblem, '<p>Hello</p><p>Woot</p><span>yes</span>');
      });
      (0, _qunit.test)('w/ blank whitespaced lines', function (assert) {
        const emblem = (0, _utils.w)('  p Hello\n', '  p\n', '\n', '    | Woot\n', '        \n', '       \n', '         \n', '\n', '  span yes\n', '\n', '  sally\n', '\n', '         \n', '    | Woot\n');
        assert.compilesTo(emblem, '<p>Hello</p><p>Woot</p><span>yes</span>{{#sally}}Woot{{/sally}}');
      });
      (0, _qunit.test)("it doesn't throw when indenting after a line with inline content", function (assert) {
        const emblem = (0, _utils.w)("p Hello", "  p invalid");
        assert.compilesTo(emblem, "<p>Hello p invalid</p>");
      });
      (0, _qunit.test)("it throws on half dedent", function (assert) {
        const emblem = (0, _utils.w)("p", "    span This is ok", "  span This aint");
        assert.compilerThrows(emblem);
      });
      (0, _qunit.test)("new indentation levels don't have to match parents'", function (assert) {
        const emblem = (0, _utils.w)("p ", "  span", "     div", "      span yes");
        assert.compilesTo(emblem, "<p><span><div><span>yes</span></div></span></p>");
      });
      (0, _qunit.test)("Windows line endings", function (assert) {
        const emblem = ".navigation\r\n  p Hello\r\n#main\r\n  | hi";
        assert.compilesTo(emblem, '<div class="navigation"><p>Hello</p></div><div id="main">hi</div>');
      });
      (0, _qunit.test)("backslash doesn't cause infinite loop", function (assert) {
        const emblem = '| \\';
        assert.compilesTo(emblem, "\\");
      });
      (0, _qunit.test)("backslash doesn't cause infinite loop with letter", function (assert) {
        const emblem = '| \\a';
        assert.compilesTo(emblem, "\\a");
      });
      (0, _qunit.test)("self closing tag with forward slash", function (assert) {
        const emblem = 'hr/';
        assert.compilesTo(emblem, '<hr/>');
      });
      (0, _qunit.test)("non-void elements are still closed correctly", function (assert) {
        const emblem = 'p/';
        assert.compilesTo(emblem, '<p></p>');
      });
      (0, _qunit.test)("tagnames and attributes with colons", function (assert) {
        const emblem = '%al:ex match:neer="snork" Hello!';
        assert.compilesTo(emblem, '<al:ex match:neer="snork">Hello!</al:ex>');
      });
      (0, _qunit.test)("windows newlines", function (assert) {
        const emblem = "\r\n  \r\n  p Hello\r\n\r\n";
        assert.compilesTo(emblem, '<p>Hello</p>');
      });
    });
    (0, _qunit.module)('whitespaces', function () {
      (0, _qunit.test)("spaces after html elements", function (assert) {
        assert.compilesTo("p \n  span asd", "<p><span>asd</span></p>");
        assert.compilesTo("p \nspan  \n\ndiv\nspan", "<p></p><span></span><div></div><span></span>");
      });
      (0, _qunit.test)("spaces after mustaches", function (assert) {
        assert.compilesTo("each foo    \n  p \n  span", "{{#each foo}}<p></p><span></span>{{/each}}");
      });
      (0, _qunit.test)("it strips out preceding whitespace", function (assert) {
        const emblem = (0, _utils.w)("", "p Hello");
        assert.compilesTo(emblem, "<p>Hello</p>");
      });
      (0, _qunit.test)("it handles preceding indentation", function (assert) {
        const emblem = (0, _utils.w)("  p Woot", "  p Ha");
        assert.compilesTo(emblem, "<p>Woot</p><p>Ha</p>");
      });
      (0, _qunit.test)("it handles preceding indentation and newlines", function (assert) {
        const emblem = (0, _utils.w)("", "  p Woot", "  p Ha");
        assert.compilesTo(emblem, "<p>Woot</p><p>Ha</p>");
      });
      (0, _qunit.test)("it handles preceding indentation and newlines pt 2", function (assert) {
        const emblem = (0, _utils.w)("  ", "  p Woot", "  p Ha");
        assert.compilesTo(emblem, "<p>Woot</p><p>Ha</p>");
      });
      (0, _qunit.test)('multiple text lines', function (assert) {
        const emblem = (0, _utils.w)('span Your name is name', '  and my name is name');
        assert.compilesTo(emblem, '<span>Your name is name and my name is name</span>');
      });
      (0, _qunit.test)("shouldn't be necessary to insert a space", function (assert) {
        const emblem = "p Hello,\n  How are you?\np I'm fine, thank you.";
        assert.compilesTo(emblem, "<p>Hello, How are you?</p><p>I'm fine, thank you.</p>");
      });
      (0, _qunit.test)("it strips out preceding whitespace", function (assert) {
        const emblem = (0, _utils.w)("", "p Hello");
        assert.compilesTo(emblem, "<p>Hello</p>");
      });
      (0, _qunit.test)("it handles preceding indentation", function (assert) {
        const emblem = (0, _utils.w)("  p Woot", "  p Ha");
        assert.compilesTo(emblem, "<p>Woot</p><p>Ha</p>");
      });
      (0, _qunit.test)("it handles preceding indentation and newlines", function (assert) {
        const emblem = (0, _utils.w)("", "  p Woot", "  p Ha");
        assert.compilesTo(emblem, "<p>Woot</p><p>Ha</p>");
      });
      (0, _qunit.test)("it handles preceding indentation and newlines pt 2", function (assert) {
        const emblem = (0, _utils.w)("  ", "  p Woot", "  p Ha");
        assert.compilesTo(emblem, "<p>Woot</p><p>Ha</p>");
      });
    });
    (0, _qunit.module)('html', function () {
      (0, _qunit.test)("indented", function (assert) {
        const emblem = (0, _utils.w)("<p>", "  <span>This be some text</span>", "  <title>Basic HTML Sample Page</title>", "</p>");
        assert.compilesTo(emblem, '<p> <span>This be some text</span> <title>Basic HTML Sample Page</title></p>');
      });
      (0, _qunit.test)("flatlina", function (assert) {
        const emblem = "<p>\n<span>This be some text</span>\n<title>Basic HTML Sample Page</title>\n</p>";
        assert.compilesTo(emblem, '<p><span>This be some text</span><title>Basic HTML Sample Page</title></p>');
      });
    });
  });
});
define("tests/integration/basic-syntax/tags-test", ["qunit", "tests/support/utils"], function (_qunit, _utils) {
  "use strict";

  (0, _qunit.module)('basic syntax: tags', function (hooks) {
    (0, _qunit.test)('basic syntax', function (assert) {
      assert.compilesTo('h1 Welcome to Emblem', '<h1>Welcome to Emblem</h1>');
    });
    (0, _qunit.test)("element only", function (assert) {
      assert.compilesTo("p", "<p></p>");
    });
    (0, _qunit.test)("with text", function (assert) {
      assert.compilesTo("p Hello", "<p>Hello</p>");
    });
    (0, _qunit.test)("with more complex text", function (assert) {
      assert.compilesTo("p Hello, how's it going with you today?", "<p>Hello, how's it going with you today?</p>");
    });
    (0, _qunit.test)("with inline html", function (assert) {
      assert.compilesTo("p Hello, how are you <strong>man</strong>", "<p>Hello, how are you <strong>man</strong></p>");
    });
    (0, _qunit.test)("with trailing space", function (assert) {
      assert.compilesTo("p Hello   ", "<p>Hello   </p>");
    });
    (0, _qunit.test)("can start with angle bracket html", function (assert) {
      const emblem = "<span>Hello</span>";
      assert.compilesTo(emblem, "<span>Hello</span>");
    });
    (0, _qunit.module)('multiple lines', function () {
      (0, _qunit.test)("two lines", function (assert) {
        const emblem = (0, _utils.w)("p This is", "  pretty cool.");
        assert.compilesTo(emblem, "<p>This is pretty cool.</p>");
      });
      (0, _qunit.test)("three lines", function (assert) {
        const emblem = (0, _utils.w)("p This is", "  pretty damn", "  cool.");
        assert.compilesTo(emblem, "<p>This is pretty damn cool.</p>");
      });
      (0, _qunit.test)("three lines w/ embedded html", function (assert) {
        const emblem = (0, _utils.w)("p This is", "  pretty <span>damn</span>", "  cool.");
        assert.compilesTo(emblem, "<p>This is pretty <span>damn</span> cool.</p>");
      });
      (0, _qunit.test)("can start with angle bracket html and go to multiple lines", function (assert) {
        const emblem = (0, _utils.w)("<span>Hello dude,", "      what's up?</span>");
        assert.compilesTo(emblem, "<span>Hello dude, what's up?</span>");
      });
    });
    (0, _qunit.module)('self-closing html tags', function () {
      (0, _qunit.test)("br", function (assert) {
        const emblem = "br";
        assert.compilesTo(emblem, '<br/>');
      });
      (0, _qunit.test)("hr", function (assert) {
        const emblem = "hr";
        assert.compilesTo(emblem, '<hr/>');
      });
      (0, _qunit.test)("br paragraph example", function (assert) {
        const emblem = "p\n  | LOL!\n  br\n  | BORF!";
        assert.compilesTo(emblem, '<p>LOL!<br/>BORF!</p>');
      });
      (0, _qunit.test)("input", function (assert) {
        const emblem = "input type=\"text\"";
        assert.compilesTo(emblem, '<input type="text"/>');
      });
      (0, _qunit.test)("nested content under self-closing tag should fail", function (assert) {
        const emblem = "hr\n | here is text";
        assert.compilerThrows(emblem);
      });
    });
    (0, _qunit.module)('% helper', function () {
      (0, _qunit.test)("basic", function (assert) {
        const emblem = "%borf";
        assert.compilesTo(emblem, '<borf/>');
      });
      (0, _qunit.test)("nested", function (assert) {
        const emblem = "%borf\n    %sporf Hello";
        assert.compilesTo(emblem, '<borf><sporf>Hello</sporf></borf>');
      });
      (0, _qunit.test)("capitalized", function (assert) {
        const emblem = "%Alex alex\n%Alex\n  %Woot";
        assert.compilesTo(emblem, '<Alex>alex</Alex><Alex><Woot/></Alex>');
      });
      (0, _qunit.test)("funky chars", function (assert) {
        const emblem = "%borf:narf\n%borf:narf Hello, {{foo}}.\n%alex = foo";
        assert.compilesTo(emblem, '<borf:narf/><borf:narf>Hello, {{foo}}.</borf:narf><alex>{{foo}}</alex>');
      });
    });
  });
});
define("tests/integration/deprecated/explicit-component-test", ["qunit", "tests/support/utils"], function (_qunit, _utils) {
  "use strict";

  (0, _qunit.module)('deprecations: explicit components', function (hooks) {
    (0, _qunit.test)("should invoke `view` helper by default", function (assert) {
      const emblem = (0, _utils.w)("SomeView");
      assert.compilesTo(emblem, '{{view SomeView}}');
    });
    (0, _qunit.test)("should support block mode", function (assert) {
      const emblem = (0, _utils.w)("SomeView", "  p View content");
      assert.compilesTo(emblem, '{{#view SomeView}}<p>View content</p>{{/view}}');
    });
  });
});
define("tests/integration/deprecated/legacy-view-test", ["qunit", "tests/support/utils"], function (_qunit, _utils) {
  "use strict";

  (0, _qunit.module)('deprecations: legacy-views', function (hooks) {
    (0, _qunit.test)("should invoke `view` helper by default", function (assert) {
      const emblem = (0, _utils.w)("SomeView");
      assert.compilesTo(emblem, '{{view SomeView}}');
    });
    (0, _qunit.test)("should support block mode", function (assert) {
      const emblem = (0, _utils.w)("SomeView", "  p View content");
      assert.compilesTo(emblem, '{{#view SomeView}}<p>View content</p>{{/view}}');
    });
    (0, _qunit.test)("should not kick in if preceded by equal sign", function (assert) {
      const emblem = (0, _utils.w)("= SomeView");
      assert.compilesTo(emblem, '{{SomeView}}');
    });
    (0, _qunit.test)("should not kick in explicit {{mustache}}", function (assert) {
      const emblem = (0, _utils.w)("p Yeah {{SomeView}}");
      assert.compilesTo(emblem, '<p>Yeah {{SomeView}}</p>');
    });
    (0, _qunit.test)("tagName w/o space", function (assert) {
      const emblem = "App.FunView%span";
      assert.compilesTo(emblem, '{{view App.FunView tagName="span"}}');
    });
    (0, _qunit.test)("tagName w/ space", function (assert) {
      const emblem = "App.FunView %span";
      assert.compilesTo(emblem, '{{view App.FunView tagName="span"}}');
    });
    (0, _qunit.test)("tagName block", function (assert) {
      const emblem = "App.FunView%span\n  p Hello";
      assert.compilesTo(emblem, '{{#view App.FunView tagName="span"}}<p>Hello</p>{{/view}}');
    });
    (0, _qunit.test)("class w/ space (needs space)", function (assert) {
      const emblem = "App.FunView .bork";
      assert.compilesTo(emblem, '{{view App.FunView class="bork"}}');
    });
    (0, _qunit.test)("multiple classes", function (assert) {
      const emblem = "App.FunView .bork.snork";
      assert.compilesTo(emblem, '{{view App.FunView class="bork snork"}}');
    });
    (0, _qunit.test)("elementId", function (assert) {
      const emblem = "App.FunView#ohno";
      assert.compilesTo(emblem, '{{view App.FunView elementId="ohno"}}');
    });
    (0, _qunit.test)("mixed w/ hash`", function (assert) {
      const emblem = "App.FunView .bork.snork funbags=\"yeah\"";
      assert.compilesTo(emblem, '{{view App.FunView funbags="yeah" class="bork snork"}}');
    });
    (0, _qunit.test)("mixture of all`", function (assert) {
      const emblem = 'App.FunView%alex#hell.bork.snork funbags="yeah"';
      assert.compilesTo(emblem, '{{view App.FunView funbags="yeah" tagName="alex" elementId="hell" class="bork snork"}}');
    });
  });
});
define("tests/integration/ember/action-helpers-test", ["qunit", "tests/support/utils"], function (_qunit, _utils) {
  "use strict";

  (0, _qunit.module)('ember: action helpers', function (hooks) {
    (0, _qunit.test)("basic (click)", function (assert) {
      const emblem = 'button click={ action "submitComment" } Submit Comment';
      assert.compilesTo(emblem, '<button {{action "submitComment"  on="click"}}>Submit Comment</button>');
    });
    (0, _qunit.test)("manual", function (assert) {
      const emblem = "a{action someBoundAction target=view} Submit Comment";
      assert.compilesTo(emblem, '<a {{action someBoundAction target=view}}>Submit Comment</a>');
    });
    (0, _qunit.test)("manual nested", function (assert) {
      const emblem = (0, _utils.w)("a{action 'submitComment' target=view}", "  p Submit Comment");
      assert.compilesTo(emblem, '<a {{action \'submitComment\' target=view}}><p>Submit Comment</p></a>');
    });
  });
});
define("tests/integration/ember/attribute-bindings-test", ["qunit", "tests/support/utils"], function (_qunit, _utils) {
  "use strict";

  (0, _qunit.module)('ember: attribute bindings', function (hooks) {
    (0, _qunit.module)('subexpressions', function () {
      (0, _qunit.test)("arg-less helper 1", function (assert) {
        const emblem = 'p {{echo (hello)}}';
        assert.compilesTo(emblem, '<p>{{echo (hello)}}</p>');
      });
      (0, _qunit.test)("arg-less helper 2", function (assert) {
        const emblem = '= echo (hello)';
        assert.compilesTo(emblem, '{{echo (hello)}}');
      });
      (0, _qunit.test)("helper w args 1", function (assert) {
        const emblem = 'p {{echo (equal 1 1)}}';
        assert.compilesTo(emblem, '<p>{{echo (equal 1 1)}}</p>');
      });
      (0, _qunit.test)("helper w args 2", function (assert) {
        const emblem = '= echo (equal 1 1)';
        assert.compilesTo(emblem, '{{echo (equal 1 1)}}');
      });
      (0, _qunit.test)("supports much nesting 1", function (assert) {
        const emblem = 'p {{echo (equal (equal 1 1) true)}}';
        assert.compilesTo(emblem, '<p>{{echo (equal (equal 1 1) true)}}</p>');
      });
      (0, _qunit.test)("supports much nesting 2", function (assert) {
        const emblem = '= echo (equal (equal 1 1) true)';
        assert.compilesTo(emblem, '{{echo (equal (equal 1 1) true)}}');
      });
      (0, _qunit.test)("with hashes 1", function (assert) {
        const emblem = 'p {{echo (equal (equal 1 1) true fun="yes")}}';
        assert.compilesTo(emblem, '<p>{{echo (equal (equal 1 1) true fun="yes")}}</p>');
      });
      (0, _qunit.test)("with hashes 2", function (assert) {
        const emblem = '= echo (equal (equal 1 1) true fun="yes")';
        assert.compilesTo(emblem, '{{echo (equal (equal 1 1) true fun="yes")}}');
      });
      (0, _qunit.test)("with multiple", function (assert) {
        const emblem = '= if (and (or true true) true)';
        assert.compilesTo(emblem, '{{if (and (or true true) true)}}');
      });
      (0, _qunit.test)("with multiple p2", function (assert) {
        const emblem = '= if (and (or true true) (or true true))';
        assert.compilesTo(emblem, '{{if (and (or true true) (or true true))}}');
      });
      (0, _qunit.test)("with multiple (mixed) p3", function (assert) {
        const emblem = '= yield (hash title=(component "panel-title") body=(component "panel-content"))';
        assert.compilesTo(emblem, '{{yield (hash title=(component \"panel-title\") body=(component \"panel-content\"))}}');
      });
      (0, _qunit.test)("as hashes 1", function (assert) {
        const emblem = 'p {{echofun fun=(equal 1 1)}}';
        assert.compilesTo(emblem, '<p>{{echofun fun=(equal 1 1)}}</p>');
      });
      (0, _qunit.test)("as hashes 2", function (assert) {
        const emblem = '= echofun fun=(equal 1 1)';
        assert.compilesTo(emblem, '{{echofun fun=(equal 1 1)}}');
      });
      (0, _qunit.test)("complex expression 1", function (assert) {
        const emblem = 'p {{echofun true (hello how="are" you=false) 1 not=true fun=(equal "ECHO hello" (echo (hello))) win="yes"}}';
        assert.compilesTo(emblem, '<p>{{echofun true (hello how="are" you=false) 1 not=true fun=(equal "ECHO hello" (echo (hello))) win="yes"}}</p>');
      });
      (0, _qunit.test)("complex expression 2", function (assert) {
        const emblem = '= echofun true (hello how="are" you=false) 1 not=true fun=(equal "ECHO hello" (echo (hello))) win="yes"';
        const expected = '{{echofun true (hello how="are" you=false) 1 not=true fun=(equal "ECHO hello" (echo (hello))) win="yes"}}';
        assert.compilesTo(emblem, expected);
      });
    });
    (0, _qunit.module)('Ember deprecated functions', function () {
      (0, _qunit.test)("exclamation modifier (ember)", function (assert) {
        const emblem = 'p class=foo!';
        assert.compilesTo(emblem, '<p class="{{unbound foo}}"></p>');
      });
      (0, _qunit.test)("simple bang helper defaults to `unbound` invocation", function (assert) {
        const emblem = (0, _utils.w)("foo!");
        assert.compilesTo(emblem, '{{unbound foo}}');
      });
      (0, _qunit.test)("bang helper defaults to `unbound` invocation", function (assert) {
        const emblem = (0, _utils.w)("foo! Yar", "= foo!");
        assert.compilesTo(emblem, '{{unbound foo Yar}}{{unbound foo}}');
      });
      (0, _qunit.test)("bang helper works with blocks", function (assert) {
        const emblem = (0, _utils.w)("hey! you suck", "  = foo!");
        assert.compilesTo(emblem, '{{#unbound hey you suck}}{{unbound foo}}{{/unbound}}');
      });
      (0, _qunit.test)('mustache in attribute', function (assert) {
        const emblem = 'img src="{{unbound post.showLogoUrl}}" onerror="this.src=\'{{unbound orgSettings.onErrorBlankLogoImage}}\'"';
        assert.compilesTo(emblem, '<img src="{{unbound post.showLogoUrl}}" onerror="this.src=\'{{unbound orgSettings.onErrorBlankLogoImage}}\'"/>');
      });
      (0, _qunit.test)('mustache in attribute with exclamation point', function (assert) {
        const emblem = "a href=postLink! target='_blank'";
        assert.compilesTo(emblem, '<a href="{{unbound postLink}}" target="_blank"></a>');
      });
    });
  });
});
define("tests/integration/ember/blocks-test", ["qunit", "tests/support/utils"], function (_qunit, _utils) {
  "use strict";

  (0, _qunit.module)('ember: blocks', function (hooks) {
    (0, _qunit.test)('example 1', function (assert) {
      const emblem = (0, _utils.w)('= my-greeter', '  div Hello', '= else', '  div Goodbye');
      assert.compilesTo(emblem, "{{#my-greeter}}<div>Hello</div>{{else}}<div>Goodbye</div>{{/my-greeter}}");
    });
    (0, _qunit.test)('example 2', function (assert) {
      const emblem = (0, _utils.w)('ul', '  = each people as |person|', '    li = person');
      assert.compilesTo(emblem, "<ul>{{#each people as |person|}}<li>{{person}}</li>{{/each}}</ul>");
    });
    (0, _qunit.test)('example 3', function (assert) {
      const emblem = (0, _utils.w)('= my-component [', '  foo', '  bar=baz', '] as |left right|', '  span class={ left } = right');
      assert.compilesTo(emblem, "{{#my-component foo bar=baz as |left right|}}<span class={{left}}>{{right}}</span>{{/my-component}}");
    });
    (0, _qunit.test)('example 4', function (assert) {
      const emblem = (0, _utils.w)("= component 'my-component' [", '  foo', '  bar=baz', '] as |left right|', '  span class={ left } = right');
      assert.compilesTo(emblem, "{{#component 'my-component' foo bar=baz as |left right|}}<span class={{left}}>{{right}}</span>{{/component}}");
    });
    (0, _qunit.test)('named block support', function (assert) {
      const emblem = (0, _utils.w)('= x-modal', '  % @header as |@title|', '    |Header #{title}', '  % @body', '    |Body ${title}', '  % @footer', '    |Footer');
      assert.compilesTo(emblem, '{{#x-modal}}<@header as |@title|>Header {{title}}</@header><@body>Body {{title}}</@body><@footer>Footer</@footer>{{/x-modal}}');
    });
    (0, _qunit.test)('named block with block param', function (assert) {
      const emblem = (0, _utils.w)('= x-layout as |@widget|', '  = @widget as |a b c|', '    |Hi.');
      assert.compilesTo(emblem, '{{#x-layout as |@widget|}}{{#@widget as |a b c|}}Hi.{{/@widget}}{{/x-layout}}');
    });
    (0, _qunit.module)('block params', function () {
      (0, _qunit.test)("anything after 'as' goes in block params", function (assert) {
        const emblem = (0, _utils.w)("= each foos as |foo|");
        assert.compilesTo(emblem, '{{each foos as |foo|}}');
      });
      (0, _qunit.test)("spaces between '||' and params are removed", function (assert) {
        assert.compilesTo("= each foos as |foo|", '{{each foos as |foo|}}');
        assert.compilesTo("= each foos as | foo |", '{{each foos as |foo|}}');
      });
      (0, _qunit.test)("multiple words work too", function (assert) {
        const emblem = (0, _utils.w)("= my-helper as |foo bar|");
        assert.compilesTo(emblem, '{{my-helper as |foo bar|}}');
      });
      (0, _qunit.test)("values can have @", function (assert) {
        const emblem = (0, _utils.w)("= my-helper as |@foo @bar|");
        assert.compilesTo(emblem, '{{my-helper as |@foo @bar|}}');
      });
      (0, _qunit.test)("block form works for the 'with' helper", function (assert) {
        const emblem = (0, _utils.w)("= with car.manufacturer as |make|", "  p {{make.name}}");
        assert.compilesTo(emblem, '{{#with car.manufacturer as |make|}}<p>{{make.name}}</p>{{/with}}');
      });
      (0, _qunit.test)("block form works for components", function (assert) {
        const emblem = (0, _utils.w)("= my-component as |item|", "  p {{item.name}}");
        assert.compilesTo(emblem, '{{#my-component as |item|}}<p>{{item.name}}</p>{{/my-component}}');
      });
      (0, _qunit.test)("block params with destructuring hash", function (assert) {
        const emblem = (0, _utils.w)("= my-component value=foo as |comp1 {subcomp subcomp2}=comp comp2|", "  = subcomp value=foo: = subcomp2");
        assert.compilesTo(emblem, '{{#my-component value=foo as |comp1 comp2 comp|}}{{#let (get comp "subcomp") (get comp "subcomp2") as |subcomp subcomp2|}}{{#subcomp value=foo}}{{subcomp2}}{{/subcomp}}{{/let}}{{/my-component}}');
      });
      (0, _qunit.test)("block params with destructuring array", function (assert) {
        const emblem = (0, _utils.w)("= my-component value=foo as |comp1 [subcomp subcomp2]=comp comp2|", "  = subcomp value=foo: = subcomp2");
        assert.compilesTo(emblem, '{{#my-component value=foo as |comp1 comp2 comp|}}{{#let (get comp 0) (get comp 1) as |subcomp subcomp2|}}{{#subcomp value=foo}}{{subcomp2}}{{/subcomp}}{{/let}}{{/my-component}}');
      });
    });
  });
});
define("tests/integration/ember/closure-actions-test", ["qunit", "tests/support/utils"], function (_qunit, _utils) {
  "use strict";

  (0, _qunit.module)('ember: closure actions', function (hooks) {
    (0, _qunit.test)('basic test 1', function (assert) {
      const emblem = "= my-component eventChanged=(action 'foo' bar)";
      assert.compilesTo(emblem, "{{my-component eventChanged=(action 'foo' bar)}}");
    });
    (0, _qunit.test)('basic test 2', function (assert) {
      const emblem = (0, _utils.w)("= my-component [", "  eventOpened=(action (mut isOpen))", "  eventChanged=(action 'changeEvent')", "] as |message|", "  p = message");
      assert.compilesTo(emblem, "{{#my-component eventOpened=(action (mut isOpen)) eventChanged=(action 'changeEvent') as |message|}}<p>{{message}}</p>{{/my-component}}");
    });
    (0, _qunit.test)('basic test 3', function (assert) {
      const emblem = "a click={ action 'toggleOpen' } Open";
      assert.compilesTo(emblem, '<a {{action \'toggleOpen\'  on="click"}}>Open</a>');
    });
    (0, _qunit.test)("component (click) does nothing", function (assert) {
      const emblem = (0, _utils.w)('= my-button click=(action "submitComment")', '  |Submit Comment');
      assert.compilesTo(emblem, '{{#my-button click=(action "submitComment")}}Submit Comment{{/my-button}}');
    });
    (0, _qunit.test)("more advanced subexpressions work", function (assert) {
      const emblem = "select change={ action (mut vehicle) value=\"target.value\" }";
      assert.compilesTo(emblem, '<select {{action (mut vehicle) value="target.value"  on="change"}}></select>');
    });
    (0, _qunit.test)("actions with HTML events and mustache content", function (assert) {
      const emblem = "select onchange={ action (mut vehicle) value=\"target.value\" }";
      assert.compilesTo(emblem, '<select onchange={{action (mut vehicle) value="target.value"}}></select>');
    });
    (0, _qunit.test)("actions with HTML events and mixing mustache actions and bound attrs", function (assert) {
      const emblem = "button.small onclick={ action this.attrs.completeTask model } disabled=isEditing";
      assert.compilesTo(emblem, '<button onclick={{action this.attrs.completeTask model}} disabled={{isEditing}} class=\"small\"></button>');
    });
    (0, _qunit.test)("actions with legacy quoting", function (assert) {
      const emblem = "button.small onclick={ action this.attrs.completeTask model } disabled=isEditing";
      assert.compilesTo(emblem, '<button onclick={{action this.attrs.completeTask model}} disabled=\"{{isEditing}}\" class=\"small\"></button>', null, {
        legacyAttributeQuoting: true
      });
    });
  });
});
define("tests/integration/ember/component-attribute-shorthand-test", ["qunit", "tests/support/utils"], function (_qunit, _utils) {
  "use strict";

  (0, _qunit.module)('ember: component attribute shorthand', function (hooks) {
    (0, _qunit.test)('example 1', function (assert) {
      const emblem = "= my-component .foo.bar";
      assert.compilesTo(emblem, '{{my-component class="foo bar"}}');
    });
    (0, _qunit.test)('example 2', function (assert) {
      const emblem = "= my-other-component #foo";
      assert.compilesTo(emblem, '{{my-other-component elementId="foo"}}');
    });
    (0, _qunit.test)('example 3', function (assert) {
      const emblem = "= special-component %span";
      assert.compilesTo(emblem, '{{special-component tagName="span"}}');
    });
  });
});
define("tests/integration/ember/ember-input-helper-test", ["qunit", "tests/support/utils"], function (_qunit, _utils) {
  "use strict";

  (0, _qunit.module)('ember: input helper test', function (hooks) {
    (0, _qunit.test)('example 1', function (assert) {
      const emblem = "input value=name oninput={ action (mut myValue) value='target.value' }";
      assert.compilesTo(emblem, "<input value={{name}} oninput={{action (mut myValue) value='target.value'}}/>");
    });
    (0, _qunit.test)('example 2', function (assert) {
      const emblem = "= input value=name itemChanged=(action (mut myValue))";
      assert.compilesTo(emblem, "{{input value=name itemChanged=(action (mut myValue))}}");
    });
  });
});
define("tests/integration/ember/inline-if-test", ["qunit", "tests/support/utils"], function (_qunit, _utils) {
  "use strict";

  (0, _qunit.module)('ember: inline if', function (hooks) {
    (0, _qunit.test)('example 1', function (assert) {
      const emblem = "div value={ if isTrue 'one' activeItem }";
      assert.compilesTo(emblem, "<div value={{if isTrue 'one' activeItem}}></div>");
    });
    (0, _qunit.test)('example 2', function (assert) {
      const emblem = "div class=condition:whenTrue:whenFalse";
      assert.compilesTo(emblem, "<div class={{if condition 'whenTrue' 'whenFalse'}}></div>");
    });
    (0, _qunit.test)('example 3', function (assert) {
      const emblem = ".foo class={ isHovering condition1:whenTrue:whenFalse condition2:whenTrue:whenFalse }";
      assert.compilesTo(emblem, `<div class="foo {{isHovering}} {{if condition1 'whenTrue' 'whenFalse'}} {{if condition2 'whenTrue' 'whenFalse'}}"></div>`);
    });
    (0, _qunit.test)("with attribute and bound values", function (assert) {
      const emblem = 'div style={ if isActive foo bar }';
      assert.compilesTo(emblem, '<div style={{if isActive foo bar}}></div>');
    });
    (0, _qunit.test)("with attribute and bound values and legacy quoting", function (assert) {
      const emblem = 'div style={ if isActive foo bar }';
      assert.compilesTo(emblem, '<div style=\"{{if isActive foo bar}}\"></div>', null, {
        legacyAttributeQuoting: true
      });
    });
    (0, _qunit.test)("with attribute", function (assert) {
      const emblem = 'a href={ if isActive \'http://google.com\' \'http://bing.com\' }';
      assert.compilesTo(emblem, '<a href={{if isActive \'http://google.com\' \'http://bing.com\'}}></a>');
    });
    (0, _qunit.test)("with attribute and legacy quoting", function (assert) {
      const emblem = 'a href={ if isActive \'http://google.com\' \'http://bing.com\' }';
      assert.compilesTo(emblem, '<a href=\"{{if isActive \'http://google.com\' \'http://bing.com\'}}\"></a>', null, {
        legacyAttributeQuoting: true
      });
    });
    (0, _qunit.test)("with attribute and bound values", function (assert) {
      const emblem = 'a href={ if isActive google bing }';
      assert.compilesTo(emblem, '<a href={{if isActive google bing}}></a>');
    });
    (0, _qunit.test)("unbound attributes", function (assert) {
      const emblem = 'div class={ if isActive \'foo\' \'bar\' }';
      assert.compilesTo(emblem, '<div class={{if isActive \'foo\' \'bar\'}}></div>');
    });
    (0, _qunit.test)("bound attributes", function (assert) {
      const emblem = 'div class={ if isActive foo bar }';
      assert.compilesTo(emblem, '<div class={{if isActive foo bar}}></div>');
    });
    (0, _qunit.test)("mixed attributes", function (assert) {
      const emblem = 'div class={ if isActive \'foo\' bar }';
      assert.compilesTo(emblem, '<div class={{if isActive \'foo\' bar}}></div>');
    });
    (0, _qunit.test)("unbound attributes with full quote", function (assert) {
      const emblem = 'div class={ if isActive \"foo\" bar }';
      assert.compilesTo(emblem, '<div class={{if isActive \"foo\" bar}}></div>');
    });
    (0, _qunit.test)("one unbound option", function (assert) {
      const emblem = 'div class={ if isActive \"foo\" }';
      assert.compilesTo(emblem, '<div class={{if isActive \"foo\"}}></div>');
    });
    (0, _qunit.test)("one bound option", function (assert) {
      const emblem = 'div class={ if isActive foo }';
      assert.compilesTo(emblem, '<div class={{if isActive foo}}></div>');
    });
    (0, _qunit.test)('with unless', function (assert) {
      assert.compilesTo("div class={ unless isActive 'bar' }", '<div class={{unless isActive \'bar\'}}></div>');
    });
    (0, _qunit.test)("within a string", function (assert) {
      const emblem = 'div style="{{ if isActive \"15\" \"25\" }}px"';
      assert.compilesTo(emblem, '<div style=\"{{if isActive \\"15\\" \\"25\\"}}px\"></div>');
    });
    (0, _qunit.test)("with dot params", function (assert) {
      const emblem = (0, _utils.w)("li class={ if content.length 'just-one' }", "  |Thing");
      assert.compilesTo(emblem, "<li class={{if content.length 'just-one'}}>Thing</li>");
    });
    (0, _qunit.test)("mixed with subexpressions", function (assert) {
      const emblem = (0, _utils.w)("li class={ if (has-one content.length) 'just-one' }", "  |Thing");
      assert.compilesTo(emblem, "<li class={{if (has-one content.length) 'just-one'}}>Thing</li>");
    });
  });
});
define("tests/integration/ember/legacy-actions-test", ["qunit", "tests/support/utils"], function (_qunit, _utils) {
  "use strict";

  (0, _qunit.module)('ember: legacy actions', function (hooks) {
    (0, _qunit.test)("basic (click)", function (assert) {
      const emblem = 'button click="submitComment" Submit Comment';
      assert.compilesTo(emblem, '<button {{action "submitComment" on="click"}}>Submit Comment</button>');
    });
    (0, _qunit.test)("basic (click) preceded by action keyword", function (assert) {
      const emblem = 'button click="action submitComment" Submit Comment';
      assert.compilesTo(emblem, '<button {{action submitComment on="click"}}>Submit Comment</button>');
    });
    (0, _qunit.test)("basic (click) followed by attr", function (assert) {
      const emblem = 'button click="submitComment" class="foo" Submit Comment';
      assert.compilesTo(emblem, '<button {{action "submitComment" on="click"}} class="foo">Submit Comment</button>');
      const emblem2 = 'button click="submitComment \'omg\'" class="foo" Submit Comment';
      assert.compilesTo(emblem2, '<button {{action submitComment \'omg\' on="click"}} class="foo">Submit Comment</button>');
    });
    (0, _qunit.test)("nested (mouseEnter)", function (assert) {
      const emblem = (0, _utils.w)("a mouseEnter='submitComment target=view'", "  | Submit Comment");
      assert.compilesTo(emblem, '<a {{action submitComment target=view on="mouseEnter"}}>Submit Comment</a>');
    });
    (0, _qunit.test)('explicitly single-quoted action name stays quoted', function (assert) {
      const emblem = 'a mouseEnter="\'hello\' target=controller"';
      assert.compilesTo(emblem, '<a {{action \'hello\' target=controller on="mouseEnter"}}></a>');
    });
    (0, _qunit.test)('explicitly dobule-quoted action name stays quoted', function (assert) {
      const emblem = 'a mouseEnter=\'"hello" target=controller\'';
      assert.compilesTo(emblem, '<a {{action "hello" target=controller on="mouseEnter"}}></a>');
    });
    (0, _qunit.test)("nested (mouseEnter, singlequoted)", function (assert) {
      const emblem = (0, _utils.w)("a mouseEnter='submitComment target=\"view\"'", "  | Submit Comment");
      assert.compilesTo(emblem, '<a {{action submitComment target="view" on="mouseEnter"}}>Submit Comment</a>');
    });
    (0, _qunit.test)("nested (mouseEnter, doublequoted)", function (assert) {
      const emblem = (0, _utils.w)("a mouseEnter=\"submitComment target='view'\"", "  | Submit Comment");
      assert.compilesTo(emblem, '<a {{action submitComment target=\'view\' on="mouseEnter"}}>Submit Comment</a>');
    });
    (0, _qunit.test)("single quote test", function (assert) {
      const emblem = "button click='p' Frank";
      assert.compilesTo(emblem, '<button {{action "p" on="click"}}>Frank</button>');
    });
    (0, _qunit.test)("double quote test", function (assert) {
      const emblem = "button click=\"p\" Frank";
      assert.compilesTo(emblem, '<button {{action "p" on="click"}}>Frank</button>');
    });
    (0, _qunit.test)("no quote remains unquoted in output", function (assert) {
      const emblem = "button click=p Frank";
      assert.compilesTo(emblem, '<button {{action p on="click"}}>Frank</button>');
    });
  });
});
define("tests/integration/ember/legacy-components-test", ["qunit", "tests/support/utils"], function (_qunit, _utils) {
  "use strict";

  (0, _qunit.module)('ember: legacy components', function (hooks) {
    (0, _qunit.test)('example 1', function (assert) {
      const emblem = (0, _utils.w)("= my-component value='firstName'");
      assert.compilesTo(emblem, "{{my-component value='firstName'}}");
    });
    (0, _qunit.test)('example 2', function (assert) {
      const emblem = (0, _utils.w)("= my-component [", "  value='firstName'", "  title='Name'", "  model=model", "  changed=(action 'nameChanged')", "]");
      assert.compilesTo(emblem, "{{my-component value='firstName' title='Name' model=model changed=(action 'nameChanged')}}");
    });
    (0, _qunit.test)('subexpression brackets', function (assert) {
      const emblem = (0, _utils.w)('= my-component (hash [', '  foo', '])');
      assert.compilesTo(emblem, '{{my-component (hash foo)}}');
    });
    (0, _qunit.test)('subexpression brackets and comment', function (assert) {
      const emblem = (0, _utils.w)('= my-component (hash [', '  foo', '  / There was another thing but oh well', '])');
      assert.compilesTo(emblem, '{{my-component (hash foo)}}');
    });
    (0, _qunit.test)('subexpression brackets with subexpression', function (assert) {
      const emblem = (0, _utils.w)('= my-component (hash [', '  foo', '  bar=(eq 1 2)', '])');
      assert.compilesTo(emblem, '{{my-component (hash foo bar=(eq 1 2))}}');
    });
    (0, _qunit.test)('subexpression brackets with nested brackets', function (assert) {
      const emblem = (0, _utils.w)('= my-component (hash [', '  foo', '  bar=(eq [', '    1', '    2', '    overwrite=true', '  ])', '])');
      assert.compilesTo(emblem, '{{my-component (hash foo bar=(eq 1 2 overwrite=true))}}');
    });
    (0, _qunit.test)('yield with hash example (I-292)', function (assert) {
      const emblem = (0, _utils.w)('= yield (hash buttons=(hash [', '  saveSheet=(component [', '    \'save-sheet\'', '    isReadonly=isReadonly', '    buttonAction=(action saveComponent)', '  ])', '  fontFamily=(component [', '    \'font-family\'', '    isReadonly=isReadonly', '    buttonAction=(action applyStyles)', '  ])', ']))');
      assert.compilesTo(emblem, '{{yield (hash buttons=(hash saveSheet=(component \'save-sheet\' isReadonly=isReadonly buttonAction=(action saveComponent)) fontFamily=(component \'font-family\' isReadonly=isReadonly buttonAction=(action applyStyles))))}}');
    });
    (0, _qunit.test)('module namespaces', function (assert) {
      const emblem = (0, _utils.w)('= my-addon::foo');
      assert.compilesTo(emblem, '{{my-addon::foo}}');
    });
  });
});
define("tests/integration/ember/link-to-test", ["qunit", "tests/support/utils"], function (_qunit, _utils) {
  "use strict";

  (0, _qunit.module)('ember: link-to', function (hooks) {
    (0, _qunit.test)('example 1', function (assert) {
      const emblem = (0, _utils.w)('= link-to "home.index"', '  | Home');
      assert.compilesTo(emblem, '{{#link-to "home.index"}}Home{{/link-to}}');
    });
    (0, _qunit.test)('example 2', function (assert) {
      const emblem = (0, _utils.w)('= link-to "Home" "home.index"');
      assert.compilesTo(emblem, '{{link-to "Home" "home.index"}}');
    });
    (0, _qunit.test)('example 3', function (assert) {
      const emblem = (0, _utils.w)('= link-to "home.index" | Home');
      assert.compilesTo(emblem, '{{#link-to "home.index"}}Home{{/link-to}}');
    });
    (0, _qunit.test)('example 4', function (assert) {
      const emblem = (0, _utils.w)('= link-to "items.list" (query-params page=2) | Go to page 2');
      assert.compilesTo(emblem, '{{#link-to "items.list" (query-params page=2)}}Go to page 2{{/link-to}}');
    });
    (0, _qunit.test)('example 5', function (assert) {
      const emblem = (0, _utils.w)('ul', '  li = link-to "index" | Home', '  li = link-to "about" | About Us');
      assert.compilesTo(emblem, '<ul><li>{{#link-to "index"}}Home{{/link-to}}</li><li>{{#link-to "about"}}About Us{{/link-to}}</li></ul>');
    });
    (0, _qunit.test)('example 6', function (assert) {
      const emblem = (0, _utils.w)('= link-to "items.list" (query-params page=2): | Go to page 2');
      assert.compilesTo(emblem, '{{#link-to "items.list" (query-params page=2)}}Go to page 2{{/link-to}}');
    });
    (0, _qunit.test)("brace works with text pipe", function (assert) {
      const emblem = "= link-to 'users.view' user | View user #{ user.name } ${ user.id }";
      assert.compilesTo(emblem, '{{#link-to \'users.view\' user}}View user {{user.name}} {{user.id}}{{/link-to}}');
    });
  });
});
define("tests/integration/glimmer/basic-syntax-test", ["qunit", "tests/support/utils"], function (_qunit, _utils) {
  "use strict";

  (0, _qunit.module)('glimmer: basic syntax', function (hooks) {
    // @TODO
    // QUnit.test("names with / turn into :assert" )
    // @TODO: What should the result of this be?
    // QUnit.test("Block params with else"assert) ;
    // @TODO: should these support mustache-like syntax?  (i.e. %MyComponent value=(foo) )
    (0, _qunit.test)('named argument syntax', function (assert) {
      assert.compilesTo('= @bar', '{{@bar}}');
    });
    (0, _qunit.test)('basic syntax for shorthands 1', function (assert) {
      assert.compilesTo("%my-comp#hello .woot @value=foo data-hint=\"not-my-component%%::\"", '<my-comp id="hello" @value={{foo}} data-hint=\"not-my-component%%::\" class="woot"/>');
      assert.compilesTo("%MyComp.woot #hello @value=foo", '<MyComp id="hello" @value={{foo}} class="woot"/>');
      assert.compilesTo("%my-comp#id.woot #hello @value=foo", '<my-comp id="hello" @value={{foo}} class="woot"/>');
      assert.compilesTo("%my-comp .woot#hello @value=foo", '<my-comp id="hello" @value={{foo}} class="woot"/>');
      assert.compilesTo("%my-comp .woot.loot#hello @value=foo", '<my-comp id="hello" @value={{foo}} class="woot loot"/>');
    });
    (0, _qunit.test)('basic syntax 1', function (assert) {
      const emblem = (0, _utils.w)("%MyComponent @value=foo data-hint='not-my-component%%::'");
      assert.compilesTo(emblem, '<MyComponent @value={{foo}} data-hint=\"not-my-component%%::\"/>');
    });
    (0, _qunit.test)('basic syntax 2', function (assert) {
      const emblem = "% my-component @value=fooValue data-hint='My special component'";
      assert.compilesTo(emblem, '<my-component @value={{fooValue}} data-hint="My special component"/>');
    });
    (0, _qunit.test)('basic syntax 3', function (assert) {
      const emblem = "% modal-popup @onClose={ action 'modalClosed' }";
      assert.compilesTo(emblem, "<modal-popup @onClose={{action 'modalClosed'}}/>");
    });
    (0, _qunit.test)("basic syntax with legacy quoting", function (assert) {
      const emblem = (0, _utils.w)("%MyComponent value=foo data-hint='not-my-component%%::'");
      assert.compilesTo(emblem, '<MyComponent value=\"{{foo}}\" data-hint=\"not-my-component%%::\"/>', null, {
        legacyAttributeQuoting: true
      });
    });
    (0, _qunit.test)("boolean attribute passed in as component input", function (assert) {
      const emblem = (0, _utils.w)("%MyComponent @multiselect=false");
      assert.compilesTo(emblem, '<MyComponent @multiselect={{false}}/>');
    });
    (0, _qunit.test)("...attributes", function (assert) {
      const emblem = (0, _utils.w)("%MyComponent ...attributes type=@post.type");
      assert.compilesTo(emblem, '<MyComponent ...attributes type={{@post.type}}/>');
    });
    (0, _qunit.test)("Sub-expressions", function (assert) {
      const emblem = (0, _utils.w)("%MyComponent @value={ (or (eq foo 'bar') (eq foo 'baz')) }");
      assert.compilesTo(emblem, '<MyComponent @value={{(or (eq foo \'bar\') (eq foo \'baz\'))}}/>');
    });
    (0, _qunit.test)("nested glimmer components with colon", function (assert) {
      const emblem = (0, _utils.w)('%my-component: %my-other-component: p Hello');
      assert.compilesTo(emblem, '<my-component><my-other-component><p>Hello</p></my-other-component></my-component>');
    });
    (0, _qunit.test)("nested glimmer components with colon - case 2", function (assert) {
      const emblem = (0, _utils.w)('%my-component @value=fooValue data-hint="My special component" ...attributes: % my-other-component @onClose={ action "modalClosed" }: p Hello');
      assert.compilesTo(emblem, '<my-component @value={{fooValue}} data-hint="My special component" ...attributes><my-other-component @onClose={{action "modalClosed"}}><p>Hello</p></my-other-component></my-component>');
    });
    (0, _qunit.test)("nested glimmer components with colon - case 3", function (assert) {
      const emblem = (0, _utils.w)('% my-component [', '  value=this.someProp.[0]', '  ...attributes', ']: %MyOtherComponent value=this.someProp2 ...attributes: p Hello');
      assert.compilesTo(emblem, '<my-component value={{this.someProp.[0]}} ...attributes><MyOtherComponent value={{this.someProp2}} ...attributes><p>Hello</p></MyOtherComponent></my-component>');
    });
  });
});
define("tests/integration/glimmer/blocks-test", ["qunit", "tests/support/utils"], function (_qunit, _utils) {
  "use strict";

  (0, _qunit.module)('glimmer: blocks', function (hooks) {
    (0, _qunit.test)("basic", function (assert) {
      const emblem = (0, _utils.w)("%MyComponent @value=foo", "  |Hi!");
      assert.compilesTo(emblem, '<MyComponent @value={{foo}}>Hi!</MyComponent>');
    });
    (0, _qunit.test)("basic without block", function (assert) {
      const emblem = (0, _utils.w)("%MyComponent/ @value=foo");
      assert.compilesTo(emblem, '<MyComponent @value={{foo}}/>');
    });
    (0, _qunit.test)("basic without block - case 2", function (assert) {
      const emblem = (0, _utils.w)("%MyComponent @value=foo");
      assert.compilesTo(emblem, '<MyComponent @value={{foo}}/>');
    });
    (0, _qunit.test)("block params", function (assert) {
      const emblem = (0, _utils.w)("%MyComponent @value=foo as |comp1 @comp2|", "  = comp1.name");
      assert.compilesTo(emblem, '<MyComponent @value={{foo}} as |comp1 @comp2|>{{comp1.name}}</MyComponent>');
    });
    (0, _qunit.test)("block params with nested angle bracket", function (assert) {
      const emblem = (0, _utils.w)("%MyComponent @value=foo as |comp|", "  % comp>subcomp @value=foo");
      assert.compilesTo(emblem, '<MyComponent @value={{foo}} as |comp|><comp.subcomp @value={{foo}}/></MyComponent>');
    });
    (0, _qunit.test)('recursive nesting part 2', function (assert) {
      const emblem = (0, _utils.w)('', '%my-comp-1', '  %my-comp-2', '    p Hello');
      assert.compilesTo(emblem, '<my-comp-1><my-comp-2><p>Hello</p></my-comp-2></my-comp-1>');
    });
    (0, _qunit.test)("block params with destructuring hash", function (assert) {
      const emblem = (0, _utils.w)("%MyComponent @value=foo as |comp1 {subcomp subcomp2}=comp comp2|", "  % subcomp @value=foo: = subcomp2");
      assert.compilesTo(emblem, '<MyComponent @value={{foo}} as |comp1 comp2 comp|>{{#let (get comp "subcomp") (get comp "subcomp2") as |subcomp subcomp2|}}<subcomp @value={{foo}}>{{subcomp2}}</subcomp>{{/let}}</MyComponent>');
    });
    (0, _qunit.test)("block params with destructuring array", function (assert) {
      const emblem = (0, _utils.w)("%MyComponent @value=foo as |comp1 [subcomp subcomp2]=comp comp2|", "  % subcomp @value=foo: = subcomp2");
      assert.compilesTo(emblem, '<MyComponent @value={{foo}} as |comp1 comp2 comp|>{{#let (get comp 0) (get comp 1) as |subcomp subcomp2|}}<subcomp @value={{foo}}>{{subcomp2}}</subcomp>{{/let}}</MyComponent>');
    });
  });
});
define("tests/integration/glimmer/brackets-test", ["qunit", "tests/support/utils"], function (_qunit, _utils) {
  "use strict";

  (0, _qunit.module)('glimmer: brackets', function (hooks) {
    (0, _qunit.test)('brackets with string', function (assert) {
      const emblem = (0, _utils.w)('', '%MyComponent [', '  @foo=bar', '  @baz=\'food\'', ']');
      assert.compilesTo(emblem, '<MyComponent @foo={{bar}} @baz=\"food\"/>');
    });
    (0, _qunit.test)('brackets with block params in the start', function (assert) {
      const emblem = (0, _utils.w)('', '%MyComponent as |comp| [', '  @foo=bar', '  @baz=\'food\'', ']', "  = comp.name");
      assert.compilesTo(emblem, '<MyComponent @foo={{bar}} @baz=\"food\" as |comp|>{{comp.name}}</MyComponent>');
    });
    (0, _qunit.test)('brackets with block params in the end', function (assert) {
      const emblem = (0, _utils.w)('', '%MyComponent [', '  @foo=bar', '  @baz=\'food\'', '] as |comp|', "  = comp.name");
      assert.compilesTo(emblem, '<MyComponent @foo={{bar}} @baz=\"food\" as |comp|>{{comp.name}}</MyComponent>');
    });
    (0, _qunit.test)('brackets with dedent end', function (assert) {
      const emblem = (0, _utils.w)('', '%MyComponent [', '  @foo=bar', '  @baz=\'food\'', ']');
      assert.compilesTo(emblem, '<MyComponent @foo={{bar}} @baz=\"food\"/>');
    });
    (0, _qunit.test)('bracketed nested block 1', function (assert) {
      const emblem = (0, _utils.w)('', '%MyComponent [', '  ', '  @something="false"', ']', '  p Bracketed helper attrs!');
      assert.compilesTo(emblem, '<MyComponent @something=\"false\"><p>Bracketed helper attrs!</p></MyComponent>');
    });
    (0, _qunit.test)('bracketed nested block 2', function (assert) {
      const emblem = (0, _utils.w)('%MyComponent [', '  ', '  @something="false"', ']', '  p Bracketed helper attrs!');
      assert.compilesTo(emblem, '<MyComponent @something=\"false\"><p>Bracketed helper attrs!</p></MyComponent>');
    });
    (0, _qunit.test)('bracketed nested with actions', function (assert) {
      const emblem = (0, _utils.w)('', '%MyComponent [', '  onclick={ action \'doSometing\' foo bar }', '  change=\'otherAction\'', '  @something="false"', ']', '  p Bracketed helper attrs!');
      assert.compilesTo(emblem, '<MyComponent onclick={{action \'doSometing\' foo bar}} {{action \"otherAction\" on=\"change\"}} @something=\"false\"><p>Bracketed helper attrs!</p></MyComponent>');
    });
    (0, _qunit.test)('bracketed modifiers', function (assert) {
      const emblem = (0, _utils.w)('%MyComponent [', '  {did-insert this.handler}', '  {on "input" @onInput}', '', '  @something="false"', ']', '  p Bracketed helper attrs!');
      assert.compilesTo(emblem, '<MyComponent {{did-insert this.handler}} {{on "input" @onInput}} @something=\"false\"><p>Bracketed helper attrs!</p></MyComponent>');
    });
    (0, _qunit.test)('bracketed with in-tag modifier', function (assert) {
      const emblem = (0, _utils.w)('%MyComponent{did-insert this.handler} [', '', '  @something="false"', ']', '  p Bracketed helper attrs!');
      assert.compilesTo(emblem, '<MyComponent {{did-insert this.handler}} @something=\"false\"><p>Bracketed helper attrs!</p></MyComponent>');
    });
    (0, _qunit.test)('tag modifiers with multi-line', function (assert) {
      const emblem = (0, _utils.w)('%MyComponent{did-insert this.handler} [', '  {on "input" @onInput}', '  ', '  @something="false"', ']', '  p Bracketed helper attrs!');
      assert.compilesTo(emblem, '<MyComponent {{did-insert this.handler}} {{on "input" @onInput}} @something=\"false\"><p>Bracketed helper attrs!</p></MyComponent>');
    });
    (0, _qunit.test)('tag multi-line modifier', function (assert) {
      const emblem = (0, _utils.w)('%MyComponent{did-insert (queue [', '  (action this.closeWizard)', '  (transition-to "home")', '])} [', '  ', '  @something="false"', ']', '  p Bracketed helper attrs!');
      assert.compilesTo(emblem, '<MyComponent {{did-insert (queue (action this.closeWizard) (transition-to "home"))}} @something=\"false\"><p>Bracketed helper attrs!</p></MyComponent>');
    });
    (0, _qunit.test)('tag multi-line modifier - second case', function (assert) {
      const emblem = (0, _utils.w)('%MyComponent{queue [', '  (action this.closeWizard)', '  (transition-to "home")', ']} [', '  ', '  @something="false"', ']', '  p Bracketed helper attrs!');
      assert.compilesTo(emblem, '<MyComponent {{queue (action this.closeWizard) (transition-to "home")}} @something=\"false\"><p>Bracketed helper attrs!</p></MyComponent>');
    });
    (0, _qunit.test)('tag multi-line modifier - third case', function (assert) {
      const emblem = (0, _utils.w)('%MyComponent{action (queue [', '  (action this.closeWizard)', '  (transition-to "home")', '])} [', '  ', '  @something="false"', ']', '  p Bracketed helper attrs!');
      assert.compilesTo(emblem, '<MyComponent {{action (queue (action this.closeWizard) (transition-to "home"))}} @something=\"false\"><p>Bracketed helper attrs!</p></MyComponent>');
    });
    (0, _qunit.test)("bracketed with Sub-expressions", function (assert) {
      const emblem = (0, _utils.w)('%MyComponent [', '  @onClose={action (queue [', '    (action this.closeWizard)', '    (transition-to "home")', '  ])}', ']');
      assert.compilesTo(emblem, '<MyComponent @onClose={{action (queue (action this.closeWizard) (transition-to "home"))}}/>');
    });
    (0, _qunit.test)("bracketed from first with Sub-expressions", function (assert) {
      const emblem = (0, _utils.w)('%MyComponent [', '  @onClose={coop [', '    (action this.closeWizard)', '    (transition-to "home")', '  ]}', ']');
      assert.compilesTo(emblem, '<MyComponent @onClose={{coop (action this.closeWizard) (transition-to "home")}}/>');
    });
  });
});
define("tests/integration/glimmer/named-blocks-test", ["qunit", "tests/support/utils"], function (_qunit, _utils) {
  "use strict";

  (0, _qunit.module)('glimmer: named blocks', function (hooks) {
    (0, _qunit.test)('named block support', function (assert) {
      const emblem = (0, _utils.w)('% x-modal', '  % @header as |@title|', '    |Header #{title}', '  % @body', '    |Body ${title}', '  % @footer', '    |Footer');
      assert.compilesTo(emblem, '<x-modal><@header as |@title|>Header {{title}}</@header><@body>Body {{title}}</@body><@footer>Footer</@footer></x-modal>');
    });
    (0, _qunit.test)('named yielded block support', function (assert) {
      const emblem = (0, _utils.w)('%Article', '  %:title', '    h1 = this.title', '  %:body', '    .byline = byline this.author', '    .body = this.body');
      assert.compilesTo(emblem, '<Article><:title><h1>{{this.title}}</h1></:title><:body><div class="byline">{{byline this.author}}</div><div class="body">{{this.body}}</div></:body></Article>');
    });
  });
});
define("tests/integration/glimmer/namespacing-test", ["qunit", "tests/support/utils"], function (_qunit, _utils) {
  "use strict";

  (0, _qunit.module)('glimmer: namespacing', function (hooks) {
    (0, _qunit.test)("names with :", function (assert) {
      const emblem = (0, _utils.w)("% inputs:MyComponent @value=foo");
      assert.compilesTo(emblem, '<inputs:MyComponent @value={{foo}}/>');
    });
    (0, _qunit.test)('module namespaces', function (assert) {
      const emblem = (0, _utils.w)('% my-addon::foo');
      assert.compilesTo(emblem, '<my-addon::foo/>');
    });
  });
});
define("tests/integration/mustache/block-statements-test", ["qunit", "tests/support/utils"], function (_qunit, _utils) {
  "use strict";

  (0, _qunit.module)('mustache: block statements', function (hooks) {
    (0, _qunit.test)("text only", function (assert) {
      const emblem = "view SomeView | Hello";
      assert.compilesTo(emblem, '{{#view SomeView}}Hello{{/view}}');
    });
    (0, _qunit.test)("multiline", function (assert) {
      const emblem = (0, _utils.w)("view SomeView | Hello,", "  How are you?", "  Sup?");
      assert.compilesTo(emblem, '{{#view SomeView}}Hello, How are you? Sup?{{/view}}');
    });
    (0, _qunit.test)("with nesting", function (assert) {
      const emblem = "p{{bind-attr class=\"foo\"}}\n  span Hello";
      assert.compilesTo(emblem, '<p {{bind-attr class="foo"}}><span>Hello</span></p>');
    });
    (0, _qunit.test)('more nesting', function (assert) {
      const emblem = (0, _utils.w)('', 'sally', '  p Hello');
      assert.compilesTo(emblem, '{{#sally}}<p>Hello</p>{{/sally}}');
    });
    (0, _qunit.test)("block as #each", function (assert) {
      const emblem = (0, _utils.w)('thangs', '  p Woot #{yeah} ${hohoho}');
      assert.compilesTo(emblem, '{{#thangs}}<p>Woot {{yeah}} {{hohoho}}</p>{{/thangs}}');
    });
    (0, _qunit.test)("w/ mustaches", function (assert) {
      const emblem = (0, _utils.w)("div", "  span Hello,", "       {{foo}} are you?", "       Excellent.");
      assert.compilesTo(emblem, "<div><span>Hello, {{foo}} are you? Excellent.</span></div>");
    });
    (0, _qunit.test)("nested combo syntax", function (assert) {
      const emblem = (0, _utils.w)("ul = each items", "  li = foo");
      assert.compilesTo(emblem, '<ul>{{#each items}}<li>{{foo}}</li>{{/each}}</ul>');
    });
    (0, _qunit.test)('recursive nesting', function (assert) {
      const emblem = (0, _utils.w)('', 'sally', '  sally', '    p Hello');
      assert.compilesTo(emblem, '{{#sally}}{{#sally}}<p>Hello</p>{{/sally}}{{/sally}}');
    });
    (0, _qunit.test)('recursive nesting part 2', function (assert) {
      const emblem = (0, _utils.w)('', 'sally', '  sally thing', '    p Hello');
      assert.compilesTo(emblem, '{{#sally}}{{#sally thing}}<p>Hello</p>{{/sally}}{{/sally}}');
    });
    (0, _qunit.test)("single-line mustaches can have elements right after", function (assert) {
      const emblem = (0, _utils.w)('div', '  = thing', '  div' // significantly, this has no return character
      );
      assert.compilesTo(emblem, '<div>{{thing}}<div></div></div>');
    });
    (0, _qunit.test)("multi-line mustaches can have array indexes with blocks", function (assert) {
      const emblem = (0, _utils.w)('my-component [', '  value=child.[0]', ']', '  | Thing');
      assert.compilesTo(emblem, '{{#my-component value=child.[0]}}Thing{{/my-component}}');
    });
    (0, _qunit.test)("nested components with colon", function (assert) {
      const emblem = (0, _utils.w)('= my-component: = my-other-component: p Hello');
      assert.compilesTo(emblem, '{{#my-component}}{{#my-other-component}}<p>Hello</p>{{/my-other-component}}{{/my-component}}');
    });
    (0, _qunit.test)("nested components with colon - case 2", function (assert) {
      const emblem = (0, _utils.w)('= my-component value=this.someProp.[0]: = my-other-component value=this.someProp2: p Hello');
      assert.compilesTo(emblem, '{{#my-component value=this.someProp.[0]}}{{#my-other-component value=this.someProp2}}<p>Hello</p>{{/my-other-component}}{{/my-component}}');
    });
    (0, _qunit.test)("nested components with colon - case 3", function (assert) {
      const emblem = (0, _utils.w)('= my-component [', '  value=this.someProp.[0]', ']: = my-other-component value=this.someProp2: p Hello');
      assert.compilesTo(emblem, '{{#my-component value=this.someProp.[0]}}{{#my-other-component value=this.someProp2}}<p>Hello</p>{{/my-other-component}}{{/my-component}}');
    });
  });
});
define("tests/integration/mustache/class-shorthand-test", ["qunit", "tests/support/utils"], function (_qunit, _utils) {
  "use strict";

  (0, _qunit.module)('mustache: class shorthand', function (hooks) {
    (0, _qunit.test)("mustache class binding", function (assert) {
      const emblem = 'iframe.foo class=dog';
      assert.compilesTo(emblem, '<iframe class="foo {{dog}}"></iframe>');
    });
    (0, _qunit.test)("class special syntax with 2 vals", function (assert) {
      const emblem = 'p class=foo:bar:baz';
      assert.compilesTo(emblem, '<p class={{if foo \'bar\' \'baz\'}}></p>');
    });
    (0, _qunit.test)("class special syntax with only 2nd val", function (assert) {
      const emblem = 'p class=foo::baz';
      assert.compilesTo(emblem, '<p class={{if foo \'\' \'baz\'}}></p>');
    });
    (0, _qunit.test)("class special syntax with only 1st val", function (assert) {
      const emblem = 'p class=foo:baz';
      assert.compilesTo(emblem, '<p class={{if foo \'baz\'}}></p>');
    });
    (0, _qunit.test)("class special syntax with slashes", function (assert) {
      const emblem = 'p class=foo/bar:baz';
      assert.compilesTo(emblem, '<p class={{if foo/bar \'baz\'}}></p>');
    });
    (0, _qunit.test)("Inline binding with mixed classes", function (assert) {
      const emblem = ".notice class={ test::active }";
      assert.compilesTo(emblem, '<div class=\"notice {{if test \'\' \'active\'}}\"></div>');
    });
    (0, _qunit.test)("class braced syntax w/ underscores and dashes 1", function (assert) {
      assert.compilesTo('p class={f-oo:bar :b_az}', '<p class="b_az {{if f-oo \'bar\'}}"></p>');
    });
    (0, _qunit.test)("class braced syntax w/ underscores and dashes 2", function (assert) {
      assert.compilesTo('p class={ f-oo:bar :b_az }', '<p class="b_az {{if f-oo \'bar\'}}"></p>');
    });
    (0, _qunit.test)("class braced syntax w/ underscores and dashes 3", function (assert) {
      assert.compilesTo('p class={ f-oo:bar :b_az } Hello', '<p class="b_az {{if f-oo \'bar\'}}">Hello</p>');
    });
    (0, _qunit.test)("class braced syntax w/ underscores and dashes 4", function (assert) {
      const emblem = (0, _utils.w)(".input-prepend class={ filterOn:input-append }", "  span.add-on");
      assert.compilesTo(emblem, '<div class="input-prepend {{if filterOn \'input-append\'}}"><span class="add-on"></span></div>');
    });
    (0, _qunit.test)("multiple bindings with inline conditionals", function (assert) {
      const emblem = "button class={ thing1:active thing2:alert }";
      assert.compilesTo(emblem, '<button class=\"{{if thing1 \'active\'}} {{if thing2 \'alert\'}}\"></button>');
    });
  });
});
define("tests/integration/mustache/conditional-shorthand-test", ["qunit", "tests/support/utils"], function (_qunit, _utils) {
  "use strict";

  (0, _qunit.module)('mustache: conditional shorthand', function (hooks) {
    (0, _qunit.test)("? helper defaults to `if` invocation", function (assert) {
      const emblem = "foo?\n  p Yeah";
      assert.compilesTo(emblem, '{{#if foo}}<p>Yeah</p>{{/if}}');
    });
    (0, _qunit.test)("else works", function (assert) {
      const emblem = "foo?\n  p Yeah\nelse\n  p No";
      assert.compilesTo(emblem, '{{#if foo}}<p>Yeah</p>{{else}}<p>No</p>{{/if}}');
    });
    (0, _qunit.test)("compound with text", function (assert) {
      const emblem = (0, _utils.w)("p = foo? ", "  | Hooray", "else", "  | No", "p = bar? ", "  | Hooray", "else", "  | No");
      assert.compilesTo(emblem, '<p>{{#if foo}}Hooray{{else}}No{{/if}}</p>' + '<p>{{#if bar}}Hooray{{else}}No{{/if}}</p>');
    });
    (0, _qunit.test)("compound with variables", function (assert) {
      const emblem = (0, _utils.w)("p = foo? ", "  bar", "else", "  baz");
      assert.compilesTo(emblem, '<p>{{#if foo}}{{bar}}{{else}}{{baz}}{{/if}}</p>');
    });
  });
});
define("tests/integration/mustache/conditionals-test", ["qunit", "tests/support/utils"], function (_qunit, _utils) {
  "use strict";

  (0, _qunit.module)('mustache: conditionals', function (hooks) {
    (0, _qunit.test)("simple if statement", function (assert) {
      const emblem = (0, _utils.w)("= if foo", "  | Foo", "= if bar", "  | Bar");
      assert.compilesTo(emblem, "{{#if foo}}Foo{{/if}}{{#if bar}}Bar{{/if}}");
    });
    (0, _qunit.test)("simple if else statement", function (assert) {
      const emblem = (0, _utils.w)("= if foo", "  | Foo", "= else", "  | Bar");
      assert.compilesTo(emblem, "{{#if foo}}Foo{{else}}Bar{{/if}}");
    });
    (0, _qunit.test)("if else ", function (assert) {
      const emblem = (0, _utils.w)("= if foo", "  | Foo", "  = if bar", "    | Bar", "  = else", "    | Woot", "= else", "  | WRONG", "= if bar", "  | WRONG", "= else", "  | Hooray");
      assert.compilesTo(emblem, "{{#if foo}}Foo{{#if bar}}Bar{{else}}Woot{{/if}}{{else}}WRONG{{/if}}{{#if bar}}WRONG{{else}}Hooray{{/if}}");
    });
    (0, _qunit.test)("else without preceding `=`", function (assert) {
      const emblem = (0, _utils.w)("if foo", "  p Yeah", "else", "  p No", "if bar", "  p Yeah!", "else", "  p No!", "if bar", "  p Yeah!", "=else", "  p No!");
      assert.compilesTo(emblem, "{{#if foo}}<p>Yeah</p>{{else}}<p>No</p>{{/if}}{{#if bar}}<p>Yeah!</p>{{else}}<p>No!</p>{{/if}}{{#if bar}}<p>Yeah!</p>{{else}}<p>No!</p>{{/if}}");
    });
    (0, _qunit.test)("unless", function (assert) {
      const emblem = (0, _utils.w)("= unless bar", "  | Foo", "  = unless foo", "    | Bar", "  = else", "    | Woot", "= else", "  | WRONG", "= unless foo", "  | WRONG", "= else", "  | Hooray");
      assert.compilesTo(emblem, "{{#unless bar}}Foo{{#unless foo}}Bar{{else}}Woot{{/unless}}{{else}}WRONG{{/unless}}{{#unless foo}}WRONG{{else}}Hooray{{/unless}}");
    });
    (0, _qunit.test)("else followed by newline doesn't gobble else content", function (assert) {
      const emblem = (0, _utils.w)("= if something", "  p something", "= else", "", "  = if nothing", "    p nothing", "  = else", "    p not nothing");
      assert.compilesTo(emblem, "{{#if something}}<p>something</p>{{else}}{{#if nothing}}<p>nothing</p>{{else}}<p>not nothing</p>{{/if}}{{/if}}");
    });
    (0, _qunit.test)("else if block", function (assert) {
      const emblem = (0, _utils.w)("= if something", "  p something", "= else if somethingElse", "  p nothing");
      assert.compilesTo(emblem, "{{#if something}}<p>something</p>{{else if somethingElse}}<p>nothing</p>{{/if}}");
    });
    (0, _qunit.test)("else if with else block", function (assert) {
      const emblem = (0, _utils.w)("= if something", "  p something", "= else if somethingElse", "  p otherThing", "= else", "  p nothing");
      assert.compilesTo(emblem, "{{#if something}}<p>something</p>{{else if somethingElse}}<p>otherThing</p>{{else}}<p>nothing</p>{{/if}}");
    });
    (0, _qunit.test)("else if twice with else block", function (assert) {
      const emblem = (0, _utils.w)("= if something", "  p something", "= else if somethingElse", "  p otherThing", "= else if anotherSomethingElse", "  p otherThing2", "= else", "  p nothing");
      assert.compilesTo(emblem, "{{#if something}}<p>something</p>{{else if somethingElse}}<p>otherThing</p>{{else if anotherSomethingElse}}<p>otherThing2</p>{{else}}<p>nothing</p>{{/if}}");
    });
    (0, _qunit.test)("else if with extra nodes", function (assert) {
      const emblem = (0, _utils.w)("= if something", "  p something", "  h2", "    p something", "= else if somethingElse", "  p otherThing", "  = if twoThree", "    strong 2:3", "  = else if twoFour", "    strong 2:4", "= else if anotherSomethingElse", "  p otherThing2", "  h2", "    h4", "      p something", "= else", "  p nothing");
      assert.compilesTo(emblem, "{{#if something}}<p>something</p><h2><p>something</p></h2>" + "{{else if somethingElse}}<p>otherThing</p>{{#if twoThree}}<strong>2:3</strong>{{else if twoFour}}<strong>2:4</strong>{{/if}}" + "{{else if anotherSomethingElse}}<p>otherThing2</p><h2><h4><p>something</p></h4></h2>" + "{{else}}<p>nothing</p>{{/if}}");
    });
    (0, _qunit.test)("else if with component block", function (assert) {
      const emblem = (0, _utils.w)("= if something", "  = my-component/widget-a value=model.options as |component indexWidget|", "    p The current value is #{ indexWidget } ${ indexWidget }", "    strong = component.warningMessage", "= else if somethingElse", "  h5 Danger!");
      assert.compilesTo(emblem, '{{#if something}}{{#my-component/widget-a value=model.options as |component indexWidget|}}<p>The current value is {{indexWidget}} {{indexWidget}}</p><strong>{{component.warningMessage}}</strong>{{/my-component/widget-a}}' + '{{else if somethingElse}}<h5>Danger!</h5>{{/if}}');
    });
    (0, _qunit.test)("inline if with unbound statements", function (assert) {
      const emblem = (0, _utils.w)("= if something 'something' 'somethingElse'");
      assert.compilesTo(emblem, "{{if something 'something' 'somethingElse'}}");
    });
    (0, _qunit.test)("inline if with bound statements", function (assert) {
      const emblem = (0, _utils.w)("= if something something 'somethingElse'");
      assert.compilesTo(emblem, "{{if something something 'somethingElse'}}");
    });
    (0, _qunit.test)("truth helpers syntax test 1", function (assert) {
      const emblem = (0, _utils.w)("= if (eq 1 2)", "  |1 == 2", "= unless (eq 1 2)", "  |1 != 2");
      assert.compilesTo(emblem, "{{#if (eq 1 2)}}1 == 2{{/if}}{{#unless (eq 1 2)}}1 != 2{{/unless}}");
    });
    (0, _qunit.test)("truth helpers syntax test 2", function (assert) {
      const emblem = (0, _utils.w)("= if (is-array siblings)", "  = each siblings as |sibling index|", "    |My sibling: #{ sibling }, #{ index }", "= else if (and (not model.isLoading) model.isError)", "  p Hey!");
      assert.compilesTo(emblem, "{{#if (is-array siblings)}}{{#each siblings as |sibling index|}}My sibling: {{sibling}}, {{index}}{{/each}}" + "{{else if (and (not model.isLoading) model.isError)}}<p>Hey!</p>{{/if}}");
    });
    (0, _qunit.test)("mustaches with else statement", function (assert) {
      const emblem = (0, _utils.w)('some-component-with-inverse-yield', '  |foo', 'else', '  |bar');
      assert.compilesTo(emblem, '{{#some-component-with-inverse-yield}}foo{{else}}bar{{/some-component-with-inverse-yield}}');
    });
    (0, _qunit.test)('mustache with else if', function (assert) {
      const emblem = (0, _utils.w)('= if foo', '  p Hi!', '= else if foo', '  p bye');
      assert.compilesTo(emblem, '{{#if foo}}<p>Hi!</p>{{else if foo}}<p>bye</p>{{/if}}');
    });
    (0, _qunit.test)('mustache with else if and complex statements', function (assert) {
      const emblem = (0, _utils.w)('= if foo', '  p Hi!', '= else if (eq 1 (and-or [', '  a=b', '  showHidden=(eq 1 2)', ']))', '  p Wow what was that?');
      assert.compilesTo(emblem, '{{#if foo}}<p>Hi!</p>{{else if (eq 1 (and-or a=b showHidden=(eq 1 2)))}}<p>Wow what was that?</p>{{/if}}');
    });
  });
});
define("tests/integration/mustache/each-else-test", ["qunit", "tests/support/utils"], function (_qunit, _utils) {
  "use strict";

  (0, _qunit.module)('mustache: each / else', function (hooks) {
    (0, _qunit.test)('example 1', function (assert) {
      const emblem = (0, _utils.w)('= each things', '  p = name', '= else', '  p There are no things!');
      assert.compilesTo(emblem, '{{#each things}}<p>{{name}}</p>{{else}}<p>There are no things!</p>{{/each}}');
    });
    (0, _qunit.test)('example 2', function (assert) {
      const emblem = (0, _utils.w)('= my-component', '  p Foo', '= else', '  p Bar');
      assert.compilesTo(emblem, '{{#my-component}}<p>Foo</p>{{else}}<p>Bar</p>{{/my-component}}');
    });
  });
});
define("tests/integration/mustache/handlebars-expressions-test", ["qunit", "tests/support/utils"], function (_qunit, _utils) {
  "use strict";

  (0, _qunit.module)('mustache: handlebars expressions', function (hooks) {
    (0, _qunit.test)("recognizes double-quoted attrs", function (assert) {
      const emblem = 'frank text="yes"';
      assert.compilesTo(emblem, '{{frank text="yes"}}');
    });
    (0, _qunit.test)("recognizes single-quoted attrs", function (assert) {
      const emblem = "frank text='yes'";
      assert.compilesTo(emblem, "{{frank text='yes'}}");
    });
    (0, _qunit.test)("recognizes unquoted attrs", function (assert) {
      const emblem = "frank foo=bar";
      assert.compilesTo(emblem, "{{frank foo=bar}}");
    });
    (0, _qunit.test)("sub-expressions are ok", function (assert) {
      const emblem = `
      = link-to 'content-manage.social' (query-params groupId=defaultGroup.id) tagName="li"
    `;
      assert.compilesTo(emblem, '{{link-to \'content-manage.social\' (query-params groupId=defaultGroup.id) tagName="li"}}');
    });
    (0, _qunit.test)('percent sign in quoted attr value', function (assert) {
      const emblem = `
      = input placeholder="100%"
    `;
      assert.compilesTo(emblem, '{{input placeholder="100%"}}');
    });
    (0, _qunit.test)('colon and semicolon in quoted attr value', function (assert) {
      const emblem = `
      = input style="outline:blue; color:red"
    `;
      assert.compilesTo(emblem, '{{input style="outline:blue; color:red"}}');
    });
    (0, _qunit.test)('mustache attribute value has comma', function (assert) {
      const emblem = "a name='my, cool, name'";
      assert.compilesTo(emblem, '<a name="my, cool, name"></a>');
    });
    (0, _qunit.test)("path with dot 1", function (assert) {
      const emblem = 'iframe src=post.pdfAttachment';
      assert.compilesTo(emblem, '<iframe src={{post.pdfAttachment}}></iframe>');
    });
    (0, _qunit.test)("path with dot 2", function (assert) {
      const emblem = 'iframe src=post.pdfAttachmentUrl width="96%" height="400" view="FitV" frameborder="0" style="z-index: 0 !important;"';
      assert.compilesTo(emblem, '<iframe src={{post.pdfAttachmentUrl}} width="96%" height="400" view="FitV" frameborder="0" style="z-index: 0 !important;"></iframe>');
    });
    (0, _qunit.test)("booleans with and without quoting", function (assert) {
      assert.compilesTo('foo what=false', '{{foo what=false}}');
      assert.compilesTo('foo what="false"', '{{foo what="false"}}');
      assert.compilesTo("foo what='false'", '{{foo what=\'false\'}}');
    });
    (0, _qunit.test)("bound attributes from within strings", function (assert) {
      const emblem = 'div style="width: {{userProvidedWidth}}px;"';
      assert.compilesTo(emblem, '<div style="width: {{userProvidedWidth}}px;"></div>');
    });
    (0, _qunit.test)('use of "this"', function (assert) {
      const emblem = (0, _utils.w)('', 'each foo', '  p = this', '  this');
      assert.compilesTo(emblem, '{{#each foo}}<p>{{this}}</p>{{this}}{{/each}}');
    });
    (0, _qunit.test)('mustache attr with underscore', function (assert) {
      const emblem = 'input placeholder=cat_name';
      assert.compilesTo(emblem, '<input placeholder={{cat_name}}/>');
    });
    (0, _qunit.test)('mustache with empty attr value (single-quoted string)', function (assert) {
      const emblem = "= input placeholder=''";
      assert.compilesTo(emblem, "{{input placeholder=''}}");
    });
    (0, _qunit.test)('mustache with empty attr value (double-quoted string)', function (assert) {
      const emblem = '= input placeholder=""';
      assert.compilesTo(emblem, '{{input placeholder=""}}');
    });
    (0, _qunit.test)('explicit mustache with "/" in name', function (assert) {
      const emblem = '= navigation/button-list';
      assert.compilesTo(emblem, '{{navigation/button-list}}');
    });
    (0, _qunit.test)('explicit mustache with spacing issues', function (assert) {
      assert.compilesTo('=  link-to  foo=bar', '{{link-to foo=bar}}');
    });
    (0, _qunit.test)("should not kick in if preceded by equal sign", function (assert) {
      const emblem = (0, _utils.w)("= SomeView");
      assert.compilesTo(emblem, '{{SomeView}}');
    });
    (0, _qunit.test)("should not kick in if preceded by equal sign (example with partial)", function (assert) {
      const emblem = (0, _utils.w)('= partial "cats"');
      assert.compilesTo(emblem, '{{partial "cats"}}');
    });
    (0, _qunit.test)("should not kick in explicit {{mustache}}", function (assert) {
      const emblem = (0, _utils.w)("p Yeah {{SomeView}}");
      assert.compilesTo(emblem, '<p>Yeah {{SomeView}}</p>');
    });
    (0, _qunit.test)("various one-liners", function (assert) {
      const emblem = (0, _utils.w)("= foo", "arf", "p = foo", "span.foo", 'p data-foo="yes" = goo');
      assert.compilesTo(emblem, '{{foo}}{{arf}}<p>{{foo}}</p><span class="foo"></span><p data-foo="yes">{{goo}}</p>');
    });
    (0, _qunit.test)("more complicated", function (assert) {
      const emblem = "view SomeView borf=\"yes\" | Hello, How are you? Sup?";
      assert.compilesTo(emblem, '{{#view SomeView borf="yes"}}Hello, How are you? Sup?{{/view}}');
    });
    (0, _qunit.test)("GH-26: no need for space before equal sign", function (assert) {
      let emblem;
      emblem = "span= foo";
      assert.compilesTo(emblem, '<span>{{foo}}</span>');
      emblem = "span.foo= foo";
      assert.compilesTo(emblem, '<span class="foo">{{foo}}</span>');
      emblem = "span#hooray.foo= foo";
      assert.compilesTo(emblem, '<span id="hooray" class="foo">{{foo}}</span>');
      emblem = "#hooray= foo";
      assert.compilesTo(emblem, '<div id="hooray">{{foo}}</div>');
      emblem = ".hooray= foo";
      assert.compilesTo(emblem, '<div class="hooray">{{foo}}</div>');
    });
    (0, _qunit.module)('binding behavior', function () {
      (0, _qunit.test)("basic", function (assert) {
        const emblem = 'p class=foo';
        assert.compilesTo(emblem, '<p class={{foo}}></p>');
      });
      (0, _qunit.test)("basic w/ underscore", function (assert) {
        const emblem = 'p class=foo_urns';
        assert.compilesTo(emblem, '<p class={{foo_urns}}></p>');
      });
      (0, _qunit.test)("subproperties", function (assert) {
        const emblem = 'p class=foo._death.woot';
        assert.compilesTo(emblem, '<p class={{foo._death.woot}}></p>');
      });
      (0, _qunit.test)("multiple", function (assert) {
        const emblem = 'p class=foo id="yup" data-thinger=yeah Hooray';
        assert.compilesTo(emblem, '<p id="yup" data-thinger={{yeah}} class={{foo}}>Hooray</p>');
      });
      (0, _qunit.test)("multiple with legacy quoting", function (assert) {
        const emblem = 'p class=foo id="yup" data-thinger=yeah Hooray';
        assert.compilesTo(emblem, '<p id="yup" data-thinger=\"{{yeah}}\" class={{foo}}>Hooray</p>', null, {
          legacyAttributeQuoting: true
        });
      });
      (0, _qunit.test)("in brackets", function (assert) {
        const emblem = "p [\n  id=id some-data=data.ok\n]\n";
        assert.compilesTo(emblem, '<p id={{id}} some-data={{data.ok}}></p>');
      });
      (0, _qunit.test)('brackets with empty lines', function (assert) {
        const emblem = (0, _utils.w)('p [', '  id=id', '  ', '', '  some-data=data.ok', ']');
        assert.compilesTo(emblem, '<p id={{id}} some-data={{data.ok}}></p>');
      });
    });
  });
});
define("tests/integration/mustache/handlebars-helpers-test", ["qunit", "tests/support/utils"], function (_qunit, _utils) {
  "use strict";

  (0, _qunit.module)('mustache: handlebars helpers', function (hooks) {
    (0, _qunit.test)('double mustache in text line', function (assert) {
      const emblem = `| bork {{bar}}`;
      assert.compilesTo(emblem, 'bork {{bar}}');
    });
    (0, _qunit.module)('tripple stash', function () {
      (0, _qunit.test)("with mustache calling helper 1", function (assert) {
        assert.compilesTo('p class="foo {{{echo "YES"}}}"', '<p class="foo {{{echo \\"YES\\"}}}"></p>');
      });
      (0, _qunit.test)("with mustache calling helper 2", function (assert) {
        assert.compilesTo('p class="foo #{echo "NO"}, ${echo "MAYBE"} and {{{echo "YES"}}}" Hello', '<p class="foo {{echo \\"NO\\"}}, {{echo \\"MAYBE\\"}} and {{{echo \\"YES\\"}}}">Hello</p>');
      });
      (0, _qunit.test)("with mustache calling helper 3", function (assert) {
        const emblem = "p class=\"foo {{echo \"BORF\"}}\"\n  | Hello";
        assert.compilesTo(emblem, '<p class="foo {{echo \\"BORF\\"}}">Hello</p>');
      });
      (0, _qunit.test)('triple mustache in text line', function (assert) {
        const emblem = `| bork {{{bar}}}`;
        assert.compilesTo(emblem, 'bork {{{bar}}}');
      });
      (0, _qunit.test)("with triplestache", function (assert) {
        assert.compilesTo('p{{{insertClass foo}}} Hello', '<p {{{insertClass foo}}}>Hello</p>');
      });
      (0, _qunit.test)("multiple", function (assert) {
        assert.compilesTo('p{{{insertClass foo}}}{{{insertClass boo}}} Hello', '<p {{{insertClass foo}}} {{{insertClass boo}}}>Hello</p>');
      });
    });
    (0, _qunit.module)('hash brace syntax', function () {
      (0, _qunit.test)('hash stache in text line', function (assert) {
        const emblem = "| bork #{bar} ${baz}";
        assert.compilesTo(emblem, 'bork {{bar}} {{baz}}');
      });
      (0, _qunit.test)('acts like {{}}', function (assert) {
        const emblem = "span Yo #{foo}, I ${herd}.";
        assert.compilesTo(emblem, "<span>Yo {{foo}}, I {{herd}}.</span>");
      });
      (0, _qunit.test)('can start inline content', function (assert) {
        const emblem = "span #{foo}, I ${herd}.";
        assert.compilesTo(emblem, "<span>{{foo}}, I {{herd}}.</span>");
      });
      (0, _qunit.test)('can end inline content', function (assert) {
        const emblem = "span I ${herd} #{foo}";
        assert.compilesTo(emblem, "<span>I {{herd}} {{foo}}</span>");
      });
      (0, _qunit.test)("doesn't screw up parsing when # used in text nodes", function (assert) {
        const emblem = "span OMG #YOLO";
        assert.compilesTo(emblem, "<span>OMG #YOLO</span>");
      });
      (0, _qunit.test)("# can be only thing on line", function (assert) {
        const emblem = "span #";
        assert.compilesTo(emblem, "<span>#</span>");
      });
    });
  });
});
define("tests/integration/mustache/html-attributes-test", ["qunit", "tests/support/utils"], function (_qunit, _utils) {
  "use strict";

  (0, _qunit.module)('mustache: html attributes', function (hooks) {
    (0, _qunit.test)('names with multiple underscores', function (assert) {
      const emblem = "= link-to .nav__item 'dashboard' | Foo Bar";
      assert.compilesTo(emblem, "{{#link-to 'dashboard' class=\"nav__item\"}}Foo Bar{{/link-to}}");
    });
    (0, _qunit.test)('attributes and values with $ in them', function (assert) {
      assert.compilesTo('= my-component $foo=bar.$baz', '{{my-component $foo=bar.$baz}}');
    });
    (0, _qunit.test)("single", function (assert) {
      assert.compilesTo('p{inTagHelper foo}', '<p {{inTagHelper foo}}></p>');
    });
    (0, _qunit.test)("double", function (assert) {
      assert.compilesTo('p{{inTagHelper foo}}', '<p {{inTagHelper foo}}></p>');
    });
    (0, _qunit.test)("triple", function (assert) {
      assert.compilesTo('p{{{inTagHelper foo}}}', '<p {{{inTagHelper foo}}}></p>');
    });
    (0, _qunit.test)("with singlestache", function (assert) {
      assert.compilesTo('p{insertClass foo} Hello', '<p {{insertClass foo}}>Hello</p>');
    });
    (0, _qunit.test)("singlestache can be used in text nodes", function (assert) {
      assert.compilesTo('p Hello {dork}', '<p>Hello {dork}</p>');
    });
    (0, _qunit.test)("with doublestache", function (assert) {
      assert.compilesTo('p{{insertClass foo}} Hello', '<p {{insertClass foo}}>Hello</p>');
    });
    (0, _qunit.test)("bracketed modifiers", function (assert) {
      const emblem = (0, _utils.w)('div [', '  {did-insert this.handler}', '  {on "input" @onInput}', "  class='test'", "]");
      assert.compilesTo(emblem, '<div {{did-insert this.handler}} {{on "input" @onInput}} class="test"></div>');
    });
    (0, _qunit.test)("bracketed multi-line modifiers", function (assert) {
      const emblem = (0, _utils.w)('div [', '  {did-insert (queue [', '    (action this.closeWizard)', '    (transition-to "home")', '  ])}', '  {on "input" @onInput}', "  class='test'", "]");
      assert.compilesTo(emblem, '<div {{did-insert (queue (action this.closeWizard) (transition-to "home"))}} {{on "input" @onInput}} class="test"></div>');
    });
    (0, _qunit.test)("bracketed multi-line modifiers - second case", function (assert) {
      const emblem = (0, _utils.w)('div [', '  {queue [', '    (action this.closeWizard)', '    (transition-to "home")', '  ]}', '  {on "input" @onInput}', "  class='test'", "]");
      assert.compilesTo(emblem, '<div {{queue (action this.closeWizard) (transition-to "home")}} {{on "input" @onInput}} class="test"></div>');
    });
    (0, _qunit.test)("bracketed multi-line modifiers - third case", function (assert) {
      const emblem = (0, _utils.w)('div [', '  {action (queue [', '    (action this.closeWizard)', '    (transition-to "home")', '  ])}', '  {on "input" @onInput}', "  class='test'", "]");
      assert.compilesTo(emblem, '<div {{action (queue (action this.closeWizard) (transition-to "home"))}} {{on "input" @onInput}} class="test"></div>');
    });
    (0, _qunit.test)("tag multi-line modifier", function (assert) {
      const emblem = (0, _utils.w)('div{did-insert (queue [', '  (action this.closeWizard)', '  (transition-to "home")', '])} [', "  class='test'", "]");
      assert.compilesTo(emblem, '<div {{did-insert (queue (action this.closeWizard) (transition-to "home"))}} class="test"></div>');
    });
    (0, _qunit.test)("tag multi-line modifier - second case", function (assert) {
      const emblem = (0, _utils.w)('div{queue [', '  (action this.closeWizard)', '  (transition-to "home")', ']} [', "  class='test'", "]");
      assert.compilesTo(emblem, '<div {{queue (action this.closeWizard) (transition-to "home")}} class="test"></div>');
    });
    (0, _qunit.test)("tag multi-line modifier - third case", function (assert) {
      const emblem = (0, _utils.w)('div{action (queue [', '  (action this.closeWizard)', '  (transition-to "home")', '])} [', "  class='test'", "]");
      assert.compilesTo(emblem, '<div {{action (queue (action this.closeWizard) (transition-to "home"))}} class="test"></div>');
    });
    (0, _qunit.test)("tag modifiers with multi-line", function (assert) {
      const emblem = (0, _utils.w)('div{did-insert this.handler}{on "input" @onInput} [', "  class='test'", "]");
      assert.compilesTo(emblem, '<div {{did-insert this.handler}} {{on "input" @onInput}} class="test"></div>');
    });
    (0, _qunit.test)("tag modifier with multi-line modifier", function (assert) {
      const emblem = (0, _utils.w)("div{did-insert this.handler} [", '  {on "input" @onInput}', '  ', '  class="test"', ']');
      assert.compilesTo(emblem, '<div {{did-insert this.handler}} {{on "input" @onInput}} class="test"></div>');
    });
    (0, _qunit.test)("tag bracketed from first with Sub-expressions", function (assert) {
      const emblem = (0, _utils.w)('input [', '  value={calc [', '    (action this.closeWizard)', '    (transition-to "home")', '  ]}', ']');
      assert.compilesTo(emblem, '<input value={{calc (action this.closeWizard) (transition-to "home")}}/>');
    });
    (0, _qunit.test)("tag bracketed from first with Sub-expressions - second case", function (assert) {
      const emblem = (0, _utils.w)('input [', '  value={calc (or [', '    (action this.closeWizard)', '    (transition-to "home")', '  ])}', ']');
      assert.compilesTo(emblem, '<input value={{calc (or (action this.closeWizard) (transition-to "home"))}}/>');
    });
    (0, _qunit.test)("new-tag bracketed modifiers", function (assert) {
      const emblem = (0, _utils.w)('%some-new-tag [', '  {did-insert this.handler}', '  {on "input" @onInput}', "  class='test'", "]");
      assert.compilesTo(emblem, '<some-new-tag {{did-insert this.handler}} {{on "input" @onInput}} class="test"/>');
    });
    (0, _qunit.test)("new-tag bracketed multi-line modifiers", function (assert) {
      const emblem = (0, _utils.w)('%some-new-tag [', '  {did-insert (queue [', '    (action this.closeWizard)', '    (transition-to "home")', '  ])}', '  {on "input" @onInput}', "  class='test'", "]");
      assert.compilesTo(emblem, '<some-new-tag {{did-insert (queue (action this.closeWizard) (transition-to "home"))}} {{on "input" @onInput}} class="test"/>');
    });
    (0, _qunit.test)("new-tag multi-line modifier", function (assert) {
      const emblem = (0, _utils.w)('%some-new-tag{action (queue [', '  (action this.closeWizard)', '  (transition-to "home")', '])} [', "  class='test'", "]");
      assert.compilesTo(emblem, '<some-new-tag {{action (queue (action this.closeWizard) (transition-to "home"))}} class="test"/>');
    });
    (0, _qunit.test)("new-tag multi-line modifier - second case", function (assert) {
      const emblem = (0, _utils.w)('%some-new-tag{queue [', '  (action this.closeWizard)', '  (transition-to "home")', ']} [', "  class='test'", "]");
      assert.compilesTo(emblem, '<some-new-tag {{queue (action this.closeWizard) (transition-to "home")}} class="test"/>');
    });
    (0, _qunit.test)("new-tag modifiers with multi-line", function (assert) {
      const emblem = (0, _utils.w)('%some-new-tag{did-insert this.handler}{on "input" @onInput} [', "  class='test'", "]");
      assert.compilesTo(emblem, '<some-new-tag {{did-insert this.handler}} {{on "input" @onInput}} class="test"/>');
    });
    (0, _qunit.test)("new-tag modifier with multi-line modifier", function (assert) {
      const emblem = (0, _utils.w)("%some-new-tag{did-insert this.handler} [", '  {on "input" @onInput}', '  ', '  class="test"', ']');
      assert.compilesTo(emblem, '<some-new-tag {{did-insert this.handler}} {{on "input" @onInput}} class="test"/>');
    });
    (0, _qunit.test)("bracketed from first with Sub-expressions", function (assert) {
      const emblem = (0, _utils.w)('%some-new-tag [', '  value={calc [', '    (action this.closeWizard)', '    (transition-to "home")', '  ]}', '  class="test"', ']', '  |ggggg');
      assert.compilesTo(emblem, '<some-new-tag value={{calc (action this.closeWizard) (transition-to "home")}} class="test">ggggg</some-new-tag>');
    });
  });
});
define("tests/integration/mustache/in-tag-mustache-test", ["qunit", "tests/support/utils"], function (_qunit, _utils) {
  "use strict";

  (0, _qunit.module)('mustache: in tag mustache', function (hooks) {
    (0, _qunit.test)('embedded mustache', function (assert) {
      assert.compilesTo('p class="foo {{yes}}"', '<p class="foo {{yes}}"></p>');
    });
    (0, _qunit.test)('embedded mustache with inline block', function (assert) {
      assert.compilesTo('p class="foo {{yes}}" Hello', '<p class="foo {{yes}}">Hello</p>');
    });
    (0, _qunit.test)('embedded mustache with pipe helper', function (assert) {
      const emblem = "p class=\"foo {{yes}}\"\n  | Hello";
      assert.compilesTo(emblem, '<p class="foo {{yes}}">Hello</p>');
    });
    (0, _qunit.test)("single-line mustaches can have array indexes", function (assert) {
      const emblem = (0, _utils.w)('my-component value=child.[0]');
      assert.compilesTo(emblem, '{{my-component value=child.[0]}}');
    });
    (0, _qunit.test)("single-line mustaches can have array indexes with bound indexes (not supported by Ember)", function (assert) {
      const emblem = (0, _utils.w)('my-component value=child.[someIndex]');
      assert.compilesTo(emblem, '{{my-component value=child.[someIndex]}}');
    });
  });
});
define("tests/integration/mustache/multi-line-parameters-test", ["qunit", "tests/support/utils"], function (_qunit, _utils) {
  "use strict";

  (0, _qunit.module)('mustache: multi-line parameters', function (hooks) {
    (0, _qunit.test)('bracketed statement with blank lines', function (assert) {
      const emblem = (0, _utils.w)('sally [', '', '  \'foo\'', '', '  ', '', '  baz=true', ']');
      assert.compilesTo(emblem, '{{sally \'foo\' baz=true}}');
    });
    (0, _qunit.test)('bracketed statement with comments', function (assert) {
      const emblem = (0, _utils.w)('sally [ / blah', '  / foo', '  \'foo\'', '  / bar', '    what is this madness?', '  baz=true', ']');
      assert.compilesTo(emblem, '{{sally \'foo\' baz=true}}');
    });
    (0, _qunit.test)('bracketed nested statement', function (assert) {
      const emblem = (0, _utils.w)('', 'sally [', '  \'foo\'', '  something="false"', ']', '  | Bracketed helper attrs!');
      assert.compilesTo(emblem, '{{#sally \'foo\' something="false"}}Bracketed helper attrs!{{/sally}}');
    });
    (0, _qunit.test)('bracketed nested block params with block', function (assert) {
      const emblem = (0, _utils.w)('', 'sally [', '  \'foo\'', '  something="false"', ']', '  p Bracketed helper attrs!');
      assert.compilesTo(emblem, '{{#sally \'foo\' something="false"}}<p>Bracketed helper attrs!</p>{{/sally}}');
    });
    (0, _qunit.test)('bracketed nested block params with newline then block 1', function (assert) {
      const emblem = (0, _utils.w)('', '= foo [', '  bar=1', ']', '', '  p baz');
      assert.compilesTo(emblem, '{{#foo bar=1}}<p>baz</p>{{/foo}}');
    }); // Make sure there are tests with block params and different bracket arrangements

    (0, _qunit.test)('bracketed nested block params with newline then block 2', function (assert) {
      const emblem = (0, _utils.w)('', '= foo [', '  bar=1', ']', '', '  p baz');
      assert.compilesTo(emblem, '{{#foo bar=1}}<p>baz</p>{{/foo}}');
    });
    (0, _qunit.test)('bracketed statement with multiple initial arguments', function (assert) {
      const emblem = (0, _utils.w)('= component foo [', '  bar=baz', ']');
      assert.compilesTo(emblem, '{{component foo bar=baz}}');
    });
    (0, _qunit.test)('bracketed nested block params', function (assert) {
      const emblem = (0, _utils.w)('', 'sally [', '  \'foo\'', '  something="false"', '] as |foo|');
      assert.compilesTo(emblem, '{{sally \'foo\' something="false" as |foo|}}');
    });
    (0, _qunit.test)('bracketed with block params and block', function (assert) {
      const emblem = (0, _utils.w)('', 'sally [', '  \'foo\'', '  something="false"', '] as |foo|', '  p = foo');
      assert.compilesTo(emblem, '{{#sally \'foo\' something="false" as |foo|}}<p>{{foo}}</p>{{/sally}}');
    });
    (0, _qunit.test)('bracketed with close on newline and with block', function (assert) {
      const emblem = (0, _utils.w)('', 'sally [', '  \'foo\'', '  something="false"', ']', '  p = foo');
      assert.compilesTo(emblem, '{{#sally \'foo\' something="false"}}<p>{{foo}}</p>{{/sally}}');
    });
    (0, _qunit.test)('bracketed with close on newline, with block params and block', function (assert) {
      const emblem = (0, _utils.w)('', '= sally baz [', '  \'foo\'', '  something="false"', '] as |foo|', '  p = foo');
      assert.compilesTo(emblem, '{{#sally baz \'foo\' something="false" as |foo|}}<p>{{foo}}</p>{{/sally}}');
    });
    (0, _qunit.test)('bracketed action attribute', function (assert) {
      const emblem = (0, _utils.w)('', 'button [', '  click="doSomething"', ']', '  | click here');
      assert.compilesTo(emblem, '<button {{action "doSomething" on="click"}}>click here</button>');
    });
    (0, _qunit.test)("several bracketed attributes with closing bracket on final line", function (assert) {
      const emblem = (0, _utils.w)("= asdf-asdf [", "  thing=res1", "  thi2ng='res2'", "  otherThing=res3", "]");
      assert.compilesTo(emblem, '{{asdf-asdf thing=res1 thi2ng=\'res2\' otherThing=res3}}');
    });
    (0, _qunit.test)("several bracketed attributes without a block", function (assert) {
      const emblem = (0, _utils.w)("= asdf-asdf [", "  thing=res1", "  thi2ng='res2'", "  otherThing=res3", "]", "p Hi there");
      assert.compilesTo(emblem, '{{asdf-asdf thing=res1 thi2ng=\'res2\' otherThing=res3}}<p>Hi there</p>');
    });
    (0, _qunit.test)("several brackets with closing bracket on final line with a view", function (assert) {
      const emblem = (0, _utils.w)("Ember.Select [", "  thing=res1", "  thi2ng='res2'", "  otherThing=\"res3\"", "]");
      assert.compilesTo(emblem, '{{view Ember.Select thing=res1 thi2ng=\'res2\' otherThing="res3"}}');
    });
  });
});
define("tests/integration/mustache/unescaped-expressions-test", ["qunit", "tests/support/utils"], function (_qunit, _utils) {
  "use strict";

  (0, _qunit.module)('mustache: unescaped expressions', function (hooks) {
    (0, _qunit.test)("double =='s un-escape", function (assert) {
      const emblem = (0, _utils.w)("== foo", "foo", "p == foo");
      assert.compilesTo(emblem, '{{{foo}}}{{foo}}<p>{{{foo}}}</p>');
    });
  });
});
/* globals QUnit */

define('qunit', ['exports'], function (_exports) {
  'use strict';

  Object.defineProperty(_exports, '__esModule', {
    value: true
  });

  _exports.default = QUnit;
  _exports.module = QUnit.module;
  _exports.test = QUnit.test;
  _exports.skip = QUnit.skip;
  _exports.only = QUnit.only;
  _exports.todo = QUnit.todo;
});

define("tests/support/handlebars", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  var Handlebars;

  if (typeof window === "undefined") {
    Handlebars = require('handlebars');
  } else {
    Handlebars = window.Handlebars;
  }

  var _default = Handlebars;
  _exports.default = _default;
});
define("tests/support/integration-assertions", ["exports", "../support/utils", "emblem"], function (_exports, _utils, _emblem) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = loadAssertions;

  /*global QUnit*/
  const defaultOptions = {
    legacyAttributeQuoting: false
  };

  function loadAssertions() {
    QUnit.assert.compilesTo = function (emblem, handlebars, message, emblemOptions) {
      const options = emblemOptions || defaultOptions;
      const output = (0, _emblem.compile)(emblem, options);

      if (!message) {
        const maxLenth = 40;
        let messageEmblem = emblem.replace(/\n/g, "\\n");

        if (messageEmblem.length > maxLenth) {
          messageEmblem = messageEmblem.slice(0, maxLenth) + '...';
        }

        message = (0, _utils.w)('compilesTo assertion failed:', '\tEmblem:   "' + messageEmblem + '"', '\tExpected: "' + handlebars + '"', '\tActual:   "' + output + '"');
      }

      this.pushResult({
        result: output === handlebars,
        expected: output,
        actual: handlebars,
        message
      });
    };

    QUnit.assert.compilerThrows = function (emblem, message) {
      QUnit.assert.throws(function () {
        (0, _emblem.compile)(emblem);
      }, message);
    };
  }
});
define("tests/support/utils", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.w = w;

  function w() {
    var values = [];

    for (var i = 0, l = arguments.length; i < l; i++) {
      values.push(arguments[i]);
    }

    return values.join('\n');
  }
});
define("tests/test-runner", ["tests/support/integration-assertions"], function (_integrationAssertions) {
  "use strict";

  _integrationAssertions = _interopRequireDefault(_integrationAssertions);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  function loadTests() {
    const testKeys = Object.keys(requirejs._eak_seen).filter(a => a.endsWith('-test'));
    testKeys.forEach(key => require(key));
  }

  function startTestem() {
    if (window.Testem) {
      window.Testem.hookIntoTestFramework();
    }
  }

  (0, _integrationAssertions.default)();
  loadTests();
  startTestem();
});
define("tests/unit/ast-builder-test", ["../../emblem/ast-builder"], function (_astBuilder) {
  "use strict";

  /* global QUnit*/
  QUnit.module("Unit - Builder#toAST");
  QUnit.test('empty builder', function (assert) {
    var builder = (0, _astBuilder.generateBuilder)();
    var ast = builder.toAST();
    assert.deepEqual(ast, {
      type: 'program',
      childNodes: []
    });
  });
  QUnit.test('text node', function (assert) {
    var builder = (0, _astBuilder.generateBuilder)();
    builder.text('abc def ghi');
    var ast = builder.toAST();
    assert.deepEqual(ast, {
      type: 'program',
      childNodes: [{
        type: 'text',
        content: 'abc def ghi'
      }]
    });
  });
  QUnit.test('element node', function (assert) {
    var builder = (0, _astBuilder.generateBuilder)();
    builder.element('h1');
    var ast = builder.toAST();
    assert.deepEqual(ast, {
      type: 'program',
      childNodes: [{
        type: 'element',
        tagName: 'h1',
        inTagText: [],
        isVoid: false,
        classNameBindings: [],
        attrStaches: [],
        childNodes: []
      }]
    });
  });
  QUnit.test('void element node', function (assert) {
    var builder = (0, _astBuilder.generateBuilder)();
    builder.element('hr');
    var ast = builder.toAST();
    assert.deepEqual(ast, {
      type: 'program',
      childNodes: [{
        type: 'element',
        tagName: 'hr',
        inTagText: [],
        isVoid: true,
        classNameBindings: [],
        attrStaches: [],
        childNodes: []
      }]
    });
  });
  QUnit.test('attribute node', function (assert) {
    var builder = (0, _astBuilder.generateBuilder)();
    var el = builder.element('h1');
    builder.enter(el);
    var attrName = 'class';
    var attrContent = 'my-class';
    builder.attribute(attrName, attrContent);
    var ast = builder.toAST();
    assert.deepEqual(ast, {
      type: 'program',
      childNodes: [{
        type: 'element',
        tagName: 'h1',
        inTagText: [],
        isVoid: false,
        classNameBindings: [],
        attrStaches: [{
          type: 'attribute',
          name: attrName,
          content: attrContent
        }],
        childNodes: []
      }]
    });
  });
  QUnit.test('nested element nodes', function (assert) {
    var builder = (0, _astBuilder.generateBuilder)();
    var h1 = builder.element('h1');
    builder.enter(h1);
    builder.text('hello');
    var ast = builder.toAST();
    assert.deepEqual(ast, {
      type: 'program',
      childNodes: [{
        type: 'element',
        tagName: 'h1',
        inTagText: [],
        isVoid: false,
        classNameBindings: [],
        attrStaches: [],
        childNodes: [{
          type: 'text',
          content: 'hello'
        }]
      }]
    });
  });
  QUnit.test('nested element nodes enter and exit', function (assert) {
    var builder = (0, _astBuilder.generateBuilder)();
    var h1 = builder.element('h1');
    builder.enter(h1);
    builder.text('hello');
    builder.exit();
    builder.text('foobar');
    var ast = builder.toAST();
    assert.deepEqual(ast, {
      type: 'program',
      childNodes: [{
        type: 'element',
        tagName: 'h1',
        inTagText: [],
        isVoid: false,
        classNameBindings: [],
        attrStaches: [],
        childNodes: [{
          type: 'text',
          content: 'hello'
        }]
      }, {
        type: 'text',
        content: 'foobar'
      }]
    });
  });
});
define("tests/unit/mustache-parser-test", ["../../emblem/parser", "../support/utils", "../../emblem/preprocessor", "../../emblem/ast-builder"], function (_parser, _utils, _preprocessor, _astBuilder) {
  "use strict";

  /* global QUnit */
  QUnit.module('Unit - mustache-parser');

  function parseEmblem(emblem) {
    var builder = (0, _astBuilder.generateBuilder)();
    (0, _parser.parse)((0, _preprocessor.processSync)(emblem), {
      builder: builder
    });
    var ast = builder.toAST();
    return ast;
  }

  QUnit.test('capitalized start', function (assert) {
    var text = 'App.Funview';
    assert.deepEqual(parseEmblem(text), {
      "childNodes": [{
        "content": "view App.Funview",
        "escaped": true,
        "type": "mustache"
      }],
      "type": "program"
    });
  });
  QUnit.test('lowercase start', function (assert) {
    var text = 'frank';
    assert.deepEqual(parseEmblem(text), {
      "childNodes": [{
        "content": "frank",
        "escaped": true,
        "type": "mustache"
      }],
      "type": "program"
    });
  });
  QUnit.test('lowercase unquoted attr value', function (assert) {
    var text = 'frank foo=bar';
    assert.deepEqual(parseEmblem(text), {
      "childNodes": [{
        "content": "frank foo=bar",
        "escaped": true,
        "type": "mustache"
      }],
      "type": "program"
    });
  });
  QUnit.test('attrs with spaces', function (assert) {
    var text = 'frank foo = bar boo = far';
    assert.compilerThrows(text);
  });
  QUnit.test('multiple attrs', function (assert) {
    var text = 'frank foo=bar boo=far';
    assert.deepEqual(parseEmblem(text), {
      "childNodes": [{
        "content": "frank foo=bar boo=far",
        "escaped": true,
        "type": "mustache"
      }],
      "type": "program"
    });
  });
  QUnit.test('lowercase double-quoted attr value', function (assert) {
    var doubleQuote = 'input placeholder="\'100% /^%&*()x12#"';
    assert.deepEqual(parseEmblem(doubleQuote), {
      "childNodes": [{
        "attrStaches": [{
          "content": "'100% /^%&*()x12#",
          "name": "placeholder",
          "type": "attribute"
        }],
        "childNodes": [],
        "classNameBindings": [],
        "inTagText": [],
        "isVoid": true,
        "tagName": "input",
        "type": "element"
      }],
      "type": "program"
    });
  });
  QUnit.test('lowercase single-quoted attr value', function (assert) {
    var singleQuote = "input placeholder='\"100% /^%&*()x12#'";
    assert.deepEqual(parseEmblem(singleQuote), {
      "childNodes": [{
        "attrStaches": [{
          "content": "\"100% /^%&*()x12#",
          "name": "placeholder",
          "type": "attribute"
        }],
        "childNodes": [],
        "classNameBindings": [],
        "inTagText": [],
        "isVoid": true,
        "tagName": "input",
        "type": "element"
      }],
      "type": "program"
    });
  });
  QUnit.test('attr value with underscore', function (assert) {
    var text = 'input placeholder=cat_name';
    assert.deepEqual(parseEmblem(text), {
      "childNodes": [{
        "attrStaches": [{
          "content": "cat_name",
          "key": "placeholder",
          "type": "assignedMustache"
        }],
        "childNodes": [],
        "classNameBindings": [],
        "inTagText": [],
        "isVoid": true,
        "tagName": "input",
        "type": "element"
      }],
      "type": "program"
    });
  });
  QUnit.test('attr value is subexpression', function (assert) {
    var text = 'echofun fun=(equal 1 1)';
    assert.deepEqual(parseEmblem(text), {
      "childNodes": [{
        "content": "echofun fun=(equal 1 1)",
        "escaped": true,
        "type": "mustache"
      }],
      "type": "program"
    });
  });
  QUnit.test('attr value is complex subexpression', function (assert) {
    var text = 'echofun true (hello how="are" you=false) 1 not=true fun=(equal "ECHO hello" (echo (hello))) win="yes"';
    assert.deepEqual(parseEmblem(text), {
      "childNodes": [{
        "content": "echofun true (hello how=\"are\" you=false) 1 not=true fun=(equal \"ECHO hello\" (echo (hello))) win=\"yes\"",
        "escaped": true,
        "type": "mustache"
      }],
      "type": "program"
    });
  });
  QUnit.test('attr value is empty string', function (assert) {
    var doubleQuote = 'input placeholder=""';
    var singleQuote = "input placeholder=''";
    assert.deepEqual(parseEmblem(singleQuote), {
      "childNodes": [{
        "attrStaches": [{
          "content": "",
          "name": "placeholder",
          "type": "attribute"
        }],
        "childNodes": [],
        "classNameBindings": [],
        "inTagText": [],
        "isVoid": true,
        "tagName": "input",
        "type": "element"
      }],
      "type": "program"
    });
    assert.deepEqual(parseEmblem(doubleQuote), {
      "childNodes": [{
        "attrStaches": [{
          "content": "",
          "name": "placeholder",
          "type": "attribute"
        }],
        "childNodes": [],
        "classNameBindings": [],
        "inTagText": [],
        "isVoid": true,
        "tagName": "input",
        "type": "element"
      }],
      "type": "program"
    });
  });
  QUnit.test('query-params', function (assert) {
    var text = 'frank (query-params groupId=defaultGroup.id)';
    assert.deepEqual(parseEmblem(text), {
      "childNodes": [{
        "content": "frank (query-params groupId=defaultGroup.id)",
        "escaped": true,
        "type": "mustache"
      }],
      "type": "program"
    });
  });
  QUnit.test('nested query-params', function (assert) {
    var text = 'frank (query-params groupId=defaultGroup.id (more-qp x=foo))';
    assert.deepEqual(parseEmblem(text), {
      "childNodes": [{
        "content": "frank (query-params groupId=defaultGroup.id (more-qp x=foo))",
        "escaped": true,
        "type": "mustache"
      }],
      "type": "program"
    });
  });
  QUnit.test('mixed query-params and key-value attrs', function (assert) {
    var text = 'frank (query-params abc=def) fob=bob (qp-2 dog=fog) dab=tab  ';
    assert.deepEqual(parseEmblem(text), {
      "childNodes": [{
        "content": "frank (query-params abc=def) fob=bob (qp-2 dog=fog) dab=tab",
        "escaped": true,
        "type": "mustache"
      }],
      "type": "program"
    });
  });
  QUnit.test('mustache name with dash', function (assert) {
    var text = 'link-to foo=bar';
    assert.deepEqual(parseEmblem(text), {
      "childNodes": [{
        "content": "link-to foo=bar",
        "escaped": true,
        "type": "mustache"
      }],
      "type": "program"
    });
  });
  QUnit.test('mustache name with "/"', function (assert) {
    var text = 'navigation/button-list';
    assert.deepEqual(parseEmblem(text), {
      "childNodes": [{
        "content": "navigation/button-list",
        "escaped": true,
        "type": "mustache"
      }],
      "type": "program"
    });
  });
  /**
  QUnit.test('mustache value that is a bare "/" is not valid', function(assert){
    var text = 'navigation/button-list / omg';
  
    assert.throws( function() { parseEmblem(text); } );
  });
  */

  QUnit.test('mustache with quoted param', function (assert) {
    var text = 'link-to "abc.def"';
    assert.deepEqual(parseEmblem(text), {
      "childNodes": [{
        "content": "link-to \"abc.def\"",
        "escaped": true,
        "type": "mustache"
      }],
      "type": "program"
    });
  });
  QUnit.test('mustache with unquoted param', function (assert) {
    var text = 'link-to dog';
    assert.deepEqual(parseEmblem(text), {
      "childNodes": [{
        "content": "link-to dog",
        "escaped": true,
        "type": "mustache"
      }],
      "type": "program"
    });
  });
  QUnit.test('mustache with multiple params', function (assert) {
    var text = 'link-to "dog.tag" dog';
    assert.deepEqual(parseEmblem(text), {
      "childNodes": [{
        "content": "link-to \"dog.tag\" dog",
        "escaped": true,
        "type": "mustache"
      }],
      "type": "program"
    });
  });
  QUnit.test('mustache with shorthand % syntax', function (assert) {
    var text = 'frank%span';
    assert.deepEqual(parseEmblem(text), {
      "childNodes": [{
        "content": "frank tagName=\"span\"",
        "escaped": true,
        "type": "mustache"
      }],
      "type": "program"
    });
  });
  QUnit.test('mustache with shorthand # syntax', function (assert) {
    var text = 'frank#id-name';
    assert.deepEqual(parseEmblem(text), {
      "childNodes": [{
        "content": "frank elementId=\"id-name\"",
        "escaped": true,
        "type": "mustache"
      }],
      "type": "program"
    });
  });
  QUnit.test('mustache with shorthand . syntax with required space', function (assert) {
    var text = 'frank .class-name';
    assert.deepEqual(parseEmblem(text), {
      "childNodes": [{
        "content": "frank class=\"class-name\"",
        "escaped": true,
        "type": "mustache"
      }],
      "type": "program"
    });
  });
  QUnit.test('mustache with multiple classes', function (assert) {
    var text = 'frank .class-name1.class-name2';
    assert.deepEqual(parseEmblem(text), {
      "childNodes": [{
        "content": "frank class=\"class-name1 class-name2\"",
        "escaped": true,
        "type": "mustache"
      }],
      "type": "program"
    });
  });
  QUnit.test('mustache with multiple shorthands', function (assert) {
    var text = 'frank%span#my-id.class-name';
    assert.deepEqual(parseEmblem(text), {
      "childNodes": [{
        "content": "frank tagName=\"span\" elementId=\"my-id\" class=\"class-name\"",
        "escaped": true,
        "type": "mustache"
      }],
      "type": "program"
    });
  });
  /**
  QUnit.test('mustache cannot start with a dot, a dash or a digit', function(assert){
    assert.throws( function() { parseEmblem('.frank'); } );
    assert.throws( function() { parseEmblem('-frank'); } );
    assert.throws( function() { parseEmblem('9frank'); } );
  });
  */

  QUnit.test("bang modifier", function (assert) {
    var text = 'foo!';
    assert.deepEqual(parseEmblem(text), {
      "childNodes": [{
        "content": "unbound foo",
        "escaped": true,
        "type": "mustache"
      }],
      "type": "program"
    });
  });
  QUnit.test("conditional modifier", function (assert) {
    var text = 'foo?';
    assert.deepEqual(parseEmblem(text), {
      "childNodes": [{
        "content": "if foo",
        "escaped": true,
        "type": "mustache"
      }],
      "type": "program"
    });
  });
  QUnit.test('block params', function (assert) {
    var text = 'frank foo=bar boo=far as |steve|';
    assert.deepEqual(parseEmblem(text), {
      "childNodes": [{
        "content": "frank foo=bar boo=far as |steve|",
        "escaped": true,
        "type": "mustache"
      }],
      "type": "program"
    });
  });
  QUnit.test('multiple block params', function (assert) {
    var text = 'frank foo=bar boo=far as |steve dave|';
    assert.deepEqual(parseEmblem(text), {
      "childNodes": [{
        "content": "frank foo=bar boo=far as |steve dave|",
        "escaped": true,
        "type": "mustache"
      }],
      "type": "program"
    });
  });
});
define("tests/unit/parser-test", ["../../emblem/parser", "../../emblem/preprocessor", "../../emblem/ast-builder", "../support/utils", "../../emblem/utils/void-elements"], function (_parser, _preprocessor, _astBuilder, _utils, _voidElements) {
  "use strict";

  _voidElements = _interopRequireDefault(_voidElements);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  /* global QUnit*/
  QUnit.module("Unit - parse");

  function truncate(text, len) {
    if (!len) {
      len = 40;
    }

    text = text.replace(/\n/g, "\\n");
    var ellipses = text.length > len - 3 ? '...' : '';
    return text.slice(0, len) + ellipses;
  }

  function astTest(name, emblem, callback) {
    QUnit.test(name + ' "' + truncate(emblem) + '"', function (assert) {
      var builder = (0, _astBuilder.generateBuilder)();
      (0, _parser.parse)((0, _preprocessor.processSync)(emblem), {
        builder: builder
      });
      var ast = builder.toAST();
      callback(assert, ast);
    });
  }

  function program(childNodes) {
    return {
      type: 'program',
      childNodes: childNodes || []
    };
  }

  function element(tagName, childNodes, attrStaches, classNameBindings) {
    return {
      type: 'element',
      tagName: tagName,
      isVoid: (0, _voidElements.default)(tagName),
      classNameBindings: classNameBindings || [],
      attrStaches: attrStaches || [],
      inTagText: [],
      childNodes: childNodes || []
    };
  }

  function text(content) {
    return {
      type: 'text',
      content: content
    };
  }

  function attribute(attrName, attrContent) {
    return {
      type: 'attribute',
      name: attrName,
      content: attrContent
    };
  }

  function classNameBinding(name) {
    return {
      type: 'classNameBinding',
      name: name
    };
  }

  astTest('simple element', 'h1 hello', function (assert, ast) {
    assert.deepEqual(ast, program([element('h1', [text('hello')])]));
  });
  astTest('simple void element', 'hr', function (assert, ast) {
    assert.deepEqual(ast, program([element('hr')]));
  });
  astTest('simple text', '| abc def ghi', function (assert, ast) {
    assert.deepEqual(ast, program([text('abc def ghi')]));
  });
  astTest('multiline text puts spaces where newlines are', (0, _utils.w)('| abc def ghi', '  another line'), function (assert, ast) {
    assert.deepEqual(ast, program([text('abc def ghi another line')]));
  });
  astTest('simple element', 'h1 my great element', function (assert, ast) {
    assert.deepEqual(ast, program([element('h1', [text('my great element')])]));
  });
  astTest('simple element with single class name', 'h1.my-class', function (assert, ast) {
    assert.deepEqual(ast, program([element('h1', [], [], [classNameBinding(':my-class')])]));
  });
  astTest('simple element with id', 'h1#my-id', function (assert, ast) {
    assert.deepEqual(ast, program([element('h1', [], [attribute('id', 'my-id')])]));
  });
  astTest('simple element with id and class', 'h1#my-id.my-class', function (assert, ast) {
    assert.deepEqual(ast, program([element('h1', [], [attribute('id', 'my-id')], [classNameBinding(':my-class')])]));
  });
  astTest('element with shorthand attributes', '#my-id.my-class', function (assert, ast) {
    assert.deepEqual(ast, program([element('div', [], [attribute('id', 'my-id')], [classNameBinding(':my-class')])]));
  });
  astTest('special element', '%blink', function (assert, ast) {
    const testElement = element('blink', [], []);
    testElement.isVoid = true;
    assert.deepEqual(ast, program([testElement]));
  });
  astTest('simple nested elements', (0, _utils.w)('ul', '  li'), function (assert, ast) {
    assert.deepEqual(ast, program([element('ul', [element('li')])]));
  });
  astTest('simple nested elements with content', (0, _utils.w)('ul', '  li hello', '  li goodbye'), function (assert, ast) {
    assert.deepEqual(ast, program([element('ul', [element('li', [text('hello')]), element('li', [text('goodbye')])])]));
  });
  astTest('html attributes', 'button.close data-dismiss="modal" x', function (assert, ast) {
    assert.deepEqual(ast, program([element('button', [text('x')], [attribute('data-dismiss', 'modal')], [classNameBinding(':close')])]));
  });
  astTest('comments are stripped', '/ Some comment', function (assert, ast) {
    assert.deepEqual(ast, program());
  });
  astTest('multiline comments are stripped', (0, _utils.w)('/ Some multiline', '  comment'), function (assert, ast) {
    assert.deepEqual(ast, program());
  });
  astTest('simple handlebars expression', 'h1 = name', function (assert, ast) {
    assert.deepEqual(ast, program([element('h1', [{
      type: 'mustache',
      escaped: true,
      content: 'name'
    }])]));
  });
  astTest('nested elements interspersed with content', ['p', '  | blah blah', '  b bold text'].join('\n'), function (assert, ast) {
    assert.deepEqual(ast, program([element('p', [text('blah blah'), element('b', [text('bold text')])])]));
  });
  astTest('action in bracketed attributes', ['p [', '  click="test"', ']'].join('\n'), function (assert, ast) {
    assert.deepEqual(ast, program([element('p', [], [{
      type: 'mustache',
      escaped: true,
      content: 'action "test" on="click"'
    }])]));
  });
  astTest('action in bracketed attributes with dom event', ['p [', '  onclick={ action "test" }', ']'].join('\n'), function (assert, ast) {
    assert.deepEqual(ast, program([element('p', [], [{
      type: 'assignedMustache',
      key: 'onclick',
      content: 'action "test"'
    }])]));
  });
});
define("tests/unit/template-compiler-test", ["../../emblem/template-compiler"], function (_templateCompiler) {
  "use strict";

  /* global QUnit*/
  QUnit.module("template compiler");
  QUnit.test("compiles text node AST", function (assert) {
    var ast = {
      type: 'program',
      childNodes: [{
        type: 'text',
        content: 'hello world'
      }]
    };
    var result = (0, _templateCompiler.compile)(ast);
    assert.equal(result, 'hello world', 'content is output');
  });
  QUnit.test("compiles element node AST", function (assert) {
    var ast = {
      type: 'program',
      childNodes: [{
        type: 'element',
        tagName: 'div',
        attrStaches: [{
          type: 'attribute',
          name: 'data-name',
          content: 'red'
        }]
      }]
    };
    var result = (0, _templateCompiler.compile)(ast);
    assert.equal(result, '<div data-name="red"></div>', 'content is output');
  });
  QUnit.test("compiles block node AST", function (assert) {
    var ast = {
      type: 'program',
      childNodes: [{
        type: 'block',
        content: 'each person in people',
        childNodes: [{
          type: 'element',
          tagName: 'div'
        }]
      }]
    };
    var result = (0, _templateCompiler.compile)(ast);
    assert.equal(result, '{{#each person in people}}<div></div>{{/each}}', 'content is output');
  });
  QUnit.test("compiles mustache node AST", function (assert) {
    var ast = {
      type: 'program',
      childNodes: [{
        type: 'mustache',
        escaped: true,
        content: 'name'
      }]
    };
    var result = (0, _templateCompiler.compile)(ast);
    assert.equal(result, '{{name}}', 'content is output');
  });
  QUnit.test("compiles unescaped mustache node AST", function (assert) {
    var ast = {
      type: 'program',
      childNodes: [{
        type: 'mustache',
        escaped: false,
        content: 'name'
      }]
    };
    var result = (0, _templateCompiler.compile)(ast);
    assert.equal(result, '{{{name}}}', 'content is output');
  });
  QUnit.test("compiles mustaches in attr content AST", function (assert) {
    var ast = {
      type: 'program',
      childNodes: [{
        type: 'element',
        tagName: 'div',
        attrStaches: [{
          type: 'mustache',
          escaped: true,
          content: 'bind-attr foo=baz'
        }, {
          type: 'mustache',
          escaped: true,
          content: 'action "whammo"'
        }]
      }]
    };
    var result = (0, _templateCompiler.compile)(ast);
    assert.equal(result, '<div {{bind-attr foo=baz}} {{action "whammo"}}></div>', 'content is output');
  });
  QUnit.test("compiles block with inverse AST", function (assert) {
    var ast = {
      type: 'program',
      childNodes: [{
        type: 'block',
        content: 'with foo as bar',
        childNodes: [{
          type: 'text',
          content: 'hello there'
        }],
        invertibleNodes: [{
          content: [[{
            type: 'text',
            content: 'not hello there'
          }]],
          name: 'else'
        }]
      }]
    };
    var result = (0, _templateCompiler.compile)(ast);
    assert.equal(result, '{{#with foo as bar}}hello there{{else}}not hello there{{/with}}');
  });
  QUnit.test("compiles boolean attribute", function (assert) {
    var ast = {
      type: 'program',
      childNodes: [{
        type: 'element',
        tagName: 'input',
        attrStaches: [{
          type: 'attribute',
          name: 'disabled' // NO value for content for a true boolean attribute

        }]
      }]
    };
    var result = (0, _templateCompiler.compile)(ast);
    assert.equal(result, '<input disabled></input>');
  });
  QUnit.test("compiles complex classNameBindings to a bind-attr", function (assert) {
    var ast = {
      type: 'program',
      childNodes: [{
        type: 'element',
        tagName: 'div',
        classNameBindings: [{
          type: 'classNameBinding',
          name: ':size'
        }, {
          type: 'classNameBinding',
          name: 'color'
        }, {
          type: 'classNameBinding',
          name: 'isHeavy:oof:whee'
        }]
      }]
    };
    var result = (0, _templateCompiler.compile)(ast);
    assert.equal(result, '<div class="size {{color}} {{if isHeavy \'oof\' \'whee\'}}"></div>');
  });
  QUnit.test("compiles simple classNameBindings to a class attribute", function (assert) {
    var ast = {
      type: 'program',
      childNodes: [{
        type: 'element',
        tagName: 'div',
        classNameBindings: [{
          type: 'classNameBinding',
          name: ':size'
        }, {
          type: 'classNameBinding',
          name: ':color'
        }]
      }]
    };
    var result = (0, _templateCompiler.compile)(ast);
    assert.equal(result, '<div class="size color"></div>');
  });
  QUnit.test("bound attribute values get quoted", function (assert) {
    var ast = {
      type: 'program',
      childNodes: [{
        type: 'element',
        tagName: 'img',
        inTagText: [],
        isVoid: true,
        classNameBindings: [],
        attrStaches: [{
          type: 'assignedMustache',
          key: 'alt',
          content: 'alt_text'
        }],
        childNodes: []
      }]
    };
    var result = (0, _templateCompiler.compile)(ast, {
      legacyAttributeQuoting: true
    });
    assert.equal(result, '<img alt="{{alt_text}}"/>');
  });
});