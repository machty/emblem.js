@import "../non-mustache.pegjs" as nonMustacheCharacter
@import "../../whitespace.pegjs" as _

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

/**
  Returns AST
*/
start = rawMustache

rawMustache = rawMustacheUnescaped / rawMustacheEscaped

rawMustacheUnescaped
 = tripleOpen _ content:nonMustacheCharacter _ tripleClose
{
  return builder.generateMustache( prepareMustachValue(content), false);
}

rawMustacheEscaped
 = doubleOpen _ content:nonMustacheCharacter _ doubleClose
{
  return builder.generateMustache( prepareMustachValue(content), true);
}
 / hashStacheOpen _ content:nonMustacheCharacter _ hashStacheClose
{
  return builder.generateMustache( prepareMustachValue(content), true);
}


/**
  Duplicates
*/
doubleOpen "Double Mustache Open" = '{{'
tripleOpen "Triple Mustache Open" = '{{{'
doubleClose "Double Mustache Close" = '}}'
tripleClose "Triple Mustache Close" = '}}}'
hashStacheOpen  "String Interpolation Open"  = '#{'
hashStacheClose "String Interpolation Close" = '}'
