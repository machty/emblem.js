var Emblem, Handlebars,
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

Handlebars = require('handlebars');

Emblem = require('./emblem');

Emblem.throwCompileError = function(line, msg) {
  throw new Error("Emblem syntax error, line " + line + ": " + msg);
};

Emblem.parse = function(string) {
  var line, lines, msg, processed;
  try {
    processed = Emblem.Preprocessor.processSync(string);
    return new Handlebars.AST.ProgramNode(Emblem.Parser.parse(processed), []);
  } catch (e) {
    if (e instanceof Emblem.Parser.SyntaxError) {
      lines = string.split("\n");
      line = lines[e.line - 1];
      msg = "" + e.message + "\n" + line + "\n";
      msg += new Array(e.column).join("-");
      msg += "^";
      return Emblem.throwCompileError(e.line, msg);
    } else {
      throw e;
    }
  }
};

Emblem.precompileRaw = function(string, options) {
  var ast, environment;
  if (options == null) {
    options = {};
  }
  if (typeof string !== 'string') {
    throw new Handlebars.Exception("You must pass a string to Emblem.precompile. You passed " + string);
  }
  if (__indexOf.call(options, 'data') < 0) {
    options.data = true;
  }
  ast = Emblem.parse(string);
  environment = new Handlebars.Compiler().compile(ast, options);
  return new Handlebars.JavaScriptCompiler().compile(environment, options);
};

Emblem.compileRaw = function(string, options) {
  var compile, compiled;
  if (options == null) {
    options = {};
  }
  if (typeof string !== 'string') {
    throw new Handlebars.Exception("You must pass a string to Emblem.compile. You passed " + string);
  }
  if (__indexOf.call(options, 'data') < 0) {
    options.data = true;
  }
  compiled = null;
  compile = function() {
    var ast, environment, templateSpec;
    ast = Emblem.parse(string);
    environment = new Handlebars.Compiler().compile(ast, options);
    templateSpec = new Handlebars.JavaScriptCompiler().compile(environment, options, void 0, true);
    return Handlebars.template(templateSpec);
  };
  return function(context, options) {
    if (!compiled) {
      compiled = compile();
    }
    return compiled.call(this, context, options);
  };
};

Emblem.precompile = Emblem.precompileRaw;

Emblem.compile = Emblem.compileRaw;

Emblem.precompileEmber = function(string) {
  var ast, environment, options;
  ast = Emblem.parse(string);
  options = {
    knownHelpers: {
      action: true,
      unbound: true,
      bindAttr: true,
      template: true,
      view: true,
      _triageMustache: true
    },
    data: true,
    stringParams: true
  };
  environment = new Ember.Handlebars.Compiler().compile(ast, options);
  return new Ember.Handlebars.JavaScriptCompiler().compile(environment, options, void 0, true);
};

Emblem.compileEmber = function(string) {
  var ast, environment, options, templateSpec;
  ast = Emblem.parse(string);
  options = {
    data: true,
    stringParams: true
  };
  environment = new Ember.Handlebars.Compiler().compile(ast, options);
  templateSpec = new Ember.Handlebars.JavaScriptCompiler().compile(environment, options, void 0, true);
  return Ember.Handlebars.template(templateSpec);
};
