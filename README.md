# Emblem: Handlebars + Indentation + Ember-compatibility

Emblem.js is an indentation-based templating language that compiles
to Handlebars. It is therefore

1. Efficiently/easily precompilable
1. Compilable in the browser
1. Fully compatible with Ember.js's auto-updating templates
1. Way more fun to write/maintain than `{{mustached}}`'d HTML

Check out the Emblem.js docs site
[http://www.emblemjs.com](http://www.emblemjs.com).

## Syntax Examples

- [Read the syntax documentation](http://www.emblemjs.com/syntax).
- [Check out this JSBin.](http://jsbin.com/ulegec/47/edit)
- Check out this [demo](http://emblem-test.herokuapp.com/) of 
  an [ember-rails](https://github.com/machty/ember-rails) site
  with Emblem enabled.

![Emblem.js Syntax](https://s3.amazonaws.com/machty/emblem-sample.png)

## Using Emblem in your application

You can use Emblem to compile either to vanilla Handlebars or Emberized
Handlebars. Let's assume you're compiling to Emberized Handlebars
for use with an Ember app.

### Compiling in the Browser 

Follow the pattern in [this JSBin](http://jsbin.com/ulegec/47/edit):

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

### Via Rake Pipeline

Coming extremely soon.

### All Emblem Plugins

1. [emblem-rails](https://github.com/alexspeller/emblem-rails)
1. [barber-emblem](https://github.com/machty/barber-emblem), a
   Precompilation library for Ruby (used in `ember-rails`)
1. [emblem-brunch](https://github.com/machty/emblem-brunch), Emblem
   support for Brunch.io
1. [Mimosa (support for Emblem since v 0.10.1)](https://github.com/dbashford/mimosa)
1. [grunt-emblem](https://github.com/wordofchristian/grunt-emblem), Emblem support for Grunt (and Yeoman)

# Building Emblem.js

Clone the repo, then run:

```
bundle
rake
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

## TODO / Contribute

- Syntax suggestions / improvements
- Syntax highlighting
- Rake pipeline
- Plugins for all sorts of frameworks
- Refactor the code to be cross-platform (browser/Node/etc).
  It currently is now, it's just mad ugly.

Pull Requests absolutely welcome and encouraged, just don't send me
non-trivial changes without the test cases to back them up.
