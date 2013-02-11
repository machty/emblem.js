
{
  var handlebarsVariant = Emblem.handlebarsVariant;
  var IS_EMBER = handlebarsVariant.JavaScriptCompiler.prototype.namespace === "Ember.Handlebars";
  var AST = handlebarsVariant.AST;

  var SELF_CLOSING_TAG = {
    area: true,
    base: true,
    br: true,
    col: true,
    command: true,
    embed: true,
    hr: true,
    img: true,
    input: true,
    keygen: true,
    link: true,
    meta: true,
    param: true,
    source: true,
    track: true,
    wbr: true
  };

  var KNOWN_TAGS = { 
    figcaption: true, blockquote: true, plaintext: true, textarea: true, progress: true, 
    optgroup: true, noscript: true, noframes: true, frameset: true, fieldset: true, 
    datalist: true, colgroup: true, basefont: true, summary: true, section: true, 
    marquee: true, listing: true, isindex: true, details: true, command: true, 
    caption: true, bgsound: true, article: true, address: true, acronym: true, 
    strong: true, strike: true, spacer: true, source: true, select: true, 
    script: true, output: true, option: true, object: true, legend: true, 
    keygen: true, iframe: true, hgroup: true, header: true, footer: true, 
    figure: true, center: true, canvas: true, button: true, applet: true, video: true, 
    track: true, title: true, thead: true, tfoot: true, tbody: true, table: true, 
    style: true, small: true, param: true, meter: true, label: true, input: true, 
    frame: true, embed: true, blink: true, audio: true, aside: true, time: true, 
    span: true, samp: true, ruby: true, nobr: true, meta: true, menu: true, 
    mark: true, main: true, link: true, html: true, head: true, form: true, 
    font: true, data: true, code: true, cite: true, body: true, base: true, 
    area: true, abbr: true, xmp: true, wbr: true, var: true, sup: true, 
    sub: true, pre: true, nav: true, map: true, kbd: true, ins: true, 
    img: true, div: true, dir: true, dfn: true, del: true, col: true, 
    big: true, bdo: true, bdi: true, ul: true, tt: true, tr: true, th: true, td: true, 
    rt: true, rp: true, ol: true, li: true, hr: true, h6: true, h5: true, h4: true, 
    h3: true, h2: true, h1: true, em: true, dt: true, dl: true, dd: true, br: true, 
    u: true, s: true, q: true, p: true, i: true, b: true, a: true
  };

  var KNOWN_EVENTS = {
    "touchStart": true, "touchMove": true, "touchEnd": true, "touchCancel": true, 
    "keyDown": true, "keyUp": true, "keyPress": true, "mouseDown": true, "mouseUp": true, 
    "contextMenu": true, "click": true, "doubleClick": true, "mouseMove": true, 
    "focusIn": true, "focusOut": true, "mouseEnter": true, "mouseLeave": true, 
    "submit": true, "input": true, "change": true, "dragStart": true, 
    "drag": true, "dragEnter": true, "dragLeave": true, 
    "dragOver": true, "drop": true, "dragEnd": true
  };

  // Returns a new MustacheNode with a new preceding param (id).
  function unshiftParam(mustacheNode, helperName, newHashPairs) {

    var hash = mustacheNode.hash;

    // Merge hash.
    if(newHashPairs) {
      hash = hash || new AST.HashNode([]);

      for(var i = 0; i < newHashPairs.length; ++i) {
        hash.pairs.push(newHashPairs[i]);
      }
    }

    var params = [mustacheNode.id].concat(mustacheNode.params);
    params.unshift(new AST.IdNode([helperName]));
    return new AST.MustacheNode(params, hash, !mustacheNode.escaped);
  }
}

start = invertibleContent

invertibleContent = c:content i:( DEDENT 'else' _ TERM INDENT c:content {return c;})?
{ 
  return new AST.ProgramNode(c, i || []);
}

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
        compressedStatements.push(new AST.ContentNode(buffer.join('')));
        buffer = [];
      }
      compressedStatements.push(node);
    }
  }

  if(buffer.length) { 
    compressedStatements.push(new AST.ContentNode(buffer.join(''))); 
  }

  return compressedStatements;
}

// A statement is an array of nodes.
// Often they're single-element arrays, but for things
// like text lines, there might be multiple elements.
statement
  = comment
  / legacyPartialInvocation
  / htmlElement
  / textLine
  / mustache

legacyPartialInvocation
  = '>' _ n:legacyPartialName _ p:path? _ TERM { return new AST.PartialNode(n, p); }

legacyPartialName
  = s:$[a-zA-Z0-9_$-/]+ { return new AST.PartialNameNode(s); }


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

  // Push the closing tag ContentNode if it exists (self-closing if not)
  if(h[1]) {
    ret.push(h[1]);
  }

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

  // Push the closing tag ContentNode if it exists (self-closing if not)
  if(h[1]) {
    ret.push(h[1]);
  }

  return ret;
}  

mustacheMaybeBlock 
  = mustacheInlineBlock
  / mustacheNode:inMustache _ TERM block:(INDENT invertibleContent DEDENT)? 
{ 
  if(!block) return mustacheNode;
  var programNode = block[1];
  return new AST.BlockNode(mustacheNode, programNode, programNode.inverse, mustacheNode.id);
}

mustacheInlineBlock
  = mustacheNode:inMustache _ t:textLine
{
  var programNode = new AST.ProgramNode(t, []);
  return new AST.BlockNode(mustacheNode, programNode, programNode.inverse, mustacheNode.id);
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
  var actualParams = [];
  var attrs = {};
  var hasAttrs = false;

  // Convert shorthand html attributes (e.g. % = tagName, . = class, etc)
  for(var i = 0; i < params.length; ++i) {
    var p = params[i];
    var attrKey = p[0];
    if(attrKey == 'tagName' || attrKey == 'elementId' || attrKey == 'class') {
      hasAttrs = true;
      attrs[attrKey] = attrs[attrKey] || [];
      attrs[attrKey].push(p[1]);
    } else {
      actualParams.push(p);
    }
  }

  if(hasAttrs) {
    hash = hash || new AST.HashNode([]);
    for(var k in attrs) {
      if(!attrs.hasOwnProperty(k)) continue;
      hash.pairs.push([k, new AST.StringNode(attrs[k].join(' '))]);
    }
  }

  actualParams.unshift(path);

  var mustacheNode = new AST.MustacheNode(actualParams, hash); 

  if(tm == '!') {
    return unshiftParam(mustacheNode, 'unbound');
  } else if(tm == '?') {
    return unshiftParam(mustacheNode, 'if');
  } else if(tm == '^') {
    return unshiftParam(mustacheNode, 'unless');
  }

  return mustacheNode;
}

// TODO: this
modifiedParam = p:param m:trailingModifier
{ 
  var ret = new String(p);
  ret.trailingModifier = m;
  return ret;
}

// %div converts to tagName="div", .foo.thing converts to class="foo thing", #id converst to id="id"
htmlMustacheAttribute
  = t:tagNameShorthand  { return ['tagName', t]; }
  / i:idShorthand       { return ['elementId', i]; }
  / c:classShorthand    { return ['class', c]; }


shorthandAttributes 
  = attributesAtLeastID / attributesAtLeastClass

attributesAtLeastID 
  = id:idShorthand classes:classShorthand* { return [id, classes]; }

attributesAtLeastClass 
  = classes:classShorthand+ { return [null, classes]; }

inMustacheParam
  = _ h:(htmlMustacheAttribute / param) { return h; }

trailingModifier "TrailingModifier"
  = [!?*^]

hash 
  = h:hashSegment+ { return new AST.HashNode(h); }

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

pathIdNode  = v:path    { return new AST.IdNode(v); }
stringNode  = v:string  { return new AST.StringNode(v); }
integerNode = v:integer { return new AST.IntegerNode(v); }
booleanNode = v:boolean { return new AST.BooleanNode(v); }

boolean "Boolean" = 'true' / 'false'

integer "Integer" = s:$[0-9]+ { return parseInt(s); }

string = p:('"' hashDoubleQuoteStringValue '"' / "'" hashSingleQuoteStringValue "'") { return p[1]; }

hashDoubleQuoteStringValue = $(!(TERM) [^"}])*
hashSingleQuoteStringValue = $(!(TERM) [^'}])*

alpha = [A-Za-z]

// returns an array of nodes.
htmlInlineContent 
  = m:explicitMustache { return [m]; } 
  / t:textNodes

textLineStart 
 = s:[|`] ' '?  { return s; }
 / &'<' { return '<'; }

textLine = s:textLineStart nodes:textNodes indentedNodes:(INDENT textNodes* DEDENT)?
{ 
  if(indentedNodes) {
    indentedNodes = indentedNodes[1];
    for(var i = 0; i < indentedNodes.length; ++i) {
      nodes = nodes.concat(indentedNodes[i]);
    }
  }

  if(s == '`') {
    nodes.push(new AST.ContentNode("\n"));
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
  = a:preMustacheUnit+ { return new AST.ContentNode(a.join('')); }

preMustacheUnit
  = !(tripleOpen / doubleOpen / hashStacheOpen / DEDENT / TERM) c:. { return c; }

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
  tagOpenContent.push(new AST.ContentNode('<' + tagName));

  if(id) {
    tagOpenContent.push(new AST.ContentNode(' id="' + id + '"'));
  }

  if(classes && classes.length) {
    tagOpenContent.push(new AST.ContentNode(' class="' + classes.join(' ') + '"'));
  }

  // Pad in tag mustaches with spaces.
  for(var i = 0; i < inTagMustaches.length; ++i) {
    tagOpenContent.push(new AST.ContentNode(' '));
    tagOpenContent.push(inTagMustaches[i]);
  }

  for(var i = 0; i < fullAttributes.length; ++i) {
    tagOpenContent = tagOpenContent.concat(fullAttributes[i]);
  }

  if(SELF_CLOSING_TAG[tagName]) {
    tagOpenContent.push(new AST.ContentNode(' />'));
    return [tagOpenContent];
  } else {
    tagOpenContent.push(new AST.ContentNode('>'));
    return [tagOpenContent, new AST.ContentNode('</' + tagName + '>')];
  }
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
  return [new AST.ContentNode(' '), a]; 
}

boundAttributeValueText = $[A-Za-z.:0-9]+ 

// Value of an action can be an unwrapped string, or a single or double quoted string
actionValue
  = quotedActionValue
  / id:pathIdNode { return new AST.MustacheNode([id]); }

quotedActionValue = p:('"' inMustache '"' / "'" inMustache "'") { return p[1]; }

actionAttribute
  = event:knownEvent '=' mustacheNode:actionValue
{
  // Unshift the action helper and augment the hash
  return unshiftParam(mustacheNode, 'action', [['on', new AST.StringNode(event)]]);
}

boundAttribute
  = key:key '=' value:boundAttributeValueText
{ 
  var hashNode = new AST.HashNode([[key, new AST.StringNode(value)]]);
  var params = [new AST.IdNode(['bindAttr'])];

  return new AST.MustacheNode(params, hashNode);
}

normalAttribute
  = key:key '=' value:string
{ 
  var s = key + '=' + '"' + value + '"';
  return new AST.ContentNode(s);
}

attributeName = $attributeChar*
attributeValue = string / param 


attributeChar = alpha / [0-9] /'_' / '-'

tagNameShorthand = '%' c:cssIdentifier { return c; }
idShorthand = '#' c:cssIdentifier { return c;}
classShorthand = '.' c:cssIdentifier { return c; }

cssIdentifier "CSSIdentifier" = ident

ident = nmstart:nmstart nmchars:$nmchar* { return nmstart + nmchars; }

nmchar = [_a-zA-Z0-9-] / nonascii
nmstart = [_a-zA-Z] / nonascii
nonascii = [\x80-\xFF]

tagString 
  = c:$tagChar+

htmlTagName "KnownHTMLTagName"
  = '%' s:tagString { return s; }
  / knownTagName

knownTagName = t:tagString &{ return !!KNOWN_TAGS[t]; }  { return t; }

tagChar = [:_a-zA-Z0-9-]

knownEvent "a JS event" = t:tagString &{ return !!KNOWN_EVENTS[t]; }  { return t; }

INDENT "INDENT" = "\uEFEF" { return ''; }
DEDENT "DEDENT" = "\uEFFE" { return ''; }
TERM  "LineEnd" = "\n" "\uEFFF"

__ "RequiredWhitespace"
  = whitespace+

_ "OptionalWhitespace"
  = whitespace*

whitespace "InlineWhitespace"
  = [ \t]

lineChar = !(INDENT / DEDENT / TERM) c:. { return c; }
lineContent = $lineChar*

