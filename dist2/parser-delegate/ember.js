/* jshint proto: true */

var $__Object$defineProperties = Object.defineProperties;
var $__Object$defineProperty = Object.defineProperty;
var $__Object$create = Object.create;

import ParserDelegate from './base';

var EmberParserDelegate = function($__super) {
  "use strict";

  function EmberParserDelegate(AST, parse) {
    this.AST = AST;
    this.recursiveParse = parse;
  }

  EmberParserDelegate.__proto__ = ($__super !== null ? $__super : Function.prototype);
  EmberParserDelegate.prototype = $__Object$create(($__super !== null ? $__super.prototype : null));

  $__Object$defineProperty(EmberParserDelegate.prototype, "constructor", {
    value: EmberParserDelegate
  });

  $__Object$defineProperties(EmberParserDelegate.prototype, {
    handleCapitalizedMustache: {
      value: function(mustache) {
        return this.unshiftParam(mustache, 'view');
      },

      enumerable: false,
      writable: true
    },

    handleUnboundSuffix: {
      value: function(mustacheNode, id) {
        if (id._emblemSuffixModifier === '!') {
          return this.unshiftParam(mustacheNode, 'unbound');
        } else {
          return mustacheNode;
        }
      },

      enumerable: false,
      writable: true
    }
  });

  return EmberParserDelegate;
}(ParserDelegate);

export default EmberParserDelegate;

