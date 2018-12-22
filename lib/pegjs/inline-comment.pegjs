@import "./whitespace.pegjs" as _
@import "./line-content.pegjs" as lineContent

start = inlineComment

inlineComment
  = _ '/' lineContent
