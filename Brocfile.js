var compileModules = require('broccoli-compile-modules');
var jsHint = require('broccoli-jshint');
var Funnel = require('broccoli-funnel');
var mergeTrees = require('broccoli-merge-trees');
var concat = require('broccoli-concat');
var replace = require('broccoli-replace');
var peg = require('broccoli-pegjs');
var esnext = require('broccoli-esnext');

/**
 * Builds the consumable lib
 * @param  {Tree} libTree
 * @return {Array}
 */
function buildDistLib (libTree) {
  return compileModules( libTree, {
    inputFiles: ['emblem.umd.js'],
    output: '/emblem.js'
  });
}

/**
 * Builds the test suite including jsHint
 * and Qunit harness.
 * @param  {Tree} libTree
 * @return {Tree}
 */
function buildTestSuite (libTree) {
  var destination = '/tests';

  var jsHintLib = jsHint(libTree);

  var testTree = new Funnel( 'tests', {
    files: ['emblem-test.js'],
    destDir: destination
  });

  var jsHintTests = jsHint(testTree);

  var allTestFiles = mergeTrees([libTree, testTree]);

  var testBundle = compileModules(allTestFiles, {
    inputFiles: ['emblem.js', 'tests/*.js'],
    formatter: 'bundle',
    output: '/tests/emblem-test-bundle.js'
  });

  var tests = mergeTrees([jsHintLib, jsHintTests, testBundle]);

  tests = concat(tests, {
    inputFiles: ['**/*.js'],
    outputFile: '/tests/emblem-test-bundle.js'
  });

  var testHarness = new Funnel('tests', {
    files: ['index.html'],
    destDir: destination
  });

  var qunit = new Funnel('bower_components/qunit/qunit', {
    files: ['qunit.js', 'qunit.css'],
    destDir: destination
  });

  return mergeTrees([tests, testHarness, qunit]);
}

var lib = new Funnel( 'lib', {
  destDir: '/'
});

lib = esnext(lib);

lib = peg(lib, {
  wrapper: function (src, parser) {
    return '/*jshint newcap: false, laxbreak: true */\nvar Parser = ' + parser + ";\nvar parse = Parser.parse, ParserSyntaxError = Parser.SyntaxError;\nexport {ParserSyntaxError, parse};\nexport default parse;";
  }
});

var exportTree = require('broccoli-export-tree');
var extree = exportTree(lib, {
  destDir: 'dist2'
});

var version = require('./package.json').version;

lib = replace(lib, {
  files: [ '**/*.js' ],
  patterns: [
    { match: /VERSION_STRING_PLACEHOLDER/g, replacement: version }
  ]
});

var testSuite = buildTestSuite(lib);
var distLibs = buildDistLib(lib);

module.exports = mergeTrees([distLibs, testSuite, extree]);

