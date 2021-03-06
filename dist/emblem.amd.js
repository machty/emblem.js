define('emblem', ['exports'], function (exports) { 'use strict';

  // http://www.w3.org/TR/html-markup/syntax.html#syntax-elements
  var voidElementTags = ['area', 'base', 'br', 'col', 'command', 'embed', 'hr', 'img', 'input', 'keygen', 'link', 'meta', 'param', 'source', 'track', 'wbr'];

  function isVoidElement(tagName) {
    return voidElementTags.indexOf(tagName) > -1;
  }

  function generateBuilder() {
    reset(builder);
    return builder;
  }

  function reset(builder) {
    var programNode = {
      type: 'program',
      childNodes: []
    };
    builder.currentNode = programNode;
    builder.previousNodes = [];
    builder._ast = programNode;
  }

  var builder = {
    toAST: function () {
      return this._ast;
    },
    generateText: function (content) {
      return {
        type: 'text',
        content: content
      };
    },
    text: function (content) {
      var node = this.generateText(content);
      this.currentNode.childNodes.push(node);
      return node;
    },
    generateInTagText: function (content) {
      return {
        type: 'inTagText',
        content: content
      };
    },
    inTagText: function (content) {
      var node = this.generateInTagText(content);
      this.currentNode.inTagText.push(node);
      return node;
    },
    generateElement: function (tagName) {
      return {
        type: 'element',
        tagName: tagName,
        isVoid: isVoidElement(tagName),
        inTagText: [],
        attrStaches: [],
        classNameBindings: [],
        childNodes: []
      };
    },
    element: function (tagName) {
      var node = this.generateElement(tagName);
      this.currentNode.childNodes.push(node);
      return node;
    },
    generateMustache: function (content, escaped) {
      return {
        type: 'mustache',
        escaped: escaped !== false,
        content: content
      };
    },
    generateAssignedMustache: function (content, key) {
      return {
        type: 'assignedMustache',
        content: content,
        key: key
      };
    },
    mustache: function (content, escaped) {
      var node = this.generateMustache(content, escaped);
      this.currentNode.childNodes.push(node);
      return node;
    },
    generateBlock: function (content) {
      return {
        type: 'block',
        content: content,
        childNodes: [],
        invertibleNodes: []
      };
    },
    block: function (content) {
      var node = this.generateBlock(content);
      this.currentNode.childNodes.push(node);
      return node;
    },
    attribute: function (attrName, attrContent) {
      var node = {
        type: 'attribute',
        name: attrName,
        content: attrContent
      };
      this.currentNode.attrStaches.push(node);
      return node;
    },
    generateClassNameBinding: function (classNameBinding) {
      return {
        type: 'classNameBinding',
        name: classNameBinding // could be "color", or could be "hasColor:red" or ":color"

      };
    },
    classNameBinding: function (classNameBinding) {
      var node = this.generateClassNameBinding(classNameBinding);
      this.currentNode.classNameBindings.push(node);
      return node;
    },
    enter: function (node) {
      this.previousNodes.push(this.currentNode);
      this.currentNode = node;
    },
    exit: function () {
      var lastNode = this.currentNode;
      this.currentNode = this.previousNodes.pop();
      return lastNode;
    },
    add: function (label, node) {
      if (Array.isArray(node)) {
        for (var i = 0, l = node.length; i < l; i++) {
          this.add(label, node[i]);
        }
      } else {
        this.currentNode[label].push(node);
      }
    }
  };

  var module$1 = {};

  (function () {
    (function () {
      var StringScanner;

      StringScanner = function () {
        function StringScanner(str) {
          this.str = str != null ? str : '';
          this.str = '' + this.str;
          this.pos = 0;
          this.lastMatch = {
            reset: function () {
              this.str = null;
              this.captures = [];
              return this;
            }
          }.reset();
        }

        StringScanner.prototype.bol = function () {
          return this.pos <= 0 || this.str[this.pos - 1] === "\n";
        };

        StringScanner.prototype.captures = function () {
          return this.lastMatch.captures;
        };

        StringScanner.prototype.check = function (pattern) {
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

        StringScanner.prototype.checkUntil = function (pattern) {
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

        StringScanner.prototype.clone = function () {
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

        StringScanner.prototype.concat = function (str) {
          this.str += str;
          return this;
        };

        StringScanner.prototype.eos = function () {
          return this.pos === this.str.length;
        };

        StringScanner.prototype.exists = function (pattern) {
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

        StringScanner.prototype.getch = function () {
          return this.scan(/./);
        };

        StringScanner.prototype.match = function () {
          return this.lastMatch.str;
        };

        StringScanner.prototype.matches = function (pattern) {
          this.check(pattern);
          return this.matchSize();
        };

        StringScanner.prototype.matched = function () {
          return this.lastMatch.str != null;
        };

        StringScanner.prototype.matchSize = function () {
          if (this.matched()) {
            return this.match().length;
          } else {
            return null;
          }
        };

        StringScanner.prototype.peek = function (len) {
          return this.str.substr(this.pos, len);
        };

        StringScanner.prototype.pointer = function () {
          return this.pos;
        };

        StringScanner.prototype.setPointer = function (pos) {
          pos = +pos;

          if (pos < 0) {
            pos = 0;
          }

          if (pos > this.str.length) {
            pos = this.str.length;
          }

          return this.pos = pos;
        };

        StringScanner.prototype.reset = function () {
          this.lastMatch.reset();
          this.pos = 0;
          return this;
        };

        StringScanner.prototype.rest = function () {
          return this.str.substr(this.pos);
        };

        StringScanner.prototype.scan = function (pattern) {
          var chk;
          chk = this.check(pattern);

          if (chk != null) {
            this.pos += chk.length;
          }

          return chk;
        };

        StringScanner.prototype.scanUntil = function (pattern) {
          var chk;
          chk = this.checkUntil(pattern);

          if (chk != null) {
            this.pos += chk.length;
          }

          return chk;
        };

        StringScanner.prototype.skip = function (pattern) {
          this.scan(pattern);
          return this.matchSize();
        };

        StringScanner.prototype.skipUntil = function (pattern) {
          this.scanUntil(pattern);
          return this.matchSize();
        };

        StringScanner.prototype.string = function () {
          return this.str;
        };

        StringScanner.prototype.terminate = function () {
          this.pos = this.str.length;
          this.lastMatch.reset();
          return this;
        };

        StringScanner.prototype.toString = function () {
          return "#<StringScanner " + (this.eos() ? 'fin' : "" + this.pos + "/" + this.str.length + " @ " + (this.str.length > 8 ? "" + this.str.substr(0, 5) + "..." : this.str)) + ">";
        };

        return StringScanner;
      }();

      StringScanner.prototype.beginningOfLine = StringScanner.prototype.bol;
      StringScanner.prototype.clear = StringScanner.prototype.terminate;
      StringScanner.prototype.dup = StringScanner.prototype.clone;
      StringScanner.prototype.endOfString = StringScanner.prototype.eos;
      StringScanner.prototype.exist = StringScanner.prototype.exists;
      StringScanner.prototype.getChar = StringScanner.prototype.getch;
      StringScanner.prototype.position = StringScanner.prototype.pointer;
      StringScanner.StringScanner = StringScanner;
      module$1.exports = StringScanner;
    }).call(this);
  })();

  var StringScanner = module$1.exports;

  var anyWhitespaceAndNewlinesTouchingEOF, any_whitespaceFollowedByNewlines_, processInput, ws;
  ws = '\\t\\x0B\\f \\xA0\\u1680\\u180E\\u2000-\\u200A\\u202F\\u205F\\u3000\\uFEFF';
  var INDENT_SYMBOL = '\uEFEF';
  var DEDENT_SYMBOL = '\uEFFE';
  var UNMATCHED_DEDENT_SYMBOL = '\uEFEE';
  var TERM_SYMBOL = '\uEFFF'; // Prints an easy-to-read version of the preprocessed string for debugging
  anyWhitespaceAndNewlinesTouchingEOF = new RegExp("[" + ws + "\\r?\\n]*$");
  any_whitespaceFollowedByNewlines_ = new RegExp("(?:[" + ws + "]*\\r?\\n)+");

  function Preprocessor() {
    this.base = null;
    this.indents = [];
    this.context = [];
    this.ss = new StringScanner('');

    this.context.peek = function () {
      if (this.length) {
        return this[this.length - 1];
      } else {
        return null;
      }
    };

    this.context.err = function (c) {
      throw new Error("Unexpected " + c);
    };

    this.output = '';

    this.context.observe = function (c) {
      var top;
      top = this.peek();

      switch (c) {
        case INDENT_SYMBOL:
          this.push(c);
          break;

        case DEDENT_SYMBOL:
          if (top !== INDENT_SYMBOL) {
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

  Preprocessor.prototype.appendToOutput = function (s) {
    if (s) {
      this.output += s;
    }

    return s;
  };

  Preprocessor.prototype.scan = function (r) {
    return this.appendToOutput(this.ss.scan(r));
  };

  Preprocessor.prototype.discard = function (r) {
    return this.ss.scan(r);
  };

  processInput = function (isEnd) {
    return function (data) {
      var b, d, indent, s;

      if (!isEnd) {
        this.ss.concat(data);
        this.discard(any_whitespaceFollowedByNewlines_);
      }

      while (!this.ss.eos()) {
        switch (this.context.peek()) {
          case null:
          case INDENT_SYMBOL:
            if (this.ss.bol() || this.discard(any_whitespaceFollowedByNewlines_)) {
              if (this.discard(new RegExp("[" + ws + "]*\\r?\\n"))) {
                this.appendToOutput("" + TERM_SYMBOL + "\n");
                continue;
              }

              if (this.base != null) {
                if (this.discard(this.base) == null) {
                  throw new Error("inconsistent base indentation");
                }
              } else {
                b = this.discard(new RegExp("[" + ws + "]*"));
                this.base = new RegExp("" + b);
              }

              if (this.indents.length === 0) {
                if (this.ss.check(new RegExp("[" + ws + "]*"))) {
                  this.appendToOutput(INDENT_SYMBOL);
                  this.context.observe(INDENT_SYMBOL);
                  this.indents.push(this.scan(new RegExp("([" + ws + "]*)")));
                }
              } else {
                indent = this.indents[this.indents.length - 1];

                if (d = this.ss.check(new RegExp("(" + indent + ")"))) {
                  this.discard(d);

                  if (this.ss.check(new RegExp("([" + ws + "]+)"))) {
                    this.appendToOutput(INDENT_SYMBOL);
                    this.context.observe(INDENT_SYMBOL);
                    this.indents.push(d + this.scan(new RegExp("([" + ws + "]+)")));
                  }
                } else {
                  while (this.indents.length) {
                    indent = this.indents[this.indents.length - 1];

                    if (this.discard(new RegExp("(?:" + indent + ")"))) {
                      break;
                    }

                    this.context.observe(DEDENT_SYMBOL);
                    this.appendToOutput(DEDENT_SYMBOL);
                    this.indents.pop();
                  }

                  if (s = this.discard(new RegExp("[" + ws + "]+"))) {
                    this.output = this.output.slice(0, -1);
                    this.output += UNMATCHED_DEDENT_SYMBOL;
                    this.appendToOutput(INDENT_SYMBOL);
                    this.context.observe(INDENT_SYMBOL);
                    this.indents.push(s);
                  }
                }
              }
            }

            this.scan(/[^\r\n]+/);

            if (this.discard(/\r?\n/)) {
              this.appendToOutput("" + TERM_SYMBOL + "\n");
            }

        }
      }

      if (isEnd) {
        this.scan(anyWhitespaceAndNewlinesTouchingEOF);

        while (this.context.length && INDENT_SYMBOL === this.context.peek()) {
          this.context.observe(DEDENT_SYMBOL);
          this.appendToOutput(DEDENT_SYMBOL);
        }

        if (this.context.length) {
          throw new Error('Unclosed ' + this.context.peek() + ' at EOF');
        }
      }
    };
  };

  Preprocessor.prototype.processData = processInput(false);
  Preprocessor.prototype.processEnd = processInput(true);
  function processSync(input) {
    var pre;
    input += "\n";
    pre = new Preprocessor();
    pre.processData(input);
    pre.processEnd();
    return pre.output;
  }

  var eventAliases = ['blur', 'change', 'click', 'contextMenu', 'dblclick', 'drag', 'dragEnd', 'dragEnter', 'dragLeave', 'dragOver', 'dragStart', 'drop', 'focus', 'focusIn', 'focusOut', 'input', 'keyDown', 'keyPress', 'keyUp', 'mouseDown', 'mouseEnter', 'mouseLeave', 'mouseMove', 'mouseUp', 'resize', 'scroll', 'select', 'submit', 'touchCancel', 'touchEnd', 'touchMove', 'touchStart'];

  function toObject(objects) {
    return objects.reduce((results, event) => {
      results[event] = true;
      return results;
    }, {});
  }

  var HTML_EVENTS = toObject(eventAliases.map(function (name) {
    return 'on' + name;
  }));
  var ALIAS_EVENTS = toObject(eventAliases);

  var KNOWN_TAGS = {
    figcaption: true,
    blockquote: true,
    plaintext: true,
    textarea: true,
    progress: true,
    optgroup: true,
    noscript: true,
    noframes: true,
    frameset: true,
    fieldset: true,
    datalist: true,
    colgroup: true,
    basefont: true,
    summary: true,
    section: true,
    marquee: true,
    listing: true,
    isindex: true,
    details: true,
    command: true,
    caption: true,
    bgsound: true,
    article: true,
    address: true,
    acronym: true,
    strong: true,
    strike: true,
    spacer: true,
    source: true,
    select: true,
    script: true,
    output: true,
    option: true,
    object: true,
    legend: true,
    keygen: true,
    iframe: true,
    hgroup: true,
    header: true,
    footer: true,
    figure: true,
    center: true,
    canvas: true,
    button: true,
    applet: true,
    video: true,
    track: true,
    title: true,
    thead: true,
    tfoot: true,
    tbody: true,
    table: true,
    style: true,
    small: true,
    param: true,
    meter: true,
    label: true,
    input: true,
    frame: true,
    embed: true,
    blink: true,
    audio: true,
    aside: true,
    time: true,
    span: true,
    samp: true,
    ruby: true,
    nobr: true,
    meta: true,
    menu: true,
    mark: true,
    main: true,
    link: true,
    html: true,
    head: true,
    form: true,
    font: true,
    data: true,
    code: true,
    cite: true,
    body: true,
    base: true,
    area: true,
    abbr: true,
    xmp: true,
    wbr: true,
    'var': true,
    sup: true,
    sub: true,
    pre: true,
    nav: true,
    map: true,
    kbd: true,
    ins: true,
    img: true,
    div: true,
    dir: true,
    dfn: true,
    del: true,
    col: true,
    big: true,
    bdo: true,
    bdi: true,
    ul: true,
    tt: true,
    tr: true,
    th: true,
    td: true,
    rt: true,
    rp: true,
    ol: true,
    li: true,
    hr: true,
    h6: true,
    h5: true,
    h4: true,
    h3: true,
    h2: true,
    h1: true,
    em: true,
    dt: true,
    dl: true,
    dd: true,
    br: true,
    u: true,
    s: true,
    q: true,
    p: true,
    i: true,
    b: true,
    a: true,
    menuitem: true
  };

  /*jshint newcap: false, laxbreak: true */

  var Parser =
  /*
  * Generated by PEG.js 0.10.0.
  *
  * http://pegjs.org/
  */
  function () {

    function peg$subclass(child, parent) {
      function ctor() {
        this.constructor = child;
      }

      ctor.prototype = parent.prototype;
      child.prototype = new ctor();
    }

    function peg$SyntaxError(message, expected, found, location) {
      this.message = message;
      this.expected = expected;
      this.found = found;
      this.location = location;
      this.name = "SyntaxError";

      if (typeof Error.captureStackTrace === "function") {
        Error.captureStackTrace(this, peg$SyntaxError);
      }
    }

    peg$subclass(peg$SyntaxError, Error);

    peg$SyntaxError.buildMessage = function (expected, found) {
      var DESCRIBE_EXPECTATION_FNS = {
        literal: function (expectation) {
          return "\"" + literalEscape(expectation.text) + "\"";
        },
        "class": function (expectation) {
          var escapedParts = "",
              i;

          for (i = 0; i < expectation.parts.length; i++) {
            escapedParts += expectation.parts[i] instanceof Array ? classEscape(expectation.parts[i][0]) + "-" + classEscape(expectation.parts[i][1]) : classEscape(expectation.parts[i]);
          }

          return "[" + (expectation.inverted ? "^" : "") + escapedParts + "]";
        },
        any: function (expectation) {
          return "any character";
        },
        end: function (expectation) {
          return "end of input";
        },
        other: function (expectation) {
          return expectation.description;
        }
      };

      function hex(ch) {
        return ch.charCodeAt(0).toString(16).toUpperCase();
      }

      function literalEscape(s) {
        return s.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\0/g, '\\0').replace(/\t/g, '\\t').replace(/\n/g, '\\n').replace(/\r/g, '\\r').replace(/[\x00-\x0F]/g, function (ch) {
          return '\\x0' + hex(ch);
        }).replace(/[\x10-\x1F\x7F-\x9F]/g, function (ch) {
          return '\\x' + hex(ch);
        });
      }

      function classEscape(s) {
        return s.replace(/\\/g, '\\\\').replace(/\]/g, '\\]').replace(/\^/g, '\\^').replace(/-/g, '\\-').replace(/\0/g, '\\0').replace(/\t/g, '\\t').replace(/\n/g, '\\n').replace(/\r/g, '\\r').replace(/[\x00-\x0F]/g, function (ch) {
          return '\\x0' + hex(ch);
        }).replace(/[\x10-\x1F\x7F-\x9F]/g, function (ch) {
          return '\\x' + hex(ch);
        });
      }

      function describeExpectation(expectation) {
        return DESCRIBE_EXPECTATION_FNS[expectation.type](expectation);
      }

      function describeExpected(expected) {
        var descriptions = new Array(expected.length),
            i,
            j;

        for (i = 0; i < expected.length; i++) {
          descriptions[i] = describeExpectation(expected[i]);
        }

        descriptions.sort();

        if (descriptions.length > 0) {
          for (i = 1, j = 1; i < descriptions.length; i++) {
            if (descriptions[i - 1] !== descriptions[i]) {
              descriptions[j] = descriptions[i];
              j++;
            }
          }

          descriptions.length = j;
        }

        switch (descriptions.length) {
          case 1:
            return descriptions[0];

          case 2:
            return descriptions[0] + " or " + descriptions[1];

          default:
            return descriptions.slice(0, -1).join(", ") + ", or " + descriptions[descriptions.length - 1];
        }
      }

      function describeFound(found) {
        return found ? "\"" + literalEscape(found) + "\"" : "end of input";
      }

      return "Expected " + describeExpected(expected) + " but " + describeFound(found) + " found.";
    };

    function peg$parse(input, options) {
      options = options !== void 0 ? options : {};

      var peg$FAILED = {},
          peg$startRuleFunctions = {
        _55start: peg$parse_55start
      },
          peg$startRuleFunction = peg$parse_55start,
          peg$c0 = /^[ \t]/,
          peg$c1 = peg$classExpectation([" ", "\t"], false, false),
          peg$c2 = peg$otherExpectation("_1OptionalWhitespace"),
          peg$c3 = function () {
        return [];
      },
          peg$c4 = peg$otherExpectation("_2LineEnd"),
          peg$c5 = "\r",
          peg$c6 = peg$literalExpectation("\r", false),
          peg$c7 = peg$anyExpectation(),
          peg$c8 = function (t) {
        return TERM_SYMBOL == t;
      },
          peg$c9 = "\n",
          peg$c10 = peg$literalExpectation("\n", false),
          peg$c11 = function (t) {
        return false;
      },
          peg$c12 = peg$otherExpectation("_3ANYDEDENT"),
          peg$c13 = peg$otherExpectation("_3DEDENT"),
          peg$c14 = function (t) {
        return DEDENT_SYMBOL === t;
      },
          peg$c15 = function (t) {
        return '';
      },
          peg$c16 = peg$otherExpectation("_3Unmatched DEDENT"),
          peg$c17 = function (t) {
        return UNMATCHED_DEDENT_SYMBOL === t;
      },
          peg$c18 = peg$otherExpectation("_4RequiredWhitespace"),
          peg$c19 = function (s) {
        return s;
      },
          peg$c20 = peg$otherExpectation("_5INDENT"),
          peg$c21 = function (t) {
        return INDENT_SYMBOL === t;
      },
          peg$c22 = function (c) {
        return c;
      },
          peg$c23 = peg$otherExpectation("_6INDENT"),
          peg$c24 = peg$otherExpectation("_6DEDENT"),
          peg$c25 = peg$otherExpectation("_6LineEnd"),
          peg$c26 = peg$otherExpectation("_7Comment"),
          peg$c27 = "/",
          peg$c28 = peg$literalExpectation("/", false),
          peg$c29 = peg$otherExpectation("_7LineEnd"),
          peg$c30 = "=",
          peg$c31 = peg$literalExpectation("=", false),
          peg$c32 = "else",
          peg$c33 = peg$literalExpectation("else", false),
          peg$c34 = "if",
          peg$c35 = peg$literalExpectation("if", false),
          peg$c36 = function (e) {
        return e.join('');
      },
          peg$c37 = "==",
          peg$c38 = peg$literalExpectation("==", false),
          peg$c39 = " ",
          peg$c40 = peg$literalExpectation(" ", false),
          peg$c41 = function () {
        return false;
      },
          peg$c42 = function () {
        return true;
      },
          peg$c43 = peg$otherExpectation("_11mustache expression"),
          peg$c44 = "{",
          peg$c45 = peg$literalExpectation("{", false),
          peg$c46 = /^[^}]/,
          peg$c47 = peg$classExpectation(["}"], true, false),
          peg$c48 = function (text) {
        return text;
      },
          peg$c49 = function (content) {
        return builder.generateMustache(prepareMustachValue(content), false);
      },
          peg$c50 = function (content) {
        return builder.generateMustache(prepareMustachValue(content), true);
      },
          peg$c51 = peg$otherExpectation("_12Double Mustache Open"),
          peg$c52 = "{{",
          peg$c53 = peg$literalExpectation("{{", false),
          peg$c54 = peg$otherExpectation("_12Triple Mustache Open"),
          peg$c55 = "{{{",
          peg$c56 = peg$literalExpectation("{{{", false),
          peg$c57 = peg$otherExpectation("_12Double Mustache Close"),
          peg$c58 = "}}",
          peg$c59 = peg$literalExpectation("}}", false),
          peg$c60 = peg$otherExpectation("_12Triple Mustache Close"),
          peg$c61 = "}}}",
          peg$c62 = peg$literalExpectation("}}}", false),
          peg$c63 = peg$otherExpectation("_12String Interpolation Open"),
          peg$c64 = "#{",
          peg$c65 = peg$literalExpectation("#{", false),
          peg$c66 = peg$otherExpectation("_12String Interpolation Close"),
          peg$c67 = "}",
          peg$c68 = peg$literalExpectation("}", false),
          peg$c70 = peg$otherExpectation("_13Double Mustache Open"),
          peg$c71 = peg$otherExpectation("_13Triple Mustache Open"),
          peg$c72 = peg$otherExpectation("_13String Interpolation Open"),
          peg$c73 = peg$otherExpectation("_13LineEnd"),
          peg$c74 = function (first, tail) {
        return flattenArray(first, tail);
      },
          peg$c75 = peg$otherExpectation("_14LineEnd"),
          peg$c76 = function (nodes) {
        return nodes;
      },
          peg$c77 = function (s, nodes, w) {
        return w;
      },
          peg$c78 = function (s, nodes, indentedNodes) {
        var i, l;
        var hasNodes = nodes && nodes.length,
            hasIndentedNodes = indentedNodes && indentedNodes.length; // add a space after the first line if it had content and
        // there are indented nodes to follow

        if (hasNodes && hasIndentedNodes) {
          nodes.push(' ');
        } // concat indented nodes


        if (indentedNodes) {
          for (i = 0, l = indentedNodes.length; i < l; i++) {
            nodes = nodes.concat(indentedNodes[i]); // connect logical lines with a space, skipping the next-to-last line

            if (i < l - 1) {
              nodes.push(' ');
            }
          }
        } // add trailing space to non-indented nodes if special modifier


        if (s === LINE_SPACE_MODIFIERS.SPACE_AFTER) {
          nodes.push(' ');
        } else if (s === LINE_SPACE_MODIFIERS.NEWLINE) {
          nodes.push('\n');
        } else if (s === LINE_SPACE_MODIFIERS.SPACE_BOTH) {
          nodes.push(' ');
          nodes.unshift(' ');
        } else if (s === LINE_SPACE_MODIFIERS.SPACE_BEFORE) {
          nodes.unshift(' ');
        }

        return castStringsToTextNodes(nodes);
      },
          peg$c79 = /^[|`'+"]/,
          peg$c80 = peg$classExpectation(["|", "`", "'", "+", "\""], false, false),
          peg$c81 = "<",
          peg$c82 = peg$literalExpectation("<", false),
          peg$c83 = function () {
        return '<';
      },
          peg$c84 = peg$otherExpectation("_16DEDENT"),
          peg$c85 = function (v) {
        var last = v[v.length - 1];
        var idNode; // Support for data keywords that are prefixed with @ in the each
        // block helper such as @index, @key, @first, @last

        if (last.part.charAt(0) === '@') {
          last.part = last.part.slice(1);
          idNode = new AST.IdNode(v);
          var dataNode = new AST.DataNode(idNode);
          return dataNode;
        }

        var match;
        var suffixModifier; // FIXME probably need to handle this better?

        if (match = last.part.match(/!$/)) {
          last.part = 'unbound ' + last.part.slice(0, -1);
        }

        if (match = last.part.match(/[\?\^]$/)) {
          suffixModifier = match[0];
          throw "unhandled path terminated: " + suffixModifier;
        }

        return last.part;
      },
          peg$c86 = function (first, s, p) {
        return {
          part: p,
          separator: s
        };
      },
          peg$c87 = function (first, tail) {
        var ret = [{
          part: first
        }];

        for (var i = 0; i < tail.length; ++i) {
          ret.push(tail[i]);
        }

        return ret;
      },
          peg$c88 = peg$otherExpectation("_17PathIdent"),
          peg$c89 = "..",
          peg$c90 = peg$literalExpectation("..", false),
          peg$c91 = ".",
          peg$c92 = peg$literalExpectation(".", false),
          peg$c93 = /^[a-zA-Z0-9_$\-!?\^@]/,
          peg$c94 = peg$classExpectation([["a", "z"], ["A", "Z"], ["0", "9"], "_", "$", "-", "!", "?", "^", "@"], false, false),
          peg$c95 = "[",
          peg$c96 = peg$literalExpectation("[", false),
          peg$c97 = /^[^\]]/,
          peg$c98 = peg$classExpectation(["]"], true, false),
          peg$c99 = "]",
          peg$c100 = peg$literalExpectation("]", false),
          peg$c101 = function (segmentLiteral) {
        return segmentLiteral;
      },
          peg$c102 = peg$otherExpectation("_17PathSeparator"),
          peg$c103 = /^[\/.]/,
          peg$c104 = peg$classExpectation(["/", "."], false, false),
          peg$c105 = ":",
          peg$c106 = peg$literalExpectation(":", false),
          peg$c107 = peg$otherExpectation("_19valid tag string"),
          peg$c108 = /^[_a-zA-Z0-9\-]/,
          peg$c109 = peg$classExpectation(["_", ["a", "z"], ["A", "Z"], ["0", "9"], "-"], false, false),
          peg$c110 = "@",
          peg$c111 = peg$literalExpectation("@", false),
          peg$c112 = function (p) {
        return p;
      },
          peg$c113 = "'",
          peg$c114 = peg$literalExpectation("'", false),
          peg$c115 = "\"",
          peg$c116 = peg$literalExpectation("\"", false),
          peg$c119 = peg$otherExpectation("_20string action attributes"),
          peg$c120 = /^[^"}]/,
          peg$c121 = peg$classExpectation(["\"", "}"], true, false),
          peg$c122 = /^[^'}]/,
          peg$c123 = peg$classExpectation(["'", "}"], true, false),
          peg$c124 = peg$otherExpectation("_20LineEnd"),
          peg$c125 = function (value) {
        return value;
      },
          peg$c126 = peg$otherExpectation("_21closing mustache"),
          peg$c127 = function (event, mustacheNode) {
        var actionBody, parts;

        if (typeof mustacheNode === 'string') {
          actionBody = mustacheNode;
        } else {
          parts = mustacheNode[1].split(' ');

          if (parts.length === 1) {
            actionBody = '"' + parts[0] + '"';
          } else {
            actionBody = mustacheNode[1];
          }
        }

        var actionContent = [actionBody];

        if (actionBody.indexOf('action ') !== 0) {
          actionContent.unshift('action');
        }

        return buildActionEvent(event, actionContent);
      },
          peg$c128 = peg$otherExpectation("_22a valid JS event"),
          peg$c129 = function (event) {
        return isAliasEvent(event);
      },
          peg$c130 = function (event) {
        return event;
      },
          peg$c131 = function (id) {
        return id;
      },
          peg$c132 = function (value) {
        return value;
      },
          peg$c133 = /^[\x80-\xFF]/,
          peg$c134 = peg$classExpectation([["\x80", "\xFF"]], false, false),
          peg$c135 = peg$otherExpectation("_24Key"),
          peg$c136 = "true",
          peg$c137 = peg$literalExpectation("true", false),
          peg$c138 = "false",
          peg$c139 = peg$literalExpectation("false", false),
          peg$c140 = function (key, boolValue) {
        if (boolValue === 'true') {
          return [key];
        }
      },
          peg$c141 = peg$otherExpectation("_26Attribute Key"),
          peg$c142 = "$",
          peg$c143 = peg$literalExpectation("$", false),
          peg$c144 = function (key, digits) {
        var value = parseInt(digits.join(""), 10);
        return [key, value];
      },
          peg$c145 = peg$otherExpectation("_27Valid numbers"),
          peg$c146 = /^[0-9]/,
          peg$c147 = peg$classExpectation([["0", "9"]], false, false),
          peg$c148 = /^[\-_\/A-Za-z0-9]/,
          peg$c149 = peg$classExpectation(["-", "_", "/", ["A", "Z"], ["a", "z"], ["0", "9"]], false, false),
          peg$c150 = "::",
          peg$c151 = peg$literalExpectation("::", false),
          peg$c152 = ".[",
          peg$c153 = peg$literalExpectation(".[", false),
          peg$c154 = "as",
          peg$c155 = peg$literalExpectation("as", false),
          peg$c156 = peg$otherExpectation("_29block param starting pipe"),
          peg$c157 = "|",
          peg$c158 = peg$literalExpectation("|", false),
          peg$c159 = peg$otherExpectation("_30Quoted string"),
          peg$c160 = /^[^'"]/,
          peg$c161 = peg$classExpectation(["'", "\""], true, false),
          peg$c162 = function (v) {
        return v;
      },
          peg$c163 = /^[\/(]/,
          peg$c164 = peg$classExpectation(["/", "("], false, false),
          peg$c165 = peg$otherExpectation("_32closing mustache"),
          peg$c166 = function (initialHelper, sub) {
        return initialHelper + ' ' + sub.join(' ');
      },
          peg$c167 = function (attrs) {
        // Filter out comments
        return attrs.filter(function (attr) {
          return attr && attr.length > 0;
        });
      },
          peg$c168 = function (attr) {
        return attr;
      },
          peg$c169 = peg$otherExpectation("_32Closing bracket"),
          peg$c170 = function (key, value) {
        return key + '=' + value;
      },
          peg$c171 = "(",
          peg$c172 = peg$literalExpectation("(", false),
          peg$c173 = function (helper, attrs) {
        var firstHalf = '(' + helper;
        if (attrs) return firstHalf + ' ' + attrs.join(' ') + ')';else return firstHalf + ')';
      },
          peg$c174 = peg$otherExpectation("_32Closing ) for Subexpression"),
          peg$c175 = ")",
          peg$c176 = peg$literalExpectation(")", false),
          peg$c177 = peg$otherExpectation("_32Subexpression bracketed attribute"),
          peg$c178 = function (attrs) {
        return attrs;
      },
          peg$c179 = "class=",
          peg$c180 = peg$literalExpectation("class=", false),
          peg$c181 = function (value) {
        value = value.trim().replace(/[]/g, ''); // Class logic needs to be coalesced, except for conditional statements

        if (value.indexOf('if') === 0 || value.indexOf('unless') === 0) {
          return builder.generateClassNameBinding(value);
        } else {
          return splitValueIntoClassBindings(value);
        }
      },
          peg$c182 = function (k, value) {
        value = value.trim().replace(/[]/g, '');
        return [builder.generateAssignedMustache(value, k)];
      },
          peg$c183 = peg$otherExpectation("_32INDENT"),
          peg$c184 = peg$otherExpectation("_32DEDENT"),
          peg$c185 = peg$otherExpectation("_32LineEnd"),
          peg$c186 = "!",
          peg$c187 = peg$literalExpectation("!", false),
          peg$c188 = function (key, value) {
        if (key === 'class') {
          return splitValueIntoClassBindings(value);
        } else {
          return [builder.generateAssignedMustache(value, key)];
        }
      },
          peg$c189 = function (value) {
        return value.replace(/ *$/, '');
      },
          peg$c190 = peg$otherExpectation("_33valid attribute value"),
          peg$c191 = peg$otherExpectation("_33closing mustache"),
          peg$c192 = function (key, nodes) {
        var strings = [];
        nodes.forEach(function (node) {
          if (typeof node === 'string') {
            strings.push(node);
          } else {
            // FIXME here we transform a mustache attribute
            // This should be handled higher up instead, not here.
            // This happens when the attribute is something like:
            // src="{{unbound post.showLogoUrl}}".
            // key = "src", nodes[0] = "unbound post.showLogoUrl"
            if (node.escaped) {
              strings.push('{{' + node.content + '}}');
            } else {
              strings.push('{{{' + node.content + '}}}');
            }
          }
        });
        var result = [key, strings.join('')];
        return result;
      },
          peg$c193 = function (a) {
        return a;
      },
          peg$c194 = peg$otherExpectation("_34Closing Single Quote"),
          peg$c195 = peg$otherExpectation("_34Closing Double Quote"),
          peg$c196 = peg$otherExpectation("_34Valid quoted attribute value"),
          peg$c197 = function (key, value) {
        return [key, '{{' + value + '}}'];
      },
          peg$c198 = "...attributes",
          peg$c199 = peg$literalExpectation("...attributes", false),
          peg$c200 = function (spread) {
        return [spread];
      },
          peg$c201 = function (a) {
        if (!a) return [];else if (!a.length) return [a];else return a;
      },
          peg$c202 = function (a) {
        return a;
      },
          peg$c203 = peg$otherExpectation("_38LineEnd"),
          peg$c204 = peg$otherExpectation("_38INDENT"),
          peg$c205 = function (value) {
        return [builder.generateMustache(value, true)];
      },
          peg$c206 = peg$otherExpectation("_39LineEnd"),
          peg$c207 = peg$otherExpectation("_39INDENT"),
          peg$c208 = peg$otherExpectation("_40CSS class"),
          peg$c209 = peg$otherExpectation("_41HTML ID"),
          peg$c210 = "#",
          peg$c211 = peg$literalExpectation("#", false),
          peg$c212 = function (c) {
        return c;
      },
          peg$c213 = function (s) {
        return {
          shorthand: s,
          id: true
        };
      },
          peg$c214 = function (s) {
        return {
          shorthand: s
        };
      },
          peg$c215 = function (shorthands) {
        var id,
            classes = [];

        for (var i = 0, len = shorthands.length; i < len; ++i) {
          var shorthand = shorthands[i];

          if (shorthand.id) {
            id = shorthand.shorthand;
          } else {
            classes.push(shorthand.shorthand);
          }
        }

        return [id, classes];
      },
          peg$c216 = function (m) {
        return builder.generateMustache(m, true);
      },
          peg$c217 = function (h, startingInTagMustaches, modifiers, fullAttributes) {
        // Filter out comments
        fullAttributes = fullAttributes.filter(function (attr) {
          return attr && attr.length > 0;
        });
        return parseInHtml(h, startingInTagMustaches.concat(modifiers), fullAttributes);
      },
          peg$c218 = function (h, inTagMustaches, fullAttributes) {
        return parseInHtml(h, inTagMustaches, fullAttributes);
      },
          peg$c219 = function (h, s) {
        return h || s;
      },
          peg$c220 = function (tag) {
        return isKnownTag(tag);
      },
          peg$c221 = function (tag) {
        return tag;
      },
          peg$c222 = peg$otherExpectation("_45LineEnd"),
          peg$c224 = peg$otherExpectation("_45DEDENT"),
          peg$c225 = peg$otherExpectation("_46block params closing pipe"),
          peg$c226 = function (params) {
        return params;
      },
          peg$c227 = peg$otherExpectation("_47block param"),
          peg$c228 = peg$otherExpectation("_48Closing bracket"),
          peg$c229 = function (h, startingInTagMustaches, blockParams, modifiers, fullAttributes) {
        // Filter out comments
        fullAttributes = fullAttributes.filter(function (attr) {
          return attr && attr.length > 0;
        });
        return parseInHtml(h, startingInTagMustaches.concat(modifiers), fullAttributes, blockParams);
      },
          peg$c230 = function (h, inTagMustaches, fullAttributes, blockParams) {
        return parseInHtml(h, inTagMustaches, fullAttributes, blockParams);
      },
          peg$c231 = function (h, s) {
        return h || s;
      },
          peg$c232 = "%",
          peg$c233 = peg$literalExpectation("%", false),
          peg$c234 = function (s) {
        return s;
      },
          peg$c235 = peg$otherExpectation("_48LineEnd"),
          peg$c237 = peg$otherExpectation("_48DEDENT"),
          peg$c238 = function (ret, multilineContent) {
        if (multilineContent) {
          multilineContent = multilineContent[1];

          for (var i = 0, len = multilineContent.length; i < len; ++i) {
            ret.push(' ');
            ret = ret.concat(multilineContent[i]);
          }
        }

        return ret;
      },
          peg$c239 = peg$otherExpectation("_50DEDENT"),
          peg$c240 = function (initialAttr, attrs) {
        if (initialAttr) attrs.unshift(initialAttr); // Filter out comments

        return attrs.filter(function (attr) {
          return attr && attr.length > 0;
        });
      },
          peg$c241 = peg$otherExpectation("_51Closing bracket"),
          peg$c242 = peg$otherExpectation("_51Closing ) for Subexpression"),
          peg$c243 = peg$otherExpectation("_51Subexpression bracketed attribute"),
          peg$c244 = peg$otherExpectation("_51INDENT"),
          peg$c245 = peg$otherExpectation("_51DEDENT"),
          peg$c246 = peg$otherExpectation("_51LineEnd"),
          peg$c247 = peg$otherExpectation("_52tagName shorthand"),
          peg$c248 = function (tagName) {
        return 'tagName="' + tagName + '"';
      },
          peg$c249 = peg$otherExpectation("_52elementId shorthand"),
          peg$c250 = function (idName) {
        return 'elementId="' + idName + '"';
      },
          peg$c251 = peg$otherExpectation("_52class shorthand"),
          peg$c252 = function (className) {
        return 'class="' + className + '"';
      },
          peg$c253 = /^[A-Za-z0-9\-_]/,
          peg$c254 = peg$classExpectation([["A", "Z"], ["a", "z"], ["0", "9"], "-", "_"], false, false),
          peg$c255 = peg$otherExpectation("_53Unbound modifier !"),
          peg$c256 = peg$otherExpectation("_53Conditional modifier ?"),
          peg$c257 = "?",
          peg$c258 = peg$literalExpectation("?", false),
          peg$c259 = function (mustacheStart, attrs, blockParams) {
        attrs = attrs.concat(mustacheStart.shorthands);
        mustacheStart['attrs'] = attrs;
        mustacheStart['blockParams'] = blockParams;
        return mustacheStart;
      },
          peg$c260 = function (nameAst, shorthands) {
        var component = nameAst.name.indexOf('-') > -1;
        nameAst['component'] = component;
        nameAst['shorthands'] = shorthands;
        return nameAst;
      },
          peg$c261 = function (name, modifier) {
        return {
          name: name,
          modifier: modifier
        };
      },
          peg$c262 = peg$otherExpectation("_54Invalid mustache starting character"),
          peg$c263 = "-",
          peg$c264 = peg$literalExpectation("-", false),
          peg$c265 = function (c) {
        builder.add('childNodes', c);
      },
          peg$c266 = function (statements) {
        return statements;
      },
          peg$c267 = ": ",
          peg$c268 = peg$literalExpectation(": ", false),
          peg$c269 = function (h, nested) {
        if (nested && nested.length > 0) {
          nested = castStringsToTextNodes(nested);
          builder.add('childNodes', nested);
        }

        return [builder.exit()];
      },
          peg$c270 = function (mustacheTuple) {
        var blockOrMustache = createBlockOrMustache(mustacheTuple);
        return [blockOrMustache];
      },
          peg$c271 = function (c) {
        return c;
      },
          peg$c272 = function (h) {
        return h;
      },
          peg$c273 = function (mustacheTuple) {
        var parsedMustacheOrBlock = createBlockOrMustache(mustacheTuple);
        return [parsedMustacheOrBlock];
      },
          peg$c274 = function (e, mustacheTuple) {
        var mustache = mustacheTuple[0];
        var block = mustacheTuple[1];
        mustache.isEscaped = e;
        mustache.explicit = !e;
        return [mustache, block];
      },
          peg$c275 = function (mustacheTuple) {
        var mustacheAst = mustacheTuple[0];

        if (mustacheAst.isViewHelper) {
          logDeprecation('View syntax detected: ' + mustacheAst.name);
        }

        if (mustacheAst.component) {
          logDeprecation('Explicit component declarations will be interpreted as angle-bracket components in a later release: ' + mustacheAst.name);
        }

        return mustacheTuple;
      },
          peg$c276 = /^[A-Z]/,
          peg$c277 = peg$classExpectation([["A", "Z"]], false, false),
          peg$c278 = function (mustacheTuple) {
        var mustache = mustacheTuple[0];
        var block = mustacheTuple[1];
        mustache.isViewHelper = true;
        return [mustache, block];
      },
          peg$c279 = function (mustacheContent, blockTuple) {
        if (blockTuple) {
          return [mustacheContent, blockTuple];
        } else {
          return [mustacheContent];
        }
      },
          peg$c280 = function (mustache) {
        return mustache;
      },
          peg$c281 = function (statements) {
        return {
          blockTuple: statements
        };
      },
          peg$c282 = function (i) {
        return i;
      },
          peg$c283 = function (block) {
        return {
          blockTuple: block
        };
      },
          peg$c284 = function (mustache) {
        return mustache;
      },
          peg$c285 = function (blockParams, block) {
        return {
          blockParams: blockParams,
          blockTuple: block
        };
      },
          peg$c286 = function () {
        return;
      },
          peg$c287 = function (c, i) {
        return [c, i];
      },
          peg$c288 = function (b, a, c, i) {
        return {
          content: c,
          name: [b, a].join(' '),
          isInvertible: true,
          invertibleNodes: i
        };
      },
          peg$c289 = function (p) {
        return p.join(' ');
      },
          peg$c290 = peg$otherExpectation("_55INDENT"),
          peg$c291 = peg$otherExpectation("_55DEDENT"),
          peg$c292 = peg$otherExpectation("_55LineEnd"),
          peg$currPos = 0,
          peg$posDetailsCache = [{
        line: 1,
        column: 1
      }],
          peg$maxFailPos = 0,
          peg$maxFailExpected = [],
          peg$silentFails = 0,
          peg$result;

      if ("startRule" in options) {
        if (!(options.startRule in peg$startRuleFunctions)) {
          throw new Error("Can't start parsing from rule \"" + options.startRule + "\".");
        }

        peg$startRuleFunction = peg$startRuleFunctions[options.startRule];
      }

      function peg$literalExpectation(text, ignoreCase) {
        return {
          type: "literal",
          text: text,
          ignoreCase: ignoreCase
        };
      }

      function peg$classExpectation(parts, inverted, ignoreCase) {
        return {
          type: "class",
          parts: parts,
          inverted: inverted,
          ignoreCase: ignoreCase
        };
      }

      function peg$anyExpectation() {
        return {
          type: "any"
        };
      }

      function peg$endExpectation() {
        return {
          type: "end"
        };
      }

      function peg$otherExpectation(description) {
        return {
          type: "other",
          description: description
        };
      }

      function peg$computePosDetails(pos) {
        var details = peg$posDetailsCache[pos],
            p;

        if (details) {
          return details;
        } else {
          p = pos - 1;

          while (!peg$posDetailsCache[p]) {
            p--;
          }

          details = peg$posDetailsCache[p];
          details = {
            line: details.line,
            column: details.column
          };

          while (p < pos) {
            if (input.charCodeAt(p) === 10) {
              details.line++;
              details.column = 1;
            } else {
              details.column++;
            }

            p++;
          }

          peg$posDetailsCache[pos] = details;
          return details;
        }
      }

      function peg$computeLocation(startPos, endPos) {
        var startPosDetails = peg$computePosDetails(startPos),
            endPosDetails = peg$computePosDetails(endPos);
        return {
          start: {
            offset: startPos,
            line: startPosDetails.line,
            column: startPosDetails.column
          },
          end: {
            offset: endPos,
            line: endPosDetails.line,
            column: endPosDetails.column
          }
        };
      }

      function peg$fail(expected) {
        if (peg$currPos < peg$maxFailPos) {
          return;
        }

        if (peg$currPos > peg$maxFailPos) {
          peg$maxFailPos = peg$currPos;
          peg$maxFailExpected = [];
        }

        peg$maxFailExpected.push(expected);
      }

      function peg$buildStructuredError(expected, found, location) {
        return new peg$SyntaxError(peg$SyntaxError.buildMessage(expected, found), expected, found, location);
      }

      function peg$parse_0start() {
        var s0;

        if (peg$c0.test(input.charAt(peg$currPos))) {
          s0 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s0 = peg$FAILED;

          if (peg$silentFails === 0) {
            peg$fail(peg$c1);
          }
        }

        return s0;
      }

      function peg$parse_1start() {
        var s0, s1;
        peg$silentFails++;
        s0 = [];
        s1 = peg$parse_0start();

        while (s1 !== peg$FAILED) {
          s0.push(s1);
          s1 = peg$parse_0start();
        }

        peg$silentFails--;

        if (s0 === peg$FAILED) {
          s1 = peg$FAILED;

          if (peg$silentFails === 0) {
            peg$fail(peg$c2);
          }
        }

        return s0;
      }

      function peg$parse_2blankLine() {
        var s0, s1, s2;
        s0 = peg$currPos;
        s1 = peg$parse_1start();

        if (s1 !== peg$FAILED) {
          s2 = peg$parse_2TERM();

          if (s2 !== peg$FAILED) {
            s1 = peg$c3();
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }

        return s0;
      }

      function peg$parse_2TERM() {
        var s0, s1, s2, s3, s4;
        peg$silentFails++;
        s0 = peg$currPos;

        if (input.charCodeAt(peg$currPos) === 13) {
          s1 = peg$c5;
          peg$currPos++;
        } else {
          s1 = peg$FAILED;

          if (peg$silentFails === 0) {
            peg$fail(peg$c6);
          }
        }

        if (s1 === peg$FAILED) {
          s1 = null;
        }

        if (s1 !== peg$FAILED) {
          if (input.length > peg$currPos) {
            s2 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s2 = peg$FAILED;

            if (peg$silentFails === 0) {
              peg$fail(peg$c7);
            }
          }

          if (s2 !== peg$FAILED) {
            s3 = peg$c8(s2);

            if (s3) {
              s3 = void 0;
            } else {
              s3 = peg$FAILED;
            }

            if (s3 !== peg$FAILED) {
              if (input.charCodeAt(peg$currPos) === 10) {
                s4 = peg$c9;
                peg$currPos++;
              } else {
                s4 = peg$FAILED;

                if (peg$silentFails === 0) {
                  peg$fail(peg$c10);
                }
              }

              if (s4 !== peg$FAILED) {
                s1 = peg$c11(s2);
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }

        peg$silentFails--;

        if (s0 === peg$FAILED) {
          s1 = peg$FAILED;

          if (peg$silentFails === 0) {
            peg$fail(peg$c4);
          }
        }

        return s0;
      }

      function peg$parse_3anyDedent() {
        var s0;
        peg$silentFails++;
        s0 = peg$parse_3DEDENT();

        if (s0 === peg$FAILED) {
          s0 = peg$parse_3UNMATCHED_DEDENT();
        }

        peg$silentFails--;

        if (s0 === peg$FAILED) {

          if (peg$silentFails === 0) {
            peg$fail(peg$c12);
          }
        }

        return s0;
      }

      function peg$parse_3DEDENT() {
        var s0, s1, s2;
        peg$silentFails++;
        s0 = peg$currPos;

        if (input.length > peg$currPos) {
          s1 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s1 = peg$FAILED;

          if (peg$silentFails === 0) {
            peg$fail(peg$c7);
          }
        }

        if (s1 !== peg$FAILED) {
          s2 = peg$c14(s1);

          if (s2) {
            s2 = void 0;
          } else {
            s2 = peg$FAILED;
          }

          if (s2 !== peg$FAILED) {
            s1 = peg$c15(s1);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }

        peg$silentFails--;

        if (s0 === peg$FAILED) {
          s1 = peg$FAILED;

          if (peg$silentFails === 0) {
            peg$fail(peg$c13);
          }
        }

        return s0;
      }

      function peg$parse_3UNMATCHED_DEDENT() {
        var s0, s1, s2;
        peg$silentFails++;
        s0 = peg$currPos;

        if (input.length > peg$currPos) {
          s1 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s1 = peg$FAILED;

          if (peg$silentFails === 0) {
            peg$fail(peg$c7);
          }
        }

        if (s1 !== peg$FAILED) {
          s2 = peg$c17(s1);

          if (s2) {
            s2 = void 0;
          } else {
            s2 = peg$FAILED;
          }

          if (s2 !== peg$FAILED) {
            s1 = peg$c15(s1);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }

        peg$silentFails--;

        if (s0 === peg$FAILED) {
          s1 = peg$FAILED;

          if (peg$silentFails === 0) {
            peg$fail(peg$c16);
          }
        }

        return s0;
      }

      function peg$parse_4start() {
        var s0, s1, s2;
        peg$silentFails++;
        s0 = peg$currPos;
        s1 = [];
        s2 = peg$parse_0start();

        if (s2 !== peg$FAILED) {
          while (s2 !== peg$FAILED) {
            s1.push(s2);
            s2 = peg$parse_0start();
          }
        } else {
          s1 = peg$FAILED;
        }

        if (s1 !== peg$FAILED) {
          s0 = input.substring(s0, peg$currPos);
        } else {
          s0 = s1;
        }

        peg$silentFails--;

        if (s0 === peg$FAILED) {
          s1 = peg$FAILED;

          if (peg$silentFails === 0) {
            peg$fail(peg$c18);
          }
        }

        return s0;
      }

      function peg$parse_5indentation() {
        var s0, s1, s2;
        s0 = peg$currPos;
        s1 = peg$parse_5INDENT();

        if (s1 !== peg$FAILED) {
          s2 = peg$parse_4start();

          if (s2 !== peg$FAILED) {
            s1 = peg$c19(s2);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }

        return s0;
      }

      function peg$parse_5INDENT() {
        var s0, s1, s2;
        peg$silentFails++;
        s0 = peg$currPos;

        if (input.length > peg$currPos) {
          s1 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s1 = peg$FAILED;

          if (peg$silentFails === 0) {
            peg$fail(peg$c7);
          }
        }

        if (s1 !== peg$FAILED) {
          s2 = peg$c21(s1);

          if (s2) {
            s2 = void 0;
          } else {
            s2 = peg$FAILED;
          }

          if (s2 !== peg$FAILED) {
            s1 = peg$c15(s1);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }

        peg$silentFails--;

        if (s0 === peg$FAILED) {
          s1 = peg$FAILED;

          if (peg$silentFails === 0) {
            peg$fail(peg$c20);
          }
        }

        return s0;
      }

      function peg$parse_6lineContent() {
        var s0, s1, s2;
        s0 = peg$currPos;
        s1 = [];
        s2 = peg$parse_6lineChar();

        while (s2 !== peg$FAILED) {
          s1.push(s2);
          s2 = peg$parse_6lineChar();
        }

        if (s1 !== peg$FAILED) {
          s0 = input.substring(s0, peg$currPos);
        } else {
          s0 = s1;
        }

        return s0;
      }

      function peg$parse_6lineChar() {
        var s0, s1, s2;
        s0 = peg$currPos;
        s1 = peg$currPos;
        peg$silentFails++;
        s2 = peg$parse_6INDENT();

        if (s2 === peg$FAILED) {
          s2 = peg$parse_6DEDENT();

          if (s2 === peg$FAILED) {
            s2 = peg$parse_6TERM();
          }
        }

        peg$silentFails--;

        if (s2 === peg$FAILED) {
          s1 = void 0;
        } else {
          peg$currPos = s1;
          s1 = peg$FAILED;
        }

        if (s1 !== peg$FAILED) {
          if (input.length > peg$currPos) {
            s2 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s2 = peg$FAILED;

            if (peg$silentFails === 0) {
              peg$fail(peg$c7);
            }
          }

          if (s2 !== peg$FAILED) {
            s1 = peg$c22(s2);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }

        return s0;
      }

      function peg$parse_6INDENT() {
        var s0, s1, s2;
        peg$silentFails++;
        s0 = peg$currPos;

        if (input.length > peg$currPos) {
          s1 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s1 = peg$FAILED;

          if (peg$silentFails === 0) {
            peg$fail(peg$c7);
          }
        }

        if (s1 !== peg$FAILED) {
          s2 = peg$c21(s1);

          if (s2) {
            s2 = void 0;
          } else {
            s2 = peg$FAILED;
          }

          if (s2 !== peg$FAILED) {
            s1 = peg$c15(s1);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }

        peg$silentFails--;

        if (s0 === peg$FAILED) {
          s1 = peg$FAILED;

          if (peg$silentFails === 0) {
            peg$fail(peg$c23);
          }
        }

        return s0;
      }

      function peg$parse_6DEDENT() {
        var s0, s1, s2;
        peg$silentFails++;
        s0 = peg$currPos;

        if (input.length > peg$currPos) {
          s1 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s1 = peg$FAILED;

          if (peg$silentFails === 0) {
            peg$fail(peg$c7);
          }
        }

        if (s1 !== peg$FAILED) {
          s2 = peg$c14(s1);

          if (s2) {
            s2 = void 0;
          } else {
            s2 = peg$FAILED;
          }

          if (s2 !== peg$FAILED) {
            s1 = peg$c15(s1);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }

        peg$silentFails--;

        if (s0 === peg$FAILED) {
          s1 = peg$FAILED;

          if (peg$silentFails === 0) {
            peg$fail(peg$c24);
          }
        }

        return s0;
      }

      function peg$parse_6TERM() {
        var s0, s1, s2, s3, s4;
        peg$silentFails++;
        s0 = peg$currPos;

        if (input.charCodeAt(peg$currPos) === 13) {
          s1 = peg$c5;
          peg$currPos++;
        } else {
          s1 = peg$FAILED;

          if (peg$silentFails === 0) {
            peg$fail(peg$c6);
          }
        }

        if (s1 === peg$FAILED) {
          s1 = null;
        }

        if (s1 !== peg$FAILED) {
          if (input.length > peg$currPos) {
            s2 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s2 = peg$FAILED;

            if (peg$silentFails === 0) {
              peg$fail(peg$c7);
            }
          }

          if (s2 !== peg$FAILED) {
            s3 = peg$c8(s2);

            if (s3) {
              s3 = void 0;
            } else {
              s3 = peg$FAILED;
            }

            if (s3 !== peg$FAILED) {
              if (input.charCodeAt(peg$currPos) === 10) {
                s4 = peg$c9;
                peg$currPos++;
              } else {
                s4 = peg$FAILED;

                if (peg$silentFails === 0) {
                  peg$fail(peg$c10);
                }
              }

              if (s4 !== peg$FAILED) {
                s1 = peg$c11(s2);
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }

        peg$silentFails--;

        if (s0 === peg$FAILED) {
          s1 = peg$FAILED;

          if (peg$silentFails === 0) {
            peg$fail(peg$c25);
          }
        }

        return s0;
      }

      function peg$parse_7comment() {
        var s0, s1, s2;
        peg$silentFails++;
        s0 = peg$currPos;

        if (input.charCodeAt(peg$currPos) === 47) {
          s1 = peg$c27;
          peg$currPos++;
        } else {
          s1 = peg$FAILED;

          if (peg$silentFails === 0) {
            peg$fail(peg$c28);
          }
        }

        if (s1 !== peg$FAILED) {
          s2 = peg$parse_7commentContent();

          if (s2 !== peg$FAILED) {
            s1 = peg$c3();
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }

        peg$silentFails--;

        if (s0 === peg$FAILED) {
          s1 = peg$FAILED;

          if (peg$silentFails === 0) {
            peg$fail(peg$c26);
          }
        }

        return s0;
      }

      function peg$parse_7commentContent() {
        var s0, s1, s2, s3, s4, s5, s6, s7;
        s0 = peg$currPos;
        s1 = peg$parse_6lineContent();

        if (s1 !== peg$FAILED) {
          s2 = peg$parse_7TERM();

          if (s2 !== peg$FAILED) {
            s3 = [];
            s4 = peg$currPos;
            s5 = peg$parse_5indentation();

            if (s5 !== peg$FAILED) {
              s6 = [];
              s7 = peg$parse_7commentContent();

              if (s7 !== peg$FAILED) {
                while (s7 !== peg$FAILED) {
                  s6.push(s7);
                  s7 = peg$parse_7commentContent();
                }
              } else {
                s6 = peg$FAILED;
              }

              if (s6 !== peg$FAILED) {
                s7 = peg$parse_3anyDedent();

                if (s7 !== peg$FAILED) {
                  s5 = [s5, s6, s7];
                  s4 = s5;
                } else {
                  peg$currPos = s4;
                  s4 = peg$FAILED;
                }
              } else {
                peg$currPos = s4;
                s4 = peg$FAILED;
              }
            } else {
              peg$currPos = s4;
              s4 = peg$FAILED;
            }

            while (s4 !== peg$FAILED) {
              s3.push(s4);
              s4 = peg$currPos;
              s5 = peg$parse_5indentation();

              if (s5 !== peg$FAILED) {
                s6 = [];
                s7 = peg$parse_7commentContent();

                if (s7 !== peg$FAILED) {
                  while (s7 !== peg$FAILED) {
                    s6.push(s7);
                    s7 = peg$parse_7commentContent();
                  }
                } else {
                  s6 = peg$FAILED;
                }

                if (s6 !== peg$FAILED) {
                  s7 = peg$parse_3anyDedent();

                  if (s7 !== peg$FAILED) {
                    s5 = [s5, s6, s7];
                    s4 = s5;
                  } else {
                    peg$currPos = s4;
                    s4 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s4;
                  s4 = peg$FAILED;
                }
              } else {
                peg$currPos = s4;
                s4 = peg$FAILED;
              }
            }

            if (s3 !== peg$FAILED) {
              s1 = peg$c3();
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }

        return s0;
      }

      function peg$parse_7TERM() {
        var s0, s1, s2, s3, s4;
        peg$silentFails++;
        s0 = peg$currPos;

        if (input.charCodeAt(peg$currPos) === 13) {
          s1 = peg$c5;
          peg$currPos++;
        } else {
          s1 = peg$FAILED;

          if (peg$silentFails === 0) {
            peg$fail(peg$c6);
          }
        }

        if (s1 === peg$FAILED) {
          s1 = null;
        }

        if (s1 !== peg$FAILED) {
          if (input.length > peg$currPos) {
            s2 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s2 = peg$FAILED;

            if (peg$silentFails === 0) {
              peg$fail(peg$c7);
            }
          }

          if (s2 !== peg$FAILED) {
            s3 = peg$c8(s2);

            if (s3) {
              s3 = void 0;
            } else {
              s3 = peg$FAILED;
            }

            if (s3 !== peg$FAILED) {
              if (input.charCodeAt(peg$currPos) === 10) {
                s4 = peg$c9;
                peg$currPos++;
              } else {
                s4 = peg$FAILED;

                if (peg$silentFails === 0) {
                  peg$fail(peg$c10);
                }
              }

              if (s4 !== peg$FAILED) {
                s1 = peg$c11(s2);
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }

        peg$silentFails--;

        if (s0 === peg$FAILED) {
          s1 = peg$FAILED;

          if (peg$silentFails === 0) {
            peg$fail(peg$c29);
          }
        }

        return s0;
      }

      function peg$parse_8else() {
        var s0, s1, s2, s3, s4, s5;
        s0 = peg$currPos;
        s1 = peg$currPos;

        if (input.charCodeAt(peg$currPos) === 61) {
          s2 = peg$c30;
          peg$currPos++;
        } else {
          s2 = peg$FAILED;

          if (peg$silentFails === 0) {
            peg$fail(peg$c31);
          }
        }

        if (s2 !== peg$FAILED) {
          s3 = peg$parse_1start();

          if (s3 !== peg$FAILED) {
            s2 = [s2, s3];
            s1 = s2;
          } else {
            peg$currPos = s1;
            s1 = peg$FAILED;
          }
        } else {
          peg$currPos = s1;
          s1 = peg$FAILED;
        }

        if (s1 === peg$FAILED) {
          s1 = null;
        }

        if (s1 !== peg$FAILED) {
          s2 = peg$currPos;

          if (input.substr(peg$currPos, 4) === peg$c32) {
            s3 = peg$c32;
            peg$currPos += 4;
          } else {
            s3 = peg$FAILED;

            if (peg$silentFails === 0) {
              peg$fail(peg$c33);
            }
          }

          if (s3 !== peg$FAILED) {
            s4 = peg$parse_1start();

            if (s4 !== peg$FAILED) {
              if (input.substr(peg$currPos, 2) === peg$c34) {
                s5 = peg$c34;
                peg$currPos += 2;
              } else {
                s5 = peg$FAILED;

                if (peg$silentFails === 0) {
                  peg$fail(peg$c35);
                }
              }

              if (s5 === peg$FAILED) {
                s5 = null;
              }

              if (s5 !== peg$FAILED) {
                s3 = [s3, s4, s5];
                s2 = s3;
              } else {
                peg$currPos = s2;
                s2 = peg$FAILED;
              }
            } else {
              peg$currPos = s2;
              s2 = peg$FAILED;
            }
          } else {
            peg$currPos = s2;
            s2 = peg$FAILED;
          }

          if (s2 !== peg$FAILED) {
            s1 = peg$c36(s2);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }

        return s0;
      }

      function peg$parse_9equalSign() {
        var s0, s1, s2;
        s0 = peg$currPos;

        if (input.substr(peg$currPos, 2) === peg$c37) {
          s1 = peg$c37;
          peg$currPos += 2;
        } else {
          s1 = peg$FAILED;

          if (peg$silentFails === 0) {
            peg$fail(peg$c38);
          }
        }

        if (s1 !== peg$FAILED) {
          if (input.charCodeAt(peg$currPos) === 32) {
            s2 = peg$c39;
            peg$currPos++;
          } else {
            s2 = peg$FAILED;

            if (peg$silentFails === 0) {
              peg$fail(peg$c40);
            }
          }

          if (s2 === peg$FAILED) {
            s2 = null;
          }

          if (s2 !== peg$FAILED) {
            s1 = peg$c41();
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }

        if (s0 === peg$FAILED) {
          s0 = peg$currPos;

          if (input.charCodeAt(peg$currPos) === 61) {
            s1 = peg$c30;
            peg$currPos++;
          } else {
            s1 = peg$FAILED;

            if (peg$silentFails === 0) {
              peg$fail(peg$c31);
            }
          }

          if (s1 !== peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 32) {
              s2 = peg$c39;
              peg$currPos++;
            } else {
              s2 = peg$FAILED;

              if (peg$silentFails === 0) {
                peg$fail(peg$c40);
              }
            }

            if (s2 === peg$FAILED) {
              s2 = null;
            }

            if (s2 !== peg$FAILED) {
              s1 = peg$c42();
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        }

        return s0;
      }

      function peg$parse_10inlineComment() {
        var s0, s1, s2, s3;
        s0 = peg$currPos;
        s1 = peg$parse_1start();

        if (s1 !== peg$FAILED) {
          if (input.charCodeAt(peg$currPos) === 47) {
            s2 = peg$c27;
            peg$currPos++;
          } else {
            s2 = peg$FAILED;

            if (peg$silentFails === 0) {
              peg$fail(peg$c28);
            }
          }

          if (s2 !== peg$FAILED) {
            s3 = peg$parse_6lineContent();

            if (s3 !== peg$FAILED) {
              s1 = [s1, s2, s3];
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }

        return s0;
      }

      function peg$parse_11nonMustache() {
        var s0, s1, s2, s3, s4;
        peg$silentFails++;
        s0 = peg$currPos;
        s1 = peg$currPos;
        peg$silentFails++;

        if (input.charCodeAt(peg$currPos) === 123) {
          s2 = peg$c44;
          peg$currPos++;
        } else {
          s2 = peg$FAILED;

          if (peg$silentFails === 0) {
            peg$fail(peg$c45);
          }
        }

        peg$silentFails--;

        if (s2 === peg$FAILED) {
          s1 = void 0;
        } else {
          peg$currPos = s1;
          s1 = peg$FAILED;
        }

        if (s1 !== peg$FAILED) {
          s2 = peg$currPos;
          s3 = [];

          if (peg$c46.test(input.charAt(peg$currPos))) {
            s4 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s4 = peg$FAILED;

            if (peg$silentFails === 0) {
              peg$fail(peg$c47);
            }
          }

          while (s4 !== peg$FAILED) {
            s3.push(s4);

            if (peg$c46.test(input.charAt(peg$currPos))) {
              s4 = input.charAt(peg$currPos);
              peg$currPos++;
            } else {
              s4 = peg$FAILED;

              if (peg$silentFails === 0) {
                peg$fail(peg$c47);
              }
            }
          }

          if (s3 !== peg$FAILED) {
            s2 = input.substring(s2, peg$currPos);
          } else {
            s2 = s3;
          }

          if (s2 !== peg$FAILED) {
            s1 = peg$c48(s2);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }

        peg$silentFails--;

        if (s0 === peg$FAILED) {
          s1 = peg$FAILED;

          if (peg$silentFails === 0) {
            peg$fail(peg$c43);
          }
        }

        return s0;
      }

      function peg$parse_12rawMustache() {
        var s0;
        s0 = peg$parse_12rawMustacheUnescaped();

        if (s0 === peg$FAILED) {
          s0 = peg$parse_12rawMustacheEscaped();
        }

        return s0;
      }

      function peg$parse_12rawMustacheUnescaped() {
        var s0, s1, s2, s3, s4, s5;
        s0 = peg$currPos;
        s1 = peg$parse_12tripleOpen();

        if (s1 !== peg$FAILED) {
          s2 = peg$parse_1start();

          if (s2 !== peg$FAILED) {
            s3 = peg$parse_11nonMustache();

            if (s3 !== peg$FAILED) {
              s4 = peg$parse_1start();

              if (s4 !== peg$FAILED) {
                s5 = peg$parse_12tripleClose();

                if (s5 !== peg$FAILED) {
                  s1 = peg$c49(s3);
                  s0 = s1;
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }

        return s0;
      }

      function peg$parse_12rawMustacheEscaped() {
        var s0, s1, s2, s3, s4, s5;
        s0 = peg$currPos;
        s1 = peg$parse_12doubleOpen();

        if (s1 !== peg$FAILED) {
          s2 = peg$parse_1start();

          if (s2 !== peg$FAILED) {
            s3 = peg$parse_11nonMustache();

            if (s3 !== peg$FAILED) {
              s4 = peg$parse_1start();

              if (s4 !== peg$FAILED) {
                s5 = peg$parse_12doubleClose();

                if (s5 !== peg$FAILED) {
                  s1 = peg$c50(s3);
                  s0 = s1;
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }

        if (s0 === peg$FAILED) {
          s0 = peg$currPos;
          s1 = peg$parse_12hashStacheOpen();

          if (s1 !== peg$FAILED) {
            s2 = peg$parse_1start();

            if (s2 !== peg$FAILED) {
              s3 = peg$parse_11nonMustache();

              if (s3 !== peg$FAILED) {
                s4 = peg$parse_1start();

                if (s4 !== peg$FAILED) {
                  s5 = peg$parse_12hashStacheClose();

                  if (s5 !== peg$FAILED) {
                    s1 = peg$c50(s3);
                    s0 = s1;
                  } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        }

        return s0;
      }

      function peg$parse_12doubleOpen() {
        var s0;
        peg$silentFails++;

        if (input.substr(peg$currPos, 2) === peg$c52) {
          s0 = peg$c52;
          peg$currPos += 2;
        } else {
          s0 = peg$FAILED;

          if (peg$silentFails === 0) {
            peg$fail(peg$c53);
          }
        }

        peg$silentFails--;

        if (s0 === peg$FAILED) {

          if (peg$silentFails === 0) {
            peg$fail(peg$c51);
          }
        }

        return s0;
      }

      function peg$parse_12tripleOpen() {
        var s0;
        peg$silentFails++;

        if (input.substr(peg$currPos, 3) === peg$c55) {
          s0 = peg$c55;
          peg$currPos += 3;
        } else {
          s0 = peg$FAILED;

          if (peg$silentFails === 0) {
            peg$fail(peg$c56);
          }
        }

        peg$silentFails--;

        if (s0 === peg$FAILED) {

          if (peg$silentFails === 0) {
            peg$fail(peg$c54);
          }
        }

        return s0;
      }

      function peg$parse_12doubleClose() {
        var s0;
        peg$silentFails++;

        if (input.substr(peg$currPos, 2) === peg$c58) {
          s0 = peg$c58;
          peg$currPos += 2;
        } else {
          s0 = peg$FAILED;

          if (peg$silentFails === 0) {
            peg$fail(peg$c59);
          }
        }

        peg$silentFails--;

        if (s0 === peg$FAILED) {

          if (peg$silentFails === 0) {
            peg$fail(peg$c57);
          }
        }

        return s0;
      }

      function peg$parse_12tripleClose() {
        var s0;
        peg$silentFails++;

        if (input.substr(peg$currPos, 3) === peg$c61) {
          s0 = peg$c61;
          peg$currPos += 3;
        } else {
          s0 = peg$FAILED;

          if (peg$silentFails === 0) {
            peg$fail(peg$c62);
          }
        }

        peg$silentFails--;

        if (s0 === peg$FAILED) {

          if (peg$silentFails === 0) {
            peg$fail(peg$c60);
          }
        }

        return s0;
      }

      function peg$parse_12hashStacheOpen() {
        var s0;
        peg$silentFails++;

        if (input.substr(peg$currPos, 2) === peg$c64) {
          s0 = peg$c64;
          peg$currPos += 2;
        } else {
          s0 = peg$FAILED;

          if (peg$silentFails === 0) {
            peg$fail(peg$c65);
          }
        }

        peg$silentFails--;

        if (s0 === peg$FAILED) {

          if (peg$silentFails === 0) {
            peg$fail(peg$c63);
          }
        }

        return s0;
      }

      function peg$parse_12hashStacheClose() {
        var s0;
        peg$silentFails++;

        if (input.charCodeAt(peg$currPos) === 125) {
          s0 = peg$c67;
          peg$currPos++;
        } else {
          s0 = peg$FAILED;

          if (peg$silentFails === 0) {
            peg$fail(peg$c68);
          }
        }

        peg$silentFails--;

        if (s0 === peg$FAILED) {

          if (peg$silentFails === 0) {
            peg$fail(peg$c66);
          }
        }

        return s0;
      }

      function peg$parse_13nonMustacheUnit() {
        var s0;
        s0 = peg$parse_13tripleOpen();

        if (s0 === peg$FAILED) {
          s0 = peg$parse_13doubleOpen();

          if (s0 === peg$FAILED) {
            s0 = peg$parse_13hashStacheOpen();

            if (s0 === peg$FAILED) {
              s0 = peg$parse_3anyDedent();

              if (s0 === peg$FAILED) {
                s0 = peg$parse_13TERM();
              }
            }
          }
        }

        return s0;
      }

      function peg$parse_13doubleOpen() {
        var s0;
        peg$silentFails++;

        if (input.substr(peg$currPos, 2) === peg$c52) {
          s0 = peg$c52;
          peg$currPos += 2;
        } else {
          s0 = peg$FAILED;

          if (peg$silentFails === 0) {
            peg$fail(peg$c53);
          }
        }

        peg$silentFails--;

        if (s0 === peg$FAILED) {

          if (peg$silentFails === 0) {
            peg$fail(peg$c70);
          }
        }

        return s0;
      }

      function peg$parse_13tripleOpen() {
        var s0;
        peg$silentFails++;

        if (input.substr(peg$currPos, 3) === peg$c55) {
          s0 = peg$c55;
          peg$currPos += 3;
        } else {
          s0 = peg$FAILED;

          if (peg$silentFails === 0) {
            peg$fail(peg$c56);
          }
        }

        peg$silentFails--;

        if (s0 === peg$FAILED) {

          if (peg$silentFails === 0) {
            peg$fail(peg$c71);
          }
        }

        return s0;
      }

      function peg$parse_13hashStacheOpen() {
        var s0;
        peg$silentFails++;

        if (input.substr(peg$currPos, 2) === peg$c64) {
          s0 = peg$c64;
          peg$currPos += 2;
        } else {
          s0 = peg$FAILED;

          if (peg$silentFails === 0) {
            peg$fail(peg$c65);
          }
        }

        peg$silentFails--;

        if (s0 === peg$FAILED) {

          if (peg$silentFails === 0) {
            peg$fail(peg$c72);
          }
        }

        return s0;
      }

      function peg$parse_13TERM() {
        var s0, s1, s2, s3, s4;
        peg$silentFails++;
        s0 = peg$currPos;

        if (input.charCodeAt(peg$currPos) === 13) {
          s1 = peg$c5;
          peg$currPos++;
        } else {
          s1 = peg$FAILED;

          if (peg$silentFails === 0) {
            peg$fail(peg$c6);
          }
        }

        if (s1 === peg$FAILED) {
          s1 = null;
        }

        if (s1 !== peg$FAILED) {
          if (input.length > peg$currPos) {
            s2 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s2 = peg$FAILED;

            if (peg$silentFails === 0) {
              peg$fail(peg$c7);
            }
          }

          if (s2 !== peg$FAILED) {
            s3 = peg$c8(s2);

            if (s3) {
              s3 = void 0;
            } else {
              s3 = peg$FAILED;
            }

            if (s3 !== peg$FAILED) {
              if (input.charCodeAt(peg$currPos) === 10) {
                s4 = peg$c9;
                peg$currPos++;
              } else {
                s4 = peg$FAILED;

                if (peg$silentFails === 0) {
                  peg$fail(peg$c10);
                }
              }

              if (s4 !== peg$FAILED) {
                s1 = peg$c11(s2);
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }

        peg$silentFails--;

        if (s0 === peg$FAILED) {
          s1 = peg$FAILED;

          if (peg$silentFails === 0) {
            peg$fail(peg$c73);
          }
        }

        return s0;
      }

      function peg$parse_14textNodes() {
        var s0, s1, s2, s3, s4, s5;
        s0 = peg$currPos;
        s1 = peg$parse_14preMustacheText();

        if (s1 === peg$FAILED) {
          s1 = null;
        }

        if (s1 !== peg$FAILED) {
          s2 = [];
          s3 = peg$currPos;
          s4 = peg$parse_12rawMustache();

          if (s4 !== peg$FAILED) {
            s5 = peg$parse_14preMustacheText();

            if (s5 === peg$FAILED) {
              s5 = null;
            }

            if (s5 !== peg$FAILED) {
              s4 = [s4, s5];
              s3 = s4;
            } else {
              peg$currPos = s3;
              s3 = peg$FAILED;
            }
          } else {
            peg$currPos = s3;
            s3 = peg$FAILED;
          }

          while (s3 !== peg$FAILED) {
            s2.push(s3);
            s3 = peg$currPos;
            s4 = peg$parse_12rawMustache();

            if (s4 !== peg$FAILED) {
              s5 = peg$parse_14preMustacheText();

              if (s5 === peg$FAILED) {
                s5 = null;
              }

              if (s5 !== peg$FAILED) {
                s4 = [s4, s5];
                s3 = s4;
              } else {
                peg$currPos = s3;
                s3 = peg$FAILED;
              }
            } else {
              peg$currPos = s3;
              s3 = peg$FAILED;
            }
          }

          if (s2 !== peg$FAILED) {
            s3 = peg$parse_14TERM();

            if (s3 !== peg$FAILED) {
              s1 = peg$c74(s1, s2);
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }

        return s0;
      }

      function peg$parse_14preMustacheText() {
        var s0, s1, s2;
        s0 = peg$currPos;
        s1 = [];
        s2 = peg$parse_14preMustacheUnit();

        if (s2 !== peg$FAILED) {
          while (s2 !== peg$FAILED) {
            s1.push(s2);
            s2 = peg$parse_14preMustacheUnit();
          }
        } else {
          s1 = peg$FAILED;
        }

        if (s1 !== peg$FAILED) {
          s0 = input.substring(s0, peg$currPos);
        } else {
          s0 = s1;
        }

        return s0;
      }

      function peg$parse_14preMustacheUnit() {
        var s0, s1, s2;
        s0 = peg$currPos;
        s1 = peg$currPos;
        peg$silentFails++;
        s2 = peg$parse_13nonMustacheUnit();
        peg$silentFails--;

        if (s2 === peg$FAILED) {
          s1 = void 0;
        } else {
          peg$currPos = s1;
          s1 = peg$FAILED;
        }

        if (s1 !== peg$FAILED) {
          if (input.length > peg$currPos) {
            s2 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s2 = peg$FAILED;

            if (peg$silentFails === 0) {
              peg$fail(peg$c7);
            }
          }

          if (s2 !== peg$FAILED) {
            s1 = peg$c22(s2);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }

        return s0;
      }

      function peg$parse_14TERM() {
        var s0, s1, s2, s3, s4;
        peg$silentFails++;
        s0 = peg$currPos;

        if (input.charCodeAt(peg$currPos) === 13) {
          s1 = peg$c5;
          peg$currPos++;
        } else {
          s1 = peg$FAILED;

          if (peg$silentFails === 0) {
            peg$fail(peg$c6);
          }
        }

        if (s1 === peg$FAILED) {
          s1 = null;
        }

        if (s1 !== peg$FAILED) {
          if (input.length > peg$currPos) {
            s2 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s2 = peg$FAILED;

            if (peg$silentFails === 0) {
              peg$fail(peg$c7);
            }
          }

          if (s2 !== peg$FAILED) {
            s3 = peg$c8(s2);

            if (s3) {
              s3 = void 0;
            } else {
              s3 = peg$FAILED;
            }

            if (s3 !== peg$FAILED) {
              if (input.charCodeAt(peg$currPos) === 10) {
                s4 = peg$c9;
                peg$currPos++;
              } else {
                s4 = peg$FAILED;

                if (peg$silentFails === 0) {
                  peg$fail(peg$c10);
                }
              }

              if (s4 !== peg$FAILED) {
                s1 = peg$c11(s2);
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }

        peg$silentFails--;

        if (s0 === peg$FAILED) {
          s1 = peg$FAILED;

          if (peg$silentFails === 0) {
            peg$fail(peg$c75);
          }
        }

        return s0;
      }

      function peg$parse_15whitespaceableTextNodes() {
        var s0, s1, s2, s3, s4;
        s0 = peg$currPos;
        s1 = peg$parse_5indentation();

        if (s1 !== peg$FAILED) {
          s2 = peg$parse_14textNodes();

          if (s2 !== peg$FAILED) {
            s3 = [];
            s4 = peg$parse_15whitespaceableTextNodes();

            while (s4 !== peg$FAILED) {
              s3.push(s4);
              s4 = peg$parse_15whitespaceableTextNodes();
            }

            if (s3 !== peg$FAILED) {
              s4 = peg$parse_3anyDedent();

              if (s4 !== peg$FAILED) {
                s1 = peg$c76(s2);
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }

        if (s0 === peg$FAILED) {
          s0 = peg$parse_14textNodes();
        }

        return s0;
      }

      function peg$parse_16textLine() {
        var s0, s1, s2, s3, s4, s5, s6;
        s0 = peg$currPos;
        s1 = peg$parse_16textLineStart();

        if (s1 !== peg$FAILED) {
          s2 = peg$parse_14textNodes();

          if (s2 !== peg$FAILED) {
            s3 = peg$currPos;
            s4 = peg$parse_5indentation();

            if (s4 !== peg$FAILED) {
              s5 = [];
              s6 = peg$parse_15whitespaceableTextNodes();

              while (s6 !== peg$FAILED) {
                s5.push(s6);
                s6 = peg$parse_15whitespaceableTextNodes();
              }

              if (s5 !== peg$FAILED) {
                s6 = peg$parse_16DEDENT();

                if (s6 !== peg$FAILED) {
                  s4 = peg$c77(s1, s2, s5);
                  s3 = s4;
                } else {
                  peg$currPos = s3;
                  s3 = peg$FAILED;
                }
              } else {
                peg$currPos = s3;
                s3 = peg$FAILED;
              }
            } else {
              peg$currPos = s3;
              s3 = peg$FAILED;
            }

            if (s3 === peg$FAILED) {
              s3 = null;
            }

            if (s3 !== peg$FAILED) {
              s1 = peg$c78(s1, s2, s3);
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }

        return s0;
      }

      function peg$parse_16textLineStart() {
        var s0, s1, s2;
        s0 = peg$currPos;

        if (peg$c79.test(input.charAt(peg$currPos))) {
          s1 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s1 = peg$FAILED;

          if (peg$silentFails === 0) {
            peg$fail(peg$c80);
          }
        }

        if (s1 !== peg$FAILED) {
          if (input.charCodeAt(peg$currPos) === 32) {
            s2 = peg$c39;
            peg$currPos++;
          } else {
            s2 = peg$FAILED;

            if (peg$silentFails === 0) {
              peg$fail(peg$c40);
            }
          }

          if (s2 === peg$FAILED) {
            s2 = null;
          }

          if (s2 !== peg$FAILED) {
            s1 = peg$c19(s1);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }

        if (s0 === peg$FAILED) {
          s0 = peg$currPos;
          s1 = peg$currPos;
          peg$silentFails++;

          if (input.charCodeAt(peg$currPos) === 60) {
            s2 = peg$c81;
            peg$currPos++;
          } else {
            s2 = peg$FAILED;

            if (peg$silentFails === 0) {
              peg$fail(peg$c82);
            }
          }

          peg$silentFails--;

          if (s2 !== peg$FAILED) {
            peg$currPos = s1;
            s1 = void 0;
          } else {
            s1 = peg$FAILED;
          }

          if (s1 !== peg$FAILED) {
            s1 = peg$c83();
          }

          s0 = s1;
        }

        return s0;
      }

      function peg$parse_16DEDENT() {
        var s0, s1, s2;
        peg$silentFails++;
        s0 = peg$currPos;

        if (input.length > peg$currPos) {
          s1 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s1 = peg$FAILED;

          if (peg$silentFails === 0) {
            peg$fail(peg$c7);
          }
        }

        if (s1 !== peg$FAILED) {
          s2 = peg$c14(s1);

          if (s2) {
            s2 = void 0;
          } else {
            s2 = peg$FAILED;
          }

          if (s2 !== peg$FAILED) {
            s1 = peg$c15(s1);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }

        peg$silentFails--;

        if (s0 === peg$FAILED) {
          s1 = peg$FAILED;

          if (peg$silentFails === 0) {
            peg$fail(peg$c84);
          }
        }

        return s0;
      }

      function peg$parse_17pathIdNode() {
        var s0, s1;
        s0 = peg$currPos;
        s1 = peg$parse_17path();

        if (s1 !== peg$FAILED) {
          s1 = peg$c85(s1);
        }

        s0 = s1;
        return s0;
      }

      function peg$parse_17path() {
        var s0, s1, s2, s3, s4, s5;
        s0 = peg$currPos;
        s1 = peg$parse_17pathIdent();

        if (s1 !== peg$FAILED) {
          s2 = [];
          s3 = peg$currPos;
          s4 = peg$parse_17separator();

          if (s4 !== peg$FAILED) {
            s5 = peg$parse_17pathIdent();

            if (s5 !== peg$FAILED) {
              s4 = peg$c86(s1, s4, s5);
              s3 = s4;
            } else {
              peg$currPos = s3;
              s3 = peg$FAILED;
            }
          } else {
            peg$currPos = s3;
            s3 = peg$FAILED;
          }

          while (s3 !== peg$FAILED) {
            s2.push(s3);
            s3 = peg$currPos;
            s4 = peg$parse_17separator();

            if (s4 !== peg$FAILED) {
              s5 = peg$parse_17pathIdent();

              if (s5 !== peg$FAILED) {
                s4 = peg$c86(s1, s4, s5);
                s3 = s4;
              } else {
                peg$currPos = s3;
                s3 = peg$FAILED;
              }
            } else {
              peg$currPos = s3;
              s3 = peg$FAILED;
            }
          }

          if (s2 !== peg$FAILED) {
            s1 = peg$c87(s1, s2);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }

        return s0;
      }

      function peg$parse_17pathIdent() {
        var s0, s1, s2, s3, s4;
        peg$silentFails++;

        if (input.substr(peg$currPos, 2) === peg$c89) {
          s0 = peg$c89;
          peg$currPos += 2;
        } else {
          s0 = peg$FAILED;

          if (peg$silentFails === 0) {
            peg$fail(peg$c90);
          }
        }

        if (s0 === peg$FAILED) {
          if (input.charCodeAt(peg$currPos) === 46) {
            s0 = peg$c91;
            peg$currPos++;
          } else {
            s0 = peg$FAILED;

            if (peg$silentFails === 0) {
              peg$fail(peg$c92);
            }
          }

          if (s0 === peg$FAILED) {
            s0 = peg$currPos;
            s1 = peg$currPos;
            s2 = [];

            if (peg$c93.test(input.charAt(peg$currPos))) {
              s3 = input.charAt(peg$currPos);
              peg$currPos++;
            } else {
              s3 = peg$FAILED;

              if (peg$silentFails === 0) {
                peg$fail(peg$c94);
              }
            }

            if (s3 !== peg$FAILED) {
              while (s3 !== peg$FAILED) {
                s2.push(s3);

                if (peg$c93.test(input.charAt(peg$currPos))) {
                  s3 = input.charAt(peg$currPos);
                  peg$currPos++;
                } else {
                  s3 = peg$FAILED;

                  if (peg$silentFails === 0) {
                    peg$fail(peg$c94);
                  }
                }
              }
            } else {
              s2 = peg$FAILED;
            }

            if (s2 !== peg$FAILED) {
              s1 = input.substring(s1, peg$currPos);
            } else {
              s1 = s2;
            }

            if (s1 !== peg$FAILED) {
              s2 = peg$currPos;
              peg$silentFails++;

              if (input.charCodeAt(peg$currPos) === 61) {
                s3 = peg$c30;
                peg$currPos++;
              } else {
                s3 = peg$FAILED;

                if (peg$silentFails === 0) {
                  peg$fail(peg$c31);
                }
              }

              peg$silentFails--;

              if (s3 === peg$FAILED) {
                s2 = void 0;
              } else {
                peg$currPos = s2;
                s2 = peg$FAILED;
              }

              if (s2 !== peg$FAILED) {
                s1 = peg$c19(s1);
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }

            if (s0 === peg$FAILED) {
              s0 = peg$currPos;

              if (input.charCodeAt(peg$currPos) === 91) {
                s1 = peg$c95;
                peg$currPos++;
              } else {
                s1 = peg$FAILED;

                if (peg$silentFails === 0) {
                  peg$fail(peg$c96);
                }
              }

              if (s1 !== peg$FAILED) {
                s2 = peg$currPos;
                s3 = [];

                if (peg$c97.test(input.charAt(peg$currPos))) {
                  s4 = input.charAt(peg$currPos);
                  peg$currPos++;
                } else {
                  s4 = peg$FAILED;

                  if (peg$silentFails === 0) {
                    peg$fail(peg$c98);
                  }
                }

                while (s4 !== peg$FAILED) {
                  s3.push(s4);

                  if (peg$c97.test(input.charAt(peg$currPos))) {
                    s4 = input.charAt(peg$currPos);
                    peg$currPos++;
                  } else {
                    s4 = peg$FAILED;

                    if (peg$silentFails === 0) {
                      peg$fail(peg$c98);
                    }
                  }
                }

                if (s3 !== peg$FAILED) {
                  s2 = input.substring(s2, peg$currPos);
                } else {
                  s2 = s3;
                }

                if (s2 !== peg$FAILED) {
                  if (input.charCodeAt(peg$currPos) === 93) {
                    s3 = peg$c99;
                    peg$currPos++;
                  } else {
                    s3 = peg$FAILED;

                    if (peg$silentFails === 0) {
                      peg$fail(peg$c100);
                    }
                  }

                  if (s3 !== peg$FAILED) {
                    s1 = peg$c101(s2);
                    s0 = s1;
                  } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            }
          }
        }

        peg$silentFails--;

        if (s0 === peg$FAILED) {
          s1 = peg$FAILED;

          if (peg$silentFails === 0) {
            peg$fail(peg$c88);
          }
        }

        return s0;
      }

      function peg$parse_17separator() {
        var s0;
        peg$silentFails++;

        if (peg$c103.test(input.charAt(peg$currPos))) {
          s0 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s0 = peg$FAILED;

          if (peg$silentFails === 0) {
            peg$fail(peg$c104);
          }
        }

        peg$silentFails--;

        if (s0 === peg$FAILED) {

          if (peg$silentFails === 0) {
            peg$fail(peg$c102);
          }
        }

        return s0;
      }

      function peg$parse_18nonSeparatorColon() {
        var s0, s1, s2, s3;
        s0 = peg$currPos;

        if (input.charCodeAt(peg$currPos) === 58) {
          s1 = peg$c105;
          peg$currPos++;
        } else {
          s1 = peg$FAILED;

          if (peg$silentFails === 0) {
            peg$fail(peg$c106);
          }
        }

        if (s1 !== peg$FAILED) {
          s2 = peg$currPos;
          peg$silentFails++;

          if (input.charCodeAt(peg$currPos) === 32) {
            s3 = peg$c39;
            peg$currPos++;
          } else {
            s3 = peg$FAILED;

            if (peg$silentFails === 0) {
              peg$fail(peg$c40);
            }
          }

          peg$silentFails--;

          if (s3 === peg$FAILED) {
            s2 = void 0;
          } else {
            peg$currPos = s2;
            s2 = peg$FAILED;
          }

          if (s2 !== peg$FAILED) {
            s1 = peg$c22(s1);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }

        return s0;
      }

      function peg$parse_19tagString() {
        var s0, s1, s2;
        peg$silentFails++;
        s0 = peg$currPos;
        s1 = [];
        s2 = peg$parse_19tagChar();

        if (s2 !== peg$FAILED) {
          while (s2 !== peg$FAILED) {
            s1.push(s2);
            s2 = peg$parse_19tagChar();
          }
        } else {
          s1 = peg$FAILED;
        }

        if (s1 !== peg$FAILED) {
          s0 = input.substring(s0, peg$currPos);
        } else {
          s0 = s1;
        }

        peg$silentFails--;

        if (s0 === peg$FAILED) {
          s1 = peg$FAILED;

          if (peg$silentFails === 0) {
            peg$fail(peg$c107);
          }
        }

        return s0;
      }

      function peg$parse_19tagChar() {
        var s0;

        if (peg$c108.test(input.charAt(peg$currPos))) {
          s0 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s0 = peg$FAILED;

          if (peg$silentFails === 0) {
            peg$fail(peg$c109);
          }
        }

        if (s0 === peg$FAILED) {
          s0 = peg$parse_18nonSeparatorColon();

          if (s0 === peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 64) {
              s0 = peg$c110;
              peg$currPos++;
            } else {
              s0 = peg$FAILED;

              if (peg$silentFails === 0) {
                peg$fail(peg$c111);
              }
            }
          }
        }

        return s0;
      }

      function peg$parse_20stringWithQuotes() {
        var s0, s1;
        s0 = peg$currPos;
        s1 = peg$parse_20singleQuoteString();

        if (s1 === peg$FAILED) {
          s1 = peg$parse_20doubleQuoteString();
        }

        if (s1 !== peg$FAILED) {
          s1 = peg$c112(s1);
        }

        s0 = s1;
        return s0;
      }

      function peg$parse_20singleQuoteString() {
        var s0, s1, s2, s3;
        s0 = peg$currPos;

        if (input.charCodeAt(peg$currPos) === 39) {
          s1 = peg$c113;
          peg$currPos++;
        } else {
          s1 = peg$FAILED;

          if (peg$silentFails === 0) {
            peg$fail(peg$c114);
          }
        }

        if (s1 !== peg$FAILED) {
          s2 = peg$parse_20hashSingleQuoteStringValue();

          if (s2 !== peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 39) {
              s3 = peg$c113;
              peg$currPos++;
            } else {
              s3 = peg$FAILED;

              if (peg$silentFails === 0) {
                peg$fail(peg$c114);
              }
            }

            if (s3 !== peg$FAILED) {
              s1 = [s1, s2, s3];
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }

        return s0;
      }

      function peg$parse_20doubleQuoteString() {
        var s0, s1, s2, s3;
        s0 = peg$currPos;

        if (input.charCodeAt(peg$currPos) === 34) {
          s1 = peg$c115;
          peg$currPos++;
        } else {
          s1 = peg$FAILED;

          if (peg$silentFails === 0) {
            peg$fail(peg$c116);
          }
        }

        if (s1 !== peg$FAILED) {
          s2 = peg$parse_20hashDoubleQuoteStringValue();

          if (s2 !== peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 34) {
              s3 = peg$c115;
              peg$currPos++;
            } else {
              s3 = peg$FAILED;

              if (peg$silentFails === 0) {
                peg$fail(peg$c116);
              }
            }

            if (s3 !== peg$FAILED) {
              s1 = [s1, s2, s3];
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }

        return s0;
      }

      function peg$parse_20hashDoubleQuoteStringValue() {
        var s0, s1, s2, s3, s4;
        peg$silentFails++;
        s0 = peg$currPos;
        s1 = [];
        s2 = peg$currPos;
        s3 = peg$currPos;
        peg$silentFails++;
        s4 = peg$parse_20TERM();
        peg$silentFails--;

        if (s4 === peg$FAILED) {
          s3 = void 0;
        } else {
          peg$currPos = s3;
          s3 = peg$FAILED;
        }

        if (s3 !== peg$FAILED) {
          if (peg$c120.test(input.charAt(peg$currPos))) {
            s4 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s4 = peg$FAILED;

            if (peg$silentFails === 0) {
              peg$fail(peg$c121);
            }
          }

          if (s4 !== peg$FAILED) {
            s3 = [s3, s4];
            s2 = s3;
          } else {
            peg$currPos = s2;
            s2 = peg$FAILED;
          }
        } else {
          peg$currPos = s2;
          s2 = peg$FAILED;
        }

        while (s2 !== peg$FAILED) {
          s1.push(s2);
          s2 = peg$currPos;
          s3 = peg$currPos;
          peg$silentFails++;
          s4 = peg$parse_20TERM();
          peg$silentFails--;

          if (s4 === peg$FAILED) {
            s3 = void 0;
          } else {
            peg$currPos = s3;
            s3 = peg$FAILED;
          }

          if (s3 !== peg$FAILED) {
            if (peg$c120.test(input.charAt(peg$currPos))) {
              s4 = input.charAt(peg$currPos);
              peg$currPos++;
            } else {
              s4 = peg$FAILED;

              if (peg$silentFails === 0) {
                peg$fail(peg$c121);
              }
            }

            if (s4 !== peg$FAILED) {
              s3 = [s3, s4];
              s2 = s3;
            } else {
              peg$currPos = s2;
              s2 = peg$FAILED;
            }
          } else {
            peg$currPos = s2;
            s2 = peg$FAILED;
          }
        }

        if (s1 !== peg$FAILED) {
          s0 = input.substring(s0, peg$currPos);
        } else {
          s0 = s1;
        }

        peg$silentFails--;

        if (s0 === peg$FAILED) {
          s1 = peg$FAILED;

          if (peg$silentFails === 0) {
            peg$fail(peg$c119);
          }
        }

        return s0;
      }

      function peg$parse_20hashSingleQuoteStringValue() {
        var s0, s1, s2, s3, s4;
        peg$silentFails++;
        s0 = peg$currPos;
        s1 = [];
        s2 = peg$currPos;
        s3 = peg$currPos;
        peg$silentFails++;
        s4 = peg$parse_20TERM();
        peg$silentFails--;

        if (s4 === peg$FAILED) {
          s3 = void 0;
        } else {
          peg$currPos = s3;
          s3 = peg$FAILED;
        }

        if (s3 !== peg$FAILED) {
          if (peg$c122.test(input.charAt(peg$currPos))) {
            s4 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s4 = peg$FAILED;

            if (peg$silentFails === 0) {
              peg$fail(peg$c123);
            }
          }

          if (s4 !== peg$FAILED) {
            s3 = [s3, s4];
            s2 = s3;
          } else {
            peg$currPos = s2;
            s2 = peg$FAILED;
          }
        } else {
          peg$currPos = s2;
          s2 = peg$FAILED;
        }

        while (s2 !== peg$FAILED) {
          s1.push(s2);
          s2 = peg$currPos;
          s3 = peg$currPos;
          peg$silentFails++;
          s4 = peg$parse_20TERM();
          peg$silentFails--;

          if (s4 === peg$FAILED) {
            s3 = void 0;
          } else {
            peg$currPos = s3;
            s3 = peg$FAILED;
          }

          if (s3 !== peg$FAILED) {
            if (peg$c122.test(input.charAt(peg$currPos))) {
              s4 = input.charAt(peg$currPos);
              peg$currPos++;
            } else {
              s4 = peg$FAILED;

              if (peg$silentFails === 0) {
                peg$fail(peg$c123);
              }
            }

            if (s4 !== peg$FAILED) {
              s3 = [s3, s4];
              s2 = s3;
            } else {
              peg$currPos = s2;
              s2 = peg$FAILED;
            }
          } else {
            peg$currPos = s2;
            s2 = peg$FAILED;
          }
        }

        if (s1 !== peg$FAILED) {
          s0 = input.substring(s0, peg$currPos);
        } else {
          s0 = s1;
        }

        peg$silentFails--;

        if (s0 === peg$FAILED) {
          s1 = peg$FAILED;

          if (peg$silentFails === 0) {
            peg$fail(peg$c119);
          }
        }

        return s0;
      }

      function peg$parse_20TERM() {
        var s0, s1, s2, s3, s4;
        peg$silentFails++;
        s0 = peg$currPos;

        if (input.charCodeAt(peg$currPos) === 13) {
          s1 = peg$c5;
          peg$currPos++;
        } else {
          s1 = peg$FAILED;

          if (peg$silentFails === 0) {
            peg$fail(peg$c6);
          }
        }

        if (s1 === peg$FAILED) {
          s1 = null;
        }

        if (s1 !== peg$FAILED) {
          if (input.length > peg$currPos) {
            s2 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s2 = peg$FAILED;

            if (peg$silentFails === 0) {
              peg$fail(peg$c7);
            }
          }

          if (s2 !== peg$FAILED) {
            s3 = peg$c8(s2);

            if (s3) {
              s3 = void 0;
            } else {
              s3 = peg$FAILED;
            }

            if (s3 !== peg$FAILED) {
              if (input.charCodeAt(peg$currPos) === 10) {
                s4 = peg$c9;
                peg$currPos++;
              } else {
                s4 = peg$FAILED;

                if (peg$silentFails === 0) {
                  peg$fail(peg$c10);
                }
              }

              if (s4 !== peg$FAILED) {
                s1 = peg$c11(s2);
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }

        peg$silentFails--;

        if (s0 === peg$FAILED) {
          s1 = peg$FAILED;

          if (peg$silentFails === 0) {
            peg$fail(peg$c124);
          }
        }

        return s0;
      }

      function peg$parse_21singleMustacheValue() {
        var s0, s1, s2, s3, s4, s5;
        s0 = peg$currPos;

        if (input.charCodeAt(peg$currPos) === 123) {
          s1 = peg$c44;
          peg$currPos++;
        } else {
          s1 = peg$FAILED;

          if (peg$silentFails === 0) {
            peg$fail(peg$c45);
          }
        }

        if (s1 !== peg$FAILED) {
          s2 = peg$parse_1start();

          if (s2 !== peg$FAILED) {
            s3 = peg$parse_11nonMustache();

            if (s3 !== peg$FAILED) {
              s4 = peg$parse_1start();

              if (s4 !== peg$FAILED) {
                s5 = peg$parse_21mustacheClose();

                if (s5 !== peg$FAILED) {
                  s1 = peg$c125(s3);
                  s0 = s1;
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }

        return s0;
      }

      function peg$parse_21mustacheClose() {
        var s0;
        peg$silentFails++;

        if (input.charCodeAt(peg$currPos) === 125) {
          s0 = peg$c67;
          peg$currPos++;
        } else {
          s0 = peg$FAILED;

          if (peg$silentFails === 0) {
            peg$fail(peg$c68);
          }
        }

        peg$silentFails--;

        if (s0 === peg$FAILED) {

          if (peg$silentFails === 0) {
            peg$fail(peg$c126);
          }
        }

        return s0;
      }

      function peg$parse_22actionAttribute() {
        var s0, s1, s2, s3;
        s0 = peg$currPos;
        s1 = peg$parse_22knownAliasEvent();

        if (s1 !== peg$FAILED) {
          if (input.charCodeAt(peg$currPos) === 61) {
            s2 = peg$c30;
            peg$currPos++;
          } else {
            s2 = peg$FAILED;

            if (peg$silentFails === 0) {
              peg$fail(peg$c31);
            }
          }

          if (s2 !== peg$FAILED) {
            s3 = peg$parse_22actionValue();

            if (s3 !== peg$FAILED) {
              s1 = peg$c127(s1, s3);
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }

        return s0;
      }

      function peg$parse_22knownAliasEvent() {
        var s0, s1, s2;
        peg$silentFails++;
        s0 = peg$currPos;
        s1 = peg$parse_19tagString();

        if (s1 !== peg$FAILED) {
          s2 = peg$c129(s1);

          if (s2) {
            s2 = void 0;
          } else {
            s2 = peg$FAILED;
          }

          if (s2 !== peg$FAILED) {
            s1 = peg$c130(s1);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }

        peg$silentFails--;

        if (s0 === peg$FAILED) {
          s1 = peg$FAILED;

          if (peg$silentFails === 0) {
            peg$fail(peg$c128);
          }
        }

        return s0;
      }

      function peg$parse_22actionValue() {
        var s0, s1;
        s0 = peg$parse_20stringWithQuotes();

        if (s0 === peg$FAILED) {
          s0 = peg$currPos;
          s1 = peg$parse_17pathIdNode();

          if (s1 !== peg$FAILED) {
            s1 = peg$c131(s1);
          }

          s0 = s1;

          if (s0 === peg$FAILED) {
            s0 = peg$currPos;
            s1 = peg$parse_21singleMustacheValue();

            if (s1 !== peg$FAILED) {
              s1 = peg$c132(s1);
            }

            s0 = s1;
          }
        }

        return s0;
      }

      function peg$parse_23nmchar() {
        var s0;

        if (peg$c108.test(input.charAt(peg$currPos))) {
          s0 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s0 = peg$FAILED;

          if (peg$silentFails === 0) {
            peg$fail(peg$c109);
          }
        }

        if (s0 === peg$FAILED) {
          s0 = peg$parse_23nonascii();
        }

        return s0;
      }

      function peg$parse_23nonascii() {
        var s0;

        if (peg$c133.test(input.charAt(peg$currPos))) {
          s0 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s0 = peg$FAILED;

          if (peg$silentFails === 0) {
            peg$fail(peg$c134);
          }
        }

        return s0;
      }

      function peg$parse_24key() {
        var s0, s1, s2;
        peg$silentFails++;
        s0 = peg$currPos;
        s1 = [];
        s2 = peg$parse_23nmchar();

        if (s2 === peg$FAILED) {
          if (input.charCodeAt(peg$currPos) === 58) {
            s2 = peg$c105;
            peg$currPos++;
          } else {
            s2 = peg$FAILED;

            if (peg$silentFails === 0) {
              peg$fail(peg$c106);
            }
          }

          if (s2 === peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 46) {
              s2 = peg$c91;
              peg$currPos++;
            } else {
              s2 = peg$FAILED;

              if (peg$silentFails === 0) {
                peg$fail(peg$c92);
              }
            }
          }
        }

        while (s2 !== peg$FAILED) {
          s1.push(s2);
          s2 = peg$parse_23nmchar();

          if (s2 === peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 58) {
              s2 = peg$c105;
              peg$currPos++;
            } else {
              s2 = peg$FAILED;

              if (peg$silentFails === 0) {
                peg$fail(peg$c106);
              }
            }

            if (s2 === peg$FAILED) {
              if (input.charCodeAt(peg$currPos) === 46) {
                s2 = peg$c91;
                peg$currPos++;
              } else {
                s2 = peg$FAILED;

                if (peg$silentFails === 0) {
                  peg$fail(peg$c92);
                }
              }
            }
          }
        }

        if (s1 !== peg$FAILED) {
          s0 = input.substring(s0, peg$currPos);
        } else {
          s0 = s1;
        }

        peg$silentFails--;

        if (s0 === peg$FAILED) {
          s1 = peg$FAILED;

          if (peg$silentFails === 0) {
            peg$fail(peg$c135);
          }
        }

        return s0;
      }

      function peg$parse_25booleanAttribute() {
        var s0, s1, s2, s3;
        s0 = peg$currPos;
        s1 = peg$parse_24key();

        if (s1 !== peg$FAILED) {
          if (input.charCodeAt(peg$currPos) === 61) {
            s2 = peg$c30;
            peg$currPos++;
          } else {
            s2 = peg$FAILED;

            if (peg$silentFails === 0) {
              peg$fail(peg$c31);
            }
          }

          if (s2 !== peg$FAILED) {
            if (input.substr(peg$currPos, 4) === peg$c136) {
              s3 = peg$c136;
              peg$currPos += 4;
            } else {
              s3 = peg$FAILED;

              if (peg$silentFails === 0) {
                peg$fail(peg$c137);
              }
            }

            if (s3 === peg$FAILED) {
              if (input.substr(peg$currPos, 5) === peg$c138) {
                s3 = peg$c138;
                peg$currPos += 5;
              } else {
                s3 = peg$FAILED;

                if (peg$silentFails === 0) {
                  peg$fail(peg$c139);
                }
              }
            }

            if (s3 !== peg$FAILED) {
              s1 = peg$c140(s1, s3);
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }

        return s0;
      }

      function peg$parse_26key() {
        var s0, s1, s2;
        peg$silentFails++;
        s0 = peg$currPos;
        s1 = [];
        s2 = peg$parse_23nmchar();

        if (s2 === peg$FAILED) {
          if (input.charCodeAt(peg$currPos) === 58) {
            s2 = peg$c105;
            peg$currPos++;
          } else {
            s2 = peg$FAILED;

            if (peg$silentFails === 0) {
              peg$fail(peg$c106);
            }
          }

          if (s2 === peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 46) {
              s2 = peg$c91;
              peg$currPos++;
            } else {
              s2 = peg$FAILED;

              if (peg$silentFails === 0) {
                peg$fail(peg$c92);
              }
            }

            if (s2 === peg$FAILED) {
              if (input.charCodeAt(peg$currPos) === 64) {
                s2 = peg$c110;
                peg$currPos++;
              } else {
                s2 = peg$FAILED;

                if (peg$silentFails === 0) {
                  peg$fail(peg$c111);
                }
              }

              if (s2 === peg$FAILED) {
                if (input.charCodeAt(peg$currPos) === 36) {
                  s2 = peg$c142;
                  peg$currPos++;
                } else {
                  s2 = peg$FAILED;

                  if (peg$silentFails === 0) {
                    peg$fail(peg$c143);
                  }
                }
              }
            }
          }
        }

        while (s2 !== peg$FAILED) {
          s1.push(s2);
          s2 = peg$parse_23nmchar();

          if (s2 === peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 58) {
              s2 = peg$c105;
              peg$currPos++;
            } else {
              s2 = peg$FAILED;

              if (peg$silentFails === 0) {
                peg$fail(peg$c106);
              }
            }

            if (s2 === peg$FAILED) {
              if (input.charCodeAt(peg$currPos) === 46) {
                s2 = peg$c91;
                peg$currPos++;
              } else {
                s2 = peg$FAILED;

                if (peg$silentFails === 0) {
                  peg$fail(peg$c92);
                }
              }

              if (s2 === peg$FAILED) {
                if (input.charCodeAt(peg$currPos) === 64) {
                  s2 = peg$c110;
                  peg$currPos++;
                } else {
                  s2 = peg$FAILED;

                  if (peg$silentFails === 0) {
                    peg$fail(peg$c111);
                  }
                }

                if (s2 === peg$FAILED) {
                  if (input.charCodeAt(peg$currPos) === 36) {
                    s2 = peg$c142;
                    peg$currPos++;
                  } else {
                    s2 = peg$FAILED;

                    if (peg$silentFails === 0) {
                      peg$fail(peg$c143);
                    }
                  }
                }
              }
            }
          }
        }

        if (s1 !== peg$FAILED) {
          s0 = input.substring(s0, peg$currPos);
        } else {
          s0 = s1;
        }

        peg$silentFails--;

        if (s0 === peg$FAILED) {
          s1 = peg$FAILED;

          if (peg$silentFails === 0) {
            peg$fail(peg$c141);
          }
        }

        return s0;
      }

      function peg$parse_27booleanAttribute() {
        var s0, s1, s2, s3;
        s0 = peg$currPos;
        s1 = peg$parse_26key();

        if (s1 !== peg$FAILED) {
          if (input.charCodeAt(peg$currPos) === 61) {
            s2 = peg$c30;
            peg$currPos++;
          } else {
            s2 = peg$FAILED;

            if (peg$silentFails === 0) {
              peg$fail(peg$c31);
            }
          }

          if (s2 !== peg$FAILED) {
            s3 = peg$parse_27digits();

            if (s3 !== peg$FAILED) {
              s1 = peg$c144(s1, s3);
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }

        return s0;
      }

      function peg$parse_27digits() {
        var s0, s1;
        peg$silentFails++;
        s0 = [];

        if (peg$c146.test(input.charAt(peg$currPos))) {
          s1 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s1 = peg$FAILED;

          if (peg$silentFails === 0) {
            peg$fail(peg$c147);
          }
        }

        if (s1 !== peg$FAILED) {
          while (s1 !== peg$FAILED) {
            s0.push(s1);

            if (peg$c146.test(input.charAt(peg$currPos))) {
              s1 = input.charAt(peg$currPos);
              peg$currPos++;
            } else {
              s1 = peg$FAILED;

              if (peg$silentFails === 0) {
                peg$fail(peg$c147);
              }
            }
          }
        } else {
          s0 = peg$FAILED;
        }

        peg$silentFails--;

        if (s0 === peg$FAILED) {
          s1 = peg$FAILED;

          if (peg$silentFails === 0) {
            peg$fail(peg$c145);
          }
        }

        return s0;
      }

      function peg$parse_28newMustacheNameChar() {
        var s0;

        if (peg$c148.test(input.charAt(peg$currPos))) {
          s0 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s0 = peg$FAILED;

          if (peg$silentFails === 0) {
            peg$fail(peg$c149);
          }
        }

        if (s0 === peg$FAILED) {
          s0 = peg$parse_28arrayIndex();

          if (s0 === peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 46) {
              s0 = peg$c91;
              peg$currPos++;
            } else {
              s0 = peg$FAILED;

              if (peg$silentFails === 0) {
                peg$fail(peg$c92);
              }
            }

            if (s0 === peg$FAILED) {
              if (input.charCodeAt(peg$currPos) === 64) {
                s0 = peg$c110;
                peg$currPos++;
              } else {
                s0 = peg$FAILED;

                if (peg$silentFails === 0) {
                  peg$fail(peg$c111);
                }
              }

              if (s0 === peg$FAILED) {
                if (input.substr(peg$currPos, 2) === peg$c150) {
                  s0 = peg$c150;
                  peg$currPos += 2;
                } else {
                  s0 = peg$FAILED;

                  if (peg$silentFails === 0) {
                    peg$fail(peg$c151);
                  }
                }

                if (s0 === peg$FAILED) {
                  if (input.charCodeAt(peg$currPos) === 36) {
                    s0 = peg$c142;
                    peg$currPos++;
                  } else {
                    s0 = peg$FAILED;

                    if (peg$silentFails === 0) {
                      peg$fail(peg$c143);
                    }
                  }
                }
              }
            }
          }
        }

        return s0;
      }

      function peg$parse_28arrayIndex() {
        var s0, s1, s2, s3;
        s0 = peg$currPos;

        if (input.substr(peg$currPos, 2) === peg$c152) {
          s1 = peg$c152;
          peg$currPos += 2;
        } else {
          s1 = peg$FAILED;

          if (peg$silentFails === 0) {
            peg$fail(peg$c153);
          }
        }

        if (s1 !== peg$FAILED) {
          s2 = [];
          s3 = peg$parse_28newMustacheNameChar();

          while (s3 !== peg$FAILED) {
            s2.push(s3);
            s3 = peg$parse_28newMustacheNameChar();
          }

          if (s2 !== peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 93) {
              s3 = peg$c99;
              peg$currPos++;
            } else {
              s3 = peg$FAILED;

              if (peg$silentFails === 0) {
                peg$fail(peg$c100);
              }
            }

            if (s3 !== peg$FAILED) {
              s1 = [s1, s2, s3];
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }

        return s0;
      }

      function peg$parse_29blockStart() {
        var s0, s1, s2, s3;
        s0 = peg$currPos;

        if (input.substr(peg$currPos, 2) === peg$c154) {
          s1 = peg$c154;
          peg$currPos += 2;
        } else {
          s1 = peg$FAILED;

          if (peg$silentFails === 0) {
            peg$fail(peg$c155);
          }
        }

        if (s1 !== peg$FAILED) {
          s2 = peg$parse_1start();

          if (s2 !== peg$FAILED) {
            s3 = peg$parse_29blockStartPipe();

            if (s3 !== peg$FAILED) {
              s1 = [s1, s2, s3];
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }

        return s0;
      }

      function peg$parse_29blockStartPipe() {
        var s0;
        peg$silentFails++;

        if (input.charCodeAt(peg$currPos) === 124) {
          s0 = peg$c157;
          peg$currPos++;
        } else {
          s0 = peg$FAILED;

          if (peg$silentFails === 0) {
            peg$fail(peg$c158);
          }
        }

        peg$silentFails--;

        if (s0 === peg$FAILED) {

          if (peg$silentFails === 0) {
            peg$fail(peg$c156);
          }
        }

        return s0;
      }

      function peg$parse_30quotedString() {
        var s0, s1, s2, s3, s4;
        peg$silentFails++;
        s0 = peg$currPos;
        s1 = peg$currPos;

        if (input.charCodeAt(peg$currPos) === 34) {
          s2 = peg$c115;
          peg$currPos++;
        } else {
          s2 = peg$FAILED;

          if (peg$silentFails === 0) {
            peg$fail(peg$c116);
          }
        }

        if (s2 !== peg$FAILED) {
          s3 = peg$parse_30stringWithoutDouble();

          if (s3 !== peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 34) {
              s4 = peg$c115;
              peg$currPos++;
            } else {
              s4 = peg$FAILED;

              if (peg$silentFails === 0) {
                peg$fail(peg$c116);
              }
            }

            if (s4 !== peg$FAILED) {
              s2 = [s2, s3, s4];
              s1 = s2;
            } else {
              peg$currPos = s1;
              s1 = peg$FAILED;
            }
          } else {
            peg$currPos = s1;
            s1 = peg$FAILED;
          }
        } else {
          peg$currPos = s1;
          s1 = peg$FAILED;
        }

        if (s1 !== peg$FAILED) {
          s0 = input.substring(s0, peg$currPos);
        } else {
          s0 = s1;
        }

        if (s0 === peg$FAILED) {
          s0 = peg$currPos;
          s1 = peg$currPos;

          if (input.charCodeAt(peg$currPos) === 39) {
            s2 = peg$c113;
            peg$currPos++;
          } else {
            s2 = peg$FAILED;

            if (peg$silentFails === 0) {
              peg$fail(peg$c114);
            }
          }

          if (s2 !== peg$FAILED) {
            s3 = peg$parse_30stringWithoutSingle();

            if (s3 !== peg$FAILED) {
              if (input.charCodeAt(peg$currPos) === 39) {
                s4 = peg$c113;
                peg$currPos++;
              } else {
                s4 = peg$FAILED;

                if (peg$silentFails === 0) {
                  peg$fail(peg$c114);
                }
              }

              if (s4 !== peg$FAILED) {
                s2 = [s2, s3, s4];
                s1 = s2;
              } else {
                peg$currPos = s1;
                s1 = peg$FAILED;
              }
            } else {
              peg$currPos = s1;
              s1 = peg$FAILED;
            }
          } else {
            peg$currPos = s1;
            s1 = peg$FAILED;
          }

          if (s1 !== peg$FAILED) {
            s0 = input.substring(s0, peg$currPos);
          } else {
            s0 = s1;
          }
        }

        peg$silentFails--;

        if (s0 === peg$FAILED) {
          s1 = peg$FAILED;

          if (peg$silentFails === 0) {
            peg$fail(peg$c159);
          }
        }

        return s0;
      }

      function peg$parse_30stringWithoutDouble() {
        var s0, s1, s2;
        s0 = peg$currPos;
        s1 = [];
        s2 = peg$parse_30inStringChar();

        if (s2 === peg$FAILED) {
          if (input.charCodeAt(peg$currPos) === 39) {
            s2 = peg$c113;
            peg$currPos++;
          } else {
            s2 = peg$FAILED;

            if (peg$silentFails === 0) {
              peg$fail(peg$c114);
            }
          }
        }

        while (s2 !== peg$FAILED) {
          s1.push(s2);
          s2 = peg$parse_30inStringChar();

          if (s2 === peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 39) {
              s2 = peg$c113;
              peg$currPos++;
            } else {
              s2 = peg$FAILED;

              if (peg$silentFails === 0) {
                peg$fail(peg$c114);
              }
            }
          }
        }

        if (s1 !== peg$FAILED) {
          s0 = input.substring(s0, peg$currPos);
        } else {
          s0 = s1;
        }

        return s0;
      }

      function peg$parse_30stringWithoutSingle() {
        var s0, s1, s2;
        s0 = peg$currPos;
        s1 = [];
        s2 = peg$parse_30inStringChar();

        if (s2 === peg$FAILED) {
          if (input.charCodeAt(peg$currPos) === 34) {
            s2 = peg$c115;
            peg$currPos++;
          } else {
            s2 = peg$FAILED;

            if (peg$silentFails === 0) {
              peg$fail(peg$c116);
            }
          }
        }

        while (s2 !== peg$FAILED) {
          s1.push(s2);
          s2 = peg$parse_30inStringChar();

          if (s2 === peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 34) {
              s2 = peg$c115;
              peg$currPos++;
            } else {
              s2 = peg$FAILED;

              if (peg$silentFails === 0) {
                peg$fail(peg$c116);
              }
            }
          }
        }

        if (s1 !== peg$FAILED) {
          s0 = input.substring(s0, peg$currPos);
        } else {
          s0 = s1;
        }

        return s0;
      }

      function peg$parse_30inStringChar() {
        var s0;

        if (peg$c160.test(input.charAt(peg$currPos))) {
          s0 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s0 = peg$FAILED;

          if (peg$silentFails === 0) {
            peg$fail(peg$c161);
          }
        }

        return s0;
      }

      function peg$parse_31newMustacheAttrValue() {
        var s0, s1, s2, s3;
        s0 = peg$currPos;
        s1 = peg$currPos;
        peg$silentFails++;
        s2 = peg$parse_31invalidValueStartChar();

        if (s2 === peg$FAILED) {
          s2 = peg$parse_29blockStart();
        }

        peg$silentFails--;

        if (s2 === peg$FAILED) {
          s1 = void 0;
        } else {
          peg$currPos = s1;
          s1 = peg$FAILED;
        }

        if (s1 !== peg$FAILED) {
          s2 = peg$parse_30quotedString();

          if (s2 === peg$FAILED) {
            s2 = peg$parse_31valuePath();
          }

          if (s2 !== peg$FAILED) {
            s3 = peg$parse_1start();

            if (s3 !== peg$FAILED) {
              s1 = peg$c162(s2);
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }

        return s0;
      }

      function peg$parse_31valuePath() {
        var s0, s1, s2;
        s0 = peg$currPos;
        s1 = [];
        s2 = peg$parse_28newMustacheNameChar();

        if (s2 !== peg$FAILED) {
          while (s2 !== peg$FAILED) {
            s1.push(s2);
            s2 = peg$parse_28newMustacheNameChar();
          }
        } else {
          s1 = peg$FAILED;
        }

        if (s1 !== peg$FAILED) {
          s0 = input.substring(s0, peg$currPos);
        } else {
          s0 = s1;
        }

        return s0;
      }

      function peg$parse_31invalidValueStartChar() {
        var s0;

        if (peg$c163.test(input.charAt(peg$currPos))) {
          s0 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s0 = peg$FAILED;

          if (peg$silentFails === 0) {
            peg$fail(peg$c164);
          }
        }

        return s0;
      }

      function peg$parse_32helperValue() {
        var s0, s1, s2, s3, s4, s5;
        s0 = peg$currPos;

        if (input.charCodeAt(peg$currPos) === 123) {
          s1 = peg$c44;
          peg$currPos++;
        } else {
          s1 = peg$FAILED;

          if (peg$silentFails === 0) {
            peg$fail(peg$c45);
          }
        }

        if (s1 !== peg$FAILED) {
          s2 = peg$parse_1start();

          if (s2 !== peg$FAILED) {
            s3 = peg$parse_32helperCase();

            if (s3 !== peg$FAILED) {
              s4 = peg$parse_1start();

              if (s4 !== peg$FAILED) {
                s5 = peg$parse_32mustacheClose();

                if (s5 !== peg$FAILED) {
                  s1 = peg$c125(s3);
                  s0 = s1;
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }

        return s0;
      }

      function peg$parse_32mustacheClose() {
        var s0;
        peg$silentFails++;

        if (input.charCodeAt(peg$currPos) === 125) {
          s0 = peg$c67;
          peg$currPos++;
        } else {
          s0 = peg$FAILED;

          if (peg$silentFails === 0) {
            peg$fail(peg$c68);
          }
        }

        peg$silentFails--;

        if (s0 === peg$FAILED) {

          if (peg$silentFails === 0) {
            peg$fail(peg$c165);
          }
        }

        return s0;
      }

      function peg$parse_32helperCase() {
        var s0, s1, s2, s3;
        s0 = peg$currPos;
        s1 = peg$parse_31newMustacheAttrValue();

        if (s1 !== peg$FAILED) {
          s2 = [];
          s3 = peg$parse_32subexpression();

          if (s3 === peg$FAILED) {
            s3 = peg$parse_32bracketedAttrs();

            if (s3 === peg$FAILED) {
              s3 = peg$parse_32mustacheAttr();
            }
          }

          while (s3 !== peg$FAILED) {
            s2.push(s3);
            s3 = peg$parse_32subexpression();

            if (s3 === peg$FAILED) {
              s3 = peg$parse_32bracketedAttrs();

              if (s3 === peg$FAILED) {
                s3 = peg$parse_32mustacheAttr();
              }
            }
          }

          if (s2 !== peg$FAILED) {
            s1 = peg$c166(s1, s2);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }

        return s0;
      }

      function peg$parse_32bracketedAttrs() {
        var s0, s1, s2, s3, s4;
        s0 = peg$currPos;
        s1 = peg$parse_32openBracket();

        if (s1 !== peg$FAILED) {
          s2 = [];
          s3 = peg$parse_32bracketedAttr();

          if (s3 === peg$FAILED) {
            s3 = peg$parse_32commentWithSpace();

            if (s3 === peg$FAILED) {
              s3 = peg$parse_2blankLine();
            }
          }

          while (s3 !== peg$FAILED) {
            s2.push(s3);
            s3 = peg$parse_32bracketedAttr();

            if (s3 === peg$FAILED) {
              s3 = peg$parse_32commentWithSpace();

              if (s3 === peg$FAILED) {
                s3 = peg$parse_2blankLine();
              }
            }
          }

          if (s2 !== peg$FAILED) {
            s3 = peg$currPos;
            peg$silentFails++;
            s4 = peg$parse_32closeBracket();
            peg$silentFails--;

            if (s4 !== peg$FAILED) {
              peg$currPos = s3;
              s3 = void 0;
            } else {
              s3 = peg$FAILED;
            }

            if (s3 !== peg$FAILED) {
              s1 = peg$c167(s2);
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }

        return s0;
      }

      function peg$parse_32commentWithSpace() {
        var s0, s1, s2, s3;
        s0 = peg$currPos;
        s1 = peg$currPos;
        s2 = peg$parse_1start();

        if (s2 !== peg$FAILED) {
          s3 = peg$parse_7comment();

          if (s3 !== peg$FAILED) {
            s2 = [s2, s3];
            s1 = s2;
          } else {
            peg$currPos = s1;
            s1 = peg$FAILED;
          }
        } else {
          peg$currPos = s1;
          s1 = peg$FAILED;
        }

        if (s1 !== peg$FAILED) {
          s1 = peg$c3();
        }

        s0 = s1;
        return s0;
      }

      function peg$parse_32bracketedAttr() {
        var s0, s1, s2, s3, s4, s5, s6, s7;
        s0 = peg$currPos;
        s1 = [];
        s2 = peg$parse_32INDENT();

        while (s2 !== peg$FAILED) {
          s1.push(s2);
          s2 = peg$parse_32INDENT();
        }

        if (s1 !== peg$FAILED) {
          s2 = peg$parse_1start();

          if (s2 !== peg$FAILED) {
            s3 = peg$parse_32mustacheAttr();

            if (s3 !== peg$FAILED) {
              s4 = [];
              s5 = peg$currPos;
              s6 = peg$parse_1start();

              if (s6 !== peg$FAILED) {
                s7 = peg$parse_10inlineComment();

                if (s7 !== peg$FAILED) {
                  s6 = [s6, s7];
                  s5 = s6;
                } else {
                  peg$currPos = s5;
                  s5 = peg$FAILED;
                }
              } else {
                peg$currPos = s5;
                s5 = peg$FAILED;
              }

              while (s5 !== peg$FAILED) {
                s4.push(s5);
                s5 = peg$currPos;
                s6 = peg$parse_1start();

                if (s6 !== peg$FAILED) {
                  s7 = peg$parse_10inlineComment();

                  if (s7 !== peg$FAILED) {
                    s6 = [s6, s7];
                    s5 = s6;
                  } else {
                    peg$currPos = s5;
                    s5 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s5;
                  s5 = peg$FAILED;
                }
              }

              if (s4 !== peg$FAILED) {
                s5 = [];
                s6 = peg$parse_32TERM();

                while (s6 !== peg$FAILED) {
                  s5.push(s6);
                  s6 = peg$parse_32TERM();
                }

                if (s5 !== peg$FAILED) {
                  s1 = peg$c168(s3);
                  s0 = s1;
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }

        return s0;
      }

      function peg$parse_32openBracket() {
        var s0, s1, s2, s3, s4, s5;
        s0 = peg$currPos;

        if (input.charCodeAt(peg$currPos) === 91) {
          s1 = peg$c95;
          peg$currPos++;
        } else {
          s1 = peg$FAILED;

          if (peg$silentFails === 0) {
            peg$fail(peg$c96);
          }
        }

        if (s1 !== peg$FAILED) {
          s2 = peg$parse_1start();

          if (s2 !== peg$FAILED) {
            s3 = peg$parse_10inlineComment();

            if (s3 === peg$FAILED) {
              s3 = null;
            }

            if (s3 !== peg$FAILED) {
              s4 = [];
              s5 = peg$parse_32TERM();

              if (s5 !== peg$FAILED) {
                while (s5 !== peg$FAILED) {
                  s4.push(s5);
                  s5 = peg$parse_32TERM();
                }
              } else {
                s4 = peg$FAILED;
              }

              if (s4 !== peg$FAILED) {
                s1 = [s1, s2, s3, s4];
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }

        return s0;
      }

      function peg$parse_32closeBracket() {
        var s0, s1, s2, s3;
        peg$silentFails++;
        s0 = peg$currPos;
        s1 = peg$parse_32DEDENT();

        if (s1 === peg$FAILED) {
          s1 = null;
        }

        if (s1 !== peg$FAILED) {
          s2 = peg$parse_1start();

          if (s2 !== peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 93) {
              s3 = peg$c99;
              peg$currPos++;
            } else {
              s3 = peg$FAILED;

              if (peg$silentFails === 0) {
                peg$fail(peg$c100);
              }
            }

            if (s3 !== peg$FAILED) {
              s1 = [s1, s2, s3];
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }

        peg$silentFails--;

        if (s0 === peg$FAILED) {
          s1 = peg$FAILED;

          if (peg$silentFails === 0) {
            peg$fail(peg$c169);
          }
        }

        return s0;
      }

      function peg$parse_32mustacheAttr() {
        var s0;
        s0 = peg$parse_32mustacheKeyValue();

        if (s0 === peg$FAILED) {
          s0 = peg$parse_32subexpression();

          if (s0 === peg$FAILED) {
            s0 = peg$parse_31newMustacheAttrValue();
          }
        }

        return s0;
      }

      function peg$parse_32mustacheKeyValue() {
        var s0, s1, s2, s3, s4, s5;
        s0 = peg$currPos;
        s1 = peg$parse_26key();

        if (s1 !== peg$FAILED) {
          s2 = peg$parse_1start();

          if (s2 !== peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 61) {
              s3 = peg$c30;
              peg$currPos++;
            } else {
              s3 = peg$FAILED;

              if (peg$silentFails === 0) {
                peg$fail(peg$c31);
              }
            }

            if (s3 !== peg$FAILED) {
              s4 = peg$parse_1start();

              if (s4 !== peg$FAILED) {
                s5 = peg$parse_32subexpression();

                if (s5 === peg$FAILED) {
                  s5 = peg$parse_31newMustacheAttrValue();
                }

                if (s5 !== peg$FAILED) {
                  s1 = peg$c170(s1, s5);
                  s0 = s1;
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }

        return s0;
      }

      function peg$parse_32subexpression() {
        var s0, s1, s2, s3, s4, s5, s6, s7, s8;
        s0 = peg$currPos;
        s1 = peg$parse_1start();

        if (s1 !== peg$FAILED) {
          if (input.charCodeAt(peg$currPos) === 40) {
            s2 = peg$c171;
            peg$currPos++;
          } else {
            s2 = peg$FAILED;

            if (peg$silentFails === 0) {
              peg$fail(peg$c172);
            }
          }

          if (s2 !== peg$FAILED) {
            s3 = peg$parse_1start();

            if (s3 !== peg$FAILED) {
              s4 = peg$parse_31newMustacheAttrValue();

              if (s4 !== peg$FAILED) {
                s5 = peg$parse_1start();

                if (s5 !== peg$FAILED) {
                  s6 = peg$parse_32bracketedSubexpression();

                  if (s6 === peg$FAILED) {
                    s6 = peg$parse_32subexpressionBracketAttrs();

                    if (s6 === peg$FAILED) {
                      s6 = [];
                      s7 = peg$parse_32subexpressionAttrs();

                      if (s7 !== peg$FAILED) {
                        while (s7 !== peg$FAILED) {
                          s6.push(s7);
                          s7 = peg$parse_32subexpressionAttrs();
                        }
                      } else {
                        s6 = peg$FAILED;
                      }
                    }
                  }

                  if (s6 === peg$FAILED) {
                    s6 = null;
                  }

                  if (s6 !== peg$FAILED) {
                    s7 = peg$parse_32subexpressionClose();

                    if (s7 !== peg$FAILED) {
                      s8 = peg$parse_1start();

                      if (s8 !== peg$FAILED) {
                        s1 = peg$c173(s4, s6);
                        s0 = s1;
                      } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                      }
                    } else {
                      peg$currPos = s0;
                      s0 = peg$FAILED;
                    }
                  } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }

        return s0;
      }

      function peg$parse_32subexpressionClose() {
        var s0, s1, s2;
        peg$silentFails++;
        s0 = peg$currPos;
        s1 = peg$parse_1start();

        if (s1 !== peg$FAILED) {
          if (input.charCodeAt(peg$currPos) === 41) {
            s2 = peg$c175;
            peg$currPos++;
          } else {
            s2 = peg$FAILED;

            if (peg$silentFails === 0) {
              peg$fail(peg$c176);
            }
          }

          if (s2 !== peg$FAILED) {
            s1 = [s1, s2];
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }

        peg$silentFails--;

        if (s0 === peg$FAILED) {
          s1 = peg$FAILED;

          if (peg$silentFails === 0) {
            peg$fail(peg$c174);
          }
        }

        return s0;
      }

      function peg$parse_32subexpressionBracketAttrs() {
        var s0, s1, s2;
        peg$silentFails++;
        s0 = peg$currPos;
        s1 = peg$parse_32bracketedAttrs();

        if (s1 !== peg$FAILED) {
          s2 = peg$parse_32closeBracket();

          if (s2 !== peg$FAILED) {
            s1 = peg$c178(s1);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }

        peg$silentFails--;

        if (s0 === peg$FAILED) {
          s1 = peg$FAILED;

          if (peg$silentFails === 0) {
            peg$fail(peg$c177);
          }
        }

        return s0;
      }

      function peg$parse_32bracketedSubexpression() {
        var s0, s1, s2, s3, s4;
        s0 = peg$currPos;
        s1 = [];
        s2 = peg$parse_32INDENT();

        while (s2 !== peg$FAILED) {
          s1.push(s2);
          s2 = peg$parse_32INDENT();
        }

        if (s1 !== peg$FAILED) {
          s2 = peg$parse_1start();

          if (s2 !== peg$FAILED) {
            s3 = [];
            s4 = peg$parse_32subexpression();

            if (s4 === peg$FAILED) {
              s4 = peg$parse_32commentWithSpace();

              if (s4 === peg$FAILED) {
                s4 = peg$parse_2blankLine();
              }
            }

            while (s4 !== peg$FAILED) {
              s3.push(s4);
              s4 = peg$parse_32subexpression();

              if (s4 === peg$FAILED) {
                s4 = peg$parse_32commentWithSpace();

                if (s4 === peg$FAILED) {
                  s4 = peg$parse_2blankLine();
                }
              }
            }

            if (s3 !== peg$FAILED) {
              s4 = peg$parse_32closeBracket();

              if (s4 !== peg$FAILED) {
                s1 = peg$c167(s3);
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }

        return s0;
      }

      function peg$parse_32subexpressionAttrs() {
        var s0;
        s0 = peg$parse_32mustacheKeyValue();

        if (s0 === peg$FAILED) {
          s0 = peg$parse_32subexpression();

          if (s0 === peg$FAILED) {
            s0 = peg$parse_31newMustacheAttrValue();
          }
        }

        return s0;
      }

      function peg$parse_32boundAttributeWithSingleMustache() {
        var s0, s1, s2, s3;
        s0 = peg$currPos;

        if (input.substr(peg$currPos, 6) === peg$c179) {
          s1 = peg$c179;
          peg$currPos += 6;
        } else {
          s1 = peg$FAILED;

          if (peg$silentFails === 0) {
            peg$fail(peg$c180);
          }
        }

        if (s1 !== peg$FAILED) {
          s2 = peg$parse_21singleMustacheValue();

          if (s2 !== peg$FAILED) {
            s1 = peg$c181(s2);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }

        if (s0 === peg$FAILED) {
          s0 = peg$currPos;
          s1 = peg$parse_26key();

          if (s1 !== peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 61) {
              s2 = peg$c30;
              peg$currPos++;
            } else {
              s2 = peg$FAILED;

              if (peg$silentFails === 0) {
                peg$fail(peg$c31);
              }
            }

            if (s2 !== peg$FAILED) {
              s3 = peg$parse_32helperValue();

              if (s3 !== peg$FAILED) {
                s1 = peg$c182(s1, s3);
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }

          if (s0 === peg$FAILED) {
            s0 = peg$currPos;
            s1 = peg$parse_26key();

            if (s1 !== peg$FAILED) {
              if (input.charCodeAt(peg$currPos) === 61) {
                s2 = peg$c30;
                peg$currPos++;
              } else {
                s2 = peg$FAILED;

                if (peg$silentFails === 0) {
                  peg$fail(peg$c31);
                }
              }

              if (s2 !== peg$FAILED) {
                s3 = peg$parse_21singleMustacheValue();

                if (s3 !== peg$FAILED) {
                  s1 = peg$c182(s1, s3);
                  s0 = s1;
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          }
        }

        return s0;
      }

      function peg$parse_32INDENT() {
        var s0, s1, s2;
        peg$silentFails++;
        s0 = peg$currPos;

        if (input.length > peg$currPos) {
          s1 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s1 = peg$FAILED;

          if (peg$silentFails === 0) {
            peg$fail(peg$c7);
          }
        }

        if (s1 !== peg$FAILED) {
          s2 = peg$c21(s1);

          if (s2) {
            s2 = void 0;
          } else {
            s2 = peg$FAILED;
          }

          if (s2 !== peg$FAILED) {
            s1 = peg$c15(s1);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }

        peg$silentFails--;

        if (s0 === peg$FAILED) {
          s1 = peg$FAILED;

          if (peg$silentFails === 0) {
            peg$fail(peg$c183);
          }
        }

        return s0;
      }

      function peg$parse_32DEDENT() {
        var s0, s1, s2;
        peg$silentFails++;
        s0 = peg$currPos;

        if (input.length > peg$currPos) {
          s1 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s1 = peg$FAILED;

          if (peg$silentFails === 0) {
            peg$fail(peg$c7);
          }
        }

        if (s1 !== peg$FAILED) {
          s2 = peg$c14(s1);

          if (s2) {
            s2 = void 0;
          } else {
            s2 = peg$FAILED;
          }

          if (s2 !== peg$FAILED) {
            s1 = peg$c15(s1);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }

        peg$silentFails--;

        if (s0 === peg$FAILED) {
          s1 = peg$FAILED;

          if (peg$silentFails === 0) {
            peg$fail(peg$c184);
          }
        }

        return s0;
      }

      function peg$parse_32TERM() {
        var s0, s1, s2, s3, s4;
        peg$silentFails++;
        s0 = peg$currPos;

        if (input.charCodeAt(peg$currPos) === 13) {
          s1 = peg$c5;
          peg$currPos++;
        } else {
          s1 = peg$FAILED;

          if (peg$silentFails === 0) {
            peg$fail(peg$c6);
          }
        }

        if (s1 === peg$FAILED) {
          s1 = null;
        }

        if (s1 !== peg$FAILED) {
          if (input.length > peg$currPos) {
            s2 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s2 = peg$FAILED;

            if (peg$silentFails === 0) {
              peg$fail(peg$c7);
            }
          }

          if (s2 !== peg$FAILED) {
            s3 = peg$c8(s2);

            if (s3) {
              s3 = void 0;
            } else {
              s3 = peg$FAILED;
            }

            if (s3 !== peg$FAILED) {
              if (input.charCodeAt(peg$currPos) === 10) {
                s4 = peg$c9;
                peg$currPos++;
              } else {
                s4 = peg$FAILED;

                if (peg$silentFails === 0) {
                  peg$fail(peg$c10);
                }
              }

              if (s4 !== peg$FAILED) {
                s1 = peg$c11(s2);
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }

        peg$silentFails--;

        if (s0 === peg$FAILED) {
          s1 = peg$FAILED;

          if (peg$silentFails === 0) {
            peg$fail(peg$c185);
          }
        }

        return s0;
      }

      function peg$parse_33boundAttribute() {
        var s0, s1, s2, s3, s4, s5;
        s0 = peg$currPos;
        s1 = peg$parse_26key();

        if (s1 !== peg$FAILED) {
          if (input.charCodeAt(peg$currPos) === 61) {
            s2 = peg$c30;
            peg$currPos++;
          } else {
            s2 = peg$FAILED;

            if (peg$silentFails === 0) {
              peg$fail(peg$c31);
            }
          }

          if (s2 !== peg$FAILED) {
            s3 = peg$parse_33boundAttributeValue();

            if (s3 !== peg$FAILED) {
              s4 = peg$currPos;
              peg$silentFails++;

              if (input.charCodeAt(peg$currPos) === 33) {
                s5 = peg$c186;
                peg$currPos++;
              } else {
                s5 = peg$FAILED;

                if (peg$silentFails === 0) {
                  peg$fail(peg$c187);
                }
              }

              peg$silentFails--;

              if (s5 === peg$FAILED) {
                s4 = void 0;
              } else {
                peg$currPos = s4;
                s4 = peg$FAILED;
              }

              if (s4 !== peg$FAILED) {
                s1 = peg$c188(s1, s3);
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }

        return s0;
      }

      function peg$parse_33boundAttributeValue() {
        var s0, s1, s2, s3, s4, s5;
        s0 = peg$currPos;

        if (input.charCodeAt(peg$currPos) === 123) {
          s1 = peg$c44;
          peg$currPos++;
        } else {
          s1 = peg$FAILED;

          if (peg$silentFails === 0) {
            peg$fail(peg$c45);
          }
        }

        if (s1 !== peg$FAILED) {
          s2 = peg$parse_1start();

          if (s2 !== peg$FAILED) {
            s3 = peg$currPos;
            s4 = [];
            s5 = peg$parse_33boundAttributeValueChar();

            if (s5 === peg$FAILED) {
              if (input.charCodeAt(peg$currPos) === 32) {
                s5 = peg$c39;
                peg$currPos++;
              } else {
                s5 = peg$FAILED;

                if (peg$silentFails === 0) {
                  peg$fail(peg$c40);
                }
              }
            }

            if (s5 !== peg$FAILED) {
              while (s5 !== peg$FAILED) {
                s4.push(s5);
                s5 = peg$parse_33boundAttributeValueChar();

                if (s5 === peg$FAILED) {
                  if (input.charCodeAt(peg$currPos) === 32) {
                    s5 = peg$c39;
                    peg$currPos++;
                  } else {
                    s5 = peg$FAILED;

                    if (peg$silentFails === 0) {
                      peg$fail(peg$c40);
                    }
                  }
                }
              }
            } else {
              s4 = peg$FAILED;
            }

            if (s4 !== peg$FAILED) {
              s3 = input.substring(s3, peg$currPos);
            } else {
              s3 = s4;
            }

            if (s3 !== peg$FAILED) {
              s4 = peg$parse_1start();

              if (s4 !== peg$FAILED) {
                s5 = peg$parse_33mustacheClose();

                if (s5 !== peg$FAILED) {
                  s1 = peg$c189(s3);
                  s0 = s1;
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }

        if (s0 === peg$FAILED) {
          s0 = peg$currPos;
          s1 = [];
          s2 = peg$parse_33boundAttributeValueChar();

          if (s2 !== peg$FAILED) {
            while (s2 !== peg$FAILED) {
              s1.push(s2);
              s2 = peg$parse_33boundAttributeValueChar();
            }
          } else {
            s1 = peg$FAILED;
          }

          if (s1 !== peg$FAILED) {
            s0 = input.substring(s0, peg$currPos);
          } else {
            s0 = s1;
          }
        }

        return s0;
      }

      function peg$parse_33boundAttributeValueChar() {
        var s0;
        peg$silentFails++;
        s0 = peg$parse_28newMustacheNameChar();

        if (s0 === peg$FAILED) {
          s0 = peg$parse_18nonSeparatorColon();
        }

        peg$silentFails--;

        if (s0 === peg$FAILED) {

          if (peg$silentFails === 0) {
            peg$fail(peg$c190);
          }
        }

        return s0;
      }

      function peg$parse_33mustacheClose() {
        var s0;
        peg$silentFails++;

        if (input.charCodeAt(peg$currPos) === 125) {
          s0 = peg$c67;
          peg$currPos++;
        } else {
          s0 = peg$FAILED;

          if (peg$silentFails === 0) {
            peg$fail(peg$c68);
          }
        }

        peg$silentFails--;

        if (s0 === peg$FAILED) {

          if (peg$silentFails === 0) {
            peg$fail(peg$c191);
          }
        }

        return s0;
      }

      function peg$parse_34normalAttribute() {
        var s0, s1, s2, s3;
        s0 = peg$currPos;
        s1 = peg$parse_26key();

        if (s1 !== peg$FAILED) {
          if (input.charCodeAt(peg$currPos) === 61) {
            s2 = peg$c30;
            peg$currPos++;
          } else {
            s2 = peg$FAILED;

            if (peg$silentFails === 0) {
              peg$fail(peg$c31);
            }
          }

          if (s2 !== peg$FAILED) {
            s3 = peg$parse_34attributeTextNodes();

            if (s3 !== peg$FAILED) {
              s1 = peg$c192(s1, s3);
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }

        return s0;
      }

      function peg$parse_34attributeTextNodes() {
        var s0, s1, s2, s3;
        s0 = peg$currPos;

        if (input.charCodeAt(peg$currPos) === 34) {
          s1 = peg$c115;
          peg$currPos++;
        } else {
          s1 = peg$FAILED;

          if (peg$silentFails === 0) {
            peg$fail(peg$c116);
          }
        }

        if (s1 !== peg$FAILED) {
          s2 = peg$parse_34attributeTextNodesInner();

          if (s2 !== peg$FAILED) {
            s3 = peg$parse_34closingDoubleQuote();

            if (s3 !== peg$FAILED) {
              s1 = peg$c193(s2);
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }

        if (s0 === peg$FAILED) {
          s0 = peg$currPos;

          if (input.charCodeAt(peg$currPos) === 39) {
            s1 = peg$c113;
            peg$currPos++;
          } else {
            s1 = peg$FAILED;

            if (peg$silentFails === 0) {
              peg$fail(peg$c114);
            }
          }

          if (s1 !== peg$FAILED) {
            s2 = peg$parse_34attributeTextNodesInnerSingle();

            if (s2 !== peg$FAILED) {
              s3 = peg$parse_34closingSingleQuote();

              if (s3 !== peg$FAILED) {
                s1 = peg$c193(s2);
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        }

        return s0;
      }

      function peg$parse_34closingSingleQuote() {
        var s0;
        peg$silentFails++;

        if (input.charCodeAt(peg$currPos) === 39) {
          s0 = peg$c113;
          peg$currPos++;
        } else {
          s0 = peg$FAILED;

          if (peg$silentFails === 0) {
            peg$fail(peg$c114);
          }
        }

        peg$silentFails--;

        if (s0 === peg$FAILED) {

          if (peg$silentFails === 0) {
            peg$fail(peg$c194);
          }
        }

        return s0;
      }

      function peg$parse_34closingDoubleQuote() {
        var s0;
        peg$silentFails++;

        if (input.charCodeAt(peg$currPos) === 34) {
          s0 = peg$c115;
          peg$currPos++;
        } else {
          s0 = peg$FAILED;

          if (peg$silentFails === 0) {
            peg$fail(peg$c116);
          }
        }

        peg$silentFails--;

        if (s0 === peg$FAILED) {

          if (peg$silentFails === 0) {
            peg$fail(peg$c195);
          }
        }

        return s0;
      }

      function peg$parse_34attributeTextNodesInner() {
        var s0, s1, s2, s3, s4, s5;
        s0 = peg$currPos;
        s1 = peg$parse_34preAttrMustacheText();

        if (s1 === peg$FAILED) {
          s1 = null;
        }

        if (s1 !== peg$FAILED) {
          s2 = [];
          s3 = peg$currPos;
          s4 = peg$parse_12rawMustache();

          if (s4 !== peg$FAILED) {
            s5 = peg$parse_34preAttrMustacheText();

            if (s5 === peg$FAILED) {
              s5 = null;
            }

            if (s5 !== peg$FAILED) {
              s4 = [s4, s5];
              s3 = s4;
            } else {
              peg$currPos = s3;
              s3 = peg$FAILED;
            }
          } else {
            peg$currPos = s3;
            s3 = peg$FAILED;
          }

          while (s3 !== peg$FAILED) {
            s2.push(s3);
            s3 = peg$currPos;
            s4 = peg$parse_12rawMustache();

            if (s4 !== peg$FAILED) {
              s5 = peg$parse_34preAttrMustacheText();

              if (s5 === peg$FAILED) {
                s5 = null;
              }

              if (s5 !== peg$FAILED) {
                s4 = [s4, s5];
                s3 = s4;
              } else {
                peg$currPos = s3;
                s3 = peg$FAILED;
              }
            } else {
              peg$currPos = s3;
              s3 = peg$FAILED;
            }
          }

          if (s2 !== peg$FAILED) {
            s1 = peg$c74(s1, s2);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }

        return s0;
      }

      function peg$parse_34attributeTextNodesInnerSingle() {
        var s0, s1, s2, s3, s4, s5;
        s0 = peg$currPos;
        s1 = peg$parse_34preAttrMustacheTextSingle();

        if (s1 === peg$FAILED) {
          s1 = null;
        }

        if (s1 !== peg$FAILED) {
          s2 = [];
          s3 = peg$currPos;
          s4 = peg$parse_12rawMustache();

          if (s4 !== peg$FAILED) {
            s5 = peg$parse_34preAttrMustacheTextSingle();

            if (s5 === peg$FAILED) {
              s5 = null;
            }

            if (s5 !== peg$FAILED) {
              s4 = [s4, s5];
              s3 = s4;
            } else {
              peg$currPos = s3;
              s3 = peg$FAILED;
            }
          } else {
            peg$currPos = s3;
            s3 = peg$FAILED;
          }

          while (s3 !== peg$FAILED) {
            s2.push(s3);
            s3 = peg$currPos;
            s4 = peg$parse_12rawMustache();

            if (s4 !== peg$FAILED) {
              s5 = peg$parse_34preAttrMustacheTextSingle();

              if (s5 === peg$FAILED) {
                s5 = null;
              }

              if (s5 !== peg$FAILED) {
                s4 = [s4, s5];
                s3 = s4;
              } else {
                peg$currPos = s3;
                s3 = peg$FAILED;
              }
            } else {
              peg$currPos = s3;
              s3 = peg$FAILED;
            }
          }

          if (s2 !== peg$FAILED) {
            s1 = peg$c74(s1, s2);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }

        return s0;
      }

      function peg$parse_34preAttrMustacheText() {
        var s0, s1, s2;
        s0 = peg$currPos;
        s1 = [];
        s2 = peg$parse_34preAttrMustacheUnit();

        if (s2 !== peg$FAILED) {
          while (s2 !== peg$FAILED) {
            s1.push(s2);
            s2 = peg$parse_34preAttrMustacheUnit();
          }
        } else {
          s1 = peg$FAILED;
        }

        if (s1 !== peg$FAILED) {
          s0 = input.substring(s0, peg$currPos);
        } else {
          s0 = s1;
        }

        return s0;
      }

      function peg$parse_34preAttrMustacheTextSingle() {
        var s0, s1, s2;
        s0 = peg$currPos;
        s1 = [];
        s2 = peg$parse_34preAttrMustacheUnitSingle();

        if (s2 !== peg$FAILED) {
          while (s2 !== peg$FAILED) {
            s1.push(s2);
            s2 = peg$parse_34preAttrMustacheUnitSingle();
          }
        } else {
          s1 = peg$FAILED;
        }

        if (s1 !== peg$FAILED) {
          s0 = input.substring(s0, peg$currPos);
        } else {
          s0 = s1;
        }

        return s0;
      }

      function peg$parse_34preAttrMustacheUnit() {
        var s0, s1, s2;
        peg$silentFails++;
        s0 = peg$currPos;
        s1 = peg$currPos;
        peg$silentFails++;
        s2 = peg$parse_13nonMustacheUnit();

        if (s2 === peg$FAILED) {
          if (input.charCodeAt(peg$currPos) === 34) {
            s2 = peg$c115;
            peg$currPos++;
          } else {
            s2 = peg$FAILED;

            if (peg$silentFails === 0) {
              peg$fail(peg$c116);
            }
          }
        }

        peg$silentFails--;

        if (s2 === peg$FAILED) {
          s1 = void 0;
        } else {
          peg$currPos = s1;
          s1 = peg$FAILED;
        }

        if (s1 !== peg$FAILED) {
          if (input.length > peg$currPos) {
            s2 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s2 = peg$FAILED;

            if (peg$silentFails === 0) {
              peg$fail(peg$c7);
            }
          }

          if (s2 !== peg$FAILED) {
            s1 = peg$c22(s2);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }

        peg$silentFails--;

        if (s0 === peg$FAILED) {
          s1 = peg$FAILED;

          if (peg$silentFails === 0) {
            peg$fail(peg$c196);
          }
        }

        return s0;
      }

      function peg$parse_34preAttrMustacheUnitSingle() {
        var s0, s1, s2;
        peg$silentFails++;
        s0 = peg$currPos;
        s1 = peg$currPos;
        peg$silentFails++;
        s2 = peg$parse_13nonMustacheUnit();

        if (s2 === peg$FAILED) {
          if (input.charCodeAt(peg$currPos) === 39) {
            s2 = peg$c113;
            peg$currPos++;
          } else {
            s2 = peg$FAILED;

            if (peg$silentFails === 0) {
              peg$fail(peg$c114);
            }
          }
        }

        peg$silentFails--;

        if (s2 === peg$FAILED) {
          s1 = void 0;
        } else {
          peg$currPos = s1;
          s1 = peg$FAILED;
        }

        if (s1 !== peg$FAILED) {
          if (input.length > peg$currPos) {
            s2 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s2 = peg$FAILED;

            if (peg$silentFails === 0) {
              peg$fail(peg$c7);
            }
          }

          if (s2 !== peg$FAILED) {
            s1 = peg$c22(s2);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }

        peg$silentFails--;

        if (s0 === peg$FAILED) {
          s1 = peg$FAILED;

          if (peg$silentFails === 0) {
            peg$fail(peg$c196);
          }
        }

        return s0;
      }

      function peg$parse_35simpleMustacheAttr() {
        var s0, s1, s2, s3;
        s0 = peg$currPos;
        s1 = peg$parse_26key();

        if (s1 !== peg$FAILED) {
          if (input.charCodeAt(peg$currPos) === 61) {
            s2 = peg$c30;
            peg$currPos++;
          } else {
            s2 = peg$FAILED;

            if (peg$silentFails === 0) {
              peg$fail(peg$c31);
            }
          }

          if (s2 !== peg$FAILED) {
            s3 = peg$parse_17pathIdNode();

            if (s3 !== peg$FAILED) {
              s1 = peg$c197(s1, s3);
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }

        return s0;
      }

      function peg$parse_36spreadAttribute() {
        var s0, s1;
        s0 = peg$currPos;

        if (input.substr(peg$currPos, 13) === peg$c198) {
          s1 = peg$c198;
          peg$currPos += 13;
        } else {
          s1 = peg$FAILED;

          if (peg$silentFails === 0) {
            peg$fail(peg$c199);
          }
        }

        if (s1 !== peg$FAILED) {
          s1 = peg$c200(s1);
        }

        s0 = s1;
        return s0;
      }

      function peg$parse_37attribute() {
        var s0, s1, s2;
        s0 = peg$currPos;
        s1 = peg$parse_1start();

        if (s1 !== peg$FAILED) {
          s2 = peg$parse_22actionAttribute();

          if (s2 === peg$FAILED) {
            s2 = peg$parse_25booleanAttribute();

            if (s2 === peg$FAILED) {
              s2 = peg$parse_27booleanAttribute();

              if (s2 === peg$FAILED) {
                s2 = peg$parse_32boundAttributeWithSingleMustache();

                if (s2 === peg$FAILED) {
                  s2 = peg$parse_33boundAttribute();

                  if (s2 === peg$FAILED) {
                    s2 = peg$parse_34normalAttribute();

                    if (s2 === peg$FAILED) {
                      s2 = peg$parse_35simpleMustacheAttr();

                      if (s2 === peg$FAILED) {
                        s2 = peg$parse_36spreadAttribute();
                      }
                    }
                  }
                }
              }
            }
          }

          if (s2 !== peg$FAILED) {
            s1 = peg$c201(s2);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }

        return s0;
      }

      function peg$parse_38bracketedAttribute() {
        var s0, s1, s2, s3, s4, s5, s6;
        s0 = peg$currPos;
        s1 = [];
        s2 = peg$parse_38INDENT();

        while (s2 !== peg$FAILED) {
          s1.push(s2);
          s2 = peg$parse_38INDENT();
        }

        if (s1 !== peg$FAILED) {
          s2 = peg$parse_37attribute();

          if (s2 !== peg$FAILED) {
            s3 = [];
            s4 = peg$currPos;
            s5 = peg$parse_1start();

            if (s5 !== peg$FAILED) {
              s6 = peg$parse_10inlineComment();

              if (s6 !== peg$FAILED) {
                s5 = [s5, s6];
                s4 = s5;
              } else {
                peg$currPos = s4;
                s4 = peg$FAILED;
              }
            } else {
              peg$currPos = s4;
              s4 = peg$FAILED;
            }

            while (s4 !== peg$FAILED) {
              s3.push(s4);
              s4 = peg$currPos;
              s5 = peg$parse_1start();

              if (s5 !== peg$FAILED) {
                s6 = peg$parse_10inlineComment();

                if (s6 !== peg$FAILED) {
                  s5 = [s5, s6];
                  s4 = s5;
                } else {
                  peg$currPos = s4;
                  s4 = peg$FAILED;
                }
              } else {
                peg$currPos = s4;
                s4 = peg$FAILED;
              }
            }

            if (s3 !== peg$FAILED) {
              s4 = [];
              s5 = peg$parse_38TERM();

              while (s5 !== peg$FAILED) {
                s4.push(s5);
                s5 = peg$parse_38TERM();
              }

              if (s4 !== peg$FAILED) {
                s1 = peg$c202(s2);
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }

        return s0;
      }

      function peg$parse_38TERM() {
        var s0, s1, s2, s3, s4;
        peg$silentFails++;
        s0 = peg$currPos;

        if (input.charCodeAt(peg$currPos) === 13) {
          s1 = peg$c5;
          peg$currPos++;
        } else {
          s1 = peg$FAILED;

          if (peg$silentFails === 0) {
            peg$fail(peg$c6);
          }
        }

        if (s1 === peg$FAILED) {
          s1 = null;
        }

        if (s1 !== peg$FAILED) {
          if (input.length > peg$currPos) {
            s2 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s2 = peg$FAILED;

            if (peg$silentFails === 0) {
              peg$fail(peg$c7);
            }
          }

          if (s2 !== peg$FAILED) {
            s3 = peg$c8(s2);

            if (s3) {
              s3 = void 0;
            } else {
              s3 = peg$FAILED;
            }

            if (s3 !== peg$FAILED) {
              if (input.charCodeAt(peg$currPos) === 10) {
                s4 = peg$c9;
                peg$currPos++;
              } else {
                s4 = peg$FAILED;

                if (peg$silentFails === 0) {
                  peg$fail(peg$c10);
                }
              }

              if (s4 !== peg$FAILED) {
                s1 = peg$c11(s2);
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }

        peg$silentFails--;

        if (s0 === peg$FAILED) {
          s1 = peg$FAILED;

          if (peg$silentFails === 0) {
            peg$fail(peg$c203);
          }
        }

        return s0;
      }

      function peg$parse_38INDENT() {
        var s0, s1, s2;
        peg$silentFails++;
        s0 = peg$currPos;

        if (input.length > peg$currPos) {
          s1 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s1 = peg$FAILED;

          if (peg$silentFails === 0) {
            peg$fail(peg$c7);
          }
        }

        if (s1 !== peg$FAILED) {
          s2 = peg$c21(s1);

          if (s2) {
            s2 = void 0;
          } else {
            s2 = peg$FAILED;
          }

          if (s2 !== peg$FAILED) {
            s1 = peg$c15(s1);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }

        peg$silentFails--;

        if (s0 === peg$FAILED) {
          s1 = peg$FAILED;

          if (peg$silentFails === 0) {
            peg$fail(peg$c204);
          }
        }

        return s0;
      }

      function peg$parse_39bracketedModifier() {
        var s0, s1, s2, s3, s4, s5, s6, s7;
        s0 = peg$currPos;
        s1 = [];
        s2 = peg$parse_39INDENT();

        while (s2 !== peg$FAILED) {
          s1.push(s2);
          s2 = peg$parse_39INDENT();
        }

        if (s1 !== peg$FAILED) {
          s2 = peg$parse_1start();

          if (s2 !== peg$FAILED) {
            s3 = peg$parse_21singleMustacheValue();

            if (s3 !== peg$FAILED) {
              s4 = [];
              s5 = peg$currPos;
              s6 = peg$parse_1start();

              if (s6 !== peg$FAILED) {
                s7 = peg$parse_10inlineComment();

                if (s7 !== peg$FAILED) {
                  s6 = [s6, s7];
                  s5 = s6;
                } else {
                  peg$currPos = s5;
                  s5 = peg$FAILED;
                }
              } else {
                peg$currPos = s5;
                s5 = peg$FAILED;
              }

              while (s5 !== peg$FAILED) {
                s4.push(s5);
                s5 = peg$currPos;
                s6 = peg$parse_1start();

                if (s6 !== peg$FAILED) {
                  s7 = peg$parse_10inlineComment();

                  if (s7 !== peg$FAILED) {
                    s6 = [s6, s7];
                    s5 = s6;
                  } else {
                    peg$currPos = s5;
                    s5 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s5;
                  s5 = peg$FAILED;
                }
              }

              if (s4 !== peg$FAILED) {
                s5 = [];
                s6 = peg$parse_39TERM();

                while (s6 !== peg$FAILED) {
                  s5.push(s6);
                  s6 = peg$parse_39TERM();
                }

                if (s5 !== peg$FAILED) {
                  s1 = peg$c205(s3);
                  s0 = s1;
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }

        return s0;
      }

      function peg$parse_39TERM() {
        var s0, s1, s2, s3, s4;
        peg$silentFails++;
        s0 = peg$currPos;

        if (input.charCodeAt(peg$currPos) === 13) {
          s1 = peg$c5;
          peg$currPos++;
        } else {
          s1 = peg$FAILED;

          if (peg$silentFails === 0) {
            peg$fail(peg$c6);
          }
        }

        if (s1 === peg$FAILED) {
          s1 = null;
        }

        if (s1 !== peg$FAILED) {
          if (input.length > peg$currPos) {
            s2 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s2 = peg$FAILED;

            if (peg$silentFails === 0) {
              peg$fail(peg$c7);
            }
          }

          if (s2 !== peg$FAILED) {
            s3 = peg$c8(s2);

            if (s3) {
              s3 = void 0;
            } else {
              s3 = peg$FAILED;
            }

            if (s3 !== peg$FAILED) {
              if (input.charCodeAt(peg$currPos) === 10) {
                s4 = peg$c9;
                peg$currPos++;
              } else {
                s4 = peg$FAILED;

                if (peg$silentFails === 0) {
                  peg$fail(peg$c10);
                }
              }

              if (s4 !== peg$FAILED) {
                s1 = peg$c11(s2);
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }

        peg$silentFails--;

        if (s0 === peg$FAILED) {
          s1 = peg$FAILED;

          if (peg$silentFails === 0) {
            peg$fail(peg$c206);
          }
        }

        return s0;
      }

      function peg$parse_39INDENT() {
        var s0, s1, s2;
        peg$silentFails++;
        s0 = peg$currPos;

        if (input.length > peg$currPos) {
          s1 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s1 = peg$FAILED;

          if (peg$silentFails === 0) {
            peg$fail(peg$c7);
          }
        }

        if (s1 !== peg$FAILED) {
          s2 = peg$c21(s1);

          if (s2) {
            s2 = void 0;
          } else {
            s2 = peg$FAILED;
          }

          if (s2 !== peg$FAILED) {
            s1 = peg$c15(s1);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }

        peg$silentFails--;

        if (s0 === peg$FAILED) {
          s1 = peg$FAILED;

          if (peg$silentFails === 0) {
            peg$fail(peg$c207);
          }
        }

        return s0;
      }

      function peg$parse_40cssIdentifier() {
        var s0;
        peg$silentFails++;
        s0 = peg$parse_40ident();
        peg$silentFails--;

        if (s0 === peg$FAILED) {

          if (peg$silentFails === 0) {
            peg$fail(peg$c208);
          }
        }

        return s0;
      }

      function peg$parse_40ident() {
        var s0, s1, s2;
        s0 = peg$currPos;
        s1 = [];
        s2 = peg$parse_23nmchar();

        if (s2 !== peg$FAILED) {
          while (s2 !== peg$FAILED) {
            s1.push(s2);
            s2 = peg$parse_23nmchar();
          }
        } else {
          s1 = peg$FAILED;
        }

        if (s1 !== peg$FAILED) {
          s0 = input.substring(s0, peg$currPos);
        } else {
          s0 = s1;
        }

        return s0;
      }

      function peg$parse_41idShorthand() {
        var s0, s1, s2;
        peg$silentFails++;
        s0 = peg$currPos;

        if (input.charCodeAt(peg$currPos) === 35) {
          s1 = peg$c210;
          peg$currPos++;
        } else {
          s1 = peg$FAILED;

          if (peg$silentFails === 0) {
            peg$fail(peg$c211);
          }
        }

        if (s1 !== peg$FAILED) {
          s2 = peg$parse_40cssIdentifier();

          if (s2 !== peg$FAILED) {
            s1 = peg$c212(s2);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }

        peg$silentFails--;

        if (s0 === peg$FAILED) {
          s1 = peg$FAILED;

          if (peg$silentFails === 0) {
            peg$fail(peg$c209);
          }
        }

        return s0;
      }

      function peg$parse_42classShorthand() {
        var s0, s1, s2;
        s0 = peg$currPos;

        if (input.charCodeAt(peg$currPos) === 46) {
          s1 = peg$c91;
          peg$currPos++;
        } else {
          s1 = peg$FAILED;

          if (peg$silentFails === 0) {
            peg$fail(peg$c92);
          }
        }

        if (s1 !== peg$FAILED) {
          s2 = peg$parse_40cssIdentifier();

          if (s2 !== peg$FAILED) {
            s1 = peg$c22(s2);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }

        return s0;
      }

      function peg$parse_43shorthandAttributes() {
        var s0, s1, s2, s3;
        s0 = peg$currPos;
        s1 = [];
        s2 = peg$currPos;
        s3 = peg$parse_41idShorthand();

        if (s3 !== peg$FAILED) {
          s3 = peg$c213(s3);
        }

        s2 = s3;

        if (s2 === peg$FAILED) {
          s2 = peg$currPos;
          s3 = peg$parse_42classShorthand();

          if (s3 !== peg$FAILED) {
            s3 = peg$c214(s3);
          }

          s2 = s3;
        }

        if (s2 !== peg$FAILED) {
          while (s2 !== peg$FAILED) {
            s1.push(s2);
            s2 = peg$currPos;
            s3 = peg$parse_41idShorthand();

            if (s3 !== peg$FAILED) {
              s3 = peg$c213(s3);
            }

            s2 = s3;

            if (s2 === peg$FAILED) {
              s2 = peg$currPos;
              s3 = peg$parse_42classShorthand();

              if (s3 !== peg$FAILED) {
                s3 = peg$c214(s3);
              }

              s2 = s3;
            }
          }
        } else {
          s1 = peg$FAILED;
        }

        if (s1 !== peg$FAILED) {
          s1 = peg$c215(s1);
        }

        s0 = s1;
        return s0;
      }

      function peg$parse_44inTagMustache() {
        var s0;
        s0 = peg$parse_44builtSingle();

        if (s0 === peg$FAILED) {
          s0 = peg$parse_12rawMustache();
        }

        return s0;
      }

      function peg$parse_44builtSingle() {
        var s0, s1;
        s0 = peg$currPos;
        s1 = peg$parse_21singleMustacheValue();

        if (s1 !== peg$FAILED) {
          s1 = peg$c216(s1);
        }

        s0 = s1;
        return s0;
      }

      function peg$parse_45openBracket() {
        var s0, s1, s2, s3, s4, s5;
        s0 = peg$currPos;

        if (input.charCodeAt(peg$currPos) === 91) {
          s1 = peg$c95;
          peg$currPos++;
        } else {
          s1 = peg$FAILED;

          if (peg$silentFails === 0) {
            peg$fail(peg$c96);
          }
        }

        if (s1 !== peg$FAILED) {
          s2 = peg$parse_1start();

          if (s2 !== peg$FAILED) {
            s3 = peg$parse_10inlineComment();

            if (s3 === peg$FAILED) {
              s3 = null;
            }

            if (s3 !== peg$FAILED) {
              s4 = [];
              s5 = peg$parse_45TERM();

              if (s5 !== peg$FAILED) {
                while (s5 !== peg$FAILED) {
                  s4.push(s5);
                  s5 = peg$parse_45TERM();
                }
              } else {
                s4 = peg$FAILED;
              }

              if (s4 !== peg$FAILED) {
                s1 = [s1, s2, s3, s4];
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }

        return s0;
      }

      function peg$parse_45closeBracket() {
        var s0, s1, s2, s3;
        s0 = peg$currPos;
        s1 = peg$parse_45DEDENT();

        if (s1 === peg$FAILED) {
          s1 = null;
        }

        if (s1 !== peg$FAILED) {
          s2 = peg$parse_1start();

          if (s2 !== peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 93) {
              s3 = peg$c99;
              peg$currPos++;
            } else {
              s3 = peg$FAILED;

              if (peg$silentFails === 0) {
                peg$fail(peg$c100);
              }
            }

            if (s3 !== peg$FAILED) {
              s1 = [s1, s2, s3];
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }

        return s0;
      }

      function peg$parse_45commentWithSpace() {
        var s0, s1, s2, s3;
        s0 = peg$currPos;
        s1 = peg$currPos;
        s2 = peg$parse_1start();

        if (s2 !== peg$FAILED) {
          s3 = peg$parse_7comment();

          if (s3 !== peg$FAILED) {
            s2 = [s2, s3];
            s1 = s2;
          } else {
            peg$currPos = s1;
            s1 = peg$FAILED;
          }
        } else {
          peg$currPos = s1;
          s1 = peg$FAILED;
        }

        if (s1 !== peg$FAILED) {
          s1 = peg$c3();
        }

        s0 = s1;
        return s0;
      }

      function peg$parse_45tagHtml() {
        var s0, s1, s2, s3, s4, s5, s6, s7, s8;
        s0 = peg$currPos;
        s1 = peg$parse_45htmlStart();

        if (s1 !== peg$FAILED) {
          s2 = [];
          s3 = peg$parse_44inTagMustache();

          while (s3 !== peg$FAILED) {
            s2.push(s3);
            s3 = peg$parse_44inTagMustache();
          }

          if (s2 !== peg$FAILED) {
            s3 = peg$parse_4start();

            if (s3 !== peg$FAILED) {
              s4 = peg$parse_45openBracket();

              if (s4 !== peg$FAILED) {
                s5 = [];
                s6 = peg$parse_39bracketedModifier();

                while (s6 !== peg$FAILED) {
                  s5.push(s6);
                  s6 = peg$parse_39bracketedModifier();
                }

                if (s5 !== peg$FAILED) {
                  s6 = [];
                  s7 = peg$parse_38bracketedAttribute();

                  if (s7 === peg$FAILED) {
                    s7 = peg$parse_45commentWithSpace();

                    if (s7 === peg$FAILED) {
                      s7 = peg$parse_2blankLine();
                    }
                  }

                  while (s7 !== peg$FAILED) {
                    s6.push(s7);
                    s7 = peg$parse_38bracketedAttribute();

                    if (s7 === peg$FAILED) {
                      s7 = peg$parse_45commentWithSpace();

                      if (s7 === peg$FAILED) {
                        s7 = peg$parse_2blankLine();
                      }
                    }
                  }

                  if (s6 !== peg$FAILED) {
                    s7 = peg$currPos;
                    peg$silentFails++;
                    s8 = peg$parse_45closeBracket();
                    peg$silentFails--;

                    if (s8 !== peg$FAILED) {
                      peg$currPos = s7;
                      s7 = void 0;
                    } else {
                      s7 = peg$FAILED;
                    }

                    if (s7 !== peg$FAILED) {
                      s1 = peg$c217(s1, s2, s5, s6);
                      s0 = s1;
                    } else {
                      peg$currPos = s0;
                      s0 = peg$FAILED;
                    }
                  } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }

        if (s0 === peg$FAILED) {
          s0 = peg$currPos;
          s1 = peg$parse_45htmlStart();

          if (s1 !== peg$FAILED) {
            s2 = [];
            s3 = peg$parse_44inTagMustache();

            while (s3 !== peg$FAILED) {
              s2.push(s3);
              s3 = peg$parse_44inTagMustache();
            }

            if (s2 !== peg$FAILED) {
              s3 = [];
              s4 = peg$parse_37attribute();

              while (s4 !== peg$FAILED) {
                s3.push(s4);
                s4 = peg$parse_37attribute();
              }

              if (s3 !== peg$FAILED) {
                s1 = peg$c218(s1, s2, s3);
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        }

        return s0;
      }

      function peg$parse_45htmlStart() {
        var s0, s1, s2, s3, s4;
        s0 = peg$currPos;
        s1 = peg$parse_45knownTagName();

        if (s1 === peg$FAILED) {
          s1 = null;
        }

        if (s1 !== peg$FAILED) {
          s2 = peg$parse_43shorthandAttributes();

          if (s2 === peg$FAILED) {
            s2 = null;
          }

          if (s2 !== peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 47) {
              s3 = peg$c27;
              peg$currPos++;
            } else {
              s3 = peg$FAILED;

              if (peg$silentFails === 0) {
                peg$fail(peg$c28);
              }
            }

            if (s3 === peg$FAILED) {
              s3 = null;
            }

            if (s3 !== peg$FAILED) {
              s4 = peg$c219(s1, s2);

              if (s4) {
                s4 = void 0;
              } else {
                s4 = peg$FAILED;
              }

              if (s4 !== peg$FAILED) {
                s1 = [s1, s2, s3, s4];
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }

        return s0;
      }

      function peg$parse_45knownTagName() {
        var s0, s1, s2;
        s0 = peg$currPos;
        s1 = peg$parse_19tagString();

        if (s1 !== peg$FAILED) {
          s2 = peg$c220(s1);

          if (s2) {
            s2 = void 0;
          } else {
            s2 = peg$FAILED;
          }

          if (s2 !== peg$FAILED) {
            s1 = peg$c221(s1);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }

        return s0;
      }

      function peg$parse_45TERM() {
        var s0, s1, s2, s3, s4;
        peg$silentFails++;
        s0 = peg$currPos;

        if (input.charCodeAt(peg$currPos) === 13) {
          s1 = peg$c5;
          peg$currPos++;
        } else {
          s1 = peg$FAILED;

          if (peg$silentFails === 0) {
            peg$fail(peg$c6);
          }
        }

        if (s1 === peg$FAILED) {
          s1 = null;
        }

        if (s1 !== peg$FAILED) {
          if (input.length > peg$currPos) {
            s2 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s2 = peg$FAILED;

            if (peg$silentFails === 0) {
              peg$fail(peg$c7);
            }
          }

          if (s2 !== peg$FAILED) {
            s3 = peg$c8(s2);

            if (s3) {
              s3 = void 0;
            } else {
              s3 = peg$FAILED;
            }

            if (s3 !== peg$FAILED) {
              if (input.charCodeAt(peg$currPos) === 10) {
                s4 = peg$c9;
                peg$currPos++;
              } else {
                s4 = peg$FAILED;

                if (peg$silentFails === 0) {
                  peg$fail(peg$c10);
                }
              }

              if (s4 !== peg$FAILED) {
                s1 = peg$c11(s2);
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }

        peg$silentFails--;

        if (s0 === peg$FAILED) {
          s1 = peg$FAILED;

          if (peg$silentFails === 0) {
            peg$fail(peg$c222);
          }
        }

        return s0;
      }

      function peg$parse_45DEDENT() {
        var s0, s1, s2;
        peg$silentFails++;
        s0 = peg$currPos;

        if (input.length > peg$currPos) {
          s1 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s1 = peg$FAILED;

          if (peg$silentFails === 0) {
            peg$fail(peg$c7);
          }
        }

        if (s1 !== peg$FAILED) {
          s2 = peg$c14(s1);

          if (s2) {
            s2 = void 0;
          } else {
            s2 = peg$FAILED;
          }

          if (s2 !== peg$FAILED) {
            s1 = peg$c15(s1);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }

        peg$silentFails--;

        if (s0 === peg$FAILED) {
          s1 = peg$FAILED;

          if (peg$silentFails === 0) {
            peg$fail(peg$c224);
          }
        }

        return s0;
      }

      function peg$parse_46blockEnd() {
        var s0;
        peg$silentFails++;

        if (input.charCodeAt(peg$currPos) === 124) {
          s0 = peg$c157;
          peg$currPos++;
        } else {
          s0 = peg$FAILED;

          if (peg$silentFails === 0) {
            peg$fail(peg$c158);
          }
        }

        peg$silentFails--;

        if (s0 === peg$FAILED) {

          if (peg$silentFails === 0) {
            peg$fail(peg$c225);
          }
        }

        return s0;
      }

      function peg$parse_47blockParams() {
        var s0, s1, s2, s3, s4;
        s0 = peg$currPos;
        s1 = peg$parse_29blockStart();

        if (s1 !== peg$FAILED) {
          s2 = peg$parse_1start();

          if (s2 !== peg$FAILED) {
            s3 = [];
            s4 = peg$parse_47blockParamName();

            if (s4 !== peg$FAILED) {
              while (s4 !== peg$FAILED) {
                s3.push(s4);
                s4 = peg$parse_47blockParamName();
              }
            } else {
              s3 = peg$FAILED;
            }

            if (s3 !== peg$FAILED) {
              s4 = peg$parse_46blockEnd();

              if (s4 !== peg$FAILED) {
                s1 = peg$c226(s3);
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }

        return s0;
      }

      function peg$parse_47blockParamName() {
        var s0;
        peg$silentFails++;
        s0 = peg$parse_31newMustacheAttrValue();
        peg$silentFails--;

        if (s0 === peg$FAILED) {

          if (peg$silentFails === 0) {
            peg$fail(peg$c227);
          }
        }

        return s0;
      }

      function peg$parse_48openBracket() {
        var s0, s1, s2, s3, s4, s5;
        s0 = peg$currPos;

        if (input.charCodeAt(peg$currPos) === 91) {
          s1 = peg$c95;
          peg$currPos++;
        } else {
          s1 = peg$FAILED;

          if (peg$silentFails === 0) {
            peg$fail(peg$c96);
          }
        }

        if (s1 !== peg$FAILED) {
          s2 = peg$parse_1start();

          if (s2 !== peg$FAILED) {
            s3 = peg$parse_10inlineComment();

            if (s3 === peg$FAILED) {
              s3 = null;
            }

            if (s3 !== peg$FAILED) {
              s4 = [];
              s5 = peg$parse_48TERM();

              if (s5 !== peg$FAILED) {
                while (s5 !== peg$FAILED) {
                  s4.push(s5);
                  s5 = peg$parse_48TERM();
                }
              } else {
                s4 = peg$FAILED;
              }

              if (s4 !== peg$FAILED) {
                s1 = [s1, s2, s3, s4];
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }

        return s0;
      }

      function peg$parse_48closeBracket() {
        var s0, s1, s2, s3;
        peg$silentFails++;
        s0 = peg$currPos;
        s1 = peg$parse_48DEDENT();

        if (s1 === peg$FAILED) {
          s1 = null;
        }

        if (s1 !== peg$FAILED) {
          s2 = peg$parse_1start();

          if (s2 !== peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 93) {
              s3 = peg$c99;
              peg$currPos++;
            } else {
              s3 = peg$FAILED;

              if (peg$silentFails === 0) {
                peg$fail(peg$c100);
              }
            }

            if (s3 !== peg$FAILED) {
              s1 = [s1, s2, s3];
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }

        peg$silentFails--;

        if (s0 === peg$FAILED) {
          s1 = peg$FAILED;

          if (peg$silentFails === 0) {
            peg$fail(peg$c228);
          }
        }

        return s0;
      }

      function peg$parse_48commentWithSpace() {
        var s0, s1, s2, s3;
        s0 = peg$currPos;
        s1 = peg$currPos;
        s2 = peg$parse_1start();

        if (s2 !== peg$FAILED) {
          s3 = peg$parse_7comment();

          if (s3 !== peg$FAILED) {
            s2 = [s2, s3];
            s1 = s2;
          } else {
            peg$currPos = s1;
            s1 = peg$FAILED;
          }
        } else {
          peg$currPos = s1;
          s1 = peg$FAILED;
        }

        if (s1 !== peg$FAILED) {
          s1 = peg$c3();
        }

        s0 = s1;
        return s0;
      }

      function peg$parse_48inHtmlTag() {
        var s0, s1, s2, s3, s4, s5, s6, s7, s8, s9;
        s0 = peg$currPos;
        s1 = peg$parse_48htmlStart();

        if (s1 !== peg$FAILED) {
          s2 = [];
          s3 = peg$parse_44inTagMustache();

          while (s3 !== peg$FAILED) {
            s2.push(s3);
            s3 = peg$parse_44inTagMustache();
          }

          if (s2 !== peg$FAILED) {
            s3 = peg$parse_48blockParams();

            if (s3 === peg$FAILED) {
              s3 = null;
            }

            if (s3 !== peg$FAILED) {
              s4 = peg$parse_4start();

              if (s4 !== peg$FAILED) {
                s5 = peg$parse_48openBracket();

                if (s5 !== peg$FAILED) {
                  s6 = [];
                  s7 = peg$parse_39bracketedModifier();

                  while (s7 !== peg$FAILED) {
                    s6.push(s7);
                    s7 = peg$parse_39bracketedModifier();
                  }

                  if (s6 !== peg$FAILED) {
                    s7 = [];
                    s8 = peg$parse_38bracketedAttribute();

                    if (s8 === peg$FAILED) {
                      s8 = peg$parse_48commentWithSpace();

                      if (s8 === peg$FAILED) {
                        s8 = peg$parse_2blankLine();
                      }
                    }

                    while (s8 !== peg$FAILED) {
                      s7.push(s8);
                      s8 = peg$parse_38bracketedAttribute();

                      if (s8 === peg$FAILED) {
                        s8 = peg$parse_48commentWithSpace();

                        if (s8 === peg$FAILED) {
                          s8 = peg$parse_2blankLine();
                        }
                      }
                    }

                    if (s7 !== peg$FAILED) {
                      s8 = peg$currPos;
                      peg$silentFails++;
                      s9 = peg$parse_48closeBracket();
                      peg$silentFails--;

                      if (s9 !== peg$FAILED) {
                        peg$currPos = s8;
                        s8 = void 0;
                      } else {
                        s8 = peg$FAILED;
                      }

                      if (s8 !== peg$FAILED) {
                        s1 = peg$c229(s1, s2, s3, s6, s7);
                        s0 = s1;
                      } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                      }
                    } else {
                      peg$currPos = s0;
                      s0 = peg$FAILED;
                    }
                  } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }

        if (s0 === peg$FAILED) {
          s0 = peg$currPos;
          s1 = peg$parse_48htmlStart();

          if (s1 !== peg$FAILED) {
            s2 = [];
            s3 = peg$parse_44inTagMustache();

            while (s3 !== peg$FAILED) {
              s2.push(s3);
              s3 = peg$parse_44inTagMustache();
            }

            if (s2 !== peg$FAILED) {
              s3 = [];
              s4 = peg$parse_37attribute();

              while (s4 !== peg$FAILED) {
                s3.push(s4);
                s4 = peg$parse_37attribute();
              }

              if (s3 !== peg$FAILED) {
                s4 = peg$parse_48blockParams();

                if (s4 === peg$FAILED) {
                  s4 = null;
                }

                if (s4 !== peg$FAILED) {
                  s1 = peg$c230(s1, s2, s3, s4);
                  s0 = s1;
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        }

        return s0;
      }

      function peg$parse_48htmlStart() {
        var s0, s1, s2, s3, s4;
        s0 = peg$currPos;
        s1 = peg$parse_48componentTag();

        if (s1 === peg$FAILED) {
          s1 = null;
        }

        if (s1 !== peg$FAILED) {
          s2 = peg$parse_43shorthandAttributes();

          if (s2 === peg$FAILED) {
            s2 = null;
          }

          if (s2 !== peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 47) {
              s3 = peg$c27;
              peg$currPos++;
            } else {
              s3 = peg$FAILED;

              if (peg$silentFails === 0) {
                peg$fail(peg$c28);
              }
            }

            if (s3 === peg$FAILED) {
              s3 = null;
            }

            if (s3 !== peg$FAILED) {
              s4 = peg$c231(s1, s2);

              if (s4) {
                s4 = void 0;
              } else {
                s4 = peg$FAILED;
              }

              if (s4 !== peg$FAILED) {
                s1 = [s1, s2, s3, s4];
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }

        return s0;
      }

      function peg$parse_48componentTag() {
        var s0, s1, s2, s3;
        s0 = peg$currPos;

        if (input.charCodeAt(peg$currPos) === 37) {
          s1 = peg$c232;
          peg$currPos++;
        } else {
          s1 = peg$FAILED;

          if (peg$silentFails === 0) {
            peg$fail(peg$c233);
          }
        }

        if (s1 !== peg$FAILED) {
          s2 = peg$parse_1start();

          if (s2 !== peg$FAILED) {
            s3 = peg$parse_19tagString();

            if (s3 !== peg$FAILED) {
              s1 = peg$c234(s3);
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }

        return s0;
      }

      function peg$parse_48blockParams() {
        var s0, s1, s2;
        s0 = peg$currPos;
        s1 = peg$parse_1start();

        if (s1 !== peg$FAILED) {
          s2 = peg$parse_47blockParams();

          if (s2 !== peg$FAILED) {
            s1 = peg$c226(s2);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }

        return s0;
      }

      function peg$parse_48TERM() {
        var s0, s1, s2, s3, s4;
        peg$silentFails++;
        s0 = peg$currPos;

        if (input.charCodeAt(peg$currPos) === 13) {
          s1 = peg$c5;
          peg$currPos++;
        } else {
          s1 = peg$FAILED;

          if (peg$silentFails === 0) {
            peg$fail(peg$c6);
          }
        }

        if (s1 === peg$FAILED) {
          s1 = null;
        }

        if (s1 !== peg$FAILED) {
          if (input.length > peg$currPos) {
            s2 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s2 = peg$FAILED;

            if (peg$silentFails === 0) {
              peg$fail(peg$c7);
            }
          }

          if (s2 !== peg$FAILED) {
            s3 = peg$c8(s2);

            if (s3) {
              s3 = void 0;
            } else {
              s3 = peg$FAILED;
            }

            if (s3 !== peg$FAILED) {
              if (input.charCodeAt(peg$currPos) === 10) {
                s4 = peg$c9;
                peg$currPos++;
              } else {
                s4 = peg$FAILED;

                if (peg$silentFails === 0) {
                  peg$fail(peg$c10);
                }
              }

              if (s4 !== peg$FAILED) {
                s1 = peg$c11(s2);
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }

        peg$silentFails--;

        if (s0 === peg$FAILED) {
          s1 = peg$FAILED;

          if (peg$silentFails === 0) {
            peg$fail(peg$c235);
          }
        }

        return s0;
      }

      function peg$parse_48DEDENT() {
        var s0, s1, s2;
        peg$silentFails++;
        s0 = peg$currPos;

        if (input.length > peg$currPos) {
          s1 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s1 = peg$FAILED;

          if (peg$silentFails === 0) {
            peg$fail(peg$c7);
          }
        }

        if (s1 !== peg$FAILED) {
          s2 = peg$c14(s1);

          if (s2) {
            s2 = void 0;
          } else {
            s2 = peg$FAILED;
          }

          if (s2 !== peg$FAILED) {
            s1 = peg$c15(s1);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }

        peg$silentFails--;

        if (s0 === peg$FAILED) {
          s1 = peg$FAILED;

          if (peg$silentFails === 0) {
            peg$fail(peg$c237);
          }
        }

        return s0;
      }

      function peg$parse_49start() {
        var s0;
        s0 = peg$parse_45tagHtml();

        if (s0 === peg$FAILED) {
          s0 = peg$parse_48inHtmlTag();
        }

        return s0;
      }

      function peg$parse_50htmlNestedTextNodes() {
        var s0, s1, s2, s3, s4, s5, s6;
        s0 = peg$currPos;

        if (input.charCodeAt(peg$currPos) === 32) {
          s1 = peg$c39;
          peg$currPos++;
        } else {
          s1 = peg$FAILED;

          if (peg$silentFails === 0) {
            peg$fail(peg$c40);
          }
        }

        if (s1 !== peg$FAILED) {
          s2 = peg$parse_14textNodes();

          if (s2 !== peg$FAILED) {
            s3 = peg$currPos;
            s4 = peg$parse_5indentation();

            if (s4 !== peg$FAILED) {
              s5 = [];
              s6 = peg$parse_15whitespaceableTextNodes();

              if (s6 !== peg$FAILED) {
                while (s6 !== peg$FAILED) {
                  s5.push(s6);
                  s6 = peg$parse_15whitespaceableTextNodes();
                }
              } else {
                s5 = peg$FAILED;
              }

              if (s5 !== peg$FAILED) {
                s6 = peg$parse_50DEDENT();

                if (s6 !== peg$FAILED) {
                  s4 = [s4, s5, s6];
                  s3 = s4;
                } else {
                  peg$currPos = s3;
                  s3 = peg$FAILED;
                }
              } else {
                peg$currPos = s3;
                s3 = peg$FAILED;
              }
            } else {
              peg$currPos = s3;
              s3 = peg$FAILED;
            }

            if (s3 === peg$FAILED) {
              s3 = null;
            }

            if (s3 !== peg$FAILED) {
              s1 = peg$c238(s2, s3);
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }

        return s0;
      }

      function peg$parse_50DEDENT() {
        var s0, s1, s2;
        peg$silentFails++;
        s0 = peg$currPos;

        if (input.length > peg$currPos) {
          s1 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s1 = peg$FAILED;

          if (peg$silentFails === 0) {
            peg$fail(peg$c7);
          }
        }

        if (s1 !== peg$FAILED) {
          s2 = peg$c14(s1);

          if (s2) {
            s2 = void 0;
          } else {
            s2 = peg$FAILED;
          }

          if (s2 !== peg$FAILED) {
            s1 = peg$c15(s1);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }

        peg$silentFails--;

        if (s0 === peg$FAILED) {
          s1 = peg$FAILED;

          if (peg$silentFails === 0) {
            peg$fail(peg$c239);
          }
        }

        return s0;
      }

      function peg$parse_51mustacheAttrs() {
        var s0, s1;
        s0 = peg$parse_51bracketedAttrs();

        if (s0 === peg$FAILED) {
          s0 = [];
          s1 = peg$parse_51mustacheAttr();

          while (s1 !== peg$FAILED) {
            s0.push(s1);
            s1 = peg$parse_51mustacheAttr();
          }
        }

        return s0;
      }

      function peg$parse_51bracketedAttrs() {
        var s0, s1, s2, s3, s4, s5;
        s0 = peg$currPos;
        s1 = peg$parse_31newMustacheAttrValue();

        if (s1 === peg$FAILED) {
          s1 = null;
        }

        if (s1 !== peg$FAILED) {
          s2 = peg$parse_51openBracket();

          if (s2 !== peg$FAILED) {
            s3 = [];
            s4 = peg$parse_51bracketedAttr();

            if (s4 === peg$FAILED) {
              s4 = peg$parse_51commentWithSpace();

              if (s4 === peg$FAILED) {
                s4 = peg$parse_2blankLine();
              }
            }

            while (s4 !== peg$FAILED) {
              s3.push(s4);
              s4 = peg$parse_51bracketedAttr();

              if (s4 === peg$FAILED) {
                s4 = peg$parse_51commentWithSpace();

                if (s4 === peg$FAILED) {
                  s4 = peg$parse_2blankLine();
                }
              }
            }

            if (s3 !== peg$FAILED) {
              s4 = peg$currPos;
              peg$silentFails++;
              s5 = peg$parse_51closeBracket();
              peg$silentFails--;

              if (s5 !== peg$FAILED) {
                peg$currPos = s4;
                s4 = void 0;
              } else {
                s4 = peg$FAILED;
              }

              if (s4 !== peg$FAILED) {
                s1 = peg$c240(s1, s3);
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }

        return s0;
      }

      function peg$parse_51commentWithSpace() {
        var s0, s1, s2, s3;
        s0 = peg$currPos;
        s1 = peg$currPos;
        s2 = peg$parse_1start();

        if (s2 !== peg$FAILED) {
          s3 = peg$parse_7comment();

          if (s3 !== peg$FAILED) {
            s2 = [s2, s3];
            s1 = s2;
          } else {
            peg$currPos = s1;
            s1 = peg$FAILED;
          }
        } else {
          peg$currPos = s1;
          s1 = peg$FAILED;
        }

        if (s1 !== peg$FAILED) {
          s1 = peg$c3();
        }

        s0 = s1;
        return s0;
      }

      function peg$parse_51bracketedAttr() {
        var s0, s1, s2, s3;
        s0 = peg$currPos;
        s1 = peg$parse_1start();

        if (s1 !== peg$FAILED) {
          s2 = peg$parse_51mustacheAttr();

          if (s2 !== peg$FAILED) {
            s3 = peg$parse_51TERM();

            if (s3 === peg$FAILED) {
              s3 = null;
            }

            if (s3 !== peg$FAILED) {
              s1 = peg$c168(s2);
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }

        return s0;
      }

      function peg$parse_51openBracket() {
        var s0, s1, s2, s3, s4, s5;
        s0 = peg$currPos;

        if (input.charCodeAt(peg$currPos) === 91) {
          s1 = peg$c95;
          peg$currPos++;
        } else {
          s1 = peg$FAILED;

          if (peg$silentFails === 0) {
            peg$fail(peg$c96);
          }
        }

        if (s1 !== peg$FAILED) {
          s2 = peg$parse_1start();

          if (s2 !== peg$FAILED) {
            s3 = peg$parse_10inlineComment();

            if (s3 === peg$FAILED) {
              s3 = null;
            }

            if (s3 !== peg$FAILED) {
              s4 = [];
              s5 = peg$parse_51TERM();

              if (s5 !== peg$FAILED) {
                while (s5 !== peg$FAILED) {
                  s4.push(s5);
                  s5 = peg$parse_51TERM();
                }
              } else {
                s4 = peg$FAILED;
              }

              if (s4 !== peg$FAILED) {
                s5 = peg$parse_51INDENT();

                if (s5 !== peg$FAILED) {
                  s1 = [s1, s2, s3, s4, s5];
                  s0 = s1;
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }

        return s0;
      }

      function peg$parse_51closeBracket() {
        var s0, s1, s2, s3;
        peg$silentFails++;
        s0 = peg$currPos;
        s1 = peg$parse_51DEDENT();

        if (s1 === peg$FAILED) {
          s1 = null;
        }

        if (s1 !== peg$FAILED) {
          s2 = peg$parse_1start();

          if (s2 !== peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 93) {
              s3 = peg$c99;
              peg$currPos++;
            } else {
              s3 = peg$FAILED;

              if (peg$silentFails === 0) {
                peg$fail(peg$c100);
              }
            }

            if (s3 !== peg$FAILED) {
              s1 = [s1, s2, s3];
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }

        peg$silentFails--;

        if (s0 === peg$FAILED) {
          s1 = peg$FAILED;

          if (peg$silentFails === 0) {
            peg$fail(peg$c241);
          }
        }

        return s0;
      }

      function peg$parse_51mustacheAttr() {
        var s0;
        s0 = peg$parse_51mustacheKeyValue();

        if (s0 === peg$FAILED) {
          s0 = peg$parse_51subexpression();

          if (s0 === peg$FAILED) {
            s0 = peg$parse_31newMustacheAttrValue();
          }
        }

        return s0;
      }

      function peg$parse_51mustacheKeyValue() {
        var s0, s1, s2, s3, s4, s5;
        s0 = peg$currPos;
        s1 = peg$parse_26key();

        if (s1 !== peg$FAILED) {
          s2 = peg$parse_1start();

          if (s2 !== peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 61) {
              s3 = peg$c30;
              peg$currPos++;
            } else {
              s3 = peg$FAILED;

              if (peg$silentFails === 0) {
                peg$fail(peg$c31);
              }
            }

            if (s3 !== peg$FAILED) {
              s4 = peg$parse_1start();

              if (s4 !== peg$FAILED) {
                s5 = peg$parse_51subexpression();

                if (s5 === peg$FAILED) {
                  s5 = peg$parse_31newMustacheAttrValue();
                }

                if (s5 !== peg$FAILED) {
                  s1 = peg$c170(s1, s5);
                  s0 = s1;
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }

        return s0;
      }

      function peg$parse_51subexpression() {
        var s0, s1, s2, s3, s4, s5, s6, s7, s8;
        s0 = peg$currPos;
        s1 = peg$parse_1start();

        if (s1 !== peg$FAILED) {
          if (input.charCodeAt(peg$currPos) === 40) {
            s2 = peg$c171;
            peg$currPos++;
          } else {
            s2 = peg$FAILED;

            if (peg$silentFails === 0) {
              peg$fail(peg$c172);
            }
          }

          if (s2 !== peg$FAILED) {
            s3 = peg$parse_1start();

            if (s3 !== peg$FAILED) {
              s4 = peg$parse_31newMustacheAttrValue();

              if (s4 !== peg$FAILED) {
                s5 = peg$parse_1start();

                if (s5 !== peg$FAILED) {
                  s6 = peg$parse_51subexpressionBracketAttrs();

                  if (s6 === peg$FAILED) {
                    s6 = [];
                    s7 = peg$parse_51subexpressionAttrs();

                    if (s7 !== peg$FAILED) {
                      while (s7 !== peg$FAILED) {
                        s6.push(s7);
                        s7 = peg$parse_51subexpressionAttrs();
                      }
                    } else {
                      s6 = peg$FAILED;
                    }
                  }

                  if (s6 === peg$FAILED) {
                    s6 = null;
                  }

                  if (s6 !== peg$FAILED) {
                    s7 = peg$parse_51subexpressionClose();

                    if (s7 !== peg$FAILED) {
                      s8 = peg$parse_1start();

                      if (s8 !== peg$FAILED) {
                        s1 = peg$c173(s4, s6);
                        s0 = s1;
                      } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                      }
                    } else {
                      peg$currPos = s0;
                      s0 = peg$FAILED;
                    }
                  } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }

        return s0;
      }

      function peg$parse_51subexpressionClose() {
        var s0, s1, s2;
        peg$silentFails++;
        s0 = peg$currPos;
        s1 = peg$parse_1start();

        if (s1 !== peg$FAILED) {
          if (input.charCodeAt(peg$currPos) === 41) {
            s2 = peg$c175;
            peg$currPos++;
          } else {
            s2 = peg$FAILED;

            if (peg$silentFails === 0) {
              peg$fail(peg$c176);
            }
          }

          if (s2 !== peg$FAILED) {
            s1 = [s1, s2];
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }

        peg$silentFails--;

        if (s0 === peg$FAILED) {
          s1 = peg$FAILED;

          if (peg$silentFails === 0) {
            peg$fail(peg$c242);
          }
        }

        return s0;
      }

      function peg$parse_51subexpressionBracketAttrs() {
        var s0, s1, s2;
        peg$silentFails++;
        s0 = peg$currPos;
        s1 = peg$parse_51bracketedAttrs();

        if (s1 !== peg$FAILED) {
          s2 = peg$parse_51closeBracket();

          if (s2 !== peg$FAILED) {
            s1 = peg$c178(s1);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }

        peg$silentFails--;

        if (s0 === peg$FAILED) {
          s1 = peg$FAILED;

          if (peg$silentFails === 0) {
            peg$fail(peg$c243);
          }
        }

        return s0;
      }

      function peg$parse_51subexpressionAttrs() {
        var s0;
        s0 = peg$parse_51mustacheKeyValue();

        if (s0 === peg$FAILED) {
          s0 = peg$parse_51subexpression();

          if (s0 === peg$FAILED) {
            s0 = peg$parse_31newMustacheAttrValue();
          }
        }

        return s0;
      }

      function peg$parse_51INDENT() {
        var s0, s1, s2;
        peg$silentFails++;
        s0 = peg$currPos;

        if (input.length > peg$currPos) {
          s1 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s1 = peg$FAILED;

          if (peg$silentFails === 0) {
            peg$fail(peg$c7);
          }
        }

        if (s1 !== peg$FAILED) {
          s2 = peg$c21(s1);

          if (s2) {
            s2 = void 0;
          } else {
            s2 = peg$FAILED;
          }

          if (s2 !== peg$FAILED) {
            s1 = peg$c15(s1);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }

        peg$silentFails--;

        if (s0 === peg$FAILED) {
          s1 = peg$FAILED;

          if (peg$silentFails === 0) {
            peg$fail(peg$c244);
          }
        }

        return s0;
      }

      function peg$parse_51DEDENT() {
        var s0, s1, s2;
        peg$silentFails++;
        s0 = peg$currPos;

        if (input.length > peg$currPos) {
          s1 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s1 = peg$FAILED;

          if (peg$silentFails === 0) {
            peg$fail(peg$c7);
          }
        }

        if (s1 !== peg$FAILED) {
          s2 = peg$c14(s1);

          if (s2) {
            s2 = void 0;
          } else {
            s2 = peg$FAILED;
          }

          if (s2 !== peg$FAILED) {
            s1 = peg$c15(s1);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }

        peg$silentFails--;

        if (s0 === peg$FAILED) {
          s1 = peg$FAILED;

          if (peg$silentFails === 0) {
            peg$fail(peg$c245);
          }
        }

        return s0;
      }

      function peg$parse_51TERM() {
        var s0, s1, s2, s3, s4;
        peg$silentFails++;
        s0 = peg$currPos;

        if (input.charCodeAt(peg$currPos) === 13) {
          s1 = peg$c5;
          peg$currPos++;
        } else {
          s1 = peg$FAILED;

          if (peg$silentFails === 0) {
            peg$fail(peg$c6);
          }
        }

        if (s1 === peg$FAILED) {
          s1 = null;
        }

        if (s1 !== peg$FAILED) {
          if (input.length > peg$currPos) {
            s2 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s2 = peg$FAILED;

            if (peg$silentFails === 0) {
              peg$fail(peg$c7);
            }
          }

          if (s2 !== peg$FAILED) {
            s3 = peg$c8(s2);

            if (s3) {
              s3 = void 0;
            } else {
              s3 = peg$FAILED;
            }

            if (s3 !== peg$FAILED) {
              if (input.charCodeAt(peg$currPos) === 10) {
                s4 = peg$c9;
                peg$currPos++;
              } else {
                s4 = peg$FAILED;

                if (peg$silentFails === 0) {
                  peg$fail(peg$c10);
                }
              }

              if (s4 !== peg$FAILED) {
                s1 = peg$c11(s2);
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }

        peg$silentFails--;

        if (s0 === peg$FAILED) {
          s1 = peg$FAILED;

          if (peg$silentFails === 0) {
            peg$fail(peg$c246);
          }
        }

        return s0;
      }

      function peg$parse_52newMustacheShortHand() {
        var s0;
        s0 = peg$parse_52shortHandTagName();

        if (s0 === peg$FAILED) {
          s0 = peg$parse_52shortHandIdName();

          if (s0 === peg$FAILED) {
            s0 = peg$parse_52shortHandClassName();
          }
        }

        return s0;
      }

      function peg$parse_52shortHandTagName() {
        var s0, s1, s2;
        peg$silentFails++;
        s0 = peg$currPos;

        if (input.charCodeAt(peg$currPos) === 37) {
          s1 = peg$c232;
          peg$currPos++;
        } else {
          s1 = peg$FAILED;

          if (peg$silentFails === 0) {
            peg$fail(peg$c233);
          }
        }

        if (s1 !== peg$FAILED) {
          s2 = peg$parse_52newMustacheShortHandName();

          if (s2 !== peg$FAILED) {
            s1 = peg$c248(s2);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }

        peg$silentFails--;

        if (s0 === peg$FAILED) {
          s1 = peg$FAILED;

          if (peg$silentFails === 0) {
            peg$fail(peg$c247);
          }
        }

        return s0;
      }

      function peg$parse_52shortHandIdName() {
        var s0, s1, s2;
        peg$silentFails++;
        s0 = peg$currPos;

        if (input.charCodeAt(peg$currPos) === 35) {
          s1 = peg$c210;
          peg$currPos++;
        } else {
          s1 = peg$FAILED;

          if (peg$silentFails === 0) {
            peg$fail(peg$c211);
          }
        }

        if (s1 !== peg$FAILED) {
          s2 = peg$parse_52newMustacheShortHandName();

          if (s2 !== peg$FAILED) {
            s1 = peg$c250(s2);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }

        peg$silentFails--;

        if (s0 === peg$FAILED) {
          s1 = peg$FAILED;

          if (peg$silentFails === 0) {
            peg$fail(peg$c249);
          }
        }

        return s0;
      }

      function peg$parse_52shortHandClassName() {
        var s0, s1, s2;
        peg$silentFails++;
        s0 = peg$currPos;

        if (input.charCodeAt(peg$currPos) === 46) {
          s1 = peg$c91;
          peg$currPos++;
        } else {
          s1 = peg$FAILED;

          if (peg$silentFails === 0) {
            peg$fail(peg$c92);
          }
        }

        if (s1 !== peg$FAILED) {
          s2 = peg$parse_52newMustacheShortHandName();

          if (s2 !== peg$FAILED) {
            s1 = peg$c252(s2);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }

        peg$silentFails--;

        if (s0 === peg$FAILED) {
          s1 = peg$FAILED;

          if (peg$silentFails === 0) {
            peg$fail(peg$c251);
          }
        }

        return s0;
      }

      function peg$parse_52newMustacheShortHandName() {
        var s0, s1, s2;
        s0 = peg$currPos;
        s1 = [];

        if (peg$c253.test(input.charAt(peg$currPos))) {
          s2 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s2 = peg$FAILED;

          if (peg$silentFails === 0) {
            peg$fail(peg$c254);
          }
        }

        if (s2 !== peg$FAILED) {
          while (s2 !== peg$FAILED) {
            s1.push(s2);

            if (peg$c253.test(input.charAt(peg$currPos))) {
              s2 = input.charAt(peg$currPos);
              peg$currPos++;
            } else {
              s2 = peg$FAILED;

              if (peg$silentFails === 0) {
                peg$fail(peg$c254);
              }
            }
          }
        } else {
          s1 = peg$FAILED;
        }

        if (s1 !== peg$FAILED) {
          s0 = input.substring(s0, peg$currPos);
        } else {
          s0 = s1;
        }

        return s0;
      }

      function peg$parse_53modifierChar() {
        var s0;
        s0 = peg$parse_53unboundChar();

        if (s0 === peg$FAILED) {
          s0 = peg$parse_53conditionalChar();
        }

        return s0;
      }

      function peg$parse_53unboundChar() {
        var s0;
        peg$silentFails++;

        if (input.charCodeAt(peg$currPos) === 33) {
          s0 = peg$c186;
          peg$currPos++;
        } else {
          s0 = peg$FAILED;

          if (peg$silentFails === 0) {
            peg$fail(peg$c187);
          }
        }

        peg$silentFails--;

        if (s0 === peg$FAILED) {

          if (peg$silentFails === 0) {
            peg$fail(peg$c255);
          }
        }

        return s0;
      }

      function peg$parse_53conditionalChar() {
        var s0;
        peg$silentFails++;

        if (input.charCodeAt(peg$currPos) === 63) {
          s0 = peg$c257;
          peg$currPos++;
        } else {
          s0 = peg$FAILED;

          if (peg$silentFails === 0) {
            peg$fail(peg$c258);
          }
        }

        peg$silentFails--;

        if (s0 === peg$FAILED) {

          if (peg$silentFails === 0) {
            peg$fail(peg$c256);
          }
        }

        return s0;
      }

      function peg$parse_54newMustache() {
        var s0, s1, s2, s3, s4;
        s0 = peg$currPos;
        s1 = peg$parse_54newMustacheStart();

        if (s1 !== peg$FAILED) {
          s2 = peg$parse_1start();

          if (s2 !== peg$FAILED) {
            s3 = peg$parse_51mustacheAttrs();

            if (s3 !== peg$FAILED) {
              s4 = peg$parse_47blockParams();

              if (s4 === peg$FAILED) {
                s4 = null;
              }

              if (s4 !== peg$FAILED) {
                s1 = peg$c259(s1, s3, s4);
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }

        return s0;
      }

      function peg$parse_54newMustacheStart() {
        var s0, s1, s2, s3, s4;
        s0 = peg$currPos;
        s1 = peg$parse_54newMustacheName();

        if (s1 !== peg$FAILED) {
          s2 = peg$parse_1start();

          if (s2 !== peg$FAILED) {
            s3 = [];
            s4 = peg$parse_52newMustacheShortHand();

            while (s4 !== peg$FAILED) {
              s3.push(s4);
              s4 = peg$parse_52newMustacheShortHand();
            }

            if (s3 !== peg$FAILED) {
              s1 = peg$c260(s1, s3);
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }

        return s0;
      }

      function peg$parse_54newMustacheName() {
        var s0, s1, s2, s3, s4;
        s0 = peg$currPos;
        s1 = peg$currPos;
        peg$silentFails++;
        s2 = peg$parse_54invalidNameStartChar();
        peg$silentFails--;

        if (s2 === peg$FAILED) {
          s1 = void 0;
        } else {
          peg$currPos = s1;
          s1 = peg$FAILED;
        }

        if (s1 !== peg$FAILED) {
          s2 = peg$currPos;
          s3 = [];
          s4 = peg$parse_28newMustacheNameChar();

          if (s4 !== peg$FAILED) {
            while (s4 !== peg$FAILED) {
              s3.push(s4);
              s4 = peg$parse_28newMustacheNameChar();
            }
          } else {
            s3 = peg$FAILED;
          }

          if (s3 !== peg$FAILED) {
            s2 = input.substring(s2, peg$currPos);
          } else {
            s2 = s3;
          }

          if (s2 !== peg$FAILED) {
            s3 = peg$parse_53modifierChar();

            if (s3 === peg$FAILED) {
              s3 = null;
            }

            if (s3 !== peg$FAILED) {
              s1 = peg$c261(s2, s3);
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }

        return s0;
      }

      function peg$parse_54invalidNameStartChar() {
        var s0;
        peg$silentFails++;

        if (input.charCodeAt(peg$currPos) === 46) {
          s0 = peg$c91;
          peg$currPos++;
        } else {
          s0 = peg$FAILED;

          if (peg$silentFails === 0) {
            peg$fail(peg$c92);
          }
        }

        if (s0 === peg$FAILED) {
          if (input.charCodeAt(peg$currPos) === 45) {
            s0 = peg$c263;
            peg$currPos++;
          } else {
            s0 = peg$FAILED;

            if (peg$silentFails === 0) {
              peg$fail(peg$c264);
            }
          }

          if (s0 === peg$FAILED) {
            if (peg$c146.test(input.charAt(peg$currPos))) {
              s0 = input.charAt(peg$currPos);
              peg$currPos++;
            } else {
              s0 = peg$FAILED;

              if (peg$silentFails === 0) {
                peg$fail(peg$c147);
              }
            }
          }
        }

        peg$silentFails--;

        if (s0 === peg$FAILED) {

          if (peg$silentFails === 0) {
            peg$fail(peg$c262);
          }
        }

        return s0;
      }

      function peg$parse_55start() {
        var s0;
        s0 = peg$parse_55program();
        return s0;
      }

      function peg$parse_55program() {
        var s0, s1;
        s0 = peg$currPos;
        s1 = peg$parse_55content();

        if (s1 !== peg$FAILED) {
          s1 = peg$c265(s1);
        }

        s0 = s1;
        return s0;
      }

      function peg$parse_55content() {
        var s0, s1, s2;
        s0 = peg$currPos;
        s1 = [];
        s2 = peg$parse_55statement();

        while (s2 !== peg$FAILED) {
          s1.push(s2);
          s2 = peg$parse_55statement();
        }

        if (s1 !== peg$FAILED) {
          s1 = peg$c266(s1);
        }

        s0 = s1;
        return s0;
      }

      function peg$parse_55statement() {
        var s0;
        s0 = peg$parse_2blankLine();

        if (s0 === peg$FAILED) {
          s0 = peg$parse_7comment();

          if (s0 === peg$FAILED) {
            s0 = peg$parse_55contentStatement();
          }
        }

        return s0;
      }

      function peg$parse_55contentStatement() {
        var s0;
        s0 = peg$parse_55htmlElement();

        if (s0 === peg$FAILED) {
          s0 = peg$parse_16textLine();

          if (s0 === peg$FAILED) {
            s0 = peg$parse_55mustache();
          }
        }

        return s0;
      }

      function peg$parse_55colonContent() {
        var s0, s1, s2, s3;
        s0 = peg$currPos;

        if (input.substr(peg$currPos, 2) === peg$c267) {
          s1 = peg$c267;
          peg$currPos += 2;
        } else {
          s1 = peg$FAILED;

          if (peg$silentFails === 0) {
            peg$fail(peg$c268);
          }
        }

        if (s1 !== peg$FAILED) {
          s2 = peg$parse_1start();

          if (s2 !== peg$FAILED) {
            s3 = peg$parse_55contentStatement();

            if (s3 !== peg$FAILED) {
              s1 = peg$c22(s3);
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }

        return s0;
      }

      function peg$parse_55htmlElement() {
        var s0, s1, s2;
        s0 = peg$currPos;
        s1 = peg$parse_49start();

        if (s1 !== peg$FAILED) {
          s2 = peg$parse_55htmlTerminator();

          if (s2 !== peg$FAILED) {
            s1 = peg$c269(s1, s2);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }

        return s0;
      }

      function peg$parse_55htmlTerminator() {
        var s0, s1, s2, s3, s4, s5, s6;
        s0 = peg$parse_55colonContent();

        if (s0 === peg$FAILED) {
          s0 = peg$currPos;
          s1 = peg$parse_1start();

          if (s1 !== peg$FAILED) {
            s2 = peg$parse_55explicitMustache();

            if (s2 !== peg$FAILED) {
              s1 = peg$c270(s2);
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }

          if (s0 === peg$FAILED) {
            s0 = peg$currPos;
            s1 = peg$parse_1start();

            if (s1 !== peg$FAILED) {
              s2 = peg$parse_10inlineComment();

              if (s2 === peg$FAILED) {
                s2 = null;
              }

              if (s2 !== peg$FAILED) {
                s3 = peg$parse_55TERM();

                if (s3 !== peg$FAILED) {
                  s4 = peg$parse_55indentedContent();

                  if (s4 === peg$FAILED) {
                    s4 = null;
                  }

                  if (s4 !== peg$FAILED) {
                    s1 = peg$c271(s4);
                    s0 = s1;
                  } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }

            if (s0 === peg$FAILED) {
              s0 = peg$currPos;
              s1 = peg$parse_1start();

              if (s1 !== peg$FAILED) {
                s2 = peg$parse_10inlineComment();

                if (s2 === peg$FAILED) {
                  s2 = null;
                }

                if (s2 !== peg$FAILED) {
                  s3 = peg$parse_55DEDENT();

                  if (s3 !== peg$FAILED) {
                    if (input.charCodeAt(peg$currPos) === 93) {
                      s4 = peg$c99;
                      peg$currPos++;
                    } else {
                      s4 = peg$FAILED;

                      if (peg$silentFails === 0) {
                        peg$fail(peg$c100);
                      }
                    }

                    if (s4 !== peg$FAILED) {
                      s5 = peg$parse_55TERM();

                      if (s5 !== peg$FAILED) {
                        s6 = peg$parse_55indentedContent();

                        if (s6 === peg$FAILED) {
                          s6 = null;
                        }

                        if (s6 !== peg$FAILED) {
                          s1 = peg$c271(s6);
                          s0 = s1;
                        } else {
                          peg$currPos = s0;
                          s0 = peg$FAILED;
                        }
                      } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                      }
                    } else {
                      peg$currPos = s0;
                      s0 = peg$FAILED;
                    }
                  } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }

              if (s0 === peg$FAILED) {
                s0 = peg$currPos;
                s1 = peg$parse_1start();

                if (s1 !== peg$FAILED) {
                  s2 = peg$parse_10inlineComment();

                  if (s2 === peg$FAILED) {
                    s2 = null;
                  }

                  if (s2 !== peg$FAILED) {
                    if (input.charCodeAt(peg$currPos) === 93) {
                      s3 = peg$c99;
                      peg$currPos++;
                    } else {
                      s3 = peg$FAILED;

                      if (peg$silentFails === 0) {
                        peg$fail(peg$c100);
                      }
                    }

                    if (s3 !== peg$FAILED) {
                      s4 = peg$parse_55TERM();

                      if (s4 !== peg$FAILED) {
                        s5 = peg$parse_55unindentedContent();

                        if (s5 === peg$FAILED) {
                          s5 = null;
                        }

                        if (s5 !== peg$FAILED) {
                          s1 = peg$c271(s5);
                          s0 = s1;
                        } else {
                          peg$currPos = s0;
                          s0 = peg$FAILED;
                        }
                      } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                      }
                    } else {
                      peg$currPos = s0;
                      s0 = peg$FAILED;
                    }
                  } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }

                if (s0 === peg$FAILED) {
                  s0 = peg$currPos;
                  s1 = peg$parse_1start();

                  if (s1 !== peg$FAILED) {
                    s2 = peg$parse_10inlineComment();

                    if (s2 === peg$FAILED) {
                      s2 = null;
                    }

                    if (s2 !== peg$FAILED) {
                      s3 = peg$parse_55DEDENT();

                      if (s3 === peg$FAILED) {
                        s3 = null;
                      }

                      if (s3 !== peg$FAILED) {
                        if (input.charCodeAt(peg$currPos) === 93) {
                          s4 = peg$c99;
                          peg$currPos++;
                        } else {
                          s4 = peg$FAILED;

                          if (peg$silentFails === 0) {
                            peg$fail(peg$c100);
                          }
                        }

                        if (s4 !== peg$FAILED) {
                          s5 = peg$parse_55TERM();

                          if (s5 !== peg$FAILED) {
                            s1 = [s1, s2, s3, s4, s5];
                            s0 = s1;
                          } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                          }
                        } else {
                          peg$currPos = s0;
                          s0 = peg$FAILED;
                        }
                      } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                      }
                    } else {
                      peg$currPos = s0;
                      s0 = peg$FAILED;
                    }
                  } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                  }

                  if (s0 === peg$FAILED) {
                    s0 = peg$currPos;
                    s1 = peg$parse_50htmlNestedTextNodes();

                    if (s1 !== peg$FAILED) {
                      s1 = peg$c272(s1);
                    }

                    s0 = s1;
                  }
                }
              }
            }
          }
        }

        return s0;
      }

      function peg$parse_55indentedContent() {
        var s0, s1, s2, s3, s4;
        s0 = peg$currPos;
        s1 = [];
        s2 = peg$parse_2blankLine();

        while (s2 !== peg$FAILED) {
          s1.push(s2);
          s2 = peg$parse_2blankLine();
        }

        if (s1 !== peg$FAILED) {
          s2 = peg$parse_5indentation();

          if (s2 !== peg$FAILED) {
            s3 = peg$parse_55content();

            if (s3 !== peg$FAILED) {
              s4 = peg$parse_55DEDENT();

              if (s4 !== peg$FAILED) {
                s1 = peg$c22(s3);
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }

        return s0;
      }

      function peg$parse_55unindentedContent() {
        var s0, s1, s2, s3;
        s0 = peg$currPos;
        s1 = [];
        s2 = peg$parse_2blankLine();

        while (s2 !== peg$FAILED) {
          s1.push(s2);
          s2 = peg$parse_2blankLine();
        }

        if (s1 !== peg$FAILED) {
          s2 = peg$parse_55content();

          if (s2 !== peg$FAILED) {
            s3 = peg$parse_55DEDENT();

            if (s3 !== peg$FAILED) {
              s1 = peg$c22(s2);
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }

        return s0;
      }

      function peg$parse_55mustache() {
        var s0, s1;
        s0 = peg$currPos;
        s1 = peg$parse_55explicitMustache();

        if (s1 === peg$FAILED) {
          s1 = peg$parse_55lineStartingMustache();
        }

        if (s1 !== peg$FAILED) {
          s1 = peg$c273(s1);
        }

        s0 = s1;
        return s0;
      }

      function peg$parse_55explicitMustache() {
        var s0, s1, s2, s3;
        s0 = peg$currPos;
        s1 = peg$parse_9equalSign();

        if (s1 !== peg$FAILED) {
          s2 = peg$parse_1start();

          if (s2 !== peg$FAILED) {
            s3 = peg$parse_55mustacheOrBlock();

            if (s3 !== peg$FAILED) {
              s1 = peg$c274(s1, s3);
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }

        return s0;
      }

      function peg$parse_55lineStartingMustache() {
        var s0, s1;
        s0 = peg$currPos;
        s1 = peg$parse_55capitalizedLineStarterMustache();

        if (s1 === peg$FAILED) {
          s1 = peg$parse_55mustacheOrBlock();
        }

        if (s1 !== peg$FAILED) {
          s1 = peg$c275(s1);
        }

        s0 = s1;
        return s0;
      }

      function peg$parse_55capitalizedLineStarterMustache() {
        var s0, s1, s2;
        s0 = peg$currPos;
        s1 = peg$currPos;
        peg$silentFails++;

        if (peg$c276.test(input.charAt(peg$currPos))) {
          s2 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s2 = peg$FAILED;

          if (peg$silentFails === 0) {
            peg$fail(peg$c277);
          }
        }

        peg$silentFails--;

        if (s2 !== peg$FAILED) {
          peg$currPos = s1;
          s1 = void 0;
        } else {
          s1 = peg$FAILED;
        }

        if (s1 !== peg$FAILED) {
          s2 = peg$parse_55mustacheOrBlock();

          if (s2 !== peg$FAILED) {
            s1 = peg$c278(s2);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }

        return s0;
      }

      function peg$parse_55mustacheOrBlock() {
        var s0;
        s0 = peg$parse_55mustacheWithBlock();

        if (s0 === peg$FAILED) {
          s0 = peg$parse_55mustacheWithBracketsAndBlock();
        }

        return s0;
      }

      function peg$parse_55mustacheWithBlock() {
        var s0, s1, s2, s3, s4;
        s0 = peg$currPos;
        s1 = peg$parse_55mustacheContent();

        if (s1 !== peg$FAILED) {
          s2 = peg$parse_1start();

          if (s2 !== peg$FAILED) {
            s3 = peg$parse_10inlineComment();

            if (s3 === peg$FAILED) {
              s3 = null;
            }

            if (s3 !== peg$FAILED) {
              s4 = peg$parse_55mustacheBasicNested();

              if (s4 !== peg$FAILED) {
                s1 = peg$c279(s1, s4);
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }

        return s0;
      }

      function peg$parse_55mustacheContent() {
        var s0, s1, s2;
        s0 = peg$currPos;
        s1 = peg$parse_54newMustache();

        if (s1 !== peg$FAILED) {
          s2 = peg$parse_10inlineComment();

          if (s2 === peg$FAILED) {
            s2 = null;
          }

          if (s2 !== peg$FAILED) {
            s1 = peg$c280(s1);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }

        return s0;
      }

      function peg$parse_55mustacheBasicNested() {
        var s0, s1, s2, s3, s4, s5, s6;
        s0 = peg$currPos;
        s1 = peg$parse_55colonContent();

        if (s1 === peg$FAILED) {
          s1 = peg$parse_16textLine();
        }

        if (s1 !== peg$FAILED) {
          s1 = peg$c281(s1);
        }

        s0 = s1;

        if (s0 === peg$FAILED) {
          s0 = peg$currPos;
          s1 = peg$parse_55TERM();

          if (s1 !== peg$FAILED) {
            s2 = peg$currPos;
            s3 = [];
            s4 = peg$parse_2blankLine();

            while (s4 !== peg$FAILED) {
              s3.push(s4);
              s4 = peg$parse_2blankLine();
            }

            if (s3 !== peg$FAILED) {
              s4 = peg$parse_5indentation();

              if (s4 !== peg$FAILED) {
                s5 = peg$parse_55contentWithElse();

                if (s5 !== peg$FAILED) {
                  s6 = peg$parse_55DEDENT();

                  if (s6 !== peg$FAILED) {
                    s3 = peg$c282(s5);
                    s2 = s3;
                  } else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s2;
                  s2 = peg$FAILED;
                }
              } else {
                peg$currPos = s2;
                s2 = peg$FAILED;
              }
            } else {
              peg$currPos = s2;
              s2 = peg$FAILED;
            }

            if (s2 === peg$FAILED) {
              s2 = null;
            }

            if (s2 !== peg$FAILED) {
              s1 = peg$c283(s2);
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        }

        return s0;
      }

      function peg$parse_55mustacheWithBracketsAndBlock() {
        var s0, s1, s2, s3, s4;
        s0 = peg$currPos;
        s1 = peg$parse_55mustacheContentWithBracketStart();

        if (s1 !== peg$FAILED) {
          s2 = peg$parse_1start();

          if (s2 !== peg$FAILED) {
            s3 = peg$parse_10inlineComment();

            if (s3 === peg$FAILED) {
              s3 = null;
            }

            if (s3 !== peg$FAILED) {
              s4 = peg$parse_55mustacheEndBracketAndNested();

              if (s4 !== peg$FAILED) {
                s1 = peg$c279(s1, s4);
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }

        return s0;
      }

      function peg$parse_55mustacheContentWithBracketStart() {
        var s0, s1, s2, s3, s4;
        s0 = peg$currPos;
        s1 = peg$currPos;
        peg$silentFails++;
        s2 = peg$currPos;

        if (input.charCodeAt(peg$currPos) === 91) {
          s3 = peg$c95;
          peg$currPos++;
        } else {
          s3 = peg$FAILED;

          if (peg$silentFails === 0) {
            peg$fail(peg$c96);
          }
        }

        if (s3 !== peg$FAILED) {
          s4 = peg$parse_55TERM();

          if (s4 !== peg$FAILED) {
            s3 = [s3, s4];
            s2 = s3;
          } else {
            peg$currPos = s2;
            s2 = peg$FAILED;
          }
        } else {
          peg$currPos = s2;
          s2 = peg$FAILED;
        }

        peg$silentFails--;

        if (s2 === peg$FAILED) {
          s1 = void 0;
        } else {
          peg$currPos = s1;
          s1 = peg$FAILED;
        }

        if (s1 !== peg$FAILED) {
          s2 = peg$parse_1start();

          if (s2 !== peg$FAILED) {
            s3 = peg$parse_54newMustache();

            if (s3 !== peg$FAILED) {
              s4 = peg$parse_10inlineComment();

              if (s4 === peg$FAILED) {
                s4 = null;
              }

              if (s4 !== peg$FAILED) {
                s1 = peg$c284(s3);
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }

        return s0;
      }

      function peg$parse_55mustacheEndBracketAndNested() {
        var s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10;
        s0 = peg$currPos;
        s1 = peg$parse_1start();

        if (s1 !== peg$FAILED) {
          if (input.charCodeAt(peg$currPos) === 93) {
            s2 = peg$c99;
            peg$currPos++;
          } else {
            s2 = peg$FAILED;

            if (peg$silentFails === 0) {
              peg$fail(peg$c100);
            }
          }

          if (s2 !== peg$FAILED) {
            s3 = peg$parse_1start();

            if (s3 !== peg$FAILED) {
              s4 = peg$parse_47blockParams();

              if (s4 === peg$FAILED) {
                s4 = null;
              }

              if (s4 !== peg$FAILED) {
                s5 = [];
                s6 = peg$parse_55TERM();

                if (s6 !== peg$FAILED) {
                  while (s6 !== peg$FAILED) {
                    s5.push(s6);
                    s6 = peg$parse_55TERM();
                  }
                } else {
                  s5 = peg$FAILED;
                }

                if (s5 !== peg$FAILED) {
                  s6 = peg$parse_55contentWithElse();

                  if (s6 !== peg$FAILED) {
                    s7 = peg$parse_55DEDENT();

                    if (s7 !== peg$FAILED) {
                      s1 = peg$c285(s4, s6);
                      s0 = s1;
                    } else {
                      peg$currPos = s0;
                      s0 = peg$FAILED;
                    }
                  } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }

        if (s0 === peg$FAILED) {
          s0 = peg$currPos;
          s1 = peg$parse_1start();

          if (s1 !== peg$FAILED) {
            s2 = peg$parse_55DEDENT();

            if (s2 !== peg$FAILED) {
              if (input.charCodeAt(peg$currPos) === 93) {
                s3 = peg$c99;
                peg$currPos++;
              } else {
                s3 = peg$FAILED;

                if (peg$silentFails === 0) {
                  peg$fail(peg$c100);
                }
              }

              if (s3 !== peg$FAILED) {
                s4 = peg$parse_1start();

                if (s4 !== peg$FAILED) {
                  s5 = peg$parse_47blockParams();

                  if (s5 === peg$FAILED) {
                    s5 = null;
                  }

                  if (s5 !== peg$FAILED) {
                    s6 = [];
                    s7 = peg$parse_55TERM();

                    if (s7 !== peg$FAILED) {
                      while (s7 !== peg$FAILED) {
                        s6.push(s7);
                        s7 = peg$parse_55TERM();
                      }
                    } else {
                      s6 = peg$FAILED;
                    }

                    if (s6 !== peg$FAILED) {
                      s7 = peg$parse_55INDENT();

                      if (s7 !== peg$FAILED) {
                        s8 = peg$parse_1start();

                        if (s8 !== peg$FAILED) {
                          s9 = peg$parse_55contentWithElse();

                          if (s9 !== peg$FAILED) {
                            s10 = peg$parse_55DEDENT();

                            if (s10 !== peg$FAILED) {
                              s1 = peg$c285(s5, s9);
                              s0 = s1;
                            } else {
                              peg$currPos = s0;
                              s0 = peg$FAILED;
                            }
                          } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                          }
                        } else {
                          peg$currPos = s0;
                          s0 = peg$FAILED;
                        }
                      } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                      }
                    } else {
                      peg$currPos = s0;
                      s0 = peg$FAILED;
                    }
                  } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }

          if (s0 === peg$FAILED) {
            s0 = peg$currPos;
            s1 = peg$parse_1start();

            if (s1 !== peg$FAILED) {
              s2 = peg$parse_55DEDENT();

              if (s2 === peg$FAILED) {
                s2 = null;
              }

              if (s2 !== peg$FAILED) {
                if (input.charCodeAt(peg$currPos) === 93) {
                  s3 = peg$c99;
                  peg$currPos++;
                } else {
                  s3 = peg$FAILED;

                  if (peg$silentFails === 0) {
                    peg$fail(peg$c100);
                  }
                }

                if (s3 !== peg$FAILED) {
                  s4 = peg$parse_55TERM();

                  if (s4 !== peg$FAILED) {
                    s1 = peg$c286();
                    s0 = s1;
                  } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          }
        }

        return s0;
      }

      function peg$parse_55contentWithElse() {
        var s0, s1, s2;
        s0 = peg$currPos;
        s1 = peg$parse_55content();

        if (s1 !== peg$FAILED) {
          s2 = peg$parse_55invertibleObject();

          if (s2 === peg$FAILED) {
            s2 = null;
          }

          if (s2 !== peg$FAILED) {
            s1 = peg$c287(s1, s2);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }

        return s0;
      }

      function peg$parse_55invertibleObject() {
        var s0, s1, s2, s3, s4, s5, s6, s7, s8;
        s0 = peg$currPos;
        s1 = peg$parse_55DEDENT();

        if (s1 !== peg$FAILED) {
          s2 = [];
          s3 = peg$parse_7comment();

          while (s3 !== peg$FAILED) {
            s2.push(s3);
            s3 = peg$parse_7comment();
          }

          if (s2 !== peg$FAILED) {
            s3 = peg$parse_8else();

            if (s3 !== peg$FAILED) {
              s4 = peg$parse_1start();

              if (s4 !== peg$FAILED) {
                s5 = peg$parse_55invertibleParam();

                if (s5 === peg$FAILED) {
                  s5 = null;
                }

                if (s5 !== peg$FAILED) {
                  s6 = peg$parse_55TERM();

                  if (s6 !== peg$FAILED) {
                    s7 = peg$parse_55invertibleBlock();

                    if (s7 !== peg$FAILED) {
                      s8 = peg$parse_55invertibleObject();

                      if (s8 === peg$FAILED) {
                        s8 = null;
                      }

                      if (s8 !== peg$FAILED) {
                        s1 = peg$c288(s3, s5, s7, s8);
                        s0 = s1;
                      } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                      }
                    } else {
                      peg$currPos = s0;
                      s0 = peg$FAILED;
                    }
                  } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }

        return s0;
      }

      function peg$parse_55invertibleParam() {
        var s0, s1, s2, s3;
        s0 = peg$currPos;
        s1 = peg$parse_51mustacheAttrs();

        if (s1 !== peg$FAILED) {
          s2 = peg$parse_1start();

          if (s2 !== peg$FAILED) {
            s3 = peg$parse_10inlineComment();

            if (s3 === peg$FAILED) {
              s3 = null;
            }

            if (s3 !== peg$FAILED) {
              s1 = peg$c289(s1);
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }

        return s0;
      }

      function peg$parse_55invertibleBlock() {
        var s0, s1, s2, s3;
        s0 = peg$currPos;
        s1 = [];
        s2 = peg$parse_2blankLine();

        while (s2 !== peg$FAILED) {
          s1.push(s2);
          s2 = peg$parse_2blankLine();
        }

        if (s1 !== peg$FAILED) {
          s2 = peg$parse_5indentation();

          if (s2 !== peg$FAILED) {
            s3 = peg$parse_55content();

            if (s3 !== peg$FAILED) {
              s1 = peg$c22(s3);
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }

        return s0;
      }

      function peg$parse_55INDENT() {
        var s0, s1, s2;
        peg$silentFails++;
        s0 = peg$currPos;

        if (input.length > peg$currPos) {
          s1 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s1 = peg$FAILED;

          if (peg$silentFails === 0) {
            peg$fail(peg$c7);
          }
        }

        if (s1 !== peg$FAILED) {
          s2 = peg$c21(s1);

          if (s2) {
            s2 = void 0;
          } else {
            s2 = peg$FAILED;
          }

          if (s2 !== peg$FAILED) {
            s1 = peg$c15(s1);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }

        peg$silentFails--;

        if (s0 === peg$FAILED) {
          s1 = peg$FAILED;

          if (peg$silentFails === 0) {
            peg$fail(peg$c290);
          }
        }

        return s0;
      }

      function peg$parse_55DEDENT() {
        var s0, s1, s2;
        peg$silentFails++;
        s0 = peg$currPos;

        if (input.length > peg$currPos) {
          s1 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s1 = peg$FAILED;

          if (peg$silentFails === 0) {
            peg$fail(peg$c7);
          }
        }

        if (s1 !== peg$FAILED) {
          s2 = peg$c14(s1);

          if (s2) {
            s2 = void 0;
          } else {
            s2 = peg$FAILED;
          }

          if (s2 !== peg$FAILED) {
            s1 = peg$c15(s1);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }

        peg$silentFails--;

        if (s0 === peg$FAILED) {
          s1 = peg$FAILED;

          if (peg$silentFails === 0) {
            peg$fail(peg$c291);
          }
        }

        return s0;
      }

      function peg$parse_55TERM() {
        var s0, s1, s2, s3, s4;
        peg$silentFails++;
        s0 = peg$currPos;

        if (input.charCodeAt(peg$currPos) === 13) {
          s1 = peg$c5;
          peg$currPos++;
        } else {
          s1 = peg$FAILED;

          if (peg$silentFails === 0) {
            peg$fail(peg$c6);
          }
        }

        if (s1 === peg$FAILED) {
          s1 = null;
        }

        if (s1 !== peg$FAILED) {
          if (input.length > peg$currPos) {
            s2 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s2 = peg$FAILED;

            if (peg$silentFails === 0) {
              peg$fail(peg$c7);
            }
          }

          if (s2 !== peg$FAILED) {
            s3 = peg$c8(s2);

            if (s3) {
              s3 = void 0;
            } else {
              s3 = peg$FAILED;
            }

            if (s3 !== peg$FAILED) {
              if (input.charCodeAt(peg$currPos) === 10) {
                s4 = peg$c9;
                peg$currPos++;
              } else {
                s4 = peg$FAILED;

                if (peg$silentFails === 0) {
                  peg$fail(peg$c10);
                }
              }

              if (s4 !== peg$FAILED) {
                s1 = peg$c11(s2);
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }

        peg$silentFails--;

        if (s0 === peg$FAILED) {
          s1 = peg$FAILED;

          if (peg$silentFails === 0) {
            peg$fail(peg$c292);
          }
        }

        return s0;
      }

      function prepareMustachValue(content) {
        var parts = content.split(' '),
            first,
            match; // check for '!' unbound helper

        first = parts.shift();

        if (match = first.match(/(.*)!$/)) {
          parts.unshift(match[1]);
          content = 'unbound ' + parts.join(' ');
        } else {
          parts.unshift(first);
        } // check for '?' if helper


        first = parts.shift();

        if (match = first.match(/(.*)\?$/)) {
          parts.unshift(match[1]);
          content = 'if ' + parts.join(' ');
        } else {
          parts.unshift(first);
        }

        return content;
      }

      var LINE_SPACE_MODIFIERS = {
        NEWLINE: '`',
        SPACE_AFTER: "'",
        SPACE_BOTH: '"',
        SPACE_BEFORE: "+"
      };

      function castStringsToTextNodes(possibleStrings) {
        var ret = [];
        var currentString = null;
        var possibleString;

        for (var i = 0, l = possibleStrings.length; i < l; i++) {
          possibleString = possibleStrings[i];

          if (typeof possibleString === 'string') {
            currentString = (currentString || '') + possibleString;
          } else {
            if (currentString) {
              ret.push(textNode(currentString));
              currentString = null;
            }

            ret.push(possibleString); // not a string, it is a node here
          }
        }

        if (currentString) {
          ret.push(textNode(currentString));
        }

        return ret;
      }

      function textNode(content) {
        return builder.generateText(content);
      }

      function buildActionEvent(event, actionContent) {
        actionContent.push('on=\"' + event + '\"');
        return [builder.generateMustache(actionContent.join(' '))];
      }

      function isAliasEvent(event) {
        return !!ALIAS_EVENTS[event];
      }

      function parseInHtml(h, inTagMustaches, fullAttributes, blockParams) {
        var tagName = h[0] || 'div',
            shorthandAttributes = h[1] || [],
            id = shorthandAttributes[0],
            classes = shorthandAttributes[1] || [];
        var i, l;
        var elementNode = builder.generateElement(tagName);
        builder.enter(elementNode);

        for (i = 0, l = classes.length; i < l; i++) {
          if (classes[i].type === 'classNameBinding') {
            builder.add('classNameBindings', classes[i]);
          } else {
            builder.classNameBinding(':' + classes[i]);
          }
        }

        if (id) {
          builder.attribute('id', id);
        }

        for (i = 0; i < inTagMustaches.length; ++i) {
          builder.add('attrStaches', inTagMustaches[i]);
        }

        for (i = 0; i < fullAttributes.length; ++i) {
          var currentAttr = fullAttributes[i];

          if (Array.isArray(currentAttr) && typeof currentAttr[0] === 'string') {
            // a "normalAttribute", [attrName, attrContent]
            if (currentAttr.length) {
              // a boolean false attribute will be []
              // skip classes now, coalesce them later
              if (currentAttr[0] === 'class') {
                builder.classNameBinding(':' + currentAttr[1]);
              } else {
                builder.attribute(currentAttr[0], currentAttr[1]);
              }
            }
          } else if (Array.isArray(currentAttr)) {
            currentAttr.forEach(function (attrNode) {
              builder.add(attrNode.type === 'classNameBinding' ? 'classNameBindings' : 'attrStaches', attrNode);
            });
          } else {
            builder.add(currentAttr.type === 'classNameBinding' ? 'classNameBindings' : 'attrStaches', currentAttr);
          }
        }

        if (blockParams && blockParams.length > 0) {
          var joinedParams = blockParams.join(' ');
          var tagString = 'as |' + joinedParams + '|';
          builder.inTagText(tagString);
        }
      }

      function isKnownTag(tag) {
        return !!KNOWN_TAGS[tag];
      }

      var builder = options.builder;
      var UNBOUND_MODIFIER = '!';
      var CONDITIONAL_MODIFIER = '?';

      function logDeprecation(message) {
        if (!options.quiet) {
          var output = 'DEPRECATION: ' + message;

          if (options.file) {
            output += '\nFile: ' + options.file;
          }

          console.log(output);
        }
      }

      function flattenArray(first, tail) {
        var ret = [];

        if (first) {
          ret.push(first);
        }

        for (var i = 0; i < tail.length; ++i) {
          var t = tail[i];
          ret.push(t[0]);

          if (t[1]) {
            ret.push(t[1]);
          }
        }

        return ret;
      }
      /**
        Splits a value string into separate parts,
        then generates a classBinding for each part.
      */


      function splitValueIntoClassBindings(value) {
        return value.split(' ').map(function (v) {
          return builder.generateClassNameBinding(v);
        });
      }

      function isArray(obj) {
        return obj && obj.constructor === Array;
      } // Receives an array object and verifies it has content
      // Useful for checking blocks to make sure there is actual data in the payload


      function isArrayWithContent(obj) {
        if (!isArray(obj)) return;
        var hasItems = false;
        var length = obj.length;

        for (var i = 0; i < length; i++) {
          var item = obj[i];

          if (isArray(item)) {
            if (item.length > 0) hasItems = true;
          } else if (!!item) {
            hasItems = true;
          }
        }

        return hasItems;
      }
      /**
        @param [<<>, {}>] mustacheTuple
        @return
      */


      function createBlockOrMustache(mustacheTuple) {
        var mustache = mustacheTuple[0];
        var block = mustacheTuple[1] || {};
        var escaped = mustache.isEscaped;
        var mustacheContent = mustache.name;
        var mustacheAttrs = mustache.attrs;
        var mustacheBlockParams = mustache.blockParams || block.blockParams;
        var blockTuple = block.blockTuple;

        if (mustacheAttrs.length) {
          var attrs = coalesceAttrs(mustacheAttrs);
          mustacheContent += ' ' + attrs.join(' ');
        }

        if (mustacheBlockParams) {
          mustacheContent += ' as |' + mustacheBlockParams.join(' ') + '|';
        }

        if (mustache.isViewHelper) {
          mustacheContent = 'view ' + mustacheContent;
        }

        if (mustache.modifier === UNBOUND_MODIFIER) {
          logDeprecation('Unbound modifier is deprecated');
          mustacheContent = 'unbound ' + mustacheContent;
        } else if (mustache.modifier === CONDITIONAL_MODIFIER) {
          mustacheContent = 'if ' + mustacheContent;
        }

        if (isArrayWithContent(blockTuple)) {
          var block = builder.generateBlock(mustacheContent, escaped);
          builder.enter(block); // Iterate on each tuple and either add it as a child node or an invertible node

          blockTuple.forEach(function (tuple) {
            if (!tuple) return;
            if (tuple.isInvertible) builder.add('invertibleNodes', tuple);else builder.add('childNodes', tuple);
          });
          return builder.exit();
        } else {
          return builder.generateMustache(mustacheContent, escaped);
        }
      } // attrs are simple strings,
      // combine all the ones that start with 'class='


      function coalesceAttrs(attrs) {
        var classes = [];
        var newAttrs = [];
        var classRegex = /^class="(.*)"$/;
        var match;

        for (var i = 0, l = attrs.length; i < l; i++) {
          var attr = attrs[i];

          if (match = attr.match(classRegex)) {
            classes.push(match[1]);
          } else {
            newAttrs.push(attr);
          }
        }

        if (classes.length) {
          newAttrs.push('class="' + classes.join(' ') + '"');
        }

        return newAttrs;
      }

      peg$result = peg$startRuleFunction();

      if (peg$result !== peg$FAILED && peg$currPos === input.length) {
        return peg$result;
      } else {
        if (peg$result !== peg$FAILED && peg$currPos < input.length) {
          peg$fail(peg$endExpectation());
        }

        throw peg$buildStructuredError(peg$maxFailExpected, peg$maxFailPos < input.length ? input.charAt(peg$maxFailPos) : null, peg$maxFailPos < input.length ? peg$computeLocation(peg$maxFailPos, peg$maxFailPos + 1) : peg$computeLocation(peg$maxFailPos, peg$maxFailPos));
      }
    }

    return {
      SyntaxError: peg$SyntaxError,
      parse: peg$parse
    };
  }();

  var parse = Parser.parse;

  function processOpcodes(compiler, opcodes) {
    for (var i = 0, l = opcodes.length; i < l; i++) {
      var method = opcodes[i][0];
      var params = opcodes[i][1];

      if (params) {
        compiler[method].apply(compiler, params);
      } else {
        compiler[method].call(compiler);
      }
    }
  }

  /**
    Visit a single node
    @oaram {Object} node
    @param {Array} opcodes
  */
  function visit(node, opcodes) {
    visitor[node.type](node, opcodes);
  }
  /**
    Visit a series of nodes
    @oaram {Array} nodes
    @param {Array} opcodes
  */

  function visitArray(nodes, opcodes) {
    if (!nodes || nodes.length === 0) {
      return;
    }

    for (var i = 0, l = nodes.length; i < l; i++) {
      // Due to the structure of invertible nodes, it is possible to receive an array of arrays
      if (nodes[i] instanceof Array) visitArray(nodes[i], opcodes);else visit(nodes[i], opcodes);
    }
  }
  /**
    Process an invertible object
    @param {Object} node
    @param {Array} opcodes
  */


  function addInvertible(node, opcodes) {
    opcodes.push(['mustache', [node.name.trim(), true]]); // The content helper always returns an array

    visitArray(node.content, opcodes); // Recursion if this node has more invertible nodes

    if (node.invertibleNodes) addInvertible(node.invertibleNodes, opcodes);
  }

  var visitor = {
    program: function (node, opcodes) {
      opcodes.push(['startProgram']);
      visitArray(node.childNodes, opcodes);
      opcodes.push(['endProgram']);
    },
    text: function (node, opcodes) {
      opcodes.push(['text', [node.content]]);
    },
    attribute: function (node, opcodes) {
      opcodes.push(['attribute', [node.name, node.content]]);
    },
    classNameBinding: function (node, opcodes) {
      opcodes.push(['classNameBinding', [node.name]]);
    },
    element: function (node, opcodes) {
      opcodes.push(['openElementStart', [node.tagName]]);
      visitArray(node.attrStaches, opcodes);

      if (node.classNameBindings && node.classNameBindings.length) {
        opcodes.push(['openClassNameBindings']);
        visitArray(node.classNameBindings, opcodes);
        opcodes.push(['closeClassNameBindings']);
      }

      visitArray(node.inTagText, opcodes);
      opcodes.push(['openElementEnd']);

      if (node.isVoid) {
        if (node.childNodes.length) {
          throw new Error('Cannot nest under void element ' + node.tagName);
        }
      } else {
        visitArray(node.childNodes, opcodes);
        opcodes.push(['closeElement', [node.tagName]]);
      }
    },
    block: function (node, opcodes) {
      opcodes.push(['startBlock', [node.content]]);
      visitArray(node.childNodes, opcodes); // The root block node will have an array of invertibleNodes, but there can only ever be one

      if (node.invertibleNodes && node.invertibleNodes.length > 0) {
        addInvertible(node.invertibleNodes[0], opcodes);
      }

      opcodes.push(['endBlock', [node.content]]);
    },
    mustache: function (node, opcodes) {
      opcodes.push(['mustache', [node.content, node.escaped]]);
    },
    inTagText: function (node, opcodes) {
      opcodes.push(['inTagText', [node.content]]);
    },
    assignedMustache: function (node, opcodes) {
      opcodes.push(['assignedMustache', [node.content, node.key]]);
    }
  };

  function escapeString(str) {
    str = str.replace(/\\/g, "\\\\");
    str = str.replace(/"/g, '\\"');
    str = str.replace(/\n/g, "\\n");
    return str;
  }

  function string(str) {
    return '"' + escapeString(str) + '"';
  }

  var options = {};
  function compile(ast, additionalOptions) {
    var opcodes = [];

    if (additionalOptions) {
      options = additionalOptions;
    }

    visit(ast, opcodes);
    reset$1(compiler);
    processOpcodes(compiler, opcodes);
    return flush(compiler);
  }

  function reset$1(compiler) {
    compiler._content = [];
  }

  function flush(compiler) {
    return compiler._content.join('');
  }

  function pushContent(compiler, content) {
    compiler._content.push(content);
  }
  /**
    Wrap an string in mustache
    @param {Array} names
    @return {Array}
  */


  function wrapMustacheStrings(names) {
    return names.map(function (name) {
      return '{{' + name + '}}';
    });
  }
  /**
    Map a colon syntax string to inline if syntax.
    @param {String} Name
    @return {String}
  */


  function mapColonSyntax(name) {
    var parts = name.split(':'); // First item will always be wrapped in single quotes (since we need at least one result for condition)

    parts[1] = singleQuoteString(parts[1]); // Only wrap second option if it exists

    if (parts[2]) parts[2] = singleQuoteString(parts[2]);
    parts.unshift('if');
    return parts.join(' ');
  }
  /**
    Wrap an string in single quotes
    @param {String} value
    @return {String}
  */


  function singleQuoteString(value) {
    return "'" + value + "'";
  }

  var boundClassNames, unboundClassNames;
  var compiler = {
    startProgram: function () {},
    endProgram: function () {},
    text: function (content) {
      pushContent(this, content);
    },
    attribute: function (name, content) {
      var attrString = ' ' + name;

      if (content === undefined) {// boolean attribute with a true value, this is a no-op
      } else if (typeof content === 'string') {
        // Ensure proper quoting for a string
        attrString += '=' + string(content);
      } else {
        // Anything else (e.g. a number) is uncoerced
        attrString += '=' + content;
      }

      pushContent(this, attrString);
    },
    openElementStart: function (tagName) {
      this._insideElement = true;
      pushContent(this, '<' + tagName);
    },
    openElementEnd: function () {
      pushContent(this, '>');
      this._insideElement = false;
    },
    closeElement: function (tagName) {
      pushContent(this, '</' + tagName + '>');
    },
    openClassNameBindings: function () {
      boundClassNames = [];
      unboundClassNames = [];
    },

    /**
      Add a class name binding
      @param {String} name
    */
    classNameBinding: function (name) {
      var isBoundAttribute = name[0] !== ':';

      if (isBoundAttribute) {
        var isColonSyntax = name.indexOf(':') > -1;

        if (isColonSyntax) {
          name = mapColonSyntax(name);
        }

        boundClassNames.push(name);
      } else {
        name = name.slice(1);
        unboundClassNames.push(name);
      }
    },

    /**
      Group all unbound classes into a single string
      Wrap each binding in mustache
    */
    closeClassNameBindings: function () {
      var unboundClassString = unboundClassNames.join(' ');
      var mustacheString = wrapMustacheStrings(boundClassNames).join(' ');
      var results = [unboundClassString, mustacheString]; // Remove any blank strings

      results = results.filter(function (i) {
        return i !== "";
      });
      results = results.join(' '); // We only need to wrap the results in quotes if we have at least one unbound or more than 1 bound attributes

      var wrapInString = unboundClassString.length > 0 || boundClassNames.length > 1;
      if (wrapInString) results = string(results);else if (results.length === 0) results = '\"\"';
      pushContent(this, ' class=' + results);
    },
    startBlock: function (content) {
      pushContent(this, '{{#' + content + '}}');
    },
    endBlock: function (content) {
      var parts = content.split(' ');
      pushContent(this, '{{/' + parts[0] + '}}');
    },
    mustache: function (content, escaped) {
      var prepend = this._insideElement ? ' ' : '';

      if (escaped) {
        pushContent(this, prepend + '{{' + content + '}}');
      } else {
        pushContent(this, prepend + '{{{' + content + '}}}');
      }
    },
    inTagText: function (content) {
      pushContent(this, ' ' + content);
    },

    /**
      Special syntax for assigning mustache to a key
      @param {String} content
      @param {String} key
    */
    assignedMustache: function (content, key) {
      var prepend = this._insideElement ? ' ' : '';

      if (key.match(/^on/) || !options.legacyAttributeQuoting) {
        pushContent(this, prepend + key + '={{' + content + '}}');
      } else {
        pushContent(this, prepend + key + '=\"{{' + content + '}}\"');
      }
    }
  };

  /**
    options can include:
      quite: disable deprecation notices
      debugging: show output handlebars in console
  */

  function compile$1(emblem, customOptions) {
    var builder = generateBuilder();
    var options = customOptions || {};
    var processedEmblem = processSync(emblem);
    options['builder'] = builder;
    parse(processedEmblem, options);
    var ast = builder.toAST();
    var result = compile(ast, options);

    if (options.debugging) {
      console.log(result);
    }

    return result;
  }

  function compileScriptTags(scope) {
    var Handlebars = scope.Handlebars;
    var Ember = scope.Ember;

    if (typeof Ember === "undefined" || Ember === null) {
      throw new Error("Can't run Emblem.enableEmber before Ember has been defined");
    }

    if (typeof document !== "undefined" && document !== null) {
      return Ember.$('script[type="text/x-emblem"], script[type="text/x-raw-emblem"]', Ember.$(document)).each(function () {
        var handlebarsVariant, script, templateName;
        script = Ember.$(this);
        handlebarsVariant = script.attr('type') === 'text/x-raw-handlebars' ? Handlebars : Ember.Handlebars;
        templateName = script.attr('data-template-name') || script.attr('id') || 'application';
        Ember.TEMPLATES[templateName] = compile$1(handlebarsVariant, script.html());
        return script.remove();
      });
    }
  }

  if (typeof window !== "undefined" && window !== null) {
    var ENV = window.ENV || (window.ENV = {});
    ENV.EMBER_LOAD_HOOKS = ENV.EMBER_LOAD_HOOKS || {};
    ENV.EMBER_LOAD_HOOKS.application = ENV.EMBER_LOAD_HOOKS.application || [];
    ENV.EMBER_LOAD_HOOKS.application.push(compileScriptTags);
    ENV.EMBER_LOAD_HOOKS['Ember.Application'] = ENV.EMBER_LOAD_HOOKS['Ember.Application'] || [];
    ENV.EMBER_LOAD_HOOKS['Ember.Application'].push(function (Application) {
      if (Application.initializer) {
        return Application.initializer({
          name: 'emblemDomTemplates',
          before: 'registerComponentLookup',
          initialize: compileScriptTags
        });
      } else {
        return window.Ember.onLoad('application', compileScriptTags);
      }
    });
  }

  const VERSION = "0.12.4"; // Real exports

  var emblem = {
    Parser: parse,
    compile: compile$1,
    VERSION
  };

  exports.Parser = parse;
  exports.compile = compile$1;
  exports.VERSION = VERSION;
  exports.default = emblem;

  Object.defineProperty(exports, '__esModule', { value: true });

});
