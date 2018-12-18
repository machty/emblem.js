const Funnel = require('broccoli-funnel');
const mergeTrees = require('broccoli-merge-trees');
const broccoliStew = require('broccoli-stew');
const babel = require('broccoli-babel-transpiler');
const concat = require('broccoli-concat');
const emblemTree = require('./emblem-tree');

const outputDir = '/';
const currentDir = process.cwd();

/**
 * This is a copy of all of the emblem files, but not rolled up into a single file.
 * This allows for unit tests to run against pieces of the final app.
 */
function buildEmblemFiles() {
  const appFiles = new Funnel(emblemTree, {
    include: ['**/*.js']
  });

  const transpiledAppFiles = babel(appFiles, {
    plugins: ['@babel/plugin-transform-modules-amd'],

    moduleIds: true,

    // Transforms /index.js files to use their containing directory name
    getModuleId: name => {
      const shortenedName = name.replace(currentDir + '/', '');

      return shortenedName;
    }
  });

  const testAppBundle = concat(transpiledAppFiles, {
    inputFiles: '**/*.js',
    outputFile: outputDir + 'emblem.js',
    sourceMapConfig: { enabled: false },
  });

  return broccoliStew.mv(testAppBundle, outputDir + 'test-app');
}

/**
 *  Generate a tree of all test files
 *
 *  This also builds a single file for all tests that will evaluate those tests and initiate Testem
 */

function buildTestTree() {
  const testFiles = new Funnel('tests', {
    include: ['**/*.js']
  });
  const transpiledTestFiles = babel(testFiles, {
    plugins: ['@babel/plugin-transform-modules-amd'],

    moduleIds: true,

    // Transforms /index.js files to use their containing directory name
    getModuleId: name => {
      const shortenedName = name.replace(currentDir, 'tests');

      return shortenedName;
    }
  });

  const testBundle = concat(transpiledTestFiles, {
    inputFiles: '**/*.js',
    outputFile: outputDir + 'tests.js',
    sourceMapConfig: { enabled: false },
    footer: `
      const testKeys = Object.keys(requirejs._eak_seen).filter(a => a.endsWith('-test'));

      testKeys.forEach(key => require(key));

      if (window.Testem) {
        window.Testem.hookIntoTestFramework();
      }
    `
  });

  const nonJsTree = new Funnel('tests', {
    exclude: ['**/*.js']
  });

  return mergeTrees([
    testBundle,
    nonJsTree,
  ]);
}

/**
 *  Generate a tree for all test support imports
 */
function buildTestSupportTree(){
  const qUnitTree = new Funnel('node_modules/qunit', {
    srcDir: 'qunit',
    destDir: 'qunit'
  });

  const loaderTree = new Funnel('node_modules/loader.js/dist', {
    srcDir: 'loader',
    destDir: 'loader.js',
  });

  const handlebarsTree = new Funnel('node_modules/handlebars/dist', {
    include: ['handlebars.js'],
    destDir: 'handlebars'
  });

  const jQueryTree = new Funnel('node_modules/jquery/dist', {
    include: ['jquery.js'],
    destDir: 'jquery'
  });

  return mergeTrees([
    qUnitTree,
    loaderTree,
    handlebarsTree,
    jQueryTree
  ]);
}

const fullTestBundle = mergeTrees([
  buildTestTree(),
  buildEmblemFiles(),
  buildTestSupportTree()
]);

module.exports = broccoliStew.mv(fullTestBundle, outputDir + 'tests');
