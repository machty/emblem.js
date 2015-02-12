import Emblem from '../../emblem';
import { w } from '../support/utils';

QUnit.module("indentation");

test("it doesn't throw when indenting after a line with inline content", function(assert){
  var emblem = w(
    "p Hello",
    "  p invalid"
  );
  assert.compilesTo(emblem, "<p>Hello p invalid</p>");
});

test("it throws on half dedent", function(assert){
  var emblem = w(
    "p",
    "    span This is ok",
    "  span This aint"
  );
  assert.throws(function(){
    Emblem.compile(emblem);
  });
});

test("new indentation levels don't have to match parents'", function(assert){
  var emblem = w(
    "p ",
    "  span",
    "     div",
    "      span yes"
  );
  assert.compilesTo(emblem, "<p><span><div><span>yes</span></div></span></p>");
});

