start = stringWithQuotes

stringWithQuotes
  = p:(singleQuoteString / doubleQuoteString)
{
  return p;
}

singleQuoteString
  = "'" hashSingleQuoteStringValue "'"
doubleQuoteString
  = '"' hashDoubleQuoteStringValue '"'

closingSingleQuote 'Closing single quote'
  = "'"

closingDoubleQuote 'Closing double quote'
  = "'"

hashDoubleQuoteStringValue 'string action attributes'
  = $(!(TERM) [^"}])*

hashSingleQuoteStringValue 'string action attributes'
  = $(!(TERM) [^'}])*

TERM  "LineEnd" = "\r"? t:. &{ return TERM_SYMBOL == t; } "\n" { return false; }
