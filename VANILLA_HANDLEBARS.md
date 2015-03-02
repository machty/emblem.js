During the template printing rewrite, we removed support for
two kinds of vanilla Handlebars APIs:

* Some Ember enhancements, such as `SomeView` -> `{{view SomeView}}` are now
  always performed.
* Some Ember-specific APIs, such as `p class=isEnabled:active:disabled` had
  fallbacks to Handlebars-safe versions. Those fallbacks were removed.
* Some Handlebars syntax that is unsupported in Ember was removed from Emblem in 0.5.0, for example:
    * template partial invocation with `>`
    * `@`-based data helpers (like `@index` in an `each` block)

To re-introduce support for vanilla Handlebars, our proposal is that the AST
should be enhanced to support these syntaxes explicitly. Once that happens,
a seperate vanilla template compiler can be added that ouputs vanilla
syntax or raises errors as is appropriate.

