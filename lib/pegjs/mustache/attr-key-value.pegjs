@import "../key.pegjs" as key
@import "./attr-value.pegjs" as attrValue
@import "../whitespace.pegjs" as _

start = simpleMustacheAttr

simpleMustacheAttr
  = key:key _ '=' _ value:attrValue
{
  return key + '=' + value;
}
