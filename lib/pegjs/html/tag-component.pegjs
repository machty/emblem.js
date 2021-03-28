// @NOTE This file is very similar to tag-html.  It may be possible to merge them at some point.

@import "./attribute.pegjs" as attribute
@import "./attribute-bracketed.pegjs" as bracketedAttribute
@import "./modifier-bracketed.pegjs" as bracketedModifier
@import "./attribute-shorthand.pegjs" as shorthandAttributes
@import "./glimmer-tag-string.pegjs" as glimmerTagString
@import "../mustache/ast/statement.pegjs" as statement
@import "./helper-with-mustache.pegjs" as helperValue
@import "../syntax/block-params.pegjs" as blockParamsRaw
@import "../syntax/destructured-block-params.pegjs" as blockParamsDestructured
@import "../whitespace.pegjs" as _
@import "../whitespace-req.pegjs" as __
@import "../inline-comment.pegjs" as inlineComment
@import "../blank-line.pegjs" as blankLine
@import "../comment.pegjs" as comment

start = inHtmlTag

openBracket = '[' _ inlineComment? TERM+
closeBracket 'Closing bracket'
  = DEDENT _ ']'
commentWithSpace = (_ comment) { return []; }

inTagMustache = m:helperValue {
  return builder.generateMustache(m, true);
} / statement

inHtmlTag
= h:htmlStart startingInTagMustaches:inTagMustache* shorthands:inlineShorthands? blockParamsStart:blockParams? __ openBracket modifiers:bracketedModifier* fullAttributes:(bracketedAttribute / commentWithSpace / blankLine)* _ closeBracket blockParamsEnd:blockParams?
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

  const blockParams = (blockParamsStart || blockParamsEnd)
    ? [].concat(blockParamsStart || []).concat(blockParamsEnd || [])
    : null
  const inTagMustaches = startingInTagMustaches.concat(modifiers)
  return [h, inTagMustaches, fullAttributes, blockParams, true]
}
/ h:htmlStart inTagMustaches:inTagMustache* shorthands:inlineShorthands? blockParamsStart:blockParams? fullAttributes:attribute* blockParamsEnd:blockParams?
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

  const blockParams = (blockParamsStart || blockParamsEnd)
    ? [].concat(blockParamsStart || []).concat(blockParamsEnd || [])
    : null
  return [h, inTagMustaches, fullAttributes, blockParams, true]
}

htmlStart
  = h:componentTag? s:shorthandAttributes? isVoid:'/'?
&{
  return h || s;
} {
  return [h, s, isVoid === '/']
}

inlineShorthands
=  _ shorthands:shorthandAttributes { return shorthands }

// @TODO / coercion
componentTag
  = '%' _ s:glimmerTagString
{
  return s;
}

blockParams
  = _ params:(blockParamsRaw / blockParamsDestructured)
{
  return params;
}

/**
  Duplicates
*/
TERM  "LineEnd" = "\r"? t:. &{ return TERM_SYMBOL == t; } "\n" { return false; }
INDENT "INDENT" = t:. &{ return INDENT_SYMBOL === t; } { return ''; }
DEDENT "DEDENT" = t:. &{ return DEDENT_SYMBOL === t; } { return ''; }
