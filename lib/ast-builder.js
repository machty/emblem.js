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

  text: function(content){
    var node = {type: 'text', content: content};
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
  }
};
