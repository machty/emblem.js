/*global QUnit*/
QUnit.module("hash brace syntax, #{}");

test('acts like {{}}', function(assert){
  var emblem = "span Yo #{foo}, I herd.";
  assert.compilesTo(emblem,
    "<span>Yo {{foo}}, I herd.</span>");
});

test('can start inline content', function(assert){
  var emblem = "span #{foo}, I herd.";
  assert.compilesTo(emblem,
    "<span>{{foo}}, I herd.</span>");
});

test('can end inline content', function(assert){
  var emblem = "span I herd #{foo}";
  assert.compilesTo(emblem,
    "<span>I herd {{foo}}</span>");
});

test("doesn't screw up parsing when # used in text nodes", function(assert){
  var emblem = "span OMG #YOLO";
  assert.compilesTo(emblem,
    "<span>OMG #YOLO</span>");
});

test("# can be only thing on line", function(assert){
  var emblem = "span #";
  assert.compilesTo(emblem,
    "<span>#</span>");
});

// TODO: this
// test "can be escaped", ->
//   emblem =
//   '''
//   span #\\{yes}
//   '''
//   shouldCompileTo emblem, '<span>#{yes}</span>'

