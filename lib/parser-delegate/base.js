export default class ParserDelegate {
  capitalizedLineStarterMustache(node) {
    if (node.mustache) {
      node.mustache = this.handleCapitalizedMustache(node.mustache);
      return node;
    } else {
      return this.handleCapitalizedMustache(node);
    }
  }

  handleCapitalizedMustache(mustache) {
    return mustache;
  }

  rawMustacheAttribute(key, id) {
    var mustacheNode = this.createMustacheNode([id], null, true);

    mustacheNode = this.handleUnboundSuffix(mustacheNode, id);

    return [
      new this.AST.ContentNode(key + '=' + '"'),
      mustacheNode,
      new this.AST.ContentNode('"'),
    ];
  }

  handleUnboundSuffix(mustacheNode, id) {
    return mustacheNode;
  }

  // Returns a new MustacheNode with a new preceding param (id).
  unshiftParam(mustacheNode, helperName, newHashPairs) {
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
  }

  createMustacheNode(params, hash, escaped) {
    var open = escaped ? '{{' : '{{{';
    return new this.AST.MustacheNode(params, hash, open, { left: false, right: false });
  }

  createProgramNode(statements, inverse) {
    return new this.AST.ProgramNode(statements, { left: false, right: false}, inverse, null);
  }
}
