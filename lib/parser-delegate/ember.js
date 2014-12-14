import ParserDelegate from './base';

class EmberParserDelegate extends ParserDelegate {
  constructor(AST, parse) {
    this.AST = AST;
    this.recursiveParse = parse;
  }

  handleCapitalizedMustache(mustache) {
    return this.unshiftParam(mustache, 'view');
  }

  handleUnboundSuffix(mustacheNode, id) {
    if (id._emblemSuffixModifier === '!') {
      return this.unshiftParam(mustacheNode, 'unbound');
    } else {
      return mustacheNode;
    }
  }
}

export default EmberParserDelegate;

