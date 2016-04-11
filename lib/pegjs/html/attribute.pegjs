@import "./alias-action.pegjs" as aliasAction
@import "./boolean-attr.pegjs" as booleanAttribute
@import "./boolean-attr-with-mustache.pegjs" as boundAttributeWithSingleMustache
@import "./bound-attr.pegjs" as boundAttribute
@import "./normal-attribute.pegjs" as normalAttribute
@import "./unbound-attribute.pegjs" as unboundAttribute
@import "../whitespace.pegjs" as _

attribute
  = _ a:(aliasAction / booleanAttribute / boundAttributeWithSingleMustache / boundAttribute / normalAttribute / unboundAttribute)
{
  if (!a)
    return [];
  else if (!a.length)
    return [a];
  else
    return a;
}
