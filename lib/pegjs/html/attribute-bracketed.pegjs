@import "./attribute.pegjs" as attribute

bracketedAttribute
  = INDENT* a:attribute TERM*
{
  return a;
}

/**
  Duplicates
*/
TERM  "LineEnd" = "\r"? t:. &{ return TERM_SYMBOL == t; } "\n" { return false; }
INDENT "INDENT" = t:. &{ return INDENT_SYMBOL === t; } { return ''; }
