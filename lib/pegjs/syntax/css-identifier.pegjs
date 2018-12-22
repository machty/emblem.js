@import "../nmchar.pegjs" as nmchar

start = cssIdentifier

cssIdentifier "CSS class"
  = ident

ident = $nmchar+
