start = nonMustache

nonMustache 'mustache expression'
  = !'{' text:$[^}]*
{
  return text;
}
