/* global QUnit*/
import { parse } from '../../emblem/parser';
import { processSync } from '../../emblem/preprocessor';
import { generateBuilder } from '../../emblem/ast-builder';

QUnit.module("Unit - parse");

var expectations = [
  {
    name: 'simple text',
    emblem: '| abc def ghi',
    ast: makeAST({
      type: 'text', content: 'abc def ghi'
    })
  }, {
    name: 'multiline text',
    emblem: ['| abc def ghi',
             '  another line'].join('\n'),
    ast: makeAST({
      type: 'text', content: 'abc def ghi\nanother line'
    })
  }, {
    name: 'simple element',
    emblem: 'h1 my great element',
    ast: makeAST({
      type: 'element',
      tagName: 'h1',
      attrStaches: [],
      childNodes: [{
        type: 'text',
        content: 'my great element'
      }]
    })
  }, {
    name: 'simple element with single class name',
    emblem: 'h1.my-class',
    ast: makeAST({
      type: 'element',
      tagName: 'h1',
      attrStaches: [{
        type: 'attribute',
        name: 'class',
        content: 'my-class'
      }],
      childNodes: []
    })
  }, {
    name: 'simple element with id',
    emblem: 'h1#my-id',
    ast: makeAST({
      type: 'element',
      tagName: 'h1',
      attrStaches: [{
        type: 'attribute',
        name: 'id',
        content: 'my-id'
      }],
      childNodes: []
    })
  }, {
    name: 'simple element with id and class',
    emblem: 'h1#my-id.my-class',
    ast: makeAST({
      type: 'element',
      tagName: 'h1',
      attrStaches: [{
        type: 'attribute',
        name: 'id',
        content: 'my-id'
      }, {
        type: 'attribute',
        name: 'class',
        content: 'my-class'
      }],
      childNodes: []
    })
  }, {
    name: 'element with shorthand attribute syntax',
    emblem: '#my-id.my-class',
    ast: makeAST({
      type: 'element',
      tagName: 'div',
      attrStaches: [{
        type: 'attribute',
        name: 'id',
        content: 'my-id'
      }, {
        type: 'attribute',
        name: 'class',
        content: 'my-class'
      }],
      childNodes: []
    })
  }, {
    name: 'special element name',
    emblem: '%blink',
    ast: makeAST({
      type: 'element',
      tagName: 'blink',
      attrStaches: [],
      childNodes: []
    })
  }, {
    name: 'simple nested elements',
    emblem: ['ul',
             '  li'].join('\n'),
    ast: makeAST({
      type: 'element',
      tagName: 'ul',
      attrStaches: [],
      childNodes: [{
        type: 'element',
        tagName: 'li',
        attrStaches: [],
        childNodes: []
      }]
    })
  }, {
    name: 'nested elements with content',
    emblem: ['ul',
             '  li hello',
             '  li goodbye'].join('\n'),
    ast: makeAST({
      type: 'element',
      tagName: 'ul',
      attrStaches: [],
      childNodes: [{
        type: 'element',
        tagName: 'li',
        attrStaches: [],
        childNodes: [{
          type: 'text',
          content: 'hello'
        }]
      }, {
        type: 'element',
        tagName: 'li',
        attrStaches: [],
        childNodes: [{
          type: 'text',
          content: 'goodbye'
        }]
      }]
    })
  }
];

function makeAST(childNode){
  return {
    type: 'program',
    childNodes: [childNode]
  };
}

function truncate(text, len){
  if (!len) { len = 40; }
  text = text.replace(/\n/g, "\\n");
  var ellipses = text.length > (len - 3) ? '...' : '';
  return text.slice(0, len) + ellipses;
}

var expectation, emblem, testName, expectedAST, message;

for (var i=0, l=expectations.length; i<l; i++){
  expectation = expectations[i];

  emblem = expectation.emblem;
  testName = expectation.name;
  expectedAST = expectation.ast;
  message = expectation.message || 'should work';

  QUnit.test( testName + ' (' + truncate(emblem) + ')', function(assert) {
    var builder = generateBuilder();
    parse( processSync(emblem), {builder:builder} );
    var ast = builder.toAST();

    assert.deepEqual(ast, expectedAST, message);
  });
}

/*
QUnit.test('parses nested elements interspersed with content', function(assert){
  var emblem = ['p',
                '  blah blah',
                '  b bold blah blah'].join('\n');

  var builder = generateBuilder();
  parse( processSync(emblem), {builder:builder});
  var ast = builder.toAST();

  assert.deepEqual(ast, {
    type: 'program',
    childNodes: [{
      type: 'element',
      tagName: 'p',
      attrStaches: [],
      childNodes: [{
        type: 'text',
        content: 'blah blah'
      }, {
        type: 'element',
        tagName: 'b',
        attrStaches: [],
        childNodes: [{
          type: 'text',
          content: 'bold blah blah'
        }]
      }]
    }]
  });
});
*/
