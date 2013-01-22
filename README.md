# NOTE: THIS IS ALL EXTREMELY ALPHA (1/22/13)

About 60% feature complete, but rapidly approaching the finish line.

## Emblem: Ember.js-infused Markup Language

Emblem.js is an indentation-based templating language that supports
Ember.js's auto-updating templates and offers lots of Ember-targeting
syntactic sugar that can be disabled in non-Ember settings.

[See it in action.](http://jsfiddle.net/machty/u6nVt/2/)

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

```emblem
.container
  .row
    .span6
      App.MenuView
    .span6
      h1 = name
 
      / Assume BlurbView has a layout. 
      App.BlurbView == wysiwyg_description
 
      if loggedIn
        p User is logged in!
      else
        p User ain't logged in!

      | Text without an html element
 
      h2 Last Post
      with lastPost
        h3 = title
        p = body
 
      / The following syntax is awesome but not a high priority
      ul#posts = each posts
        li
          h4 = title
          p = body
```

# Building Emblem.js

Clone the repo, then run:

```
bundle
rake
```

This will also automatically run the test suite. 

## TODO

1. Support for stacked-element shorthand, a la Sass: `.navbar .navbar-inner ul.nav` 
   will nest the three elements inside each other as well as allow 
   for the following line(s) to be indented as nested content. 
   Useful for hyper-nested Bootstrap apps.
1. `bindAttr` and other in-tag handlebars support
1. Slash comments, both single line and multiline
1. Support for partials (not a priority since that syntax is never used in Ember)
1. Intelligent self-closing of tags (presently prints out `<input></input>`)
1. Intelligent placement of spaces between elements, language support
   for this
1. Support for actions.
1. More tests.
1. Syntax highlighting (see below)

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

## Contribute

I'm not yet ready to accept PR's yet, but stay tuned.
