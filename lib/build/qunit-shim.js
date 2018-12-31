/* globals QUnit */

define('qunit', ['exports'], function (_exports) {
  'use strict';

  Object.defineProperty(_exports, '__esModule', {
    value: true
  });

  _exports.default = QUnit;
  _exports.module = QUnit.module;
  _exports.test = QUnit.test;
  _exports.skip = QUnit.skip;
  _exports.only = QUnit.only;
  _exports.todo = QUnit.todo;
});
