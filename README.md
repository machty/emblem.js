[![Build Status](https://travis-ci.org/machty/emblem.js.svg?branch=master)](https://travis-ci.org/machty/emblem.js)

# Emblem.js

Emblem.js is an indentation-based templating language that prints
[Handlebars.js](http://handlebarsjs.com/)
templates. Specifically, it targets [Ember.js](http://emberjs.com/)
templates.

Emblem's syntax most closely resembles that of the
[Slim templating language](http://slim-lang.com/). Please see the
[Emblem docs site](http://www.emblemjs.com) for a full explanation
of the syntax.

Also check out the
[Embercast on Emblem.js](http://www.embercasts.com/episodes/2)

### Installation with Ember-CLI

To use Emblem with [Ember-CLI](http://ember-cli.com/), use the [ember-cli-emblem](https://github.com/Vestorly/ember-cli-emblem)
addon.

### Handlebars Version Dependencies

As of Emblem 0.5.0, the compiler is really a template printer. Previous
versions compiled to Handlebars AST nodes and were forced to target
specific versions of Handlebars. The move to printing has eliminated that
restriction, and Emblem 0.5.0 should be compatible with any version
of Handlebars.

For posterity, here is a history of Emblem and Handelbars compatibility
across revisions.

- HTMLBars: Emblem 0.5.0+
- Handlebars 2.0.0: Use Emblem ~0.4.0, or 0.5.0+
- Handlebars 1.0.0: Use Emblem ~0.3.0, or 0.5.0+
- Handlebars <= 1.0.0.rc4: Use Emblem <= 0.2.9, or 0.5.0+


### Using Emblem in your application

Previous versions of Emblem have supported a "vanilla" Handlebars
mode. The intent was that Ember-specific helpers could be avoided.

Emblem 0.5.0 dropped support for vanilla template compilation, but
we would like to bring it back. Please refer to
[VANILLA_HANDLEBARS.md](https://github.com/machty/emblem.js/blob/43f1557f034893ce1d77bceb79c8f1ffadae0f7d/VANILLA_HANDLEBARS.md)
for more context.


### Building Emblem.js

Clone the repo, then run:

```
yarn install
ember build
```

To run tests in the browser, run:

```
ember test --serve
```

The tests will be available at http://localhost:4200/tests/.

To run tests in Headless Chrome and Node (which is how CI runs), use:

```
ember test
```


### Reporting Bugs

If you find a bug in Emblem syntax, please try to reproduce it in
its simplest form with
[this JSBin](http://jsbin.com/ucanam/4144/edit) before reporting an
issue, which will help me nail down the source of the issue.

[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/machty/emblem.js/trend.png)](https://bitdeli.com/free "Bitdeli Badge")

*Emblem was authored and released by [Alex Matchneer](http://github.com/machty/) ([@machty](https://twitter.com/machty)).*

<a href="http://vestorly.github.io/">
<img src="https://s3.amazonaws.com/assets-vestorly/vestorly-50px-height_360.png" height="50" width="169" />
</a>

*The Emblem 0.5.0 release was generously funded by Vestorly. Vestorly
is a technology company solving the content marketing problem for
individual professionals, small businesses, and the enterprises that
support them. Vestorly's user interface is built entirely with Ember.js and modern
web technologies. Vestorly is hiring!*
