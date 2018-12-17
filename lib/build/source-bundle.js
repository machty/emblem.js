const sourceTrees = require('./source-tree');
const Rollup = require('broccoli-rollup');
const babel = require('rollup-plugin-babel');

const minify = process.env.NODE_ENV === 'production';
const babelDefaultOptions = {
  plugins: [],
  presets: [
  ]
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

module.exports = buildMainBundle();
