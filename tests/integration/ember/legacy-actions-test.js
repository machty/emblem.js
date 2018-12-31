import { module, test } from 'qunit';
import { w } from 'tests/support/utils';

module('ember: legacy actions', function (hooks) {
  test("basic (click)", function (assert) {
    const emblem = 'button click="submitComment" Submit Comment';

    assert.compilesTo(emblem, '<button {{action "submitComment" on="click"}}>Submit Comment</button>');
  });

  test("basic (click) preceded by action keyword", function (assert) {
    const emblem = 'button click="action submitComment" Submit Comment';

    assert.compilesTo(emblem, '<button {{action submitComment on="click"}}>Submit Comment</button>');
  });

  test("basic (click) followed by attr", function (assert) {
    const emblem = 'button click="submitComment" class="foo" Submit Comment';

    assert.compilesTo(emblem, '<button {{action "submitComment" on="click"}} class="foo">Submit Comment</button>');

    const emblem2 = 'button click="submitComment \'omg\'" class="foo" Submit Comment';

    assert.compilesTo(emblem2, '<button {{action submitComment \'omg\' on="click"}} class="foo">Submit Comment</button>');
  });

  test("nested (mouseEnter)", function (assert) {
    const emblem = w(
      "a mouseEnter='submitComment target=view'",
      "  | Submit Comment"
    );

    assert.compilesTo(emblem, '<a {{action submitComment target=view on="mouseEnter"}}>Submit Comment</a>');
  });

  test('explicitly single-quoted action name stays quoted', function (assert) {
    const emblem = 'a mouseEnter="\'hello\' target=controller"';

    assert.compilesTo(emblem, '<a {{action \'hello\' target=controller on="mouseEnter"}}></a>');
  });

  test('explicitly dobule-quoted action name stays quoted', function (assert) {
    const emblem = 'a mouseEnter=\'"hello" target=controller\'';

    assert.compilesTo(emblem, '<a {{action "hello" target=controller on="mouseEnter"}}></a>');
  });

  test("nested (mouseEnter, singlequoted)", function (assert) {
    const emblem = w(
      "a mouseEnter='submitComment target=\"view\"'",
      "  | Submit Comment"
    );

    assert.compilesTo(emblem, '<a {{action submitComment target="view" on="mouseEnter"}}>Submit Comment</a>');
  });

  test("nested (mouseEnter, doublequoted)", function (assert) {
    const emblem = w(
      "a mouseEnter=\"submitComment target='view'\"",
      "  | Submit Comment"
    );

    assert.compilesTo(emblem, '<a {{action submitComment target=\'view\' on="mouseEnter"}}>Submit Comment</a>');
  });

  test("single quote test", function (assert) {
    const emblem = "button click='p' Frank";

    assert.compilesTo(emblem, '<button {{action "p" on="click"}}>Frank</button>');
  });

  test("double quote test", function (assert) {
    const emblem = "button click=\"p\" Frank";

    assert.compilesTo(emblem, '<button {{action "p" on="click"}}>Frank</button>');
  });

  test("no quote remains unquoted in output", function (assert) {
    const emblem = "button click=p Frank";

    assert.compilesTo(emblem, '<button {{action p on="click"}}>Frank</button>');
  });
});
