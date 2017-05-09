/* global QUnit */
import { parse } from '../../emblem/parser';
import { w } from '../support/utils';
import { processSync, INDENT_SYMBOL, TERM_SYMBOL } from '../../emblem/preprocessor';
import { generateBuilder } from '../../emblem/ast-builder';

QUnit.module('Unit - mustache-parser');

function parseEmblem(emblem) {
  var builder = generateBuilder();

  parse(processSync(emblem), {
    builder:builder
  });

  var ast = builder.toAST();

  return ast;
}

test('capitalized start', function(assert){
  var text = 'App.Funview';

  assert.deepEqual(parseEmblem(text), {
    "childNodes": [
      {
        "content": "view App.Funview",
        "escaped": true,
        "type": "mustache"
      }
    ],
    "type": "program"
  });
});

test('lowercase start', function(assert){
  var text = 'frank';

  assert.deepEqual(parseEmblem(text), {
    "childNodes": [
      {
        "content": "frank",
        "escaped": true,
        "type": "mustache"
      }
    ],
    "type": "program"
  });
});

test('lowercase unquoted attr value', function(assert){
  var text = 'frank foo=bar';

  assert.deepEqual(parseEmblem(text), {
    "childNodes": [
      {
        "content": "frank foo=bar",
        "escaped": true,
        "type": "mustache"
      }
    ],
    "type": "program"
  });
});

test('attrs with spaces', function(assert){
  var text = 'frank foo = bar boo = far';

  assert.deepEqual(parseEmblem(text), {
    "childNodes": [
      {
        "content": "frank foo=bar boo=far",
        "escaped": true,
        "type": "mustache"
      }
    ],
    "type": "program"
  });
});

test('multiple attrs', function(assert){
  var text = 'frank foo=bar boo=far';

  assert.deepEqual(parseEmblem(text), {
    "childNodes": [
      {
        "content": "frank foo=bar boo=far",
        "escaped": true,
        "type": "mustache"
      }
    ],
    "type": "program"
  });
});

test('lowercase double-quoted attr value', function(assert){
  var doubleQuote = 'input placeholder="\'100% /^%&*()x12#"';

  assert.deepEqual(parseEmblem(doubleQuote), {
    "childNodes": [
      {
        "attrStaches": [
          {
            "content": "'100% /^%&*()x12#",
            "name": "placeholder",
            "type": "attribute"
          }
        ],
        "childNodes": [],
        "classNameBindings": [],
        "inTagText": [],
        "isVoid": true,
        "tagName": "input",
        "type": "element"
      }
    ],
    "type": "program"
  });
});

test('lowercase single-quoted attr value', function(assert){
  var singleQuote = "input placeholder='\"100% /^%&*()x12#'";

  assert.deepEqual(parseEmblem(singleQuote), {
    "childNodes": [
      {
        "attrStaches": [
          {
            "content": "\"100% /^%&*()x12#",
            "name": "placeholder",
            "type": "attribute"
          }
        ],
        "childNodes": [],
        "classNameBindings": [],
        "inTagText": [],
        "isVoid": true,
        "tagName": "input",
        "type": "element"
      }
    ],
    "type": "program"
  });
});

test('attr value with underscore', function(assert){
  var text = 'input placeholder=cat_name';
  assert.deepEqual(parseEmblem(text), {
    "childNodes": [
      {
        "attrStaches": [
          {
            "content": "cat_name",
            "key": "placeholder",
            "type": "assignedMustache"
          }
        ],
        "childNodes": [],
        "classNameBindings": [],
        "inTagText": [],
        "isVoid": true,
        "tagName": "input",
        "type": "element"
      }
    ],
    "type": "program"
  });
});

test('attr value is subexpression', function(assert){
  var text = 'echofun fun=(equal 1 1)';
  assert.deepEqual(parseEmblem(text), {
    "childNodes": [
      {
        "content": "echofun fun=(equal 1 1)",
        "escaped": true,
        "type": "mustache"
      }
    ],
    "type": "program"
  });
});

test('attr value is complex subexpression', function(assert){
  var text = 'echofun true (hello how="are" you=false) 1 not=true fun=(equal "ECHO hello" (echo (hello))) win="yes"';
  assert.deepEqual(parseEmblem(text), {
    "childNodes": [
      {
        "content": "echofun true (hello how=\"are\" you=false) 1 not=true fun=(equal \"ECHO hello\" (echo (hello))) win=\"yes\"",
        "escaped": true,
        "type": "mustache"
      }
    ],
    "type": "program"
  });
});

test('attr value is empty string', function(assert){
  var doubleQuote = 'input placeholder=""';
  var singleQuote = "input placeholder=''";

  assert.deepEqual(parseEmblem(singleQuote), {
    "childNodes": [
      {
        "attrStaches": [
          {
            "content": "",
            "name": "placeholder",
            "type": "attribute"
          }
        ],
        "childNodes": [],
        "classNameBindings": [],
        "inTagText": [],
        "isVoid": true,
        "tagName": "input",
        "type": "element"
      }
    ],
    "type": "program"
  });
  assert.deepEqual(parseEmblem(doubleQuote), {
    "childNodes": [
      {
        "attrStaches": [
          {
            "content": "",
            "name": "placeholder",
            "type": "attribute"
          }
        ],
        "childNodes": [],
        "classNameBindings": [],
        "inTagText": [],
        "isVoid": true,
        "tagName": "input",
        "type": "element"
      }
    ],
    "type": "program"
  });
});

test('query-params', function(assert){
  var text = 'frank (query-params groupId=defaultGroup.id)';

  assert.deepEqual(parseEmblem(text), {
    "childNodes": [
      {
        "content": "frank (query-params groupId=defaultGroup.id)",
        "escaped": true,
        "type": "mustache"
      }
    ],
    "type": "program"
  });
});

test('nested query-params', function(assert){
  var text = 'frank (query-params groupId=defaultGroup.id (more-qp x=foo))';

  assert.deepEqual(parseEmblem(text), {
    "childNodes": [
      {
        "content": "frank (query-params groupId=defaultGroup.id (more-qp x=foo))",
        "escaped": true,
        "type": "mustache"
      }
    ],
    "type": "program"
  });
});

test('mixed query-params and key-value attrs', function(assert){
  var text = 'frank (query-params abc=def) fob=bob (qp-2 dog=fog) dab=tab  ';

  assert.deepEqual(parseEmblem(text), {
    "childNodes": [
      {
        "content": "frank (query-params abc=def) fob=bob (qp-2 dog=fog) dab=tab",
        "escaped": true,
        "type": "mustache"
      }
    ],
    "type": "program"
  });
});

test('mustache name with dash', function(assert){
  var text = 'link-to foo=bar';

  assert.deepEqual(parseEmblem(text), {
    "childNodes": [
      {
        "content": "link-to foo=bar",
        "escaped": true,
        "type": "mustache"
      }
    ],
    "type": "program"
  });
});

test('mustache name with "/"', function(assert){
  var text = 'navigation/button-list';

  assert.deepEqual(parseEmblem(text), {
    "childNodes": [
      {
        "content": "navigation/button-list",
        "escaped": true,
        "type": "mustache"
      }
    ],
    "type": "program"
  });
});

/**
test('mustache value that is a bare "/" is not valid', function(assert){
  var text = 'navigation/button-list / omg';

  assert.throws( function() { parseEmblem(text); } );
});
*/

test('mustache with quoted param', function(assert){
  var text = 'link-to "abc.def"';

  assert.deepEqual(parseEmblem(text), {
    "childNodes": [
      {
        "content": "link-to \"abc.def\"",
        "escaped": true,
        "type": "mustache"
      }
    ],
    "type": "program"
  });
});

test('mustache with unquoted param', function(assert){
  var text = 'link-to dog';

  assert.deepEqual(parseEmblem(text), {
    "childNodes": [
      {
        "content": "link-to dog",
        "escaped": true,
        "type": "mustache"
      }
    ],
    "type": "program"
  });
});

test('mustache with multiple params', function(assert){
  var text = 'link-to "dog.tag" dog';

  assert.deepEqual(parseEmblem(text), {
    "childNodes": [
      {
        "content": "link-to \"dog.tag\" dog",
        "escaped": true,
        "type": "mustache"
      }
    ],
    "type": "program"
  });
});

test('mustache with shorthand % syntax', function(assert){
  var text = 'frank%span';

  assert.deepEqual(parseEmblem(text), {
    "childNodes": [
      {
        "content": "frank tagName=\"span\"",
        "escaped": true,
        "type": "mustache"
      }
    ],
    "type": "program"
  });
});

test('mustache with shorthand # syntax', function(assert){
  var text = 'frank#id-name';

  assert.deepEqual(parseEmblem(text), {
    "childNodes": [
      {
        "content": "frank elementId=\"id-name\"",
        "escaped": true,
        "type": "mustache"
      }
    ],
    "type": "program"
  });
});

test('mustache with shorthand . syntax with required space', function(assert){
  var text = 'frank .class-name';

  assert.deepEqual(parseEmblem(text), {
    "childNodes": [
      {
        "content": "frank class=\"class-name\"",
        "escaped": true,
        "type": "mustache"
      }
    ],
    "type": "program"
  });
});

test('mustache with multiple classes', function(assert){
  var text = 'frank .class-name1.class-name2';

  assert.deepEqual(parseEmblem(text), {
    "childNodes": [
      {
        "content": "frank class=\"class-name1 class-name2\"",
        "escaped": true,
        "type": "mustache"
      }
    ],
    "type": "program"
  });
});

test('mustache with multiple shorthands', function(assert){
  var text = 'frank%span#my-id.class-name';

  assert.deepEqual(parseEmblem(text), {
    "childNodes": [
      {
        "content": "frank tagName=\"span\" elementId=\"my-id\" class=\"class-name\"",
        "escaped": true,
        "type": "mustache"
      }
    ],
    "type": "program"
  });
});

/**
test('mustache cannot start with a dot, a dash or a digit', function(assert){
  assert.throws( function() { parseEmblem('.frank'); } );
  assert.throws( function() { parseEmblem('-frank'); } );
  assert.throws( function() { parseEmblem('9frank'); } );
});
*/

test("bang modifier", function(assert) {
  var text = 'foo!';

  assert.deepEqual(parseEmblem(text), {
    "childNodes": [
      {
        "content": "unbound foo",
        "escaped": true,
        "type": "mustache"
      }
    ],
    "type": "program"
  });
});

test("conditional modifier", function(assert) {
  var text = 'foo?';

  assert.deepEqual(parseEmblem(text), {
    "childNodes": [
      {
        "content": "if foo",
        "escaped": true,
        "type": "mustache"
      }
    ],
    "type": "program"
  });
});

test('block params', function(assert){
  var text = 'frank foo=bar boo=far as |steve|';

  assert.deepEqual(parseEmblem(text), {
    "childNodes": [
      {
        "content": "frank foo=bar boo=far as |steve|",
        "escaped": true,
        "type": "mustache"
      }
    ],
    "type": "program"
  });
});

test('multiple block params', function(assert){
  var text = 'frank foo=bar boo=far as |steve dave|';

  assert.deepEqual(parseEmblem(text), {
    "childNodes": [
      {
        "content": "frank foo=bar boo=far as |steve dave|",
        "escaped": true,
        "type": "mustache"
      }
    ],
    "type": "program"
  });
});
