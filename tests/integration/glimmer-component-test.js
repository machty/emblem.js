/*global QUnit*/

import { w } from '../support/utils';
import { compilesTo } from '../support/integration-assertions';

QUnit.module("glimmer-components");

QUnit.test("basic syntax", function(assert) {
  var emblem = w(
    "% my-component @value=foo data-hint='not-my-component%%::'"
  );
  assert.compilesTo(emblem,
    '<my-component @value={{foo}} data-hint=\"not-my-component%%::\"></my-component>');
});

QUnit.test("basic syntax with legacy quoting", function(assert) {
  var emblem = w(
    "% my-component value=foo data-hint='not-my-component%%::'"
  );
  assert.compilesTo(emblem,
    '<my-component value=\"{{foo}}\" data-hint=\"not-my-component%%::\"></my-component>', null, {
      legacyAttributeQuoting: true
    });
});

QUnit.test("boolean attribute passed in as component input", function(assert) {
  var emblem = w(
    "% my-component @multiselect=false"
  );
  assert.compilesTo(emblem,
    '<my-component @multiselect={{false}}></my-component>');
});

QUnit.test("names with :", function(assert) {
  var emblem = w(
    "% inputs:my-component @value=foo"
  );
  assert.compilesTo(emblem,
    '<inputs:my-component @value={{foo}}></inputs:my-component>');
});

// @TODO
// QUnit.test("names with / turn into :assert" )

QUnit.test("Blocks", function(assert) {
   var emblem = w(
    "% my-component @value=foo",
    "  |Hi!"
  );
  assert.compilesTo(emblem,
    '<my-component @value={{foo}}>Hi!</my-component>');
});

QUnit.test("Block params", function(assert) {
   var emblem = w(
    "% my-component @value=foo as |comp1 comp2|",
    "  = comp.name"
  );
  assert.compilesTo(emblem,
    '<my-component @value={{foo}} as |comp1 comp2|>{{comp.name}}</my-component>');
});

// @TODO: What should the result of this be?
// QUnit.test("Block params with else"assert) ;

QUnit.test('brackets with string', function(assert) {
  var emblem = w('',
                 '%my-component [',
                 '  @foo=bar',
                 '  @baz=\'food\' ]');
  assert.compilesTo(
    emblem, '<my-component @foo={{bar}} @baz=\"food\"></my-component>');
});

QUnit.test('brackets with dedent end', function(assert) {
  var emblem = w('',
                 '%my-component [',
                 '  @foo=bar',
                 '  @baz=\'food\'',
                 ']');
  assert.compilesTo(
    emblem, '<my-component @foo={{bar}} @baz=\"food\"></my-component>');
});

// Invalid
// QUnit.test('brackets with positional params'assert)

QUnit.test('bracketed nested block', function(assert) {
  var emblem = w('',
                 '%my-component [',
                 '  ',
                 '  @something="false" ]',
                 '  p Bracketed helper attrs!');
  assert.compilesTo(
    emblem, '<my-component @something=\"false\"><p>Bracketed helper attrs!</p></my-component>');
});

QUnit.test('bracketed nested with actions', function(assert) {
  var emblem = w('',
                 '%my-component [',
                 '  onclick={ action \'doSometing\' foo bar }',
                 '  change=\'otherAction\'',
                 '  @something="false" ]',
                 '  p Bracketed helper attrs!');
  assert.compilesTo(
    emblem, '<my-component onclick={{action \'doSometing\' foo bar}} {{action \"otherAction\" on=\"change\"}} @something=\"false\"><p>Bracketed helper attrs!</p></my-component>');
});

// @TODO: should these support mustache-like syntax?  (i.e. %my-component value=(foo) )
QUnit.test("Sub-expressions", function(assert) {
   var emblem = w(
    "% my-component @value={ (or (eq foo 'bar') (eq foo 'baz')) }"
  );
  assert.compilesTo(emblem,
    '<my-component @value={{(or (eq foo \'bar\') (eq foo \'baz\'))}}></my-component>');
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
