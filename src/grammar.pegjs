
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
  
  // Ridiculous that we have to do this, but PEG doesn't
  // support unmatched closing braces in JS code,
  // so we have to construct.
  var closeBrace = String.fromCharCode(125);
  var twoBrace = closeBrace + closeBrace;
  var threeBrace = twoBrace + closeBrace;

  function createMustacheStatement(params, hash, escaped) {
    if(params.length){
      params = new AST.SubExpression(params[0], params.slice(1), hash);
    }
    return new AST.MustacheStatement(params, escaped, { open: false, close: false });
  }

  function createProgram(statements) {
    return new AST.Program(statements, null, { open: false, close: false}, null);
  }

  // Returns a new MustacheStatement with a new preceding param (id).
  function unshiftParam(mustacheNode, helperName, newHashPairs) {

    var hash = mustacheNode.sexpr.hash;

    // Merge hash.
    if(newHashPairs) {
      hash = hash || new AST.Hash([]);

      for(var i = 0; i < newHashPairs.length; ++i) {
        hash.pairs.push(newHashPairs[i]);
      }
    }

    var params = [mustacheNode.sexpr.path].concat(mustacheNode.sexpr.params);
    params.unshift(new AST.PathExpression(false, 0, [helperName], helperName));
    return createMustacheStatement(params, hash, mustacheNode.escaped);
  }

  function textNodesResult(first, tail) {
    var ret = [];
    if(first) { ret.push(first); }
    for(var i = 0; i < tail.length; ++i) {
      var t = tail[i];
      ret.push(t[0]);
      if(t[1]) { ret.push(t[1]); }
    }
    return ret;
  }

  // Only for debugging use.
  function log(msg) {
    handlebarsVariant.log(9, msg);
  }
  function parseSexpr(path, params, hash){
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
      hash = hash || new AST.Hash([]);
      for(var k in attrs) {
        if(!attrs.hasOwnProperty(k)) continue;
        hash.pairs.push({key: k, value: new AST.StringLiteral(attrs[k].join(' '))});
      }
    }

    return new AST.SubExpression(path, actualParams, hash);
  }
  function parseInHtml(h, inTagMustaches, fullAttributes) {

    var tagName = h[0] || 'div',
        shorthandAttributes = h[1] || [],
        id = shorthandAttributes[0],
        classes = shorthandAttributes[1] || [],
        tagOpenContent = [],
        updateMustacheStatement;

    updateMustacheStatement = function (node) {
      var pairs, pair, stringNode, original;
      if (!classes.length) {
        return;
      }
      if (!node.sexpr.path || node.sexpr.path.original !== 'bind-attr') {
        return;
      }
      if (node.sexpr.hash && node.sexpr.hash.pairs && (pairs = node.sexpr.hash.pairs)) {
        for (var i2 in pairs) {
          if (!pairs.hasOwnProperty(i2)) { continue; }
          pair = pairs[i2];
          if (pair && pair.key === 'class' && pair.value instanceof AST.StringLiteral) {
            stringNode = pair.value;
            original = stringNode.original;
            stringNode.original = stringNode.value = stringNode.stringModeValue = ':' + classes.join(' :') + ' ' + original;
            classes = [];
          }
        }
      }
    };

    tagOpenContent.push(new AST.ContentStatement('<' + tagName));

    if(id) {
      tagOpenContent.push(new AST.ContentStatement(' id="' + id + '"'));
    }

    // Pad in tag mustaches with spaces.
    for(var i = 0; i < inTagMustaches.length; ++i) {
      // Check if given mustache node has class bindings and prepend shorthand classes
      updateMustacheStatement(inTagMustaches[i]);
      tagOpenContent.push(new AST.ContentStatement(' '));
      tagOpenContent.push(inTagMustaches[i]);
    }
    for(var i = 0; i < fullAttributes.length; ++i) {
      for (var i2 in fullAttributes[i]) {
        if (fullAttributes[i][i2] instanceof AST.MustacheStatement) {
          updateMustacheStatement(fullAttributes[i][i2]);
        }
      }
      if (classes.length) {
        var isClassAttr = fullAttributes[i][1] && fullAttributes[i][1].value === 'class="';

        // Check if attribute is class attribute and has content
        if (isClassAttr && fullAttributes[i].length === 4) {
          if (fullAttributes[i][2].type == 'MustacheStatement') {
            var mustacheNode, classesContent, hash, params;
            // If class was mustache binding, transform attribute into bind-attr MustacheStatement
            mustacheNode = fullAttributes[i][2];
            classesContent = ':' + classes.join(' :') + ' ' + mustacheNode.sexpr.path.original;
            hash = new AST.Hash([
                {key: 'class', value: new AST.StringLiteral(classesContent)}
            ]);

            params = [new AST.PathExpression(false, 0, ['bind-attr'], 'bind-attr')].concat(mustacheNode.sexpr.params);
            fullAttributes[i] = [fullAttributes[i][0], createMustacheStatement(params, hash, true)];
          } else {
            // Else prepend shorthand classes to attribute
            classes.push(fullAttributes[i][2].value);
            fullAttributes[i][2].value = classes.join(' ');
          }
          classes = [];
        }
      }

      tagOpenContent = tagOpenContent.concat(fullAttributes[i]);
    }

    if(classes && classes.length) {
      tagOpenContent.push(new AST.ContentStatement(' class="' + classes.join(' ') + '"'));
    }
    var closingTagSlashPresent = !!h[2];
    if(SELF_CLOSING_TAG[tagName] || closingTagSlashPresent) {
      tagOpenContent.push(new AST.ContentStatement(' />'));
      return [tagOpenContent];
    } else {

      tagOpenContent.push(new AST.ContentStatement('>'));

      return [tagOpenContent, new AST.ContentStatement('</' + tagName + '>')];
    }
  }
}

start = invertibleContent

invertibleContent = c:content i:( DEDENT else _ TERM blankLine* indentation c:content {return c;})?
{
  var programNode = createProgram(c);
  if(i) { programNode.inverse = createProgram(i); }
  return programNode;
}

else
  = ('=' _)? 'else'

content = statements:statement*
{
  // Coalesce all adjacent ContentStatements into one.

  var compressedStatements = [];
  var buffer = [];

  for(var i = 0; i < statements.length; ++i) {
    var nodes = statements[i];

    for(var j = 0; j < nodes.length; ++j) {
      var node = nodes[j]
      if(node.type === "content") {
        if(node.value) {
          // Ignore empty strings (comments).
          buffer.push(node.value);
        }
        continue;
      }

      // Flush content if present.
      if(buffer.length) {
        compressedStatements.push(new AST.ContentStatement(buffer.join('')));
        buffer = [];
      }
      compressedStatements.push(node);
    }
  }

  if(buffer.length) {
    compressedStatements.push(new AST.ContentStatement(buffer.join('')));
  }

  return compressedStatements;
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
  n = new AST.SubExpression(n, params);
  return [new AST.PartialStatement(n, {open: false, close: false})];
}

legacyPartialName
  = s:$[a-zA-Z0-9_$-/]+ {
    return new AST.PathExpression(false, 0, s.split('.'), s);
  }

// Returns [MustacheStatement] or [BlockStatement]
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
  = capitalizedLineStarterMustache / mustacheOrBlock

capitalizedLineStarterMustache
  = &[A-Z] ret:mustacheOrBlock
{
  // TODO make this configurable
  var defaultCapitalizedHelper = 'view';

  if(ret instanceof AST.BlockStatement) {
    // Block. Modify inner MustacheStatement and return.

    // Make sure a suffix modifier hasn't already been applied.
    var ch = ret.sexpr.path.original.charAt(0);
    if(!IS_EMBER || !ch.match(/[A-Z]/)) return ret;

    ret.sexpr = unshiftParam(ret, defaultCapitalizedHelper).sexpr;
    return ret;
  } else {

    // Make sure a suffix modifier hasn't already been applied.
    var ch = ret.sexpr.path.original.charAt(0);
    if(!IS_EMBER || !ch.match(/[A-Z]/)) return ret;

    return unshiftParam(ret, defaultCapitalizedHelper);
  }
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
      ret.push(new AST.ContentStatement(' '));
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
  // h is [[open tag content], closing tag ContentStatement]
  var ret = h[0];
  if(nested) { ret = ret.concat(nested); }

  // Push the closing tag ContentStatement if it exists (self-closing if not)
  if(h[1]) { ret.push(h[1]); }

  return ret;
}

mustacheOrBlock = mustacheNode:inMustache _ inlineComment?nestedContentProgram:mustacheNestedContent
{
  if (!nestedContentProgram) {
    return mustacheNode;
  }

  var block = new AST.BlockStatement(mustacheNode.sexpr, nestedContentProgram, nestedContentProgram.inverse, false, false, false);
  return block;
}

colonContent = ': ' _ c:contentStatement { return c; }

// Returns a Program
mustacheNestedContent
  = statements:(colonContent / textLine) { return createProgram(statements); }
  / _ ']' TERM statements:(colonContent / textLine) DEDENT { return createProgram(statements); }
  / TERM block:(blankLine* indentation invertibleContent DEDENT)? {return block && block[2]; }
  / _ ']' TERM block:invertibleContent DEDENT {
    return block;
  }


explicitMustache = e:equalSign ret:mustacheOrBlock
{
  ret.escaped = e;
  return ret;
}

inMustache
  = isPartial:'>'? !('[' TERM) _ sexpr:sexpr
{
  if(isPartial) {
    return new AST.PartialStatement(sexpr,  {open: false, close: false});
  }

  var mustacheNode = createMustacheStatement(sexpr, null, true);

  var tm = sexpr.path._emblemSuffixModifier;
  if(tm === '!') {
    return unshiftParam(mustacheNode, 'unbound');
  } else if(tm === '?') {
    return unshiftParam(mustacheNode, 'if');
  } else if(tm === '^') {
    return unshiftParam(mustacheNode, 'unless');
  }
  return mustacheNode;
}

sexpr
  = path:pathPathExpression !' [' params:inMustacheParam* hash:(hash?)
  { return parseSexpr(path, params, hash) }
  / path:pathPathExpression _ '[' _ TERM* INDENT* _ params:inMustacheBracketedParam* hash:(bracketedHash?)
  { return parseSexpr(path, params, hash) }

// %div converts to tagName="div", .foo.thing converts to class="foo thing", #id converst to id="id"
htmlMustacheAttribute
  = _ a:( t:tagNameShorthand  { return ['tagName', t]; }
        / i:idShorthand       { return ['elementId', i]; }
        / c:classShorthand    { return ['class', c]; })
{
  return a;
}

shorthandAttributes
  = attributesAtLeastID / attributesAtLeastClass

attributesAtLeastID
  = id:idShorthand classes:classShorthand* { return [id, classes]; }

attributesAtLeastClass
  = classes:classShorthand+ { return [null, classes]; }

inMustacheParam
  = a:(htmlMustacheAttribute / __ p:param { return p; } ) { return a; }

inMustacheBracketedParam
  = a:(htmlMustacheAttribute / p:param TERM* { return p; } ) { return a; }

hash
  = h:hashSegment+ { return new AST.Hash(h); }

bracketedHash
  = INDENT* ' '* h:bracketedHashSegment+ { return new AST.Hash(h); }

pathIdent "PathIdent"
  = '..'
  / '.'
  / s:$[a-zA-Z0-9_$\-!\?\^@]+ !'=' { return s; }
  / '[' segmentLiteral:$[^\]]* ']' { return segmentLiteral; }

key "Key"
  = $((nmchar / ':')*)

hashSegment
  = __ h:(key '=' param) { return {key: h[0], value: h[2]}; }

bracketedHashSegment
  = INDENT* _ h:(key '=' param) TERM* { return {key: h[0], value: h[2]};}

param
  = booleanNode
  / integerNode
  / pathPathExpression
  / stringNode
  / sexprOpen s:sexpr sexprClose { s.isHelper = true; return s; }

path = first:pathIdent tail:(s:seperator p:pathIdent { return { part: p, separator: s }; })*
{
  var ret = [{part: first}];
  for(var i = 0; i < tail.length; ++i) {
    ret.push(tail[i]);
  }
  return ret;
}

seperator "PathSeparator" = [\/.]

pathPathExpression = v:path
{
  //copied from handlebars helpers, hopefully will be exposed later. TODO
  function preparePath(data, parts, locInfo) {
      /*jshint -W040 */

      var original = data ? '@' : '',
          dig = [],
          depth = 0,
          depthString = '';

      for(var i=0,l=parts.length; i<l; i++) {
          var part = parts[i].part;
          original += (parts[i].separator || '') + part;

          if (part === '..' || part === '.' || part === 'this') {
              if (dig.length > 0) {
                  throw new Exception('Invalid path: ' + original, {loc: locInfo});
              } else if (part === '..') {
                  depth++;
                  depthString += '../';
              }
          } else {
              dig.push(part);
          }
      }

      return new AST.PathExpression(data, depth, dig, original, locInfo);
  }
  var last = v[v.length - 1];
  var data = false;

  // Support for data keywords that are prefixed with @ in the each
  // block helper such as @index, @key, @first, @last
  if (last.part.charAt(0) === '@') {
    last.part = last.part.slice(1);
    data = true;
  }

  var match;
  var suffixModifier;
  if(match = last.part.match(/[!\?\^]$/)) {
    suffixModifier = match[0];
    last.part = last.part.slice(0, -1);
  }

  var idNode = preparePath(data, v);
  idNode._emblemSuffixModifier = suffixModifier;

  return idNode;
}

stringNode  = v:string  { return new AST.StringLiteral(v); }
integerNode = v:integer { return new AST.NumberLiteral(v); }
booleanNode = v:boolean { return new AST.BooleanLiteral(v); }

boolean "Boolean" = 'true' / 'false'

integer "Integer" = s:$('-'? [0-9]+) { return parseInt(s); }

string = p:('"' hashDoubleQuoteStringValue '"' / "'" hashSingleQuoteStringValue "'") { return p[1]; }

hashDoubleQuoteStringValue = $(!(TERM) [^"}])*
hashSingleQuoteStringValue = $(!(TERM) [^'}])*

alpha = [A-Za-z]

whitespaceableTextNodes
 = ind:indentation nodes:textNodes w:whitespaceableTextNodes* anyDedent
{
  nodes.unshift(new AST.ContentStatement(ind));

  for(var i = 0; i < w.length; ++i) {
    nodes.push(new AST.ContentStatement(ind));
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
  if(nodes.length || !indentedNodes) {
    nodes.push("\n");
  }

  if(indentedNodes) {
    indentedNodes = indentedNodes[1];
    for(var i = 0; i < indentedNodes.length; ++i) {
      /*nodes.push(new AST.ContentStatement("#"));*/
      nodes = nodes.concat(indentedNodes[i]);
      nodes.push("\n");
    }
  }

  var ret = [];
  var strip = s !== '`';
  for(var i = 0; i < nodes.length; ++i) {
    var node = nodes[i];
    if(node == "\n") {
      if(!strip) {
        ret.push(new AST.ContentStatement("\n"));
      }
    } else {
      ret.push(node);
    }
  }

  if(s === "'") {
    ret.push(new AST.ContentStatement(" "));
  }
  return ret;
}

textNodes = first:preMustacheText? tail:(rawMustache preMustacheText?)* TERM
{
  return textNodesResult(first, tail);
}

attributeTextNodes
  = '"' a:attributeTextNodesInner '"' { return a; }
  / "'" a:attributeTextNodesInnerSingle "'" { return a; }

attributeTextNodesInner = first:preAttrMustacheText? tail:(rawMustache preAttrMustacheText?)* { return textNodesResult(first, tail); }
attributeTextNodesInnerSingle = first:preAttrMustacheTextSingle? tail:(rawMustache preAttrMustacheTextSingle?)* { return textNodesResult(first, tail); }

rawMustache = rawMustacheUnescaped / rawMustacheEscaped

recursivelyParsedMustacheContent
  = !'{' text:$[^}]*
{
  // Force interpretation as mustache.
  // TODO: change to just parse with a specific rule?
  text = "=" + text;
  return Emblem.parse(text).body[0];
}

rawMustacheEscaped
 = doubleOpen _ m:recursivelyParsedMustacheContent _ doubleClose { m.escaped = true; return m; }
 / hashStacheOpen _ m:recursivelyParsedMustacheContent _ hashStacheClose { m.escaped = true; return m; }

rawMustacheUnescaped
 = tripleOpen _ m:recursivelyParsedMustacheContent _ tripleClose { m.escaped = false; return m; }

preAttrMustacheText = a:$preAttrMustacheUnit+ { return new AST.ContentStatement(a); }
preAttrMustacheTextSingle = a:$preAttrMustacheUnitSingle+ { return new AST.ContentStatement(a); }

preAttrMustacheUnit       = !(nonMustacheUnit / '"') c:. { return c; }
preAttrMustacheUnitSingle = !(nonMustacheUnit / "'") c:. { return c; }

preMustacheText
  = a:$preMustacheUnit+ { return new AST.ContentStatement(a); }
preMustacheUnit
  = !nonMustacheUnit c:. { return c; }

nonMustacheUnit
  = tripleOpen / doubleOpen / hashStacheOpen / anyDedent / TERM

// Support for div#id.whatever{ bindAttr whatever="asd" }
rawMustacheSingle
 = singleOpen _ m:recursivelyParsedMustacheContent _ singleClose { m.escaped = true; return m; }
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
  return parseInHtml(h, inTagMustaches, fullAttributes)
}
/ h:htmlStart inTagMustaches:inTagMustache* fullAttributes:fullAttribute*
{
  return parseInHtml(h, inTagMustaches, fullAttributes)
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
  if (a.length) {
    return [new AST.ContentStatement(' ')].concat(a);
  } else {
    return [];
  }
}

bracketedAttribute
= INDENT* ' '* a:(actionAttribute / booleanAttribute / boundAttribute / rawMustacheAttribute / normalAttribute) TERM*
{
  if (a.length) {
    return [new AST.ContentStatement(' ')].concat(a);
  } else {
    return [];
  }
}

boundAttributeValueChar = [A-Za-z\.0-9_\-] / nonSeparatorColon

// Value of an action can be an unwrapped string, or a single or double quoted string
actionValue
  = quotedActionValue
  / id:pathPathExpression { return createMustacheStatement([id], null, true); }

quotedActionValue = p:('"' inMustache '"' / "'" inMustache "'") { return p[1]; }

actionAttribute
  = event:knownEvent '=' mustacheNode:actionValue
{
  // Replace the PathExpression with a StringLiteral to prevent unquoted action deprecation warnings
  mustacheNode.sexpr.path = new AST.StringLiteral(mustacheNode.sexpr.path.original);

  // Unshift the action helper and augment the hash
  return [unshiftParam(mustacheNode, 'action', [{key: 'on', value: new AST.StringLiteral(event)}])];
}

booleanAttribute
  = key:key '=' boolValue:('true'/'false')
{
  if (boolValue === 'true') {
    return [ new AST.ContentStatement(key) ];
  } else {
    return [];
  }
}

boundAttributeValue
  = '{' _ value:$(boundAttributeValueChar / ' ')+ _ '}' { return value.replace(/ *$/, ''); }
  / $boundAttributeValueChar+

// With Ember-Handlebars variant,
// p class=something -> <p {{bindAttr class="something"}}></p>
boundAttribute
  = key:key '=' value:boundAttributeValue !'!' &{ return IS_EMBER; }
{
  var hashNode = new AST.Hash([{key: key, value: new AST.StringLiteral(value)}]);
  var params = [new AST.PathExpression(false, 0, ['bind-attr'], 'bind-attr')];
  var mustacheNode = createMustacheStatement(params, hashNode);

  return [mustacheNode];
}

// With vanilla Handlebars variant,
// p class=something -> <p class="{{something}}"></p>
rawMustacheAttribute
  = key:key '=' id:pathPathExpression
{
  var mustacheNode = createMustacheStatement([id], null, true);

  if(IS_EMBER && id._emblemSuffixModifier === '!') {
    mustacheNode = unshiftParam(mustacheNode, 'unbound');
  }

  return [
    new AST.ContentStatement(key + '=' + '"'),
    mustacheNode,
    new AST.ContentStatement('"'),
  ];
}

normalAttribute
  = key:key '=' nodes:attributeTextNodes
{
  var result = [ new AST.ContentStatement(key + '=' + '"') ].concat(nodes);
  return result.concat([new AST.ContentStatement('"')]);
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

