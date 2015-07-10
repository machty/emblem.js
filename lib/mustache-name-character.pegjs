
start = newMustacheNameChar

// a character that can be in a mustache name
newMustacheNameChar = [A-Za-z0-9] / [_/] / '-' / m_arrayIndex / '.'

// Ember requires that array indexes have a . before them
m_arrayIndex = '.' '[' newMustacheNameChar* ']'
