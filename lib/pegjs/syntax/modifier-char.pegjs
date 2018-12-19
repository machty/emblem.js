start = modifierChar

// unbound (!) and conditional (?) modifiers
modifierChar = unboundChar / conditionalChar

// deprecated
unboundChar 'Unbound modifier !'
  = '!'

conditionalChar 'Conditional modifier ?'
  = '?'
