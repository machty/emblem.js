


start = sourceLine* ignorableLine* { return sourceLine; }

sourceLine = ignorableLine* s:sourceContent newline? { return s; }

sourceContent
  = el:htmlElement { return el;}
  / text

hbInvocation
  = t:text { return t; }

htmlElement
  = el:htmlElementOneLiner       {return el;}
  / el:htmlElementWithoutContent {return el;}

htmlElementOneLiner = el:htmlElementOpenTag t:text { 
  el.oneLiner = true; 
  return el;
}

htmlElementWithoutContent
  = htmlElementOpenTag

htmlElementOpenTag
  = h:htmlTagName t:tagShortcuts  { return { tagName: h,    attrs: t  }; }
  / h:htmlTagName                 { return { tagName: h,    attrs: {} }; }
  / t:tagShortcuts                { return { tagName: null, attrs: t  }; }

tagShortcuts
  = id:idShortcut? classes:classShortcut* {

  var attrs = {};
  if(id) { attrs.id = id; }
  if(classes.length) { attrs['class'] = classes; }

  return attrs;
}

classShortcut
  = '.' c:cssIdentifier { return c; }

cssIdentifier = ident

ident
  = nmstart:nmstart nmchars:nmchar* {
      return nmstart + nmchars.join("");
    }

nmchar
  = [_a-zA-Z0-9-]
  / nonascii


nonascii
  = [\x80-\xFF]

nmstart
  = [_a-zA-Z]
  / nonascii

idShortcut
  = '#' t:cssIdentifier { return t;}

ignorableLine
  = emptyLine / commentLine

emptyLine
  = indentSpace* newline

commentLine
  = indentSpace* '/' text newline

indentSpace = [ \t]

indent  = s:" "* {
  return indent(s) 
}

text    = c:[^\n]* { 
  return c.join("")
}

newline = "\n" {}

htmlTagName
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
"u"/"s"/"q"/"p"/"i"/"b"/"a") &(!(nmchar)) {return t;}

