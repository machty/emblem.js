var $__Object$defineProperties = Object.defineProperties;
var $__Object$getPrototypeOf = Object.getPrototypeOf;

var ParserDelegate = function() {
  "use strict";

  function ParserDelegate(AST, parse) {
    $__Object$getPrototypeOf(ParserDelegate.prototype).constructor.call(this, AST, parse);
  }

  $__Object$defineProperties(ParserDelegate.prototype, {
    capitalizedLineStarterMustache: {
      value: function(node) {
        if (node.mustache) {
          node.mustache = this.handleCapitalizedMustache(node.mustache);
          return node;
        } else {
          return this.handleCapitalizedMustache(node);
        }
      },

      enumerable: false,
      writable: true
    },

    handleCapitalizedMustache: {
      value: function(mustache) {
        return mustache;
      },

      enumerable: false,
      writable: true
    },

    rawMustacheAttribute: {
      value: function(key, id) {
        var mustacheNode = this.createMustacheNode([id], null, true);

        mustacheNode = this.handleUnboundSuffix(mustacheNode, id);

        return [
          new this.AST.ContentNode(key + '=' + '"'),
          mustacheNode,
          new this.AST.ContentNode('"'),
        ];
      },

      enumerable: false,
      writable: true
    },

    handleUnboundSuffix: {
      value: function(mustacheNode, id) {
        return mustacheNode;
      },

      enumerable: false,
      writable: true
    },

    unshiftParam: {
      value: function(mustacheNode, helperName, newHashPairs) {
        var hash = mustacheNode.hash;

        // Merge hash.
        if(newHashPairs) {
          hash = hash || new this.AST.HashNode([]);

          for(var i = 0; i < newHashPairs.length; ++i) {
            hash.pairs.push(newHashPairs[i]);
          }
        }

        var params = [mustacheNode.id].concat(mustacheNode.params);
        params.unshift(new this.AST.IdNode([{ part: helperName}]));
        return this.createMustacheNode(params, hash, mustacheNode.escaped);
      },

      enumerable: false,
      writable: true
    },

    createMustacheNode: {
      value: function(params, hash, escaped) {
        var open = escaped ? '{{' : '{{{';
        return new this.AST.MustacheNode(params, hash, open, { left: false, right: false });
      },

      enumerable: false,
      writable: true
    },

    createProgramNode: {
      value: function(statements, inverse) {
        return new this.AST.ProgramNode(statements, { left: false, right: false}, inverse, null);
      },

      enumerable: false,
      writable: true
    }
  });

  return ParserDelegate;
}();

export default ParserDelegate;

