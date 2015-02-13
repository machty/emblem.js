* bind-attr coalescing needs to be re-introduced. Specifically the
  ability to turn: `p.foo class={ bind-attr class=bar }` into
  `<p {{bind-attr class=":foo bar"}}></p>` and other merges of
  static and dynamic class names. To do this, the AST will need
  a more robust understanding of mustaches. Currently it only
  understands `bind-attr class=bar` as a string.
