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
const babel = require('rollup-plugin-babel');

const outputDir = '/';

function buildTestTree(){
  const supportFiles = new Funnel('tests', {
    include: ['**/*.js'],
    exclude: ['unit/*']
  });
  const integrationTestTree = new Rollup(supportFiles, {
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

  const fullTestBundle = mergeTrees([
    integrationTestTree,
    nonJsTree,
    buildTestSupportTree()
  ]);

  return broccoliStew.mv(fullTestBundle, outputDir + 'tests');
}

function buildTestSupportTree(){
  const qUnitTree = new Funnel('node_modules/qunit', {
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

  return mergeTrees([
    qUnitTree,
    loaderTree,
    handlebarsTree,
    jQueryTree
  ]);
}

const testTree = buildTestTree();
const reloadable = new BroccoliInjectLivereload(testTree, {
  target: 'index.html'
})

module.exports = reloadable
