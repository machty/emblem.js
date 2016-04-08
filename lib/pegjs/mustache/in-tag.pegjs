@import "./raw.pegjs" as rawMustache
@import "./recursively-parsed.pegjs" as recursivelyParsedMustacheContent
@import "../whitespace.pegjs" as _

start = inTagMustache

inTagMustache
  = rawMustacheSingle / rawMustache

// Support for div#id.whatever{ bindAttr whatever="asd" }
rawMustacheSingle
  = singleOpen _ m:recursivelyParsedMustacheContent _ singleClose {
    return builder.generateMustache( m, true );
  }


/**
  Duplicates
*/
singleOpen "SingleMustacheOpen" = '{'
singleClose "SingleMustacheClose" = '}'
