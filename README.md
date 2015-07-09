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

To use Emblem 0.5.0 with [Ember-CLI](http://ember-cli.com/), use the [ember-cli-emblem](https://github.com/Vestorly/ember-cli-emblem)
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

### Query params

Emblem uses the following syntax:
`= link-to 'index' (query-params foo="wat")`

[Ember query params documentation](http://emberjs.com/guides/routing/query-params/)

### Syntax Examples

- [Read the syntax documentation](http://www.emblemjs.com/syntax).
- [Watch the Embercast](http://www.embercasts.com/episodes/2)
- [Check out this JSBin.](http://jsbin.com/ulegec/337/edit)
- Check out this [demo](http://emblem-test.herokuapp.com/) of
  an [ember-rails](https://github.com/machty/ember-rails) site
  with Emblem enabled.

![Emblem.js Syntax](https://s3.amazonaws.com/machty/emblem-sample.png)

### Using Emblem in your application

Previous versions of Emblem have supported a "vanilla" Handlebars
mode. The intent was that Ember-specific helpers could be avoided.

Emblem 0.5.0 dropped support for vanilla template compilation, but
we would like to bring it back. Please refer to
[VANILLA_HANDLEBARS.md](https://github.com/machty/emblem.js/blob/43f1557f034893ce1d77bceb79c8f1ffadae0f7d/VANILLA_HANDLEBARS.md)
for more context.

### Compiling in the Browser

For pre-0.5.0, follow the pattern in [this JSBin](http://jsbin.com/ulegec/337/edit):

1. Include Handlebars
2. Include Emblem
3. Include Ember

A globals build of Emblem appropriate for JSBins should be completed
before 0.5.1 is released. See [#212](https://github.com/machty/emblem.js/issues/212).

### Via Rails 3.1+

For pre-0.5.0, add the following to your Gemfile:

```
gem 'emblem-rails'
```

`emblem-rails` presently depends on `ember-rails`. With these
two gems, any templates ending in `.emblem` will be (pre)compiled
with Emblem.js.

Also, check out the [demo app](https://github.com/machty/emblem-rails-demo)
which uses the above configuration.

Updates to Emblem syntax do not require an update to `emblem-rails`. To
update to the latest Emblem, you can run:

```
bundle update emblem-source
```

### Emblem Build Tools

Compatible with 0.5.0+:

1. [ember-cli-emblem](https://github.com/Vestorly/ember-cli-emblem)
2. [gulp-emblem-printer](https://github.com/kay-is/gulp-emblem-printer)

Compatible with pre-0.5.0:

1. [emblem-rails](https://github.com/alexspeller/emblem-rails)
2. [barber-emblem](https://github.com/machty/barber-emblem), a
   Precompilation library for Ruby (used in `ember-rails`)
3. [emblem-brunch](https://github.com/machty/emblem-brunch), Emblem
   support for Brunch.io
4. [Mimosa (support for Emblem since v 0.10.1)](https://github.com/dbashford/mimosa)
5. [grunt-emblem](https://github.com/wordofchristian/grunt-emblem), Emblem support for Grunt (and Yeoman)
6. [gulp-emblem](https://github.com/Aulito/gulp-emblem), Emblem support for gulp

### Building Emblem.js

Clone the repo, then run:

```
npm install
bower install
ember build -e production
```

To run tests in the browser, run:

```
broccoli serve
```

The tests will be available at http://localhost:4200/tests/.

To run tests in Phantom and Node (which is how CI runs), use:

```
npm test
```

### Syntax Highlighting

Check out [vim-emblem](https://github.com/heartsentwined/vim-emblem)
for Vim editor support for Emblem.

Otherwise, for now, please refer to syntax highlighting solutions for
[Slim](http://slim-lang.com/), which is not much different
from Ember's. At some point, we'll have something even more
custom tailored to Emblem (feel free to take a swing at it
and send in a PR).

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
