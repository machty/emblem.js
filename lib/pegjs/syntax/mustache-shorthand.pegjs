start = newMustacheShortHand

// shorthand %tagName, .className, #idName
newMustacheShortHand = shortHandTagName / shortHandIdName / shortHandClassName

shortHandTagName 'tagName shorthand'
  = '%' tagName:newMustacheShortHandName
{
  return 'tagName="' + tagName + '"';
}

shortHandIdName 'elementId shorthand'
  = '#' idName:newMustacheShortHandName
{
  return 'elementId="' + idName + '"';
}

shortHandClassName 'class shorthand'
= '.' className:newMustacheShortHandName
{
  return 'class="' + className + '"';
}

newMustacheShortHandName = $([A-Za-z0-9-]+)
