
start = content

content = statements

statements
 = statement*

statement
  = html
  /*/ mustache*/

html
  = htmlMaybeBlock
  / htmlWithInlineContent
  / t:textLine { return t; }

mustache
  = f:forcedMustache { return f; }
  / mustacheMaybeBlock 

htmlMaybeBlock = h:htmlAttributesOnly c:(INDENT content DEDENT)? 
{ 
  h.nodes = c ? c[1] : [];
  return h; 
}

htmlAttributesOnly = t:htmlTag _ TERM { t.nodes = []; return t; }  

htmlWithInlineContent = t:htmlTag ws c:htmlInlineContent { t.nodes = c; return t; }  

mustacheMaybeBlock = t:mustacheContent TERM c:(INDENT content DEDENT)? 
{ 
  t.nodes = c ? c[1] : [];
  return t; 
}

forcedMustache = _ e:equalSign c:mustacheMaybeBlock { c.escaped = e; return c; }

mustacheContent = &[A-Za-z] c:(!(TERM/[{}]) c:. {return c; })+ 
{
  var ret = { type: 'mustache', content: c.join('') };
  return ret;
}

htmlInlineContent
 = m:forcedMustache  { return [m]; }
 / textNodes

textLine = '|' ' '? nodes:textNodes TERM { return nodes; }

/*
  textNodes is invoked either after a | at the start of a line, or
  on the same line as an html element if there's no = sign
  to trigger mustache.
  It would just be a single text node, except mustache can
  be embedded in the text a la:
    h1 Hello {{name}}, you rule!  [context, mustache, content]
    p {{salutation}}, douchebag!  [mustache, content]
    p {{salutation}}, douc<span>h</span>ebag!  [mustache, content]
  Note that only mustache splits up the otherwise single node array of text.
  HTML is just treated as part of the text, no need to split into nodes.
*/
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
rawMustacheUnescaped = '{{' _ m:mustacheContent _ '}}' { return m; }
rawMustacheEscaped   = '{{{' _ m:mustacheContent _ '}}}' { m.escaped = true; return m; }

preMustacheText
 = a:[^{\uEFFF]+ { return a.join(''); }

textContent
 = c:(!TERM c:. {return c; })+ {return c.join('');}

preTermText
 = c:(!TERM c:. {return c; })+ {return c.join('');}


equalSign = "==" _ { return true; } / "=" _  { return false; } 

notTerm
  = c:(!TERM c:. { console.log(c);return c;})* { return c.join(''); }

htmlTag
  = h:htmlTagName t:attrShortcuts { return { type: 'html', tagName: h,    attrs: t  }; }
  / h:htmlTagName                 { return { type: 'html', tagName: h,    attrs: {} }; }
  / t:attrShortcuts               { return { type: 'html', tagName: null, attrs: t  }; }

attrShortcuts
  = id:idShortcut classes:classShortcut*  { return { id: id, 'classes': classes }; }
  / classes:classShortcut+                { return { 'classes': classes }; }

idShortcut
  = '#' t:cssIdentifier { return t;}

classShortcut
  = '.' c:cssIdentifier { return c; }

cssIdentifier = ident

ident
  = nmstart:nmstart nmchars:nmchar* {
      return nmstart + nmchars.join("");
    }

genTerminator = ' ' / TERM

nmchar
  = [_a-zA-Z0-9-]
  / nonascii


nonascii
  = [\x80-\xFF]

nmstart
  = [_a-zA-Z]
  / nonascii

indent  = s:" "* {
  return indent(s) 
}

text    = c:[^\n]* { 
  return c.join("")
}


htmlTagName "a valid HTML tag name"
  =
t:("figcaption"/"blockquote"/"plaintext"/"textarea"/"progress"/
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
"u"/"s"/"q"/"p"/"i"/"b"/"a") {return t;}

INDENT "INDENT" = "\uEFEF" { return ''; }
DEDENT "DEDENT" = "\uEFFE" { return ''; }
TERM  "TERM" = "\uEFFF" { return ''; }

/*
INDENT = "INDENT" { return ''; }
DEDENT = "DEDENT" { return ''; }
TERM = "TERM" { return ''; }
*/

__ "required whitespace"
  = whitespace+

_ "whitespace"
  = whitespace*

// Whitespace is undefined in the original JSON grammar, so I assume a simple
// conventional definition consistent with ECMA-262, 5th ed.
whitespace
  = [ \t\n\r]

ws = whitespace
