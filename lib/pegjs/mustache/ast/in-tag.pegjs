@import "./statement.pegjs" as statement
@import "../statement-single.pegjs" as singleMustacheStatement
@import "../../whitespace.pegjs" as _

start = inTagMustache

inTagMustache
  = builtSingle / statement

builtSingle
  = m:singleMustacheStatement
{
  return builder.generateMustache(m, true);
}
