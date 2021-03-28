// @NOTE This file is very similar to tag-component.  It may be possible to merge them at some point.

@import "./attribute.pegjs" as attribute
@import "./attribute-bracketed.pegjs" as bracketedAttribute
@import "./modifier-bracketed.pegjs" as bracketedModifier
@import "./attribute-shorthand.pegjs" as shorthandAttributes
@import "./tag-string.pegjs" as tagString
@import "./helper-with-mustache.pegjs" as helperValue
@import "../mustache/ast/statement.pegjs" as statement
@import "../whitespace.pegjs" as _
@import "../whitespace-req.pegjs" as __
@import "../inline-comment.pegjs" as inlineComment
@import "../blank-line.pegjs" as blankLine
@import "../comment.pegjs" as comment

start = tagHtml

openBracket = '[' _ inlineComment? TERM+
closeBracket = DEDENT _ ']'
commentWithSpace = (_ comment) { return []; }

inTagMustache = m:helperValue {
  return builder.generateMustache(m, true);
} / statement

/**
  group: inHtmLTag

  Everything that goes in the angle brackets of an html tag. Examples:
  p#some-id class="asdasd"
  #some-id data-foo="sdsdf"
  p{ action "click" target="view" }

  This also needs to absorb comments for when using brackets
*/
tagHtml
= h:htmlStart startingInTagMustaches:inTagMustache* shorthands:inlineShorthands? __ openBracket modifiers:bracketedModifier* fullAttributes:(bracketedAttribute / commentWithSpace / blankLine)* closeBracket
{
  // Filter out comments
  fullAttributes = fullAttributes.filter(function(attr) {
    return attr && attr.length > 0;
  });

  if (shorthands && (shorthands[0] || shorthands[1])) {
    const firstShorthandAttrs = h[1] || []
    const mainClasses = firstShorthandAttrs[1] || []
    const id = shorthands[0]
    const classes = shorthands[1]
    if (id) firstShorthandAttrs[0] = id
    if (classes && classes.length) firstShorthandAttrs[1] = mainClasses.concat(classes)
    h[1] = firstShorthandAttrs
  }

  const inTagMustaches = startingInTagMustaches.concat(modifiers)
  return [h, inTagMustaches, fullAttributes, false]
}
/ h:htmlStart inTagMustaches:inTagMustache* shorthands:inlineShorthands? fullAttributes:attribute*
{
  if (shorthands && (shorthands[0] || shorthands[1])) {
    const firstShorthandAttrs = h[1] || []
    const mainClasses = firstShorthandAttrs[1] || []
    const id = shorthands[0]
    const classes = shorthands[1]
    if (id) firstShorthandAttrs[0] = id
    if (classes && classes.length) firstShorthandAttrs[1] = mainClasses.concat(classes)
    h[1] = firstShorthandAttrs
  }
  return [h, inTagMustaches, fullAttributes, false]
}


// Start of a chunk of HTML. Must have either tagName or shorthand
// class/id attributes or both. Examples:
// p#some-id
// #some-id
// .a-class
// span.combo#of.stuff
// NOTE: this returns a 2 element array of [h,s].
// The return is used to reject a when both h an s are falsy.
htmlStart = h:knownTagName? s:shorthandAttributes? '/'? &{ return h || s; } {
  return [h, s]
}

inlineShorthands
=  _ shorthands:shorthandAttributes { return shorthands }

knownTagName = tag:tagString &{ return isKnownTag(tag); }  { return tag; }

/**
  Duplicates
*/
TERM  "LineEnd" = "\r"? t:. &{ return TERM_SYMBOL == t; } "\n" { return false; }
INDENT "INDENT" = t:. &{ return INDENT_SYMBOL === t; } { return ''; }
DEDENT "DEDENT" = t:. &{ return DEDENT_SYMBOL === t; } { return ''; }
