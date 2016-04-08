@import "./css-identifier.pegjs" as cssIdentifier

start = classShorthand

classShorthand = '.' c:cssIdentifier { return c; }
