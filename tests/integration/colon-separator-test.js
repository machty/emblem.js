/*global QUnit*/

import { w } from '../support/utils';
import { compilesTo } from '../support/integration-assertions';

QUnit.module("colon separator");

test("basic", function() {
  var emblem;
  emblem = 'each foo: p Hello, #{this}';
  compilesTo(emblem, '{{#each foo}}<p>Hello, {{this}}</p>{{/each}}');
});

test("html stack", function() {
  var emblem;
  emblem = '.container: .row: .span5: span Hello';
  return compilesTo(emblem, '<div class="container"><div class="row"><div class="span5"><span>Hello</span></div></div></div>');
});

test("epic", function() {
  var emblem;
  emblem = '.container: .row: .span5\n  ul#list data-foo="yes": each foo: li\n    span: this';
  return compilesTo(emblem,
                           '<div class="container"><div class="row"><div class="span5"><ul id="list" data-foo="yes">{{#each foo}}<li><span>{{this}}</span></li>{{/each}}</ul></div></div></div>');
});

test("html stack elements only", function() {
  var emblem;
  emblem = 'p: span: div: p: foo';
  return compilesTo(emblem,
                           '<p><span><div><p>{{foo}}</p></div></span></p>');
});

test("mixed separators", function() {
  var emblem;
  emblem = '.fun = each foo: %nork = this';
  return compilesTo(emblem,
                           '<div class="fun">{{#each foo}}<nork>{{this}}</nork>{{/each}}</div>');
});

test("mixed separators rewritten", function() {
  var emblem;
  emblem = '.fun: each foo: %nork: this';
  return compilesTo(emblem,
     '<div class="fun">{{#each foo}}<nork>{{this}}</nork>{{/each}}</div>');
});

test("with text terminator", function() {
  var emblem;
  emblem = '.fun: view SomeView | Hello';
  return compilesTo(emblem,
                           '<div class="fun">{{#view SomeView}}Hello{{/view}}</div>');
});

test("test from heartsentwined", function() {
  compilesTo('li data-foo=bar: a',
                    '<li {{bind-attr data-foo=bar}}><a></a></li>');
  compilesTo("li data-foo='bar': a", '<li data-foo="bar"><a></a></li>');
});

test("mixture of colon and indentation", function() {
  var emblem;
  emblem = "li data-foo=bar: a\n  baz";
  return compilesTo(emblem,
                           '<li {{bind-attr data-foo=bar}}><a>{{baz}}</a></li>');
});

test("mixture of colon and indentation pt.2", function() {
  var emblem, result;
  emblem = w("ul",
             "  li data-foo=bar: a quux",
             "  li data-foo='bar': a quux",
             "  li data-foo=bar href='#': a quux");
  compilesTo(emblem,
    '<ul><li {{bind-attr data-foo=bar}}><a>quux</a></li><li data-foo="bar"><a>quux</a></li><li {{bind-attr data-foo=bar}} href="#"><a>quux</a></li></ul>');
});

// FIXME
/*
test("condensend nesting", function(){
  var emblem = `
    #content-frame: .container: .row:
      .span4: render "sidebar"
      .span8: render "main"
  `;
  compilesTo(
    emblem, '<div id="content-frame"><div class="container"><div class="row"><div class="span4">{{render "sidebar"}}</div><div class="span8">{{render "main"}}</div></div></div>');
});
*/
