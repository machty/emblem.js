import Emblem from './emblem';

import { parse as pegParse } from './parser';
import BaseDelegate  from './parser-delegate/base';
import EmberDelegate from './parser-delegate/ember';

function throwCompileError(line, msg) {
  throw new Error("Emblem syntax error, line " + line + ": " + msg);
}

export function registerPartial(handlebarsVariant, partialName, text) {
  if (!text) {
    text = partialName;
    partialName = handlebarsVariant;
    handlebarsVariant = window.Handlebars;
  }
  return handlebarsVariant.registerPartial(partialName, compile(handlebarsVariant, text));
}

export function parse(string, handlebarsVariant) {
  var e, line, lines, msg;

  try {
    var AST = {};
    var astDelegate = new EmberDelegate(AST, parse);
    var processed = Emblem.Preprocessor.processSync(string);
    return pegParse(processed, {
      astDelegate: astDelegate
    });
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
}

export function precompile(handlebarsVariant, string, options) {
  var ast;
  if (options == null) {
    options = {};
  }
  Emblem.handlebarsVariant = handlebarsVariant;
  ast = Emblem.parse(string);
  return handlebarsVariant.precompile(ast, false);
}

export function compile(handlebarsVariant, string, options) {
  var ast;
  if (options == null) {
    options = {};
  }
  Emblem.handlebarsVariant = handlebarsVariant;
  ast = Emblem.parse(string);
  return handlebarsVariant.compile(ast, options);
}

