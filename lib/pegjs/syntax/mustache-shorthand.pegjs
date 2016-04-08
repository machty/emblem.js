start = newMustacheShortHand

// shorthand %tagName, .className, #idName
newMustacheShortHand = shortHandTagName / shortHandIdName / shortHandClassName

shortHandTagName = '%' tagName:newMustacheShortHandName {
  return 'tagName="' + tagName + '"';
}

shortHandIdName = '#' idName:newMustacheShortHandName {
  return 'elementId="' + idName + '"';
}

shortHandClassName = '.' className:newMustacheShortHandName {
  return 'class="' + className + '"';
}

newMustacheShortHandName = $([A-Za-z0-9-]+)
