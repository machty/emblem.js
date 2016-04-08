@import "../key.pegjs" as key
@import "../whitespace.pegjs" as _
@import "../non-separator-colon.pegjs" as nonSeparatorColon

start = boundAttribute

/**
  With Ember-Handlebars variant,
  p class=something -> <p {{bindAttr class="something"}}></p>
*/
boundAttribute
  = key:key '=' value:boundAttributeValue !'!'
{
  if (key === 'class') {
    return splitValueIntoClassBindings(value);
  } else {
    return [builder.generateAssignedMustache(value, key)];
  }
}

boundAttributeValue
  = '{' _ value:$(boundAttributeValueChar / ' ')+ _ '}' { return value.replace(/ *$/, ''); }
  / $boundAttributeValueChar+

boundAttributeValueChar = [A-Za-z\.0-9_\-/] / nonSeparatorColon
