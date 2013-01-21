
this.StringScanner = (function() {
  var StringScanner;
  StringScanner = (function() {
    function StringScanner(str) {
      this.str = str != null ? str : '';
      this.str = '' + this.str;
      this.pos = 0;
      this.lastMatch = {
        reset: function() {
          this.str = null;
          this.captures = [];
          return this;
        }
      }.reset();
      this;
    }
    StringScanner.prototype.bol = function() {
      return this.pos <= 0 || (this.str[this.pos - 1] === "\n");
    };
    StringScanner.prototype.captures = function() {
      return this.lastMatch.captures;
    };
    StringScanner.prototype.check = function(pattern) {
      var matches;
      if (this.str.substr(this.pos).search(pattern) !== 0) {
        this.lastMatch.reset();
        return null;
      }
      matches = this.str.substr(this.pos).match(pattern);
      this.lastMatch.str = matches[0];
      this.lastMatch.captures = matches.slice(1);
      return this.lastMatch.str;
    };
    StringScanner.prototype.checkUntil = function(pattern) {
      var matches, patternPos;
      patternPos = this.str.substr(this.pos).search(pattern);
      if (patternPos < 0) {
        this.lastMatch.reset();
        return null;
      }
      matches = this.str.substr(this.pos + patternPos).match(pattern);
      this.lastMatch.captures = matches.slice(1);
      return this.lastMatch.str = this.str.substr(this.pos, patternPos) + matches[0];
    };
    StringScanner.prototype.clone = function() {
      var clone, prop, value, _ref;
      clone = new this.constructor(this.str);
      clone.pos = this.pos;
      clone.lastMatch = {};
      _ref = this.lastMatch;
      for (prop in _ref) {
        value = _ref[prop];
        clone.lastMatch[prop] = value;
      }
      return clone;
    };
    StringScanner.prototype.concat = function(str) {
      this.str += str;
      return this;
    };
    StringScanner.prototype.eos = function() {
      return this.pos === this.str.length;
    };
    StringScanner.prototype.exists = function(pattern) {
      var matches, patternPos;
      patternPos = this.str.substr(this.pos).search(pattern);
      if (patternPos < 0) {
        this.lastMatch.reset();
        return null;
      }
      matches = this.str.substr(this.pos + patternPos).match(pattern);
      this.lastMatch.str = matches[0];
      this.lastMatch.captures = matches.slice(1);
      return patternPos;
    };
    StringScanner.prototype.getch = function() {
      return this.scan(/./);
    };
    StringScanner.prototype.match = function() {
      return this.lastMatch.str;
    };
    StringScanner.prototype.matches = function(pattern) {
      this.check(pattern);
      return this.matchSize();
    };
    StringScanner.prototype.matched = function() {
      return this.lastMatch.str != null;
    };
    StringScanner.prototype.matchSize = function() {
      if (this.matched()) {
        return this.match().length;
      } else {
        return null;
      }
    };
    StringScanner.prototype.peek = function(len) {
      return this.str.substr(this.pos, len);
    };
    StringScanner.prototype.pointer = function() {
      return this.pos;
    };
    StringScanner.prototype.setPointer = function(pos) {
      pos = +pos;
      if (pos < 0) {
        pos = 0;
      }
      if (pos > this.str.length) {
        pos = this.str.length;
      }
      return this.pos = pos;
    };
    StringScanner.prototype.reset = function() {
      this.lastMatch.reset();
      this.pos = 0;
      return this;
    };
    StringScanner.prototype.rest = function() {
      return this.str.substr(this.pos);
    };
    StringScanner.prototype.scan = function(pattern) {
      var chk;
      chk = this.check(pattern);
      if (chk != null) {
        this.pos += chk.length;
      }
      return chk;
    };
    StringScanner.prototype.scanUntil = function(pattern) {
      var chk;
      chk = this.checkUntil(pattern);
      if (chk != null) {
        this.pos += chk.length;
      }
      return chk;
    };
    StringScanner.prototype.skip = function(pattern) {
      this.scan(pattern);
      return this.matchSize();
    };
    StringScanner.prototype.skipUntil = function(pattern) {
      this.scanUntil(pattern);
      return this.matchSize();
    };
    StringScanner.prototype.string = function() {
      return this.str;
    };
    StringScanner.prototype.terminate = function() {
      this.pos = this.str.length;
      this.lastMatch.reset();
      return this;
    };
    StringScanner.prototype.toString = function() {
      return "#<StringScanner " + (this.eos() ? 'fin' : "" + this.pos + "/" + this.str.length + " @ " + (this.str.length > 8 ? "" + (this.str.substr(0, 5)) + "..." : this.str)) + ">";
    };
    return StringScanner;
  })();
  StringScanner.prototype.beginningOfLine = StringScanner.prototype.bol;
  StringScanner.prototype.clear = StringScanner.prototype.terminate;
  StringScanner.prototype.dup = StringScanner.prototype.clone;
  StringScanner.prototype.endOfString = StringScanner.prototype.eos;
  StringScanner.prototype.exist = StringScanner.prototype.exists;
  StringScanner.prototype.getChar = StringScanner.prototype.getch;
  StringScanner.prototype.position = StringScanner.prototype.pointer;
  StringScanner.StringScanner = StringScanner;
  //module.exports = StringScanner;
  return StringScanner;
}).call(this);



