@import "./any-dedent.pegjs" as anyDedent
@import "./indentation.pegjs" as indentation
@import "./line-content.pegjs" as lineContent
@import "./whitespace.pegjs" as _

start = comment

comment
  = '/' commentContent { return []; }

/**
  Absorb everything indented under the comment
*/
commentContent
 = lineContent TERM ( indentation (commentContent)+ anyDedent)* { return []; }


/**
  Duplicates
*/
TERM  "LineEnd" = "\r"? t:. &{ return TERM_SYMBOL == t; } "\n" { return false; }
