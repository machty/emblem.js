@import "./any-dedent.pegjs" as anyDedent

start = nonMustacheUnit

nonMustacheUnit
  = tripleOpen / doubleOpen / hashStacheOpen / anyDedent / TERM

/**
  List of items that should not appear in a non-mustache unit

  (Rules that import this will negate these rules, e.g. `!nonMustacheUnit`)
*/
singleOpen "Single Mustache Open" = '{'
doubleOpen "Double Mustache Open" = '{{'
tripleOpen "Triple Mustache Open" = '{{{'
hashStacheOpen  "String Interpolation Open"  = '#{'

TERM  "LineEnd" = "\r"? t:. &{ return TERM_SYMBOL == t; } "\n" { return false; }
