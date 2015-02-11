import { compile } from '../../emblem/template-compiler'

QUnit.module("template compiler");


QUnit.test("compiles text node AST", function(assert){
  var ast = {
    type: 'program',
    childNodes: [
      { type: 'text',
        content: 'hello world' }
    ]
  };

  var result = compile(ast);

  assert.equal(result, 'hello world', 'content is output');
});

QUnit.test("compiles element node AST", function(assert){
  var ast = {
    type: 'program',
    childNodes: [
      { type: 'element',
        tagName: 'div',
        attrStaches: [
          { type: 'attribute',
            name: 'class',
            content: 'red' }
        ] }
    ]
  };

  var result = compile(ast);

  assert.equal(result, '<div class="red"></div>', 'content is output');
});
