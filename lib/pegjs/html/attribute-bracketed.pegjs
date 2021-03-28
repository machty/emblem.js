@import "./attribute.pegjs" as attribute
@import "../whitespace.pegjs" as _
@import "../inline-comment.pegjs" as inlineComment

bracketedAttribute
  = INDENT* a:attribute (_ inlineComment)* TERM*
{
  return a;
}

/**
  Duplicates
*/
TERM  "LineEnd" = "\r"? t:. &{ return TERM_SYMBOL == t; } "\n" { return false; }
INDENT "INDENT" = t:. &{ return INDENT_SYMBOL === t; } { return ''; }
