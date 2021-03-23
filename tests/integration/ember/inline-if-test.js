import { module, test } from 'qunit';
import { w } from 'tests/support/utils';

module('ember: inline if', function (hooks) {
  test('example 1', function(assert) {
    const emblem = "div value={ if isTrue 'one' activeItem }";

    assert.compilesTo(emblem, "<div value={{if isTrue 'one' activeItem}}></div>");
  });

  test('example 2', function(assert) {
    const emblem = "div class=condition:whenTrue:whenFalse";

    assert.compilesTo(emblem, "<div class={{if condition 'whenTrue' 'whenFalse'}}></div>");
  });

  test('example 3', function(assert) {
    const emblem = ".foo class={ isHovering condition1:whenTrue:whenFalse condition2:whenTrue:whenFalse }";

    assert.compilesTo(emblem, `<div class="foo {{isHovering}} {{if condition1 'whenTrue' 'whenFalse'}} {{if condition2 'whenTrue' 'whenFalse'}}"></div>`);
  });

  test("with attribute and bound values", function (assert) {
    const emblem = 'div style={ if isActive foo bar }';
    assert.compilesTo(emblem, '<div style={{if isActive foo bar}}></div>');
  });

  test("with attribute and bound values and legacy quoting", function (assert) {
    const emblem = 'div style={ if isActive foo bar }';
    assert.compilesTo(emblem, '<div style=\"{{if isActive foo bar}}\"></div>', null, {
      legacyAttributeQuoting: true
    });
  });

  test("with attribute", function (assert) {
    const emblem = 'a href={ if isActive \'http://google.com\' \'http://bing.com\' }';
    assert.compilesTo(emblem, '<a href={{if isActive \'http://google.com\' \'http://bing.com\'}}></a>');
  });

  test("with attribute and legacy quoting", function (assert) {
    const emblem = 'a href={ if isActive \'http://google.com\' \'http://bing.com\' }';
    assert.compilesTo(emblem, '<a href=\"{{if isActive \'http://google.com\' \'http://bing.com\'}}\"></a>', null, {
      legacyAttributeQuoting: true
    });
  });

  test("with attribute and bound values", function (assert) {
    const emblem = 'a href={ if isActive google bing }';
    assert.compilesTo(emblem, '<a href={{if isActive google bing}}></a>');
  });

  test("unbound attributes", function (assert) {
    const emblem = 'div class={ if isActive \'foo\' \'bar\' }';
    assert.compilesTo(emblem, '<div class={{if isActive \'foo\' \'bar\'}}></div>');
  });

  test("bound attributes", function (assert) {
    const emblem = 'div class={ if isActive foo bar }';
    assert.compilesTo(emblem, '<div class={{if isActive foo bar}}></div>');
  });

  test("mixed attributes", function (assert) {
    const emblem = 'div class={ if isActive \'foo\' bar }';
    assert.compilesTo(emblem, '<div class={{if isActive \'foo\' bar}}></div>');
  });

  test("unbound attributes with full quote", function (assert) {
    const emblem = 'div class={ if isActive \"foo\" bar }';
    assert.compilesTo(emblem, '<div class={{if isActive \"foo\" bar}}></div>');
  });

  test("one unbound option", function (assert) {
    const emblem = 'div class={ if isActive \"foo\" }';
    assert.compilesTo(emblem, '<div class={{if isActive \"foo\"}}></div>');
  });

  test("one bound option", function (assert) {
    const emblem = 'div class={ if isActive foo }';
    assert.compilesTo(emblem, '<div class={{if isActive foo}}></div>');
  });

  test('with unless', function (assert) {
    assert.compilesTo("div class={ unless isActive 'bar' }", '<div class={{unless isActive \'bar\'}}></div>')
  });

  test("within a string", function (assert) {
    const emblem = 'div style="{{ if isActive \"15\" \"25\" }}px"';
    assert.compilesTo(emblem, '<div style=\"{{if isActive \\"15\\" \\"25\\"}}px\"></div>');
  });

  test("with dot params", function (assert) {
    const emblem = w(
      "li class={ if content.length 'just-one' }",
      "  |Thing"
    );
    assert.compilesTo(emblem, "<li class={{if content.length 'just-one'}}>Thing</li>");
  });

  test("mixed with subexpressions", function (assert) {
    const emblem = w(
      "li class={ if (has-one content.length) 'just-one' }",
      "  |Thing"
    );
    assert.compilesTo(emblem, "<li class={{if (has-one content.length) 'just-one'}}>Thing</li>");
  });
});
