var DEDENT, INDENT, TERM, UNMATCHED_DEDENT, anyWhitespaceAndNewlinesTouchingEOF, any_whitespaceFollowedByNewlines_, processInput, ws;

ws = '\\t\\x0B\\f \\xA0\\u1680\\u180E\\u2000-\\u200A\\u202F\\u205F\\u3000\\uFEFF';

INDENT = '\uEFEF';

DEDENT = '\uEFFE';

UNMATCHED_DEDENT = '\uEFEE';

TERM = '\uEFFF';

anyWhitespaceAndNewlinesTouchingEOF = new RegExp("[" + ws + "\\r?\\n]*$");

any_whitespaceFollowedByNewlines_ = new RegExp("(?:[" + ws + "]*\\r?\\n)+");

function Preprocessor() {
  this.base = null;
  this.indents = [];
  this.context = [];
  this.context.peek = function() {
    if (this.length) {
      return this[this.length - 1];
    } else {
      return null;
    }
  };
  this.context.err = function(c) {
    throw new Error("Unexpected " + c);
  };
  this.output = '';
  this.context.observe = function(c) {
    var top;
    top = this.peek();
    switch (c) {
      case INDENT:
        this.push(c);
        break;
      case DEDENT:
        if (top !== INDENT) {
          this.err(c);
        }
        this.pop();
        break;
      case '\r':
        if (top !== '/') {
          this.err(c);
        }
        this.pop();
        break;
      case '\n':
        if (top !== '/') {
          this.err(c);
        }
        this.pop();
        break;
      case '/':
        this.push(c);
        break;
      case 'end-\\':
        if (top !== '\\') {
          this.err(c);
        }
        this.pop();
        break;
      default:
        throw new Error("undefined token observed: " + c);
    }
    return this;
  };
}

Preprocessor.prototype.p = function(s) {
  if (s) {
    this.output += s;
  }
  return s;
};

Preprocessor.prototype.scan = function(r) {
  return this.p(this.ss.scan(r));
};

Preprocessor.prototype.discard = function(r) {
  return this.ss.scan(r);
};

processInput = function(isEnd) {
  return function(data) {
    var b, d, indent, s;
    if (!isEnd) {
      this.ss.concat(data);
      this.discard(any_whitespaceFollowedByNewlines_);
    }
    while (!this.ss.eos()) {
      switch (this.context.peek()) {
        case null:
        case INDENT:
          if (this.ss.bol() || this.discard(any_whitespaceFollowedByNewlines_)) {
            if (this.discard(new RegExp("[" + ws + "]*\\r?\\n"))) {
              this.p("" + TERM + "\n");
              continue;
            }
            if (this.base != null) {
              if ((this.discard(this.base)) == null) {
                throw new Error("inconsistent base indentation");
              }
            } else {
              b = this.discard(new RegExp("[" + ws + "]*"));
              this.base = new RegExp("" + b);
            }
            if (this.indents.length === 0) {
              if (this.ss.check(new RegExp("[" + ws + "]+"))) {
                this.p(INDENT);
                this.context.observe(INDENT);
                this.indents.push(this.scan(new RegExp("([" + ws + "]+)")));
              }
            } else {
              indent = this.indents[this.indents.length - 1];
              if (d = this.ss.check(new RegExp("(" + indent + ")"))) {
                this.discard(d);
                if (this.ss.check(new RegExp("([" + ws + "]+)"))) {
                  this.p(INDENT);
                  this.context.observe(INDENT);
                  this.indents.push(d + this.scan(new RegExp("([" + ws + "]+)")));
                }
              } else {
                while (this.indents.length) {
                  indent = this.indents[this.indents.length - 1];
                  if (this.discard(new RegExp("(?:" + indent + ")"))) {
                    break;
                  }
                  this.context.observe(DEDENT);
                  this.p(DEDENT);
                  this.indents.pop();
                }
                if (s = this.discard(new RegExp("[" + ws + "]+"))) {
                  this.output = this.output.slice(0, -1);
                  this.output += UNMATCHED_DEDENT;
                  this.p(INDENT);
                  this.context.observe(INDENT);
                  this.indents.push(s);
                }
              }
            }
          }
          this.scan(/[^\r\n]+/);
          if (this.discard(/\r?\n/)) {
            this.p("" + TERM + "\n");
          }
      }
    }
    if (isEnd) {
      this.scan(anyWhitespaceAndNewlinesTouchingEOF);
      while (this.context.length && INDENT === this.context.peek()) {
        this.context.observe(DEDENT);
        this.p(DEDENT);
      }
      if (this.context.length) {
        throw new Error('Unclosed ' + (this.context.peek()) + ' at EOF');
      }
    }
  };
};

Preprocessor.prototype.processData = processInput(false);

Preprocessor.prototype.processEnd = processInput(true);

export function processSync(input) {
  var pre;
  input += "\n";
  pre = new Preprocessor();
  pre.processData(input);
  pre.processEnd();
  return pre.output;
}

export default Preprocessor;
