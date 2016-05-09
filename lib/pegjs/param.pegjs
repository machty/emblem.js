@import "./path-id-node.pegjs" as pathIdNode

start = param

param
  = booleanNode
  / integerNode
  / pathIdNode
  / stringNode

booleanNode = v:boolean { return new AST.BooleanNode(v); }
boolean "Boolean" = 'true' / 'false'

integerNode = v:integer { return new AST.NumberNode(v); }
integer "Integer" = s:$('-'? [0-9]+) { return parseInt(s); }

stringNode  = v:string  { return new AST.StringNode(v); }
string = p:('"' hashDoubleQuoteStringValue '"' / "'" hashSingleQuoteStringValue "'") { return p[1]; }


/**
  Duplicates
*/
hashDoubleQuoteStringValue = $(!(TERM) [^"}])*
hashSingleQuoteStringValue = $(!(TERM) [^'}])*

TERM  "LineEnd" = "\r"? t:. &{ return TERM_SYMBOL == t; } "\n" { return false; }
