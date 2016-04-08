var ModuleTranspiler = require('broccoli-es6modules');
var Funnel = require('broccoli-funnel');
var mergeTrees = require('broccoli-merge-trees');
var concat = require('broccoli-concat');
var replace = require('broccoli-replace');
var pegBuilder = require('broccoli-pegjs-import');
var es6to5 = require('broccoli-6to5-transpiler');
var broccoliStew = require('broccoli-stew');
var broccoliCoffee = require('broccoli-coffee');
var injectLivereload = require('broccoli-inject-livereload');
var package = require('./package.json');
var pegjsImport = require('pegjs-import');

var outputDir = '/';

// Turn ES6 to ES5, without module transpilation
function transpileES6(tree){
  return es6to5(tree, {
    blacklist: ['es6.modules', 'useStrict']
  });
}

function buildSrcTree(){
  var lib = new Funnel('lib', {
    exclude: ['**/*.rb', '**/*.pegjs'],
    destDir: outputDir + 'emblem'
  });
  lib = replaceVersion(lib, ['emblem/main.js'] );

  lib = broccoliStew.mv(lib, 'emblem/main.js', 'emblem.js');
  lib = transpileES6(lib);
  return lib;
}

function replaceVersion(tree, files){
  return replace(tree, {
    files: files,
    patterns: [ {
      match: /VERSION_STRING_PLACEHOLDER/,
      replacement: package.version,
    } ]
  });
}

function buildPegTree(){
  var pegFunnel = new Funnel('lib', {
    include: ['**/*.pegjs'],
    destDir: outputDir + 'emblem'
  });

  var pegTree = pegBuilder(pegFunnel, {
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

function buildDistTree(srcTree){
  var amdTree = new ModuleTranspiler(srcTree, {format: 'amd'});
  var cjsTree = new ModuleTranspiler(srcTree, {format: 'cjs'});

  cjsTree = broccoliStew.mv(cjsTree, outputDir + '/cjs');

  amdTree = concat(amdTree, {
    inputFiles: ['**/*.js'],
    outputFile: outputDir + 'emblem.amd.js',
    wrapInFunction: false
  });

  return mergeTrees([amdTree, cjsTree]);
}

function buildSrcDepsTree(){
  var stringScannerTree = new Funnel('node_modules/StringScanner/lib', {
    include: ['StringScanner.js']
  });

  var header = 'var module = {};\n';
  var footer = 'export default module.exports;';

  return concat(stringScannerTree, {
    inputFiles: ['StringScanner.js'],
    outputFile: outputDir + 'string-scanner.js',
    header: header,
    footer: footer,
    wrapInFunction: false
  });
}

function buildTestTree(){
  // all test code files
  var testTree = new Funnel('tests', {
    include: ['**/*.js', '**/*.coffee']
  });

  // all test asset files
  var testAssetsTree = new Funnel('tests', {
    exclude: ['**/*.js', '**/*.coffee']
  });

  testAssetsTree = mergeTrees([testAssetsTree, buildTestSupportTree()]);

  // rewrite .coffee files to .js files
  testTree = broccoliCoffee(testTree, {bare:true});

  // turn es6 to es5, without modules
  testTree = transpileES6(testTree);

  // transpile modules to amd
  var amdTestTree = new ModuleTranspiler(testTree, { format: 'amd' });

  // combine AMD files
  amdTestTree = concat(amdTestTree, {
    inputFiles: ['**/*.js'],
    outputFile: outputDir + 'emblem-tests.amd.js',
    wrapInFunction: false
  });

  var cjsTestTree = new ModuleTranspiler(testTree, { format: 'cjs' });

  cjsTestTree = broccoliStew.mv(cjsTestTree, outputDir + 'cjs/tests');

  testTree = mergeTrees([amdTestTree, testAssetsTree]);
  // put tests in 'tests/'
  testTree = broccoliStew.mv(testTree, outputDir + 'tests');

  return mergeTrees([ cjsTestTree, testTree ]);
}

function buildTestSupportTree(){
  var qUnitTree = new Funnel('bower_components/qunit', {
    srcDir: 'qunit',
    destDir: 'qunit'
  });

  var loaderTree = new Funnel('bower_components', {
    srcDir: 'loader.js',
    destDir: 'loader.js',
    include: ['loader.js']
  });

  var handlebarsTree = new Funnel('node_modules/handlebars/dist', {
    include: ['handlebars.js'],
    destDir: 'handlebars'
  });

  var jQueryTree = new Funnel('bower_components/jquery/dist', {
    include: ['jquery.js'],
    destDir: 'jquery'
  });

  var emberTree = new Funnel('bower_components/ember', {
    include: ['ember.js'],
    destDir: 'ember'
  });

  return mergeTrees([
    qUnitTree, loaderTree, handlebarsTree, jQueryTree, emberTree]);
}

var srcTree  = mergeTrees(
  [buildSrcTree(), buildPegTree(), buildSrcDepsTree()]
);
var distTree = buildDistTree(srcTree);
var testTree = buildTestTree();
testTree = injectLivereload(testTree);

module.exports = mergeTrees( [distTree, testTree] );
