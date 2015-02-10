import { parse as pegParse, ParserSyntaxError } from './parser';
import EmberDelegate from './parser-delegate/ember';
import { processSync } from './preprocessor';

function throwCompileError(line, msg) {
  throw new Error("Emblem syntax error, line " + line + ": " + msg);
}

export function registerPartial(handlebarsVariant, partialName, text) {
  if (!text) {
    text = partialName;
    partialName = handlebarsVariant;
    if (typeof window === "undefined") {
      throw new Error('You must provide a Handlebars reference if not in a browser');
    }
    handlebarsVariant = window && window.Handlebars;
  }
  return handlebarsVariant.registerPartial(partialName, compile(handlebarsVariant, text));
}

export function parse(string, handlebarsVariant) {
  var e, line, lines, msg;

  try {
    var AST = {};
    var astDelegate = new EmberDelegate(AST, parse);
    var processed = processSync(string);
    return pegParse(processed, {
      astDelegate: astDelegate
    });
  } catch (_error) {
    e = _error;
    if (e instanceof ParserSyntaxError) {
      lines = string.split("\n");
      line = lines[e.line - 1];
      msg = "" + e.message + "\n" + line + "\n";
      msg += new Array(e.column).join("-");
      msg += "^";
      return throwCompileError(e.line, msg);
    } else {
      throw e;
    }
  }
}

export function precompile(handlebarsVariant, string, options) {
  var ast;
  if (options == null) {
    options = {};
  }
  ast = parse(string);
  return handlebarsVariant.precompile(ast, false);
}

export function compile(handlebarsVariant, string, options) {
  var ast;
  if (options == null) {
    options = {};
  }
  ast = parse(string);
  return handlebarsVariant.compile(ast, options);
}

