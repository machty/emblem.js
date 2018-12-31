import { module, test } from 'qunit';
import { w } from 'tests/support/utils';

module('ember: action helpers', function (hooks) {
  test("basic (click)", function (assert) {
    const emblem = 'button click={ action "submitComment" } Submit Comment';

    assert.compilesTo(emblem, '<button {{action "submitComment"  on="click"}}>Submit Comment</button>');
  });

  test("manual", function (assert) {
    const emblem = "a{action someBoundAction target=view} Submit Comment";

    assert.compilesTo(emblem, '<a {{action someBoundAction target=view}}>Submit Comment</a>');
  });

  test("manual nested", function (assert) {
    const emblem = w(
      "a{action 'submitComment' target=view}",
      "  p Submit Comment"
    );

    assert.compilesTo(emblem, '<a {{action \'submitComment\' target=view}}><p>Submit Comment</p></a>');
  });
});
