@import "../whitespace.pegjs" as _
@import "./attr-value.pegjs" as mustacheAttrValue
@import "../key.pegjs" as key
@import "../comment.pegjs" as comment
@import "../blank-line.pegjs" as blankLine

start = mustacheAttrs

mustacheAttrs = bracketedAttrs / mustacheAttr*

/**
  bracketedAttrs

  - open bracket followed by mustache attrs on separate lines followed by close bracket.
  - We use the '&' syntax to avoid capturing the close bracket because the upstream parser rules will use it determine if there is nested mustache content following the bracket.
  - this will also absorb a single initial value, e.g.:
  ```
  = component foo [
    bar=baz
  ]
  ```
*/
bracketedAttrs = initialAttr:mustacheAttrValue? openBracket attrs:(bracketedAttr / comment / blankLine)* &closeBracket {
  if (initialAttr)
    attrs.unshift(initialAttr);

  // Filter out comments
  // @NOTE This will not handle a comment as the first item because of the way the comment parser is structured
  return attrs.filter(function(attr) {
    return attr && attr.length > 0;
  });
}

bracketedAttr = _ attr:mustacheAttr TERM? {
  return attr;
}

openBracket = '[' TERM INDENT
closeBracket = DEDENT? _ ']'


/**
  mustacheAttr

  Values can be:
  - key/value pair
  - subexpression
  - a mustache value (i.e. positional params)
  - positional params
*/
mustacheAttr = mustacheKeyValue / subexpression / mustacheAttrValue


/**
  mustacheKeyValue

  - key=value
  - value can be a normal attr value or a subexpression
*/
mustacheKeyValue = key:key _ '=' _ value:(subexpression / mustacheAttrValue) {
  return key + '=' + value;
}


/**
  subexpression

  - requires a helper name
  - either has bracketed attrs or normal mustache attrs
*/
subexpression
= _ '(' _ helper:mustacheAttrValue _ attrs:(subexpressionBracketAttrs / subexpressionAttrs+)? _ ')' _ {

  var firstHalf = '(' + helper;

  if (attrs)
    return firstHalf + ' ' + attrs.join(' ') + ')';
  else
    return firstHalf + ')';
}

// Bracketed attrs in a subexpression are different than normal mustache attrs because they cannot have nested content.  As a result, we need to absorb the closeBracket here instead of upstream
subexpressionBracketAttrs = attrs:bracketedAttrs closeBracket {
  return attrs;
}

subexpressionAttrs = mustacheKeyValue / subexpression / mustacheAttrValue


/**
  Duplicates
*/
INDENT "INDENT" = t:. &{ return INDENT_SYMBOL === t; } { return ''; }
DEDENT "DEDENT" = t:. &{ return DEDENT_SYMBOL === t; } { return ''; }
TERM  "LineEnd" = "\r"? t:. &{ return TERM_SYMBOL == t; } "\n" { return false; }
