import { w } from '../support/utils';

QUnit.module("html nested");

test("basic", function(assert){
  var emblem = w(
    "p",
    "  span Hello",
    "  strong Hi",
    "div",
    "  p Hooray"
  );
  assert.compilesTo(emblem,
    '<p><span>Hello</span><strong>Hi</strong></p><div><p>Hooray</p></div>');
});

test("empty nest", function(assert){
  var emblem = w(
    "p",
    "  span",
    "    strong",
    "      i"
  );
  assert.compilesTo(emblem, '<p><span><strong><i></i></strong></span></p>');
});

test("empty nest w/ attribute shorthand", function(assert){
  var emblem = w(
    "p.woo",
    "  span#yes",
    "    strong.no.yes",
    "      i"
  );
  assert.compilesTo(emblem,
    '<p class="woo"><span id="yes"><strong class="no yes"><i></i></strong></span></p>');
});
