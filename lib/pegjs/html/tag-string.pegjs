@import "../non-separator-colon.pegjs" as nonSeparatorColon

start = tagString

tagString 'valid tag string'
  = c:$tagChar+

tagChar = [_a-zA-Z0-9-] / nonSeparatorColon / '@'
