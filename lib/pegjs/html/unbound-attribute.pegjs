@import "../path-id-node.pegjs" as pathIdNode
@import "../key.pegjs" as key

start = simpleMustacheAttr

/**
   With vanilla Handlebars variant or unbound attrs
   p class=something  -> <p class="{{something}}"></p>
   p class=something! -> <p class="{{unbound something}}"></p>
*/
simpleMustacheAttr
  = key:key '=' value:pathIdNode
{
  return [key, '{{' + value + '}}'];
}
