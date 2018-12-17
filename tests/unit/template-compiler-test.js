// /* global QUnit*/
// import { compile } from '../../emblem/template-compiler';

// QUnit.module("template compiler");


// QUnit.test("compiles text node AST", function(assert){
//   var ast = {
//     type: 'program',
//     childNodes: [
//       { type: 'text',
//         content: 'hello world' }
//     ]
//   };

//   var result = compile(ast);

//   assert.equal(result, 'hello world', 'content is output');
// });

// QUnit.test("compiles element node AST", function(assert){
//   var ast = {
//     type: 'program',
//     childNodes: [
//       { type: 'element',
//         tagName: 'div',
//         attrStaches: [
//           { type: 'attribute',
//             name: 'data-name',
//             content: 'red' }
//         ] }
//     ]
//   };

//   var result = compile(ast);

//   assert.equal(result, '<div data-name="red"></div>', 'content is output');
// });

// QUnit.test("compiles block node AST", function(assert){
//   var ast = {
//     type: 'program',
//     childNodes: [
//       { type: 'block',
//         content: 'each person in people',
//         childNodes: [
//           { type: 'element',
//             tagName: 'div' }
//         ] }
//     ]
//   };

//   var result = compile(ast);

//   assert.equal(result, '{{#each person in people}}<div></div>{{/each}}', 'content is output');
// });

// QUnit.test("compiles mustache node AST", function(assert){
//   var ast = {
//     type: 'program',
//     childNodes: [
//       { type: 'mustache',
//         escaped: true,
//         content: 'name' }
//     ]
//   };

//   var result = compile(ast);

//   assert.equal(result, '{{name}}', 'content is output');
// });

// QUnit.test("compiles unescaped mustache node AST", function(assert){
//   var ast = {
//     type: 'program',
//     childNodes: [
//       { type: 'mustache',
//         escaped: false,
//         content: 'name' }
//     ]
//   };

//   var result = compile(ast);

//   assert.equal(result, '{{{name}}}', 'content is output');
// });

// QUnit.test("compiles mustaches in attr content AST", function(assert){
//   var ast = {
//     type: 'program',
//     childNodes: [
//       { type: 'element',
//         tagName: 'div',
//         attrStaches: [
//           { type: 'mustache',
//             escaped: true,
//             content: 'bind-attr foo=baz' },
//           { type: 'mustache',
//             escaped: true,
//             content: 'action "whammo"' }
//         ] }
//     ]
//   };

//   var result = compile(ast);

//   assert.equal(result, '<div {{bind-attr foo=baz}} {{action "whammo"}}></div>', 'content is output');
// });

// QUnit.test("compiles block with inverse AST", function(assert){
//   var ast = {
//     type: 'program',
//     childNodes: [
//       { type: 'block',
//         content: 'with foo as bar',
//         childNodes: [
//           {
//             type: 'text',
//             content: 'hello there'
//           }
//         ],
//         invertibleNodes: [
//           {
//             content: [
//               [
//                 {
//                   type: 'text',
//                   content: 'not hello there'
//                 }
//               ]
//             ],
//             name: 'else'
//           }
//         ]
//       }
//     ]
//   };

//   var result = compile(ast);

//   assert.equal(result, '{{#with foo as bar}}hello there{{else}}not hello there{{/with}}');
// });

// QUnit.test("compiles boolean attribute", function(assert){
//   var ast = {
//     type: 'program',
//     childNodes: [
//       { type: 'element',
//         tagName: 'input',
//         attrStaches: [{
//           type: 'attribute',
//           name: 'disabled'
//           // NO value for content for a true boolean attribute
//         }]
//       }
//     ]
//   };

//   var result = compile(ast);

//   assert.equal(result, '<input disabled></input>');
// });

// QUnit.test("compiles complex classNameBindings to a bind-attr", function(assert){
//   var ast = {
//     type: 'program',
//     childNodes: [
//       { type: 'element',
//         tagName: 'div',
//         classNameBindings: [{
//           type: 'classNameBinding',
//           name: ':size'
//         }, {
//           type: 'classNameBinding',
//           name: 'color'
//         }, {
//           type: 'classNameBinding',
//           name: 'isHeavy:oof:whee'
//         }]
//       }
//     ]
//   };

//   var result = compile(ast);

//   assert.equal(result, '<div class="size {{color}} {{if isHeavy \'oof\' \'whee\'}}"></div>');
// });

// QUnit.test("compiles simple classNameBindings to a class attribute", function(assert){
//   var ast = {
//     type: 'program',
//     childNodes: [
//       { type: 'element',
//         tagName: 'div',
//         classNameBindings: [{
//           type: 'classNameBinding',
//           name: ':size'
//         }, {
//           type: 'classNameBinding',
//           name: ':color'
//         }]
//       }
//     ]
//   };

//   var result = compile(ast);

//   assert.equal(result, '<div class="size color"></div>');
// });

// QUnit.test("bound attribute values get quoted", function(assert){
//   var ast = {
//     type: 'program',
//     childNodes: [{
//       type: 'element',
//       tagName: 'img',
//       inTagText: [],
//       isVoid: true,
//       classNameBindings: [],
//       attrStaches: [{
//         type: 'assignedMustache',
//         key: 'alt',
//         content: 'alt_text'
//       }],
//       childNodes: []
//     }]
//   };

//   var result = compile(ast, {
//     legacyAttributeQuoting: true
//   });

//   assert.equal(result, '<img alt="{{alt_text}}">');
// });
