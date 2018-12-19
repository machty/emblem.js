@import "./param.pegjs" as param
@import "./syntax/tag.pegjs" as tagNameShorthand
@import "./syntax/id.pegjs" as idShorthand
@import "./syntax/class.pegjs" as classShorthand
@import "./whitespace.pegjs" as _
@import "./whitespace-req.pegjs" as __

start = legacyPartialInvocation

legacyPartialInvocation
  = '>' _ n:legacyPartialName params:inMustacheParam* _ TERM
{
  return [new AST.PartialNode(n, params[0], undefined, {})];
}

legacyPartialName
  = s:$[a-zA-Z0-9_$-/]+ {
  return new AST.PartialNameNode(new AST.StringNode(s));
}

inMustacheParam
  = a:(htmlMustacheAttribute / __ p:param { return p; } ) { return a; }

// %div converts to tagName="div", .foo.thing converts to class="foo thing", #id converst to elementId="id"
htmlMustacheAttribute
  = _ a:( t:tagNameShorthand  { return ['tagName', t]; }
        / i:idShorthand       { return ['elementId', i]; }
        / c:classShorthand    { return ['class', c]; })
{
  return a;
}


/**
  Duplicates
*/
TERM  "LineEnd" = "\r"? t:. &{ return TERM_SYMBOL == t; } "\n" { return false; }
