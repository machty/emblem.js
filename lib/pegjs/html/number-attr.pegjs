@import "../key.pegjs" as key

start = booleanAttribute

booleanAttribute
  = key:key '=' digits:digits
{
  var value = parseInt(digits.join(""), 10);

  return [key, value];
}

digits 'Valid numbers'
  = [0-9]+
