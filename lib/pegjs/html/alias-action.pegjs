@import "../path-id-node.pegjs" as pathIdNode
@import "./tag-string.pegjs" as tagString
@import "../string-with-quotes.pegjs" as stringWithQuotes
@import "../mustache/statement-single.pegjs" as singleMustacheStatement
@import "../whitespace.pegjs" as _

{
  function buildActionEvent(event, actionContent) {
    actionContent.push('on=\"' + event + '\"');

    return [
      builder.generateMustache(actionContent.join(' '))
    ];
  }

  function isAliasEvent(event) {
    return !!ALIAS_EVENTS[event];
  }
}

start = actionAttribute

/**
  group: actionAttribute

  mustacheNode is either an id (simple string) or
  a stringWithQuotes array of [<open-quote>,stringInner,<close-quote>]

  When it is a quoted string with multiple elements (example: "submitComment target=view")
  we assume the action name submitComment is intended to be a bound attribute,
  i.e., {{action submitComment}} instead of {{action "submitComment"}}.
  Otherwise, if the quoted string has only a single part is assumed to be the simple string,
  example: "button event=submitComment" -> {{action "submitComment" on="event"}}
*/
actionAttribute
  = event:knownAliasEvent '=' mustacheNode:actionValue
{
  var actionBody, parts;

  if (typeof mustacheNode === 'string') {
    actionBody = mustacheNode;
  } else {
    parts = mustacheNode[1].split(' ');
    if (parts.length === 1) {
      actionBody = '"' + parts[0] + '"';
    } else {
      actionBody = mustacheNode[1];
    }
  }

  var actionContent = [actionBody];

  if (actionBody.indexOf('action ') !== 0) {
    actionContent.unshift('action');
  }

  return buildActionEvent(event, actionContent);
}

knownAliasEvent 'a valid JS event'
  = event:tagString &
{
  return isAliasEvent(event);
} { return event; }

actionValue
  = stringWithQuotes
  / id:pathIdNode { return id; }
  / value:singleMustacheStatement { return value; }
