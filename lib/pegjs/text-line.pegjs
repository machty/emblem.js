@import "./text-nodes.pegjs" as textNodes
@import "./indentation.pegjs" as indentation
@import "./whitespaceable-text-node.pegjs" as whitespaceableTextNodes

{
  var LINE_SPACE_MODIFIERS = {
    NEWLINE: '`',
    SPACE_AFTER: "'",
    SPACE_BOTH: '"',
    SPACE_BEFORE: "+"
  };

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

  function textNode(content){
    return builder.generateText(content);
  }
}

start = textLine

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
  if (s === LINE_SPACE_MODIFIERS.SPACE_AFTER) {
    nodes.push(' ');
  } else if (s === LINE_SPACE_MODIFIERS.NEWLINE) {
    nodes.push('\n');
  } else if (s === LINE_SPACE_MODIFIERS.SPACE_BOTH) {
    nodes.push(' ');
    nodes.unshift(' ');
  } else if (s === LINE_SPACE_MODIFIERS.SPACE_BEFORE) {
    nodes.unshift(' ');
  }

  return castStringsToTextNodes(nodes);
}

textLineStart
 = s:[|`'+"] ' '?  { return s; }
 / &'<' { return '<'; }


/**
  Duplicates
*/
DEDENT "DEDENT" = t:. &{ return DEDENT_SYMBOL === t; } { return ''; }
