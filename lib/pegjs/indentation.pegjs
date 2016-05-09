@import "./whitespace-req.pegjs" as __

start = indentation

indentation
  = INDENT s:__ { return s; }

INDENT "INDENT" = t:. &{ return INDENT_SYMBOL === t; } { return ''; }
