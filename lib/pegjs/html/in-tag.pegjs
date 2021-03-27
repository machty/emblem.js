@import "./tag-html.pegjs" as tagHtml
@import "./tag-component.pegjs" as tagComponent

{
  function parseInHtml(h, inTagMustaches, fullAttributes, blockParams, isHtmlComponent) {
    var tagName = h[0] || 'div',
        shorthandAttributes = h[1] || [],
        isVoid = h[2],
        id = shorthandAttributes[0],
        classes = shorthandAttributes[1] || [];
    var i, l;

    const elementNode = builder.generateElement(tagName);
    if (isVoid) elementNode.isVoid = isVoid
    builder.enter(elementNode);

    for (i=0, l=classes.length;i<l;i++) {
      if (classes[i].type === 'classNameBinding') {
        builder.add('classNameBindings', classes[i]);
      } else {
        builder.classNameBinding(':'+classes[i]);
      }
    }

    if (id) {
      builder.attribute('id', id);
    }

    for(i = 0; i < inTagMustaches.length; ++i) {
      builder.add('attrStaches', inTagMustaches[i]);
    }

    for(i = 0; i < fullAttributes.length; ++i) {
      var currentAttr = fullAttributes[i];

      if (Array.isArray(currentAttr) && typeof currentAttr[0] === 'string') {  // a "normalAttribute", [attrName, attrContent]
        if (currentAttr.length) { // a boolean false attribute will be []

          // skip classes now, coalesce them later
          if (currentAttr[0] === 'class') {
            builder.classNameBinding(':'+currentAttr[1]);
          } else {
            builder.attribute(currentAttr[0], currentAttr[1]);
          }
        }
      } else if (Array.isArray(currentAttr)) {
        currentAttr.forEach(function(attrNode){
          builder.add(
            attrNode.type === 'classNameBinding' ? 'classNameBindings' : 'attrStaches',
            attrNode
          );
        });
      } else {
        builder.add(
          currentAttr.type === 'classNameBinding' ? 'classNameBindings' : 'attrStaches',
          currentAttr
        );
      }
    }

    if (blockParams && blockParams.length > 0) {
      const joiningParams = []
      const destructuredParams = []
      groupBlockParams(blockParams, joiningParams, destructuredParams)
      const tagString = 'as |' + joiningParams.join(' ') + '|';
      builder.inTagText(tagString);

      if (destructuredParams.length) {
        createDestructuringBlock(destructuredParams)
        return [isHtmlComponent, true];
      }
    }
    return [isHtmlComponent, false];
  }

  function isKnownTag(tag) {
    return !!KNOWN_TAGS[tag];
  }
}

start
  = tagHtml
  / tagComponent
