@import "../mustache/attr-value.pegjs" as newMustacheAttrValue
@import "./block-start.pegjs" as blockStart
@import "./block-end.pegjs" as blockEnd
@import "../whitespace.pegjs" as _

start = destructuredParams

destructuredParams = blockStart _ params:(regularParamName / destructuringArray / destructuringHash)+ _ blockEnd {
  return params;
}

blockParamName 'block param'
  = newMustacheAttrValue

openBracket
 = '[' _

closeBracket
  = _ ']'

openMustache
 = '{' _

closeMustache
  = _ '}'

divider
  = _ '=' _

regularParamName 'regular block param'
  = param:newMustacheAttrValue
{
  return {type: 'regular', mainParam: param}
}

destructuringArray
  = openBracket params:blockParamName+ closeBracket divider mainParam:newMustacheAttrValue
{
  return {type: 'array', mainParam, params}
}

destructuringHash
  = openMustache params:blockParamName+ closeMustache divider mainParam:newMustacheAttrValue
{
  return {type: 'hash', mainParam, params}
}
