import isVoidElement from './utils/void-elements';

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

  generateElement: function(tagName){
    return {
      type: 'element',
      tagName: tagName,
      isVoid: isVoidElement(tagName),
      attrStaches: [],
      classNameBindings: [],
      childNodes: []
    };
  },

  element: function(tagName){
    var node = this.generateElement(tagName);
    this.currentNode.childNodes.push(node);
    return node;
  },

  generateMustache: function(content, escaped){
    return {
      type: 'mustache',
      escaped: escaped !== false,
      content: content
    };
  },

  mustache: function(content, escaped){
    var node = this.generateMustache(content, escaped);
    this.currentNode.childNodes.push(node);
    return node;
  },

  generateBlock: function(content){
    return {
      type: 'block',
      content: content,
      childNodes: [],
      invertibleNodes: []
    };
  },

  block: function(content){
    var node = this.generateBlock(content);
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

  generateClassNameBinding: function(classNameBinding){
    return {
      type: 'classNameBinding',
      name: classNameBinding // could be "color", or could be "hasColor:red" or ":color"
    };
  },

  classNameBinding: function(classNameBinding){
    var node = this.generateClassNameBinding(classNameBinding);
    this.currentNode.classNameBindings.push(node);
    return node;
  },

  enter: function(node){
    this.previousNodes.push(this.currentNode);
    this.currentNode = node;
  },

  exit: function(){
    var lastNode = this.currentNode;
    this.currentNode = this.previousNodes.pop();
    return lastNode;
  },

  add: function(label, node) {
    if (Array.isArray(node)){
      for (var i=0, l=node.length; i<l; i++) {
        this.add(label, node[i]);
      }
    } else {
      this.currentNode[label].push(node);
    }
  }
};
