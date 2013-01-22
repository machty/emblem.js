## Emblem: Ember.js-infused Markup Language

Stay the hell tuned.

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
