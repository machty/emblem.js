start = newMustache

// Returns an object with this shape:
// {
//   name: string,
//   attrs: array, (items look like 'class="abc"', 'tagName="xyz"', '(query-params foo=bar)', 'blah', '"quotedBlah"', etc)
//   modifier: '?' or '!' (optional),
// }
// upstream parsers will optionally add an `isEscaped:true` property
newMustache = name:newMustacheStart m_* attrs:(m_bracketedAttrs / newMustacheAttr*) {
  attrs = attrs.concat(name.shorthands);

  var ret = {
    name: name.name,
    attrs: attrs
  };
  if (name.modifier) {
    ret.modifier = name.modifier;
  }

  return ret;
}

// open bracket followed by mustache attrs on separate lines followed by close bracket
m_bracketedAttrs = m_openBracket attrs:(m_* attr:newMustacheAttr m_TERM? { return attr;})* m_closeBracket {
  return attrs;
}

// TERM and INDENT are added by the preprocessor
m_openBracket = '[' m_TERM m_INDENT
m_closeBracket = m_* ']'

// copied from (and namespace with 'm_') the general parser
m_INDENT "INDENT" = "\uEFEF" { return ''; }
m_TERM  "LineEnd" = "\r"? "\uEFFF" "\n" { return false; }

newMustacheStart = name:newMustacheName m_* shorthands:newMustacheShortHand* {
  return {
    name: name.name,
    modifier: name.modifier,
    shorthands: shorthands
  };
}

// shorthand %tagName, .className, #idName
newMustacheShortHand = m_shortHandTagName / m_shortHandIdName / m_shortHandClassName

m_shortHandTagName = '%' tagName:newMustacheShortHandName {
  return 'tagName="' + tagName + '"';
}

m_shortHandIdName = '#' idName:newMustacheShortHandName {
  return 'elementId="' + idName + '"';
}

m_shortHandClassName = '.' className:newMustacheShortHandName {
  return 'class="' + className + '"';
}

newMustacheShortHandName = $([A-Za-z0-9-]+)

newMustacheName = !m_invalidNameStartChar name:$newMustacheNameChar+ modifier:m_modifierChar? {
  return {
    name: name,
    modifier: modifier
  };
}

m_invalidNameStartChar = '.' / '-' / [0-9]
m_invalidValueStartChar = '/' / '['

// unbound (!) and conditional (?) modifiers
m_modifierChar = '!' / '?'

// a character that can be in a mustache name
newMustacheNameChar = [A-Za-z0-9] / [_/] / '-' / '.'

newMustacheAttr = m_keyValue / m_parenthetical / newMustacheAttrValue

m_keyValue = attrName:newMustacheAttrName m_* '=' m_* attrValue:newMustacheAttrValue m_* {
  return attrName + '=' + attrValue;
}

newMustacheAttrName = $newMustacheNameChar+

newMustacheAttrValue = !m_invalidValueStartChar v:(m_quotedString / m_valuePath / m_parenthetical) m_* {
  return v;
}

m_valuePath = $newMustacheNameChar+

m_quotedString = $( '"' m_stringWithoutDouble '"' ) / $("'" m_stringWithoutSingle "'")

m_stringWithoutDouble = $(m_inStringChar / "'")*
m_stringWithoutSingle = $(m_inStringChar / '"')*

m_inStringChar = [^'"]
m_inParensChar = [^\(\)]
m_commentChar = '/'

m_parenthetical
= m_* p:$(m_OPEN_PAREN m_inParensChar* m_parenthetical? m_inParensChar* m_CLOSE_PAREN) m_* {
  return p;
}

m_OPEN_PAREN = '('
m_CLOSE_PAREN = ')'
m_ = ' '
