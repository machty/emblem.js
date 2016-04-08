@import "./all-characters-except-colon.pegjs" as allCharactersExceptColonSyntax
@import "../path-id-node.pegjs" as pathIdNode
@import "./tag-string.pegjs" as tagString
@import "../whitespace.pegjs" as _

{
  function buildActionEvent(event, actionContent) {
    if (isAliasEvent(event)) {
      actionContent.push('on=\"' + event + '\"');

      return [
        builder.generateMustache(actionContent.join(' '))
      ];

    } else {
      return [
        builder.generateAssignedMustache(actionContent.join(' '), event.toLowerCase())
      ]
    }
  }

  function isKnownEvent(event) {
    return isAliasEvent(event) || isHTMLEvent(event);
  }

  function isAliasEvent(event) {
    return !!ALIAS_EVENTS[event];
  }

  function isHTMLEvent(event) {
    var lowercaseEvent = event.toLowerCase();

    return !!HTML_EVENTS[lowercaseEvent];
  }
}

start = actionHandle

actionHandle = stringActionAttribute / mustacheActionAttribute

/**
  group: stringActionAttribute

  mustacheNode is either an id (simple string) or
  a stringWithQuotes array of [<open-quote>,stringInner,<close-quote>]

  When it is a quoted string with multiple elements (example: "submitComment target=view")
  we assume the action name submitComment is intended to be a bound attribute,
  i.e., {{action submitComment}} instead of {{action "submitComment"}}.
  Otherwise, if the quoted string has only a single part is assumed to be the simple string,
  example: "button event=submitComment" -> {{action "submitComment" on="event"}}
*/
stringActionAttribute
  = event:knownEvent '=' mustacheNode:actionValue
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

  var actionContent = ['action'];
  actionContent.push(actionBody);

  if (isHTMLEvent(event)) {
    throw 'Using string actions on DOM events is not supported';
  }

  return buildActionEvent(event, actionContent);
}

/**
  group: mustacheActionAttribute

  mustacheNode is any single mustache grouping that is being assigned to a knownEvent
  supports assigning closure actions to dom events
*/
mustacheActionAttribute
  = event:knownEvent '=' '{' _ mustacheNode:allCharactersExceptColonSyntax _ '}'
{
  var actionContent = [];

  if (mustacheNode.indexOf('action') === -1) {
    actionContent.push('action')
  }
  actionContent.push(mustacheNode);

  return buildActionEvent(event, actionContent);
}

knownEvent "a JS event" = event:tagString &{
  return isKnownEvent(event);
} { return event; }

// Value of an action can be an unwrapped string, or a single or double quoted string
actionValue
  = stringWithQuotes
  / id:pathIdNode { return id; }

stringWithQuotes = p:('"' hashDoubleQuoteStringValue '"' / "'" hashSingleQuoteStringValue "'") {
  return p;
}


/**
  Duplicates
*/
hashDoubleQuoteStringValue = $(!(TERM) [^"}])*
hashSingleQuoteStringValue = $(!(TERM) [^'}])*

TERM  "LineEnd" = "\r"? t:. &{ return TERM_SYMBOL == t; } "\n" { return false; }
