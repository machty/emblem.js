@import "../mustache/statement-single.pegjs" as singleMustacheStatement
@import "../key.pegjs" as key

start = boundAttributeWithSingleMustache

boundAttributeWithSingleMustache
  = key:key '=' value:singleMustacheStatement
{
  value = value.trim();

  // Class logic needs to be coalesced, except if it is an inline if statement
  if (key === 'class') {
    if (value.indexOf('if') === 0) {
      return builder.generateClassNameBinding(value);
    } else {
      return splitValueIntoClassBindings(value);
    }
  } else {
    return [builder.generateAssignedMustache(value, key)];
  }
}
