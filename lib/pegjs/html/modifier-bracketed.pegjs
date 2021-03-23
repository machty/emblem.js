@import "./helper-with-mustache.pegjs" as helperValue
@import "../whitespace.pegjs" as _
@import "../inline-comment.pegjs" as inlineComment

bracketedModifier
  = INDENT* _ value:helperValue (_ inlineComment)* TERM*
{
  return [builder.generateMustache(value, true)];
}

/**
  Duplicates
*/
TERM  "LineEnd" = "\r"? t:. &{ return TERM_SYMBOL == t; } "\n" { return false; }
INDENT "INDENT" = t:. &{ return INDENT_SYMBOL === t; } { return ''; }
