@import "./nmchar.pegjs" as nmchar

start = key

key "Attribute Key"
  = $((nmchar / ':' / '.' / '@' / '$')*)
