
start = newMustacheNameChar

// a character that can be in a mustache name
newMustacheNameChar = [-_/A-Za-z0-9] / m_arrayIndex / '.'

// Ember requires that array indexes have a . before them
m_arrayIndex = '.[' newMustacheNameChar* ']'
