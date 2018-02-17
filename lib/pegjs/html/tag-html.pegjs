// @NOTE This file is very similar to tag-component.  It may be possible to merge them at some point.

@import "./attribute.pegjs" as attribute
@import "./attribute-bracketed.pegjs" as bracketedAttribute
@import "./attribute-shorthand.pegjs" as shorthandAttributes
@import "./tag-string.pegjs" as tagString
@import "../mustache/ast/in-tag.pegjs" as inTagMustache
@import "../whitespace.pegjs" as _
@import "../whitespace-req.pegjs" as __
@import "../inline-comment.pegjs" as inlineComment

start = tagHtml

/**
  group: inHtmLTag

  Everything that goes in the angle brackets of an html tag. Examples:
  p#some-id class="asdasd"
  #some-id data-foo="sdsdf"
  p{ action "click" target="view" }

  This also needs to absorb comments for when using brackets
*/
tagHtml
= h:htmlStart __ '[' TERM* inTagMustaches:inTagMustache* fullAttributes:bracketedAttribute+ (_ inlineComment _ TERM)*
{
  return parseInHtml(h, inTagMustaches, fullAttributes);
}
/ h:htmlStart inTagMustaches:inTagMustache* fullAttributes:attribute*
{
  return parseInHtml(h, inTagMustaches, fullAttributes);
}


// Start of a chunk of HTML. Must have either tagName or shorthand
// class/id attributes or both. Examples:
// p#some-id
// #some-id
// .a-class
// span.combo#of.stuff
// NOTE: this returns a 2 element array of [h,s].
// The return is used to reject a when both h an s are falsy.
htmlStart = h:knownTagName? s:shorthandAttributes? '/'? &{ return h || s; }

knownTagName = tag:tagString &{ return isKnownTag(tag); }  { return tag; }

/**
  Duplicates
*/
TERM  "LineEnd" = "\r"? t:. &{ return TERM_SYMBOL == t; } "\n" { return false; }
INDENT "INDENT" = t:. &{ return INDENT_SYMBOL === t; } { return ''; }
