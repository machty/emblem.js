var ModuleTranspiler = require('broccoli-es6modules');
var Funnel = require('broccoli-funnel');
var mergeTrees = require('broccoli-merge-trees');
var concat = require('broccoli-concat');
var replace = require('broccoli-replace');
var peg = require('broccoli-pegjs');
var es6to5 = require('broccoli-6to5-transpiler');
var broccoliStew = require('broccoli-stew');
var broccoliCoffee = require('broccoli-coffee');

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

  lib = broccoliStew.mv(lib, 'emblem/main.js', 'emblem.js');
  lib = broccoliStew.log(lib);
  lib = transpileES6(lib);
  return lib;
}

function buildPegTree(){
  var pegTree = new Funnel('lib', {
    include: ['*.pegjs']
  });

  pegTree = peg(pegTree, {
    wrapper: function (src, parser) {
      return '/*jshint newcap: false, laxbreak: true */\nvar Parser = ' + parser + ";\nvar parse = Parser.parse, ParserSyntaxError = Parser.SyntaxError;\nexport {ParserSyntaxError, parse};\nexport default parse;";
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

function buildTestTree(){
  // all test code files
  var testTree = new Funnel('tests', {
    include: ['**/*.js', '**/*.coffee']
  });

  // all test asset files
  var testAssetsTree = new Funnel('tests', {
    exclude: ['**/*.js', '**/*.coffee']
  });

  // rewrite .coffee files to .js files
  testTree = broccoliCoffee(testTree, {bare:true});

  // turn es6 to es5, without modules
  testTree = transpileES6(testTree);

  // transpile modules to amd
  testTree = new ModuleTranspiler(testTree, { format: 'amd' });

  // combine AMD files
  testTree = concat(testTree, {
    inputFiles: ['**/*.js'],
    outputFile: outputDir + 'emblem-tests.amd.js',
    wrapInFunction: false
  });

  testTree = mergeTrees([testTree, testAssetsTree]);

  // put tests in 'tests/'
  return broccoliStew.mv(testTree, outputDir + 'tests');
}

var srcTree  = mergeTrees( [buildSrcTree(), buildPegTree()] );
var distTree = buildDistTree(srcTree);
var testTree = buildTestTree();

module.exports = mergeTrees( [distTree, testTree] );
