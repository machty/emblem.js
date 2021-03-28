import { module, test } from 'qunit';
import { w } from 'tests/support/utils';

module('glimmer: basic syntax', function (hooks) {
  // @TODO
  // QUnit.test("names with / turn into :assert" )

  // @TODO: What should the result of this be?
  // QUnit.test("Block params with else"assert) ;

  // @TODO: should these support mustache-like syntax?  (i.e. %MyComponent value=(foo) )

  test('named argument syntax', function (assert) {
    assert.compilesTo('= @bar', '{{@bar}}');
  });

  test('basic syntax for shorthands 1', function (assert) {
    assert.compilesTo("%my-comp#hello .woot @value=foo data-hint=\"not-my-component%%::\"", '<my-comp id="hello" @value={{foo}} data-hint=\"not-my-component%%::\" class="woot"/>');
    assert.compilesTo("%MyComp.woot #hello @value=foo", '<MyComp id="hello" @value={{foo}} class="woot"/>');
    assert.compilesTo("%my-comp#id.woot #hello @value=foo", '<my-comp id="hello" @value={{foo}} class="woot"/>');
    assert.compilesTo("%my-comp .woot#hello @value=foo", '<my-comp id="hello" @value={{foo}} class="woot"/>');
    assert.compilesTo("%my-comp .woot.loot#hello @value=foo", '<my-comp id="hello" @value={{foo}} class="woot loot"/>');
  });

  test('basic syntax 1', function (assert) {
    const emblem = w(
      "%MyComponent @value=foo data-hint='not-my-component%%::'"
    );

    assert.compilesTo(emblem,
      '<MyComponent @value={{foo}} data-hint=\"not-my-component%%::\"/>');
  });

  test('basic syntax 2', function (assert) {
    const emblem = "% my-component @value=fooValue data-hint='My special component'";

    assert.compilesTo(emblem, '<my-component @value={{fooValue}} data-hint="My special component"/>');
  });

  test('basic syntax 3', function (assert) {
    const emblem = "% modal-popup @onClose={ action 'modalClosed' }";

    assert.compilesTo(emblem, "<modal-popup @onClose={{action 'modalClosed'}}/>");
  });

  test("basic syntax with legacy quoting", function (assert) {
    const emblem = w(
      "%MyComponent value=foo data-hint='not-my-component%%::'"
    );

    assert.compilesTo(emblem,
      '<MyComponent value=\"{{foo}}\" data-hint=\"not-my-component%%::\"/>', null, {
        legacyAttributeQuoting: true
      });
  });

  test("boolean attribute passed in as component input", function (assert) {
    const emblem = w(
      "%MyComponent @multiselect=false"
    );

    assert.compilesTo(emblem,
      '<MyComponent @multiselect={{false}}/>');
  });

  test("...attributes", function (assert) {
    const emblem = w(
      "%MyComponent ...attributes type=@post.type"
    );

    assert.compilesTo(emblem,
      '<MyComponent ...attributes type={{@post.type}}/>');
  });

  test("Sub-expressions", function (assert) {
    const emblem = w(
      "%MyComponent @value={ (or (eq foo 'bar') (eq foo 'baz')) }"
    );

    assert.compilesTo(emblem,
      '<MyComponent @value={{(or (eq foo \'bar\') (eq foo \'baz\'))}}/>');
  });

  test("nested glimmer components with colon", function (assert) {
    const emblem = w(
      '%my-component: %my-other-component: p Hello',
    );

    assert.compilesTo(emblem, '<my-component><my-other-component><p>Hello</p></my-other-component></my-component>');
  });

  test("nested glimmer components with colon - case 2", function (assert) {
    const emblem = w(
      '%my-component @value=fooValue data-hint="My special component" ...attributes: % my-other-component @onClose={ action "modalClosed" }: p Hello',
    );

    assert.compilesTo(emblem, '<my-component @value={{fooValue}} data-hint="My special component" ...attributes><my-other-component @onClose={{action "modalClosed"}}><p>Hello</p></my-other-component></my-component>');
  });

  test("nested glimmer components with colon - case 3", function (assert) {
    const emblem = w(
      '% my-component [',
      '  value=this.someProp.[0]',
      '  ...attributes',
      ']: %MyOtherComponent value=this.someProp2 ...attributes: p Hello',
    );

    assert.compilesTo(emblem, '<my-component value={{this.someProp.[0]}} ...attributes><MyOtherComponent value={{this.someProp2}} ...attributes><p>Hello</p></MyOtherComponent></my-component>');
  });
});
