import { processOpcodes } from "./process-opcodes";
import { visit } from "./template-visitor";
import { string } from "./quoting";

export function compile(ast) {
  var opcodes = [];
  visit(ast, opcodes);
  reset(compiler);
  processOpcodes(compiler, opcodes);
  return flush(compiler);
}

function reset(compiler) {
  compiler._content = [];
}

function flush(compiler) {
  return compiler._content.join('');
}

function pushContent(compiler, content) {
  compiler._content.push(content);
}

var classNameBindings, hasBoundClassNameBindings;

var compiler = {

  startProgram: function(){},
  endProgram: function(){},

  text: function(content){
    pushContent(this, content);
  },

  attribute: function(name, content){
    var attrString = ' ' + name;
    if (content === undefined) {
      // boolean attribute with a true value, this is a no-op
    } else {
      attrString += '=' + string(content);
    }
    pushContent(this, attrString);
  },

  openElementStart: function(tagName){
    this._insideElement = true;
    pushContent(this, '<'+tagName);
  },

  openElementEnd: function(){
    pushContent(this, '>');
    this._insideElement = false;
  },

  closeElement: function(tagName){
    pushContent(this, '</'+tagName+'>');
  },

  openClassNameBindings: function(){
    classNameBindings = [];
    hasBoundClassNameBindings = false;
  },

  classNameBinding: function(name) {
    if (!hasBoundClassNameBindings) {
      hasBoundClassNameBindings = (name.indexOf(':') !== 0);
    }
    classNameBindings.push(name);
  },

  closeClassNameBindings: function(){
    if (hasBoundClassNameBindings) {
      pushContent(this, ' {{bind-attr class='+string(classNameBindings.join(' '))+'}}');
    } else {
      pushContent(this, ' class='+string(classNameBindings.map(function(c){ return c.slice(1); }).join(' ')));
    }
  },

  startBlock: function(content){
    pushContent(this, '{{#' + content + '}}');
  },

  endBlock: function(content){
    var parts = content.split(' ');

    pushContent(this, '{{/' + parts[0] + '}}');
  },

  mustache: function(content, escaped){
    var prepend = this._insideElement ? ' ' : '';
    if (escaped) {
      pushContent(this, prepend + '{{' + content + '}}');
    } else {
      pushContent(this, prepend + '{{{' + content + '}}}');
    }
  }

};
