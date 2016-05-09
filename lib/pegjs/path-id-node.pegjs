start = pathIdNode

pathIdNode = v:path
{
  var last = v[v.length - 1];
  var idNode;

  // Support for data keywords that are prefixed with @ in the each
  // block helper such as @index, @key, @first, @last
  if (last.part.charAt(0) === '@') {
    last.part = last.part.slice(1);
    idNode = new AST.IdNode(v);
    var dataNode = new AST.DataNode(idNode);
    return dataNode;
  }

  var match;
  var suffixModifier;

  // FIXME probably need to handle this better?
  if (match = last.part.match(/!$/)) {
    last.part = 'unbound ' + last.part.slice(0, -1);
  }
  if(match = last.part.match(/[\?\^]$/)) {
    suffixModifier = match[0];
    throw "unhandled path terminated: " + suffixModifier;
  }

  return last.part;
}

path = first:pathIdent tail:(s:separator p:pathIdent { return { part: p, separator: s }; })*
{
  var ret = [{ part: first }];
  for(var i = 0; i < tail.length; ++i) {
    ret.push(tail[i]);
  }
  return ret;
}

pathIdent "PathIdent"
  = '..'
  / '.'
  / s:$[a-zA-Z0-9_$\-!\?\^@]+ !'=' { return s; }
  / '[' segmentLiteral:$[^\]]* ']' { return segmentLiteral; }

separator "PathSeparator" = [\/.]
