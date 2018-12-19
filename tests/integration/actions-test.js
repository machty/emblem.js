/* global QUnit*/

import { w } from '../support/utils';
import { compilesTo } from '../support/integration-assertions';

QUnit.module('actions');

QUnit.test("basic (click)", function(assert) {
  var emblem = 'button click="submitComment" Submit Comment';

  assert.compilesTo(emblem, '<button {{action "submitComment" on="click"}}>Submit Comment</button>');
});

QUnit.test("basic (click) preceded by action keyword", function(assert) {
  var emblem = 'button click="action submitComment" Submit Comment';

  assert.compilesTo(emblem, '<button {{action submitComment on="click"}}>Submit Comment</button>');
});

QUnit.test("action has action in its name", function(assert) {
  var emblem = 'button click="submitTransaction" Submit Comment';

  assert.compilesTo(emblem, '<button {{action "submitTransaction" on="click"}}>Submit Comment</button>');
});

QUnit.test("basic (click) followed by attr", function(assert) {
  var emblem = 'button click="submitComment" class="foo" Submit Comment';

  assert.compilesTo(emblem, '<button {{action "submitComment" on="click"}} class="foo">Submit Comment</button>');

  emblem = 'button click="submitComment \'omg\'" class="foo" Submit Comment';

  assert.compilesTo(emblem, '<button {{action submitComment \'omg\' on="click"}} class="foo">Submit Comment</button>');
});

QUnit.test("nested (mouseEnter)", function(assert) {
  var emblem = w(
    "a mouseEnter='submitComment target=view'",
    "  | Submit Comment"
  );

  assert.compilesTo(emblem, '<a {{action submitComment target=view on="mouseEnter"}}>Submit Comment</a>');
});

QUnit.test('explicitly single-quoted action name stays quoted', function(assert) {
  var emblem = 'a mouseEnter="\'hello\' target=controller"';

  assert.compilesTo(emblem, '<a {{action \'hello\' target=controller on="mouseEnter"}}></a>');
});

QUnit.test('explicitly dobule-quoted action name stays quoted', function(assert) {
  var emblem = 'a mouseEnter=\'"hello" target=controller\'';

  assert.compilesTo(emblem, '<a {{action "hello" target=controller on="mouseEnter"}}></a>');
});

QUnit.test("nested (mouseEnter, singlequoted)", function(assert) {
  var emblem = w(
    "a mouseEnter='submitComment target=\"view\"'",
    "  | Submit Comment"
  );

  assert.compilesTo(emblem, '<a {{action submitComment target="view" on="mouseEnter"}}>Submit Comment</a>');
});

QUnit.test("nested (mouseEnter, doublequoted)", function(assert) {
  var emblem = w(
    "a mouseEnter=\"submitComment target='view'\"",
    "  | Submit Comment"
  );

  assert.compilesTo(emblem, '<a {{action submitComment target=\'view\' on="mouseEnter"}}>Submit Comment</a>');
});

QUnit.test("manual", function(assert) {
  var emblem = "a{action someBoundAction target=view} Submit Comment";

  assert.compilesTo(emblem, '<a {{action someBoundAction target=view}}>Submit Comment</a>');
});

QUnit.test("manual nested", function(assert) {
  var emblem = w(
    "a{action 'submitComment' target=view}",
    "  p Submit Comment"
  );

  assert.compilesTo(emblem, '<a {{action \'submitComment\' target=view}}><p>Submit Comment</p></a>');
});

QUnit.test("single quote test", function(assert) {
  var emblem;
  emblem = "button click='p' Frank";

  assert.compilesTo(emblem, '<button {{action "p" on="click"}}>Frank</button>');
});

QUnit.test("double quote test", function(assert) {
  var emblem;
  emblem = "button click=\"p\" Frank";

  assert.compilesTo(emblem, '<button {{action "p" on="click"}}>Frank</button>');
});

QUnit.test("no quote remains unquoted in output", function(assert) {
  var emblem;
  emblem = "button click=p Frank";

  assert.compilesTo(emblem, '<button {{action p on="click"}}>Frank</button>');
});

QUnit.test("more advanced subexpressions work", function(assert) {
  var emblem;
  emblem = "select change={ action (mut vehicle) value=\"target.value\" }";

  assert.compilesTo(emblem, '<select {{action (mut vehicle) value="target.value"  on="change"}}></select>');
});

QUnit.test("actions with HTML events and mustache content", function(assert) {
  var emblem;
  emblem = "select onchange={ action (mut vehicle) value=\"target.value\" }";

  assert.compilesTo(emblem, '<select onchange={{action (mut vehicle) value="target.value"}}></select>');
});

QUnit.test("actions with HTML events and mixing mustache actions and bound attrs", function(assert) {
  var emblem;
  emblem = "button.small onclick={ action this.attrs.completeTask model } disabled=isEditing";

  assert.compilesTo(emblem, '<button onclick={{action this.attrs.completeTask model}} disabled={{isEditing}} class=\"small\"></button>');
});

QUnit.test("actions with legacy quoting", function(assert) {
  var emblem;
  emblem = "button.small onclick={ action this.attrs.completeTask model } disabled=isEditing";

  assert.compilesTo(emblem, '<button onclick={{action this.attrs.completeTask model}} disabled=\"{{isEditing}}\" class=\"small\"></button>', null, {
    legacyAttributeQuoting: true
  });
});
