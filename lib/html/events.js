var eventAliases = [
  'blur',
  'change',
  'click',
  'contextMenu',
  'dblclick',
  'drag',
  'dragEnd',
  'dragEnter',
  'dragLeave',
  'dragOver',
  'dragStart',
  'drop',
  'focus',
  'focusIn',
  'focusOut',
  'input',
  'keyDown',
  'keyPress',
  'keyUp',
  'mouseDown',
  'mouseEnter',
  'mouseLeave',
  'mouseMove',
  'mouseUp',
  'resize',
  'scroll',
  'select',
  'submit',
  'touchCancel',
  'touchEnd',
  'touchMove',
  'touchStart'
]

function toObject(objects) {
  return objects.reduce((results, event) => {
    results[event] = true;
    return results;
  }, {})
}

var HTML_EVENTS = toObject(eventAliases.map(function(name) {
  return 'on' + name;
}));
var ALIAS_EVENTS = toObject(eventAliases);

export { HTML_EVENTS, ALIAS_EVENTS }
