
@import "./mustache-attrs.pegjs" as mustacheAttrs
@import "./mustache-attr-value.pegjs" as newMustacheAttrValue
@import "./mustache-name-character.pegjs" as newMustacheNameChar

start = newMustache

// Returns an object with this shape:
// {
//   name: string,
//   attrs: array, (items look like 'class="abc"', 'tagName="xyz"', '(query-params foo=bar)', 'blah', '"quotedBlah"', etc)
//   blockParams: array, (items are all strings like 'item', 'foo', etc.)
//   modifier: '?' or '!' (optional),
// }
// upstream parsers will optionally add an `isEscaped:true` property
newMustache = name:newMustacheStart m_* attrs:mustacheAttrs blockParams:m_blockParams? {
  attrs = attrs.concat(name.shorthands);
  var ret = {
    name: name.name,
    attrs: attrs,
    blockParams: blockParams
  };
  if (name.modifier) {
    ret.modifier = name.modifier;
  }

  return ret;
}

newMustacheStart = name:newMustacheName m_* shorthands:newMustacheShortHand* {
  return {
    name: name.name,
    modifier: name.modifier,
    shorthands: shorthands
  };
}

m_blockParams = m_blockStart m_* params:blockParamName+ "|" {
  return params;
}

m_blockStart = "as" m_* "|"

blockParamName = newMustacheAttrValue

// shorthand %tagName, .className, #idName
newMustacheShortHand = m_shortHandTagName / m_shortHandIdName / m_shortHandClassName

m_shortHandTagName = '%' tagName:newMustacheShortHandName {
  return 'tagName="' + tagName + '"';
}

m_shortHandIdName = '#' idName:newMustacheShortHandName {
  return 'elementId="' + idName + '"';
}

m_shortHandClassName = '.' className:newMustacheShortHandName {
  return 'class="' + className + '"';
}

newMustacheShortHandName = $([A-Za-z0-9-]+)

newMustacheName = !m_invalidNameStartChar name:$newMustacheNameChar+ modifier:m_modifierChar? {
  return {
    name: name,
    modifier: modifier
  };
}

m_invalidNameStartChar = '.' / '-' / [0-9]

// unbound (!) and conditional (?) modifiers
m_modifierChar = '!' / '?'

m_ = ' '
