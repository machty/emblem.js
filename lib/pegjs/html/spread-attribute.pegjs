start = spreadAttribute

spreadAttribute
  = spread:'...attributes'
{
  return [spread]
}
