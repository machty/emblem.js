import Parser from './emblem/parser';
import { compile } from './emblem/compiler';

import './emblem/bootstrap';

const VERSION = "VERSION_STRING_PLACEHOLDER";

// Real exports
export {
  Parser,
  compile,
  VERSION
};
// Legacy support
export default {
  Parser,
  compile,
  VERSION
}
