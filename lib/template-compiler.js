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

/**
  Wrap an string in mustache
  @param {Array} names
  @return {Array}
*/
function wrapMustacheStrings(names) {
  return names.map(function(name) { return '{{' + name + '}}'; });
}

/**
  Map a colon syntax string to inline if syntax.
  @param {String} Name
  @return {String}
*/
function mapColonSyntax(name) {
  var parts = name.split(':');

  // First item will always be wrapped in single quotes (since we need at least one result for condition)
  parts[1] = singleQuoteString(parts[1]);

  // Only wrap second option if it exists
  if (parts[2])
    parts[2] = singleQuoteString(parts[2]);

  parts.unshift('if');

  return parts.join(' ');
}

/**
  Wrap an string in single quotes
  @param {String} value
  @return {String}
*/
function singleQuoteString(value) {
  return "'" + value + "'";
}

var boundClassNames, unboundClassNames;

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
    boundClassNames = [];
    unboundClassNames = [];
  },

  /**
    Add a class name binding
    @param {String} name
  */
  classNameBinding: function(name) {
    var isBoundAttribute = name[0] !== ':';

    if (isBoundAttribute) {
      var isColonSyntax = name.indexOf(':') > -1;
      if (isColonSyntax) {
        name = mapColonSyntax(name);
      }
      boundClassNames.push(name);
    } else {
      name = name.slice(1);
      unboundClassNames.push(name);
    }
  },

  /**
    Group all unbound classes into a single string
    Wrap each binding in mustache
  */
  closeClassNameBindings: function() {
    var unboundClassString = unboundClassNames.join(' ');
    var mustacheString = wrapMustacheStrings(boundClassNames).join(' ');
    var results = [unboundClassString, mustacheString];

    // Remove any blank strings
    results = results.filter(function (i) {
      return i !== "";
    });
    results = results.join(' ');

    // We only need to wrap the results in quotes if we have at least one unbound or more than 1 bound attributes
    var wrapInString = unboundClassString.length > 0 || boundClassNames.length > 1;

    if (wrapInString)
      results = string(results);
    else if (results.length === 0)
      results = '\"\"';

    pushContent(this, ' class=' + results);
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
  },

  /**
    Special syntax for assigning mustache to a key
    @param {String} content
    @param {String} key
  */
  assignedMustache: function(content, key) {
    var prepend = this._insideElement ? ' ' : '';
    pushContent(this, prepend + key + '=' + '{{' + content + '}}');
  }
};
