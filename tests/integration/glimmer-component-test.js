/*global QUnit*/

import { w } from '../support/utils';
import { compilesTo } from '../support/integration-assertions';

QUnit.module("glimmer-components");

QUnit.test("basic syntax", function(){
  var emblem = w(
    "% my-component @value=foo data-hint='not-my-component%%::'"
  );
  compilesTo(emblem,
    '<my-component @value={{foo}} data-hint=\"not-my-component%%::\"></my-component>');
});

QUnit.test("basic syntax with legacy quoting", function(){
  var emblem = w(
    "% my-component value=foo data-hint='not-my-component%%::'"
  );
  compilesTo(emblem,
    '<my-component value=\"{{foo}}\" data-hint=\"not-my-component%%::\"></my-component>', null, {
      legacyAttributeQuoting: true
    });
});

QUnit.test("boolean attribute passed in as component input", function() {
  var emblem = w(
    "% my-component @multiselect=false"
  );
  compilesTo(emblem,
    '<my-component @multiselect={{false}}></my-component>');
});

QUnit.test("names with :", function(){
  var emblem = w(
    "% inputs:my-component @value=foo"
  );
  compilesTo(emblem,
    '<inputs:my-component @value={{foo}}></inputs:my-component>');
});

// @TODO
// QUnit.test("names with / turn into :")

QUnit.test("Blocks", function() {
  var emblem = w(
    "% my-component @value=foo",
    "  |Hi!"
  );
  compilesTo(emblem,
    '<my-component @value={{foo}}>Hi!</my-component>');
});

QUnit.test("Block params", function() {
  var emblem = w(
    "% my-component @value=foo as |comp1 comp2|",
    "  = comp.name"
  );
  compilesTo(emblem,
    '<my-component @value={{foo}} as |comp1 comp2|>{{comp.name}}</my-component>');
});

// @TODO: What should the result of this be?
// QUnit.test("Block params with else");

QUnit.test('brackets with string', function(){
  var emblem = w('',
                 '%my-component [',
                 '  @foo=bar',
                 '  @baz=\'food\' ]');
  compilesTo(
    emblem, '<my-component @foo={{bar}} @baz=\"food\"></my-component>');
});

QUnit.test('brackets with dedent end', function(){
  var emblem = w('',
                 '%my-component [',
                 '  @foo=bar',
                 '  @baz=\'food\'',
                 ']');
  compilesTo(
    emblem, '<my-component @foo={{bar}} @baz=\"food\"></my-component>');
});

// Invalid
// QUnit.test('brackets with positional params')

QUnit.test('bracketed nested block', function(){
  var emblem = w('',
                 '%my-component [',
                 '  ',
                 '  @something="false" ]',
                 '  p Bracketed helper attrs!');
  compilesTo(
    emblem, '<my-component @something=\"false\"><p>Bracketed helper attrs!</p></my-component>');
});

QUnit.test('bracketed nested with actions', function(){
  var emblem = w('',
                 '%my-component [',
                 '  onclick={ action \'doSometing\' foo bar }',
                 '  change=\'otherAction\'',
                 '  @something="false" ]',
                 '  p Bracketed helper attrs!');
  compilesTo(
    emblem, '<my-component onclick={{action \'doSometing\' foo bar}} {{action \"otherAction\" on=\"change\"}} @something=\"false\"><p>Bracketed helper attrs!</p></my-component>');
});

// @TODO: should these support mustache-like syntax?  (i.e. %my-component value=(foo) )
QUnit.test("Sub-expressions", function() {
  var emblem = w(
    "% my-component @value={ (or (eq foo 'bar') (eq foo 'baz')) }"
  );
  compilesTo(emblem,
    '<my-component @value={{(or (eq foo \'bar\') (eq foo \'baz\'))}}></my-component>');
});

QUnit.test('recursive nesting part 2', function(){
  var emblem = w('',
                 '%my-comp-1',
                 '  %my-comp-2',
                 '    p Hello');
  compilesTo(emblem, '<my-comp-1><my-comp-2><p>Hello</p></my-comp-2></my-comp-1>');
});

QUnit.test('named block support', function() {
  var emblem = w(
    '% x-modal',
    '  % @header as |@title|',
    '    |Header #{title}',
    '  % @body',
    '    |Body',
    '  % @footer',
    '    |Footer'
  )

  compilesTo(emblem, '<x-modal><@header as |@title|>Header {{title}}</@header><@body>Body</@body><@footer>Footer</@footer></x-modal>');
});
