@import "../nmchar.pegjs" as nmchar
@import "../whitespace-raw.pegjs" as whitespace

start = allCharactersExceptColonSyntax

/**
  Catchall when single mustache is assigned to a key.
  This excludes assigning the inline shorthand foo:bar
  thing={ whatever you want 'to' do }

  Ignores:
  thing={ foo:bar }
*/
// Any character including strings
allCharactersExceptColonSyntax
  = $((nmchar / [.()=] / whitespace / singleQuoteString / doubleQuoteString)*)

singleQuoteString
  = $(['] (nonQuoteChars / ["])* ['])

doubleQuoteString
  = $(["] (nonQuoteChars / ['])* ["])

nonQuoteChars
  = [^"']
