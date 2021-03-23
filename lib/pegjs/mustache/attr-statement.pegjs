@import "../whitespace.pegjs" as _
@import "./attr-value.pegjs" as mustacheAttrValue
@import "../key.pegjs" as key
@import "../comment.pegjs" as comment
@import "../inline-comment.pegjs" as inlineComment
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

bracketedAttrs = initialAttrs:(mustacheAttrValue / subexpression)* _ openBracket attrs:(bracketedAttr / commentWithSpace / blankLine)+ &closeBracket _ {
  if (initialAttrs && initialAttrs.length)
    for (const i of initialAttrs)
      attrs.unshift(i);

  // Filter out comments
  return attrs.filter(function(attr) {
    return attr && attr.length > 0;
  });
}

// This is a special form of comment to absorb any preceeding spaces.  This seems to be necessary as the normal `comment` rule will not work if it is the first attr in a bracketed statement.
commentWithSpace = INDENT* (_ comment) { return []; }

bracketedAttr = INDENT* _ attr:mustacheAttr (_ inlineComment)* TERM* {
  return attr;
}

openBracket = '[' _ inlineComment? TERM+
closeBracket 'Closing bracket'
  = DEDENT? _ ']'


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
mustacheKeyValue = _ key:key _ '=' _ value:(subexpression / mustacheAttrValue) _ {
  return key + '=' + value;
}


/**
  subexpression

  - requires a helper name
  - either has bracketed attrs or normal mustache attrs
*/
subexpression
= _ '(' _ helper:mustacheAttrValue _ attrs:(subexpressionBracketAttrs / subexpressionAttrs+)? subexpressionClose _ {
  var firstHalf = '(' + helper;

  if (attrs)
    if (attrs.length && attrs instanceof Array)
      return firstHalf + ' ' + attrs.join(' ') + ')';
    else
      return firstHalf + ' ' + attrs + ')';
  else
    return firstHalf + ')';
}

subexpressionClose 'Closing ) for Subexpression'
  = _ ')'

// Bracketed attrs in a subexpression are different than normal mustache attrs because they cannot have nested content.  As a result, we need to absorb the closeBracket here instead of upstream
subexpressionBracketAttrs 'Subexpression bracketed attribute'
= attrs:bracketedAttrs closeBracket {
  return attrs.join(' ');
}

subexpressionAttrs = mustacheKeyValue / subexpression / mustacheAttrValue


/**
  Duplicates
*/
INDENT "INDENT" = t:. &{ return INDENT_SYMBOL === t; } { return ''; }
DEDENT "DEDENT" = t:. &{ return DEDENT_SYMBOL === t; } { return ''; }
TERM  "LineEnd" = "\r"? t:. &{ return TERM_SYMBOL == t; } "\n" { return false; }
