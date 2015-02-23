/* global QUnit*/
import { w } from '../support/utils';

QUnit.module("actions");

test("basic (click)", function(assert){
  var emblem = 'button click="submitComment" Submit Comment';
  assert.compilesTo(emblem, '<button {{action "submitComment" on="click"}}>Submit Comment</button>');
});

test("basic (click) followed by attr", function(assert){
  var emblem = 'button click="submitComment" class="foo" Submit Comment';
  assert.compilesTo(emblem, '<button {{action "submitComment" on="click"}} class="foo">Submit Comment</button>');

  emblem = 'button click="submitComment \'omg\'" class="foo" Submit Comment';
  assert.compilesTo(emblem, '<button {{action "submitComment" \'omg\' on="click"}} class="foo">Submit Comment</button>');
});

test("nested (mouseEnter)", function(assert){
  var emblem = w(
    "a mouseEnter='submitComment target=view'",
    "  | Submit Comment"
  );
  assert.compilesTo(emblem, '<a {{action "submitComment" target=view on="mouseEnter"}}>Submit Comment</a>');
});

test("nested (mouseEnter, singlequoted)", function(assert){
  var emblem = w(
    "a mouseEnter='submitComment target=\"view\"'",
    "  | Submit Comment"
  );
  assert.compilesTo(emblem, '<a {{action "submitComment" target="view" on="mouseEnter"}}>Submit Comment</a>');
});

test("nested (mouseEnter, doublequoted)", function(assert){
  var emblem = w(
    "a mouseEnter=\"submitComment target='view'\"",
    "  | Submit Comment"
  );
  assert.compilesTo(emblem, '<a {{action "submitComment" target=\'view\' on="mouseEnter"}}>Submit Comment</a>');
});

test("manual", function(assert){
  var emblem = "a{action someBoundAction target=view} Submit Comment";
  assert.compilesTo(emblem, '<a {{action someBoundAction target=view}}>Submit Comment</a>');
});

test("manual nested", function(assert){
  var emblem = w(
    "a{action 'submitComment' target=view}",
    "  p Submit Comment"
  );
  assert.compilesTo(emblem, '<a {{action \'submitComment\' target=view}}><p>Submit Comment</p></a>');
});

test("single quote test", function(assert) {
  var emblem;
  emblem = "button click='p' Frank";
  assert.compilesTo(emblem, '<button {{action "p" on="click"}}>Frank</button>');
});

test("double quote test", function(assert) {
  var emblem;
  emblem = "button click=\"p\" Frank";
  assert.compilesTo(emblem, '<button {{action "p" on="click"}}>Frank</button>');
});

// FIXME -- fails. Should this be {{action p}} or {{action "p"}} ?
/*
test("no quote test", function(assert) {
  var emblem;
  emblem = "button click=p Frank";
  assert.compilesTo(emblem, '<button {{action p on="click"}}>Frank</button>');
});
*/
