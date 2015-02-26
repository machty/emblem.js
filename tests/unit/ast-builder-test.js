/* global QUnit*/
import { generateBuilder } from '../../emblem/ast-builder';

QUnit.module("Unit - Builder#toAST");

QUnit.test('empty builder', function(assert){
  var builder = generateBuilder();

  var ast = builder.toAST();

  assert.deepEqual(ast, {
    type: 'program',
    childNodes: []
  });
});

QUnit.test('text node', function(assert){
  var builder = generateBuilder();
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

QUnit.test('element node', function(assert){
  var builder = generateBuilder();
  builder.element('h1');
  var ast = builder.toAST();

  assert.deepEqual(ast, {
    type: 'program',
    childNodes: [{
      type: 'element',
      tagName: 'h1',
      isVoid: false,
      classNameBindings: [],
      attrStaches: [],
      childNodes: []
    }]
  });
});

QUnit.test('void element node', function(assert){
  var builder = generateBuilder();
  builder.element('hr');
  var ast = builder.toAST();

  assert.deepEqual(ast, {
    type: 'program',
    childNodes: [{
      type: 'element',
      tagName: 'hr',
      isVoid: true,
      classNameBindings: [],
      attrStaches: [],
      childNodes: []
    }]
  });
});

QUnit.test('attribute node', function(assert){
  var builder = generateBuilder();

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

QUnit.test('nested element nodes', function(assert){
  var builder = generateBuilder();

  var h1 = builder.element('h1');
  builder.enter(h1);
  builder.text('hello');

  var ast = builder.toAST();

  assert.deepEqual(ast, {
    type: 'program',
    childNodes: [{
      type: 'element',
      tagName: 'h1',
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

QUnit.test('nested element nodes enter and exit', function(assert){
  var builder = generateBuilder();

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
