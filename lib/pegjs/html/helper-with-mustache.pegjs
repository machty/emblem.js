@import "../mustache/attr-value.pegjs" as mustacheAttrValue
@import "../whitespace.pegjs" as _
@import "../key.pegjs" as key
@import "../comment.pegjs" as comment
@import "../inline-comment.pegjs" as inlineComment
@import "../blank-line.pegjs" as blankLine


start = helperWithSingleMustache

helperWithSingleMustache = '{' _ value:helperCase _ mustacheClose {
  return value;
}

mustacheClose 'closing mustache'
 = '}'

helperCase
= initialHelper:mustacheAttrValue _ sub:(subexpression / bracketedAttrs / mustacheAttr)* {
  return initialHelper + ' ' + sub.join(' ');
}


bracketedAttrs = openBracket attrs:(bracketedAttr / commentWithSpace / blankLine)* closeBracket {
  // Filter out comments
  const res = attrs.filter(function(attr) {
    return attr && attr.length > 0;
  });
  return res.join(' ');
}

// This is a special form of comment to absorb any preceeding spaces.  This seems to be necessary as the normal `comment` rule will not work if it is the first attr in a bracketed statement.
commentWithSpace = (_ comment) { return []; }

bracketedAttr = INDENT* _ attr:mustacheAttr (_ inlineComment)* TERM* {
  return attr;
}

openBracket = '[' _ inlineComment? TERM+
closeBracket 'Closing bracket'
  = DEDENT? _ ']'

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

subexpressionBracketAttrs 'Subexpression bracketed attribute'
= attrs:bracketedAttrs {
  return attrs;
}

subexpressionAttrs = mustacheKeyValue / subexpression / mustacheAttrValue


/**
  Duplicates
*/
INDENT "INDENT" = t:. &{ return INDENT_SYMBOL === t; } { return ''; }
DEDENT "DEDENT" = t:. &{ return DEDENT_SYMBOL === t; } { return ''; }
TERM  "LineEnd" = "\r"? t:. &{ return TERM_SYMBOL == t; } "\n" { return false; }
