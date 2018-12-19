@import "./css-identifier.pegjs" as cssIdentifier

start = idShorthand

idShorthand 'HTML ID'
  = '#' c:cssIdentifier { return c;}
