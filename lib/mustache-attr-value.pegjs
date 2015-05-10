
start = newMustacheAttrValue

newMustacheAttrValue = !(m_invalidValueStartChar / m_blockStart) v:(m_quotedString / m_valuePath / m_parenthetical) m_* {
  return v;
}

// Copies from mustache-parser
m_blockStart = "as" m_* "|"

m_invalidValueStartChar = '/' / '['

m_quotedString = $( '"' m_stringWithoutDouble '"' ) / $("'" m_stringWithoutSingle "'")

m_valuePath = $newMustacheNameChar+

m_parenthetical
= m_* p:$(m_OPEN_PAREN m_inParensChar* m_parenthetical? m_inParensChar* m_CLOSE_PAREN) m_* {
  return p;
}

m_inParensChar = [^\(\)]

m_stringWithoutDouble = $(m_inStringChar / "'")*
m_stringWithoutSingle = $(m_inStringChar / '"')*

m_inStringChar = [^'"]

m_OPEN_PAREN = '('
m_CLOSE_PAREN = ')'

m_ = ' '

// a character that can be in a mustache name
newMustacheNameChar = [A-Za-z0-9] / [_/] / '-' / '.'
