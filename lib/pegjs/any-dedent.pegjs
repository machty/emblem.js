start = anyDedent

anyDedent "ANYDEDENT" = (DEDENT / UNMATCHED_DEDENT)

DEDENT "DEDENT" = t:. &{ return DEDENT_SYMBOL === t; } { return ''; }
UNMATCHED_DEDENT "Unmatched DEDENT" = t:. &{ return UNMATCHED_DEDENT_SYMBOL === t; } { return ''; }
