// @NOTE This file is very similar to tag-html.  It may be possible to merge them at some point.

@import "./attribute.pegjs" as attribute
@import "./attribute-bracketed.pegjs" as bracketedAttribute
@import "./modifier-bracketed.pegjs" as bracketedModifier
@import "./attribute-shorthand.pegjs" as shorthandAttributes
@import "./tag-string.pegjs" as tagString
@import "../mustache/ast/statement.pegjs" as statement
@import "./helper-with-mustache.pegjs" as helperValue
@import "../syntax/block-params.pegjs" as blockParamsRaw
@import "../whitespace.pegjs" as _
@import "../whitespace-req.pegjs" as __
@import "../inline-comment.pegjs" as inlineComment
@import "../blank-line.pegjs" as blankLine
@import "../comment.pegjs" as comment

start = inHtmlTag

openBracket = '[' _ inlineComment? TERM+
closeBracket 'Closing bracket'
  = DEDENT? _ ']'
commentWithSpace = (_ comment) { return []; }

inTagMustache = m:helperValue {
  return builder.generateMustache(m, true);
} / statement

inHtmlTag
= h:htmlStart startingInTagMustaches:inTagMustache* blockParams:blockParams? __ openBracket modifiers:bracketedModifier* fullAttributes:(bracketedAttribute / commentWithSpace / blankLine)* _ &closeBracket
{
  // Filter out comments
  fullAttributes = fullAttributes.filter(function(attr) {
    return attr && attr.length > 0;
  });
  return parseInHtml(h, startingInTagMustaches.concat(modifiers), fullAttributes, blockParams);
}
/ h:htmlStart inTagMustaches:inTagMustache* fullAttributes:attribute* blockParams:blockParams?
{
  return parseInHtml(h, inTagMustaches, fullAttributes, blockParams);
}

htmlStart
  = h:componentTag? s:shorthandAttributes? '/'?
&{
  return h || s;
}

// @TODO / coercion
componentTag
  = '%' _ s:tagString
{
  return s;
}

blockParams
  = _ params:blockParamsRaw
{
  return params;
}

/**
  Duplicates
*/
TERM  "LineEnd" = "\r"? t:. &{ return TERM_SYMBOL == t; } "\n" { return false; }
INDENT "INDENT" = t:. &{ return INDENT_SYMBOL === t; } { return ''; }
DEDENT "DEDENT" = t:. &{ return DEDENT_SYMBOL === t; } { return ''; }
