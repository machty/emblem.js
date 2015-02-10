import Parser from './emblem/parser';
import { registerPartial, parse } from './emblem/compiler';

//global.Emblem = Emblem;
//require('./parser');
//require('./compiler');
//require('./preprocessor');
//require('./emberties');

import './emblem/bootstrap';

export default {
  Parser: Parser,
  registerPartial: registerPartial,
  parse: parse,
  VERSION: "VERSION_STRING_PLACEHOLDER"
};

