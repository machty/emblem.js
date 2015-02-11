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

var compiler = {

  startProgram: function(){},
  endProgram: function(){},

  text: function(content){
    pushContent(this, content);
  },

  attribute: function(name, content){
    pushContent(this, ' '+name+'='+string(content));
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

  startBlock: function(content){
    pushContent(this, '{{#' + content + '}}');
  },

  endBlock: function(content){
    var parts = content.split(' ');

    pushContent(this, '{{/' + parts[0] + '}}');
  },

  mustache: function(content){
    var prepend = this._insideElement ? ' ' : '';
    pushContent(this, prepend + '{{' + content + '}}');
  }

};
