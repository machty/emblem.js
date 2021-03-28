@import "../mustache/attr-value.pegjs" as newMustacheAttrValue
@import "./block-start.pegjs" as blockStart
@import "./block-end.pegjs" as blockEnd
@import "../whitespace.pegjs" as _

start = blockParams

blockParams = blockStart _ params:blockParamName+ blockEnd {
  return params;
}

blockParamName 'block param'
  = param:newMustacheAttrValue
{
  return {type: 'regular', mainParam: param}
}
