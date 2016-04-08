start = nonSeparatorColon

nonSeparatorColon = c:':' !' ' { return c; }
