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
    visitArray(node.childNodes, opcodes);
    opcodes.push(['closeElement', [node.tagName]]);
  }

};
