# [0.8.2](https://github.com/machty/emblem.js/releases/tag/0.8.2)
- Fix variation on subexpressions
- Add menuitem as HTML element
- Fix bug with actions that have 'action' as a value

# [0.8.1](https://github.com/machty/emblem.js/releases/tag/0.8.1)
- Fix issue with bracketed attributes without blocks

# [0.8.0](https://github.com/machty/emblem.js/releases/tag/0.8.0)
- Add a wider variety of support for bracketed attributes and blocks / block params
- Initial support for glimmer components using `%` helper
- Fix issue with comments breaking if / else block indentation
- Fix issue with multiple nested subexpressions
- Allow for a wider range of attribute options on dom elements (i.e. full range of closure action syntax)

# [0.7.1](https://github.com/machty/emblem.js/releases/tag/0.7.1)
- Allow slashes in attr values

# [0.7.0](https://github.com/machty/emblem.js/releases/tag/0.7.0)
- Added new spacing helper:
  `+` will add an extra space before line
- Fixed a bug with bound attributes in brackets
- Fixed a bug with using a pipe and a bound variable


# [0.6.0](https://github.com/machty/emblem.js/releases/tag/0.6.0)

Emblem no longer outputs `{{bind-attr}}`s for attribute bindings,
but instead outputs HTMLBars bound attribute syntax, e.g.

    p class=foo Hello

generates:

    <p class={{foo}}>Hello</p>

Likewise, colon syntax for class names will map to an inline if:

    div class=foo:bar:baz                        =>    <div class={{ if foo 'bar' 'baz' }}>
    .alert class=foo:bar:baz                     =>    <div class="alert {{ if foo 'bar' 'baz' }}">
    .alert class={ foo:bar:baz one:two:three }   =>    <div class="alert {{ if foo 'bar' 'baz'}} {{if one 'two' 'three'}}">

# [0.5.1](https://github.com/machty/emblem.js/releases/tag/0.5.1)

Added support for block params.

# [0.5.0](https://github.com/machty/emblem.js/releases/tag/0.5.0)

As of version 0.5.0, the output of an `Emblem` `compile` call is a
Handlebars-syntax string that can then be compiled by Handlebars.

This represents a breaking change for toolchains that expect Emblem's
`compile` output to be an executable compiled Handlebars template
function, but from an end-user perspective the Emblem syntax _should be
mostly backward-compatible_.

Note: Some of the "vanilla Handlebars" syntax for Emblem has not yet
been ported, especially in cases where it conflicts with (or is
unsupported by) the expected output for the same syntax with
"Ember Handlebars". In future releases it will be possible
to compile Emblem templates separately for "vanilla"
Handlebars and "Ember" handlebars syntaxes.
