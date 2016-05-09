@import "../key.pegjs" as key
@import "../whitespace.pegjs" as _
@import "./all-characters-except-colon.pegjs" as allCharactersExceptColonSyntax

start = boundAttributeWithSingleMustache

boundAttributeWithSingleMustache
  = key:key '=' '{' _ value:allCharactersExceptColonSyntax _ '}'
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
