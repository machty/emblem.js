@import "./whitespace.pegjs" as _

start = else

// Captures else / else if statements
else
  = ('=' _)? e:('else' _ 'if'?) { return e.join(''); }
