import Parser from './emblem/parser';
import { compile } from './emblem/compiler';
//  registerPartial, parse,

//global.Emblem = Emblem;
//require('./parser');
//require('./compiler');
//require('./preprocessor');
//require('./emberties');

import './emblem/bootstrap';

export default {
  Parser: Parser,
  // registerPartial: registerPartial,
  // parse: parse,
  compile: compile,
  VERSION: "VERSION_STRING_PLACEHOLDER"
};
