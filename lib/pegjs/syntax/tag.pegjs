@import "./css-identifier.pegjs" as cssIdentifier

start = tagNameShorthand

tagNameShorthand = '%' c:cssIdentifier { return c; }
