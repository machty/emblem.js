@import "./whitespace.pegjs" as _

start = blankLine

blankLine = _ TERM { return []; }
TERM  "LineEnd" = "\r"? t:. &{ return TERM_SYMBOL == t; } "\n" { return false; }
