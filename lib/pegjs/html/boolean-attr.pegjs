@import "../non-glimmer-key.pegjs" as key

start = booleanAttribute

booleanAttribute
  = key:key '=' boolValue:('true'/'false')
{
  if (boolValue === 'true') {
    return [key];
  }
}
