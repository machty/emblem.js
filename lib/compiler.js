import { Parser as parser, ParserSyntaxError } from './parser';
import { processSync } from './preprocessor';
import { compile as compileTemplate } from './template-compiler';
import { generateBuilder } from './ast-builder';
import ASTY from '../asty';
import PEGUtil from '../pegjs-util';

/**
  options can include:
    quite: disable deprecation notices
    debugging: show output handlebars in console
*/

export function compile(emblem, customOptions) {
  const builder = generateBuilder();
  const options = customOptions || {};
  const processedEmblem = processSync(emblem);
  const asty = new ASTY();

  options['builder'] = builder;
  options['makeAST'] = function (line, column, offset, args) {
    return asty.create.apply(asty, args).pos(line, column, offset)
  };

  const traceResult = PEGUtil.parse(parser, processedEmblem, options);
  if (traceResult.error !== null && options.debugging) {
    console.log("ERROR: Parsing Failure:\n" +
      PEGUtil.errorMessage(traceResult.error, true).replace(/^/mg, "ERROR: ")
    );
    throw new Error(traceResult.error.message);
  }

  const ast = builder.toAST();
  const result = compileTemplate(ast, options);

  return result;
}
