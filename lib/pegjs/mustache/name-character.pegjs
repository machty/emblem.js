start = newMustacheNameChar

// a character that can be in a mustache name
newMustacheNameChar = [-_/A-Za-z0-9] / arrayIndex / '.' / '@' / '::' / '$'

// Ember requires that array indexes have a . before them
arrayIndex = '.[' newMustacheNameChar* ']'
