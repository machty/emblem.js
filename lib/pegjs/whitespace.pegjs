@import "./whitespace-raw.pegjs" as whitespace

start "OptionalWhitespace"
  = whitespace*
