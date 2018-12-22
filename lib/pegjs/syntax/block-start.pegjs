@import "../whitespace.pegjs" as _

start = blockStart

blockStart
  = "as" _ blockStartPipe

blockStartPipe 'block param starting pipe'
  = "|"
