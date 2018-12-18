const sourceTrees = require('./lib/build/source-tree');
const testBundle = require('./lib/build/test-bundle');
const Rollup = require('broccoli-rollup');
const babel = require('rollup-plugin-babel');
const mergeTrees = require('broccoli-merge-trees');

const minify = process.env.NODE_ENV === 'production';
const includeTests = process.env.NODE_ENV === 'test';
const babelDefaultOptions = {
  plugins: [],
  presets: []
};

if (minify) {
  babelOptions.presets.push('minify');
}

function buildMainBundle() {
  return new Rollup(sourceTrees, {
    rollup: {
      input: 'emblem.js',
      output: [
        {
          file: 'cjs/emblem.js',
          sourceMap: false,
          name: 'emblem',
          format: 'cjs'
        },
        {
          file: 'emblem.amd.js',
          sourceMap: false,
          format: 'amd',
          amd: {
            id: 'emblem'
          }
        }
      ],
      plugins: [
        babel(babelDefaultOptions)
      ]
    }
  });
}

const trees = [buildMainBundle()];

if (includeTests) {
  trees.push(testBundle);
}

module.exports = mergeTrees(trees);
