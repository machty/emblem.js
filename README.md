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





Small examples:

```
.container

  .row
    p Hello


p john=frank bob=sally class="gnarly" id="football"
  data-balls="funbags" shittermetimbers="bloop"
    span I hope you die

```

[ DOCUMENT,
  sourceElements: [
  ]
]


