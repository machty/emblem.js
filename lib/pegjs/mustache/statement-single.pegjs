@import "./non-mustache.pegjs" as nonMustacheText
@import "../whitespace.pegjs" as _

/**
  Returns mustache string
*/
start = singleMustacheValue

singleMustacheValue
  = '{' _ value:nonMustacheText _ mustacheClose
{
  return value;
}

mustacheClose 'closing mustache'
 = '}'
