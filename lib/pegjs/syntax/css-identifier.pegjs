@import "../nmchar.pegjs" as nmchar

start = cssIdentifier

cssIdentifier "CSSIdentifier" = ident

ident = $nmchar+
