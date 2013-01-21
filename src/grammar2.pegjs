{ var indentStack = [], indent = ""; }

start
  = INDENT? l:line
    { return l; }

line
  = SAMEDENT line:(!EOL c:. { return c; })+ EOL?
    children:( INDENT c:line* DEDENT { return c; })?
    { var o = {}; o[line] = children; return children ? o : line.join(""); }

EOL
  = "\r\n" / "\n" / "\r"

SAMEDENT
  = i:[ \t]* &{ return i.join("") === indent; }

INDENT
  = i:[ \t]+ &{ return i.length > indent.length; }
    { indentStack.push(indent); indent = i.join(""); pos = offset; }

DEDENT
  = { indent = indentStack.pop(); }
