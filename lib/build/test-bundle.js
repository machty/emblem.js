/**
 * The challenge with this bundle:
 * - For the main bundle, we just require everything in lib/ and build
 * - Several points in the test bundle assume they have access to the pre-built Emblem
 *   - unit tests
 *   - integration tests that require('emblem')
 *   - which also has issues since that is assuming an ES6 import (`default`), and the built is AMD...
 *
 * At the same time, we really need to test the actual build!
 * It's almost like you could run none of this through a processor....
 *
 * To test the final build will require ditching the unit tests.  It'll also require adding a shim library for the final build.
 *
 */

const BroccoliInjectLivereload = require('broccoli-inject-livereload')
const Rollup = require('broccoli-rollup');
const multiEntry = require('rollup-plugin-multi-entry');
const Funnel = require('broccoli-funnel');
const mergeTrees = require('broccoli-merge-trees');
const broccoliStew = require('broccoli-stew');
const concat = require('broccoli-concat');
const babel = require('rollup-plugin-babel');
const sourceBundle = require('./source-bundle');

const outputDir = '/';

function buildTestTree(){
  const supportFiles = new Funnel('tests', {
    include: ['**/*.js']
  });
  const testTree = new Rollup(supportFiles, {
    rollup: {
      input: ['**/*-test.js'],
      output: {
        file: 'tests.js',
        sourceMap: false,
        format: 'iife'
      },
      plugins: [
        babel({}),
        multiEntry()
      ],
      external: ['emblem']
    }
  });

  const nonJsTree = new Funnel('tests', {
    exclude: ['**/*.js']
  });
  const testAssetsTree = mergeTrees([nonJsTree, buildTestSupportTree()]);

  const fullTestBundle = mergeTrees([
    testTree,
    testAssetsTree
  ]);

  return broccoliStew.mv(fullTestBundle, outputDir + 'tests');

  // // Or should this be before assets?
  // return new Rollup(namespacedTestTree, {
  //   rollup: {
  //     input: 'emblem.js',
  //     output: [
  //       {
  //         file: 'cjs/tests.js',
  //         sourceMap: false,
  //         format: 'cjs'
  //       },
  //       {
  //         file: 'emblem-tests.amd.js',
  //         sourceMap: false,
  //         format: 'amd'
  //       }
  //     ],
  //     plugins: [
  //       babel(babelDefaultOptions)
  //     ]
  //   }
  // });


  // rewrite .coffee files to .js files
  // testTree = broccoliCoffee(testTree, {bare:true});

  // // transpile modules to amd
  // const amdTestTree = new ModuleTranspiler(testTree, { format: 'amd' });

  // // combine AMD files
  // amdTestTree = concat(amdTestTree, {
  //   inputFiles: ['**/*.js'],
  //   outputFile: outputDir + 'emblem-tests.amd.js',
  //   wrapInFunction: false
  // });

  // const cjsTestTree = new ModuleTranspiler(testTree, { format: 'cjs' });

  // cjsTestTree = broccoliStew.mv(cjsTestTree, outputDir + 'cjs/tests');

  // testTree = mergeTrees([amdTestTree, testAssetsTree]);
  // // put tests in 'tests/'
  // testTree = broccoliStew.mv(testTree, outputDir + 'tests');

  // return mergeTrees([ cjsTestTree, testTree ]);
}

function buildTestSupportTree(){
  const qUnitTree = new Funnel('bower_components/qunit', {
    srcDir: 'qunit',
    destDir: 'qunit'
  });

  const loaderTree = new Funnel('bower_components', {
    srcDir: 'loader.js',
    destDir: 'loader.js',
    include: ['loader.js']
  });

  const handlebarsTree = new Funnel('node_modules/handlebars/dist', {
    include: ['handlebars.js'],
    destDir: 'handlebars'
  });

  const jQueryTree = new Funnel('bower_components/jquery/dist', {
    include: ['jquery.js'],
    destDir: 'jquery'
  });

  // const emberTree = new Funnel('bower_components/ember', {
  //   include: ['ember.js'],
  //   destDir: 'ember'
  // });

  return mergeTrees([
    qUnitTree,
    loaderTree,
    handlebarsTree,
    jQueryTree,
    // emberTree
  ]);
}

const testTree = buildTestTree();
const reloadable = new BroccoliInjectLivereload(testTree, {
  target: 'index.html'
})

module.exports = reloadable
