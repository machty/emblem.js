@import "../path-id-node.pegjs" as pathIdNode
@import "../key.pegjs" as key

start = rawMustacheAttribute

// With vanilla Handlebars variant,
// p class=something -> <p class="{{something}}"></p>
rawMustacheAttribute
  = key:key '=' id:pathIdNode
{
  return [key, '{{' + id + '}}'];
}
