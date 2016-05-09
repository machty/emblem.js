@import "../whitespace.pegjs" as _

start = blockStart

blockStart = "as" _ "|"
