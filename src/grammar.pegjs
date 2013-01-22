
start = content
content = statement*

statement
  = comment
  / html
  / mustache

html
  = htmlMaybeBlock
  / htmlWithInlineContent
  / t:textLine { return t; }

mustache
  = f:forcedMustache { return f; }
  / mustacheMaybeBlock 

comment
  = '/' lineContent TERM ( INDENT (lineContent TERM)+ DEDENT )? { return ""; }





htmlMaybeBlock = h:htmlAttributesOnly c:(INDENT content DEDENT)? 
{ 
  h.nodes = c ? c[1] : [];
  return h; 
}

htmlAttributesOnly = t:htmlTag _ TERM { t.nodes = []; return t; }  

htmlWithInlineContent = t:htmlTag ws c:htmlInlineContent TERM { t.nodes = c; return t; }  

mustacheMaybeBlock = t:mustacheContent TERM c:(INDENT content DEDENT)? 
{ 
  t.nodes = c ? c[1] : [];
  return t; 
}

forcedMustache = _ e:equalSign c:mustacheMaybeBlock { c.forced = true; c.escaped = e; return c; }

mustacheContent = &[A-Za-z] p:params h:hash 
{
  return { type: 'mustache', params:p, hash:h };
}

params = p:(_ param:param !'=' _ {return param;})+ { return p; }
param = p:paramChar+ { return p.join(''); }
paramChar = alpha / '_' / '-' / '.'

hash = h:(_ k:param '=' v:hashValue _ { return { key: k, value: v }; } )*
{
  var ret = {};
  for(var i = 0; i < h.length; ++i) {
    var pair = h[i];
    ret[pair.key] = pair.value;
  }
  return ret;
}

hashValue = string / param / integer
integer = s:[0-9]+ { return parseInt(s.join('')); }

string = p:('"' hashDoubleQuoteStringValue '"' / "'" hashSingleQuoteStringValue "'") { return p.join(''); }
hashDoubleQuoteStringValue = s:[^"}]* { return s.join(''); }
hashSingleQuoteStringValue = s:[^'}]* { return s.join(''); }

alpha = [A-Za-z]

htmlInlineContent
 = m:forcedMustache  { return [m]; }
 / textNodes

textLine = '|' ' '? nodes:textNodes TERM indentedNodes:( INDENT n:(n:textNodes TERM { return n;})+ DEDENT { return n; })*
{ 
  if(indentedNodes.length) {
    nodes = nodes.concat(indentedNodes[0][0]);
  }
  return nodes; 
}

textNodes = first:preMustacheText? tail:(rawMustache preMustacheText?)* 
{
  var ret = [];
  if(first) { ret.push(first); } 
  for(var i = 0; i < tail.length; ++i) {
    var t = tail[i];
    ret.push(t[0]);
    if(t[1]) { ret.push(t[1]); }
  }
  return ret;
}

rawMustache = rawMustacheEscaped / rawMustacheUnescaped
rawMustacheUnescaped = '{{' _ m:mustacheContent _ '}}' { m.forced = true; return m; }
rawMustacheEscaped   = '{{{' _ m:mustacheContent _ '}}}' { m.forced = true; m.escaped = true; return m; }

preMustacheText = a:[^{\uEFFF]+ { return a.join(''); }


equalSign = "==" _ { return true; } / "=" _  { return false; } 

// TODO: how to DRY this?
htmlTag
  = h:htmlTagName t:attrShortcuts? { return { type: 'html', tagName: h,    attrs:(t||{})  }; }
  / t:attrShortcuts                { return { type: 'html', tagName: null, attrs: t  }; }

attrShortcuts
= id:idShortcut classes:classShortcut* { 
  var ret = { id: id };
  var classString = classes.join(' ');
  if(classString) {
    ret['class'] = classString;
  }
  return ret;
}
/ classes:classShortcut+ { 

  return { 'class': classes.join(' ') }; 
}

idShortcut = '#' t:cssIdentifier { return t;}
classShortcut = '.' c:cssIdentifier { return c; }


cssIdentifier = ident

ident = nmstart:nmstart nmchars:nmchar* { return nmstart + nmchars.join(""); }

nmchar = [_a-zA-Z0-9-] / nonascii
nmstart = [_a-zA-Z] / nonascii
nonascii = [\x80-\xFF]

htmlTagName "a valid HTML tag name" =
"figcaption"/"blockquote"/"plaintext"/"textarea"/"progress"/
"optgroup"/"noscript"/"noframes"/"frameset"/"fieldset"/
"datalist"/"colgroup"/"basefont"/"summary"/"section"/
"marquee"/"listing"/"isindex"/"details"/"command"/
"caption"/"bgsound"/"article"/"address"/"acronym"/
"strong"/"strike"/"spacer"/"source"/"select"/
"script"/"output"/"option"/"object"/"legend"/
"keygen"/"iframe"/"hgroup"/"header"/"footer"/
"figure"/"center"/"canvas"/"button"/"applet"/"video"/
"track"/"title"/"thead"/"tfoot"/"tbody"/"table"/
"style"/"small"/"param"/"meter"/"label"/"input"/
"frame"/"embed"/"blink"/"audio"/"aside"/"time"/
"span"/"samp"/"ruby"/"nobr"/"meta"/"menu"/
"mark"/"main"/"link"/"html"/"head"/"form"/
"font"/"data"/"code"/"cite"/"body"/"base"/
"area"/"abbr"/"xmp"/"wbr"/"var"/"sup"/
"sub"/"pre"/"nav"/"map"/"kbd"/"ins"/
"img"/"div"/"dir"/"dfn"/"del"/"col"/
"big"/"bdo"/"bdi"/"ul"/"tt"/"tr"/"th"/"td"/
"rt"/"rp"/"ol"/"li"/"hr"/"h6"/"h5"/"h4"/
"h3"/"h2"/"h1"/"em"/"dt"/"dl"/"dd"/"br"/
"u"/"s"/"q"/"p"/"i"/"b"/"a"

INDENT "INDENT" = "\uEFEF" { return ''; }
DEDENT "DEDENT" = "\uEFFE" { return ''; }
TERM  "TERM" = "\uEFFF" { return ''; }

__ "required whitespace"
  = whitespace+

_ "whitespace"
  = whitespace*

// Whitespace is undefined in the original JSON grammar, so I assume a simple
// conventional definition consistent with ECMA-262, 5th ed.
whitespace
  = [ \t\n\r]

ws = whitespace

lineContent = a:[^\uEFFF\uEFFE\uEFEF]* { return a.join(''); }

