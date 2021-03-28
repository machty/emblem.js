import { module, test } from 'qunit';
import { w } from 'tests/support/utils';

module('ember: attribute bindings', function (hooks) {
  module('subexpressions', function () {
    test("arg-less helper 1", function (assert) {
      const emblem = 'p {{echo (hello)}}';

      assert.compilesTo(emblem, '<p>{{echo (hello)}}</p>');
    });

    test("arg-less helper 2", function (assert) {
      const emblem = '= echo (hello)';

      assert.compilesTo(emblem, '{{echo (hello)}}');
    });

    test("helper w args 1", function (assert) {
      const emblem = 'p {{echo (equal 1 1)}}';

      assert.compilesTo(emblem, '<p>{{echo (equal 1 1)}}</p>');
    });

    test("helper w args 2", function (assert) {
      const emblem = '= echo (equal 1 1)';

      assert.compilesTo(emblem, '{{echo (equal 1 1)}}');
    });

    test("supports much nesting 1", function (assert) {
      const emblem = 'p {{echo (equal (equal 1 1) true)}}';

      assert.compilesTo(emblem, '<p>{{echo (equal (equal 1 1) true)}}</p>');
    });

    test("supports much nesting 2", function (assert) {
      const emblem = '= echo (equal (equal 1 1) true)';

      assert.compilesTo(emblem, '{{echo (equal (equal 1 1) true)}}');
    });

    test("with hashes 1", function (assert) {
      const emblem = 'p {{echo (equal (equal 1 1) true fun="yes")}}';

      assert.compilesTo(emblem, '<p>{{echo (equal (equal 1 1) true fun="yes")}}</p>');
    });

    test("with hashes 2", function (assert) {
      const emblem = '= echo (equal (equal 1 1) true fun="yes")';

      assert.compilesTo(emblem, '{{echo (equal (equal 1 1) true fun="yes")}}');
    });

    test("with multiple", function (assert) {
      const emblem = '= if (and (or true true) true)';

      assert.compilesTo(emblem, '{{if (and (or true true) true)}}');
    });

    test("with multiple p2", function (assert) {
      const emblem = '= if (and (or true true) (or true true))';

      assert.compilesTo(emblem, '{{if (and (or true true) (or true true))}}');
    });

    test("with multiple (mixed) p3", function (assert) {
      const emblem = '= yield (hash title=(component "panel-title") body=(component "panel-content"))'

      assert.compilesTo(emblem, '{{yield (hash title=(component \"panel-title\") body=(component \"panel-content\"))}}');
    });

    test("as hashes 1", function (assert) {
      const emblem = 'p {{echofun fun=(equal 1 1)}}';

      assert.compilesTo(emblem, '<p>{{echofun fun=(equal 1 1)}}</p>');
    });

    test("as hashes 2", function (assert) {
      const emblem = '= echofun fun=(equal 1 1)';

      assert.compilesTo(emblem, '{{echofun fun=(equal 1 1)}}');
    });

    test("complex expression 1", function (assert) {
      const emblem = 'p {{echofun true (hello how="are" you=false) 1 not=true fun=(equal "ECHO hello" (echo (hello))) win="yes"}}';

      assert.compilesTo(emblem, '<p>{{echofun true (hello how="are" you=false) 1 not=true fun=(equal "ECHO hello" (echo (hello))) win="yes"}}</p>');
    });

    test("complex expression 2", function (assert) {
      const emblem = '= echofun true (hello how="are" you=false) 1 not=true fun=(equal "ECHO hello" (echo (hello))) win="yes"';
      const expected = '{{echofun true (hello how="are" you=false) 1 not=true fun=(equal "ECHO hello" (echo (hello))) win="yes"}}';

      assert.compilesTo(emblem, expected);
    });
  });

  module('Ember deprecated functions', function() {
    test("exclamation modifier (ember)", function (assert) {
      const emblem = 'p class=foo!';

      assert.compilesTo(emblem, '<p class="{{unbound foo}}"></p>');
    });

    test("simple bang helper defaults to `unbound` invocation", function (assert) {
      const emblem = w("foo!");

      assert.compilesTo(emblem, '{{unbound foo}}');
    });

    test("bang helper defaults to `unbound` invocation", function (assert) {
      const emblem = w(
        "foo! Yar",
        "= foo!"
      );

      assert.compilesTo(emblem, '{{unbound foo Yar}}{{unbound foo}}');
    });

    test("bang helper works with blocks", function (assert) {
      const emblem = w(
        "hey! you suck",
        "  = foo!"
      );

      assert.compilesTo(emblem, '{{#unbound hey you suck}}{{unbound foo}}{{/unbound}}');
    });

    test('mustache in attribute', function (assert) {
      const emblem = 'img src="{{unbound post.showLogoUrl}}" onerror="this.src=\'{{unbound orgSettings.onErrorBlankLogoImage}}\'"';

      assert.compilesTo(emblem, '<img src="{{unbound post.showLogoUrl}}" onerror="this.src=\'{{unbound orgSettings.onErrorBlankLogoImage}}\'"/>');
    });

    test('mustache in attribute with exclamation point', function (assert) {
      const emblem = "a href=postLink! target='_blank'";

      assert.compilesTo(emblem, '<a href="{{unbound postLink}}" target="_blank"></a>');
    });

  });
});
