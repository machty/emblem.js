[![Build Status](https://travis-ci.org/machty/emblem.js.png)](https://travis-ci.org/machty/emblem.js)

# Emblem.js

Emblem.js is an indentation-based templating language that compiles
down to the [Handlebars.js](https://github.com/wycats/handlebars.js/)
runtime. It is therefore:

1. Efficiently/easily precompilable
1. Compilable in the browser
1. Fully compatible with Ember.js's auto-updating templates (with
   Ember-targeting/friendly syntax)

Emblem's syntax most closely resembles that of the 
[Slim templating language](http://slim-lang.com/). Please see the 
[Emblem docs site](http://www.emblemjs.com) for a full explanation 
of the syntax.

Also check out the 
[Embercast on Emblem.js](http://www.embercasts.com/episodes/2)

## Handlebars Version Dependencies 

_Updated: July 2013_

In the push to Handlebars 1.0.0, some changes were made to the Handlebars 
internals that broke Emblem, but Emblem's been fixed as of July 1, 2013.
Here are the versions you should be using:

- Handlebars 1.0.0: Use Emblem >= 0.3.0
- Handlebars <= 1.0.0.rc4: Use Emblem <= 0.2.9

## Query params 

_Updated: March 2014_

Handlebars >= 1.3.0 is required to use query params.

Emblem uses the following syntax:
`= link-to 'index' (query-params foo="wat")`

[Ember query params documentation](http://emberjs.com/guides/routing/query-params/)

## Syntax Examples

- [Read the syntax documentation](http://www.emblemjs.com/syntax).
- [Watch the Embercast](http://www.embercasts.com/episodes/2)
- [Check out this JSBin.](http://jsbin.com/ulegec/337/edit)
- Check out this [demo](http://emblem-test.herokuapp.com/) of 
  an [ember-rails](https://github.com/machty/ember-rails) site
  with Emblem enabled.

![Emblem.js Syntax](https://s3.amazonaws.com/machty/emblem-sample.png)

## Using Emblem in your application

You can use Emblem to compile either to vanilla Handlebars or Emberized
Handlebars. Let's assume you're compiling to Emberized Handlebars
for use with an Ember app.

### Compiling in the Browser 

Follow the pattern in [this JSBin](http://jsbin.com/ulegec/337/edit):

1. Include Handlebars
1. Include Emblem
1. Include Ember

If you have a recent enough version of Ember, all the Emblem code you
put into `<script type="text/x-emblem">` tags will get compiled and
stripped out of the DOM. If you're using an out-of-date Ember, you
can trigger this to happen manually before app initialization via

```
Ember.onLoad('application', Emblem.compileScriptTags);
```

### Via Rails 3.1+

Add the following to your Gemfile:

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
    
    bundle update emblem-source

### All Emblem Plugins

1. [emblem-rails](https://github.com/alexspeller/emblem-rails)
1. [barber-emblem](https://github.com/machty/barber-emblem), a
   Precompilation library for Ruby (used in `ember-rails`)
1. [emblem-brunch](https://github.com/machty/emblem-brunch), Emblem
   support for Brunch.io
1. [Mimosa (support for Emblem since v 0.10.1)](https://github.com/dbashford/mimosa)
1. [grunt-emblem](https://github.com/wordofchristian/grunt-emblem), Emblem support for Grunt (and Yeoman)
1. [gulp-emblem](https://github.com/Aulito/gulp-emblem), Emblem support for gulp

## Building Emblem.js

Clone the repo, then run:

```
npm install
grunt
```

This will also automatically run the test suite. 

## Syntax Highlighting

Check out [vim-emblem](https://github.com/heartsentwined/vim-emblem)
for Vim editor support for Emblem.

Otherwise, for now, please refer to syntax highlighting solutions for
[Slim](http://slim-lang.com/), which is not much different
from Ember's. At some point, we'll have something even more
custom tailored to Emblem (feel free to take a swing at it
and send in a PR).

## Reporting Bugs

If you find a bug in Emblem syntax, please try to reproduce it in
its simplest form with 
[this JSBin](http://jsbin.com/ucanam/4144/edit) before reporting an
issue, which will help me nail down the source of the issue.

[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/machty/emblem.js/trend.png)](https://bitdeli.com/free "Bitdeli Badge")

