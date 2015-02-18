During the template printing rewrite, we removed support for
two kinds of vanilla Handlebars APIs:

* Some Ember enhancements, such as `SomeView` -> `{{view SomeView}}` are now
  always performed.
* Some Ember-specific APIs, such as `p class=isEnabled:active:disabled` had
  fallbacks to Handlebars-safe versions. Those fallbacks were removed.

To re-introduce support for vanilla Handlebars, our proposal is that the AST
should be enhanced to support these syntaxes explicitly. Once that happens,
a seperate vanilla template compiler can be added that ouputs vanilla
syntax or raises errors as is appropriate.

