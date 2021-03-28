import { module, test } from 'qunit';
import { w } from 'tests/support/utils';

module('basic syntax: tags', function (hooks) {
  test('basic syntax', function(assert) {
    assert.compilesTo('h1 Welcome to Emblem', '<h1>Welcome to Emblem</h1>');
  });

  test("element only", function (assert) {
    assert.compilesTo("p", "<p></p>");
  });

  test("with text", function (assert) {
    assert.compilesTo("p Hello", "<p>Hello</p>");
  });

  test("with more complex text", function (assert) {
    assert.compilesTo(
      "p Hello, how's it going with you today?",
      "<p>Hello, how's it going with you today?</p>"
    );
  });

  test("with inline html", function (assert) {
    assert.compilesTo(
      "p Hello, how are you <strong>man</strong>",
      "<p>Hello, how are you <strong>man</strong></p>"
    );
  });

  test("with trailing space", function (assert) {
    assert.compilesTo("p Hello   ", "<p>Hello   </p>");
  });

  test("can start with angle bracket html", function (assert) {
    const emblem = "<span>Hello</span>";

    assert.compilesTo(emblem, "<span>Hello</span>");
  });

  module('multiple lines', function() {
    test("two lines", function (assert) {
      const emblem = w(
        "p This is",
        "  pretty cool."
      );

      assert.compilesTo(emblem, "<p>This is pretty cool.</p>");
    });

    test("three lines", function (assert) {
      const emblem = w(
        "p This is",
        "  pretty damn",
        "  cool."
      );

      assert.compilesTo(emblem, "<p>This is pretty damn cool.</p>");
    });

    test("three lines w/ embedded html", function (assert) {
      const emblem = w(
        "p This is",
        "  pretty <span>damn</span>",
        "  cool."
      );

      assert.compilesTo(emblem, "<p>This is pretty <span>damn</span> cool.</p>");
    });

    test("can start with angle bracket html and go to multiple lines", function (assert) {
      const emblem = w(
        "<span>Hello dude,",
        "      what's up?</span>"
      );

      assert.compilesTo(emblem, "<span>Hello dude, what's up?</span>");
    });
  });

  module('self-closing html tags', function() {
    test("br", function (assert) {
      const emblem = "br";

      assert.compilesTo(emblem, '<br/>');
    });

    test("hr", function (assert) {
      const emblem = "hr";

      assert.compilesTo(emblem, '<hr/>');
    });

    test("br paragraph example", function (assert) {
      const emblem = "p\n  | LOL!\n  br\n  | BORF!";

      assert.compilesTo(emblem, '<p>LOL!<br/>BORF!</p>');
    });

    test("input", function (assert) {
      const emblem = "input type=\"text\"";

      assert.compilesTo(emblem, '<input type="text"/>');
    });

    test("nested content under self-closing tag should fail", function (assert) {
      const emblem = "hr\n | here is text";

      assert.compilerThrows(emblem);
    });
  });

  module('% helper', function() {
    test("basic", function (assert) {
      const emblem = "%borf";

      assert.compilesTo(emblem, '<borf/>');
    });

    test("nested", function (assert) {
      const emblem = "%borf\n    %sporf Hello";

      assert.compilesTo(emblem, '<borf><sporf>Hello</sporf></borf>');
    });

    test("capitalized", function (assert) {
      const emblem = "%Alex alex\n%Alex\n  %Woot";

      assert.compilesTo(emblem, '<Alex>alex</Alex><Alex><Woot/></Alex>');
    });

    test("funky chars", function (assert) {
      const emblem = "%borf:narf\n%borf:narf Hello, {{foo}}.\n%alex = foo";

      assert.compilesTo(emblem,
        '<borf:narf/><borf:narf>Hello, {{foo}}.</borf:narf><alex>{{foo}}</alex>');
    });
  });
});
