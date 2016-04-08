@import "./css-identifier.pegjs" as cssIdentifier

start = idShorthand

idShorthand = '#' c:cssIdentifier { return c;}
