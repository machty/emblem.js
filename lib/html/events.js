var rawEvents = [
  'onclick',
  'ondblclick',
  'onmousedown',
  'onmouseup',
  'onmouseover',
  'onmousemove',
  'onmouseout',
  'ondragstart',
  'ondrag',
  'ondragenter',
  'ondragleave',
  'ondragover',
  'ondrop',
  'ondragend',
  'onkeydown',
  'onkeypress',
  'onkeyup',
  'onload',
  'onunload',
  'onabort',
  'onerror',
  'onresize',
  'onscroll',
  'onselect',
  'onchange',
  'onsubmit',
  'onreset',
  'onfocus',
  'onblur',
  'onfocusin',
  'onfocusout',
  'onloadstart',
  'onprogress',
  'onerror',
  'onabort',
  'onload',
  'onloadend',
];

var eventAliases = [
  'touchStart',
  'touchMove',
  'touchEnd',
  'touchCancel',
  'keyDown',
  'keyUp',
  'keyPress',
  'mouseDown',
  'mouseUp',
  'contextMenu',
  'click',
  'doubleClick',
  'mouseMove',
  'focusIn',
  'focusOut',
  'mouseEnter',
  'mouseLeave',
  'submit',
  'input',
  'change',
  'dragStart',
  'drag',
  'dragEnter',
  'dragLeave',
  'dragOver',
  'drop',
  'dragEnd',
]

function toObject(objects) {
  return objects.reduce((results, event) => {
    results[event] = true;
    return results;
  }, {})
}

var HTML_EVENTS = toObject(rawEvents);
var ALIAS_EVENTS = toObject(eventAliases);

export { HTML_EVENTS, ALIAS_EVENTS }
