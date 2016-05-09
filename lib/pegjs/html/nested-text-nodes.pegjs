@import "../text-nodes.pegjs" as textNodes
@import "../whitespaceable-text-node.pegjs" as whitespaceableTextNodes
@import "../blank-line.pegjs" as blankLine
@import "../indentation.pegjs" as indentation
@import "../whitespace.pegjs" as _

start = htmlNestedTextNodes

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


/**
  Duplicates
*/
DEDENT "DEDENT" = t:. &{ return DEDENT_SYMBOL === t; } { return ''; }
