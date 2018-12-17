const package = require('../../package.json');
const Funnel = require('broccoli-funnel');
const replace = require('broccoli-replace');
const broccoliStew = require('broccoli-stew');
const pegBuilder = require('./pegjs-builder');
const pegjsImport = require('@invisible/pegjs-import');
const mergeTrees = require('broccoli-merge-trees');
const concat = require('broccoli-concat');

const outputDir = '/';

function replaceVersion(tree, files) {
  return replace(tree, {
    files: files,
    patterns: [{
      match: /VERSION_STRING_PLACEHOLDER/,
      replacement: package.version,
    }]
  });
}

// Step 1
// - Create funnel for all JS files
// - Replace VERSION_STRING_PLACEHOLDER in main.js
// - Transpile all JS to ES6
function buildSrcTree(){
  let lib = new Funnel('lib', {
    exclude: ['**/*.rb', '**/*.pegjs'],
    destDir: outputDir + 'emblem'
  });
  lib = replaceVersion(lib, ['emblem/main.js'] );
  lib = broccoliStew.mv(lib, 'emblem/main.js', 'emblem.js');

  return lib;
}

// Step 2
// - Build funnel for pegjs files
// - Import these into the broccoli-pegjs-import
//   * Which wraps the output in sharead imports / exports
function buildPegTree(){
  const pegFunnel = new Funnel('lib', {
    include: ['**/*.pegjs'],
    destDir: outputDir + 'emblem'
  });
  const pegTree = pegBuilder(pegFunnel, {
    peg: pegjsImport,
    wrapper: function (src, parser) {
      return ['/*jshint newcap: false, laxbreak: true */',
              "import { generateBuilder } from './ast-builder';",
              "import { INDENT_SYMBOL, DEDENT_SYMBOL, UNMATCHED_DEDENT_SYMBOL, TERM_SYMBOL } from './preprocessor';",
              "import { HTML_EVENTS, ALIAS_EVENTS } from './html/events';",
              "import KNOWN_TAGS from './html/tags';",
              'var Parser = ' + parser + ';',
              'var parse = Parser.parse, ParserSyntaxError = Parser.SyntaxError;',
              'export {ParserSyntaxError, parse};',
              'export default parse;'].join('\n');
    }
  });

  return pegTree;
}

function buildStringScanerTree() {
  const stringScannerTree = new Funnel('node_modules/StringScanner/lib', {
    include: ['StringScanner.js']
  });
  const header = 'var module = {};\n(function() {';
  const footer = '})(); export default module.exports;';

  return concat(stringScannerTree, {
    inputFiles: ['StringScanner.js'],
    outputFile: outputDir + 'string-scanner.js',
    header: header,
    footer: footer,
    wrapInFunction: false
  });
  // return concat(stringScannerTree, {
  //   inputFiles: ['StringScanner.js'],
  //   outputFile: outputDir + 'string-scanner.js',
  //   header: header,
  //   footer: footer,
  //   wrapInFunction: false
  // });
}

module.exports = mergeTrees([
  buildSrcTree(),
  buildPegTree(),
  buildStringScanerTree()
]);
