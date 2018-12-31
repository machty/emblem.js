import { module, test } from 'qunit';
import { w } from 'tests/support/utils';

module('mustache: unescaped expressions', function (hooks) {
  test("double =='s un-escape", function (assert) {
    const emblem = w(
      "== foo",
      "foo",
      "p == foo"
    );

    assert.compilesTo(emblem, '{{{foo}}}{{foo}}<p>{{{foo}}}</p>');
  });
});
