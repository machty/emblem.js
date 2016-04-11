@import "./non-mustache.pegjs" as nonMustacheText
@import "./name-character.pegjs" as mustacheNameChar
@import "../syntax/block-start.pegjs" as blockStart
@import "../quoted-string.pegjs" as quotedString
@import "../syntax/subexpression.pegjs" as subexpression
@import "../whitespace.pegjs" as _

start = newMustacheAttrValue

newMustacheAttrValue = !(invalidValueStartChar / blockStart) v:(quotedString / valuePath / subexpression) _ {
  return v;
}

valuePath = $mustacheNameChar+

invalidValueStartChar = '/'
