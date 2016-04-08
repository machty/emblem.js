start = quotedString

quotedString = $( '"' stringWithoutDouble '"' ) / $("'" stringWithoutSingle "'")

stringWithoutDouble = $(inStringChar / "'")*
stringWithoutSingle = $(inStringChar / '"')*

inStringChar = [^'"]
