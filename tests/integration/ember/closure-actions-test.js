import { module, test } from 'qunit';
import { w } from 'tests/support/utils';

module('ember: closure actions', function (hooks) {
  test('basic test 1', function (assert) {
    const emblem = "= my-component eventChanged=(action 'foo' bar)";

    assert.compilesTo(emblem, "{{my-component eventChanged=(action 'foo' bar)}}");
  });

  test('basic test 2', function (assert) {
    const emblem = w(
      "= my-component [",
      "  eventOpened=(action (mut isOpen))",
      "  eventChanged=(action 'changeEvent')",
      "] as |message|",
      "  p = message",
    );

    assert.compilesTo(emblem, "{{#my-component eventOpened=(action (mut isOpen)) eventChanged=(action 'changeEvent') as |message|}}<p>{{message}}</p>{{/my-component}}");
  });

  test('basic test 3', function (assert) {
    const emblem = "a click={ action 'toggleOpen' } Open";

    assert.compilesTo(emblem, '<a {{action \'toggleOpen\'  on="click"}}>Open</a>');
  });

  test("component (click) does nothing", function (assert) {
    const emblem = w(
      '= my-button click=(action "submitComment")',
      '  |Submit Comment'
    );

    assert.compilesTo(emblem, '{{#my-button click=(action "submitComment")}}Submit Comment{{/my-button}}');
  });

  test("more advanced subexpressions work", function (assert) {
    const emblem = "select change={ action (mut vehicle) value=\"target.value\" }";

    assert.compilesTo(emblem, '<select {{action (mut vehicle) value="target.value"  on="change"}}></select>');
  });

  test("actions with HTML events and mustache content", function (assert) {
    const emblem = "select onchange={ action (mut vehicle) value=\"target.value\" }";

    assert.compilesTo(emblem, '<select onchange={{action (mut vehicle) value="target.value"}}></select>');
  });

  test("actions with HTML events and mixing mustache actions and bound attrs", function (assert) {
    const emblem = "button.small onclick={ action this.attrs.completeTask model } disabled=isEditing";

    assert.compilesTo(emblem, '<button onclick={{action this.attrs.completeTask model}} disabled={{isEditing}} class=\"small\"></button>');
  });

  test("actions with legacy quoting", function (assert) {
    const emblem = "button.small onclick={ action this.attrs.completeTask model } disabled=isEditing";

    assert.compilesTo(emblem, '<button onclick={{action this.attrs.completeTask model}} disabled=\"{{isEditing}}\" class=\"small\"></button>', null, {
      legacyAttributeQuoting: true
    });
  });
});
