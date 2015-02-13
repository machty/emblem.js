{
  var builder = options.builder;

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
    area: true, abbr: true, xmp: true, wbr: true, 'var': true, sup: true,
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

  function prepareHelper(content, escaped) {
    if (/^[A-Z]/.test(content)) {
      content = 'view '+content;
    }

    return content;
  };

  function prepareMustachValue(content){
    var parts = content.split(' '),
        first,
        match;

    // check for '!' unbound helper
    first = parts.shift();
    if (match = first.match(/(.*)!$/)) {
      parts.unshift( match[1] );
      content = 'unbound ' + parts.join(' ');
    } else {
      parts.unshift(first);
    }

    // check for '?' if helper
    first = parts.shift();
    if (match = first.match(/(.*)\?$/)) {
      parts.unshift( match[1] );
      content = 'if ' + parts.join(' ');
    } else {
      parts.unshift(first);
    }
    return content;
  }

  function castToAst(nodeOrString) {
    if (typeof nodeOrString === 'string') {
      return builder.generateText(nodeOrString);
    } else {
      return nodeOrString;
    }
  }

  function castStringsToTextNodes(possibleStrings) {
    var ret = [];
    var currentString = null;
    var possibleString;
    for(var i=0, l=possibleStrings.length; i<l; i++) {
      possibleString = possibleStrings[i];
      if (typeof possibleString === 'string') {
        currentString = (currentString || '') + possibleString;
      } else {
        if (currentString) {
          ret.push(castToAst(currentString));
          currentString = null;
        }
        ret.push(castToAst(possibleString));
      }
    }
    if (currentString) {
      ret.push(castToAst(currentString));
    }
    return ret;
  }

  function createBlockOrMustache(mustacheTuple, escaped) {
    var mustacheContent = mustacheTuple[0];
    var blockTuple = mustacheTuple[1];
    if (blockTuple) {
      var block = builder.generateBlock(mustacheContent, escaped);
      builder.enter(block);
      builder.add('childNodes', blockTuple[0]);
      if (blockTuple[1]) {
        builder.add('inverseChildNodes', blockTuple[1]);
      }
      return builder.exit();
    } else {
      return builder.generateMustache(mustacheContent, escaped);
    }
  }

  function flattenArray(first, tail) {
    var ret = [];
    if(first) {
      ret.push(first);
    }
    for(var i = 0; i < tail.length; ++i) {
      var t = tail[i];
      ret.push(t[0]);
      if(t[1]) {
        ret.push(t[1]);
      }
    }
    return ret;
  }

  function createBoundAttribute(content){
    return {
      type: 'boundAttribute',
      content: content
    };
  }

  function parseSexpr(path, params, hash){
    var actualParams = [];
    var attrs = {};
    var hasAttrs = false;

    // Convert shorthand html attributes (e.g. % = tagName, . = class, etc)
    for (var i = 0; i < params.length; ++i) {
      var p = params[i];
      var attrKey = p[0];
      if (attrKey === 'tagName' || attrKey === 'elementId' || attrKey === 'class') {
        hasAttrs = true;
        attrs[attrKey] = attrs[attrKey] || [];
        attrs[attrKey].push(p[1]);
      } else {
        actualParams.push(p);
      }
    }

    if (hasAttrs) {
      hash = hash || new AST.HashNode([]);
      for(var k in attrs) {
        if(!attrs.hasOwnProperty(k)) continue;
        hash.pairs.push([k, new AST.StringNode(attrs[k].join(' '))]);
      }
    }

    actualParams.unshift(path);
    return new AST.SexprNode(actualParams, hash);
  }

  function parseInHtml(h, inTagMustaches, fullAttributes) {
    var tagName = h[0] || 'div',
        shorthandAttributes = h[1] || [],
        id = shorthandAttributes[0],
        classes = shorthandAttributes[1] || [],
        tagOpenContent = [],
        updateMustacheNode;
    var i, l;

    updateMustacheNode = function (node) {
      var pairs, pair, stringNode, original;
      if (!classes.length) {
        return;
      }
      if (!node.id || node.id.string !== 'bind-attr') {
        return;
      }
      if (node.hash && node.hash.pairs && (pairs = node.hash.pairs)) {
        for (var i2 in pairs) {
          if (!pairs.hasOwnProperty(i2)) { continue; }
          pair = pairs[i2];
          if (pair && pair[0] === 'class' && pair[1] instanceof AST.StringNode) {
            stringNode = pair[1];
            original = stringNode.original;
            stringNode.original = stringNode.string = stringNode.stringModeValue = ':' + classes.join(' :') + ' ' + original;
            classes = [];
          }
        }
      }
    };

    var elementNode = builder.generateElement(tagName);
    builder.enter(elementNode);
    // tagOpenContent.push(new AST.ContentNode('<' + tagName));

    if(id) {
      builder.attribute('id', id);
      // tagOpenContent.push(new AST.ContentNode(' id="' + id + '"'));
    }

    // Pad in tag mustaches with spaces.
    for(i = 0; i < inTagMustaches.length; ++i) {
      builder.add('attrStaches', inTagMustaches[i]);
    }

    for(i = 0; i < fullAttributes.length; ++i) {
      var currentAttr = fullAttributes[i];
      if (Array.isArray(currentAttr)) {  // a "normalAttribute", [attrName, attrContent]
        if (currentAttr.length) { // a boolean false attribute will be []

          // skip classes now, coalesce them later
          if (currentAttr[0] === 'class') {
            classes.push( currentAttr[1] );
          } else {
            builder.attribute(currentAttr[0], currentAttr[1]);
          }
        }
      } else {
        builder.add('attrStaches', fullAttributes[i]);
      }

      // FIXME this is not correct. This is for dealing with emblem that specifies
      // class name in two ways, i.e.: h1.my-class class="foo"
      if (classes.length) {
        var isClassAttr = fullAttributes[i][1] && fullAttributes[i][1].string === 'class="';

        // Check if attribute is class attribute and has content
        if (isClassAttr && fullAttributes[i].length === 4) {
          if (fullAttributes[i][2].type === 'mustache') {
            var mustacheNode, classesContent, hash, params;
            // If class was mustache binding, transform attribute into bind-attr MustacheNode
            mustacheNode = fullAttributes[i][2];
            classesContent = ':' + classes.join(' :') + ' ' + mustacheNode.id.original;
            hash = new AST.HashNode([
                ['class', new AST.StringNode(classesContent)]
            ]);

            params = [new AST.IdNode([{ part: 'bind-attr'}])].concat(mustacheNode.params);
            fullAttributes[i] = [fullAttributes[i][0], astDelegate.createMustacheNode(params, hash, true)];
          } else {
            // Else prepend shorthand classes to attribute
            classes.push(fullAttributes[i][2].string);
            fullAttributes[i][2].string = classes.join(' ');
          }
          classes = [];
        }
      }

      tagOpenContent = tagOpenContent.concat(fullAttributes[i]);
    }

    // classes has been deferred until now so that it can be coalesced
    if(classes && classes.length) {

      var hasBoundClasses = false;
      for (i=0, l=classes.length; i<l; i++){
        if (classes[i].type && classes[i].type === 'boundAttribute') {
          hasBoundClasses = true;
        }
      }

      if (hasBoundClasses) {

        // convert classes into a single mustache with bind-attr,
        // changing class names to start with ':' when necessary
        var bindAbleClassNames = [];
        for (i=0, l=classes.length; i<l; i++){
          var currentClass = classes[i];
          var currentClassName;
          if (currentClass.type && currentClass.type === 'boundAttribute') {
            currentClassName = currentClass.content;
          } else {
            currentClassName = ':' + currentClass;
          }
          bindAbleClassNames.push(currentClassName);
        }

        var mustache = builder.generateMustache(
          'bind-attr class="' + bindAbleClassNames.join(' ') + '"');
        builder.add('attrStaches', mustache);
      } else {
        builder.attribute('class', classes.join(' ') );
      }
    }

    var closingTagSlashPresent = !!h[2];
    if(SELF_CLOSING_TAG[tagName] || closingTagSlashPresent) {
      tagOpenContent.push(new AST.ContentNode(' />'));
      return [tagOpenContent];
    } else {

      // tagOpenContent.push(new AST.ContentNode('>'));

      // return [tagOpenContent, new AST.ContentNode('</' + tagName + '>')];
      return [tagOpenContent, ""];
    }
  }
}

start = program

program = c:content i:( DEDENT else _ TERM blankLine* indentation c:content {return c;})?
{
  builder.add('childNodes', c);
}

invertibleContent = c:content i:( DEDENT else _ TERM blankLine* indentation c:content {return c;})?
{
  return [c,i];
}

else
  = ('=' _)? 'else'

content = statements:statement*
{
  return statements;
}

// A statement is an array of nodes.
// Often they're single-element arrays, but for things
// like text lines, there might be multiple elements.
statement "BeginStatement"
  = blankLine
  / comment
  / contentStatement

contentStatement "ContentStatement"
  = legacyPartialInvocation
  / htmlElement
  / textLine
  / mustache

blankLine = _ TERM { return []; }

legacyPartialInvocation
  = '>' _ n:legacyPartialName params:inMustacheParam* _ TERM
{
  return [new AST.PartialNode(n, params[0], undefined, {})];
}

legacyPartialName
  = s:$[a-zA-Z0-9_$-/]+ {
    return new AST.PartialNameNode(new AST.StringNode(s));
  }

// Returns [MustacheNode] or [BlockNode]
mustache
  = m:(explicitMustache / lineStartingMustache)
{
  return [m];
}


commentContent
 = lineContent TERM ( indentation (commentContent)+ anyDedent)* { return []; }

comment
  = '/' commentContent { return []; }

inlineComment
  = '/' lineContent

lineStartingMustache
  = mustache:(capitalizedLineStarterMustache / mustacheOrBlock)
{
  var preparedMustache = [
    prepareMustachValue( prepareHelper(mustache[0]) ),
    mustache[1]
  ];
  return createBlockOrMustache(preparedMustache, true);
}

capitalizedLineStarterMustache
  = &[A-Z] ret:mustacheOrBlock
{
  return ret;
}

// (Possibly multi-line) text content beginning on the same
// line as the html tag. Examples (within *):
// p *Hello*
// p *This is a multi-line
//   text block*
// p *This has text and #{foo} mustaches*
htmlNestedTextNodes
  = ' ' ret:textNodes multilineContent:(indentation whitespaceableTextNodes+ DEDENT)?
{
  if(multilineContent) {
    multilineContent = multilineContent[1];
    for(var i = 0, len = multilineContent.length; i < len; ++i) {
      ret.push(' ');
      ret = ret.concat(multilineContent[i]);
    }
  }
  return ret;
}

indentedContent = blankLine* indentation c:content DEDENT { return c; }

// Only accessed from bracketed attributes
unindentedContent = blankLine* c:content DEDENT { return c; }

// The end of an HTML statement. Could be a bunch of
// text, a mustache, or a combination of html elements / mustaches
// that get nested within the HTML element, or could just be a line
// terminator.
htmlTerminator
  = colonContent
  / _ m:explicitMustache { return [m]; }
  / _ inlineComment? TERM c:indentedContent? { return c; }
  / _ inlineComment? ']' TERM  c:unindentedContent? { return c; } // bracketed
  / h:htmlNestedTextNodes { return h;}


// A whole HTML element, including the html tag itself
// and any nested content inside of it.
htmlElement = h:inHtmlTag nested:htmlTerminator
{
  if (nested && nested.length > 0) {
    nested = castStringsToTextNodes(nested);
    builder.add('childNodes', nested);
  }

  return [builder.exit()];
}

mustacheOrBlock = mustacheContent:inMustache _ inlineComment?blockTuple:mustacheNestedContent
{
  if (blockTuple) {
    return [mustacheContent, blockTuple];
  } else {
    return [mustacheContent];
  }
}

colonContent = ': ' _ c:contentStatement { return c; }

// Returns a ProgramNode
mustacheNestedContent
  = statements:(colonContent / textLine) { return statements; }
  / _ ']' TERM statements:(colonContent / textLine) DEDENT { return astDelegate.createProgramNode(statements, []); }
  / TERM block:(blankLine* indentation i:invertibleContent DEDENT { return i })? {
    return block;
  }
  / _ ']' TERM block:invertibleContent DEDENT {
    return block;
  }


explicitMustache = e:equalSign mustacheTuple:mustacheOrBlock
{
  var preparedMustacheTuple = [
    prepareMustachValue( mustacheTuple[0] ),
    mustacheTuple[1]
  ];
  return createBlockOrMustache(preparedMustacheTuple, e);
}

inMustache
  = isPartial:'>'? !('[' TERM) _ mustacheContent:inMustacheContent+ inlineComment? {
  if(isPartial) {
    var n = new AST.PartialNameNode(new AST.StringNode(sexpr.id.string));
    return new AST.PartialNode(n, sexpr.params[0], undefined, {});
  }

  return mustacheContent.join('').trim();
}

inMustacheContent
 = mustacheText:$mustacheTextNode+ mustacheAttrs:htmlMustacheAttribute* stringWithQuotes? {
   mustacheText = mustacheText.trim();

   var mustacheParts = [];
   var classNames = [];

   // mustacheText might have greedily matched a space and then .classname, so
   // the mustacheText needs to be checked for that
   // to handle the case of, e.g., "MyView .classname" -> {{MyView class="classname"}}

   var parts = mustacheText.split(' ');
   for (var i=0,l=parts.length; i<l; i++){
     if (parts[i].charAt(0) !== '.') {
       mustacheParts.push(parts[i]);
     } else {
       classNames = classNames.concat( parts[i].split('.').slice(1) );
     }
   }

   // rejoin the non-classname parts of the mustache text
   mustacheText = mustacheParts.join(' ');

   // mustacheAttrs are of form [key,value] like ['tagName','span'] or ['class','foo']
   // Append them to mustacheText unless they are class attrs, so we can coalesce those
   if (mustacheAttrs.length) {
     for (var i=0,l=mustacheAttrs.length; i<l; i++){
       if (mustacheAttrs[i][0] === 'class') {
         classNames.push( mustacheAttrs[i][1] ); // defer
       } else {
         mustacheText += ' ' + mustacheAttrs[i][0] + '=' + '"' + mustacheAttrs[i][1] + '"';
       }
     }
   }

   // finally, add all class names at once
   if (classNames.length) {
     mustacheText += ' class="' + classNames.join(' ') + '" ';
   }

   return mustacheText;
 }

mustacheTextNode
  = $(alpha / [0-9] / '_' / '.' / '-' / ':' / '=' / '!' / '?' / '"' / "'" / whitespace)

sexpr
  = path:pathIdNode !' [' params:inMustacheParam* hash:hash?
  { return parseSexpr(path, params, hash); }
  / path:pathIdNode _ '[' _ TERM* INDENT* _ params:inMustacheBracketedParam* hash:bracketedHash?
  { return parseSexpr(path, params, hash); }

// %div converts to tagName="div", .foo.thing converts to class="foo thing", #id converst to id="id"
htmlMustacheAttribute
  = _ a:( t:tagNameShorthand  { return ['tagName', t]; }
        / i:idShorthand       { return ['elementId', i]; }
        / c:classShorthand    { return ['class', c]; })
{
  return a;
}

attributesAtLeastID
  = id:idShorthand classes:classShorthand* { return [id, classes]; }

attributesAtLeastClass
  = classes:classShorthand+ { return [null, classes]; }

inMustacheParam
  = a:(htmlMustacheAttribute / __ p:param { return p; } ) { return a; }

inMustacheBracketedParam
  = a:(htmlMustacheAttribute / p:param TERM* { return p; } ) { return a; }

hash
  = h:hashSegment+ { return new AST.HashNode(h); }

bracketedHash
  = INDENT* ' '* h:bracketedHashSegment+ { return new AST.HashNode(h); }

pathIdent "PathIdent"
  = '..'
  / '.'
  / s:$[a-zA-Z0-9_$\-!\?\^@]+ !'=' { return s; }
  / '[' segmentLiteral:$[^\]]* ']' { return segmentLiteral; }

key "Key"
  = $((nmchar / ':')*)

hashSegment
  = __ h:(key '=' param) { return [h[0], h[2]]; }

bracketedHashSegment
  = INDENT* _ h:(key '=' param) TERM* { return [h[0], h[2]];}

param
  = booleanNode
  / integerNode
  / pathIdNode
  / stringNode
  / sexprOpen s:sexpr sexprClose { s.isHelper = true; return s; }

path = first:pathIdent tail:(s:seperator p:pathIdent { return { part: p, separator: s }; })*
{
  var ret = [{ part: first }];
  for(var i = 0; i < tail.length; ++i) {
    ret.push(tail[i]);
  }
  return ret;
}

seperator "PathSeparator" = [\/.]

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
  if(match = last.part.match(/[!\?\^]$/)) {
    suffixModifier = match[0];
    last.part = last.part.slice(0, -1);
  }

  idNode = new AST.IdNode(v);
  idNode._emblemSuffixModifier = suffixModifier;

  return idNode;
}

stringNode  = v:string  { return new AST.StringNode(v); }
integerNode = v:integer { return new AST.NumberNode(v); }
booleanNode = v:boolean { return new AST.BooleanNode(v); }

boolean "Boolean" = 'true' / 'false'

integer "Integer" = s:$('-'? [0-9]+) { return parseInt(s); }

string = p:('"' hashDoubleQuoteStringValue '"' / "'" hashSingleQuoteStringValue "'") { return p[1]; }
stringWithQuotes = p:('"' hashDoubleQuoteStringValue '"' / "'" hashSingleQuoteStringValue "'") {
  return p;
}

hashDoubleQuoteStringValue = $(!(TERM) [^"}])*
hashSingleQuoteStringValue = $(!(TERM) [^'}])*

alpha = [A-Za-z]

whitespaceableTextNodes
 = ind:indentation nodes:textNodes w:whitespaceableTextNodes* anyDedent
{
  nodes.unshift(ind);

  for(var i = 0; i < w.length; ++i) {
    nodes.push(ind);
    nodes = nodes.concat(w[i]);
    nodes.push("\n");
  }
  return nodes;
}
 / textNodes

textLineStart
 = s:[|`'] ' '?  { return s; }
 / &'<' { return '<'; }

textLine = s:textLineStart nodes:textNodes indentedNodes:(indentation whitespaceableTextNodes* DEDENT)?
{
  var i, l;

  if (nodes.length || !indentedNodes) {
    nodes.push("\n");
  }

  if (indentedNodes) {
    indentedNodes = indentedNodes[1];
    for (i = 0; i < indentedNodes.length; ++i) {
      nodes = nodes.concat(indentedNodes[i]); // object node
      nodes.push("\n");
    }
  }

  var ret = [];
  var strip = s !== '`';
  for (i = 0; i < nodes.length; ++i) {
    var node = nodes[i];
    if (node === "\n") {
      if (!strip) {
        ret.push( "\n" );
      }
    } else {
      ret.push(node); // object node
    }
  }

  if (s === "'") {
    ret.push(" ");
  }

  var retWithNewlines = [];
  for (i=0, l=ret.length; i<l; i++) {
    retWithNewlines.push(ret[i]);
    if (i+1!==l) {
      retWithNewlines.push('\n');
    }
  }

  return castStringsToTextNodes(retWithNewlines);
}

textNodes = first:preMustacheText? tail:(rawMustache preMustacheText?)* TERM
{
  return flattenArray(first, tail);
}

attributeTextNodes
  = '"' a:attributeTextNodesInner '"' { return a; }
  / "'" a:attributeTextNodesInnerSingle "'" { return a; }

attributeTextNodesInner = first:preAttrMustacheText? tail:(rawMustache preAttrMustacheText?)* { return flattenArray(first, tail); }
attributeTextNodesInnerSingle = first:preAttrMustacheTextSingle? tail:(rawMustache preAttrMustacheTextSingle?)* { return flattenArray(first, tail); }

rawMustache = rawMustacheUnescaped / rawMustacheEscaped

recursivelyParsedMustacheContent
  = !'{' text:$[^}]*
{
  return text;
}

rawMustacheEscaped
 = doubleOpen _ content:recursivelyParsedMustacheContent _ doubleClose
{
  return builder.generateMustache( prepareMustachValue(content), true);
}
 / hashStacheOpen _ content:recursivelyParsedMustacheContent _ hashStacheClose
{
  return builder.generateMustache( prepareMustachValue(content), true);
}

rawMustacheUnescaped
 = tripleOpen _ content:recursivelyParsedMustacheContent _ tripleClose
{
  return builder.generateMustache( prepareMustachValue(content), false);
}

preAttrMustacheText = a:$preAttrMustacheUnit+ {
  return a;
}
preAttrMustacheTextSingle = a:$preAttrMustacheUnitSingle+ {
  return a;
}

preAttrMustacheUnit       = !(nonMustacheUnit / '"') c:. { return c; }
preAttrMustacheUnitSingle = !(nonMustacheUnit / "'") c:. { return c; }

preMustacheText
  = a:$preMustacheUnit+ { return a; }
preMustacheUnit
  = !nonMustacheUnit c:. { return c; }

nonMustacheUnit
  = tripleOpen / doubleOpen / hashStacheOpen / anyDedent / TERM

// Support for div#id.whatever{ bindAttr whatever="asd" }
rawMustacheSingle
  = singleOpen _ m:recursivelyParsedMustacheContent _ singleClose {
    return builder.generateMustache( m, true );
  }

inTagMustache
  = rawMustacheSingle / rawMustacheUnescaped / rawMustacheEscaped

singleOpen "SingleMustacheOpen" = '{'
doubleOpen "DoubleMustacheOpen" = '{{'
tripleOpen "TripleMustacheOpen" = '{{{'
singleClose "SingleMustacheClose" = '}'
doubleClose "DoubleMustacheClose" = '}}'
tripleClose "TripleMustacheClose" = '}}}'

sexprOpen "SubexpressionOpen" = '('
sexprClose "SubexpressionClose" = ')'

hashStacheOpen  "InterpolationOpen"  = '#{'
hashStacheClose "InterpolationClose" = '}'

// Returns whether the mustache should be escaped.
equalSign = "==" ' '? { return false; } / "=" ' '? { return true; }


// Start of a chunk of HTML. Must have either tagName or shorthand
// class/id attributes or both. Examples:
// p#some-id
// #some-id
// .a-class
// span.combo#of.stuff
// NOTE: this returns a 2 element array of [h,s].
// The return is used to reject a when both h an s are falsy.
htmlStart = h:htmlTagName? s:shorthandAttributes? '/'? &{ return h || s; }

// Everything that goes in the angle brackets of an html tag. Examples:
// p#some-id class="asdasd"
// #some-id data-foo="sdsdf"
// p{ action "click" target="view" }
inHtmlTag
= h:htmlStart ' [' TERM* inTagMustaches:inTagMustache* fullAttributes:bracketedAttribute+
{
  return parseInHtml(h, inTagMustaches, fullAttributes);
}
/ h:htmlStart inTagMustaches:inTagMustache* fullAttributes:fullAttribute*
{
  return parseInHtml(h, inTagMustaches, fullAttributes);
}


shorthandAttributes
  = shorthands:(s:idShorthand    { return { shorthand: s, id: true}; } /
                s:classShorthand { return { shorthand: s }; } )+
{
  var id, classes = [];
  for(var i = 0, len = shorthands.length; i < len; ++i) {
    var shorthand = shorthands[i];
    if(shorthand.id) {
      id = shorthand.shorthand;
    } else {
      classes.push(shorthand.shorthand);
    }
  }

  return [id, classes];
}

fullAttribute
  = ' '+ a:(actionAttribute / booleanAttribute / boundAttribute / rawMustacheAttribute / normalAttribute)
{
  return a || [];
}

bracketedAttribute
= INDENT* ' '* a:(actionAttribute / booleanAttribute / boundAttribute / rawMustacheAttribute / normalAttribute) TERM*
{
  if (a.length) {
    return a;
  } else {
    return [];
  }
}

boundAttributeValueChar = [A-Za-z\.0-9_\-] / nonSeparatorColon

// Value of an action can be an unwrapped string, or a single or double quoted string
actionValue
  = stringWithQuotes
  / id:pathIdNode { return id; }

quotedActionValue = p:('"' inMustache '"' / "'" inMustache "'") { return p[1]; }

actionAttribute
  = event:knownEvent '=' mustacheNode:actionValue
{
  var parts = mustacheNode[1].split(' ');
  var action = parts.shift();
  if (action.indexOf('"') !== 0 && action.indexOf("'") !== 0) {
    action = '"'+action+'"';
  }
  parts.unshift(action);
  parts.unshift('action');
  parts.push('on="'+event+'"');
  return builder.generateMustache(parts.join(' '));
}

booleanAttribute
  = key:key '=' boolValue:('true'/'false')
{
  if (boolValue === 'true') {
    return [key];
  }
}

boundAttributeValue
  = '{' _ value:$(boundAttributeValueChar / ' ')+ _ '}' { return value.replace(/ *$/, ''); }
  / $boundAttributeValueChar+

// With Ember-Handlebars variant,
// p class=something -> <p {{bindAttr class="something"}}></p>
boundAttribute
  = key:key '=' value:boundAttributeValue !'!'
{
  return [key, createBoundAttribute(value)];
}

// With vanilla Handlebars variant,
// p class=something -> <p class="{{something}}"></p>
rawMustacheAttribute
  = key:key '=' id:pathIdNode
{
  return astDelegate.rawMustacheAttribute(key, id);
}

normalAttribute
  = key:key '=' nodes:attributeTextNodes
{
  var result = [key, nodes.join('')];
  return result;
  //return result.concat([new AST.ContentNode('"')]);
}

attributeName = $attributeChar*
attributeChar = alpha / [0-9] /'_' / '-'

tagNameShorthand = '%' c:cssIdentifier { return c; }
idShorthand = '#' c:cssIdentifier { return c;}
classShorthand = '.' c:cssIdentifier { return c; }

cssIdentifier "CSSIdentifier" = ident

ident = $nmchar+

nmchar = [_a-zA-Z0-9-] / nonascii
nmstart = [_a-zA-Z] / nonascii
nonascii = [\x80-\xFF]

tagString
  = c:$tagChar+

htmlTagName "KnownHTMLTagName"
  = '%' _ s:tagString { return s; }
  / knownTagName

knownTagName = t:tagString &{ return !!KNOWN_TAGS[t]; }  { return t; }

tagChar = [_a-zA-Z0-9-] / nonSeparatorColon

nonSeparatorColon = c:':' !' ' { return c; }

knownEvent "a JS event" = t:tagString &{ return !!KNOWN_EVENTS[t]; }  { return t; }

indentation
  = INDENT s:__ { return s; }

INDENT "INDENT" = "\uEFEF" { return ''; }
DEDENT "DEDENT" = "\uEFFE" { return ''; }
UNMATCHED_DEDENT "Unmatched DEDENT" = "\uEFEE" { return ''; }
TERM  "LineEnd" = "\r"? "\uEFFF" "\n" { return false; }

anyDedent "ANYDEDENT" = (DEDENT / UNMATCHED_DEDENT)

__ "RequiredWhitespace"
  = $whitespace+

_ "OptionalWhitespace"
  = whitespace*

whitespace "InlineWhitespace"
  = [ \t]

lineChar = !(INDENT / DEDENT / TERM) c:. { return c; }
lineContent = $lineChar*

