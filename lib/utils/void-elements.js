// http://www.w3.org/TR/html-markup/syntax.html#syntax-elements
var voidElementTags = [
  'area',
  'base',
  'br',
  'col',
  'command',
  'embed',
  'hr',
  'img',
  'input',
  'keygen',
  'link',
  'meta',
  'param',
  'source',
  'track',
  'wbr'
];

function isVoidElement(tagName){
  return voidElementTags.indexOf(tagName) > -1;
}

export default isVoidElement;
