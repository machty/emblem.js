@import "../mustache/statement-single.pegjs" as singleMustacheStatement
@import "../mustache/attr-value.pegjs" as mustacheAttrValue
@import "../whitespace.pegjs" as _
@import "../key.pegjs" as key
@import "../comment.pegjs" as comment
@import "../inline-comment.pegjs" as inlineComment
@import "../blank-line.pegjs" as blankLine

/**
  Interpret bound attributes that have mustache

  e.g.
  `div class={ if foo 'bar'  }>` => `<div class={{ if foo 'bar' }}>`
  `div class={ foo bar baz  }>`  => `<div class="{{ foo }} {{ bar }} {{ baz }}">`
  `div style={ concat percentLeft '%' }`  => `<div style={{ concat percentLeft '%' }}>"`

  This includes special logic for `class=` so that values can be coalesced into a
  single class statement.
  e.g.
  `.foo class={ if bar 'baz' }` => `class="foo {{ if bar 'baz' }}"`

  This also adds some additional meaning to `={}` by allowing multiple classes
  to be defined in a single mustache statement.
  e.g.
  `.foo class={ :bar bar }`     => `class="foo bar {{bar}}"`
*/
start = boundAttributeWithSingleMustache

helperValue = '{' _ value:helperCase _ mustacheClose {
  return value;
}

mustacheClose 'closing mustache'
 = '}'

helperCase = initialHelper:mustacheAttrValue sub:(subexpression / bracketedAttrs / mustacheAttr)* {
  return initialHelper + ' ' + sub.join(' ');
}

bracketedAttrs = openBracket attrs:(bracketedAttr / commentWithSpace / blankLine)* &closeBracket {
  // Filter out comments
  return attrs.filter(function(attr) {
    return attr && attr.length > 0;
  });
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
= _ '(' _ helper:mustacheAttrValue _ attrs:(bracketedSubexpression / subexpressionBracketAttrs / subexpressionAttrs+)? subexpressionClose _ {
  var firstHalf = '(' + helper;

  if (attrs)
    return firstHalf + ' ' + attrs.join(' ') + ')';
  else
    return firstHalf + ')';
}

subexpressionClose 'Closing ) for Subexpression'
  = _ ')'

// Bracketed attrs in a subexpression are different than normal mustache attrs because they cannot have nested content.  As a result, we need to absorb the closeBracket here instead of upstream
subexpressionBracketAttrs 'Subexpression bracketed attribute'
  = attrs:bracketedAttrs closeBracket
{
  return attrs;
}

bracketedSubexpression = INDENT* _ attrs:(subexpression / commentWithSpace / blankLine)* closeBracket {
  // Filter out comments
  return attrs.filter(function(attr) {
    return attr && attr.length > 0;
  });
}

subexpressionAttrs = mustacheKeyValue / subexpression / mustacheAttrValue


boundAttributeWithSingleMustache
= 'class=' value:singleMustacheStatement {
  value = value.trim().replace(/[]/g, '');

  // Class logic needs to be coalesced, except for conditional statements
  if (value.indexOf('if') === 0 || value.indexOf('unless') === 0) {
    return builder.generateClassNameBinding(value);
  } else {
    return splitValueIntoClassBindings(value);
  }
}
/ k:key '=' value:helperValue {
  value = value.trim().replace(/[]/g, '');

  return [builder.generateAssignedMustache(value, k)];
}
/ k:key '=' value:singleMustacheStatement {
  value = value.trim().replace(/[]/g, '');

  return [builder.generateAssignedMustache(value, k)];
}


/**
  Duplicates
*/
INDENT "INDENT" = t:. &{ return INDENT_SYMBOL === t; } { return ''; }
DEDENT "DEDENT" = t:. &{ return DEDENT_SYMBOL === t; } { return ''; }
TERM  "LineEnd" = "\r"? t:. &{ return TERM_SYMBOL == t; } "\n" { return false; }
