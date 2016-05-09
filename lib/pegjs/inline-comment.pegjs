@import "./line-content.pegjs" as lineContent

start = inlineComment

inlineComment
  = '/' lineContent
