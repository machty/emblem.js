@import "./name-character.pegjs" as newMustacheNameChar
@import "../syntax/block-start.pegjs" as blockStart
@import "../quoted-string.pegjs" as quotedString
@import "../parenthetical.pegjs" as parenthetical
@import "../whitespace.pegjs" as _

start = newMustacheAttrValue

newMustacheAttrValue = !(invalidValueStartChar / blockStart) v:(quotedString / valuePath / parenthetical) _ {
  return v;
}

valuePath = $newMustacheNameChar+

invalidValueStartChar = '/'
