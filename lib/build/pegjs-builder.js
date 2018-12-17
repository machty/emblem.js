// I think this is identical to what is in NPM, except we've updated broccoli-filter

var Filter = require('broccoli-filter');
var fs = require('fs');
var Promise = require('rsvp').Promise;

module.exports = PegFilter;

PegFilter.prototype = Object.create(Filter.prototype);
PegFilter.prototype.constructor = PegFilter;

function PegFilter(inputTree, options) {
  if (!(this instanceof PegFilter)) return new PegFilter(inputTree, options);
  Filter.call(this, inputTree, options);
  options = options || {};
  if (!options.output) {
    options.output = "source";
  }
  if (!options.wrapper) {
    options.wrapper = function (src, parser) {
      if (typeof options.exportVar === 'function') {
        return options.exportVar(src) + ' = ' + parser + ';';
      } else {
        return (typeof options.exportVar === 'string' ? options.exportVar : 'module.exports') + ' = ' + parser + ';';
      }
    };
  }
  this.peg = options.peg || require('pegjs-import');
  delete options.peg;
  this.options = options;
}

PegFilter.prototype.extensions = ['pegjs'];
PegFilter.prototype.targetExtension = 'js';

PegFilter.prototype.processFile = function (srcDir, destDir, relativePath) {
  var self = this;
  var inputEncoding = (this.inputEncoding === undefined) ? 'utf8' : this.inputEncoding;
  var outputEncoding = (this.outputEncoding === undefined) ? 'utf8' : this.outputEncoding;
  var parser = this.peg.buildParser(srcDir + '/' + relativePath, this.options);
  var src = fs.readFileSync(srcDir + '/' + relativePath, { encoding: inputEncoding });
  var output = this.options.wrapper(src, parser);

  return Promise.resolve(output)
    .then(function (outputString) {
      var outputPath = self.getDestFilePath(relativePath);
      fs.writeFileSync(destDir + '/' + outputPath, outputString, { encoding: outputEncoding });
    });
}
