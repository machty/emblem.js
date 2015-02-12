export function generateBuilder(){
  reset(builder);
  return builder;
}

function reset(builder){
  var programNode = {
    type: 'program',
    childNodes: []
  };
  builder.currentNode = programNode;
  builder.previousNodes = [];
  builder._ast = programNode;
}

var builder = {
  toAST: function(){
    return this._ast;
  },

  generateText: function(content){
    return {type: 'text', content: content};
  },

  text: function(content){
    var node = this.generateText(content);
    this.currentNode.childNodes.push(node);
    return node;
  },

  element: function(tagName){
    var node = {
      type: 'element',
      tagName: tagName,
      attrStaches: [],
      childNodes: []
    };
    this.currentNode.childNodes.push(node);
    return node;
  },

  generateMustache: function(content){
    return {
      type: 'mustache',
      content: content
    };
  },

  mustache: function(content){
    var node = this.generateMustache(content);
    this.currentNode.childNodes.push(node);
    return node;
  },

  attribute: function(attrName, attrContent){
    var node = {
      type: 'attribute',
      name: attrName,
      content: attrContent
    };

    this.currentNode.attrStaches.push(node);
    return node;
  },

  enter: function(node){
    this.previousNodes.push(this.currentNode);
    this.currentNode = node;
  },

  exit: function(){
    this.currentNode = this.previousNodes.pop();
  },

  addChildNode: function(node) {
    this.currentNode.childNodes.push(node);
  },

  addChildNodes: function(nodes) {
    for (var i=0, l=nodes.length; i<l; i++) {
      this.addChildNode(nodes[i]);
    }
  }
};
