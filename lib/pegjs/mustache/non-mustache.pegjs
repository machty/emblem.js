start = nonMustache

nonMustache
  = !'{' text:$[^}]*
{
  return text;
}
