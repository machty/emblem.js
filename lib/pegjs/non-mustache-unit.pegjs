@import "./any-dedent.pegjs" as anyDedent

start = nonMustacheUnit

nonMustacheUnit
  = tripleOpen / doubleOpen / hashStacheOpen / anyDedent / TERM

/**
  Duplicates
*/
singleOpen "SingleMustacheOpen" = '{'
doubleOpen "DoubleMustacheOpen" = '{{'
tripleOpen "TripleMustacheOpen" = '{{{'
hashStacheOpen  "InterpolationOpen"  = '#{'

TERM  "LineEnd" = "\r"? t:. &{ return TERM_SYMBOL == t; } "\n" { return false; }
