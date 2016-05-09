start = recursivelyParsedMustacheContent

recursivelyParsedMustacheContent
  = !'{' text:$[^}]*
{
  return text;
}
