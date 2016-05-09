@import "./whitespace-raw.pegjs" as whitespace

start "RequiredWhitespace"
  = $whitespace+
