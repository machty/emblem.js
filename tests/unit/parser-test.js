/* global QUnit*/
import { parse } from '../../emblem/parser';
import { processSync } from '../../emblem/preprocessor';
import { generateBuilder } from '../../emblem/ast-builder';
import { w } from '../support/utils';

QUnit.module("Unit - parse");

function truncate(text, len){
  if (!len) { len = 40; }
  text = text.replace(/\n/g, "\\n");
  var ellipses = text.length > (len - 3) ? '...' : '';
  return text.slice(0, len) + ellipses;
}

function astTest(name, emblem, callback){
  QUnit.test(name + ' "' + truncate(emblem) + '"', function(assert){
    var builder = generateBuilder();
    parse( processSync(emblem), {builder:builder} );
    var ast = builder.toAST();

    callback(assert, ast);
  });
}

function program(childNodes){
  return {
    type: 'program',
    childNodes: childNodes || []
  };
}

function element(tagName, childNodes, attrStaches){
  return {
    type: 'element',
    tagName: tagName,
    attrStaches: attrStaches || [],
    childNodes: childNodes || []
  };
}

function text(content){
  return {
    type: 'text',
    content: content
  };
}

function attribute(attrName, attrContent){
  return {
    type: 'attribute',
    name: attrName,
    content: attrContent
  };
}

astTest('simple element', 'h1 hello', function(assert, ast){
  assert.deepEqual(ast, program([ element('h1', [ text('hello') ] ) ]) );
});

astTest('simple text', '| abc def ghi', function(assert, ast){
  assert.deepEqual(ast, program([ text('abc def ghi') ]) );
});

// FIXME should this actually preserve the newline?
astTest('multiline text',
        w('| abc def ghi',
          '  another line'), function(assert, ast){
  assert.deepEqual(ast, program([text('abc def ghi\nanother line')]));
});

astTest('simple element', 'h1 my great element', function(assert, ast){
  assert.deepEqual(ast, program([element('h1', [text('my great element')])]));
});

astTest('simple element with single class name', 'h1.my-class', function(assert, ast){
  assert.deepEqual(
    ast,
    program([element('h1', [], [attribute('class', 'my-class')])])
  );
});

astTest('simple element with id', 'h1#my-id', function(assert, ast){
  assert.deepEqual(
    ast,
    program([ element('h1', [], [attribute('id', 'my-id')]) ])
  );
});

astTest('simple element with id and class', 'h1#my-id.my-class', function(assert, ast){
  assert.deepEqual(
    ast,
    program([ element('h1', [], [attribute('id', 'my-id'),
                                 attribute('class', 'my-class')]) ])
  );
});

astTest('element with shorthand attributes', '#my-id.my-class', function(assert, ast){
  assert.deepEqual(
    ast,
    program([ element('div', [], [attribute('id', 'my-id'),
                                 attribute('class', 'my-class')]) ])
  );
});

astTest('special element', '%blink', function(assert, ast){
  assert.deepEqual(
    ast,
    program([ element('blink', [], []) ])
  );
});

astTest('simple nested elements',
        w('ul',
          '  li'), function(assert, ast){
  assert.deepEqual(
    ast,
    program([ element('ul', [element('li')]) ])
  );
});

astTest('simple nested elements with content',
        w('ul',
          '  li hello',
          '  li goodbye'), function(assert, ast){
  assert.deepEqual(
    ast,
    program([
      element('ul',
              [
                element('li', [text('hello')]),
                element('li', [text('goodbye')])
              ])
    ])
  );
});

astTest('html attributes', 'button.close data-dismiss="modal" x', function(assert, ast){
  assert.deepEqual(
    ast,
    program([
      element('button',
              [text('x')],
              [attribute('data-dismiss', 'modal'),
               attribute('class', 'close')])
    ])
  );
});

astTest('comments are stripped', '/ Some comment', function(assert, ast){
  assert.deepEqual(
    ast,
    program()
  );
});

astTest('multiline comments are stripped',
        w('/ Some multiline',
          '  comment'), function(assert, ast){
  assert.deepEqual(
    ast,
    program()
  );
});

astTest('simple handlebars expression', 'h1 = name', function(assert, ast){
  assert.deepEqual(
    ast,
    program([
      element('h1', [{
        type: 'mustache',
        escaped: true,
        content: 'name'
      }])
    ])
  );
});

/* FIXME --this is most likely valid emblem and this test should work
astTest('nested elements interspersed with content',
        ['p',
         '  blah blah',
         '  b bold text'].join('\n'), function(assert, ast){
  assert.deepEqual(
    ast,
    program([
      element('p',
              [
                text('blah blah'),
                element('b', [text('bold text')])
              ])
    ])
  );
});
*/
