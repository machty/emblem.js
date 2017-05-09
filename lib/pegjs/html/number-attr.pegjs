@import "../key.pegjs" as key

start = booleanAttribute

booleanAttribute
  = key:key '=' digits:[0-9]+
{
  var value = parseInt(digits.join(""), 10);

  return [key, value];
}
