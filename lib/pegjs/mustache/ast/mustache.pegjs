@import "../attr-statement.pegjs" as mustacheAttrStatement
@import "../name-character.pegjs" as mustacheNameChar
@import "../../syntax/mustache-shorthand.pegjs" as newMustacheShortHand
@import "../../syntax/modifier-char.pegjs" as modifierChar
@import "../../syntax/block-params.pegjs" as blockParamsRaw
@import "../../syntax/destructured-block-params.pegjs" as blockParamsDestructured
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

  mustacheStart['attrs'] = attrs;
  mustacheStart['blockParams'] = blockParams;

  return mustacheStart;
}

newMustacheStart = nameAst:newMustacheName _ shorthands:newMustacheShortHand* {
  var component = nameAst.name.indexOf('-') > -1;

  nameAst['component'] = component;
  nameAst['shorthands'] = shorthands;

  return nameAst;
}

newMustacheName = !invalidNameStartChar name:$mustacheNameChar+ modifier:modifierChar? {
  return {
    name: name,
    modifier: modifier
  };
}

blockParams
  = _ params:(blockParamsRaw / blockParamsDestructured)
{
  return params;
}

invalidNameStartChar 'Invalid mustache starting character'
  = '.' / '-' / [0-9]
