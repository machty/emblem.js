@import "./non-mustache.pegjs" as nonMustacheText
@import "./name-character.pegjs" as mustacheNameChar
@import "../syntax/block-start.pegjs" as blockStart
@import "../quoted-string.pegjs" as quotedString
@import "../whitespace.pegjs" as _

start = newMustacheAttrValue

newMustacheAttrValue = !(invalidValueStartChar / blockStart) v:(quotedString / valuePath) _ {
  return v;
}

valuePath = $mustacheNameChar+

// Excluding subexpressions and comments
invalidValueStartChar = [/(]
