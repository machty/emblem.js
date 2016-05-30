@import "./pegjs/blank-line.pegjs" as blankLine
@import "./pegjs/comment.pegjs" as comment
@import "./pegjs/else.pegjs" as else
@import "./pegjs/equal-sign.pegjs" as equalSign
@import "./pegjs/indentation.pegjs" as indentation
@import "./pegjs/inline-comment.pegjs" as inlineComment
@import "./pegjs/legacy-partial.pegjs" as legacyPartialInvocation
@import "./pegjs/text-line.pegjs" as textLine
@import "./pegjs/text-nodes.pegjs" as textNodes
@import "./pegjs/whitespaceable-text-node.pegjs" as whitespaceableTextNodes
@import "./pegjs/whitespace.pegjs" as _

@import "./pegjs/html/in-tag.pegjs" as inHtmlTag
@import "./pegjs/html/nested-text-nodes.pegjs" as htmlNestedTextNodes

@import "./pegjs/mustache/attr.pegjs" as mustacheAttrs
@import "./pegjs/mustache/ast/mustache.pegjs" as mustacheAst
@import "./pegjs/syntax/block-params.pegjs" as blockParams

{
  var builder = options.builder;

  var UNBOUND_MODIFIER = '!';
  var CONDITIONAL_MODIFIER = '?';

  function logDeprecation(message) {
    if (!options.quiet) {
      var output = 'DEPRECATION: ' + message;

      if (options.file) {
        output += '\nFile: ' + options.file;
      }

      console.log(output);
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

  /**
    Splits a value string into separate parts,
    then generates a classBinding for each part.
  */
  function splitValueIntoClassBindings(value) {
    return value.split(' ').map(function(v){
      return builder.generateClassNameBinding(v);
    });
  }

  function isArray(obj) {
    return obj && obj.constructor === Array;
  }

  // Receives an array object and verifies it has content
  // Useful for checking blocks to make sure there is actual data in the payload
  function isArrayWithContent(obj) {
    if (!isArray(obj))
      return;

    var hasItems = false;
    var length = obj.length;

    for (var i = 0; i < length; i++) {
      var item = obj[i];

      if (isArray(item)) {
        if (item.length > 0)
          hasItems = true;
      } else if (!!item) {
        hasItems = true;
      }
    }

    return hasItems;
  }

  function createBlockOrMustache(mustacheTuple) {
    var mustache   = mustacheTuple[0];
    var block      = mustacheTuple[1] || {};

    var escaped    = mustache.isEscaped;

    var mustacheContent = mustache.name;
    var mustacheAttrs = mustache.attrs;
    var mustacheBlockParams = mustache.blockParams || block.blockParams;
    var blockTuple = block.blockTuple;

    if (mustacheAttrs.length) {
      var attrs = coalesceAttrs(mustacheAttrs);
      mustacheContent += ' ' + attrs.join(' ');
    }

    if (mustacheBlockParams) {
      mustacheContent += ' as |' + mustacheBlockParams.join(' ') + '|';
    }

    if (mustache.isViewHelper) {
      mustacheContent = 'view ' + mustacheContent;
    }

    if (mustache.modifier === UNBOUND_MODIFIER) {
      mustacheContent = 'unbound ' + mustacheContent;
    } else if (mustache.modifier === CONDITIONAL_MODIFIER) {
      mustacheContent = 'if ' + mustacheContent;
    }

    if (isArrayWithContent(blockTuple)) {
      var block = builder.generateBlock(mustacheContent, escaped);
      builder.enter(block);

      // Iterate on each tuple and either add it as a child node or an invertible node
      blockTuple.forEach(function(tuple) {
        if (!tuple)
          return;

        if (tuple.isInvertible)
          builder.add('invertibleNodes', tuple);
        else
          builder.add('childNodes', tuple);
      });

      return builder.exit();
    } else {
      return builder.generateMustache(mustacheContent, escaped);
    }
  }

  // attrs are simple strings,
  // combine all the ones that start with 'class='
  function coalesceAttrs(attrs) {
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
}

start = program

program = c:content
{
  builder.add('childNodes', c);
}

content = statements:statement*
{
  return statements;
}

// A statement is an array of nodes.
// Often they're single-element arrays, but for things
// like text lines, there might be multiple elements.
statement
  = blankLine
  / comment
  / contentStatement

contentStatement
  = legacyPartialInvocation
  / htmlElement
  / textLine
  / mustache

colonContent = ': ' _ c:contentStatement { return c; }


/**
  HTML Element
*/
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
  / _ inlineComment? TERM c:indentedContent? {
    return c;
  }
  / _ inlineComment? ']' TERM c:unindentedContent? {
    return c;
  } // bracketed
  / h:htmlNestedTextNodes {
    return h;
  }

indentedContent = blankLine* indentation c:content DEDENT { return c; }

// Only accessed from bracketed attributes
unindentedContent = blankLine* c:content DEDENT { return c; }


/**
  Mustache
*/
mustache
  = mustacheTuple:(explicitMustache / lineStartingMustache)
{
  var parsedMustacheOrBlock = createBlockOrMustache(mustacheTuple);

  return [parsedMustacheOrBlock];
}

explicitMustache = e:equalSign mustacheTuple:mustacheOrBlock
{
  var mustache = mustacheTuple[0];
  var block = mustacheTuple[1];
  mustache.isEscaped = e;
  mustache.explicit = !e;

  return [mustache, block];
}

// Mustache usage is deprecated.  Eventually this will become glimmer component
lineStartingMustache
  = mustacheTuple:(capitalizedLineStarterMustache / mustacheOrBlock)
{
  var mustacheAst = mustacheTuple[0];

  if (mustacheAst.isViewHelper) {
    logDeprecation('View syntax detected: ' + mustacheAst.name);
  }

  if (mustacheAst.component) {
    logDeprecation('Explicit component declarations will be interpreted as angle-bracket components in a later release: ' + mustacheAst.name);
  }

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


mustacheOrBlock = mustacheContent:mustacheContent _ inlineComment? blockTuple:mustacheNestedContent
{
  if (blockTuple) {
    return [mustacheContent, blockTuple];
  } else {
    return [mustacheContent];
  }
}

mustacheContent
  = isPartial:'>'? !('[' TERM) _ mustache:mustacheAst inlineComment? {
  if(isPartial) {
    var n = new AST.PartialNameNode(new AST.StringNode(sexpr.id.string));
    return new AST.PartialNode(n, sexpr.params[0], undefined, {});
  }

  return mustache;
}

// @return [block tuple]
mustacheNestedContent
  // Inline content that should be nested (colon or single pipe)
  = statements:(colonContent / textLine) {
    return {
      blockTuple: statements
    };
  }
  // Inline content or an HTML element after a closing argument bracket
  / _ ']' TERM statements:(colonContent / textLine / content) DEDENT {
    return {
      blockTuple: statements
    };
  }
  // Indented invertible block
  / TERM block:(blankLine* indentation i:invertibleContent DEDENT { return i })? {
    return {
      blockTuple: block
    };
  }
  // Block with invertible content after a closing argument bracket
  / _ ']' _ blockParams:blockParams? TERM block:invertibleContent DEDENT {
    return {
      blockParams: blockParams,
      blockTuple: block
    };
  }
  // Block with invertible content after a closing argument bracket, but with a de-indented closing bracket
  / _ DEDENT ']' _ blockParams:blockParams? TERM INDENT _ block:invertibleContent DEDENT {
    return {
      blockParams: blockParams,
      blockTuple: block
    };
  }
  // Closing argument bracket (both same line and new line)
  / _ DEDENT? ']' TERM {
    return;
  }



/**
  Invertible Content
*/
invertibleContent
  = c:content i:invertibleObject?
{
  return [c, i];
}

invertibleObject
  = DEDENT comment* b:else _ a:invertibleParam? TERM c:invertibleBlock i:invertibleObject?
{
  return { content: c, name: [b, a].join(' '), isInvertible: true, invertibleNodes: i };
}

// Params for an invertible node
invertibleParam
  = p:mustacheAttrs _ inlineComment? { return p; }

// Block for an invertible node
invertibleBlock
  = blankLine* indentation c:content { return c; }




/**
  Duplicates
*/
INDENT "INDENT" = t:. &{ return INDENT_SYMBOL === t; } { return ''; }
DEDENT "DEDENT" = t:. &{ return DEDENT_SYMBOL === t; } { return ''; }
TERM  "LineEnd" = "\r"? t:. &{ return TERM_SYMBOL == t; } "\n" { return false; }
