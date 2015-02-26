export function visit(node, opcodes) {
  visitor[node.type](node, opcodes);
}

function visitArray(nodes, opcodes) {
  if (!nodes || nodes.length === 0) {
    return;
  }
  for (var i=0, l=nodes.length; i<l; i++) {
    visit(nodes[i], opcodes);
  }
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

  element: function(node, opcodes){
    opcodes.push(['openElementStart', [node.tagName]]);
    visitArray(node.attrStaches, opcodes);
    opcodes.push(['openElementEnd']);

    if (node.isVoid) {
      if (node.childNodes.length) {
        throw new Error('Cannot nest under void element ' + node.tagName);
      }
    } else {
      visitArray(node.childNodes, opcodes);
      opcodes.push(['closeElement', [node.tagName]]);
    }
  },

  block: function(node, opcodes){
    opcodes.push(['startBlock', [node.content]]);
    visitArray(node.childNodes, opcodes);

    if (node.inverseChildNodes && node.inverseChildNodes.length > 0) {
      opcodes.push(['mustache', ['else', true]]);
      visitArray(node.inverseChildNodes, opcodes);
    }

    opcodes.push(['endBlock', [node.content]]);
  },

  mustache: function(node, opcodes){
    opcodes.push(['mustache', [node.content, node.escaped]]);
  }

};
