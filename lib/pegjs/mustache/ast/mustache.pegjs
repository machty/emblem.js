@import "../attr-statement.pegjs" as mustacheAttrStatement
@import "../name-character.pegjs" as mustacheNameChar
@import "../../syntax/mustache-shorthand.pegjs" as newMustacheShortHand
@import "../../syntax/modifier-char.pegjs" as modifierChar
@import "../../syntax/block-params.pegjs" as blockParams
@import "../../whitespace.pegjs" as _

start = newMustache

// Returns an object with this shape:
// {
//   name: string,
//   attrs: array, (items look like 'class="abc"', 'tagName="xyz"', '(query-params foo=bar)', 'blah', '"quotedBlah"', etc)
//   blockParams: array, (items are all strings like 'item', 'foo', etc.)
//   modifier: '?' or '!' (optional),
// }
// upstream parsers will optionally add an `isEscaped:true` property
newMustache = mustacheStart:newMustacheStart _ attrs:mustacheAttrStatement blockParams:blockParams? {
  attrs = attrs.concat(mustacheStart.shorthands);

  return Object.assign({
    attrs, blockParams
  }, mustacheStart)
}

newMustacheStart = nameAst:newMustacheName _ shorthands:newMustacheShortHand* {
  const component = nameAst.name.indexOf('-') > -1;

  return Object.assign({
    component,
    shorthands
  }, nameAst);
}

newMustacheName = !invalidNameStartChar name:$mustacheNameChar+ modifier:modifierChar? {
  return {
    name,
    modifier
  };
}

invalidNameStartChar = '.' / '-' / [0-9]
