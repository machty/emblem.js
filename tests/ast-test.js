/* globals QUnit */

import Emblem from 'emblem';

module("Parsing into AST", {
  setup: function() {
  }
});

test("single char", function() {
  deepEqual(parse("| a"), {
    type: "program",
    children: [
      {
        type: "text",
        content: "a"
      }
    ]
  });
});

