
### 1/24/2013: all test cases pass now, baseline features implemented

Please see the TODO section below for how you might help get the ball
rolling with this language.

## Emblem: The Ember.js-infused Markup Language

Emblem.js is an indentation-based templating language that supports
Ember.js's auto-updating templates and offers lots of Ember-targeting
syntactic sugar that can be disabled in non-Ember settings.

## Features

1. Indentation-based (inspired by Slim, HAML, Jade, etc), which keeps
   your code neatly indented and prevents you from having to write
   closing HTML tags.
1. Written in JavaScript; templates can be compiled in the browser or in
   Node. 
1. Internally compiles to Handlebars, so all of the data-binding,
   auto-updating functionality that you'd expect out of Ember will work.
   Note that Handlebars is the only templating language that Ember
   supports (that is, if you want auto-updating templates, which you
   do).
1. Lots of enhancements and shortcuts that favor Ember.js, but can be
   disabled for use in non-Ember settings.

## Example

[Check out this JSBin.](http://jsbin.com/ulegec/40/edit)

## Using Emblem in your application

The `emblem.js` is essentially a superset drop-in replacement for
`handlebars.js`. To use it with an Ember project, simply replace
`handlebars.js` with `emblem.js`, and you're good to go. 

NOTE: Until [this fix](https://github.com/emberjs/ember.js/pull/1861),
there was no way to Emblem to link into Ember's load hooks, which is
required for the the `x-emblem` script tags to be compiled at Ember app
launch.

Once we have the ability to precompile templates, the only JS you'll
need is `handlebars.runtime.js`; there is no `emblem.runtime.js` because
there isn't any additional code that Emblem requires once the templates
are compiled.

# Building Emblem.js

Clone the repo, then run:

```
bundle
rake
```

This will also automatically run the test suite. 

## Syntax Highlighting

For now, please refer to syntax highlighting solutions for
[Slim](http://slim-lang.com/), which is not much different
from Ember's. At some point, we'll have something even more
custom tailored to Emblem (feel free to take a swing at it
and send in a PR).

Vim users with Slim syntax highlighting can set this in
their `.vimrc`s:

```
au BufNewFile,BufRead *.emblem set filetype=slim
```

## TODO / Contribute

So many things. See the issues section.

PRs are welcome and encouraged!

