start = quotedString

quotedString 'Quoted string'
  = $( '"' stringWithoutDouble '"' ) / $("'" stringWithoutSingle "'")

stringWithoutDouble = $(inStringChar / "'")*
stringWithoutSingle = $(inStringChar / '"')*

inStringChar = [^'"]
