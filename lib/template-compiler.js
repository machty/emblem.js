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
    pushContent(this, '<'+tagName);
  },

  openElementEnd: function(){
    pushContent(this, '>');
  },

  closeElement: function(tagName){
    pushContent(this, '</'+tagName+'>');
  }

};
