import { w } from '../support/utils';

QUnit.module("conditionals");

test("simple if statement", function(assert){
  var emblem = w(
    "if foo",
    "  | Foo",
    "if bar",
    "  | Bar"
  );
  assert.compilesTo(emblem, "{{#if foo}}Foo{{/if}}{{#if bar}}Bar{{/if}}");
});

test("if else ", function(assert){
  var emblem = w(
    "if foo",
    "  | Foo",
    "  if bar",
    "    | Bar",
    "  else",
    "    | Woot",
    "else",
    "  | WRONG",
    "if bar",
    "  | WRONG",
    "else",
    "  | Hooray"
  );
  assert.compilesTo(emblem, "{{#if foo}}Foo{{#if bar}}Bar{{else}}Woot{{/if}}{{else}}WRONG{{/if}}{{#if bar}}WRONG{{else}}Hooray{{/if}}");
});

test("else with preceding `=`", function(assert){
  var emblem = w(
  "= if foo",
  "  p Yeah",
  "= else",
  "  p No",
  "= if bar",
  "  p Yeah!",
  "= else",
  "  p No!",
  "=if bar",
  "  p Yeah!",
  "=else",
  "  p No!"
  );
  assert.compilesTo(emblem, "{{#if foo}}<p>Yeah</p>{{else}}<p>No</p>{{/if}}{{#if bar}}<p>Yeah!</p>{{else}}<p>No!</p>{{/if}}{{#if bar}}<p>Yeah!</p>{{else}}<p>No!</p>{{/if}}");
});


test("unless", function(assert){
  var emblem = w(
  "unless bar",
  "  | Foo",
  "  unless foo",
  "    | Bar",
  "  else",
  "    | Woot",
  "else",
  "  | WRONG",
  "unless foo",
  "  | WRONG",
  "else",
  "  | Hooray"
  );
  assert.compilesTo(emblem, "{{#unless bar}}Foo{{#unless foo}}Bar{{else}}Woot{{/unless}}{{else}}WRONG{{/unless}}{{#unless foo}}WRONG{{else}}Hooray{{/unless}}");
});

test("else followed by newline doesn't gobble else content", function(assert){
  var emblem = w(
  "if something",
  "  p something",
  "else",
  "",
  "  if nothing",
  "    p nothing",
  "  else",
  "    p not nothing"
  );
  assert.compilesTo(emblem, "{{#if something}}<p>something</p>{{else}}{{#if nothing}}<p>nothing</p>{{else}}<p>not nothing</p>{{/if}}{{/if}}");
});

