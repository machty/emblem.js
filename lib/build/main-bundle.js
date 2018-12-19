/* eslint-env node */

const emblemTree = require('./emblem-tree');
const testBundle = require('./test-bundle');
const Rollup = require('broccoli-rollup');
const babel = require('rollup-plugin-babel');
const mergeTrees = require('broccoli-merge-trees');
const EmberApp = require('ember-cli/lib/broccoli/ember-app');
const environment = EmberApp.env();

const production = environment === 'production';
const includeTests = !production

const babelOptions = {
  plugins: [],
  presets: []
};

if (production) {
  babelOptions.presets.push('minify');
}

/**
 * Use rollup + babel to combine everything into a single bundle, as well as build CJS / AMD versions
 */
const appBundle = new Rollup(emblemTree, {
  rollup: {
    input: 'emblem.js',
    output: [
      {
        file: 'cjs/emblem.js',
        sourceMap: false,
        exports: 'named',
        name: 'emblem',
        format: 'cjs'
      },
      {
        file: 'emblem.amd.js',
        sourceMap: false,
        exports: 'named',
        format: 'amd',
        amd: {
          id: 'emblem'
        }
      }
    ],
    plugins: [
      babel(babelOptions)
    ]
  }
});

// If we are building test assets, then we need to include the non-rolled up code as well so that unit tests work
if (includeTests) {
  module.exports = mergeTrees([
    appBundle,
    testBundle
  ]);
} else {
  module.exports = appBundle;
}
