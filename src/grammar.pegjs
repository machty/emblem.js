
{
  // Returns a new MustacheNode with a new preceding param (id).
  function unshiftParam(mustacheNode, helperName, newHashPairs) {

    var hash = mustacheNode.hash;

    // Merge hash.
    if(newHashPairs) {
      hash = hash || new Handlebars.AST.HashNode([]);

      for(var i = 0; i < newHashPairs.length; ++i) {
        hash.pairs.push(newHashPairs[i]);
      }
    }

    var params = [mustacheNode.id].concat(mustacheNode.params);
    params.unshift(new Handlebars.AST.IdNode([helperName]));
    return new Handlebars.AST.MustacheNode(params, hash, !mustacheNode.escaped);
  }
}

start = content

content = statements:statement*
{
  // Coalesce all adjacent ContentNodes into one.

  var compressedStatements = [];
  var buffer = [];

  for(var i = 0; i < statements.length; ++i) {
    var nodes = statements[i];

    for(var j = 0; j < nodes.length; ++j) {
      var node = nodes[j]
      if(node.type === "content") {
        if(node.string) {
          // Ignore empty strings (comments).
          buffer.push(node.string);
        }
        continue;
      } 

      // Flush content if present.
      if(buffer.length) {
        compressedStatements.push(new Handlebars.AST.ContentNode(buffer.join('')));
        buffer = [];
      }
      compressedStatements.push(node);
    }
  }

  if(buffer.length) { 
    compressedStatements.push(new Handlebars.AST.ContentNode(buffer.join(''))); 
  }

  return compressedStatements;
}

invertibleContent = c:content i:( DEDENT 'else' _ TERM INDENT c:content {return c;})?
{ 
  return new Handlebars.AST.ProgramNode(c, i || []);
}

// A statement is an array of nodes.
// Often they're single-element arrays, but for things
// like text lines, there might be multiple elements.
statement
  = comment
  / htmlElement
  / textLine
  / mustache

htmlElement
  = htmlElementMaybeBlock / htmlElementWithInlineContent

// Returns [MustacheNode] or [BlockNode]
mustache 
  = m:(explicitMustache / lineStartingMustache) 
{ 
  return [m]; 
}

comment 
  = '/' lineContent TERM ( INDENT (lineContent TERM)+ DEDENT )? { return []; }

lineStartingMustache 
  = capitalizedLineStarterMustache / mustacheMaybeBlock

capitalizedLineStarterMustache 
  = &[A-Z] ret:mustacheMaybeBlock
{
  // TODO make this configurable
  var defaultCapitalizedHelper = 'view';

  if(ret.mustache) {
    // Block. Modify inner MustacheNode and return.

    // Make sure a suffix modifier hasn't already been applied.
    var ch = ret.mustache.id.string.charAt(0);
    if(!ch.match(/[A-Z]/)) return ret;

    ret.mustache = unshiftParam(ret.mustache, defaultCapitalizedHelper);
    return ret;
  } else {

    // Make sure a suffix modifier hasn't already been applied.
    var ch = ret.id.string.charAt(0);
    if(!ch.match(/[A-Z]/)) return ret;

    return unshiftParam(ret, defaultCapitalizedHelper);
  }
}

htmlElementMaybeBlock 
  = h:htmlTagAndOptionalAttributes _ TERM c:(INDENT content DEDENT)? 
{ 
  var ret = h[0];
  if(c) {
    ret = ret.concat(c[1]);
  }
  ret.push(h[1]);

  return ret;
}

htmlElementWithInlineContent 
  = h:htmlTagAndOptionalAttributes ' ' c:htmlInlineContent multilineContent:(INDENT textNodes+ DEDENT)?
{ 
  // h is [[open tag content], closing tag ContentNode]
  var ret = h[0];
  if(c) {
    ret = ret.concat(c);
  }

  if(multilineContent) {
    // Handle multi-line content, e.g.
    // span Hello, 
    //      This is valid markup.

    multilineContent = multilineContent[1];
    for(var i = 0; i < multilineContent.length; ++i) {
      ret = ret.concat(multilineContent[i]);
    }
  }

  // Push the ContentNode
  ret.push(h[1]);

  return ret;
}  

mustacheMaybeBlock 
  = mustacheNode:inMustache _ TERM block:(INDENT invertibleContent DEDENT)? 
{ 
  if(!block) return mustacheNode;
  var programNode = block[1];
  return new Handlebars.AST.BlockNode(mustacheNode, programNode, programNode.inverse, mustacheNode.id);
}

explicitMustache 
  = e:equalSign ret:mustacheMaybeBlock
{
  var mustache = ret.mustache || ret;
  mustache.escaped = e;
  return ret;
}

inMustache
  = path:pathIdNode tm:trailingModifier? params:inMustacheParam* hash:hash? 
{ 
  params.unshift(path);

  var mustacheNode = new Handlebars.AST.MustacheNode(params, hash); 

  if(tm == '!') {
    return unshiftParam(mustacheNode, 'unbound');
  } else if(tm == '?') {
    return unshiftParam(mustacheNode, 'if');
  } else if(tm == '^') {
    return unshiftParam(mustacheNode, 'unless');
  }

  return  mustacheNode;
}

// TODO: this
modifiedParam = p:param m:trailingModifier
{ 
  var ret = new String(p);
  ret.trailingModifier = m;
  return ret;
}

inMustacheParam
  = _ p:param { return p; }

trailingModifier "TrailingModifier"
  = [!?*^]

hash 
  = h:hashSegment+ { return new Handlebars.AST.HashNode(h); }

pathIdent "PathIdent"
  = '..' / '.' / s:$[a-zA-Z0-9_$-]+ !'=' { return s; }

key "Key"
  = ident

hashSegment
  = _ h:( key '=' pathIdNode
        / key '=' stringNode 
        / key '=' integerNode 
        / key '=' booleanNode ) { return [h[0], h[2]]; }

param
  = pathIdNode
  / stringNode
  / integerNode 
  / booleanNode 

path = first:pathIdent tail:(seperator p:pathIdent { return p; })* 
{
  var ret = [first];
  for(var i = 0; i < tail.length; ++i) {
    //ret = ret.concat(tail[i]);
    ret.push(tail[i]);
  }
  return ret;
}

seperator "PathSeparator" = [\/.]

pathIdNode  = v:path    { return new Handlebars.AST.IdNode(v); }
stringNode  = v:string  { return new Handlebars.AST.StringNode(v); }
integerNode = v:integer { return new Handlebars.AST.IntegerNode(v); }
booleanNode = v:boolean { return new Handlebars.AST.BooleanNode(v); }

boolean "Boolean" = 'true' / 'false'

integer "Integer" = s:$[0-9]+ { return parseInt(s); }

string = p:('"' hashDoubleQuoteStringValue '"' / "'" hashSingleQuoteStringValue "'") { return p[1]; }

hashDoubleQuoteStringValue = $[^"}\n\uEFFF]*
hashSingleQuoteStringValue = $[^'}\n\uEFFF]*

alpha = [A-Za-z]

// returns an array of nodes.
htmlInlineContent 
  = m:explicitMustache { return [m]; } 
  / t:textNodes

textLine = ('|' ' '? / &'<') nodes:textNodes indentedNodes:(INDENT t:textNodes DEDENT { return t; })*
{ 
  for(var i = 0; i < indentedNodes.length; ++i) {
    nodes = nodes.concat(indentedNodes[i]);
  }
  return nodes; 
}

textNodes = first:preMustacheText? tail:(rawMustache preMustacheText?)* TERM
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

rawMustache = rawMustacheUnescaped / rawMustacheEscaped

rawMustacheSingle
 = singleOpen _ m:inMustache _ singleClose { m.escaped = true; return m; }

rawMustacheEscaped   
 = doubleOpen _ m:inMustache _ doubleClose { m.escaped = true; return m; }
 / hashStacheOpen _ m:inMustache _ hashStacheClose { m.escaped = true; return m; }

rawMustacheUnescaped 
 = tripleOpen _ m:inMustache _ tripleClose { m.escaped = false; return m; }

preMustacheText 
  = a:preMustacheUnit+ { return new Handlebars.AST.ContentNode(a.join('')); }

preMustacheUnit
  = !(tripleOpen / doubleOpen / hashStacheOpen) c:[^\n\uEFFF] { return c; }

// Support for div#id.whatever{ bindAttr whatever="asd" }
inTagMustache = rawMustacheSingle / rawMustacheUnescaped / rawMustacheEscaped

singleOpen "SingleMustacheOpen" = '{'
doubleOpen "DoubleMustacheOpen" = '{{'
tripleOpen "TripleMustacheOpen" = '{{{'
singleClose "SingleMustacheClose" = '}'
doubleClose "DoubleMustacheClose" = '}}'
tripleClose "TripleMustacheClose" = '}}}'

hashStacheOpen  "InterpolationOpen"  = '#{'
hashStacheClose "InterpolationClose" = '}'

// Returns whether the mustache should be escaped.
equalSign = "==" ' '? { return false; } / "=" ' '? { return true; } 

// #div.clasdsd{ bindAttr class="funky" } attr="whatever" Hello
htmlTagAndOptionalAttributes
  = h:(h:htmlTagName s:shorthandAttributes? m:inTagMustache* f:fullAttribute* { return [h, s, m, f]; }
      / s:shorthandAttributes m:inTagMustache* f:fullAttribute* { return [null, s, m, f] } )
{
  var tagName = h[0] || 'div',
      shorthandAttributes = h[1] || [],
      inTagMustaches = h[2],
      fullAttributes = h[3],
      id = shorthandAttributes[0],
      classes = shorthandAttributes[1];

  var tagOpenContent = [];
  tagOpenContent.push(new Handlebars.AST.ContentNode('<' + tagName));

  if(id) {
    tagOpenContent.push(new Handlebars.AST.ContentNode(' id="' + id + '"'));
  }

  if(classes && classes.length) {
    tagOpenContent.push(new Handlebars.AST.ContentNode(' class="' + classes.join(' ') + '"'));
  }

  // Pad in tag mustaches with spaces.
  for(var i = 0; i < inTagMustaches.length; ++i) {
    tagOpenContent.push(new Handlebars.AST.ContentNode(' '));
    tagOpenContent.push(inTagMustaches[i]);
  }

  for(var i = 0; i < fullAttributes.length; ++i) {
    tagOpenContent = tagOpenContent.concat(fullAttributes[i]);
  }
  tagOpenContent.push(new Handlebars.AST.ContentNode('>'));

  return [tagOpenContent, new Handlebars.AST.ContentNode('</' + tagName + '>')];
}

shorthandAttributes 
  = attributesAtLeastID / attributesAtLeastClass

attributesAtLeastID 
  = id:idShorthand classes:classShorthand* { return [id, classes]; }

attributesAtLeastClass 
  = classes:classShorthand+ { return [null, classes]; }

fullAttribute
  = ' '+ a:(actionAttribute / boundAttribute / normalAttribute)  
{
  return [new Handlebars.AST.ContentNode(' '), a]; 
}

boundAttributeValueText = $[A-Za-z.:0-9]+ 

// Value of an action can be an unwrapped string, or a single or double quoted string
actionValue
  = quotedActionValue
  / id:pathIdNode { return new Handlebars.AST.MustacheNode([id]); }

quotedActionValue = p:('"' inMustache '"' / "'" inMustache "'") { return p[1]; }

actionAttribute
  = event:knownEvent '=' mustacheNode:actionValue
{
  // Unshift the action helper and augment the hash
  return unshiftParam(mustacheNode, 'action', [['on', new Handlebars.AST.StringNode(event)]]);
}

boundAttribute
  = key:key '=' value:boundAttributeValueText
{ 
  var hashNode = new Handlebars.AST.HashNode([[key, new Handlebars.AST.StringNode(value)]]);
  var params = [new Handlebars.AST.IdNode(['bindAttr'])];

  return new Handlebars.AST.MustacheNode(params, hashNode);
}

normalAttribute
  = key:key '=' value:string
{ 
  var s = key + '=' + '"' + value + '"';
  return new Handlebars.AST.ContentNode(s);
}

attributeName = $attributeChar*
attributeValue = string / param 


attributeChar = alpha / [0-9] /'_' / '-'

idShorthand = '#' t:cssIdentifier { return t;}
classShorthand = '.' c:cssIdentifier { return c; }

cssIdentifier "CSSIdentifier" = ident

ident = nmstart:nmstart nmchars:$nmchar* { return nmstart + nmchars; }

nmchar = [_a-zA-Z0-9-] / nonascii
nmstart = [_a-zA-Z] / nonascii
nonascii = [\x80-\xFF]

htmlTagName "KnownHTMLTagName"
  = '%' c:$tagChar+ { return c; }
  / knownTagName

tagChar = [:_a-zA-Z0-9-]

knownTagName "KnownHTMLTagName" =
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

knownEvent "a JS event" =
"touchStart"/"touchMove"/"touchEnd"/"touchCancel"/
"keyDown"/"keyUp"/"keyPress"/"mouseDown"/"mouseUp"/
"contextMenu"/"click"/"doubleClick"/"mouseMove"/
"focusIn"/"focusOut"/"mouseEnter"/"mouseLeave"/
"submit"/"input"/"change"/"dragStart"/
"drag"/"dragEnter"/"dragLeave"/
"dragOver"/"drop"/"dragEnd"

INDENT "INDENT" = "\uEFEF" { return ''; }
DEDENT "DEDENT" = "\uEFFE" { return ''; }
TERM  "LineEnd" = "\n" "\uEFFF"

__ "RequiredWhitespace"
  = whitespace+

_ "OptionalWhitespace"
  = whitespace*

whitespace "InlineWhitespace"
  = [ \t]

lineContent = $[^\uEFFF\uEFFE\uEFEF\n]*

