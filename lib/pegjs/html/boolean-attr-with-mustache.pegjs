@import "../mustache/statement-single.pegjs" as singleMustacheStatement
@import "../key.pegjs" as key

/**
  Interpret bound attributes that have mustache

  e.g.
  `div class={ if foo 'bar'  }>` => `<div class={{ if foo 'bar' }}>`
  `div class={ foo bar baz  }>`  => `<div class="{{ foo }} {{ bar }} {{ baz }}">`
  `div style={ concat percentLeft '%' }`  => `<div style={{ concat percentLeft '%' }}>"`

  This includes special logic for `class=` so that values can be coalesced into a
  single class statement.
  e.g.
  `.foo class={ if bar 'baz' }` => `class="foo {{ if bar 'baz' }}"`

  This also adds some additional meaning to `={}` by allowing multiple classes
  to be defined in a single mustache statement.
  e.g.
  `.foo class={ :bar bar }`     => `class="foo bar {{bar}}"`
*/
start = boundAttributeWithSingleMustache

boundAttributeWithSingleMustache
  = key:key '=' value:singleMustacheStatement
{
  value = value.trim();

  // Class logic needs to be coalesced, except for conditional statements
  if (key === 'class') {
    if (value.indexOf('if') === 0 || value.indexOf('unless') === 0) {
      return builder.generateClassNameBinding(value);
    } else {
      return splitValueIntoClassBindings(value);
    }
  } else {
    return [builder.generateAssignedMustache(value, key)];
  }
}
