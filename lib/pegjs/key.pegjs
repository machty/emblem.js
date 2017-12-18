@import "./nmchar.pegjs" as nmchar

start = key

key "Key"
  = $((nmchar / ':' / '.' / '@')*)
