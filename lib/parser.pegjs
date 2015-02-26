{
  var builder = options.builder;

  var UNBOUND_MODIFIER = '!';
  var CONDITIONAL_MODIFIER = '?';

  var LINE_SPACE_MODIFIERS = {
    NEWLINE: '`',
    SPACE: "'"
  };

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
    var nodes = [];

    var currentString = null;
    var possibleString;

    for(var i=0, l=possibleStrings.length; i<l; i++) {
      possibleString = possibleStrings[i];
      if (typeof possibleString === 'string') {
        currentString = (currentString || '') + possibleString;
      } else {
        if (currentString) {
          ret.push( textNode(currentString) );
          currentString = null;
        }
        ret.push( possibleString ); // not a string, it is a node here
      }
    }
    if (currentString) {
      ret.push( textNode(currentString) );
    }
    return ret;
  }

  // attrs are simple strings,
  // combine all the ones that start with 'class='
  function coalesceAttrs(attrs){
    var classes = [];
    var newAttrs = [];
    var classRegex = /^class="(.*)"$/;
    var match;

    for (var i=0,l=attrs.length; i<l; i++) {
      var attr = attrs[i];
      if (match = attr.match(classRegex)) {
        classes.push(match[1]);
      } else {
        newAttrs.push(attr);
      }
    }

    if (classes.length) {
      newAttrs.push('class="' + classes.join(' ') + '"');
    }
    return newAttrs;
  }

  function createBlockOrMustache(mustacheTuple) {
    var mustache   = mustacheTuple[0];
    var blockTuple = mustacheTuple[1];

    var escaped    = mustache.isEscaped;
    var mustacheContent = mustache.name;
    var mustacheAttrs = mustache.attrs;

    if (mustacheAttrs.length) {
      var attrs = coalesceAttrs(mustacheAttrs);
      mustacheContent += ' ' + attrs.join(' ');
    }

    if (mustache.isViewHelper) {
      mustacheContent = 'view ' + mustacheContent;
    }

    if (mustache.modifier === UNBOUND_MODIFIER) {
      mustacheContent = 'unbound ' + mustacheContent;
    } else if (mustache.modifier === CONDITIONAL_MODIFIER) {
      mustacheContent = 'if ' + mustacheContent;
    }

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

  function textNode(content){
    return builder.generateText(content);
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

    /* self closing tags should be handled by the printer, not here
    var closingTagSlashPresent = !!h[2];
    if(SELF_CLOSING_TAG[tagName] || closingTagSlashPresent) {
      tagOpenContent.push(new AST.ContentNode(' />'));
      return [tagOpenContent];
    } else {

      // tagOpenContent.push(new AST.ContentNode('>'));

      // return [tagOpenContent, new AST.ContentNode('</' + tagName + '>')];
      return [tagOpenContent, ""];
    }
    */
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

mustache
  = mustacheTuple:(explicitMustache / lineStartingMustache)
{
  var mustacheOrBlock = createBlockOrMustache(mustacheTuple);

  return [mustacheOrBlock];
}


commentContent
 = lineContent TERM ( indentation (commentContent)+ anyDedent)* { return []; }

comment
  = '/' commentContent { return []; }

inlineComment
  = '/' lineContent

lineStartingMustache
  = mustacheTuple:(capitalizedLineStarterMustache / mustacheOrBlock)
{
  return mustacheTuple;
}

capitalizedLineStarterMustache
  = &[A-Z] mustacheTuple:mustacheOrBlock
{
  var mustache = mustacheTuple[0];
  var block = mustacheTuple[1];
  mustache.isViewHelper = true;

  return [mustache, block];
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
  / _ mustacheTuple:explicitMustache {
    var blockOrMustache = createBlockOrMustache(mustacheTuple);
    return [blockOrMustache];
  }
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

mustacheOrBlock = mustacheContent:inMustache _ inlineComment? blockTuple:mustacheNestedContent
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
  var mustache = mustacheTuple[0];
  var block = mustacheTuple[1];

  mustache.isEscaped = e;

  return [mustache, block];
}

inMustache
  = isPartial:'>'? !('[' TERM) _ mustache:newMustache inlineComment? {
  if(isPartial) {
    var n = new AST.PartialNameNode(new AST.StringNode(sexpr.id.string));
    return new AST.PartialNode(n, sexpr.params[0], undefined, {});
  }
  return mustache;
}

// %div converts to tagName="div", .foo.thing converts to class="foo thing", #id converst to id="id"
htmlMustacheAttribute
  = _ a:( t:tagNameShorthand  { return ['tagName', t]; }
        / i:idShorthand       { return ['elementId', i]; }
        / c:classShorthand    { return ['class', c]; })
{
  return a;
}

inMustacheParam
  = a:(htmlMustacheAttribute / __ p:param { return p; } ) { return a; }

pathIdent "PathIdent"
  = '..'
  / '.'
  / s:$[a-zA-Z0-9_$\-!\?\^@]+ !'=' { return s; }
  / '[' segmentLiteral:$[^\]]* ']' { return segmentLiteral; }

key "Key"
  = $((nmchar / ':')*)

param
  = booleanNode
  / integerNode
  / pathIdNode
  / stringNode

path = first:pathIdent tail:(s:separator p:pathIdent { return { part: p, separator: s }; })*
{
  var ret = [{ part: first }];
  for(var i = 0; i < tail.length; ++i) {
    ret.push(tail[i]);
  }
  return ret;
}

separator "PathSeparator" = [\/.]

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
 = indentation nodes:textNodes whitespaceableTextNodes* anyDedent
{
  return nodes;
}
 / textNodes

textLineStart
 = s:[|`'] ' '?  { return s; }
 / &'<' { return '<'; }

// indentedNodes is an array of arrays,
//   each indentedNodes array is an array of the nodes from each indented line,
//   which can be a mix of strings and mustache nodes.
// nodes is an array of the strings and mustache nodes from the starting line.
// Example:
//   |  this is line {{one}}
//      and this is {{indented}} line two
// In this case 's' is |, nodes is: ['this is line ', <mustacheNode>],
// and indentedNodes is: [ ['and this is ', <mustacheNode>, ' line two'] ]
textLine = s:textLineStart nodes:textNodes indentedNodes:(indentation w:whitespaceableTextNodes* DEDENT { return w;} )?
{
  var i, l;

  var hasNodes = nodes && nodes.length,
      hasIndentedNodes = indentedNodes && indentedNodes.length;

  // add a space after the first line if it had content and
  // there are indented nodes to follow
  if (hasNodes && hasIndentedNodes) { nodes.push(' '); }

  // concat indented nodes
  if (indentedNodes) {
    for (i=0, l=indentedNodes.length; i<l; i++) {
      nodes = nodes.concat(indentedNodes[i]);

      // connect logical lines with a space, skipping the next-to-last line
      if (i < l - 1) { nodes.push(' '); }
    }
  }

  // add trailing space to non-indented nodes if special modifier
  if (s === LINE_SPACE_MODIFIERS.SPACE) {
    nodes.push(' ');
  } else if (s === LINE_SPACE_MODIFIERS.NEWLINE) {
    nodes.push('\n');
  }

  return castStringsToTextNodes(nodes);
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

preAttrMustacheText = $preAttrMustacheUnit+
preAttrMustacheTextSingle = $preAttrMustacheUnitSingle+

preAttrMustacheUnit       = !(nonMustacheUnit / '"') c:. { return c; }
preAttrMustacheUnitSingle = !(nonMustacheUnit / "'") c:. { return c; }

preMustacheText
  = $preMustacheUnit+
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

// FIXME this rule is never used
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
  return builder.generateMustache('bind-attr ' + key + '=' + value);
}

// With vanilla Handlebars variant,
// p class=something -> <p class="{{something}}"></p>
rawMustacheAttribute
  = key:key '=' id:pathIdNode
{
  return [key, '{{' + id + '}}'];
}

normalAttribute
  = key:key '=' nodes:attributeTextNodes
{
  var strings = [];
  nodes.forEach(function(node){
    if (typeof node === 'string') {
      strings.push(node);
    } else {
      // FIXME here we transform a mustache attribute
      // This should be handled higher up instead, not here.
      // This happens when the attribute is something like:
      // src="{{unbound post.showLogoUrl}}".
      // key = "src", nodes[0] = "unbound post.showLogoUrl"
      strings.push('{{' + node.content + '}}');
    }
  });
  var result = [key, strings.join('')];
  return result;
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

// ========== from mustache-parser.pegjs ======================================== //
// Returns an object with this shape:
// {
//   name: string,
//   attrs: array, (items look like 'class="abc"', 'tagName="xyz"', '(query-params foo=bar)', 'blah', '"quotedBlah"', etc)
//   modifier: '?' or '!' (optional),
// }
// upstream parsers will optionally add an `isEscaped:true` property
newMustache = name:newMustacheStart m_* attrs:newMustacheAttr* {
  attrs = attrs.concat(name.shorthands);

  var ret = {
    name: name.name,
    attrs: attrs
  };
  if (name.modifier) {
    ret.modifier = name.modifier;
  }

  return ret;
}

newMustacheStart = name:newMustacheName m_* shorthands:newMustacheShortHand* {
  return {
    name: name.name,
    modifier: name.modifier,
    shorthands: shorthands
  };
}

// shorthand %tagName, .className, #idName
newMustacheShortHand = m_shortHandTagName / m_shortHandIdName / m_shortHandClassName

m_shortHandTagName = '%' tagName:newMustacheShortHandName {
  return 'tagName="' + tagName + '"';
}

m_shortHandIdName = '#' idName:newMustacheShortHandName {
  return 'elementId="' + idName + '"';
}

m_shortHandClassName = '.' className:newMustacheShortHandName {
  return 'class="' + className + '"';
}

newMustacheShortHandName = $([A-Za-z0-9-]+)

newMustacheName = !m_invalidNameStartChar name:$newMustacheNameChar+ modifier:m_modifierChar? {
  return {
    name: name,
    modifier: modifier
  };
}

m_invalidNameStartChar = '.' / '-' / [0-9]

// unbound (!) and conditional (?) modifiers
m_modifierChar = '!' / '?'

// a character that can be in a mustache name
newMustacheNameChar = [A-Za-z0-9-_] / '.'

newMustacheAttr = m_keyValue / m_parenthetical / newMustacheAttrValue

m_keyValue = attrName:newMustacheAttrName m_* '=' m_* attrValue:newMustacheAttrValue m_* {
  return attrName + '=' + attrValue;
}

newMustacheAttrName = $newMustacheNameChar+

newMustacheAttrValue = v:$(m_quotedString / m_valuePath) m_* {
  return v;
}

m_valuePath = $newMustacheNameChar+

m_quotedString = ( '"' m_stringWithoutDouble '"' ) / ("'" m_stringWithoutSingle "'")

m_stringWithoutDouble = $(m_inStringChar / "'")+
m_stringWithoutSingle = $(m_inStringChar / '"')+

m_inStringChar = [^'"]
m_inParensChar = [^\(\)]
m_commentChar = '/'

m_parenthetical
= m_* p:$(m_OPEN_PAREN m_inParensChar* m_parenthetical? m_inParensChar* m_CLOSE_PAREN) m_* {
  return p;
}

m_OPEN_PAREN = '('
m_CLOSE_PAREN = ')'
m_ = ' '
// =========      end of mustache-parser.pegjs ========================================= //
