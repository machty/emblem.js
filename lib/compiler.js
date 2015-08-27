import { parse as pegParse, ParserSyntaxError } from './parser';
import EmberDelegate from './parser-delegate/ember';
import { processSync } from './preprocessor';
import { compile as compileTemplate } from './template-compiler';
import { generateBuilder } from './ast-builder';

export function compile(emblem) {
  var builder = generateBuilder();
  var processedEmblem = processSync(emblem);
  pegParse( processedEmblem, {builder:builder});
  var ast = builder.toAST();
  var result = compileTemplate(ast);
  return result;
}
