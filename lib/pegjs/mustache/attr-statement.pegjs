@import "./attr.pegjs" as mustacheAttr
@import "../whitespace.pegjs" as _

start = mustacheAttrs

mustacheAttrs = bracketedAttrs / mustacheAttr*

// open bracket followed by mustache attrs on separate lines followed by close bracket.
// We use the '&' syntax to avoid capturing the close bracket because the upstream parser
// rules will use it determine if there is nested mustache content following the bracket
bracketedAttrs = openBracket attrs:(_ attr:mustacheAttr TERM? { return attr;})* &closeBracket {
  return attrs;
}

openBracket = '[' TERM INDENT
closeBracket = DEDENT? _ ']'

/**
  Duplicates
*/
INDENT "INDENT" = t:. &{ return INDENT_SYMBOL === t; } { return ''; }
DEDENT "DEDENT" = t:. &{ return DEDENT_SYMBOL === t; } { return ''; }
TERM  "LineEnd" = "\r"? t:. &{ return TERM_SYMBOL == t; } "\n" { return false; }
