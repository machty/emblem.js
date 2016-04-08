@import "./attr-value.pegjs" as newMustacheAttrValue
@import "../whitespace.pegjs" as _
@import "../parenthetical.pegjs" as parenthetical

start = mustacheAttrs

mustacheAttrs = bracketedAttrs / newMustacheAttr*

// open bracket followed by mustache attrs on separate lines followed by close bracket.
// We use the '&' syntax to avoid capturing the close bracket because the upstream parser
// rules will use it determine if there is nested mustache content following the bracket
bracketedAttrs = openBracket attrs:(_ attr:newMustacheAttr TERM? { return attr;})* &closeBracket {
  return attrs;
}

newMustacheAttr = keyValue / parenthetical / newMustacheAttrValue

keyValue = attrName:attrName _ '=' _ attrValue:newMustacheAttrValue _ {
  return attrName + '=' + attrValue;
}

attrName= $attrChar+
attrChar= [-_/A-Za-z0-9] / '.'

openBracket = '[' TERM INDENT
closeBracket = DEDENT? _ ']'


/**
  Duplicates
*/
INDENT "INDENT" = t:. &{ return INDENT_SYMBOL === t; } { return ''; }
DEDENT "DEDENT" = t:. &{ return DEDENT_SYMBOL === t; } { return ''; }
TERM  "LineEnd" = "\r"? t:. &{ return TERM_SYMBOL == t; } "\n" { return false; }
