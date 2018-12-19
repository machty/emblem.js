/* eslint-env node */

const MainBundle = require('./lib/build/main-bundle');

module.exports = function () {
  /**
   *  We use Broccoli to manually build our app and its test suite.
   *
   *  Wrapping this with Ember allows for several benefits:
   *   - Automatic minification for production
   *   - Test harness, testem support, and auto-reloading
   */

  return MainBundle;
};
