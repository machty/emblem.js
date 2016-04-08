@import "./recursively-parsed.pegjs" as recursivelyParsedMustacheContent
@import "../whitespace.pegjs" as _

{
  function prepareMustachValue(content){
    var parts = content.split(' '),
        first,
        match;

    // check for '!' unbound helper
    first = parts.shift();
    if (match = first.match(/(.*)!$/)) {
      parts.unshift( match[1] );
      content = 'unbound ' + parts.join(' ');
    } else {
      parts.unshift(first);
    }

    // check for '?' if helper
    first = parts.shift();
    if (match = first.match(/(.*)\?$/)) {
      parts.unshift( match[1] );
      content = 'if ' + parts.join(' ');
    } else {
      parts.unshift(first);
    }
    return content;
  }
}

start = rawMustache

rawMustache = rawMustacheUnescaped / rawMustacheEscaped

rawMustacheUnescaped
 = tripleOpen _ content:recursivelyParsedMustacheContent _ tripleClose
{
  return builder.generateMustache( prepareMustachValue(content), false);
}

rawMustacheEscaped
 = doubleOpen _ content:recursivelyParsedMustacheContent _ doubleClose
{
  return builder.generateMustache( prepareMustachValue(content), true);
}
 / hashStacheOpen _ content:recursivelyParsedMustacheContent _ hashStacheClose
{
  return builder.generateMustache( prepareMustachValue(content), true);
}


/**
  Duplicates
*/
doubleOpen "DoubleMustacheOpen" = '{{'
tripleOpen "TripleMustacheOpen" = '{{{'
doubleClose "DoubleMustacheClose" = '}}'
tripleClose "TripleMustacheClose" = '}}}'
hashStacheOpen  "InterpolationOpen"  = '#{'
hashStacheClose "InterpolationClose" = '}'
