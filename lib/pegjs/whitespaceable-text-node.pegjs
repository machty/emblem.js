@import "./any-dedent.pegjs" as anyDedent
@import "./indentation.pegjs" as indentation
@import "./text-nodes.pegjs" as textNodes

start = whitespaceableTextNodes

whitespaceableTextNodes
 = indentation nodes:textNodes whitespaceableTextNodes* anyDedent
{
  return nodes;
}
 / textNodes
