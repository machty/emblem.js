@import "../mustache/ast/statement.pegjs" as mustacheStatement
@import "../key.pegjs" as key
@import "../non-mustache-unit.pegjs" as nonMustacheUnit

start = normalAttribute

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
      if (node.escaped) {
        strings.push('{{' + node.content + '}}');
      } else {
        strings.push('{{{' + node.content + '}}}');
      }
    }
  });
  var result = [key, strings.join('')];
  return result;
}

attributeTextNodes
  = '"' a:attributeTextNodesInner '"' { return a; }
  / "'" a:attributeTextNodesInnerSingle "'" { return a; }

attributeTextNodesInner = first:preAttrMustacheText? tail:(mustacheStatement preAttrMustacheText?)* { return flattenArray(first, tail); }
attributeTextNodesInnerSingle = first:preAttrMustacheTextSingle? tail:(mustacheStatement preAttrMustacheTextSingle?)* { return flattenArray(first, tail); }

preAttrMustacheText = $preAttrMustacheUnit+
preAttrMustacheTextSingle = $preAttrMustacheUnitSingle+

preAttrMustacheUnit       = !(nonMustacheUnit / '"') c:. { return c; }
preAttrMustacheUnitSingle = !(nonMustacheUnit / "'") c:. { return c; }
