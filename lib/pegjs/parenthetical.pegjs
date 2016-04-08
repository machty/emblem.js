@import "./whitespace.pegjs" as _

start = parenthetical

parenthetical
= _ p:$(OPEN_PAREN inParensChar* parenthetical? inParensChar* CLOSE_PAREN) _ {
  return p;
}

inParensChar = [^\(\)]

OPEN_PAREN = '('
CLOSE_PAREN = ')'
