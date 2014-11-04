var Emblem;

Emblem = require('./emblem');

Emblem.throwCompileError = function(line, msg) {
  throw new Error("Emblem syntax error, line " + line + ": " + msg);
};

Emblem.registerPartial = function(handlebarsVariant, partialName, text) {
  if (!text) {
    text = partialName;
    partialName = handlebarsVariant;
    handlebarsVariant = Handlebars;
  }
  return handlebarsVariant.registerPartial(partialName, Emblem.compile(handlebarsVariant, text));
};

Emblem.parse = function(string) {
  var e, line, lines, msg, processed;
  try {
    processed = Emblem.Preprocessor.processSync(string);
    return Emblem.Parser.parse(processed);
  } catch (_error) {
    e = _error;
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

Emblem.precompile = function(handlebarsVariant, string, options) {
  var ast;
  if (options == null) {
    options = {};
  }
  Emblem.handlebarsVariant = handlebarsVariant;
  ast = Emblem.parse(string);
  return handlebarsVariant.precompile(ast, false);
};

Emblem.compile = function(handlebarsVariant, string, options) {
  var ast;
  if (options == null) {
    options = {};
  }
  Emblem.handlebarsVariant = handlebarsVariant;
  ast = Emblem.parse(string);
  return handlebarsVariant.compile(ast, options);
};
