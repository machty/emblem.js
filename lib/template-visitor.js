/**
  Visit a single node
  @oaram {Object} node
  @param {Array} opcodes
*/
export function visit(node, opcodes) {
  visitor[node.type](node, opcodes);
}

/**
  Visit a series of nodes
  @oaram {Array} nodes
  @param {Array} opcodes
*/
function visitArray(nodes, opcodes) {
  if (!nodes || nodes.length === 0) {
    return;
  }
  for (var i=0, l=nodes.length; i<l; i++) {
    // Due to the structure of invertible nodes, it is possible to receive an array of arrays
    if (nodes[i] instanceof Array)
      visitArray(nodes[i], opcodes);
    else
      visit(nodes[i], opcodes);
  }
}

/**
  Process an invertible object
  @param {Object} node
  @param {Array} opcodes
*/
function addInvertible(node, opcodes) {
  opcodes.push(['mustache', [node.name.trim(), true]]);

  // The content helper always returns an array
  visitArray(node.content, opcodes);

  // Recursion if this node has more invertible nodes
  if (node.invertibleNodes)
    addInvertible(node.invertibleNodes, opcodes);
}

var visitor = {
  program: function(node, opcodes){
    opcodes.push(['startProgram']);
    visitArray(node.childNodes, opcodes);
    opcodes.push(['endProgram']);
  },

  text: function(node, opcodes){
    opcodes.push(['text', [node.content]]);
  },

  attribute: function(node, opcodes){
    opcodes.push(['attribute', [node.name, node.content]]);
  },

  classNameBinding: function(node, opcodes){
    opcodes.push(['classNameBinding', [node.name]]);
  },

  element: function(node, opcodes){
    opcodes.push(['openElementStart', [node.tagName]]);

    visitArray(node.attrStaches, opcodes);

    if (node.classNameBindings && node.classNameBindings.length) {
      opcodes.push(['openClassNameBindings']);
      visitArray(node.classNameBindings, opcodes);
      opcodes.push(['closeClassNameBindings']);
    }

    visitArray(node.inTagText, opcodes);

    if (node.isVoid) {
      if (node.childNodes.length) {
        throw new Error('Cannot nest under void element ' + node.tagName);
      }
      opcodes.push(['openElementEnd', [node.isVoid]]);
    } else {
      opcodes.push(['openElementEnd']);
      visitArray(node.childNodes, opcodes);
      opcodes.push(['closeElement', [node.tagName]]);
    }
  },

  block: function(node, opcodes){
    opcodes.push(['startBlock', [node.content]]);
    visitArray(node.childNodes, opcodes);

    // The root block node will have an array of invertibleNodes, but there can only ever be one
    if (node.invertibleNodes && node.invertibleNodes.length > 0) {
      addInvertible(node.invertibleNodes[0], opcodes);
    }

    opcodes.push(['endBlock', [node.content]]);
  },

  mustache: function(node, opcodes){
    opcodes.push(['mustache', [node.content, node.escaped]]);
  },

  inTagText: function(node, opcodes) {
    opcodes.push(['inTagText', [node.content]]);
  },

  assignedMustache: function(node, opcodes) {
    opcodes.push(['assignedMustache', [node.content, node.key]]);
  }
};
