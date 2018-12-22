/*global QUnit*/

import { w } from '../support/utils';
import { compilesTo } from '../support/integration-assertions';

QUnit.module("glimmer-components");

QUnit.test("basic syntax", function(assert) {
  var emblem = w(
    "%MyComponent @value=foo data-hint='not-my-component%%::'"
  );
  assert.compilesTo(emblem,
    '<MyComponent @value={{foo}} data-hint=\"not-my-component%%::\"></MyComponent>');
});

QUnit.test("basic syntax with legacy quoting", function(assert) {
  var emblem = w(
    "%MyComponent value=foo data-hint='not-my-component%%::'"
  );
  assert.compilesTo(emblem,
    '<MyComponent value=\"{{foo}}\" data-hint=\"not-my-component%%::\"></MyComponent>', null, {
      legacyAttributeQuoting: true
    });
});

QUnit.test("boolean attribute passed in as component input", function(assert) {
  var emblem = w(
    "%MyComponent @multiselect=false"
  );
  assert.compilesTo(emblem,
    '<MyComponent @multiselect={{false}}></MyComponent>');
});

QUnit.test("...attributes", function(assert) {
  var emblem = w(
    "%MyComponent ...attributes type=@post.type"
  );
  assert.compilesTo(emblem,
    '<MyComponent ...attributes type={{@post.type}}></MyComponent>');
});

QUnit.test("names with :", function(assert) {
  var emblem = w(
    "% inputs:MyComponent @value=foo"
  );
  assert.compilesTo(emblem,
    '<inputs:MyComponent @value={{foo}}></inputs:MyComponent>');
});

// @TODO
// QUnit.test("names with / turn into :assert" )

QUnit.test("Blocks", function(assert) {
   var emblem = w(
    "%MyComponent @value=foo",
    "  |Hi!"
  );
  assert.compilesTo(emblem,
    '<MyComponent @value={{foo}}>Hi!</MyComponent>');
});

QUnit.test("Block params", function(assert) {
   var emblem = w(
    "%MyComponent @value=foo as |comp1 comp2|",
    "  = comp.name"
  );
  assert.compilesTo(emblem,
    '<MyComponent @value={{foo}} as |comp1 comp2|>{{comp.name}}</MyComponent>');
});

// @TODO: What should the result of this be?
// QUnit.test("Block params with else"assert) ;

QUnit.test('brackets with string', function(assert) {
  var emblem = w('',
                 '%MyComponent [',
                 '  @foo=bar',
                 '  @baz=\'food\' ]');
  assert.compilesTo(
    emblem, '<MyComponent @foo={{bar}} @baz=\"food\"></MyComponent>');
});

QUnit.test('brackets with dedent end', function(assert) {
  var emblem = w('',
                 '%MyComponent [',
                 '  @foo=bar',
                 '  @baz=\'food\'',
                 ']');
  assert.compilesTo(
    emblem, '<MyComponent @foo={{bar}} @baz=\"food\"></MyComponent>');
});

// Invalid
// QUnit.test('brackets with positional params'assert)

QUnit.test('bracketed nested block', function(assert) {
  var emblem = w('',
                 '%MyComponent [',
                 '  ',
                 '  @something="false" ]',
                 '  p Bracketed helper attrs!');
  assert.compilesTo(
    emblem, '<MyComponent @something=\"false\"><p>Bracketed helper attrs!</p></MyComponent>');
});

QUnit.test('bracketed nested with actions', function(assert) {
  var emblem = w('',
                 '%MyComponent [',
                 '  onclick={ action \'doSometing\' foo bar }',
                 '  change=\'otherAction\'',
                 '  @something="false" ]',
                 '  p Bracketed helper attrs!');
  assert.compilesTo(
    emblem, '<MyComponent onclick={{action \'doSometing\' foo bar}} {{action \"otherAction\" on=\"change\"}} @something=\"false\"><p>Bracketed helper attrs!</p></MyComponent>');
});

// @TODO: should these support mustache-like syntax?  (i.e. %MyComponent value=(foo) )
QUnit.test("Sub-expressions", function(assert) {
   var emblem = w(
    "%MyComponent @value={ (or (eq foo 'bar') (eq foo 'baz')) }"
  );
  assert.compilesTo(emblem,
    '<MyComponent @value={{(or (eq foo \'bar\') (eq foo \'baz\'))}}></MyComponent>');
});

QUnit.test('recursive nesting part 2', function(assert) {
  var emblem = w('',
                 '%my-comp-1',
                 '  %my-comp-2',
                 '    p Hello');
  assert.compilesTo(emblem, '<my-comp-1><my-comp-2><p>Hello</p></my-comp-2></my-comp-1>');
});

QUnit.test('named block support', function(assert) {
   var emblem = w(
    '% x-modal',
    '  % @header as |@title|',
    '    |Header #{title}',
    '  % @body',
    '    |Body',
    '  % @footer',
    '    |Footer'
  )

  assert.compilesTo(emblem, '<x-modal><@header as |@title|>Header {{title}}</@header><@body>Body</@body><@footer>Footer</@footer></x-modal>');
});

test('module namespaces', function() {
  var emblem = w(
    '% my-addon::foo'
  )

  compilesTo(emblem, '<my-addon::foo></my-addon::foo>');
});
