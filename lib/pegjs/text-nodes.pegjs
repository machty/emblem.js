@import "./mustache/ast/statement.pegjs" as mustacheStatement
@import "./non-mustache-unit.pegjs" as nonMustacheUnit

start = textNodes

textNodes = first:preMustacheText? tail:(mustacheStatement preMustacheText?)* TERM
{
  return flattenArray(first, tail);
}

preMustacheText
  = $preMustacheUnit+
preMustacheUnit
  = !nonMustacheUnit c:. !{ return /[\[\]]/g.test(c) } { return c; }

/**
  Duplicates
*/
TERM  "LineEnd" = "\r"? t:. &{ return TERM_SYMBOL == t; } "\n" { return false; }
