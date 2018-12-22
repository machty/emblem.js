import { parse as pegParse, ParserSyntaxError } from './parser';
import { processSync } from './preprocessor';
import { compile as compileTemplate } from './template-compiler';
import { generateBuilder } from './ast-builder';

/**
  options can include:
    quite: disable deprecation notices
    debugging: show output handlebars in console
*/

export function compile(emblem, customOptions) {
  var builder = generateBuilder();
  var options = customOptions || {};
  var processedEmblem = processSync(emblem);

  options['builder'] = builder;
  pegParse(processedEmblem, options);

  var ast = builder.toAST();
  var result = compileTemplate(ast, options);

  if (options.debugging) {
    console.log(result);
  }

  return result;
}
