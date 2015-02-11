/* global QUnit*/
import { parse } from '../../emblem/parser';
import { processSync } from '../../emblem/preprocessor';
import { generateBuilder } from '../../emblem/ast-builder';

QUnit.module("parser#parse");

QUnit.test('parses text into AST', function(assert){
  var text = "abc def ghi";
  var raw = '| ' + text;

  var builder = generateBuilder();
  parse( processSync(raw), {builder:builder});
  var ast = builder.toAST();

  assert.deepEqual(ast, {
    type: 'program',
    childNodes: [{
      type: 'text',
      content: text
    }]
  });
});

QUnit.test('parses multiline text into AST', function(assert){
  var emblem = ['| abc def ghi',
                '  another line'].join('\n');

  var builder = generateBuilder();
  parse( processSync(emblem), {builder:builder});
  var ast = builder.toAST();

  assert.deepEqual(ast, {
    type: 'program',
    childNodes: [{
      type: 'text',
      content: 'abc def ghi\nanother line'
    }]
  });
});

QUnit.test('parses simple element', function(assert){
  var emblem = 'h1 my great element';

  var builder = generateBuilder();
  parse( processSync(emblem), {builder:builder});
  var ast = builder.toAST();

  assert.deepEqual(ast, {
    type: 'program',
    childNodes: [{
      type: 'element',
      tagName: 'h1',
      attrStaches: [],
      childNodes: [{
        type: 'text',
        content: 'my great element'
      }]
    }]
  });
});

QUnit.test('parses simple element with single class name', function(assert){
  var emblem = 'h1.my-class';

  var builder = generateBuilder();
  parse( processSync(emblem), {builder:builder});
  var ast = builder.toAST();

  assert.deepEqual(ast, {
    type: 'program',
    childNodes: [{
      type: 'element',
      tagName: 'h1',
      attrStaches: [{
        type: 'attribute',
        name: 'class',
        content: 'my-class'
      }],
      childNodes: []
    }]
  });
});
