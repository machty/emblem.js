/*global QUnit*/

import { w } from '../support/utils';
import { compilesTo } from '../support/integration-assertions';

QUnit.module("conditionals");

test("simple if statement", function(){
  var emblem = w(
    "if foo",
    "  | Foo",
    "if bar",
    "  | Bar"
  );
  compilesTo(emblem, "{{#if foo}}Foo{{/if}}{{#if bar}}Bar{{/if}}");
});

test("if else ", function(){
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
  compilesTo(emblem, "{{#if foo}}Foo{{#if bar}}Bar{{else}}Woot{{/if}}{{else}}WRONG{{/if}}{{#if bar}}WRONG{{else}}Hooray{{/if}}");
});

test("else with preceding `=`", function(){
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
  compilesTo(emblem, "{{#if foo}}<p>Yeah</p>{{else}}<p>No</p>{{/if}}{{#if bar}}<p>Yeah!</p>{{else}}<p>No!</p>{{/if}}{{#if bar}}<p>Yeah!</p>{{else}}<p>No!</p>{{/if}}");
});


test("unless", function(){
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
  compilesTo(emblem, "{{#unless bar}}Foo{{#unless foo}}Bar{{else}}Woot{{/unless}}{{else}}WRONG{{/unless}}{{#unless foo}}WRONG{{else}}Hooray{{/unless}}");
});

test("else followed by newline doesn't gobble else content", function(){
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
  compilesTo(emblem, "{{#if something}}<p>something</p>{{else}}{{#if nothing}}<p>nothing</p>{{else}}<p>not nothing</p>{{/if}}{{/if}}");
});

