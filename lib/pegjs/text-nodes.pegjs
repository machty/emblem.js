@import "./mustache/raw.pegjs" as rawMustache
@import "./non-mustache-unit.pegjs" as nonMustacheUnit

start = textNodes

textNodes = first:preMustacheText? tail:(rawMustache preMustacheText?)* TERM
{
  return flattenArray(first, tail);
}

preMustacheText
  = $preMustacheUnit+
preMustacheUnit
  = !nonMustacheUnit c:. { return c; }

/**
  Duplicates
*/
TERM  "LineEnd" = "\r"? t:. &{ return TERM_SYMBOL == t; } "\n" { return false; }
