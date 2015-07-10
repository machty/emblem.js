# 0.6.0

Emblem no longer outputs `{{bind-attr}}`s for attribute bindings,
but instead outputs HTMLBars bound attribute syntax, e.g.

    p class=foo Hello

generates:

    <p class={{foo}}>Hello</p>

# 0.5.1

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
