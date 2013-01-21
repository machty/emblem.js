
start = content

content = statements

statements
 = statement*

/*
 NEED TO ADD TEXT NODE
 
 h1 Hello, {{name}}

 HtmlNode h1
   nodes: [
     { content: "Hello, " }
     { mustache: name }
     { content: "" } ?
   ]
  
  statements can be:
  preceded by known HTML tag, optional indented block, single line, or empty
  assumedMustache: looks like html line, but tag isn't recognized HTML element, so assumed HB
  forcedMustache: uses = or == at beginning of line
  text
  post

  htmlInlineContent: 
    '= ': mustacheContent
    else if nonempty, assume textNodes

*/

statement
  = t:htmlTag _ TERM INDENT c:content DEDENT { t.nodes = c; return t; }
  / t:htmlTag _ TERM { return t; }  
  / t:htmlTag c:htmlInlineContent TERM { t.nodes = c; return t; }  
  / textLine
  / capitalizedMustache
  / c:mustacheContent { return { type: 'mustache', content: c }; }

// Can either be block or some other thing
capitalizedMustache
  /* Check for block helper first */
  = &([A-Z]) blockableMustache { return { capitalized: true }; }

blockableMustache
  /* Check for block helper first */
  = mustacheContent _ TERM INDENT c:content DEDENT { t.nodes = c; return t; }

  /* Fall back to non-block */
  / mustacheContent _ TERM

forcedMustache
  = equalSign c:mustacheContent { return { type: 'mustache', content: c }; }

mustacheContent 
 = mustacheText

/*
Single lines are broken into multiple nodes since they can be a mixture
of text and mustaches.

can be of format:

= basdoiasd (force mustache)

*/
htmlInlineContent
 = forcedMustache
 / textNodes

textLine
  = '|' ' '? nodes:textNodes { return nodes; }

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
textNodes
  = _ { return []; }
  / (preMustacheText* '{{' '{'? mustacheContent '}}' '}'?)* post:preMustacheText*

preMustacheText
 = [^{]

textContent
 = c:(!TERM c:. {return c; })+ {return c.join('');}

preTermText
 = c:(!TERM c:. {return c; })+ {return c.join('');}

mustacheText
 = c:(!(TERM/[{}]) c:. {return c; })+ {return c.join('');}

equalSign = "=" _  { return false; } / "==" _ { return true; }

notTerm 
  = (!TERM .)*

htmlTag
  = h:htmlTagName t:attrShortcuts  { return { type: 'html', tagName: h,    attrs: t  }; }
  / h:htmlTagName                  { return { type: 'html', tagName: h,    attrs: {} }; }
  / t:attrShortcuts                { return { type: 'html', tagName: null, attrs: t  }; }

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
