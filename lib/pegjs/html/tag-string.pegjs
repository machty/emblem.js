@import "../non-separator-colon.pegjs" as nonSeparatorColon

start = tagString

tagString
  = c:$tagChar+
tagChar = [_a-zA-Z0-9-] / nonSeparatorColon / '@'
