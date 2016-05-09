start = stringWithQuotes

stringWithQuotes = p:('"' hashDoubleQuoteStringValue '"' / "'" hashSingleQuoteStringValue "'") {
  return p;
}

hashDoubleQuoteStringValue = $(!(TERM) [^"}])*
hashSingleQuoteStringValue = $(!(TERM) [^'}])*

TERM  "LineEnd" = "\r"? t:. &{ return TERM_SYMBOL == t; } "\n" { return false; }
