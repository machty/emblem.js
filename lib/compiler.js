import { parse as pegParse, ParserSyntaxError } from './parser';
import EmberDelegate from './parser-delegate/ember';
import { processSync } from './preprocessor';
import { compile as compileTemplate } from './template-compiler';
import { generateBuilder } from './ast-builder';

const defaultOptions = {
  quiet: false,
  debugging: false
};

const { assign } = Object;

export function compile(emblem, customOptions) {
  var builder = generateBuilder();
  var options = assign({}, defaultOptions, customOptions);
  var pegOptions = assign(options, { builder: builder })

  var processedEmblem = processSync(emblem);

  pegParse(processedEmblem, pegOptions);

  var ast = builder.toAST();
  var result = compileTemplate(ast);

  if (options.debugging) {
    console.log(result);
  }

  return result;
}
