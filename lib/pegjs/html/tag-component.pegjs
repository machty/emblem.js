// @NOTE This file is very similar to tag-html.  It may be possible to merge them at some point.

@import "./attribute.pegjs" as attribute
@import "./attribute-bracketed.pegjs" as bracketedAttribute
@import "./attribute-shorthand.pegjs" as shorthandAttributes
@import "./tag-string.pegjs" as tagString
@import "../mustache/ast/in-tag.pegjs" as inTagMustache
@import "../syntax/block-params.pegjs" as blockParamsRaw
@import "../whitespace.pegjs" as _
@import "../whitespace-req.pegjs" as __

start = inHtmlTag

inHtmlTag
= h:htmlStart blockParams:blockParams? __ '[' TERM* inTagMustaches:inTagMustache* fullAttributes:bracketedAttribute*
{
  return parseInHtml(h, inTagMustaches, fullAttributes, blockParams);
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
