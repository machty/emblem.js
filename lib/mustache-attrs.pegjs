
@import "./mustache-attr-value.pegjs" as newMustacheAttrValue

start = mustacheAttrs

mustacheAttrs = m_bracketedAttrs / newMustacheAttr*

// open bracket followed by mustache attrs on separate lines followed by close bracket.
// We use the '&' syntax to avoid capturing the close bracket because the upstream parser
// rules will use it determine if there is nested mustache content following the bracket
m_bracketedAttrs = m_openBracket attrs:(m_* attr:newMustacheAttr m_TERM? { return attr;})* &m_closeBracket {
  return attrs;
}

newMustacheAttr = m_keyValue / m_parenthetical / newMustacheAttrValue

m_keyValue = attrName:newMustacheAttrName m_* '=' m_* attrValue:newMustacheAttrValue m_* {
  return attrName + '=' + attrValue;
}

newMustacheAttrName = $newMustacheNameChar+

m_parenthetical
= m_* p:$(m_OPEN_PAREN m_inParensChar* m_parenthetical? m_inParensChar* m_CLOSE_PAREN) m_* {
  return p;
}

m_inParensChar = [^\(\)]

m_OPEN_PAREN = '('
m_CLOSE_PAREN = ')'
m_ = ' '

// TERM and INDENT are added by the preprocessor
m_openBracket = '[' m_TERM m_INDENT
m_closeBracket = m_DEDENT? m_* ']'

// copied from (and namespaced with 'm_') the general parser
m_INDENT "INDENT" = t:. &{ return INDENT_SYMBOL === t; } { return ''; }
m_DEDENT "DEDENT" = t:. &{ return DEDENT_SYMBOL === t; } { return ''; }
m_TERM  "LineEnd" = "\r"? t:. &{ return TERM_SYMBOL == t; } "\n" { return false; }

// a character that can be in a mustache name
newMustacheNameChar = [A-Za-z0-9] / [_/] / '-' / '.'
