@import "./alias-action.pegjs" as aliasAction
@import "./boolean-attr.pegjs" as booleanAttribute
@import "./boolean-attr-with-mustache.pegjs" as boundAttributeWithSingleMustache
@import "./bound-attr.pegjs" as boundAttribute
@import "./normal-attribute.pegjs" as normalAttribute
@import "./unbound-attribute.pegjs" as unboundAttribute
@import "./tag-string.pegjs" as tagString
@import "../mustache/ast/in-tag.pegjs" as inTagMustache
@import "../syntax/id.pegjs" as idShorthand
@import "../syntax/class.pegjs" as classShorthand
@import "../whitespace.pegjs" as _
@import "../whitespace-req.pegjs" as __

{
  function parseInHtml(h, inTagMustaches, fullAttributes) {
    var tagName = h[0] || 'div',
        shorthandAttributes = h[1] || [],
        id = shorthandAttributes[0],
        classes = shorthandAttributes[1] || [];
    var i, l;

    var elementNode = builder.generateElement(tagName);
    builder.enter(elementNode);

    for (i=0, l=classes.length;i<l;i++) {
      if (classes[i].type === 'classNameBinding') {
        builder.add('classNameBindings', classes[i]);
      } else {
        builder.classNameBinding(':'+classes[i]);
      }
    }

    if (id) {
      builder.attribute('id', id);
    }

    for(i = 0; i < inTagMustaches.length; ++i) {
      builder.add('attrStaches', inTagMustaches[i]);
    }

    for(i = 0; i < fullAttributes.length; ++i) {
      var currentAttr = fullAttributes[i];

      if (Array.isArray(currentAttr) && typeof currentAttr[0] === 'string') {  // a "normalAttribute", [attrName, attrContent]
        if (currentAttr.length) { // a boolean false attribute will be []

          // skip classes now, coalesce them later
          if (currentAttr[0] === 'class') {
            builder.classNameBinding(':'+currentAttr[1]);
          } else {
            builder.attribute(currentAttr[0], currentAttr[1]);
          }
        }
      } else if (Array.isArray(currentAttr)) {
        currentAttr.forEach(function(attrNode){
          builder.add(
            attrNode.type === 'classNameBinding' ? 'classNameBindings' : 'attrStaches',
            attrNode
          );
        });
      } else {
        builder.add(
          currentAttr.type === 'classNameBinding' ? 'classNameBindings' : 'attrStaches',
          currentAttr
        );
      }
    }
  }

  function isKnownTag(tag) {
    return !!KNOWN_TAGS[tag];
  }
}

start = inHtmlTag

/**
  group: inHtmLTag

  Everything that goes in the angle brackets of an html tag. Examples:
  p#some-id class="asdasd"
  #some-id data-foo="sdsdf"
  p{ action "click" target="view" }
*/
inHtmlTag
= h:htmlStart ' [' TERM* inTagMustaches:inTagMustache* fullAttributes:bracketedAttribute+
{
  return parseInHtml(h, inTagMustaches, fullAttributes);
}
/ h:htmlStart inTagMustaches:inTagMustache* fullAttributes:attribute*
{
  return parseInHtml(h, inTagMustaches, fullAttributes);
}


// Start of a chunk of HTML. Must have either tagName or shorthand
// class/id attributes or both. Examples:
// p#some-id
// #some-id
// .a-class
// span.combo#of.stuff
// NOTE: this returns a 2 element array of [h,s].
// The return is used to reject a when both h an s are falsy.
htmlStart = h:htmlTagName? s:shorthandAttributes? '/'? &{ return h || s; }


/**
  Tag Name
*/
htmlTagName "KnownHTMLTagName"
  = componentTag
  / knownTagName

componentTag = '%' _ s:tagString { return s; }

knownTagName = tag:tagString &{ return isKnownTag(tag); }  { return tag; }


/**
  Tag Attributes
*/
shorthandAttributes
  = shorthands:(s:idShorthand    { return { shorthand: s, id: true}; } /
                s:classShorthand { return { shorthand: s }; } )+
{
  var id, classes = [];
  for(var i = 0, len = shorthands.length; i < len; ++i) {
    var shorthand = shorthands[i];
    if(shorthand.id) {
      id = shorthand.shorthand;
    } else {
      classes.push(shorthand.shorthand);
    }
  }

  return [id, classes];
}

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

bracketedAttribute
  = INDENT* a:attribute TERM*
{
  return a;
}

/**
  Duplicates
*/
TERM  "LineEnd" = "\r"? t:. &{ return TERM_SYMBOL == t; } "\n" { return false; }
INDENT "INDENT" = t:. &{ return INDENT_SYMBOL === t; } { return ''; }
