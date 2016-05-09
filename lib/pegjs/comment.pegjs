@import "./any-dedent.pegjs" as anyDedent
@import "./indentation.pegjs" as indentation
@import "./line-content.pegjs" as lineContent

start = comment

comment
  = '/' commentContent { return []; }

commentContent
 = lineContent TERM ( indentation (commentContent)+ anyDedent)* { return []; }


/**
  Duplicates
*/
TERM  "LineEnd" = "\r"? t:. &{ return TERM_SYMBOL == t; } "\n" { return false; }
