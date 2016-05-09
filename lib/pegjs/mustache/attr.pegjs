@import "./attr-key-value.pegjs" as mustacheKeyValue
@import "./attr-value.pegjs" as mustacheAttrValue
@import "../syntax/subexpression.pegjs" as subexpression

start = mustacheAttr

/**
  Values can be:
  - key/value pair
  - subexpression
  - a mustache value (i.e. positional params)
*/
mustacheAttr = mustacheKeyValue / subexpression / mustacheAttrValue
