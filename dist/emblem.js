  (function(root) {

    // lib/handlebars/base.js


(function(root) {

/*jshint eqnull:true*/
var Handlebars;
Handlebars = this.Handlebars = {};

(function(Handlebars) {

Handlebars.VERSION = "1.0.rc.2";

Handlebars.helpers  = {};
Handlebars.partials = {};

Handlebars.registerHelper = function(name, fn, inverse) {
  if(inverse) { fn.not = inverse; }
  this.helpers[name] = fn;
};

Handlebars.registerPartial = function(name, str) {
  this.partials[name] = str;
};

Handlebars.registerHelper('helperMissing', function(arg) {
  if(arguments.length === 2) {
    return undefined;
  } else {
    throw new Error("Could not find property '" + arg + "'");
  }
});

var toString = Object.prototype.toString, functionType = "[object Function]";

Handlebars.registerHelper('blockHelperMissing', function(context, options) {
  var inverse = options.inverse || function() {}, fn = options.fn;


  var ret = "";
  var type = toString.call(context);

  if(type === functionType) { context = context.call(this); }

  if(context === true) {
    return fn(this);
  } else if(context === false || context == null) {
    return inverse(this);
  } else if(type === "[object Array]") {
    if(context.length > 0) {
      return Handlebars.helpers.each(context, options);
    } else {
      return inverse(this);
    }
  } else {
    return fn(context);
  }
});

Handlebars.K = function() {};

Handlebars.createFrame = Object.create || function(object) {
  Handlebars.K.prototype = object;
  var obj = new Handlebars.K();
  Handlebars.K.prototype = null;
  return obj;
};

Handlebars.logger = {
  DEBUG: 0, INFO: 1, WARN: 2, ERROR: 3, level: 3,

  methodMap: {0: 'debug', 1: 'info', 2: 'warn', 3: 'error'},

  // can be overridden in the host environment
  log: function(level, obj) {
    if (Handlebars.logger.level <= level) {
      var method = Handlebars.logger.methodMap[level];
      if (typeof console !== 'undefined' && console[method]) {
        console[method].call(console, obj);
      }
    }
  }
};

Handlebars.log = function(level, obj) { Handlebars.logger.log(level, obj); };

Handlebars.registerHelper('each', function(context, options) {
  var fn = options.fn, inverse = options.inverse;
  var i = 0, ret = "", data;

  if (options.data) {
    data = Handlebars.createFrame(options.data);
  }

  if(context && typeof context === 'object') {
    if(context instanceof Array){
      for(var j = context.length; i<j; i++) {
        if (data) { data.index = i; }
        ret = ret + fn(context[i], { data: data });
      }
    } else {
      for(var key in context) {
        if(context.hasOwnProperty(key)) {
          if(data) { data.key = key; }
          ret = ret + fn(context[key], {data: data});
          i++;
        }
      }
    }
  }

  if(i === 0){
    ret = inverse(this);
  }

  return ret;
});

Handlebars.registerHelper('if', function(context, options) {
  var type = toString.call(context);
  if(type === functionType) { context = context.call(this); }

  if(!context || Handlebars.Utils.isEmpty(context)) {
    return options.inverse(this);
  } else {
    return options.fn(this);
  }
});

Handlebars.registerHelper('unless', function(context, options) {
  var fn = options.fn, inverse = options.inverse;
  options.fn = inverse;
  options.inverse = fn;

  return Handlebars.helpers['if'].call(this, context, options);
});

Handlebars.registerHelper('with', function(context, options) {
  return options.fn(context);
});

Handlebars.registerHelper('log', function(context, options) {
  var level = options.data && options.data.level != null ? parseInt(options.data.level, 10) : 1;
  Handlebars.log(level, context);
});

}(this.Handlebars));
;
// lib/handlebars/compiler/parser.js
/* Jison generated parser */
var handlebars = (function(){
var parser = {trace: function trace() { },
yy: {},
symbols_: {"error":2,"root":3,"program":4,"EOF":5,"simpleInverse":6,"statements":7,"statement":8,"openInverse":9,"closeBlock":10,"openBlock":11,"mustache":12,"partial":13,"CONTENT":14,"COMMENT":15,"OPEN_BLOCK":16,"inMustache":17,"CLOSE":18,"OPEN_INVERSE":19,"OPEN_ENDBLOCK":20,"path":21,"OPEN":22,"OPEN_UNESCAPED":23,"OPEN_PARTIAL":24,"partialName":25,"params":26,"hash":27,"DATA":28,"param":29,"STRING":30,"INTEGER":31,"BOOLEAN":32,"hashSegments":33,"hashSegment":34,"ID":35,"EQUALS":36,"PARTIAL_NAME":37,"pathSegments":38,"SEP":39,"$accept":0,"$end":1},
terminals_: {2:"error",5:"EOF",14:"CONTENT",15:"COMMENT",16:"OPEN_BLOCK",18:"CLOSE",19:"OPEN_INVERSE",20:"OPEN_ENDBLOCK",22:"OPEN",23:"OPEN_UNESCAPED",24:"OPEN_PARTIAL",28:"DATA",30:"STRING",31:"INTEGER",32:"BOOLEAN",35:"ID",36:"EQUALS",37:"PARTIAL_NAME",39:"SEP"},
productions_: [0,[3,2],[4,2],[4,3],[4,2],[4,1],[4,1],[4,0],[7,1],[7,2],[8,3],[8,3],[8,1],[8,1],[8,1],[8,1],[11,3],[9,3],[10,3],[12,3],[12,3],[13,3],[13,4],[6,2],[17,3],[17,2],[17,2],[17,1],[17,1],[26,2],[26,1],[29,1],[29,1],[29,1],[29,1],[29,1],[27,1],[33,2],[33,1],[34,3],[34,3],[34,3],[34,3],[34,3],[25,1],[21,1],[38,3],[38,1]],
performAction: function anonymous(yytext,yyleng,yylineno,yy,yystate,$$,_$) {

var $0 = $$.length - 1;
switch (yystate) {
case 1: return $$[$0-1]; 
break;
case 2: this.$ = new yy.ProgramNode([], $$[$0]); 
break;
case 3: this.$ = new yy.ProgramNode($$[$0-2], $$[$0]); 
break;
case 4: this.$ = new yy.ProgramNode($$[$0-1], []); 
break;
case 5: this.$ = new yy.ProgramNode($$[$0]); 
break;
case 6: this.$ = new yy.ProgramNode([], []); 
break;
case 7: this.$ = new yy.ProgramNode([]); 
break;
case 8: this.$ = [$$[$0]]; 
break;
case 9: $$[$0-1].push($$[$0]); this.$ = $$[$0-1]; 
break;
case 10: this.$ = new yy.BlockNode($$[$0-2], $$[$0-1].inverse, $$[$0-1], $$[$0]); 
break;
case 11: this.$ = new yy.BlockNode($$[$0-2], $$[$0-1], $$[$0-1].inverse, $$[$0]); 
break;
case 12: this.$ = $$[$0]; 
break;
case 13: this.$ = $$[$0]; 
break;
case 14: this.$ = new yy.ContentNode($$[$0]); 
break;
case 15: this.$ = new yy.CommentNode($$[$0]); 
break;
case 16: this.$ = new yy.MustacheNode($$[$0-1][0], $$[$0-1][1]); 
break;
case 17: this.$ = new yy.MustacheNode($$[$0-1][0], $$[$0-1][1]); 
break;
case 18: this.$ = $$[$0-1]; 
break;
case 19: this.$ = new yy.MustacheNode($$[$0-1][0], $$[$0-1][1]); 
break;
case 20: this.$ = new yy.MustacheNode($$[$0-1][0], $$[$0-1][1], true); 
break;
case 21: this.$ = new yy.PartialNode($$[$0-1]); 
break;
case 22: this.$ = new yy.PartialNode($$[$0-2], $$[$0-1]); 
break;
case 23: 
break;
case 24: this.$ = [[$$[$0-2]].concat($$[$0-1]), $$[$0]]; 
break;
case 25: this.$ = [[$$[$0-1]].concat($$[$0]), null]; 
break;
case 26: this.$ = [[$$[$0-1]], $$[$0]]; 
break;
case 27: this.$ = [[$$[$0]], null]; 
break;
case 28: this.$ = [[new yy.DataNode($$[$0])], null]; 
break;
case 29: $$[$0-1].push($$[$0]); this.$ = $$[$0-1]; 
break;
case 30: this.$ = [$$[$0]]; 
break;
case 31: this.$ = $$[$0]; 
break;
case 32: this.$ = new yy.StringNode($$[$0]); 
break;
case 33: this.$ = new yy.IntegerNode($$[$0]); 
break;
case 34: this.$ = new yy.BooleanNode($$[$0]); 
break;
case 35: this.$ = new yy.DataNode($$[$0]); 
break;
case 36: this.$ = new yy.HashNode($$[$0]); 
break;
case 37: $$[$0-1].push($$[$0]); this.$ = $$[$0-1]; 
break;
case 38: this.$ = [$$[$0]]; 
break;
case 39: this.$ = [$$[$0-2], $$[$0]]; 
break;
case 40: this.$ = [$$[$0-2], new yy.StringNode($$[$0])]; 
break;
case 41: this.$ = [$$[$0-2], new yy.IntegerNode($$[$0])]; 
break;
case 42: this.$ = [$$[$0-2], new yy.BooleanNode($$[$0])]; 
break;
case 43: this.$ = [$$[$0-2], new yy.DataNode($$[$0])]; 
break;
case 44: this.$ = new yy.PartialNameNode($$[$0]); 
break;
case 45: this.$ = new yy.IdNode($$[$0]); 
break;
case 46: $$[$0-2].push($$[$0]); this.$ = $$[$0-2]; 
break;
case 47: this.$ = [$$[$0]]; 
break;
}
},
table: [{3:1,4:2,5:[2,7],6:3,7:4,8:6,9:7,11:8,12:9,13:10,14:[1,11],15:[1,12],16:[1,13],19:[1,5],22:[1,14],23:[1,15],24:[1,16]},{1:[3]},{5:[1,17]},{5:[2,6],7:18,8:6,9:7,11:8,12:9,13:10,14:[1,11],15:[1,12],16:[1,13],19:[1,19],20:[2,6],22:[1,14],23:[1,15],24:[1,16]},{5:[2,5],6:20,8:21,9:7,11:8,12:9,13:10,14:[1,11],15:[1,12],16:[1,13],19:[1,5],20:[2,5],22:[1,14],23:[1,15],24:[1,16]},{17:23,18:[1,22],21:24,28:[1,25],35:[1,27],38:26},{5:[2,8],14:[2,8],15:[2,8],16:[2,8],19:[2,8],20:[2,8],22:[2,8],23:[2,8],24:[2,8]},{4:28,6:3,7:4,8:6,9:7,11:8,12:9,13:10,14:[1,11],15:[1,12],16:[1,13],19:[1,5],20:[2,7],22:[1,14],23:[1,15],24:[1,16]},{4:29,6:3,7:4,8:6,9:7,11:8,12:9,13:10,14:[1,11],15:[1,12],16:[1,13],19:[1,5],20:[2,7],22:[1,14],23:[1,15],24:[1,16]},{5:[2,12],14:[2,12],15:[2,12],16:[2,12],19:[2,12],20:[2,12],22:[2,12],23:[2,12],24:[2,12]},{5:[2,13],14:[2,13],15:[2,13],16:[2,13],19:[2,13],20:[2,13],22:[2,13],23:[2,13],24:[2,13]},{5:[2,14],14:[2,14],15:[2,14],16:[2,14],19:[2,14],20:[2,14],22:[2,14],23:[2,14],24:[2,14]},{5:[2,15],14:[2,15],15:[2,15],16:[2,15],19:[2,15],20:[2,15],22:[2,15],23:[2,15],24:[2,15]},{17:30,21:24,28:[1,25],35:[1,27],38:26},{17:31,21:24,28:[1,25],35:[1,27],38:26},{17:32,21:24,28:[1,25],35:[1,27],38:26},{25:33,37:[1,34]},{1:[2,1]},{5:[2,2],8:21,9:7,11:8,12:9,13:10,14:[1,11],15:[1,12],16:[1,13],19:[1,19],20:[2,2],22:[1,14],23:[1,15],24:[1,16]},{17:23,21:24,28:[1,25],35:[1,27],38:26},{5:[2,4],7:35,8:6,9:7,11:8,12:9,13:10,14:[1,11],15:[1,12],16:[1,13],19:[1,19],20:[2,4],22:[1,14],23:[1,15],24:[1,16]},{5:[2,9],14:[2,9],15:[2,9],16:[2,9],19:[2,9],20:[2,9],22:[2,9],23:[2,9],24:[2,9]},{5:[2,23],14:[2,23],15:[2,23],16:[2,23],19:[2,23],20:[2,23],22:[2,23],23:[2,23],24:[2,23]},{18:[1,36]},{18:[2,27],21:41,26:37,27:38,28:[1,45],29:39,30:[1,42],31:[1,43],32:[1,44],33:40,34:46,35:[1,47],38:26},{18:[2,28]},{18:[2,45],28:[2,45],30:[2,45],31:[2,45],32:[2,45],35:[2,45],39:[1,48]},{18:[2,47],28:[2,47],30:[2,47],31:[2,47],32:[2,47],35:[2,47],39:[2,47]},{10:49,20:[1,50]},{10:51,20:[1,50]},{18:[1,52]},{18:[1,53]},{18:[1,54]},{18:[1,55],21:56,35:[1,27],38:26},{18:[2,44],35:[2,44]},{5:[2,3],8:21,9:7,11:8,12:9,13:10,14:[1,11],15:[1,12],16:[1,13],19:[1,19],20:[2,3],22:[1,14],23:[1,15],24:[1,16]},{14:[2,17],15:[2,17],16:[2,17],19:[2,17],20:[2,17],22:[2,17],23:[2,17],24:[2,17]},{18:[2,25],21:41,27:57,28:[1,45],29:58,30:[1,42],31:[1,43],32:[1,44],33:40,34:46,35:[1,47],38:26},{18:[2,26]},{18:[2,30],28:[2,30],30:[2,30],31:[2,30],32:[2,30],35:[2,30]},{18:[2,36],34:59,35:[1,60]},{18:[2,31],28:[2,31],30:[2,31],31:[2,31],32:[2,31],35:[2,31]},{18:[2,32],28:[2,32],30:[2,32],31:[2,32],32:[2,32],35:[2,32]},{18:[2,33],28:[2,33],30:[2,33],31:[2,33],32:[2,33],35:[2,33]},{18:[2,34],28:[2,34],30:[2,34],31:[2,34],32:[2,34],35:[2,34]},{18:[2,35],28:[2,35],30:[2,35],31:[2,35],32:[2,35],35:[2,35]},{18:[2,38],35:[2,38]},{18:[2,47],28:[2,47],30:[2,47],31:[2,47],32:[2,47],35:[2,47],36:[1,61],39:[2,47]},{35:[1,62]},{5:[2,10],14:[2,10],15:[2,10],16:[2,10],19:[2,10],20:[2,10],22:[2,10],23:[2,10],24:[2,10]},{21:63,35:[1,27],38:26},{5:[2,11],14:[2,11],15:[2,11],16:[2,11],19:[2,11],20:[2,11],22:[2,11],23:[2,11],24:[2,11]},{14:[2,16],15:[2,16],16:[2,16],19:[2,16],20:[2,16],22:[2,16],23:[2,16],24:[2,16]},{5:[2,19],14:[2,19],15:[2,19],16:[2,19],19:[2,19],20:[2,19],22:[2,19],23:[2,19],24:[2,19]},{5:[2,20],14:[2,20],15:[2,20],16:[2,20],19:[2,20],20:[2,20],22:[2,20],23:[2,20],24:[2,20]},{5:[2,21],14:[2,21],15:[2,21],16:[2,21],19:[2,21],20:[2,21],22:[2,21],23:[2,21],24:[2,21]},{18:[1,64]},{18:[2,24]},{18:[2,29],28:[2,29],30:[2,29],31:[2,29],32:[2,29],35:[2,29]},{18:[2,37],35:[2,37]},{36:[1,61]},{21:65,28:[1,69],30:[1,66],31:[1,67],32:[1,68],35:[1,27],38:26},{18:[2,46],28:[2,46],30:[2,46],31:[2,46],32:[2,46],35:[2,46],39:[2,46]},{18:[1,70]},{5:[2,22],14:[2,22],15:[2,22],16:[2,22],19:[2,22],20:[2,22],22:[2,22],23:[2,22],24:[2,22]},{18:[2,39],35:[2,39]},{18:[2,40],35:[2,40]},{18:[2,41],35:[2,41]},{18:[2,42],35:[2,42]},{18:[2,43],35:[2,43]},{5:[2,18],14:[2,18],15:[2,18],16:[2,18],19:[2,18],20:[2,18],22:[2,18],23:[2,18],24:[2,18]}],
defaultActions: {17:[2,1],25:[2,28],38:[2,26],57:[2,24]},
parseError: function parseError(str, hash) {
    throw new Error(str);
},
parse: function parse(input) {
    var self = this, stack = [0], vstack = [null], lstack = [], table = this.table, yytext = "", yylineno = 0, yyleng = 0, recovering = 0, TERROR = 2, EOF = 1;
    this.lexer.setInput(input);
    this.lexer.yy = this.yy;
    this.yy.lexer = this.lexer;
    this.yy.parser = this;
    if (typeof this.lexer.yylloc == "undefined")
        this.lexer.yylloc = {};
    var yyloc = this.lexer.yylloc;
    lstack.push(yyloc);
    var ranges = this.lexer.options && this.lexer.options.ranges;
    if (typeof this.yy.parseError === "function")
        this.parseError = this.yy.parseError;
    function popStack(n) {
        stack.length = stack.length - 2 * n;
        vstack.length = vstack.length - n;
        lstack.length = lstack.length - n;
    }
    function lex() {
        var token;
        token = self.lexer.lex() || 1;
        if (typeof token !== "number") {
            token = self.symbols_[token] || token;
        }
        return token;
    }
    var symbol, preErrorSymbol, state, action, a, r, yyval = {}, p, len, newState, expected;
    while (true) {
        state = stack[stack.length - 1];
        if (this.defaultActions[state]) {
            action = this.defaultActions[state];
        } else {
            if (symbol === null || typeof symbol == "undefined") {
                symbol = lex();
            }
            action = table[state] && table[state][symbol];
        }
        if (typeof action === "undefined" || !action.length || !action[0]) {
            var errStr = "";
            if (!recovering) {
                expected = [];
                for (p in table[state])
                    if (this.terminals_[p] && p > 2) {
                        expected.push("'" + this.terminals_[p] + "'");
                    }
                if (this.lexer.showPosition) {
                    errStr = "Parse error on line " + (yylineno + 1) + ":\n" + this.lexer.showPosition() + "\nExpecting " + expected.join(", ") + ", got '" + (this.terminals_[symbol] || symbol) + "'";
                } else {
                    errStr = "Parse error on line " + (yylineno + 1) + ": Unexpected " + (symbol == 1?"end of input":"'" + (this.terminals_[symbol] || symbol) + "'");
                }
                this.parseError(errStr, {text: this.lexer.match, token: this.terminals_[symbol] || symbol, line: this.lexer.yylineno, loc: yyloc, expected: expected});
            }
        }
        if (action[0] instanceof Array && action.length > 1) {
            throw new Error("Parse Error: multiple actions possible at state: " + state + ", token: " + symbol);
        }
        switch (action[0]) {
        case 1:
            stack.push(symbol);
            vstack.push(this.lexer.yytext);
            lstack.push(this.lexer.yylloc);
            stack.push(action[1]);
            symbol = null;
            if (!preErrorSymbol) {
                yyleng = this.lexer.yyleng;
                yytext = this.lexer.yytext;
                yylineno = this.lexer.yylineno;
                yyloc = this.lexer.yylloc;
                if (recovering > 0)
                    recovering--;
            } else {
                symbol = preErrorSymbol;
                preErrorSymbol = null;
            }
            break;
        case 2:
            len = this.productions_[action[1]][1];
            yyval.$ = vstack[vstack.length - len];
            yyval._$ = {first_line: lstack[lstack.length - (len || 1)].first_line, last_line: lstack[lstack.length - 1].last_line, first_column: lstack[lstack.length - (len || 1)].first_column, last_column: lstack[lstack.length - 1].last_column};
            if (ranges) {
                yyval._$.range = [lstack[lstack.length - (len || 1)].range[0], lstack[lstack.length - 1].range[1]];
            }
            r = this.performAction.call(yyval, yytext, yyleng, yylineno, this.yy, action[1], vstack, lstack);
            if (typeof r !== "undefined") {
                return r;
            }
            if (len) {
                stack = stack.slice(0, -1 * len * 2);
                vstack = vstack.slice(0, -1 * len);
                lstack = lstack.slice(0, -1 * len);
            }
            stack.push(this.productions_[action[1]][0]);
            vstack.push(yyval.$);
            lstack.push(yyval._$);
            newState = table[stack[stack.length - 2]][stack[stack.length - 1]];
            stack.push(newState);
            break;
        case 3:
            return true;
        }
    }
    return true;
}
};
/* Jison generated lexer */
var lexer = (function(){
var lexer = ({EOF:1,
parseError:function parseError(str, hash) {
        if (this.yy.parser) {
            this.yy.parser.parseError(str, hash);
        } else {
            throw new Error(str);
        }
    },
setInput:function (input) {
        this._input = input;
        this._more = this._less = this.done = false;
        this.yylineno = this.yyleng = 0;
        this.yytext = this.matched = this.match = '';
        this.conditionStack = ['INITIAL'];
        this.yylloc = {first_line:1,first_column:0,last_line:1,last_column:0};
        if (this.options.ranges) this.yylloc.range = [0,0];
        this.offset = 0;
        return this;
    },
input:function () {
        var ch = this._input[0];
        this.yytext += ch;
        this.yyleng++;
        this.offset++;
        this.match += ch;
        this.matched += ch;
        var lines = ch.match(/(?:\r\n?|\n).*/g);
        if (lines) {
            this.yylineno++;
            this.yylloc.last_line++;
        } else {
            this.yylloc.last_column++;
        }
        if (this.options.ranges) this.yylloc.range[1]++;

        this._input = this._input.slice(1);
        return ch;
    },
unput:function (ch) {
        var len = ch.length;
        var lines = ch.split(/(?:\r\n?|\n)/g);

        this._input = ch + this._input;
        this.yytext = this.yytext.substr(0, this.yytext.length-len-1);
        //this.yyleng -= len;
        this.offset -= len;
        var oldLines = this.match.split(/(?:\r\n?|\n)/g);
        this.match = this.match.substr(0, this.match.length-1);
        this.matched = this.matched.substr(0, this.matched.length-1);

        if (lines.length-1) this.yylineno -= lines.length-1;
        var r = this.yylloc.range;

        this.yylloc = {first_line: this.yylloc.first_line,
          last_line: this.yylineno+1,
          first_column: this.yylloc.first_column,
          last_column: lines ?
              (lines.length === oldLines.length ? this.yylloc.first_column : 0) + oldLines[oldLines.length - lines.length].length - lines[0].length:
              this.yylloc.first_column - len
          };

        if (this.options.ranges) {
            this.yylloc.range = [r[0], r[0] + this.yyleng - len];
        }
        return this;
    },
more:function () {
        this._more = true;
        return this;
    },
less:function (n) {
        this.unput(this.match.slice(n));
    },
pastInput:function () {
        var past = this.matched.substr(0, this.matched.length - this.match.length);
        return (past.length > 20 ? '...':'') + past.substr(-20).replace(/\n/g, "");
    },
upcomingInput:function () {
        var next = this.match;
        if (next.length < 20) {
            next += this._input.substr(0, 20-next.length);
        }
        return (next.substr(0,20)+(next.length > 20 ? '...':'')).replace(/\n/g, "");
    },
showPosition:function () {
        var pre = this.pastInput();
        var c = new Array(pre.length + 1).join("-");
        return pre + this.upcomingInput() + "\n" + c+"^";
    },
next:function () {
        if (this.done) {
            return this.EOF;
        }
        if (!this._input) this.done = true;

        var token,
            match,
            tempMatch,
            index,
            col,
            lines;
        if (!this._more) {
            this.yytext = '';
            this.match = '';
        }
        var rules = this._currentRules();
        for (var i=0;i < rules.length; i++) {
            tempMatch = this._input.match(this.rules[rules[i]]);
            if (tempMatch && (!match || tempMatch[0].length > match[0].length)) {
                match = tempMatch;
                index = i;
                if (!this.options.flex) break;
            }
        }
        if (match) {
            lines = match[0].match(/(?:\r\n?|\n).*/g);
            if (lines) this.yylineno += lines.length;
            this.yylloc = {first_line: this.yylloc.last_line,
                           last_line: this.yylineno+1,
                           first_column: this.yylloc.last_column,
                           last_column: lines ? lines[lines.length-1].length-lines[lines.length-1].match(/\r?\n?/)[0].length : this.yylloc.last_column + match[0].length};
            this.yytext += match[0];
            this.match += match[0];
            this.matches = match;
            this.yyleng = this.yytext.length;
            if (this.options.ranges) {
                this.yylloc.range = [this.offset, this.offset += this.yyleng];
            }
            this._more = false;
            this._input = this._input.slice(match[0].length);
            this.matched += match[0];
            token = this.performAction.call(this, this.yy, this, rules[index],this.conditionStack[this.conditionStack.length-1]);
            if (this.done && this._input) this.done = false;
            if (token) return token;
            else return;
        }
        if (this._input === "") {
            return this.EOF;
        } else {
            return this.parseError('Lexical error on line '+(this.yylineno+1)+'. Unrecognized text.\n'+this.showPosition(),
                    {text: "", token: null, line: this.yylineno});
        }
    },
lex:function lex() {
        var r = this.next();
        if (typeof r !== 'undefined') {
            return r;
        } else {
            return this.lex();
        }
    },
begin:function begin(condition) {
        this.conditionStack.push(condition);
    },
popState:function popState() {
        return this.conditionStack.pop();
    },
_currentRules:function _currentRules() {
        return this.conditions[this.conditionStack[this.conditionStack.length-1]].rules;
    },
topState:function () {
        return this.conditionStack[this.conditionStack.length-2];
    },
pushState:function begin(condition) {
        this.begin(condition);
    }});
lexer.options = {};
lexer.performAction = function anonymous(yy,yy_,$avoiding_name_collisions,YY_START) {

var YYSTATE=YY_START
switch($avoiding_name_collisions) {
case 0:
                                   if(yy_.yytext.slice(-1) !== "\\") this.begin("mu");
                                   if(yy_.yytext.slice(-1) === "\\") yy_.yytext = yy_.yytext.substr(0,yy_.yyleng-1), this.begin("emu");
                                   if(yy_.yytext) return 14;
                                 
break;
case 1: return 14; 
break;
case 2:
                                   if(yy_.yytext.slice(-1) !== "\\") this.popState();
                                   if(yy_.yytext.slice(-1) === "\\") yy_.yytext = yy_.yytext.substr(0,yy_.yyleng-1);
                                   return 14;
                                 
break;
case 3: yy_.yytext = yy_.yytext.substr(0, yy_.yyleng-4); this.popState(); return 15; 
break;
case 4: this.begin("par"); return 24; 
break;
case 5: return 16; 
break;
case 6: return 20; 
break;
case 7: return 19; 
break;
case 8: return 19; 
break;
case 9: return 23; 
break;
case 10: return 23; 
break;
case 11: this.popState(); this.begin('com'); 
break;
case 12: yy_.yytext = yy_.yytext.substr(3,yy_.yyleng-5); this.popState(); return 15; 
break;
case 13: return 22; 
break;
case 14: return 36; 
break;
case 15: return 35; 
break;
case 16: return 35; 
break;
case 17: return 39; 
break;
case 18: /*ignore whitespace*/ 
break;
case 19: this.popState(); return 18; 
break;
case 20: this.popState(); return 18; 
break;
case 21: yy_.yytext = yy_.yytext.substr(1,yy_.yyleng-2).replace(/\\"/g,'"'); return 30; 
break;
case 22: yy_.yytext = yy_.yytext.substr(1,yy_.yyleng-2).replace(/\\'/g,"'"); return 30; 
break;
case 23: yy_.yytext = yy_.yytext.substr(1); return 28; 
break;
case 24: return 32; 
break;
case 25: return 32; 
break;
case 26: return 31; 
break;
case 27: return 35; 
break;
case 28: yy_.yytext = yy_.yytext.substr(1, yy_.yyleng-2); return 35; 
break;
case 29: return 'INVALID'; 
break;
case 30: /*ignore whitespace*/ 
break;
case 31: this.popState(); return 37; 
break;
case 32: return 5; 
break;
}
};
lexer.rules = [/^(?:[^\x00]*?(?=(\{\{)))/,/^(?:[^\x00]+)/,/^(?:[^\x00]{2,}?(?=(\{\{|$)))/,/^(?:[\s\S]*?--\}\})/,/^(?:\{\{>)/,/^(?:\{\{#)/,/^(?:\{\{\/)/,/^(?:\{\{\^)/,/^(?:\{\{\s*else\b)/,/^(?:\{\{\{)/,/^(?:\{\{&)/,/^(?:\{\{!--)/,/^(?:\{\{![\s\S]*?\}\})/,/^(?:\{\{)/,/^(?:=)/,/^(?:\.(?=[} ]))/,/^(?:\.\.)/,/^(?:[\/.])/,/^(?:\s+)/,/^(?:\}\}\})/,/^(?:\}\})/,/^(?:"(\\["]|[^"])*")/,/^(?:'(\\[']|[^'])*')/,/^(?:@[a-zA-Z]+)/,/^(?:true(?=[}\s]))/,/^(?:false(?=[}\s]))/,/^(?:[0-9]+(?=[}\s]))/,/^(?:[a-zA-Z0-9_$-]+(?=[=}\s\/.]))/,/^(?:\[[^\]]*\])/,/^(?:.)/,/^(?:\s+)/,/^(?:[a-zA-Z0-9_$-/]+)/,/^(?:$)/];
lexer.conditions = {"mu":{"rules":[4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,32],"inclusive":false},"emu":{"rules":[2],"inclusive":false},"com":{"rules":[3],"inclusive":false},"par":{"rules":[30,31],"inclusive":false},"INITIAL":{"rules":[0,1,32],"inclusive":true}};
return lexer;})()
parser.lexer = lexer;
function Parser () { this.yy = {}; }Parser.prototype = parser;parser.Parser = Parser;
return new Parser;
})();;
// lib/handlebars/compiler/base.js
Handlebars.Parser = handlebars;

Handlebars.parse = function(string) {
  Handlebars.Parser.yy = Handlebars.AST;
  return Handlebars.Parser.parse(string);
};

Handlebars.print = function(ast) {
  return new Handlebars.PrintVisitor().accept(ast);
};;
// lib/handlebars/compiler/ast.js
(function() {

  Handlebars.AST = {};

  Handlebars.AST.ProgramNode = function(statements, inverse) {
    this.type = "program";
    this.statements = statements;
    if(inverse) { this.inverse = new Handlebars.AST.ProgramNode(inverse); }
  };

  Handlebars.AST.MustacheNode = function(rawParams, hash, unescaped) {
    this.type = "mustache";
    this.escaped = !unescaped;
    this.hash = hash;

    var id = this.id = rawParams[0];
    var params = this.params = rawParams.slice(1);

    // a mustache is an eligible helper if:
    // * its id is simple (a single part, not `this` or `..`)
    var eligibleHelper = this.eligibleHelper = id.isSimple;

    // a mustache is definitely a helper if:
    // * it is an eligible helper, and
    // * it has at least one parameter or hash segment
    this.isHelper = eligibleHelper && (params.length || hash);

    // if a mustache is an eligible helper but not a definite
    // helper, it is ambiguous, and will be resolved in a later
    // pass or at runtime.
  };

  Handlebars.AST.PartialNode = function(partialName, context) {
    this.type         = "partial";
    this.partialName  = partialName;
    this.context      = context;
  };

  var verifyMatch = function(open, close) {
    if(open.original !== close.original) {
      throw new Handlebars.Exception(open.original + " doesn't match " + close.original);
    }
  };

  Handlebars.AST.BlockNode = function(mustache, program, inverse, close) {
    verifyMatch(mustache.id, close);
    this.type = "block";
    this.mustache = mustache;
    this.program  = program;
    this.inverse  = inverse;

    if (this.inverse && !this.program) {
      this.isInverse = true;
    }
  };

  Handlebars.AST.ContentNode = function(string) {
    this.type = "content";
    this.string = string;
  };

  Handlebars.AST.HashNode = function(pairs) {
    this.type = "hash";
    this.pairs = pairs;
  };

  Handlebars.AST.IdNode = function(parts) {
    this.type = "ID";
    this.original = parts.join(".");

    var dig = [], depth = 0;

    for(var i=0,l=parts.length; i<l; i++) {
      var part = parts[i];

      if(part === "..") { depth++; }
      else if(part === "." || part === "this") { this.isScoped = true; }
      else { dig.push(part); }
    }

    this.parts    = dig;
    this.string   = dig.join('.');
    this.depth    = depth;

    // an ID is simple if it only has one part, and that part is not
    // `..` or `this`.
    this.isSimple = parts.length === 1 && !this.isScoped && depth === 0;

    this.stringModeValue = this.string;
  };

  Handlebars.AST.PartialNameNode = function(name) {
    this.type = "PARTIAL_NAME";
    this.name = name;
  };

  Handlebars.AST.DataNode = function(id) {
    this.type = "DATA";
    this.id = id;
  };

  Handlebars.AST.StringNode = function(string) {
    this.type = "STRING";
    this.string = string;
    this.stringModeValue = string;
  };

  Handlebars.AST.IntegerNode = function(integer) {
    this.type = "INTEGER";
    this.integer = integer;
    this.stringModeValue = Number(integer);
  };

  Handlebars.AST.BooleanNode = function(bool) {
    this.type = "BOOLEAN";
    this.bool = bool;
    this.stringModeValue = bool === "true";
  };

  Handlebars.AST.CommentNode = function(comment) {
    this.type = "comment";
    this.comment = comment;
  };

})();;
// lib/handlebars/utils.js

var errorProps = ['description', 'fileName', 'lineNumber', 'message', 'name', 'number', 'stack'];

Handlebars.Exception = function(message) {
  var tmp = Error.prototype.constructor.apply(this, arguments);

  // Unfortunately errors are not enumerable in Chrome (at least), so `for prop in tmp` doesn't work.
  for (var idx = 0; idx < errorProps.length; idx++) {
    this[errorProps[idx]] = tmp[errorProps[idx]];
  }
};
Handlebars.Exception.prototype = new Error();

// Build out our basic SafeString type
Handlebars.SafeString = function(string) {
  this.string = string;
};
Handlebars.SafeString.prototype.toString = function() {
  return this.string.toString();
};

(function() {
  var escape = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#x27;",
    "`": "&#x60;"
  };

  var badChars = /[&<>"'`]/g;
  var possible = /[&<>"'`]/;

  var escapeChar = function(chr) {
    return escape[chr] || "&amp;";
  };

  Handlebars.Utils = {
    escapeExpression: function(string) {
      // don't escape SafeStrings, since they're already safe
      if (string instanceof Handlebars.SafeString) {
        return string.toString();
      } else if (string == null || string === false) {
        return "";
      }

      if(!possible.test(string)) { return string; }
      return string.replace(badChars, escapeChar);
    },

    isEmpty: function(value) {
      if (!value && value !== 0) {
        return true;
      } else if(Object.prototype.toString.call(value) === "[object Array]" && value.length === 0) {
        return true;
      } else {
        return false;
      }
    }
  };
})();;
// lib/handlebars/compiler/compiler.js

/*jshint eqnull:true*/
Handlebars.Compiler = function() {};
Handlebars.JavaScriptCompiler = function() {};

(function(Compiler, JavaScriptCompiler) {
  // the foundHelper register will disambiguate helper lookup from finding a
  // function in a context. This is necessary for mustache compatibility, which
  // requires that context functions in blocks are evaluated by blockHelperMissing,
  // and then proceed as if the resulting value was provided to blockHelperMissing.

  Compiler.prototype = {
    compiler: Compiler,

    disassemble: function() {
      var opcodes = this.opcodes, opcode, out = [], params, param;

      for (var i=0, l=opcodes.length; i<l; i++) {
        opcode = opcodes[i];

        if (opcode.opcode === 'DECLARE') {
          out.push("DECLARE " + opcode.name + "=" + opcode.value);
        } else {
          params = [];
          for (var j=0; j<opcode.args.length; j++) {
            param = opcode.args[j];
            if (typeof param === "string") {
              param = "\"" + param.replace("\n", "\\n") + "\"";
            }
            params.push(param);
          }
          out.push(opcode.opcode + " " + params.join(" "));
        }
      }

      return out.join("\n");
    },

    guid: 0,

    compile: function(program, options) {
      this.children = [];
      this.depths = {list: []};
      this.options = options;

      // These changes will propagate to the other compiler components
      var knownHelpers = this.options.knownHelpers;
      this.options.knownHelpers = {
        'helperMissing': true,
        'blockHelperMissing': true,
        'each': true,
        'if': true,
        'unless': true,
        'with': true,
        'log': true
      };
      if (knownHelpers) {
        for (var name in knownHelpers) {
          this.options.knownHelpers[name] = knownHelpers[name];
        }
      }

      return this.program(program);
    },

    accept: function(node) {
      return this[node.type](node);
    },

    program: function(program) {
      var statements = program.statements, statement;
      this.opcodes = [];

      for(var i=0, l=statements.length; i<l; i++) {
        statement = statements[i];
        this[statement.type](statement);
      }
      this.isSimple = l === 1;

      this.depths.list = this.depths.list.sort(function(a, b) {
        return a - b;
      });

      return this;
    },

    compileProgram: function(program) {
      var result = new this.compiler().compile(program, this.options);
      var guid = this.guid++, depth;

      this.usePartial = this.usePartial || result.usePartial;

      this.children[guid] = result;

      for(var i=0, l=result.depths.list.length; i<l; i++) {
        depth = result.depths.list[i];

        if(depth < 2) { continue; }
        else { this.addDepth(depth - 1); }
      }

      return guid;
    },

    block: function(block) {
      var mustache = block.mustache,
          program = block.program,
          inverse = block.inverse;

      if (program) {
        program = this.compileProgram(program);
      }

      if (inverse) {
        inverse = this.compileProgram(inverse);
      }

      var type = this.classifyMustache(mustache);

      if (type === "helper") {
        this.helperMustache(mustache, program, inverse);
      } else if (type === "simple") {
        this.simpleMustache(mustache);

        // now that the simple mustache is resolved, we need to
        // evaluate it by executing `blockHelperMissing`
        this.opcode('pushProgram', program);
        this.opcode('pushProgram', inverse);
        this.opcode('pushHash');
        this.opcode('blockValue');
      } else {
        this.ambiguousMustache(mustache, program, inverse);

        // now that the simple mustache is resolved, we need to
        // evaluate it by executing `blockHelperMissing`
        this.opcode('pushProgram', program);
        this.opcode('pushProgram', inverse);
        this.opcode('pushHash');
        this.opcode('ambiguousBlockValue');
      }

      this.opcode('append');
    },

    hash: function(hash) {
      var pairs = hash.pairs, pair, val;

      this.opcode('pushHash');

      for(var i=0, l=pairs.length; i<l; i++) {
        pair = pairs[i];
        val  = pair[1];

        if (this.options.stringParams) {
          this.opcode('pushStringParam', val.stringModeValue, val.type);
        } else {
          this.accept(val);
        }

        this.opcode('assignToHash', pair[0]);
      }
    },

    partial: function(partial) {
      var partialName = partial.partialName;
      this.usePartial = true;

      if(partial.context) {
        this.ID(partial.context);
      } else {
        this.opcode('push', 'depth0');
      }

      this.opcode('invokePartial', partialName.name);
      this.opcode('append');
    },

    content: function(content) {
      this.opcode('appendContent', content.string);
    },

    mustache: function(mustache) {
      var options = this.options;
      var type = this.classifyMustache(mustache);

      if (type === "simple") {
        this.simpleMustache(mustache);
      } else if (type === "helper") {
        this.helperMustache(mustache);
      } else {
        this.ambiguousMustache(mustache);
      }

      if(mustache.escaped && !options.noEscape) {
        this.opcode('appendEscaped');
      } else {
        this.opcode('append');
      }
    },

    ambiguousMustache: function(mustache, program, inverse) {
      var id = mustache.id, name = id.parts[0];

      this.opcode('getContext', id.depth);

      this.opcode('pushProgram', program);
      this.opcode('pushProgram', inverse);

      this.opcode('invokeAmbiguous', name);
    },

    simpleMustache: function(mustache, program, inverse) {
      var id = mustache.id;

      if (id.type === 'DATA') {
        this.DATA(id);
      } else if (id.parts.length) {
        this.ID(id);
      } else {
        // Simplified ID for `this`
        this.addDepth(id.depth);
        this.opcode('getContext', id.depth);
        this.opcode('pushContext');
      }

      this.opcode('resolvePossibleLambda');
    },

    helperMustache: function(mustache, program, inverse) {
      var params = this.setupFullMustacheParams(mustache, program, inverse),
          name = mustache.id.parts[0];

      if (this.options.knownHelpers[name]) {
        this.opcode('invokeKnownHelper', params.length, name);
      } else if (this.knownHelpersOnly) {
        throw new Error("You specified knownHelpersOnly, but used the unknown helper " + name);
      } else {
        this.opcode('invokeHelper', params.length, name);
      }
    },

    ID: function(id) {
      this.addDepth(id.depth);
      this.opcode('getContext', id.depth);

      var name = id.parts[0];
      if (!name) {
        this.opcode('pushContext');
      } else {
        this.opcode('lookupOnContext', id.parts[0]);
      }

      for(var i=1, l=id.parts.length; i<l; i++) {
        this.opcode('lookup', id.parts[i]);
      }
    },

    DATA: function(data) {
      this.options.data = true;
      this.opcode('lookupData', data.id);
    },

    STRING: function(string) {
      this.opcode('pushString', string.string);
    },

    INTEGER: function(integer) {
      this.opcode('pushLiteral', integer.integer);
    },

    BOOLEAN: function(bool) {
      this.opcode('pushLiteral', bool.bool);
    },

    comment: function() {},

    // HELPERS
    opcode: function(name) {
      this.opcodes.push({ opcode: name, args: [].slice.call(arguments, 1) });
    },

    declare: function(name, value) {
      this.opcodes.push({ opcode: 'DECLARE', name: name, value: value });
    },

    addDepth: function(depth) {
      if(isNaN(depth)) { throw new Error("EWOT"); }
      if(depth === 0) { return; }

      if(!this.depths[depth]) {
        this.depths[depth] = true;
        this.depths.list.push(depth);
      }
    },

    classifyMustache: function(mustache) {
      var isHelper   = mustache.isHelper;
      var isEligible = mustache.eligibleHelper;
      var options    = this.options;

      // if ambiguous, we can possibly resolve the ambiguity now
      if (isEligible && !isHelper) {
        var name = mustache.id.parts[0];

        if (options.knownHelpers[name]) {
          isHelper = true;
        } else if (options.knownHelpersOnly) {
          isEligible = false;
        }
      }

      if (isHelper) { return "helper"; }
      else if (isEligible) { return "ambiguous"; }
      else { return "simple"; }
    },

    pushParams: function(params) {
      var i = params.length, param;

      while(i--) {
        param = params[i];

        if(this.options.stringParams) {
          if(param.depth) {
            this.addDepth(param.depth);
          }

          this.opcode('getContext', param.depth || 0);
          this.opcode('pushStringParam', param.stringModeValue, param.type);
        } else {
          this[param.type](param);
        }
      }
    },

    setupMustacheParams: function(mustache) {
      var params = mustache.params;
      this.pushParams(params);

      if(mustache.hash) {
        this.hash(mustache.hash);
      } else {
        this.opcode('pushHash');
      }

      return params;
    },

    // this will replace setupMustacheParams when we're done
    setupFullMustacheParams: function(mustache, program, inverse) {
      var params = mustache.params;
      this.pushParams(params);

      this.opcode('pushProgram', program);
      this.opcode('pushProgram', inverse);

      if(mustache.hash) {
        this.hash(mustache.hash);
      } else {
        this.opcode('pushHash');
      }

      return params;
    }
  };

  var Literal = function(value) {
    this.value = value;
  };

  JavaScriptCompiler.prototype = {
    // PUBLIC API: You can override these methods in a subclass to provide
    // alternative compiled forms for name lookup and buffering semantics
    nameLookup: function(parent, name, type) {
      if (/^[0-9]+$/.test(name)) {
        return parent + "[" + name + "]";
      } else if (JavaScriptCompiler.isValidJavaScriptVariableName(name)) {
        return parent + "." + name;
      }
      else {
        return parent + "['" + name + "']";
      }
    },

    appendToBuffer: function(string) {
      if (this.environment.isSimple) {
        return "return " + string + ";";
      } else {
        return "buffer += " + string + ";";
      }
    },

    initializeBuffer: function() {
      return this.quotedString("");
    },

    namespace: "Handlebars",
    // END PUBLIC API

    compile: function(environment, options, context, asObject) {
      this.environment = environment;
      this.options = options || {};

      Handlebars.log(Handlebars.logger.DEBUG, this.environment.disassemble() + "\n\n");

      this.name = this.environment.name;
      this.isChild = !!context;
      this.context = context || {
        programs: [],
        aliases: { }
      };

      this.preamble();

      this.stackSlot = 0;
      this.stackVars = [];
      this.registers = { list: [] };
      this.compileStack = [];

      this.compileChildren(environment, options);

      var opcodes = environment.opcodes, opcode;

      this.i = 0;

      for(l=opcodes.length; this.i<l; this.i++) {
        opcode = opcodes[this.i];

        if(opcode.opcode === 'DECLARE') {
          this[opcode.name] = opcode.value;
        } else {
          this[opcode.opcode].apply(this, opcode.args);
        }
      }

      return this.createFunctionContext(asObject);
    },

    nextOpcode: function() {
      var opcodes = this.environment.opcodes, opcode = opcodes[this.i + 1];
      return opcodes[this.i + 1];
    },

    eat: function(opcode) {
      this.i = this.i + 1;
    },

    preamble: function() {
      var out = [];

      if (!this.isChild) {
        var namespace = this.namespace;
        var copies = "helpers = helpers || " + namespace + ".helpers;";
        if (this.environment.usePartial) { copies = copies + " partials = partials || " + namespace + ".partials;"; }
        if (this.options.data) { copies = copies + " data = data || {};"; }
        out.push(copies);
      } else {
        out.push('');
      }

      if (!this.environment.isSimple) {
        out.push(", buffer = " + this.initializeBuffer());
      } else {
        out.push("");
      }

      // track the last context pushed into place to allow skipping the
      // getContext opcode when it would be a noop
      this.lastContext = 0;
      this.source = out;
    },

    createFunctionContext: function(asObject) {
      var locals = this.stackVars.concat(this.registers.list);

      if(locals.length > 0) {
        this.source[1] = this.source[1] + ", " + locals.join(", ");
      }

      // Generate minimizer alias mappings
      if (!this.isChild) {
        var aliases = [];
        for (var alias in this.context.aliases) {
          this.source[1] = this.source[1] + ', ' + alias + '=' + this.context.aliases[alias];
        }
      }

      if (this.source[1]) {
        this.source[1] = "var " + this.source[1].substring(2) + ";";
      }

      // Merge children
      if (!this.isChild) {
        this.source[1] += '\n' + this.context.programs.join('\n') + '\n';
      }

      if (!this.environment.isSimple) {
        this.source.push("return buffer;");
      }

      var params = this.isChild ? ["depth0", "data"] : ["Handlebars", "depth0", "helpers", "partials", "data"];

      for(var i=0, l=this.environment.depths.list.length; i<l; i++) {
        params.push("depth" + this.environment.depths.list[i]);
      }

      if (asObject) {
        params.push(this.source.join("\n  "));

        return Function.apply(this, params);
      } else {
        var functionSource = 'function ' + (this.name || '') + '(' + params.join(',') + ') {\n  ' + this.source.join("\n  ") + '}';
        Handlebars.log(Handlebars.logger.DEBUG, functionSource + "\n\n");
        return functionSource;
      }
    },

    // [blockValue]
    //
    // On stack, before: hash, inverse, program, value
    // On stack, after: return value of blockHelperMissing
    //
    // The purpose of this opcode is to take a block of the form
    // `{{#foo}}...{{/foo}}`, resolve the value of `foo`, and
    // replace it on the stack with the result of properly
    // invoking blockHelperMissing.
    blockValue: function() {
      this.context.aliases.blockHelperMissing = 'helpers.blockHelperMissing';

      var params = ["depth0"];
      this.setupParams(0, params);

      this.replaceStack(function(current) {
        params.splice(1, 0, current);
        return "blockHelperMissing.call(" + params.join(", ") + ")";
      });
    },

    // [ambiguousBlockValue]
    //
    // On stack, before: hash, inverse, program, value
    // Compiler value, before: lastHelper=value of last found helper, if any
    // On stack, after, if no lastHelper: same as [blockValue]
    // On stack, after, if lastHelper: value
    ambiguousBlockValue: function() {
      this.context.aliases.blockHelperMissing = 'helpers.blockHelperMissing';

      var params = ["depth0"];
      this.setupParams(0, params);

      var current = this.topStack();
      params.splice(1, 0, current);

      this.source.push("if (!" + this.lastHelper + ") { " + current + " = blockHelperMissing.call(" + params.join(", ") + "); }");
    },

    // [appendContent]
    //
    // On stack, before: ...
    // On stack, after: ...
    //
    // Appends the string value of `content` to the current buffer
    appendContent: function(content) {
      this.source.push(this.appendToBuffer(this.quotedString(content)));
    },

    // [append]
    //
    // On stack, before: value, ...
    // On stack, after: ...
    //
    // Coerces `value` to a String and appends it to the current buffer.
    //
    // If `value` is truthy, or 0, it is coerced into a string and appended
    // Otherwise, the empty string is appended
    append: function() {
      var local = this.popStack();
      this.source.push("if(" + local + " || " + local + " === 0) { " + this.appendToBuffer(local) + " }");
      if (this.environment.isSimple) {
        this.source.push("else { " + this.appendToBuffer("''") + " }");
      }
    },

    // [appendEscaped]
    //
    // On stack, before: value, ...
    // On stack, after: ...
    //
    // Escape `value` and append it to the buffer
    appendEscaped: function() {
      var opcode = this.nextOpcode(), extra = "";
      this.context.aliases.escapeExpression = 'this.escapeExpression';

      if(opcode && opcode.opcode === 'appendContent') {
        extra = " + " + this.quotedString(opcode.args[0]);
        this.eat(opcode);
      }

      this.source.push(this.appendToBuffer("escapeExpression(" + this.popStack() + ")" + extra));
    },

    // [getContext]
    //
    // On stack, before: ...
    // On stack, after: ...
    // Compiler value, after: lastContext=depth
    //
    // Set the value of the `lastContext` compiler value to the depth
    getContext: function(depth) {
      if(this.lastContext !== depth) {
        this.lastContext = depth;
      }
    },

    // [lookupOnContext]
    //
    // On stack, before: ...
    // On stack, after: currentContext[name], ...
    //
    // Looks up the value of `name` on the current context and pushes
    // it onto the stack.
    lookupOnContext: function(name) {
      this.pushStack(this.nameLookup('depth' + this.lastContext, name, 'context'));
    },

    // [pushContext]
    //
    // On stack, before: ...
    // On stack, after: currentContext, ...
    //
    // Pushes the value of the current context onto the stack.
    pushContext: function() {
      this.pushStackLiteral('depth' + this.lastContext);
    },

    // [resolvePossibleLambda]
    //
    // On stack, before: value, ...
    // On stack, after: resolved value, ...
    //
    // If the `value` is a lambda, replace it on the stack by
    // the return value of the lambda
    resolvePossibleLambda: function() {
      this.context.aliases.functionType = '"function"';

      this.replaceStack(function(current) {
        return "typeof " + current + " === functionType ? " + current + ".apply(depth0) : " + current;
      });
    },

    // [lookup]
    //
    // On stack, before: value, ...
    // On stack, after: value[name], ...
    //
    // Replace the value on the stack with the result of looking
    // up `name` on `value`
    lookup: function(name) {
      this.replaceStack(function(current) {
        return current + " == null || " + current + " === false ? " + current + " : " + this.nameLookup(current, name, 'context');
      });
    },

    // [lookupData]
    //
    // On stack, before: ...
    // On stack, after: data[id], ...
    //
    // Push the result of looking up `id` on the current data
    lookupData: function(id) {
      this.pushStack(this.nameLookup('data', id, 'data'));
    },

    // [pushStringParam]
    //
    // On stack, before: ...
    // On stack, after: string, currentContext, ...
    //
    // This opcode is designed for use in string mode, which
    // provides the string value of a parameter along with its
    // depth rather than resolving it immediately.
    pushStringParam: function(string, type) {
      this.pushStackLiteral('depth' + this.lastContext);

      this.pushString(type);

      if (typeof string === 'string') {
        this.pushString(string);
      } else {
        this.pushStackLiteral(string);
      }
    },

    pushHash: function() {
      this.push('{}');

      if (this.options.stringParams) {
        this.register('hashTypes', '{}');
      }
    },

    // [pushString]
    //
    // On stack, before: ...
    // On stack, after: quotedString(string), ...
    //
    // Push a quoted version of `string` onto the stack
    pushString: function(string) {
      this.pushStackLiteral(this.quotedString(string));
    },

    // [push]
    //
    // On stack, before: ...
    // On stack, after: expr, ...
    //
    // Push an expression onto the stack
    push: function(expr) {
      this.pushStack(expr);
    },

    // [pushLiteral]
    //
    // On stack, before: ...
    // On stack, after: value, ...
    //
    // Pushes a value onto the stack. This operation prevents
    // the compiler from creating a temporary variable to hold
    // it.
    pushLiteral: function(value) {
      this.pushStackLiteral(value);
    },

    // [pushProgram]
    //
    // On stack, before: ...
    // On stack, after: program(guid), ...
    //
    // Push a program expression onto the stack. This takes
    // a compile-time guid and converts it into a runtime-accessible
    // expression.
    pushProgram: function(guid) {
      if (guid != null) {
        this.pushStackLiteral(this.programExpression(guid));
      } else {
        this.pushStackLiteral(null);
      }
    },

    // [invokeHelper]
    //
    // On stack, before: hash, inverse, program, params..., ...
    // On stack, after: result of helper invocation
    //
    // Pops off the helper's parameters, invokes the helper,
    // and pushes the helper's return value onto the stack.
    //
    // If the helper is not found, `helperMissing` is called.
    invokeHelper: function(paramSize, name) {
      this.context.aliases.helperMissing = 'helpers.helperMissing';

      var helper = this.lastHelper = this.setupHelper(paramSize, name);
      this.register('foundHelper', helper.name);

      this.pushStack("foundHelper ? foundHelper.call(" +
        helper.callParams + ") " + ": helperMissing.call(" +
        helper.helperMissingParams + ")");
    },

    // [invokeKnownHelper]
    //
    // On stack, before: hash, inverse, program, params..., ...
    // On stack, after: result of helper invocation
    //
    // This operation is used when the helper is known to exist,
    // so a `helperMissing` fallback is not required.
    invokeKnownHelper: function(paramSize, name) {
      var helper = this.setupHelper(paramSize, name);
      this.pushStack(helper.name + ".call(" + helper.callParams + ")");
    },

    // [invokeAmbiguous]
    //
    // On stack, before: hash, inverse, program, params..., ...
    // On stack, after: result of disambiguation
    //
    // This operation is used when an expression like `{{foo}}`
    // is provided, but we don't know at compile-time whether it
    // is a helper or a path.
    //
    // This operation emits more code than the other options,
    // and can be avoided by passing the `knownHelpers` and
    // `knownHelpersOnly` flags at compile-time.
    invokeAmbiguous: function(name) {
      this.context.aliases.functionType = '"function"';

      this.pushStackLiteral('{}');
      var helper = this.setupHelper(0, name);

      var helperName = this.lastHelper = this.nameLookup('helpers', name, 'helper');
      this.register('foundHelper', helperName);

      var nonHelper = this.nameLookup('depth' + this.lastContext, name, 'context');
      var nextStack = this.nextStack();

      this.source.push('if (foundHelper) { ' + nextStack + ' = foundHelper.call(' + helper.callParams + '); }');
      this.source.push('else { ' + nextStack + ' = ' + nonHelper + '; ' + nextStack + ' = typeof ' + nextStack + ' === functionType ? ' + nextStack + '.apply(depth0) : ' + nextStack + '; }');
    },

    // [invokePartial]
    //
    // On stack, before: context, ...
    // On stack after: result of partial invocation
    //
    // This operation pops off a context, invokes a partial with that context,
    // and pushes the result of the invocation back.
    invokePartial: function(name) {
      var params = [this.nameLookup('partials', name, 'partial'), "'" + name + "'", this.popStack(), "helpers", "partials"];

      if (this.options.data) {
        params.push("data");
      }

      this.context.aliases.self = "this";
      this.pushStack("self.invokePartial(" + params.join(", ") + ")");
    },

    // [assignToHash]
    //
    // On stack, before: value, hash, ...
    // On stack, after: hash, ...
    //
    // Pops a value and hash off the stack, assigns `hash[key] = value`
    // and pushes the hash back onto the stack.
    assignToHash: function(key) {
      var value = this.popStack();

      if (this.options.stringParams) {
        var type = this.popStack();
        this.popStack();
        this.source.push("hashTypes['" + key + "'] = " + type + ";");
      }

      var hash = this.topStack();

      this.source.push(hash + "['" + key + "'] = " + value + ";");
    },

    // HELPERS

    compiler: JavaScriptCompiler,

    compileChildren: function(environment, options) {
      var children = environment.children, child, compiler;

      for(var i=0, l=children.length; i<l; i++) {
        child = children[i];
        compiler = new this.compiler();

        this.context.programs.push('');     // Placeholder to prevent name conflicts for nested children
        var index = this.context.programs.length;
        child.index = index;
        child.name = 'program' + index;
        this.context.programs[index] = compiler.compile(child, options, this.context);
      }
    },

    programExpression: function(guid) {
      this.context.aliases.self = "this";

      if(guid == null) {
        return "self.noop";
      }

      var child = this.environment.children[guid],
          depths = child.depths.list, depth;

      var programParams = [child.index, child.name, "data"];

      for(var i=0, l = depths.length; i<l; i++) {
        depth = depths[i];

        if(depth === 1) { programParams.push("depth0"); }
        else { programParams.push("depth" + (depth - 1)); }
      }

      if(depths.length === 0) {
        return "self.program(" + programParams.join(", ") + ")";
      } else {
        programParams.shift();
        return "self.programWithDepth(" + programParams.join(", ") + ")";
      }
    },

    register: function(name, val) {
      this.useRegister(name);
      this.source.push(name + " = " + val + ";");
    },

    useRegister: function(name) {
      if(!this.registers[name]) {
        this.registers[name] = true;
        this.registers.list.push(name);
      }
    },

    pushStackLiteral: function(item) {
      this.compileStack.push(new Literal(item));
      return item;
    },

    pushStack: function(item) {
      var stack = this.incrStack();
      this.source.push(stack + " = " + item + ";");
      this.compileStack.push(stack);
      return stack;
    },

    replaceStack: function(callback) {
      var stack = this.topStack(),
          item = callback.call(this, stack);

      // Prevent modification of the context depth variable. Through replaceStack
      if (/^depth/.test(stack)) {
        stack = this.nextStack();
      }

      this.source.push(stack + " = " + item + ";");
      return stack;
    },

    nextStack: function(skipCompileStack) {
      var name = this.incrStack();
      this.compileStack.push(name);
      return name;
    },

    incrStack: function() {
      this.stackSlot++;
      if(this.stackSlot > this.stackVars.length) { this.stackVars.push("stack" + this.stackSlot); }
      return "stack" + this.stackSlot;
    },

    popStack: function() {
      var item = this.compileStack.pop();

      if (item instanceof Literal) {
        return item.value;
      } else {
        this.stackSlot--;
        return item;
      }
    },

    topStack: function() {
      var item = this.compileStack[this.compileStack.length - 1];

      if (item instanceof Literal) {
        return item.value;
      } else {
        return item;
      }
    },

    quotedString: function(str) {
      return '"' + str
        .replace(/\\/g, '\\\\')
        .replace(/"/g, '\\"')
        .replace(/\n/g, '\\n')
        .replace(/\r/g, '\\r') + '"';
    },

    setupHelper: function(paramSize, name) {
      var params = [];
      this.setupParams(paramSize, params);
      var foundHelper = this.nameLookup('helpers', name, 'helper');

      return {
        params: params,
        name: foundHelper,
        callParams: ["depth0"].concat(params).join(", "),
        helperMissingParams: ["depth0", this.quotedString(name)].concat(params).join(", ")
      };
    },

    // the params and contexts arguments are passed in arrays
    // to fill in
    setupParams: function(paramSize, params) {
      var options = [], contexts = [], types = [], param, inverse, program;

      options.push("hash:" + this.popStack());

      inverse = this.popStack();
      program = this.popStack();

      // Avoid setting fn and inverse if neither are set. This allows
      // helpers to do a check for `if (options.fn)`
      if (program || inverse) {
        if (!program) {
          this.context.aliases.self = "this";
          program = "self.noop";
        }

        if (!inverse) {
         this.context.aliases.self = "this";
          inverse = "self.noop";
        }

        options.push("inverse:" + inverse);
        options.push("fn:" + program);
      }

      for(var i=0; i<paramSize; i++) {
        param = this.popStack();
        params.push(param);

        if(this.options.stringParams) {
          types.push(this.popStack());
          contexts.push(this.popStack());
        }
      }

      if (this.options.stringParams) {
        options.push("contexts:[" + contexts.join(",") + "]");
        options.push("types:[" + types.join(",") + "]");
        options.push("hashTypes:hashTypes");
      }

      if(this.options.data) {
        options.push("data:data");
      }

      params.push("{" + options.join(",") + "}");
      return params.join(", ");
    }
  };

  var reservedWords = (
    "break else new var" +
    " case finally return void" +
    " catch for switch while" +
    " continue function this with" +
    " default if throw" +
    " delete in try" +
    " do instanceof typeof" +
    " abstract enum int short" +
    " boolean export interface static" +
    " byte extends long super" +
    " char final native synchronized" +
    " class float package throws" +
    " const goto private transient" +
    " debugger implements protected volatile" +
    " double import public let yield"
  ).split(" ");

  var compilerWords = JavaScriptCompiler.RESERVED_WORDS = {};

  for(var i=0, l=reservedWords.length; i<l; i++) {
    compilerWords[reservedWords[i]] = true;
  }

  JavaScriptCompiler.isValidJavaScriptVariableName = function(name) {
    if(!JavaScriptCompiler.RESERVED_WORDS[name] && /^[a-zA-Z_$][0-9a-zA-Z_$]+$/.test(name)) {
      return true;
    }
    return false;
  };

})(Handlebars.Compiler, Handlebars.JavaScriptCompiler);

Handlebars.precompile = function(string, options) {
  if (typeof string !== 'string') {
    throw new Handlebars.Exception("You must pass a string to Handlebars.compile. You passed " + string);
  }

  options = options || {};
  if (!('data' in options)) {
    options.data = true;
  }
  var ast = Handlebars.parse(string);
  var environment = new Handlebars.Compiler().compile(ast, options);
  return new Handlebars.JavaScriptCompiler().compile(environment, options);
};

Handlebars.compile = function(string, options) {
  if (typeof string !== 'string') {
    throw new Handlebars.Exception("You must pass a string to Handlebars.compile. You passed " + string);
  }

  options = options || {};
  if (!('data' in options)) {
    options.data = true;
  }
  var compiled;
  function compile() {
    var ast = Handlebars.parse(string);
    var environment = new Handlebars.Compiler().compile(ast, options);
    var templateSpec = new Handlebars.JavaScriptCompiler().compile(environment, options, undefined, true);
    return Handlebars.template(templateSpec);
  }

  // Template is only compiled on first use and cached after that point.
  return function(context, options) {
    if (!compiled) {
      compiled = compile();
    }
    return compiled.call(this, context, options);
  };
};
;
// lib/handlebars/runtime.js
Handlebars.VM = {
  template: function(templateSpec) {
    // Just add water
    var container = {
      escapeExpression: Handlebars.Utils.escapeExpression,
      invokePartial: Handlebars.VM.invokePartial,
      programs: [],
      program: function(i, fn, data) {
        var programWrapper = this.programs[i];
        if(data) {
          return Handlebars.VM.program(fn, data);
        } else if(programWrapper) {
          return programWrapper;
        } else {
          programWrapper = this.programs[i] = Handlebars.VM.program(fn);
          return programWrapper;
        }
      },
      programWithDepth: Handlebars.VM.programWithDepth,
      noop: Handlebars.VM.noop
    };

    return function(context, options) {
      options = options || {};
      return templateSpec.call(container, Handlebars, context, options.helpers, options.partials, options.data);
    };
  },

  programWithDepth: function(fn, data, $depth) {
    var args = Array.prototype.slice.call(arguments, 2);

    return function(context, options) {
      options = options || {};

      return fn.apply(this, [context, options.data || data].concat(args));
    };
  },
  program: function(fn, data) {
    return function(context, options) {
      options = options || {};

      return fn(context, options.data || data);
    };
  },
  noop: function() { return ""; },
  invokePartial: function(partial, name, context, helpers, partials, data) {
    var options = { helpers: helpers, partials: partials, data: data };

    if(partial === undefined) {
      throw new Handlebars.Exception("The partial " + name + " could not be found");
    } else if(partial instanceof Function) {
      return partial(context, options);
    } else if (!Handlebars.compile) {
      throw new Handlebars.Exception("The partial " + name + " could not be compiled when running in runtime-only mode");
    } else {
      partials[name] = Handlebars.compile(partial, {data: data !== undefined});
      return partials[name](context, options);
    }
  }
};

Handlebars.template = Handlebars.VM.template;
;

for(var i in Handlebars) {
  this.Handlebars[i] = Handlebars[i];
}
})(this);
var Handlebars = this.Handlebars;



(function(root) {
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
  this.StringScanner = StringScanner;
})(this);

var StringScanner = this.StringScanner;


// lib/emblem.js
var Emblem;

this.Emblem = {};

Emblem = this.Emblem;

Emblem.VERSION = "0.0.3";

//exports = Emblem;

//

//

//

//

//
;
// lib/parser.js

//
//

Emblem.Parser = (function() {
  /*
   * Generated by PEG.js 0.7.0.
   *
   * http://pegjs.majda.cz/
   */

  function peg$subclass(child, parent) {
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor();
  }

  function SyntaxError(expected, found, offset, line, column) {
    function buildMessage(expected, found) {
      function stringEscape(s) {
        function hex(ch) { return ch.charCodeAt(0).toString(16).toUpperCase(); }

        return s
          .replace(/\\/g,   '\\\\')
          .replace(/"/g,    '\\"')
          .replace(/\x08/g, '\\b')
          .replace(/\t/g,   '\\t')
          .replace(/\n/g,   '\\n')
          .replace(/\f/g,   '\\f')
          .replace(/\r/g,   '\\r')
          .replace(/[\x00-\x07\x0B\x0E\x0F]/g, function(ch) { return '\\x0' + hex(ch); })
          .replace(/[\x10-\x1F\x80-\xFF]/g,    function(ch) { return '\\x'  + hex(ch); })
          .replace(/[\u0180-\u0FFF]/g,         function(ch) { return '\\u0' + hex(ch); })
          .replace(/[\u1080-\uFFFF]/g,         function(ch) { return '\\u'  + hex(ch); });
      }

      var expectedDesc, foundDesc;

      switch (expected.length) {
        case 0:
          expectedDesc = "end of input";
          break;

        case 1:
          expectedDesc = expected[0];
          break;

        default:
          expectedDesc = expected.slice(0, -1).join(", ")
            + " or "
            + expected[expected.length - 1];
      }

      foundDesc = found ? "\"" + stringEscape(found) + "\"" : "end of input";

      return "Expected " + expectedDesc + " but " + foundDesc + " found.";
    }

    this.expected = expected;
    this.found    = found;
    this.offset   = offset;
    this.line     = line;
    this.column   = column;

    this.name     = "SyntaxError";
    this.message  = buildMessage(expected, found);
  }

  peg$subclass(SyntaxError, Error);

  function parse(input) {
    var options = arguments.length > 1 ? arguments[1] : {},

        peg$startRuleFunctions = { start: peg$parsestart },
        peg$startRuleFunction  = peg$parsestart,

        peg$c0 = [],
        peg$c1 = function(statements) {
          // Coalesce all adjacent ContentNodes into one.

          var compressedStatements = [];
          var buffer = [];

          for(var i = 0; i < statements.length; ++i) {
            var nodes = statements[i];

            for(var j = 0; j < nodes.length; ++j) {
              var node = nodes[j]
              if(node.type === "content") {
                if(node.string) {
                  // Ignore empty strings (comments).
                  buffer.push(node.string);
                }
                continue;
              } 

              // Flush content if present.
              if(buffer.length) {
                compressedStatements.push(new Handlebars.AST.ContentNode(buffer.join('')));
                buffer = [];
              }
              compressedStatements.push(node);
            }
          }

          if(buffer.length) { 
            compressedStatements.push(new Handlebars.AST.ContentNode(buffer.join(''))); 
          }

          return compressedStatements;
        },
        peg$c2 = null,
        peg$c3 = "",
        peg$c4 = "else",
        peg$c5 = "\"else\"",
        peg$c6 = function(c) {return c;},
        peg$c7 = function(c, i) { 
          return new Handlebars.AST.ProgramNode(c, i || []);
        },
        peg$c8 = function(m) { 
          return [m]; 
        },
        peg$c9 = "/",
        peg$c10 = "\"/\"",
        peg$c11 = function() { return []; },
        peg$c12 = /^[A-Z]/,
        peg$c13 = "[A-Z]",
        peg$c14 = function(ret) {
          // TODO make this configurable
          var defaultCapitalizedHelper = 'view';

          if(ret.mustache) {
            // Block. Modify inner MustacheNode and return.

            // Make sure a suffix modifier hasn't already been applied.
            var ch = ret.mustache.id.string.charAt(0);
            if(!ch.match(/[A-Z]/)) return ret;

            ret.mustache = unshiftParam(ret.mustache, defaultCapitalizedHelper);
            return ret;
          } else {

            // Make sure a suffix modifier hasn't already been applied.
            var ch = ret.id.string.charAt(0);
            if(!ch.match(/[A-Z]/)) return ret;

            return unshiftParam(ret, defaultCapitalizedHelper);
          }
        },
        peg$c15 = function(h, c) { 
          var ret = h[0];
          if(c) {
            ret = ret.concat(c[1]);
          }

          // Push the closing tag ContentNode if it exists (self-closing if not)
          if(h[1]) {
            ret.push(h[1]);
          }

          return ret;
        },
        peg$c16 = " ",
        peg$c17 = "\" \"",
        peg$c18 = function(h, c, multilineContent) { 
          // h is [[open tag content], closing tag ContentNode]
          var ret = h[0];
          if(c) {
            ret = ret.concat(c);
          }

          if(multilineContent) {
            // Handle multi-line content, e.g.
            // span Hello, 
            //      This is valid markup.

            multilineContent = multilineContent[1];
            for(var i = 0; i < multilineContent.length; ++i) {
              ret = ret.concat(multilineContent[i]);
            }
          }

          // Push the closing tag ContentNode if it exists (self-closing if not)
          if(h[1]) {
            ret.push(h[1]);
          }

          return ret;
        },
        peg$c19 = function(mustacheNode, block) { 
          if(!block) return mustacheNode;
          var programNode = block[1];
          return new Handlebars.AST.BlockNode(mustacheNode, programNode, programNode.inverse, mustacheNode.id);
        },
        peg$c20 = function(e, ret) {
          var mustache = ret.mustache || ret;
          mustache.escaped = e;
          return ret;
        },
        peg$c21 = function(path, tm, params, hash) { 
          var actualParams = [];
          var attrs = {};
          var hasAttrs = false;

          // Convert shorthand html attributes (e.g. % = tagName, . = class, etc)
          for(var i = 0; i < params.length; ++i) {
            var p = params[i];
            var attrKey = p[0];
            if(attrKey == 'tagName' || attrKey == 'elementId' || attrKey == 'class') {
              hasAttrs = true;
              attrs[attrKey] = attrs[attrKey] || [];
              attrs[attrKey].push(p[1]);
            } else {
              actualParams.push(p);
            }
          }

          if(hasAttrs) {
            hash = hash || new Handlebars.AST.HashNode([]);
            for(var k in attrs) {
              if(!attrs.hasOwnProperty(k)) continue;
              hash.pairs.push([k, new Handlebars.AST.StringNode(attrs[k].join(' '))]);
            }
          }

          actualParams.unshift(path);

          var mustacheNode = new Handlebars.AST.MustacheNode(actualParams, hash); 

          if(tm == '!') {
            return unshiftParam(mustacheNode, 'unbound');
          } else if(tm == '?') {
            return unshiftParam(mustacheNode, 'if');
          } else if(tm == '^') {
            return unshiftParam(mustacheNode, 'unless');
          }

          return mustacheNode;
        },
        peg$c22 = function(p, m) { 
          var ret = new String(p);
          ret.trailingModifier = m;
          return ret;
        },
        peg$c23 = function(t) { return ['tagName', t]; },
        peg$c24 = function(i) { return ['elementId', i]; },
        peg$c25 = function(c) { return ['class', c]; },
        peg$c26 = function(id, classes) { return [id, classes]; },
        peg$c27 = function(classes) { return [null, classes]; },
        peg$c28 = function(h) { return h; },
        peg$c29 = "TrailingModifier",
        peg$c30 = /^[!?*\^]/,
        peg$c31 = "[!?*\\^]",
        peg$c32 = function(h) { return new Handlebars.AST.HashNode(h); },
        peg$c33 = "PathIdent",
        peg$c34 = "..",
        peg$c35 = "\"..\"",
        peg$c36 = ".",
        peg$c37 = "\".\"",
        peg$c38 = /^[a-zA-Z0-9_$\-]/,
        peg$c39 = "[a-zA-Z0-9_$\\-]",
        peg$c40 = "=",
        peg$c41 = "\"=\"",
        peg$c42 = function(s) { return s; },
        peg$c43 = "Key",
        peg$c44 = function(h) { return [h[0], h[2]]; },
        peg$c45 = function(p) { return p; },
        peg$c46 = function(first, tail) {
          var ret = [first];
          for(var i = 0; i < tail.length; ++i) {
            //ret = ret.concat(tail[i]);
            ret.push(tail[i]);
          }
          return ret;
        },
        peg$c47 = "PathSeparator",
        peg$c48 = /^[\/.]/,
        peg$c49 = "[\\/.]",
        peg$c50 = function(v) { return new Handlebars.AST.IdNode(v); },
        peg$c51 = function(v) { return new Handlebars.AST.StringNode(v); },
        peg$c52 = function(v) { return new Handlebars.AST.IntegerNode(v); },
        peg$c53 = function(v) { return new Handlebars.AST.BooleanNode(v); },
        peg$c54 = "Boolean",
        peg$c55 = "true",
        peg$c56 = "\"true\"",
        peg$c57 = "false",
        peg$c58 = "\"false\"",
        peg$c59 = "Integer",
        peg$c60 = /^[0-9]/,
        peg$c61 = "[0-9]",
        peg$c62 = function(s) { return parseInt(s); },
        peg$c63 = "\"",
        peg$c64 = "\"\\\"\"",
        peg$c65 = "'",
        peg$c66 = "\"'\"",
        peg$c67 = function(p) { return p[1]; },
        peg$c68 = /^[^"}]/,
        peg$c69 = "[^\"}]",
        peg$c70 = /^[^'}]/,
        peg$c71 = "[^'}]",
        peg$c72 = /^[A-Za-z]/,
        peg$c73 = "[A-Za-z]",
        peg$c74 = function(m) { return [m]; },
        peg$c75 = "|",
        peg$c76 = "\"|\"",
        peg$c77 = "<",
        peg$c78 = "\"<\"",
        peg$c79 = function(nodes, indentedNodes) { 
          if(indentedNodes) {
            indentedNodes = indentedNodes[1];
            for(var i = 0; i < indentedNodes.length; ++i) {
              nodes = nodes.concat(indentedNodes[i]);
            }
          }
          return nodes; 
        },
        peg$c80 = function(first, tail) {
          var ret = [];
          if(first) { ret.push(first); } 
          for(var i = 0; i < tail.length; ++i) {
            var t = tail[i];
            ret.push(t[0]);
            if(t[1]) { ret.push(t[1]); }
          }
          return ret;
        },
        peg$c81 = function(m) { m.escaped = true; return m; },
        peg$c82 = function(m) { m.escaped = false; return m; },
        peg$c83 = function(a) { return new Handlebars.AST.ContentNode(a.join('')); },
        peg$c84 = "any character",
        peg$c85 = function(c) { return c; },
        peg$c86 = "SingleMustacheOpen",
        peg$c87 = "{",
        peg$c88 = "\"{\"",
        peg$c89 = "DoubleMustacheOpen",
        peg$c90 = "{{",
        peg$c91 = "\"{{\"",
        peg$c92 = "TripleMustacheOpen",
        peg$c93 = "{{{",
        peg$c94 = "\"{{{\"",
        peg$c95 = "SingleMustacheClose",
        peg$c96 = "}",
        peg$c97 = "\"}\"",
        peg$c98 = "DoubleMustacheClose",
        peg$c99 = "}}",
        peg$c100 = "\"}}\"",
        peg$c101 = "TripleMustacheClose",
        peg$c102 = "}}}",
        peg$c103 = "\"}}}\"",
        peg$c104 = "InterpolationOpen",
        peg$c105 = "#{",
        peg$c106 = "\"#{\"",
        peg$c107 = "InterpolationClose",
        peg$c108 = "==",
        peg$c109 = "\"==\"",
        peg$c110 = function() { return false; },
        peg$c111 = function() { return true; },
        peg$c112 = function(h, s, m, f) { return [h, s, m, f]; },
        peg$c113 = function(s, m, f) { return [null, s, m, f] },
        peg$c114 = function(h) {
          var tagName = h[0] || 'div',
              shorthandAttributes = h[1] || [],
              inTagMustaches = h[2],
              fullAttributes = h[3],
              id = shorthandAttributes[0],
              classes = shorthandAttributes[1];

          var tagOpenContent = [];
          tagOpenContent.push(new Handlebars.AST.ContentNode('<' + tagName));

          if(id) {
            tagOpenContent.push(new Handlebars.AST.ContentNode(' id="' + id + '"'));
          }

          if(classes && classes.length) {
            tagOpenContent.push(new Handlebars.AST.ContentNode(' class="' + classes.join(' ') + '"'));
          }

          // Pad in tag mustaches with spaces.
          for(var i = 0; i < inTagMustaches.length; ++i) {
            tagOpenContent.push(new Handlebars.AST.ContentNode(' '));
            tagOpenContent.push(inTagMustaches[i]);
          }

          for(var i = 0; i < fullAttributes.length; ++i) {
            tagOpenContent = tagOpenContent.concat(fullAttributes[i]);
          }

          if(SELF_CLOSING_TAG[tagName]) {
            tagOpenContent.push(new Handlebars.AST.ContentNode(' />'));
            return [tagOpenContent];
          } else {
            tagOpenContent.push(new Handlebars.AST.ContentNode('>'));
            return [tagOpenContent, new Handlebars.AST.ContentNode('</' + tagName + '>')];
          }
        },
        peg$c115 = function(a) {
          return [new Handlebars.AST.ContentNode(' '), a]; 
        },
        peg$c116 = /^[A-Za-z.:0-9]/,
        peg$c117 = "[A-Za-z.:0-9]",
        peg$c118 = function(id) { return new Handlebars.AST.MustacheNode([id]); },
        peg$c119 = function(event, mustacheNode) {
          // Unshift the action helper and augment the hash
          return unshiftParam(mustacheNode, 'action', [['on', new Handlebars.AST.StringNode(event)]]);
        },
        peg$c120 = function(key, value) { 
          var hashNode = new Handlebars.AST.HashNode([[key, new Handlebars.AST.StringNode(value)]]);
          var params = [new Handlebars.AST.IdNode(['bindAttr'])];

          return new Handlebars.AST.MustacheNode(params, hashNode);
        },
        peg$c121 = function(key, value) { 
          var s = key + '=' + '"' + value + '"';
          return new Handlebars.AST.ContentNode(s);
        },
        peg$c122 = "_",
        peg$c123 = "\"_\"",
        peg$c124 = "-",
        peg$c125 = "\"-\"",
        peg$c126 = "%",
        peg$c127 = "\"%\"",
        peg$c128 = "#",
        peg$c129 = "\"#\"",
        peg$c130 = function(c) { return c;},
        peg$c131 = "CSSIdentifier",
        peg$c132 = function(nmstart, nmchars) { return nmstart + nmchars; },
        peg$c133 = /^[_a-zA-Z0-9\-]/,
        peg$c134 = "[_a-zA-Z0-9\\-]",
        peg$c135 = /^[_a-zA-Z]/,
        peg$c136 = "[_a-zA-Z]",
        peg$c137 = /^[\x80-\xFF]/,
        peg$c138 = "[\\x80-\\xFF]",
        peg$c139 = "KnownHTMLTagName",
        peg$c140 = /^[:_a-zA-Z0-9\-]/,
        peg$c141 = "[:_a-zA-Z0-9\\-]",
        peg$c142 = "figcaption",
        peg$c143 = "\"figcaption\"",
        peg$c144 = "blockquote",
        peg$c145 = "\"blockquote\"",
        peg$c146 = "plaintext",
        peg$c147 = "\"plaintext\"",
        peg$c148 = "textarea",
        peg$c149 = "\"textarea\"",
        peg$c150 = "progress",
        peg$c151 = "\"progress\"",
        peg$c152 = "optgroup",
        peg$c153 = "\"optgroup\"",
        peg$c154 = "noscript",
        peg$c155 = "\"noscript\"",
        peg$c156 = "noframes",
        peg$c157 = "\"noframes\"",
        peg$c158 = "frameset",
        peg$c159 = "\"frameset\"",
        peg$c160 = "fieldset",
        peg$c161 = "\"fieldset\"",
        peg$c162 = "datalist",
        peg$c163 = "\"datalist\"",
        peg$c164 = "colgroup",
        peg$c165 = "\"colgroup\"",
        peg$c166 = "basefont",
        peg$c167 = "\"basefont\"",
        peg$c168 = "summary",
        peg$c169 = "\"summary\"",
        peg$c170 = "section",
        peg$c171 = "\"section\"",
        peg$c172 = "marquee",
        peg$c173 = "\"marquee\"",
        peg$c174 = "listing",
        peg$c175 = "\"listing\"",
        peg$c176 = "isindex",
        peg$c177 = "\"isindex\"",
        peg$c178 = "details",
        peg$c179 = "\"details\"",
        peg$c180 = "command",
        peg$c181 = "\"command\"",
        peg$c182 = "caption",
        peg$c183 = "\"caption\"",
        peg$c184 = "bgsound",
        peg$c185 = "\"bgsound\"",
        peg$c186 = "article",
        peg$c187 = "\"article\"",
        peg$c188 = "address",
        peg$c189 = "\"address\"",
        peg$c190 = "acronym",
        peg$c191 = "\"acronym\"",
        peg$c192 = "strong",
        peg$c193 = "\"strong\"",
        peg$c194 = "strike",
        peg$c195 = "\"strike\"",
        peg$c196 = "spacer",
        peg$c197 = "\"spacer\"",
        peg$c198 = "source",
        peg$c199 = "\"source\"",
        peg$c200 = "select",
        peg$c201 = "\"select\"",
        peg$c202 = "script",
        peg$c203 = "\"script\"",
        peg$c204 = "output",
        peg$c205 = "\"output\"",
        peg$c206 = "option",
        peg$c207 = "\"option\"",
        peg$c208 = "object",
        peg$c209 = "\"object\"",
        peg$c210 = "legend",
        peg$c211 = "\"legend\"",
        peg$c212 = "keygen",
        peg$c213 = "\"keygen\"",
        peg$c214 = "iframe",
        peg$c215 = "\"iframe\"",
        peg$c216 = "hgroup",
        peg$c217 = "\"hgroup\"",
        peg$c218 = "header",
        peg$c219 = "\"header\"",
        peg$c220 = "footer",
        peg$c221 = "\"footer\"",
        peg$c222 = "figure",
        peg$c223 = "\"figure\"",
        peg$c224 = "center",
        peg$c225 = "\"center\"",
        peg$c226 = "canvas",
        peg$c227 = "\"canvas\"",
        peg$c228 = "button",
        peg$c229 = "\"button\"",
        peg$c230 = "applet",
        peg$c231 = "\"applet\"",
        peg$c232 = "video",
        peg$c233 = "\"video\"",
        peg$c234 = "track",
        peg$c235 = "\"track\"",
        peg$c236 = "title",
        peg$c237 = "\"title\"",
        peg$c238 = "thead",
        peg$c239 = "\"thead\"",
        peg$c240 = "tfoot",
        peg$c241 = "\"tfoot\"",
        peg$c242 = "tbody",
        peg$c243 = "\"tbody\"",
        peg$c244 = "table",
        peg$c245 = "\"table\"",
        peg$c246 = "style",
        peg$c247 = "\"style\"",
        peg$c248 = "small",
        peg$c249 = "\"small\"",
        peg$c250 = "param",
        peg$c251 = "\"param\"",
        peg$c252 = "meter",
        peg$c253 = "\"meter\"",
        peg$c254 = "label",
        peg$c255 = "\"label\"",
        peg$c256 = "input",
        peg$c257 = "\"input\"",
        peg$c258 = "frame",
        peg$c259 = "\"frame\"",
        peg$c260 = "embed",
        peg$c261 = "\"embed\"",
        peg$c262 = "blink",
        peg$c263 = "\"blink\"",
        peg$c264 = "audio",
        peg$c265 = "\"audio\"",
        peg$c266 = "aside",
        peg$c267 = "\"aside\"",
        peg$c268 = "time",
        peg$c269 = "\"time\"",
        peg$c270 = "span",
        peg$c271 = "\"span\"",
        peg$c272 = "samp",
        peg$c273 = "\"samp\"",
        peg$c274 = "ruby",
        peg$c275 = "\"ruby\"",
        peg$c276 = "nobr",
        peg$c277 = "\"nobr\"",
        peg$c278 = "meta",
        peg$c279 = "\"meta\"",
        peg$c280 = "menu",
        peg$c281 = "\"menu\"",
        peg$c282 = "mark",
        peg$c283 = "\"mark\"",
        peg$c284 = "main",
        peg$c285 = "\"main\"",
        peg$c286 = "link",
        peg$c287 = "\"link\"",
        peg$c288 = "html",
        peg$c289 = "\"html\"",
        peg$c290 = "head",
        peg$c291 = "\"head\"",
        peg$c292 = "form",
        peg$c293 = "\"form\"",
        peg$c294 = "font",
        peg$c295 = "\"font\"",
        peg$c296 = "data",
        peg$c297 = "\"data\"",
        peg$c298 = "code",
        peg$c299 = "\"code\"",
        peg$c300 = "cite",
        peg$c301 = "\"cite\"",
        peg$c302 = "body",
        peg$c303 = "\"body\"",
        peg$c304 = "base",
        peg$c305 = "\"base\"",
        peg$c306 = "area",
        peg$c307 = "\"area\"",
        peg$c308 = "abbr",
        peg$c309 = "\"abbr\"",
        peg$c310 = "xmp",
        peg$c311 = "\"xmp\"",
        peg$c312 = "wbr",
        peg$c313 = "\"wbr\"",
        peg$c314 = "var",
        peg$c315 = "\"var\"",
        peg$c316 = "sup",
        peg$c317 = "\"sup\"",
        peg$c318 = "sub",
        peg$c319 = "\"sub\"",
        peg$c320 = "pre",
        peg$c321 = "\"pre\"",
        peg$c322 = "nav",
        peg$c323 = "\"nav\"",
        peg$c324 = "map",
        peg$c325 = "\"map\"",
        peg$c326 = "kbd",
        peg$c327 = "\"kbd\"",
        peg$c328 = "ins",
        peg$c329 = "\"ins\"",
        peg$c330 = "img",
        peg$c331 = "\"img\"",
        peg$c332 = "div",
        peg$c333 = "\"div\"",
        peg$c334 = "dir",
        peg$c335 = "\"dir\"",
        peg$c336 = "dfn",
        peg$c337 = "\"dfn\"",
        peg$c338 = "del",
        peg$c339 = "\"del\"",
        peg$c340 = "col",
        peg$c341 = "\"col\"",
        peg$c342 = "big",
        peg$c343 = "\"big\"",
        peg$c344 = "bdo",
        peg$c345 = "\"bdo\"",
        peg$c346 = "bdi",
        peg$c347 = "\"bdi\"",
        peg$c348 = "ul",
        peg$c349 = "\"ul\"",
        peg$c350 = "tt",
        peg$c351 = "\"tt\"",
        peg$c352 = "tr",
        peg$c353 = "\"tr\"",
        peg$c354 = "th",
        peg$c355 = "\"th\"",
        peg$c356 = "td",
        peg$c357 = "\"td\"",
        peg$c358 = "rt",
        peg$c359 = "\"rt\"",
        peg$c360 = "rp",
        peg$c361 = "\"rp\"",
        peg$c362 = "ol",
        peg$c363 = "\"ol\"",
        peg$c364 = "li",
        peg$c365 = "\"li\"",
        peg$c366 = "hr",
        peg$c367 = "\"hr\"",
        peg$c368 = "h6",
        peg$c369 = "\"h6\"",
        peg$c370 = "h5",
        peg$c371 = "\"h5\"",
        peg$c372 = "h4",
        peg$c373 = "\"h4\"",
        peg$c374 = "h3",
        peg$c375 = "\"h3\"",
        peg$c376 = "h2",
        peg$c377 = "\"h2\"",
        peg$c378 = "h1",
        peg$c379 = "\"h1\"",
        peg$c380 = "em",
        peg$c381 = "\"em\"",
        peg$c382 = "dt",
        peg$c383 = "\"dt\"",
        peg$c384 = "dl",
        peg$c385 = "\"dl\"",
        peg$c386 = "dd",
        peg$c387 = "\"dd\"",
        peg$c388 = "br",
        peg$c389 = "\"br\"",
        peg$c390 = "u",
        peg$c391 = "\"u\"",
        peg$c392 = "s",
        peg$c393 = "\"s\"",
        peg$c394 = "q",
        peg$c395 = "\"q\"",
        peg$c396 = "p",
        peg$c397 = "\"p\"",
        peg$c398 = "i",
        peg$c399 = "\"i\"",
        peg$c400 = "b",
        peg$c401 = "\"b\"",
        peg$c402 = "a",
        peg$c403 = "\"a\"",
        peg$c404 = "a JS event",
        peg$c405 = "touchStart",
        peg$c406 = "\"touchStart\"",
        peg$c407 = "touchMove",
        peg$c408 = "\"touchMove\"",
        peg$c409 = "touchEnd",
        peg$c410 = "\"touchEnd\"",
        peg$c411 = "touchCancel",
        peg$c412 = "\"touchCancel\"",
        peg$c413 = "keyDown",
        peg$c414 = "\"keyDown\"",
        peg$c415 = "keyUp",
        peg$c416 = "\"keyUp\"",
        peg$c417 = "keyPress",
        peg$c418 = "\"keyPress\"",
        peg$c419 = "mouseDown",
        peg$c420 = "\"mouseDown\"",
        peg$c421 = "mouseUp",
        peg$c422 = "\"mouseUp\"",
        peg$c423 = "contextMenu",
        peg$c424 = "\"contextMenu\"",
        peg$c425 = "click",
        peg$c426 = "\"click\"",
        peg$c427 = "doubleClick",
        peg$c428 = "\"doubleClick\"",
        peg$c429 = "mouseMove",
        peg$c430 = "\"mouseMove\"",
        peg$c431 = "focusIn",
        peg$c432 = "\"focusIn\"",
        peg$c433 = "focusOut",
        peg$c434 = "\"focusOut\"",
        peg$c435 = "mouseEnter",
        peg$c436 = "\"mouseEnter\"",
        peg$c437 = "mouseLeave",
        peg$c438 = "\"mouseLeave\"",
        peg$c439 = "submit",
        peg$c440 = "\"submit\"",
        peg$c441 = "change",
        peg$c442 = "\"change\"",
        peg$c443 = "dragStart",
        peg$c444 = "\"dragStart\"",
        peg$c445 = "drag",
        peg$c446 = "\"drag\"",
        peg$c447 = "dragEnter",
        peg$c448 = "\"dragEnter\"",
        peg$c449 = "dragLeave",
        peg$c450 = "\"dragLeave\"",
        peg$c451 = "dragOver",
        peg$c452 = "\"dragOver\"",
        peg$c453 = "drop",
        peg$c454 = "\"drop\"",
        peg$c455 = "dragEnd",
        peg$c456 = "\"dragEnd\"",
        peg$c457 = "INDENT",
        peg$c458 = "\uEFEF",
        peg$c459 = "\"\\uEFEF\"",
        peg$c460 = function() { return ''; },
        peg$c461 = "DEDENT",
        peg$c462 = "\uEFFE",
        peg$c463 = "\"\\uEFFE\"",
        peg$c464 = "LineEnd",
        peg$c465 = "\n",
        peg$c466 = "\"\\n\"",
        peg$c467 = "\uEFFF",
        peg$c468 = "\"\\uEFFF\"",
        peg$c469 = "RequiredWhitespace",
        peg$c470 = "OptionalWhitespace",
        peg$c471 = "InlineWhitespace",
        peg$c472 = /^[ \t]/,
        peg$c473 = "[ \\t]",

        peg$currPos          = 0,
        peg$reportedPos      = 0,
        peg$cachedPos        = 0,
        peg$cachedPosDetails = { line: 1, column: 1, seenCR: false },
        peg$maxFailPos       = 0,
        peg$maxFailExpected  = [],
        peg$silentFails      = 0,

        peg$result;

    if ("startRule" in options) {
      if (!(options.startRule in peg$startRuleFunctions)) {
        throw new Error("Can't start parsing from rule \"" + options.startRule + "\".");
      }

      peg$startRuleFunction = peg$startRuleFunctions[options.startRule];
    }

    function text() {
      return input.substring(peg$reportedPos, peg$currPos);
    }

    function offset() {
      return peg$reportedPos;
    }

    function line() {
      return peg$computePosDetails(peg$reportedPos).line;
    }

    function column() {
      return peg$computePosDetails(peg$reportedPos).column;
    }

    function peg$computePosDetails(pos) {
      function advance(details, pos) {
        var p, ch;

        for (p = 0; p < pos; p++) {
          ch = input.charAt(p);
          if (ch === "\n") {
            if (!details.seenCR) { details.line++; }
            details.column = 1;
            details.seenCR = false;
          } else if (ch === "\r" || ch === "\u2028" || ch === "\u2029") {
            details.line++;
            details.column = 1;
            details.seenCR = true;
          } else {
            details.column++;
            details.seenCR = false;
          }
        }
      }

      if (peg$cachedPos !== pos) {
        if (peg$cachedPos > pos) {
          peg$cachedPos = 0;
          peg$cachedPosDetails = { line: 1, column: 1, seenCR: false };
        }
        peg$cachedPos = pos;
        advance(peg$cachedPosDetails, peg$cachedPos);
      }

      return peg$cachedPosDetails;
    }

    function peg$fail(expected) {
      if (peg$currPos < peg$maxFailPos) { return; }

      if (peg$currPos > peg$maxFailPos) {
        peg$maxFailPos = peg$currPos;
        peg$maxFailExpected = [];
      }

      peg$maxFailExpected.push(expected);
    }

    function peg$cleanupExpected(expected) {
      var i = 0;

      expected.sort();

      while (i < expected.length) {
        if (expected[i - 1] === expected[i]) {
          expected.splice(i, 1);
        } else {
          i++;
        }
      }
    }

    function peg$parsestart() {
      var s0;

      s0 = peg$parsecontent();

      return s0;
    }

    function peg$parsecontent() {
      var s0, s1, s2;

      s0 = peg$currPos;
      s1 = [];
      s2 = peg$parsestatement();
      while (s2 !== null) {
        s1.push(s2);
        s2 = peg$parsestatement();
      }
      if (s1 !== null) {
        peg$reportedPos = s0;
        s1 = peg$c1(s1);
      }
      if (s1 === null) {
        peg$currPos = s0;
        s0 = s1;
      } else {
        s0 = s1;
      }

      return s0;
    }

    function peg$parseinvertibleContent() {
      var s0, s1, s2, s3, s4, s5, s6, s7, s8;

      s0 = peg$currPos;
      s1 = peg$parsecontent();
      if (s1 !== null) {
        s2 = peg$currPos;
        s3 = peg$parseDEDENT();
        if (s3 !== null) {
          if (input.substr(peg$currPos, 4) === peg$c4) {
            s4 = peg$c4;
            peg$currPos += 4;
          } else {
            s4 = null;
            if (peg$silentFails === 0) { peg$fail(peg$c5); }
          }
          if (s4 !== null) {
            s5 = peg$parse_();
            if (s5 !== null) {
              s6 = peg$parseTERM();
              if (s6 !== null) {
                s7 = peg$parseINDENT();
                if (s7 !== null) {
                  s8 = peg$parsecontent();
                  if (s8 !== null) {
                    peg$reportedPos = s2;
                    s3 = peg$c6(s8);
                    if (s3 === null) {
                      peg$currPos = s2;
                      s2 = s3;
                    } else {
                      s2 = s3;
                    }
                  } else {
                    peg$currPos = s2;
                    s2 = peg$c2;
                  }
                } else {
                  peg$currPos = s2;
                  s2 = peg$c2;
                }
              } else {
                peg$currPos = s2;
                s2 = peg$c2;
              }
            } else {
              peg$currPos = s2;
              s2 = peg$c2;
            }
          } else {
            peg$currPos = s2;
            s2 = peg$c2;
          }
        } else {
          peg$currPos = s2;
          s2 = peg$c2;
        }
        if (s2 === null) {
          s2 = peg$c3;
        }
        if (s2 !== null) {
          peg$reportedPos = s0;
          s1 = peg$c7(s1,s2);
          if (s1 === null) {
            peg$currPos = s0;
            s0 = s1;
          } else {
            s0 = s1;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c2;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c2;
      }

      return s0;
    }

    function peg$parsestatement() {
      var s0;

      s0 = peg$parsecomment();
      if (s0 === null) {
        s0 = peg$parsehtmlElement();
        if (s0 === null) {
          s0 = peg$parsetextLine();
          if (s0 === null) {
            s0 = peg$parsemustache();
          }
        }
      }

      return s0;
    }

    function peg$parsehtmlElement() {
      var s0;

      s0 = peg$parsehtmlElementMaybeBlock();
      if (s0 === null) {
        s0 = peg$parsehtmlElementWithInlineContent();
      }

      return s0;
    }

    function peg$parsemustache() {
      var s0, s1;

      s0 = peg$currPos;
      s1 = peg$parseexplicitMustache();
      if (s1 === null) {
        s1 = peg$parselineStartingMustache();
      }
      if (s1 !== null) {
        peg$reportedPos = s0;
        s1 = peg$c8(s1);
      }
      if (s1 === null) {
        peg$currPos = s0;
        s0 = s1;
      } else {
        s0 = s1;
      }

      return s0;
    }

    function peg$parsecomment() {
      var s0, s1, s2, s3, s4, s5, s6, s7, s8, s9;

      s0 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 47) {
        s1 = peg$c9;
        peg$currPos++;
      } else {
        s1 = null;
        if (peg$silentFails === 0) { peg$fail(peg$c10); }
      }
      if (s1 !== null) {
        s2 = peg$parselineContent();
        if (s2 !== null) {
          s3 = peg$parseTERM();
          if (s3 !== null) {
            s4 = peg$currPos;
            s5 = peg$parseINDENT();
            if (s5 !== null) {
              s6 = [];
              s7 = peg$currPos;
              s8 = peg$parselineContent();
              if (s8 !== null) {
                s9 = peg$parseTERM();
                if (s9 !== null) {
                  s8 = [s8, s9];
                  s7 = s8;
                } else {
                  peg$currPos = s7;
                  s7 = peg$c2;
                }
              } else {
                peg$currPos = s7;
                s7 = peg$c2;
              }
              if (s7 !== null) {
                while (s7 !== null) {
                  s6.push(s7);
                  s7 = peg$currPos;
                  s8 = peg$parselineContent();
                  if (s8 !== null) {
                    s9 = peg$parseTERM();
                    if (s9 !== null) {
                      s8 = [s8, s9];
                      s7 = s8;
                    } else {
                      peg$currPos = s7;
                      s7 = peg$c2;
                    }
                  } else {
                    peg$currPos = s7;
                    s7 = peg$c2;
                  }
                }
              } else {
                s6 = peg$c2;
              }
              if (s6 !== null) {
                s7 = peg$parseDEDENT();
                if (s7 !== null) {
                  s5 = [s5, s6, s7];
                  s4 = s5;
                } else {
                  peg$currPos = s4;
                  s4 = peg$c2;
                }
              } else {
                peg$currPos = s4;
                s4 = peg$c2;
              }
            } else {
              peg$currPos = s4;
              s4 = peg$c2;
            }
            if (s4 === null) {
              s4 = peg$c3;
            }
            if (s4 !== null) {
              peg$reportedPos = s0;
              s1 = peg$c11();
              if (s1 === null) {
                peg$currPos = s0;
                s0 = s1;
              } else {
                s0 = s1;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c2;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c2;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c2;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c2;
      }

      return s0;
    }

    function peg$parselineStartingMustache() {
      var s0;

      s0 = peg$parsecapitalizedLineStarterMustache();
      if (s0 === null) {
        s0 = peg$parsemustacheMaybeBlock();
      }

      return s0;
    }

    function peg$parsecapitalizedLineStarterMustache() {
      var s0, s1, s2;

      s0 = peg$currPos;
      s1 = peg$currPos;
      peg$silentFails++;
      if (peg$c12.test(input.charAt(peg$currPos))) {
        s2 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s2 = null;
        if (peg$silentFails === 0) { peg$fail(peg$c13); }
      }
      peg$silentFails--;
      if (s2 !== null) {
        peg$currPos = s1;
        s1 = peg$c3;
      } else {
        s1 = peg$c2;
      }
      if (s1 !== null) {
        s2 = peg$parsemustacheMaybeBlock();
        if (s2 !== null) {
          peg$reportedPos = s0;
          s1 = peg$c14(s2);
          if (s1 === null) {
            peg$currPos = s0;
            s0 = s1;
          } else {
            s0 = s1;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c2;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c2;
      }

      return s0;
    }

    function peg$parsehtmlElementMaybeBlock() {
      var s0, s1, s2, s3, s4, s5, s6, s7;

      s0 = peg$currPos;
      s1 = peg$parsehtmlTagAndOptionalAttributes();
      if (s1 !== null) {
        s2 = peg$parse_();
        if (s2 !== null) {
          s3 = peg$parseTERM();
          if (s3 !== null) {
            s4 = peg$currPos;
            s5 = peg$parseINDENT();
            if (s5 !== null) {
              s6 = peg$parsecontent();
              if (s6 !== null) {
                s7 = peg$parseDEDENT();
                if (s7 !== null) {
                  s5 = [s5, s6, s7];
                  s4 = s5;
                } else {
                  peg$currPos = s4;
                  s4 = peg$c2;
                }
              } else {
                peg$currPos = s4;
                s4 = peg$c2;
              }
            } else {
              peg$currPos = s4;
              s4 = peg$c2;
            }
            if (s4 === null) {
              s4 = peg$c3;
            }
            if (s4 !== null) {
              peg$reportedPos = s0;
              s1 = peg$c15(s1,s4);
              if (s1 === null) {
                peg$currPos = s0;
                s0 = s1;
              } else {
                s0 = s1;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c2;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c2;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c2;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c2;
      }

      return s0;
    }

    function peg$parsehtmlElementWithInlineContent() {
      var s0, s1, s2, s3, s4, s5, s6, s7;

      s0 = peg$currPos;
      s1 = peg$parsehtmlTagAndOptionalAttributes();
      if (s1 !== null) {
        if (input.charCodeAt(peg$currPos) === 32) {
          s2 = peg$c16;
          peg$currPos++;
        } else {
          s2 = null;
          if (peg$silentFails === 0) { peg$fail(peg$c17); }
        }
        if (s2 !== null) {
          s3 = peg$parsehtmlInlineContent();
          if (s3 !== null) {
            s4 = peg$currPos;
            s5 = peg$parseINDENT();
            if (s5 !== null) {
              s6 = [];
              s7 = peg$parsetextNodes();
              if (s7 !== null) {
                while (s7 !== null) {
                  s6.push(s7);
                  s7 = peg$parsetextNodes();
                }
              } else {
                s6 = peg$c2;
              }
              if (s6 !== null) {
                s7 = peg$parseDEDENT();
                if (s7 !== null) {
                  s5 = [s5, s6, s7];
                  s4 = s5;
                } else {
                  peg$currPos = s4;
                  s4 = peg$c2;
                }
              } else {
                peg$currPos = s4;
                s4 = peg$c2;
              }
            } else {
              peg$currPos = s4;
              s4 = peg$c2;
            }
            if (s4 === null) {
              s4 = peg$c3;
            }
            if (s4 !== null) {
              peg$reportedPos = s0;
              s1 = peg$c18(s1,s3,s4);
              if (s1 === null) {
                peg$currPos = s0;
                s0 = s1;
              } else {
                s0 = s1;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c2;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c2;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c2;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c2;
      }

      return s0;
    }

    function peg$parsemustacheMaybeBlock() {
      var s0, s1, s2, s3, s4, s5, s6, s7;

      s0 = peg$currPos;
      s1 = peg$parseinMustache();
      if (s1 !== null) {
        s2 = peg$parse_();
        if (s2 !== null) {
          s3 = peg$parseTERM();
          if (s3 !== null) {
            s4 = peg$currPos;
            s5 = peg$parseINDENT();
            if (s5 !== null) {
              s6 = peg$parseinvertibleContent();
              if (s6 !== null) {
                s7 = peg$parseDEDENT();
                if (s7 !== null) {
                  s5 = [s5, s6, s7];
                  s4 = s5;
                } else {
                  peg$currPos = s4;
                  s4 = peg$c2;
                }
              } else {
                peg$currPos = s4;
                s4 = peg$c2;
              }
            } else {
              peg$currPos = s4;
              s4 = peg$c2;
            }
            if (s4 === null) {
              s4 = peg$c3;
            }
            if (s4 !== null) {
              peg$reportedPos = s0;
              s1 = peg$c19(s1,s4);
              if (s1 === null) {
                peg$currPos = s0;
                s0 = s1;
              } else {
                s0 = s1;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c2;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c2;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c2;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c2;
      }

      return s0;
    }

    function peg$parseexplicitMustache() {
      var s0, s1, s2;

      s0 = peg$currPos;
      s1 = peg$parseequalSign();
      if (s1 !== null) {
        s2 = peg$parsemustacheMaybeBlock();
        if (s2 !== null) {
          peg$reportedPos = s0;
          s1 = peg$c20(s1,s2);
          if (s1 === null) {
            peg$currPos = s0;
            s0 = s1;
          } else {
            s0 = s1;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c2;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c2;
      }

      return s0;
    }

    function peg$parseinMustache() {
      var s0, s1, s2, s3, s4;

      s0 = peg$currPos;
      s1 = peg$parsepathIdNode();
      if (s1 !== null) {
        s2 = peg$parsetrailingModifier();
        if (s2 === null) {
          s2 = peg$c3;
        }
        if (s2 !== null) {
          s3 = [];
          s4 = peg$parseinMustacheParam();
          while (s4 !== null) {
            s3.push(s4);
            s4 = peg$parseinMustacheParam();
          }
          if (s3 !== null) {
            s4 = peg$parsehash();
            if (s4 === null) {
              s4 = peg$c3;
            }
            if (s4 !== null) {
              peg$reportedPos = s0;
              s1 = peg$c21(s1,s2,s3,s4);
              if (s1 === null) {
                peg$currPos = s0;
                s0 = s1;
              } else {
                s0 = s1;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c2;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c2;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c2;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c2;
      }

      return s0;
    }

    function peg$parsemodifiedParam() {
      var s0, s1, s2;

      s0 = peg$currPos;
      s1 = peg$parseparam();
      if (s1 !== null) {
        s2 = peg$parsetrailingModifier();
        if (s2 !== null) {
          peg$reportedPos = s0;
          s1 = peg$c22(s1,s2);
          if (s1 === null) {
            peg$currPos = s0;
            s0 = s1;
          } else {
            s0 = s1;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c2;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c2;
      }

      return s0;
    }

    function peg$parsehtmlMustacheAttribute() {
      var s0, s1;

      s0 = peg$currPos;
      s1 = peg$parsetagNameShorthand();
      if (s1 !== null) {
        peg$reportedPos = s0;
        s1 = peg$c23(s1);
      }
      if (s1 === null) {
        peg$currPos = s0;
        s0 = s1;
      } else {
        s0 = s1;
      }
      if (s0 === null) {
        s0 = peg$currPos;
        s1 = peg$parseidShorthand();
        if (s1 !== null) {
          peg$reportedPos = s0;
          s1 = peg$c24(s1);
        }
        if (s1 === null) {
          peg$currPos = s0;
          s0 = s1;
        } else {
          s0 = s1;
        }
        if (s0 === null) {
          s0 = peg$currPos;
          s1 = peg$parseclassShorthand();
          if (s1 !== null) {
            peg$reportedPos = s0;
            s1 = peg$c25(s1);
          }
          if (s1 === null) {
            peg$currPos = s0;
            s0 = s1;
          } else {
            s0 = s1;
          }
        }
      }

      return s0;
    }

    function peg$parseshorthandAttributes() {
      var s0;

      s0 = peg$parseattributesAtLeastID();
      if (s0 === null) {
        s0 = peg$parseattributesAtLeastClass();
      }

      return s0;
    }

    function peg$parseattributesAtLeastID() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      s1 = peg$parseidShorthand();
      if (s1 !== null) {
        s2 = [];
        s3 = peg$parseclassShorthand();
        while (s3 !== null) {
          s2.push(s3);
          s3 = peg$parseclassShorthand();
        }
        if (s2 !== null) {
          peg$reportedPos = s0;
          s1 = peg$c26(s1,s2);
          if (s1 === null) {
            peg$currPos = s0;
            s0 = s1;
          } else {
            s0 = s1;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c2;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c2;
      }

      return s0;
    }

    function peg$parseattributesAtLeastClass() {
      var s0, s1, s2;

      s0 = peg$currPos;
      s1 = [];
      s2 = peg$parseclassShorthand();
      if (s2 !== null) {
        while (s2 !== null) {
          s1.push(s2);
          s2 = peg$parseclassShorthand();
        }
      } else {
        s1 = peg$c2;
      }
      if (s1 !== null) {
        peg$reportedPos = s0;
        s1 = peg$c27(s1);
      }
      if (s1 === null) {
        peg$currPos = s0;
        s0 = s1;
      } else {
        s0 = s1;
      }

      return s0;
    }

    function peg$parseinMustacheParam() {
      var s0, s1, s2;

      s0 = peg$currPos;
      s1 = peg$parse_();
      if (s1 !== null) {
        s2 = peg$parsehtmlMustacheAttribute();
        if (s2 === null) {
          s2 = peg$parseparam();
        }
        if (s2 !== null) {
          peg$reportedPos = s0;
          s1 = peg$c28(s2);
          if (s1 === null) {
            peg$currPos = s0;
            s0 = s1;
          } else {
            s0 = s1;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c2;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c2;
      }

      return s0;
    }

    function peg$parsetrailingModifier() {
      var s0, s1;

      peg$silentFails++;
      if (peg$c30.test(input.charAt(peg$currPos))) {
        s0 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s0 = null;
        if (peg$silentFails === 0) { peg$fail(peg$c31); }
      }
      peg$silentFails--;
      if (s0 === null) {
        s1 = null;
        if (peg$silentFails === 0) { peg$fail(peg$c29); }
      }

      return s0;
    }

    function peg$parsehash() {
      var s0, s1, s2;

      s0 = peg$currPos;
      s1 = [];
      s2 = peg$parsehashSegment();
      if (s2 !== null) {
        while (s2 !== null) {
          s1.push(s2);
          s2 = peg$parsehashSegment();
        }
      } else {
        s1 = peg$c2;
      }
      if (s1 !== null) {
        peg$reportedPos = s0;
        s1 = peg$c32(s1);
      }
      if (s1 === null) {
        peg$currPos = s0;
        s0 = s1;
      } else {
        s0 = s1;
      }

      return s0;
    }

    function peg$parsepathIdent() {
      var s0, s1, s2, s3;

      peg$silentFails++;
      if (input.substr(peg$currPos, 2) === peg$c34) {
        s0 = peg$c34;
        peg$currPos += 2;
      } else {
        s0 = null;
        if (peg$silentFails === 0) { peg$fail(peg$c35); }
      }
      if (s0 === null) {
        if (input.charCodeAt(peg$currPos) === 46) {
          s0 = peg$c36;
          peg$currPos++;
        } else {
          s0 = null;
          if (peg$silentFails === 0) { peg$fail(peg$c37); }
        }
        if (s0 === null) {
          s0 = peg$currPos;
          s1 = peg$currPos;
          s2 = [];
          if (peg$c38.test(input.charAt(peg$currPos))) {
            s3 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s3 = null;
            if (peg$silentFails === 0) { peg$fail(peg$c39); }
          }
          if (s3 !== null) {
            while (s3 !== null) {
              s2.push(s3);
              if (peg$c38.test(input.charAt(peg$currPos))) {
                s3 = input.charAt(peg$currPos);
                peg$currPos++;
              } else {
                s3 = null;
                if (peg$silentFails === 0) { peg$fail(peg$c39); }
              }
            }
          } else {
            s2 = peg$c2;
          }
          if (s2 !== null) {
            s2 = input.substring(s1, peg$currPos);
          }
          s1 = s2;
          if (s1 !== null) {
            s2 = peg$currPos;
            peg$silentFails++;
            if (input.charCodeAt(peg$currPos) === 61) {
              s3 = peg$c40;
              peg$currPos++;
            } else {
              s3 = null;
              if (peg$silentFails === 0) { peg$fail(peg$c41); }
            }
            peg$silentFails--;
            if (s3 === null) {
              s2 = peg$c3;
            } else {
              peg$currPos = s2;
              s2 = peg$c2;
            }
            if (s2 !== null) {
              peg$reportedPos = s0;
              s1 = peg$c42(s1);
              if (s1 === null) {
                peg$currPos = s0;
                s0 = s1;
              } else {
                s0 = s1;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c2;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c2;
          }
        }
      }
      peg$silentFails--;
      if (s0 === null) {
        s1 = null;
        if (peg$silentFails === 0) { peg$fail(peg$c33); }
      }

      return s0;
    }

    function peg$parsekey() {
      var s0, s1;

      peg$silentFails++;
      s0 = peg$parseident();
      peg$silentFails--;
      if (s0 === null) {
        s1 = null;
        if (peg$silentFails === 0) { peg$fail(peg$c43); }
      }

      return s0;
    }

    function peg$parsehashSegment() {
      var s0, s1, s2, s3, s4, s5;

      s0 = peg$currPos;
      s1 = peg$parse_();
      if (s1 !== null) {
        s2 = peg$currPos;
        s3 = peg$parsekey();
        if (s3 !== null) {
          if (input.charCodeAt(peg$currPos) === 61) {
            s4 = peg$c40;
            peg$currPos++;
          } else {
            s4 = null;
            if (peg$silentFails === 0) { peg$fail(peg$c41); }
          }
          if (s4 !== null) {
            s5 = peg$parsepathIdNode();
            if (s5 !== null) {
              s3 = [s3, s4, s5];
              s2 = s3;
            } else {
              peg$currPos = s2;
              s2 = peg$c2;
            }
          } else {
            peg$currPos = s2;
            s2 = peg$c2;
          }
        } else {
          peg$currPos = s2;
          s2 = peg$c2;
        }
        if (s2 === null) {
          s2 = peg$currPos;
          s3 = peg$parsekey();
          if (s3 !== null) {
            if (input.charCodeAt(peg$currPos) === 61) {
              s4 = peg$c40;
              peg$currPos++;
            } else {
              s4 = null;
              if (peg$silentFails === 0) { peg$fail(peg$c41); }
            }
            if (s4 !== null) {
              s5 = peg$parsestringNode();
              if (s5 !== null) {
                s3 = [s3, s4, s5];
                s2 = s3;
              } else {
                peg$currPos = s2;
                s2 = peg$c2;
              }
            } else {
              peg$currPos = s2;
              s2 = peg$c2;
            }
          } else {
            peg$currPos = s2;
            s2 = peg$c2;
          }
          if (s2 === null) {
            s2 = peg$currPos;
            s3 = peg$parsekey();
            if (s3 !== null) {
              if (input.charCodeAt(peg$currPos) === 61) {
                s4 = peg$c40;
                peg$currPos++;
              } else {
                s4 = null;
                if (peg$silentFails === 0) { peg$fail(peg$c41); }
              }
              if (s4 !== null) {
                s5 = peg$parseintegerNode();
                if (s5 !== null) {
                  s3 = [s3, s4, s5];
                  s2 = s3;
                } else {
                  peg$currPos = s2;
                  s2 = peg$c2;
                }
              } else {
                peg$currPos = s2;
                s2 = peg$c2;
              }
            } else {
              peg$currPos = s2;
              s2 = peg$c2;
            }
            if (s2 === null) {
              s2 = peg$currPos;
              s3 = peg$parsekey();
              if (s3 !== null) {
                if (input.charCodeAt(peg$currPos) === 61) {
                  s4 = peg$c40;
                  peg$currPos++;
                } else {
                  s4 = null;
                  if (peg$silentFails === 0) { peg$fail(peg$c41); }
                }
                if (s4 !== null) {
                  s5 = peg$parsebooleanNode();
                  if (s5 !== null) {
                    s3 = [s3, s4, s5];
                    s2 = s3;
                  } else {
                    peg$currPos = s2;
                    s2 = peg$c2;
                  }
                } else {
                  peg$currPos = s2;
                  s2 = peg$c2;
                }
              } else {
                peg$currPos = s2;
                s2 = peg$c2;
              }
            }
          }
        }
        if (s2 !== null) {
          peg$reportedPos = s0;
          s1 = peg$c44(s2);
          if (s1 === null) {
            peg$currPos = s0;
            s0 = s1;
          } else {
            s0 = s1;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c2;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c2;
      }

      return s0;
    }

    function peg$parseparam() {
      var s0;

      s0 = peg$parsepathIdNode();
      if (s0 === null) {
        s0 = peg$parsestringNode();
        if (s0 === null) {
          s0 = peg$parseintegerNode();
          if (s0 === null) {
            s0 = peg$parsebooleanNode();
          }
        }
      }

      return s0;
    }

    function peg$parsepath() {
      var s0, s1, s2, s3, s4, s5;

      s0 = peg$currPos;
      s1 = peg$parsepathIdent();
      if (s1 !== null) {
        s2 = [];
        s3 = peg$currPos;
        s4 = peg$parseseperator();
        if (s4 !== null) {
          s5 = peg$parsepathIdent();
          if (s5 !== null) {
            peg$reportedPos = s3;
            s4 = peg$c45(s5);
            if (s4 === null) {
              peg$currPos = s3;
              s3 = s4;
            } else {
              s3 = s4;
            }
          } else {
            peg$currPos = s3;
            s3 = peg$c2;
          }
        } else {
          peg$currPos = s3;
          s3 = peg$c2;
        }
        while (s3 !== null) {
          s2.push(s3);
          s3 = peg$currPos;
          s4 = peg$parseseperator();
          if (s4 !== null) {
            s5 = peg$parsepathIdent();
            if (s5 !== null) {
              peg$reportedPos = s3;
              s4 = peg$c45(s5);
              if (s4 === null) {
                peg$currPos = s3;
                s3 = s4;
              } else {
                s3 = s4;
              }
            } else {
              peg$currPos = s3;
              s3 = peg$c2;
            }
          } else {
            peg$currPos = s3;
            s3 = peg$c2;
          }
        }
        if (s2 !== null) {
          peg$reportedPos = s0;
          s1 = peg$c46(s1,s2);
          if (s1 === null) {
            peg$currPos = s0;
            s0 = s1;
          } else {
            s0 = s1;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c2;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c2;
      }

      return s0;
    }

    function peg$parseseperator() {
      var s0, s1;

      peg$silentFails++;
      if (peg$c48.test(input.charAt(peg$currPos))) {
        s0 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s0 = null;
        if (peg$silentFails === 0) { peg$fail(peg$c49); }
      }
      peg$silentFails--;
      if (s0 === null) {
        s1 = null;
        if (peg$silentFails === 0) { peg$fail(peg$c47); }
      }

      return s0;
    }

    function peg$parsepathIdNode() {
      var s0, s1;

      s0 = peg$currPos;
      s1 = peg$parsepath();
      if (s1 !== null) {
        peg$reportedPos = s0;
        s1 = peg$c50(s1);
      }
      if (s1 === null) {
        peg$currPos = s0;
        s0 = s1;
      } else {
        s0 = s1;
      }

      return s0;
    }

    function peg$parsestringNode() {
      var s0, s1;

      s0 = peg$currPos;
      s1 = peg$parsestring();
      if (s1 !== null) {
        peg$reportedPos = s0;
        s1 = peg$c51(s1);
      }
      if (s1 === null) {
        peg$currPos = s0;
        s0 = s1;
      } else {
        s0 = s1;
      }

      return s0;
    }

    function peg$parseintegerNode() {
      var s0, s1;

      s0 = peg$currPos;
      s1 = peg$parseinteger();
      if (s1 !== null) {
        peg$reportedPos = s0;
        s1 = peg$c52(s1);
      }
      if (s1 === null) {
        peg$currPos = s0;
        s0 = s1;
      } else {
        s0 = s1;
      }

      return s0;
    }

    function peg$parsebooleanNode() {
      var s0, s1;

      s0 = peg$currPos;
      s1 = peg$parseboolean();
      if (s1 !== null) {
        peg$reportedPos = s0;
        s1 = peg$c53(s1);
      }
      if (s1 === null) {
        peg$currPos = s0;
        s0 = s1;
      } else {
        s0 = s1;
      }

      return s0;
    }

    function peg$parseboolean() {
      var s0, s1;

      peg$silentFails++;
      if (input.substr(peg$currPos, 4) === peg$c55) {
        s0 = peg$c55;
        peg$currPos += 4;
      } else {
        s0 = null;
        if (peg$silentFails === 0) { peg$fail(peg$c56); }
      }
      if (s0 === null) {
        if (input.substr(peg$currPos, 5) === peg$c57) {
          s0 = peg$c57;
          peg$currPos += 5;
        } else {
          s0 = null;
          if (peg$silentFails === 0) { peg$fail(peg$c58); }
        }
      }
      peg$silentFails--;
      if (s0 === null) {
        s1 = null;
        if (peg$silentFails === 0) { peg$fail(peg$c54); }
      }

      return s0;
    }

    function peg$parseinteger() {
      var s0, s1, s2, s3;

      peg$silentFails++;
      s0 = peg$currPos;
      s1 = peg$currPos;
      s2 = [];
      if (peg$c60.test(input.charAt(peg$currPos))) {
        s3 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s3 = null;
        if (peg$silentFails === 0) { peg$fail(peg$c61); }
      }
      if (s3 !== null) {
        while (s3 !== null) {
          s2.push(s3);
          if (peg$c60.test(input.charAt(peg$currPos))) {
            s3 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s3 = null;
            if (peg$silentFails === 0) { peg$fail(peg$c61); }
          }
        }
      } else {
        s2 = peg$c2;
      }
      if (s2 !== null) {
        s2 = input.substring(s1, peg$currPos);
      }
      s1 = s2;
      if (s1 !== null) {
        peg$reportedPos = s0;
        s1 = peg$c62(s1);
      }
      if (s1 === null) {
        peg$currPos = s0;
        s0 = s1;
      } else {
        s0 = s1;
      }
      peg$silentFails--;
      if (s0 === null) {
        s1 = null;
        if (peg$silentFails === 0) { peg$fail(peg$c59); }
      }

      return s0;
    }

    function peg$parsestring() {
      var s0, s1, s2, s3, s4;

      s0 = peg$currPos;
      s1 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 34) {
        s2 = peg$c63;
        peg$currPos++;
      } else {
        s2 = null;
        if (peg$silentFails === 0) { peg$fail(peg$c64); }
      }
      if (s2 !== null) {
        s3 = peg$parsehashDoubleQuoteStringValue();
        if (s3 !== null) {
          if (input.charCodeAt(peg$currPos) === 34) {
            s4 = peg$c63;
            peg$currPos++;
          } else {
            s4 = null;
            if (peg$silentFails === 0) { peg$fail(peg$c64); }
          }
          if (s4 !== null) {
            s2 = [s2, s3, s4];
            s1 = s2;
          } else {
            peg$currPos = s1;
            s1 = peg$c2;
          }
        } else {
          peg$currPos = s1;
          s1 = peg$c2;
        }
      } else {
        peg$currPos = s1;
        s1 = peg$c2;
      }
      if (s1 === null) {
        s1 = peg$currPos;
        if (input.charCodeAt(peg$currPos) === 39) {
          s2 = peg$c65;
          peg$currPos++;
        } else {
          s2 = null;
          if (peg$silentFails === 0) { peg$fail(peg$c66); }
        }
        if (s2 !== null) {
          s3 = peg$parsehashSingleQuoteStringValue();
          if (s3 !== null) {
            if (input.charCodeAt(peg$currPos) === 39) {
              s4 = peg$c65;
              peg$currPos++;
            } else {
              s4 = null;
              if (peg$silentFails === 0) { peg$fail(peg$c66); }
            }
            if (s4 !== null) {
              s2 = [s2, s3, s4];
              s1 = s2;
            } else {
              peg$currPos = s1;
              s1 = peg$c2;
            }
          } else {
            peg$currPos = s1;
            s1 = peg$c2;
          }
        } else {
          peg$currPos = s1;
          s1 = peg$c2;
        }
      }
      if (s1 !== null) {
        peg$reportedPos = s0;
        s1 = peg$c67(s1);
      }
      if (s1 === null) {
        peg$currPos = s0;
        s0 = s1;
      } else {
        s0 = s1;
      }

      return s0;
    }

    function peg$parsehashDoubleQuoteStringValue() {
      var s0, s1, s2, s3, s4;

      s0 = peg$currPos;
      s1 = [];
      s2 = peg$currPos;
      s3 = peg$currPos;
      peg$silentFails++;
      s4 = peg$parseTERM();
      peg$silentFails--;
      if (s4 === null) {
        s3 = peg$c3;
      } else {
        peg$currPos = s3;
        s3 = peg$c2;
      }
      if (s3 !== null) {
        if (peg$c68.test(input.charAt(peg$currPos))) {
          s4 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s4 = null;
          if (peg$silentFails === 0) { peg$fail(peg$c69); }
        }
        if (s4 !== null) {
          s3 = [s3, s4];
          s2 = s3;
        } else {
          peg$currPos = s2;
          s2 = peg$c2;
        }
      } else {
        peg$currPos = s2;
        s2 = peg$c2;
      }
      while (s2 !== null) {
        s1.push(s2);
        s2 = peg$currPos;
        s3 = peg$currPos;
        peg$silentFails++;
        s4 = peg$parseTERM();
        peg$silentFails--;
        if (s4 === null) {
          s3 = peg$c3;
        } else {
          peg$currPos = s3;
          s3 = peg$c2;
        }
        if (s3 !== null) {
          if (peg$c68.test(input.charAt(peg$currPos))) {
            s4 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s4 = null;
            if (peg$silentFails === 0) { peg$fail(peg$c69); }
          }
          if (s4 !== null) {
            s3 = [s3, s4];
            s2 = s3;
          } else {
            peg$currPos = s2;
            s2 = peg$c2;
          }
        } else {
          peg$currPos = s2;
          s2 = peg$c2;
        }
      }
      if (s1 !== null) {
        s1 = input.substring(s0, peg$currPos);
      }
      s0 = s1;

      return s0;
    }

    function peg$parsehashSingleQuoteStringValue() {
      var s0, s1, s2, s3, s4;

      s0 = peg$currPos;
      s1 = [];
      s2 = peg$currPos;
      s3 = peg$currPos;
      peg$silentFails++;
      s4 = peg$parseTERM();
      peg$silentFails--;
      if (s4 === null) {
        s3 = peg$c3;
      } else {
        peg$currPos = s3;
        s3 = peg$c2;
      }
      if (s3 !== null) {
        if (peg$c70.test(input.charAt(peg$currPos))) {
          s4 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s4 = null;
          if (peg$silentFails === 0) { peg$fail(peg$c71); }
        }
        if (s4 !== null) {
          s3 = [s3, s4];
          s2 = s3;
        } else {
          peg$currPos = s2;
          s2 = peg$c2;
        }
      } else {
        peg$currPos = s2;
        s2 = peg$c2;
      }
      while (s2 !== null) {
        s1.push(s2);
        s2 = peg$currPos;
        s3 = peg$currPos;
        peg$silentFails++;
        s4 = peg$parseTERM();
        peg$silentFails--;
        if (s4 === null) {
          s3 = peg$c3;
        } else {
          peg$currPos = s3;
          s3 = peg$c2;
        }
        if (s3 !== null) {
          if (peg$c70.test(input.charAt(peg$currPos))) {
            s4 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s4 = null;
            if (peg$silentFails === 0) { peg$fail(peg$c71); }
          }
          if (s4 !== null) {
            s3 = [s3, s4];
            s2 = s3;
          } else {
            peg$currPos = s2;
            s2 = peg$c2;
          }
        } else {
          peg$currPos = s2;
          s2 = peg$c2;
        }
      }
      if (s1 !== null) {
        s1 = input.substring(s0, peg$currPos);
      }
      s0 = s1;

      return s0;
    }

    function peg$parsealpha() {
      var s0;

      if (peg$c72.test(input.charAt(peg$currPos))) {
        s0 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s0 = null;
        if (peg$silentFails === 0) { peg$fail(peg$c73); }
      }

      return s0;
    }

    function peg$parsehtmlInlineContent() {
      var s0, s1;

      s0 = peg$currPos;
      s1 = peg$parseexplicitMustache();
      if (s1 !== null) {
        peg$reportedPos = s0;
        s1 = peg$c74(s1);
      }
      if (s1 === null) {
        peg$currPos = s0;
        s0 = s1;
      } else {
        s0 = s1;
      }
      if (s0 === null) {
        s0 = peg$parsetextNodes();
      }

      return s0;
    }

    function peg$parsetextLine() {
      var s0, s1, s2, s3, s4, s5, s6;

      s0 = peg$currPos;
      s1 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 124) {
        s2 = peg$c75;
        peg$currPos++;
      } else {
        s2 = null;
        if (peg$silentFails === 0) { peg$fail(peg$c76); }
      }
      if (s2 !== null) {
        if (input.charCodeAt(peg$currPos) === 32) {
          s3 = peg$c16;
          peg$currPos++;
        } else {
          s3 = null;
          if (peg$silentFails === 0) { peg$fail(peg$c17); }
        }
        if (s3 === null) {
          s3 = peg$c3;
        }
        if (s3 !== null) {
          s2 = [s2, s3];
          s1 = s2;
        } else {
          peg$currPos = s1;
          s1 = peg$c2;
        }
      } else {
        peg$currPos = s1;
        s1 = peg$c2;
      }
      if (s1 === null) {
        s1 = peg$currPos;
        peg$silentFails++;
        if (input.charCodeAt(peg$currPos) === 60) {
          s2 = peg$c77;
          peg$currPos++;
        } else {
          s2 = null;
          if (peg$silentFails === 0) { peg$fail(peg$c78); }
        }
        peg$silentFails--;
        if (s2 !== null) {
          peg$currPos = s1;
          s1 = peg$c3;
        } else {
          s1 = peg$c2;
        }
      }
      if (s1 !== null) {
        s2 = peg$parsetextNodes();
        if (s2 !== null) {
          s3 = peg$currPos;
          s4 = peg$parseINDENT();
          if (s4 !== null) {
            s5 = [];
            s6 = peg$parsetextNodes();
            while (s6 !== null) {
              s5.push(s6);
              s6 = peg$parsetextNodes();
            }
            if (s5 !== null) {
              s6 = peg$parseDEDENT();
              if (s6 !== null) {
                s4 = [s4, s5, s6];
                s3 = s4;
              } else {
                peg$currPos = s3;
                s3 = peg$c2;
              }
            } else {
              peg$currPos = s3;
              s3 = peg$c2;
            }
          } else {
            peg$currPos = s3;
            s3 = peg$c2;
          }
          if (s3 === null) {
            s3 = peg$c3;
          }
          if (s3 !== null) {
            peg$reportedPos = s0;
            s1 = peg$c79(s2,s3);
            if (s1 === null) {
              peg$currPos = s0;
              s0 = s1;
            } else {
              s0 = s1;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c2;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c2;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c2;
      }

      return s0;
    }

    function peg$parsetextNodes() {
      var s0, s1, s2, s3, s4, s5;

      s0 = peg$currPos;
      s1 = peg$parsepreMustacheText();
      if (s1 === null) {
        s1 = peg$c3;
      }
      if (s1 !== null) {
        s2 = [];
        s3 = peg$currPos;
        s4 = peg$parserawMustache();
        if (s4 !== null) {
          s5 = peg$parsepreMustacheText();
          if (s5 === null) {
            s5 = peg$c3;
          }
          if (s5 !== null) {
            s4 = [s4, s5];
            s3 = s4;
          } else {
            peg$currPos = s3;
            s3 = peg$c2;
          }
        } else {
          peg$currPos = s3;
          s3 = peg$c2;
        }
        while (s3 !== null) {
          s2.push(s3);
          s3 = peg$currPos;
          s4 = peg$parserawMustache();
          if (s4 !== null) {
            s5 = peg$parsepreMustacheText();
            if (s5 === null) {
              s5 = peg$c3;
            }
            if (s5 !== null) {
              s4 = [s4, s5];
              s3 = s4;
            } else {
              peg$currPos = s3;
              s3 = peg$c2;
            }
          } else {
            peg$currPos = s3;
            s3 = peg$c2;
          }
        }
        if (s2 !== null) {
          s3 = peg$parseTERM();
          if (s3 !== null) {
            peg$reportedPos = s0;
            s1 = peg$c80(s1,s2);
            if (s1 === null) {
              peg$currPos = s0;
              s0 = s1;
            } else {
              s0 = s1;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c2;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c2;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c2;
      }

      return s0;
    }

    function peg$parserawMustache() {
      var s0;

      s0 = peg$parserawMustacheUnescaped();
      if (s0 === null) {
        s0 = peg$parserawMustacheEscaped();
      }

      return s0;
    }

    function peg$parserawMustacheSingle() {
      var s0, s1, s2, s3, s4, s5;

      s0 = peg$currPos;
      s1 = peg$parsesingleOpen();
      if (s1 !== null) {
        s2 = peg$parse_();
        if (s2 !== null) {
          s3 = peg$parseinMustache();
          if (s3 !== null) {
            s4 = peg$parse_();
            if (s4 !== null) {
              s5 = peg$parsesingleClose();
              if (s5 !== null) {
                peg$reportedPos = s0;
                s1 = peg$c81(s3);
                if (s1 === null) {
                  peg$currPos = s0;
                  s0 = s1;
                } else {
                  s0 = s1;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$c2;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c2;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c2;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c2;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c2;
      }

      return s0;
    }

    function peg$parserawMustacheEscaped() {
      var s0, s1, s2, s3, s4, s5;

      s0 = peg$currPos;
      s1 = peg$parsedoubleOpen();
      if (s1 !== null) {
        s2 = peg$parse_();
        if (s2 !== null) {
          s3 = peg$parseinMustache();
          if (s3 !== null) {
            s4 = peg$parse_();
            if (s4 !== null) {
              s5 = peg$parsedoubleClose();
              if (s5 !== null) {
                peg$reportedPos = s0;
                s1 = peg$c81(s3);
                if (s1 === null) {
                  peg$currPos = s0;
                  s0 = s1;
                } else {
                  s0 = s1;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$c2;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c2;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c2;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c2;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c2;
      }
      if (s0 === null) {
        s0 = peg$currPos;
        s1 = peg$parsehashStacheOpen();
        if (s1 !== null) {
          s2 = peg$parse_();
          if (s2 !== null) {
            s3 = peg$parseinMustache();
            if (s3 !== null) {
              s4 = peg$parse_();
              if (s4 !== null) {
                s5 = peg$parsehashStacheClose();
                if (s5 !== null) {
                  peg$reportedPos = s0;
                  s1 = peg$c81(s3);
                  if (s1 === null) {
                    peg$currPos = s0;
                    s0 = s1;
                  } else {
                    s0 = s1;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$c2;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$c2;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c2;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c2;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c2;
        }
      }

      return s0;
    }

    function peg$parserawMustacheUnescaped() {
      var s0, s1, s2, s3, s4, s5;

      s0 = peg$currPos;
      s1 = peg$parsetripleOpen();
      if (s1 !== null) {
        s2 = peg$parse_();
        if (s2 !== null) {
          s3 = peg$parseinMustache();
          if (s3 !== null) {
            s4 = peg$parse_();
            if (s4 !== null) {
              s5 = peg$parsetripleClose();
              if (s5 !== null) {
                peg$reportedPos = s0;
                s1 = peg$c82(s3);
                if (s1 === null) {
                  peg$currPos = s0;
                  s0 = s1;
                } else {
                  s0 = s1;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$c2;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c2;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c2;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c2;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c2;
      }

      return s0;
    }

    function peg$parsepreMustacheText() {
      var s0, s1, s2;

      s0 = peg$currPos;
      s1 = [];
      s2 = peg$parsepreMustacheUnit();
      if (s2 !== null) {
        while (s2 !== null) {
          s1.push(s2);
          s2 = peg$parsepreMustacheUnit();
        }
      } else {
        s1 = peg$c2;
      }
      if (s1 !== null) {
        peg$reportedPos = s0;
        s1 = peg$c83(s1);
      }
      if (s1 === null) {
        peg$currPos = s0;
        s0 = s1;
      } else {
        s0 = s1;
      }

      return s0;
    }

    function peg$parsepreMustacheUnit() {
      var s0, s1, s2;

      s0 = peg$currPos;
      s1 = peg$currPos;
      peg$silentFails++;
      s2 = peg$parsetripleOpen();
      if (s2 === null) {
        s2 = peg$parsedoubleOpen();
        if (s2 === null) {
          s2 = peg$parsehashStacheOpen();
          if (s2 === null) {
            s2 = peg$parseDEDENT();
            if (s2 === null) {
              s2 = peg$parseTERM();
            }
          }
        }
      }
      peg$silentFails--;
      if (s2 === null) {
        s1 = peg$c3;
      } else {
        peg$currPos = s1;
        s1 = peg$c2;
      }
      if (s1 !== null) {
        if (input.length > peg$currPos) {
          s2 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s2 = null;
          if (peg$silentFails === 0) { peg$fail(peg$c84); }
        }
        if (s2 !== null) {
          peg$reportedPos = s0;
          s1 = peg$c85(s2);
          if (s1 === null) {
            peg$currPos = s0;
            s0 = s1;
          } else {
            s0 = s1;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c2;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c2;
      }

      return s0;
    }

    function peg$parseinTagMustache() {
      var s0;

      s0 = peg$parserawMustacheSingle();
      if (s0 === null) {
        s0 = peg$parserawMustacheUnescaped();
        if (s0 === null) {
          s0 = peg$parserawMustacheEscaped();
        }
      }

      return s0;
    }

    function peg$parsesingleOpen() {
      var s0, s1;

      peg$silentFails++;
      if (input.charCodeAt(peg$currPos) === 123) {
        s0 = peg$c87;
        peg$currPos++;
      } else {
        s0 = null;
        if (peg$silentFails === 0) { peg$fail(peg$c88); }
      }
      peg$silentFails--;
      if (s0 === null) {
        s1 = null;
        if (peg$silentFails === 0) { peg$fail(peg$c86); }
      }

      return s0;
    }

    function peg$parsedoubleOpen() {
      var s0, s1;

      peg$silentFails++;
      if (input.substr(peg$currPos, 2) === peg$c90) {
        s0 = peg$c90;
        peg$currPos += 2;
      } else {
        s0 = null;
        if (peg$silentFails === 0) { peg$fail(peg$c91); }
      }
      peg$silentFails--;
      if (s0 === null) {
        s1 = null;
        if (peg$silentFails === 0) { peg$fail(peg$c89); }
      }

      return s0;
    }

    function peg$parsetripleOpen() {
      var s0, s1;

      peg$silentFails++;
      if (input.substr(peg$currPos, 3) === peg$c93) {
        s0 = peg$c93;
        peg$currPos += 3;
      } else {
        s0 = null;
        if (peg$silentFails === 0) { peg$fail(peg$c94); }
      }
      peg$silentFails--;
      if (s0 === null) {
        s1 = null;
        if (peg$silentFails === 0) { peg$fail(peg$c92); }
      }

      return s0;
    }

    function peg$parsesingleClose() {
      var s0, s1;

      peg$silentFails++;
      if (input.charCodeAt(peg$currPos) === 125) {
        s0 = peg$c96;
        peg$currPos++;
      } else {
        s0 = null;
        if (peg$silentFails === 0) { peg$fail(peg$c97); }
      }
      peg$silentFails--;
      if (s0 === null) {
        s1 = null;
        if (peg$silentFails === 0) { peg$fail(peg$c95); }
      }

      return s0;
    }

    function peg$parsedoubleClose() {
      var s0, s1;

      peg$silentFails++;
      if (input.substr(peg$currPos, 2) === peg$c99) {
        s0 = peg$c99;
        peg$currPos += 2;
      } else {
        s0 = null;
        if (peg$silentFails === 0) { peg$fail(peg$c100); }
      }
      peg$silentFails--;
      if (s0 === null) {
        s1 = null;
        if (peg$silentFails === 0) { peg$fail(peg$c98); }
      }

      return s0;
    }

    function peg$parsetripleClose() {
      var s0, s1;

      peg$silentFails++;
      if (input.substr(peg$currPos, 3) === peg$c102) {
        s0 = peg$c102;
        peg$currPos += 3;
      } else {
        s0 = null;
        if (peg$silentFails === 0) { peg$fail(peg$c103); }
      }
      peg$silentFails--;
      if (s0 === null) {
        s1 = null;
        if (peg$silentFails === 0) { peg$fail(peg$c101); }
      }

      return s0;
    }

    function peg$parsehashStacheOpen() {
      var s0, s1;

      peg$silentFails++;
      if (input.substr(peg$currPos, 2) === peg$c105) {
        s0 = peg$c105;
        peg$currPos += 2;
      } else {
        s0 = null;
        if (peg$silentFails === 0) { peg$fail(peg$c106); }
      }
      peg$silentFails--;
      if (s0 === null) {
        s1 = null;
        if (peg$silentFails === 0) { peg$fail(peg$c104); }
      }

      return s0;
    }

    function peg$parsehashStacheClose() {
      var s0, s1;

      peg$silentFails++;
      if (input.charCodeAt(peg$currPos) === 125) {
        s0 = peg$c96;
        peg$currPos++;
      } else {
        s0 = null;
        if (peg$silentFails === 0) { peg$fail(peg$c97); }
      }
      peg$silentFails--;
      if (s0 === null) {
        s1 = null;
        if (peg$silentFails === 0) { peg$fail(peg$c107); }
      }

      return s0;
    }

    function peg$parseequalSign() {
      var s0, s1, s2;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 2) === peg$c108) {
        s1 = peg$c108;
        peg$currPos += 2;
      } else {
        s1 = null;
        if (peg$silentFails === 0) { peg$fail(peg$c109); }
      }
      if (s1 !== null) {
        if (input.charCodeAt(peg$currPos) === 32) {
          s2 = peg$c16;
          peg$currPos++;
        } else {
          s2 = null;
          if (peg$silentFails === 0) { peg$fail(peg$c17); }
        }
        if (s2 === null) {
          s2 = peg$c3;
        }
        if (s2 !== null) {
          peg$reportedPos = s0;
          s1 = peg$c110();
          if (s1 === null) {
            peg$currPos = s0;
            s0 = s1;
          } else {
            s0 = s1;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c2;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c2;
      }
      if (s0 === null) {
        s0 = peg$currPos;
        if (input.charCodeAt(peg$currPos) === 61) {
          s1 = peg$c40;
          peg$currPos++;
        } else {
          s1 = null;
          if (peg$silentFails === 0) { peg$fail(peg$c41); }
        }
        if (s1 !== null) {
          if (input.charCodeAt(peg$currPos) === 32) {
            s2 = peg$c16;
            peg$currPos++;
          } else {
            s2 = null;
            if (peg$silentFails === 0) { peg$fail(peg$c17); }
          }
          if (s2 === null) {
            s2 = peg$c3;
          }
          if (s2 !== null) {
            peg$reportedPos = s0;
            s1 = peg$c111();
            if (s1 === null) {
              peg$currPos = s0;
              s0 = s1;
            } else {
              s0 = s1;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c2;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c2;
        }
      }

      return s0;
    }

    function peg$parsehtmlTagAndOptionalAttributes() {
      var s0, s1, s2, s3, s4, s5, s6;

      s0 = peg$currPos;
      s1 = peg$currPos;
      s2 = peg$parsehtmlTagName();
      if (s2 !== null) {
        s3 = peg$parseshorthandAttributes();
        if (s3 === null) {
          s3 = peg$c3;
        }
        if (s3 !== null) {
          s4 = [];
          s5 = peg$parseinTagMustache();
          while (s5 !== null) {
            s4.push(s5);
            s5 = peg$parseinTagMustache();
          }
          if (s4 !== null) {
            s5 = [];
            s6 = peg$parsefullAttribute();
            while (s6 !== null) {
              s5.push(s6);
              s6 = peg$parsefullAttribute();
            }
            if (s5 !== null) {
              peg$reportedPos = s1;
              s2 = peg$c112(s2,s3,s4,s5);
              if (s2 === null) {
                peg$currPos = s1;
                s1 = s2;
              } else {
                s1 = s2;
              }
            } else {
              peg$currPos = s1;
              s1 = peg$c2;
            }
          } else {
            peg$currPos = s1;
            s1 = peg$c2;
          }
        } else {
          peg$currPos = s1;
          s1 = peg$c2;
        }
      } else {
        peg$currPos = s1;
        s1 = peg$c2;
      }
      if (s1 === null) {
        s1 = peg$currPos;
        s2 = peg$parseshorthandAttributes();
        if (s2 !== null) {
          s3 = [];
          s4 = peg$parseinTagMustache();
          while (s4 !== null) {
            s3.push(s4);
            s4 = peg$parseinTagMustache();
          }
          if (s3 !== null) {
            s4 = [];
            s5 = peg$parsefullAttribute();
            while (s5 !== null) {
              s4.push(s5);
              s5 = peg$parsefullAttribute();
            }
            if (s4 !== null) {
              peg$reportedPos = s1;
              s2 = peg$c113(s2,s3,s4);
              if (s2 === null) {
                peg$currPos = s1;
                s1 = s2;
              } else {
                s1 = s2;
              }
            } else {
              peg$currPos = s1;
              s1 = peg$c2;
            }
          } else {
            peg$currPos = s1;
            s1 = peg$c2;
          }
        } else {
          peg$currPos = s1;
          s1 = peg$c2;
        }
      }
      if (s1 !== null) {
        peg$reportedPos = s0;
        s1 = peg$c114(s1);
      }
      if (s1 === null) {
        peg$currPos = s0;
        s0 = s1;
      } else {
        s0 = s1;
      }

      return s0;
    }

    function peg$parseshorthandAttributes() {
      var s0;

      s0 = peg$parseattributesAtLeastID();
      if (s0 === null) {
        s0 = peg$parseattributesAtLeastClass();
      }

      return s0;
    }

    function peg$parseattributesAtLeastID() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      s1 = peg$parseidShorthand();
      if (s1 !== null) {
        s2 = [];
        s3 = peg$parseclassShorthand();
        while (s3 !== null) {
          s2.push(s3);
          s3 = peg$parseclassShorthand();
        }
        if (s2 !== null) {
          peg$reportedPos = s0;
          s1 = peg$c26(s1,s2);
          if (s1 === null) {
            peg$currPos = s0;
            s0 = s1;
          } else {
            s0 = s1;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c2;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c2;
      }

      return s0;
    }

    function peg$parseattributesAtLeastClass() {
      var s0, s1, s2;

      s0 = peg$currPos;
      s1 = [];
      s2 = peg$parseclassShorthand();
      if (s2 !== null) {
        while (s2 !== null) {
          s1.push(s2);
          s2 = peg$parseclassShorthand();
        }
      } else {
        s1 = peg$c2;
      }
      if (s1 !== null) {
        peg$reportedPos = s0;
        s1 = peg$c27(s1);
      }
      if (s1 === null) {
        peg$currPos = s0;
        s0 = s1;
      } else {
        s0 = s1;
      }

      return s0;
    }

    function peg$parsefullAttribute() {
      var s0, s1, s2;

      s0 = peg$currPos;
      s1 = [];
      if (input.charCodeAt(peg$currPos) === 32) {
        s2 = peg$c16;
        peg$currPos++;
      } else {
        s2 = null;
        if (peg$silentFails === 0) { peg$fail(peg$c17); }
      }
      if (s2 !== null) {
        while (s2 !== null) {
          s1.push(s2);
          if (input.charCodeAt(peg$currPos) === 32) {
            s2 = peg$c16;
            peg$currPos++;
          } else {
            s2 = null;
            if (peg$silentFails === 0) { peg$fail(peg$c17); }
          }
        }
      } else {
        s1 = peg$c2;
      }
      if (s1 !== null) {
        s2 = peg$parseactionAttribute();
        if (s2 === null) {
          s2 = peg$parseboundAttribute();
          if (s2 === null) {
            s2 = peg$parsenormalAttribute();
          }
        }
        if (s2 !== null) {
          peg$reportedPos = s0;
          s1 = peg$c115(s2);
          if (s1 === null) {
            peg$currPos = s0;
            s0 = s1;
          } else {
            s0 = s1;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c2;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c2;
      }

      return s0;
    }

    function peg$parseboundAttributeValueText() {
      var s0, s1, s2;

      s0 = peg$currPos;
      s1 = [];
      if (peg$c116.test(input.charAt(peg$currPos))) {
        s2 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s2 = null;
        if (peg$silentFails === 0) { peg$fail(peg$c117); }
      }
      if (s2 !== null) {
        while (s2 !== null) {
          s1.push(s2);
          if (peg$c116.test(input.charAt(peg$currPos))) {
            s2 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s2 = null;
            if (peg$silentFails === 0) { peg$fail(peg$c117); }
          }
        }
      } else {
        s1 = peg$c2;
      }
      if (s1 !== null) {
        s1 = input.substring(s0, peg$currPos);
      }
      s0 = s1;

      return s0;
    }

    function peg$parseactionValue() {
      var s0, s1;

      s0 = peg$parsequotedActionValue();
      if (s0 === null) {
        s0 = peg$currPos;
        s1 = peg$parsepathIdNode();
        if (s1 !== null) {
          peg$reportedPos = s0;
          s1 = peg$c118(s1);
        }
        if (s1 === null) {
          peg$currPos = s0;
          s0 = s1;
        } else {
          s0 = s1;
        }
      }

      return s0;
    }

    function peg$parsequotedActionValue() {
      var s0, s1, s2, s3, s4;

      s0 = peg$currPos;
      s1 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 34) {
        s2 = peg$c63;
        peg$currPos++;
      } else {
        s2 = null;
        if (peg$silentFails === 0) { peg$fail(peg$c64); }
      }
      if (s2 !== null) {
        s3 = peg$parseinMustache();
        if (s3 !== null) {
          if (input.charCodeAt(peg$currPos) === 34) {
            s4 = peg$c63;
            peg$currPos++;
          } else {
            s4 = null;
            if (peg$silentFails === 0) { peg$fail(peg$c64); }
          }
          if (s4 !== null) {
            s2 = [s2, s3, s4];
            s1 = s2;
          } else {
            peg$currPos = s1;
            s1 = peg$c2;
          }
        } else {
          peg$currPos = s1;
          s1 = peg$c2;
        }
      } else {
        peg$currPos = s1;
        s1 = peg$c2;
      }
      if (s1 === null) {
        s1 = peg$currPos;
        if (input.charCodeAt(peg$currPos) === 39) {
          s2 = peg$c65;
          peg$currPos++;
        } else {
          s2 = null;
          if (peg$silentFails === 0) { peg$fail(peg$c66); }
        }
        if (s2 !== null) {
          s3 = peg$parseinMustache();
          if (s3 !== null) {
            if (input.charCodeAt(peg$currPos) === 39) {
              s4 = peg$c65;
              peg$currPos++;
            } else {
              s4 = null;
              if (peg$silentFails === 0) { peg$fail(peg$c66); }
            }
            if (s4 !== null) {
              s2 = [s2, s3, s4];
              s1 = s2;
            } else {
              peg$currPos = s1;
              s1 = peg$c2;
            }
          } else {
            peg$currPos = s1;
            s1 = peg$c2;
          }
        } else {
          peg$currPos = s1;
          s1 = peg$c2;
        }
      }
      if (s1 !== null) {
        peg$reportedPos = s0;
        s1 = peg$c67(s1);
      }
      if (s1 === null) {
        peg$currPos = s0;
        s0 = s1;
      } else {
        s0 = s1;
      }

      return s0;
    }

    function peg$parseactionAttribute() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      s1 = peg$parseknownEvent();
      if (s1 !== null) {
        if (input.charCodeAt(peg$currPos) === 61) {
          s2 = peg$c40;
          peg$currPos++;
        } else {
          s2 = null;
          if (peg$silentFails === 0) { peg$fail(peg$c41); }
        }
        if (s2 !== null) {
          s3 = peg$parseactionValue();
          if (s3 !== null) {
            peg$reportedPos = s0;
            s1 = peg$c119(s1,s3);
            if (s1 === null) {
              peg$currPos = s0;
              s0 = s1;
            } else {
              s0 = s1;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c2;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c2;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c2;
      }

      return s0;
    }

    function peg$parseboundAttribute() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      s1 = peg$parsekey();
      if (s1 !== null) {
        if (input.charCodeAt(peg$currPos) === 61) {
          s2 = peg$c40;
          peg$currPos++;
        } else {
          s2 = null;
          if (peg$silentFails === 0) { peg$fail(peg$c41); }
        }
        if (s2 !== null) {
          s3 = peg$parseboundAttributeValueText();
          if (s3 !== null) {
            peg$reportedPos = s0;
            s1 = peg$c120(s1,s3);
            if (s1 === null) {
              peg$currPos = s0;
              s0 = s1;
            } else {
              s0 = s1;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c2;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c2;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c2;
      }

      return s0;
    }

    function peg$parsenormalAttribute() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      s1 = peg$parsekey();
      if (s1 !== null) {
        if (input.charCodeAt(peg$currPos) === 61) {
          s2 = peg$c40;
          peg$currPos++;
        } else {
          s2 = null;
          if (peg$silentFails === 0) { peg$fail(peg$c41); }
        }
        if (s2 !== null) {
          s3 = peg$parsestring();
          if (s3 !== null) {
            peg$reportedPos = s0;
            s1 = peg$c121(s1,s3);
            if (s1 === null) {
              peg$currPos = s0;
              s0 = s1;
            } else {
              s0 = s1;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c2;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c2;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c2;
      }

      return s0;
    }

    function peg$parseattributeName() {
      var s0, s1, s2;

      s0 = peg$currPos;
      s1 = [];
      s2 = peg$parseattributeChar();
      while (s2 !== null) {
        s1.push(s2);
        s2 = peg$parseattributeChar();
      }
      if (s1 !== null) {
        s1 = input.substring(s0, peg$currPos);
      }
      s0 = s1;

      return s0;
    }

    function peg$parseattributeValue() {
      var s0;

      s0 = peg$parsestring();
      if (s0 === null) {
        s0 = peg$parseparam();
      }

      return s0;
    }

    function peg$parseattributeChar() {
      var s0;

      s0 = peg$parsealpha();
      if (s0 === null) {
        if (peg$c60.test(input.charAt(peg$currPos))) {
          s0 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s0 = null;
          if (peg$silentFails === 0) { peg$fail(peg$c61); }
        }
        if (s0 === null) {
          if (input.charCodeAt(peg$currPos) === 95) {
            s0 = peg$c122;
            peg$currPos++;
          } else {
            s0 = null;
            if (peg$silentFails === 0) { peg$fail(peg$c123); }
          }
          if (s0 === null) {
            if (input.charCodeAt(peg$currPos) === 45) {
              s0 = peg$c124;
              peg$currPos++;
            } else {
              s0 = null;
              if (peg$silentFails === 0) { peg$fail(peg$c125); }
            }
          }
        }
      }

      return s0;
    }

    function peg$parsetagNameShorthand() {
      var s0, s1, s2;

      s0 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 37) {
        s1 = peg$c126;
        peg$currPos++;
      } else {
        s1 = null;
        if (peg$silentFails === 0) { peg$fail(peg$c127); }
      }
      if (s1 !== null) {
        s2 = peg$parsecssIdentifier();
        if (s2 !== null) {
          peg$reportedPos = s0;
          s1 = peg$c85(s2);
          if (s1 === null) {
            peg$currPos = s0;
            s0 = s1;
          } else {
            s0 = s1;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c2;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c2;
      }

      return s0;
    }

    function peg$parseidShorthand() {
      var s0, s1, s2;

      s0 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 35) {
        s1 = peg$c128;
        peg$currPos++;
      } else {
        s1 = null;
        if (peg$silentFails === 0) { peg$fail(peg$c129); }
      }
      if (s1 !== null) {
        s2 = peg$parsecssIdentifier();
        if (s2 !== null) {
          peg$reportedPos = s0;
          s1 = peg$c130(s2);
          if (s1 === null) {
            peg$currPos = s0;
            s0 = s1;
          } else {
            s0 = s1;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c2;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c2;
      }

      return s0;
    }

    function peg$parseclassShorthand() {
      var s0, s1, s2;

      s0 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 46) {
        s1 = peg$c36;
        peg$currPos++;
      } else {
        s1 = null;
        if (peg$silentFails === 0) { peg$fail(peg$c37); }
      }
      if (s1 !== null) {
        s2 = peg$parsecssIdentifier();
        if (s2 !== null) {
          peg$reportedPos = s0;
          s1 = peg$c85(s2);
          if (s1 === null) {
            peg$currPos = s0;
            s0 = s1;
          } else {
            s0 = s1;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c2;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c2;
      }

      return s0;
    }

    function peg$parsecssIdentifier() {
      var s0, s1;

      peg$silentFails++;
      s0 = peg$parseident();
      peg$silentFails--;
      if (s0 === null) {
        s1 = null;
        if (peg$silentFails === 0) { peg$fail(peg$c131); }
      }

      return s0;
    }

    function peg$parseident() {
      var s0, s1, s2, s3, s4;

      s0 = peg$currPos;
      s1 = peg$parsenmstart();
      if (s1 !== null) {
        s2 = peg$currPos;
        s3 = [];
        s4 = peg$parsenmchar();
        while (s4 !== null) {
          s3.push(s4);
          s4 = peg$parsenmchar();
        }
        if (s3 !== null) {
          s3 = input.substring(s2, peg$currPos);
        }
        s2 = s3;
        if (s2 !== null) {
          peg$reportedPos = s0;
          s1 = peg$c132(s1,s2);
          if (s1 === null) {
            peg$currPos = s0;
            s0 = s1;
          } else {
            s0 = s1;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c2;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c2;
      }

      return s0;
    }

    function peg$parsenmchar() {
      var s0;

      if (peg$c133.test(input.charAt(peg$currPos))) {
        s0 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s0 = null;
        if (peg$silentFails === 0) { peg$fail(peg$c134); }
      }
      if (s0 === null) {
        s0 = peg$parsenonascii();
      }

      return s0;
    }

    function peg$parsenmstart() {
      var s0;

      if (peg$c135.test(input.charAt(peg$currPos))) {
        s0 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s0 = null;
        if (peg$silentFails === 0) { peg$fail(peg$c136); }
      }
      if (s0 === null) {
        s0 = peg$parsenonascii();
      }

      return s0;
    }

    function peg$parsenonascii() {
      var s0;

      if (peg$c137.test(input.charAt(peg$currPos))) {
        s0 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s0 = null;
        if (peg$silentFails === 0) { peg$fail(peg$c138); }
      }

      return s0;
    }

    function peg$parsehtmlTagName() {
      var s0, s1, s2, s3, s4;

      peg$silentFails++;
      s0 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 37) {
        s1 = peg$c126;
        peg$currPos++;
      } else {
        s1 = null;
        if (peg$silentFails === 0) { peg$fail(peg$c127); }
      }
      if (s1 !== null) {
        s2 = peg$currPos;
        s3 = [];
        s4 = peg$parsetagChar();
        if (s4 !== null) {
          while (s4 !== null) {
            s3.push(s4);
            s4 = peg$parsetagChar();
          }
        } else {
          s3 = peg$c2;
        }
        if (s3 !== null) {
          s3 = input.substring(s2, peg$currPos);
        }
        s2 = s3;
        if (s2 !== null) {
          peg$reportedPos = s0;
          s1 = peg$c85(s2);
          if (s1 === null) {
            peg$currPos = s0;
            s0 = s1;
          } else {
            s0 = s1;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c2;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c2;
      }
      if (s0 === null) {
        s0 = peg$parseknownTagName();
      }
      peg$silentFails--;
      if (s0 === null) {
        s1 = null;
        if (peg$silentFails === 0) { peg$fail(peg$c139); }
      }

      return s0;
    }

    function peg$parsetagChar() {
      var s0;

      if (peg$c140.test(input.charAt(peg$currPos))) {
        s0 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s0 = null;
        if (peg$silentFails === 0) { peg$fail(peg$c141); }
      }

      return s0;
    }

    function peg$parseknownTagName() {
      var s0, s1;

      peg$silentFails++;
      if (input.substr(peg$currPos, 10) === peg$c142) {
        s0 = peg$c142;
        peg$currPos += 10;
      } else {
        s0 = null;
        if (peg$silentFails === 0) { peg$fail(peg$c143); }
      }
      if (s0 === null) {
        if (input.substr(peg$currPos, 10) === peg$c144) {
          s0 = peg$c144;
          peg$currPos += 10;
        } else {
          s0 = null;
          if (peg$silentFails === 0) { peg$fail(peg$c145); }
        }
        if (s0 === null) {
          if (input.substr(peg$currPos, 9) === peg$c146) {
            s0 = peg$c146;
            peg$currPos += 9;
          } else {
            s0 = null;
            if (peg$silentFails === 0) { peg$fail(peg$c147); }
          }
          if (s0 === null) {
            if (input.substr(peg$currPos, 8) === peg$c148) {
              s0 = peg$c148;
              peg$currPos += 8;
            } else {
              s0 = null;
              if (peg$silentFails === 0) { peg$fail(peg$c149); }
            }
            if (s0 === null) {
              if (input.substr(peg$currPos, 8) === peg$c150) {
                s0 = peg$c150;
                peg$currPos += 8;
              } else {
                s0 = null;
                if (peg$silentFails === 0) { peg$fail(peg$c151); }
              }
              if (s0 === null) {
                if (input.substr(peg$currPos, 8) === peg$c152) {
                  s0 = peg$c152;
                  peg$currPos += 8;
                } else {
                  s0 = null;
                  if (peg$silentFails === 0) { peg$fail(peg$c153); }
                }
                if (s0 === null) {
                  if (input.substr(peg$currPos, 8) === peg$c154) {
                    s0 = peg$c154;
                    peg$currPos += 8;
                  } else {
                    s0 = null;
                    if (peg$silentFails === 0) { peg$fail(peg$c155); }
                  }
                  if (s0 === null) {
                    if (input.substr(peg$currPos, 8) === peg$c156) {
                      s0 = peg$c156;
                      peg$currPos += 8;
                    } else {
                      s0 = null;
                      if (peg$silentFails === 0) { peg$fail(peg$c157); }
                    }
                    if (s0 === null) {
                      if (input.substr(peg$currPos, 8) === peg$c158) {
                        s0 = peg$c158;
                        peg$currPos += 8;
                      } else {
                        s0 = null;
                        if (peg$silentFails === 0) { peg$fail(peg$c159); }
                      }
                      if (s0 === null) {
                        if (input.substr(peg$currPos, 8) === peg$c160) {
                          s0 = peg$c160;
                          peg$currPos += 8;
                        } else {
                          s0 = null;
                          if (peg$silentFails === 0) { peg$fail(peg$c161); }
                        }
                        if (s0 === null) {
                          if (input.substr(peg$currPos, 8) === peg$c162) {
                            s0 = peg$c162;
                            peg$currPos += 8;
                          } else {
                            s0 = null;
                            if (peg$silentFails === 0) { peg$fail(peg$c163); }
                          }
                          if (s0 === null) {
                            if (input.substr(peg$currPos, 8) === peg$c164) {
                              s0 = peg$c164;
                              peg$currPos += 8;
                            } else {
                              s0 = null;
                              if (peg$silentFails === 0) { peg$fail(peg$c165); }
                            }
                            if (s0 === null) {
                              if (input.substr(peg$currPos, 8) === peg$c166) {
                                s0 = peg$c166;
                                peg$currPos += 8;
                              } else {
                                s0 = null;
                                if (peg$silentFails === 0) { peg$fail(peg$c167); }
                              }
                              if (s0 === null) {
                                if (input.substr(peg$currPos, 7) === peg$c168) {
                                  s0 = peg$c168;
                                  peg$currPos += 7;
                                } else {
                                  s0 = null;
                                  if (peg$silentFails === 0) { peg$fail(peg$c169); }
                                }
                                if (s0 === null) {
                                  if (input.substr(peg$currPos, 7) === peg$c170) {
                                    s0 = peg$c170;
                                    peg$currPos += 7;
                                  } else {
                                    s0 = null;
                                    if (peg$silentFails === 0) { peg$fail(peg$c171); }
                                  }
                                  if (s0 === null) {
                                    if (input.substr(peg$currPos, 7) === peg$c172) {
                                      s0 = peg$c172;
                                      peg$currPos += 7;
                                    } else {
                                      s0 = null;
                                      if (peg$silentFails === 0) { peg$fail(peg$c173); }
                                    }
                                    if (s0 === null) {
                                      if (input.substr(peg$currPos, 7) === peg$c174) {
                                        s0 = peg$c174;
                                        peg$currPos += 7;
                                      } else {
                                        s0 = null;
                                        if (peg$silentFails === 0) { peg$fail(peg$c175); }
                                      }
                                      if (s0 === null) {
                                        if (input.substr(peg$currPos, 7) === peg$c176) {
                                          s0 = peg$c176;
                                          peg$currPos += 7;
                                        } else {
                                          s0 = null;
                                          if (peg$silentFails === 0) { peg$fail(peg$c177); }
                                        }
                                        if (s0 === null) {
                                          if (input.substr(peg$currPos, 7) === peg$c178) {
                                            s0 = peg$c178;
                                            peg$currPos += 7;
                                          } else {
                                            s0 = null;
                                            if (peg$silentFails === 0) { peg$fail(peg$c179); }
                                          }
                                          if (s0 === null) {
                                            if (input.substr(peg$currPos, 7) === peg$c180) {
                                              s0 = peg$c180;
                                              peg$currPos += 7;
                                            } else {
                                              s0 = null;
                                              if (peg$silentFails === 0) { peg$fail(peg$c181); }
                                            }
                                            if (s0 === null) {
                                              if (input.substr(peg$currPos, 7) === peg$c182) {
                                                s0 = peg$c182;
                                                peg$currPos += 7;
                                              } else {
                                                s0 = null;
                                                if (peg$silentFails === 0) { peg$fail(peg$c183); }
                                              }
                                              if (s0 === null) {
                                                if (input.substr(peg$currPos, 7) === peg$c184) {
                                                  s0 = peg$c184;
                                                  peg$currPos += 7;
                                                } else {
                                                  s0 = null;
                                                  if (peg$silentFails === 0) { peg$fail(peg$c185); }
                                                }
                                                if (s0 === null) {
                                                  if (input.substr(peg$currPos, 7) === peg$c186) {
                                                    s0 = peg$c186;
                                                    peg$currPos += 7;
                                                  } else {
                                                    s0 = null;
                                                    if (peg$silentFails === 0) { peg$fail(peg$c187); }
                                                  }
                                                  if (s0 === null) {
                                                    if (input.substr(peg$currPos, 7) === peg$c188) {
                                                      s0 = peg$c188;
                                                      peg$currPos += 7;
                                                    } else {
                                                      s0 = null;
                                                      if (peg$silentFails === 0) { peg$fail(peg$c189); }
                                                    }
                                                    if (s0 === null) {
                                                      if (input.substr(peg$currPos, 7) === peg$c190) {
                                                        s0 = peg$c190;
                                                        peg$currPos += 7;
                                                      } else {
                                                        s0 = null;
                                                        if (peg$silentFails === 0) { peg$fail(peg$c191); }
                                                      }
                                                      if (s0 === null) {
                                                        if (input.substr(peg$currPos, 6) === peg$c192) {
                                                          s0 = peg$c192;
                                                          peg$currPos += 6;
                                                        } else {
                                                          s0 = null;
                                                          if (peg$silentFails === 0) { peg$fail(peg$c193); }
                                                        }
                                                        if (s0 === null) {
                                                          if (input.substr(peg$currPos, 6) === peg$c194) {
                                                            s0 = peg$c194;
                                                            peg$currPos += 6;
                                                          } else {
                                                            s0 = null;
                                                            if (peg$silentFails === 0) { peg$fail(peg$c195); }
                                                          }
                                                          if (s0 === null) {
                                                            if (input.substr(peg$currPos, 6) === peg$c196) {
                                                              s0 = peg$c196;
                                                              peg$currPos += 6;
                                                            } else {
                                                              s0 = null;
                                                              if (peg$silentFails === 0) { peg$fail(peg$c197); }
                                                            }
                                                            if (s0 === null) {
                                                              if (input.substr(peg$currPos, 6) === peg$c198) {
                                                                s0 = peg$c198;
                                                                peg$currPos += 6;
                                                              } else {
                                                                s0 = null;
                                                                if (peg$silentFails === 0) { peg$fail(peg$c199); }
                                                              }
                                                              if (s0 === null) {
                                                                if (input.substr(peg$currPos, 6) === peg$c200) {
                                                                  s0 = peg$c200;
                                                                  peg$currPos += 6;
                                                                } else {
                                                                  s0 = null;
                                                                  if (peg$silentFails === 0) { peg$fail(peg$c201); }
                                                                }
                                                                if (s0 === null) {
                                                                  if (input.substr(peg$currPos, 6) === peg$c202) {
                                                                    s0 = peg$c202;
                                                                    peg$currPos += 6;
                                                                  } else {
                                                                    s0 = null;
                                                                    if (peg$silentFails === 0) { peg$fail(peg$c203); }
                                                                  }
                                                                  if (s0 === null) {
                                                                    if (input.substr(peg$currPos, 6) === peg$c204) {
                                                                      s0 = peg$c204;
                                                                      peg$currPos += 6;
                                                                    } else {
                                                                      s0 = null;
                                                                      if (peg$silentFails === 0) { peg$fail(peg$c205); }
                                                                    }
                                                                    if (s0 === null) {
                                                                      if (input.substr(peg$currPos, 6) === peg$c206) {
                                                                        s0 = peg$c206;
                                                                        peg$currPos += 6;
                                                                      } else {
                                                                        s0 = null;
                                                                        if (peg$silentFails === 0) { peg$fail(peg$c207); }
                                                                      }
                                                                      if (s0 === null) {
                                                                        if (input.substr(peg$currPos, 6) === peg$c208) {
                                                                          s0 = peg$c208;
                                                                          peg$currPos += 6;
                                                                        } else {
                                                                          s0 = null;
                                                                          if (peg$silentFails === 0) { peg$fail(peg$c209); }
                                                                        }
                                                                        if (s0 === null) {
                                                                          if (input.substr(peg$currPos, 6) === peg$c210) {
                                                                            s0 = peg$c210;
                                                                            peg$currPos += 6;
                                                                          } else {
                                                                            s0 = null;
                                                                            if (peg$silentFails === 0) { peg$fail(peg$c211); }
                                                                          }
                                                                          if (s0 === null) {
                                                                            if (input.substr(peg$currPos, 6) === peg$c212) {
                                                                              s0 = peg$c212;
                                                                              peg$currPos += 6;
                                                                            } else {
                                                                              s0 = null;
                                                                              if (peg$silentFails === 0) { peg$fail(peg$c213); }
                                                                            }
                                                                            if (s0 === null) {
                                                                              if (input.substr(peg$currPos, 6) === peg$c214) {
                                                                                s0 = peg$c214;
                                                                                peg$currPos += 6;
                                                                              } else {
                                                                                s0 = null;
                                                                                if (peg$silentFails === 0) { peg$fail(peg$c215); }
                                                                              }
                                                                              if (s0 === null) {
                                                                                if (input.substr(peg$currPos, 6) === peg$c216) {
                                                                                  s0 = peg$c216;
                                                                                  peg$currPos += 6;
                                                                                } else {
                                                                                  s0 = null;
                                                                                  if (peg$silentFails === 0) { peg$fail(peg$c217); }
                                                                                }
                                                                                if (s0 === null) {
                                                                                  if (input.substr(peg$currPos, 6) === peg$c218) {
                                                                                    s0 = peg$c218;
                                                                                    peg$currPos += 6;
                                                                                  } else {
                                                                                    s0 = null;
                                                                                    if (peg$silentFails === 0) { peg$fail(peg$c219); }
                                                                                  }
                                                                                  if (s0 === null) {
                                                                                    if (input.substr(peg$currPos, 6) === peg$c220) {
                                                                                      s0 = peg$c220;
                                                                                      peg$currPos += 6;
                                                                                    } else {
                                                                                      s0 = null;
                                                                                      if (peg$silentFails === 0) { peg$fail(peg$c221); }
                                                                                    }
                                                                                    if (s0 === null) {
                                                                                      if (input.substr(peg$currPos, 6) === peg$c222) {
                                                                                        s0 = peg$c222;
                                                                                        peg$currPos += 6;
                                                                                      } else {
                                                                                        s0 = null;
                                                                                        if (peg$silentFails === 0) { peg$fail(peg$c223); }
                                                                                      }
                                                                                      if (s0 === null) {
                                                                                        if (input.substr(peg$currPos, 6) === peg$c224) {
                                                                                          s0 = peg$c224;
                                                                                          peg$currPos += 6;
                                                                                        } else {
                                                                                          s0 = null;
                                                                                          if (peg$silentFails === 0) { peg$fail(peg$c225); }
                                                                                        }
                                                                                        if (s0 === null) {
                                                                                          if (input.substr(peg$currPos, 6) === peg$c226) {
                                                                                            s0 = peg$c226;
                                                                                            peg$currPos += 6;
                                                                                          } else {
                                                                                            s0 = null;
                                                                                            if (peg$silentFails === 0) { peg$fail(peg$c227); }
                                                                                          }
                                                                                          if (s0 === null) {
                                                                                            if (input.substr(peg$currPos, 6) === peg$c228) {
                                                                                              s0 = peg$c228;
                                                                                              peg$currPos += 6;
                                                                                            } else {
                                                                                              s0 = null;
                                                                                              if (peg$silentFails === 0) { peg$fail(peg$c229); }
                                                                                            }
                                                                                            if (s0 === null) {
                                                                                              if (input.substr(peg$currPos, 6) === peg$c230) {
                                                                                                s0 = peg$c230;
                                                                                                peg$currPos += 6;
                                                                                              } else {
                                                                                                s0 = null;
                                                                                                if (peg$silentFails === 0) { peg$fail(peg$c231); }
                                                                                              }
                                                                                              if (s0 === null) {
                                                                                                if (input.substr(peg$currPos, 5) === peg$c232) {
                                                                                                  s0 = peg$c232;
                                                                                                  peg$currPos += 5;
                                                                                                } else {
                                                                                                  s0 = null;
                                                                                                  if (peg$silentFails === 0) { peg$fail(peg$c233); }
                                                                                                }
                                                                                                if (s0 === null) {
                                                                                                  if (input.substr(peg$currPos, 5) === peg$c234) {
                                                                                                    s0 = peg$c234;
                                                                                                    peg$currPos += 5;
                                                                                                  } else {
                                                                                                    s0 = null;
                                                                                                    if (peg$silentFails === 0) { peg$fail(peg$c235); }
                                                                                                  }
                                                                                                  if (s0 === null) {
                                                                                                    if (input.substr(peg$currPos, 5) === peg$c236) {
                                                                                                      s0 = peg$c236;
                                                                                                      peg$currPos += 5;
                                                                                                    } else {
                                                                                                      s0 = null;
                                                                                                      if (peg$silentFails === 0) { peg$fail(peg$c237); }
                                                                                                    }
                                                                                                    if (s0 === null) {
                                                                                                      if (input.substr(peg$currPos, 5) === peg$c238) {
                                                                                                        s0 = peg$c238;
                                                                                                        peg$currPos += 5;
                                                                                                      } else {
                                                                                                        s0 = null;
                                                                                                        if (peg$silentFails === 0) { peg$fail(peg$c239); }
                                                                                                      }
                                                                                                      if (s0 === null) {
                                                                                                        if (input.substr(peg$currPos, 5) === peg$c240) {
                                                                                                          s0 = peg$c240;
                                                                                                          peg$currPos += 5;
                                                                                                        } else {
                                                                                                          s0 = null;
                                                                                                          if (peg$silentFails === 0) { peg$fail(peg$c241); }
                                                                                                        }
                                                                                                        if (s0 === null) {
                                                                                                          if (input.substr(peg$currPos, 5) === peg$c242) {
                                                                                                            s0 = peg$c242;
                                                                                                            peg$currPos += 5;
                                                                                                          } else {
                                                                                                            s0 = null;
                                                                                                            if (peg$silentFails === 0) { peg$fail(peg$c243); }
                                                                                                          }
                                                                                                          if (s0 === null) {
                                                                                                            if (input.substr(peg$currPos, 5) === peg$c244) {
                                                                                                              s0 = peg$c244;
                                                                                                              peg$currPos += 5;
                                                                                                            } else {
                                                                                                              s0 = null;
                                                                                                              if (peg$silentFails === 0) { peg$fail(peg$c245); }
                                                                                                            }
                                                                                                            if (s0 === null) {
                                                                                                              if (input.substr(peg$currPos, 5) === peg$c246) {
                                                                                                                s0 = peg$c246;
                                                                                                                peg$currPos += 5;
                                                                                                              } else {
                                                                                                                s0 = null;
                                                                                                                if (peg$silentFails === 0) { peg$fail(peg$c247); }
                                                                                                              }
                                                                                                              if (s0 === null) {
                                                                                                                if (input.substr(peg$currPos, 5) === peg$c248) {
                                                                                                                  s0 = peg$c248;
                                                                                                                  peg$currPos += 5;
                                                                                                                } else {
                                                                                                                  s0 = null;
                                                                                                                  if (peg$silentFails === 0) { peg$fail(peg$c249); }
                                                                                                                }
                                                                                                                if (s0 === null) {
                                                                                                                  if (input.substr(peg$currPos, 5) === peg$c250) {
                                                                                                                    s0 = peg$c250;
                                                                                                                    peg$currPos += 5;
                                                                                                                  } else {
                                                                                                                    s0 = null;
                                                                                                                    if (peg$silentFails === 0) { peg$fail(peg$c251); }
                                                                                                                  }
                                                                                                                  if (s0 === null) {
                                                                                                                    if (input.substr(peg$currPos, 5) === peg$c252) {
                                                                                                                      s0 = peg$c252;
                                                                                                                      peg$currPos += 5;
                                                                                                                    } else {
                                                                                                                      s0 = null;
                                                                                                                      if (peg$silentFails === 0) { peg$fail(peg$c253); }
                                                                                                                    }
                                                                                                                    if (s0 === null) {
                                                                                                                      if (input.substr(peg$currPos, 5) === peg$c254) {
                                                                                                                        s0 = peg$c254;
                                                                                                                        peg$currPos += 5;
                                                                                                                      } else {
                                                                                                                        s0 = null;
                                                                                                                        if (peg$silentFails === 0) { peg$fail(peg$c255); }
                                                                                                                      }
                                                                                                                      if (s0 === null) {
                                                                                                                        if (input.substr(peg$currPos, 5) === peg$c256) {
                                                                                                                          s0 = peg$c256;
                                                                                                                          peg$currPos += 5;
                                                                                                                        } else {
                                                                                                                          s0 = null;
                                                                                                                          if (peg$silentFails === 0) { peg$fail(peg$c257); }
                                                                                                                        }
                                                                                                                        if (s0 === null) {
                                                                                                                          if (input.substr(peg$currPos, 5) === peg$c258) {
                                                                                                                            s0 = peg$c258;
                                                                                                                            peg$currPos += 5;
                                                                                                                          } else {
                                                                                                                            s0 = null;
                                                                                                                            if (peg$silentFails === 0) { peg$fail(peg$c259); }
                                                                                                                          }
                                                                                                                          if (s0 === null) {
                                                                                                                            if (input.substr(peg$currPos, 5) === peg$c260) {
                                                                                                                              s0 = peg$c260;
                                                                                                                              peg$currPos += 5;
                                                                                                                            } else {
                                                                                                                              s0 = null;
                                                                                                                              if (peg$silentFails === 0) { peg$fail(peg$c261); }
                                                                                                                            }
                                                                                                                            if (s0 === null) {
                                                                                                                              if (input.substr(peg$currPos, 5) === peg$c262) {
                                                                                                                                s0 = peg$c262;
                                                                                                                                peg$currPos += 5;
                                                                                                                              } else {
                                                                                                                                s0 = null;
                                                                                                                                if (peg$silentFails === 0) { peg$fail(peg$c263); }
                                                                                                                              }
                                                                                                                              if (s0 === null) {
                                                                                                                                if (input.substr(peg$currPos, 5) === peg$c264) {
                                                                                                                                  s0 = peg$c264;
                                                                                                                                  peg$currPos += 5;
                                                                                                                                } else {
                                                                                                                                  s0 = null;
                                                                                                                                  if (peg$silentFails === 0) { peg$fail(peg$c265); }
                                                                                                                                }
                                                                                                                                if (s0 === null) {
                                                                                                                                  if (input.substr(peg$currPos, 5) === peg$c266) {
                                                                                                                                    s0 = peg$c266;
                                                                                                                                    peg$currPos += 5;
                                                                                                                                  } else {
                                                                                                                                    s0 = null;
                                                                                                                                    if (peg$silentFails === 0) { peg$fail(peg$c267); }
                                                                                                                                  }
                                                                                                                                  if (s0 === null) {
                                                                                                                                    if (input.substr(peg$currPos, 4) === peg$c268) {
                                                                                                                                      s0 = peg$c268;
                                                                                                                                      peg$currPos += 4;
                                                                                                                                    } else {
                                                                                                                                      s0 = null;
                                                                                                                                      if (peg$silentFails === 0) { peg$fail(peg$c269); }
                                                                                                                                    }
                                                                                                                                    if (s0 === null) {
                                                                                                                                      if (input.substr(peg$currPos, 4) === peg$c270) {
                                                                                                                                        s0 = peg$c270;
                                                                                                                                        peg$currPos += 4;
                                                                                                                                      } else {
                                                                                                                                        s0 = null;
                                                                                                                                        if (peg$silentFails === 0) { peg$fail(peg$c271); }
                                                                                                                                      }
                                                                                                                                      if (s0 === null) {
                                                                                                                                        if (input.substr(peg$currPos, 4) === peg$c272) {
                                                                                                                                          s0 = peg$c272;
                                                                                                                                          peg$currPos += 4;
                                                                                                                                        } else {
                                                                                                                                          s0 = null;
                                                                                                                                          if (peg$silentFails === 0) { peg$fail(peg$c273); }
                                                                                                                                        }
                                                                                                                                        if (s0 === null) {
                                                                                                                                          if (input.substr(peg$currPos, 4) === peg$c274) {
                                                                                                                                            s0 = peg$c274;
                                                                                                                                            peg$currPos += 4;
                                                                                                                                          } else {
                                                                                                                                            s0 = null;
                                                                                                                                            if (peg$silentFails === 0) { peg$fail(peg$c275); }
                                                                                                                                          }
                                                                                                                                          if (s0 === null) {
                                                                                                                                            if (input.substr(peg$currPos, 4) === peg$c276) {
                                                                                                                                              s0 = peg$c276;
                                                                                                                                              peg$currPos += 4;
                                                                                                                                            } else {
                                                                                                                                              s0 = null;
                                                                                                                                              if (peg$silentFails === 0) { peg$fail(peg$c277); }
                                                                                                                                            }
                                                                                                                                            if (s0 === null) {
                                                                                                                                              if (input.substr(peg$currPos, 4) === peg$c278) {
                                                                                                                                                s0 = peg$c278;
                                                                                                                                                peg$currPos += 4;
                                                                                                                                              } else {
                                                                                                                                                s0 = null;
                                                                                                                                                if (peg$silentFails === 0) { peg$fail(peg$c279); }
                                                                                                                                              }
                                                                                                                                              if (s0 === null) {
                                                                                                                                                if (input.substr(peg$currPos, 4) === peg$c280) {
                                                                                                                                                  s0 = peg$c280;
                                                                                                                                                  peg$currPos += 4;
                                                                                                                                                } else {
                                                                                                                                                  s0 = null;
                                                                                                                                                  if (peg$silentFails === 0) { peg$fail(peg$c281); }
                                                                                                                                                }
                                                                                                                                                if (s0 === null) {
                                                                                                                                                  if (input.substr(peg$currPos, 4) === peg$c282) {
                                                                                                                                                    s0 = peg$c282;
                                                                                                                                                    peg$currPos += 4;
                                                                                                                                                  } else {
                                                                                                                                                    s0 = null;
                                                                                                                                                    if (peg$silentFails === 0) { peg$fail(peg$c283); }
                                                                                                                                                  }
                                                                                                                                                  if (s0 === null) {
                                                                                                                                                    if (input.substr(peg$currPos, 4) === peg$c284) {
                                                                                                                                                      s0 = peg$c284;
                                                                                                                                                      peg$currPos += 4;
                                                                                                                                                    } else {
                                                                                                                                                      s0 = null;
                                                                                                                                                      if (peg$silentFails === 0) { peg$fail(peg$c285); }
                                                                                                                                                    }
                                                                                                                                                    if (s0 === null) {
                                                                                                                                                      if (input.substr(peg$currPos, 4) === peg$c286) {
                                                                                                                                                        s0 = peg$c286;
                                                                                                                                                        peg$currPos += 4;
                                                                                                                                                      } else {
                                                                                                                                                        s0 = null;
                                                                                                                                                        if (peg$silentFails === 0) { peg$fail(peg$c287); }
                                                                                                                                                      }
                                                                                                                                                      if (s0 === null) {
                                                                                                                                                        if (input.substr(peg$currPos, 4) === peg$c288) {
                                                                                                                                                          s0 = peg$c288;
                                                                                                                                                          peg$currPos += 4;
                                                                                                                                                        } else {
                                                                                                                                                          s0 = null;
                                                                                                                                                          if (peg$silentFails === 0) { peg$fail(peg$c289); }
                                                                                                                                                        }
                                                                                                                                                        if (s0 === null) {
                                                                                                                                                          if (input.substr(peg$currPos, 4) === peg$c290) {
                                                                                                                                                            s0 = peg$c290;
                                                                                                                                                            peg$currPos += 4;
                                                                                                                                                          } else {
                                                                                                                                                            s0 = null;
                                                                                                                                                            if (peg$silentFails === 0) { peg$fail(peg$c291); }
                                                                                                                                                          }
                                                                                                                                                          if (s0 === null) {
                                                                                                                                                            if (input.substr(peg$currPos, 4) === peg$c292) {
                                                                                                                                                              s0 = peg$c292;
                                                                                                                                                              peg$currPos += 4;
                                                                                                                                                            } else {
                                                                                                                                                              s0 = null;
                                                                                                                                                              if (peg$silentFails === 0) { peg$fail(peg$c293); }
                                                                                                                                                            }
                                                                                                                                                            if (s0 === null) {
                                                                                                                                                              if (input.substr(peg$currPos, 4) === peg$c294) {
                                                                                                                                                                s0 = peg$c294;
                                                                                                                                                                peg$currPos += 4;
                                                                                                                                                              } else {
                                                                                                                                                                s0 = null;
                                                                                                                                                                if (peg$silentFails === 0) { peg$fail(peg$c295); }
                                                                                                                                                              }
                                                                                                                                                              if (s0 === null) {
                                                                                                                                                                if (input.substr(peg$currPos, 4) === peg$c296) {
                                                                                                                                                                  s0 = peg$c296;
                                                                                                                                                                  peg$currPos += 4;
                                                                                                                                                                } else {
                                                                                                                                                                  s0 = null;
                                                                                                                                                                  if (peg$silentFails === 0) { peg$fail(peg$c297); }
                                                                                                                                                                }
                                                                                                                                                                if (s0 === null) {
                                                                                                                                                                  if (input.substr(peg$currPos, 4) === peg$c298) {
                                                                                                                                                                    s0 = peg$c298;
                                                                                                                                                                    peg$currPos += 4;
                                                                                                                                                                  } else {
                                                                                                                                                                    s0 = null;
                                                                                                                                                                    if (peg$silentFails === 0) { peg$fail(peg$c299); }
                                                                                                                                                                  }
                                                                                                                                                                  if (s0 === null) {
                                                                                                                                                                    if (input.substr(peg$currPos, 4) === peg$c300) {
                                                                                                                                                                      s0 = peg$c300;
                                                                                                                                                                      peg$currPos += 4;
                                                                                                                                                                    } else {
                                                                                                                                                                      s0 = null;
                                                                                                                                                                      if (peg$silentFails === 0) { peg$fail(peg$c301); }
                                                                                                                                                                    }
                                                                                                                                                                    if (s0 === null) {
                                                                                                                                                                      if (input.substr(peg$currPos, 4) === peg$c302) {
                                                                                                                                                                        s0 = peg$c302;
                                                                                                                                                                        peg$currPos += 4;
                                                                                                                                                                      } else {
                                                                                                                                                                        s0 = null;
                                                                                                                                                                        if (peg$silentFails === 0) { peg$fail(peg$c303); }
                                                                                                                                                                      }
                                                                                                                                                                      if (s0 === null) {
                                                                                                                                                                        if (input.substr(peg$currPos, 4) === peg$c304) {
                                                                                                                                                                          s0 = peg$c304;
                                                                                                                                                                          peg$currPos += 4;
                                                                                                                                                                        } else {
                                                                                                                                                                          s0 = null;
                                                                                                                                                                          if (peg$silentFails === 0) { peg$fail(peg$c305); }
                                                                                                                                                                        }
                                                                                                                                                                        if (s0 === null) {
                                                                                                                                                                          if (input.substr(peg$currPos, 4) === peg$c306) {
                                                                                                                                                                            s0 = peg$c306;
                                                                                                                                                                            peg$currPos += 4;
                                                                                                                                                                          } else {
                                                                                                                                                                            s0 = null;
                                                                                                                                                                            if (peg$silentFails === 0) { peg$fail(peg$c307); }
                                                                                                                                                                          }
                                                                                                                                                                          if (s0 === null) {
                                                                                                                                                                            if (input.substr(peg$currPos, 4) === peg$c308) {
                                                                                                                                                                              s0 = peg$c308;
                                                                                                                                                                              peg$currPos += 4;
                                                                                                                                                                            } else {
                                                                                                                                                                              s0 = null;
                                                                                                                                                                              if (peg$silentFails === 0) { peg$fail(peg$c309); }
                                                                                                                                                                            }
                                                                                                                                                                            if (s0 === null) {
                                                                                                                                                                              if (input.substr(peg$currPos, 3) === peg$c310) {
                                                                                                                                                                                s0 = peg$c310;
                                                                                                                                                                                peg$currPos += 3;
                                                                                                                                                                              } else {
                                                                                                                                                                                s0 = null;
                                                                                                                                                                                if (peg$silentFails === 0) { peg$fail(peg$c311); }
                                                                                                                                                                              }
                                                                                                                                                                              if (s0 === null) {
                                                                                                                                                                                if (input.substr(peg$currPos, 3) === peg$c312) {
                                                                                                                                                                                  s0 = peg$c312;
                                                                                                                                                                                  peg$currPos += 3;
                                                                                                                                                                                } else {
                                                                                                                                                                                  s0 = null;
                                                                                                                                                                                  if (peg$silentFails === 0) { peg$fail(peg$c313); }
                                                                                                                                                                                }
                                                                                                                                                                                if (s0 === null) {
                                                                                                                                                                                  if (input.substr(peg$currPos, 3) === peg$c314) {
                                                                                                                                                                                    s0 = peg$c314;
                                                                                                                                                                                    peg$currPos += 3;
                                                                                                                                                                                  } else {
                                                                                                                                                                                    s0 = null;
                                                                                                                                                                                    if (peg$silentFails === 0) { peg$fail(peg$c315); }
                                                                                                                                                                                  }
                                                                                                                                                                                  if (s0 === null) {
                                                                                                                                                                                    if (input.substr(peg$currPos, 3) === peg$c316) {
                                                                                                                                                                                      s0 = peg$c316;
                                                                                                                                                                                      peg$currPos += 3;
                                                                                                                                                                                    } else {
                                                                                                                                                                                      s0 = null;
                                                                                                                                                                                      if (peg$silentFails === 0) { peg$fail(peg$c317); }
                                                                                                                                                                                    }
                                                                                                                                                                                    if (s0 === null) {
                                                                                                                                                                                      if (input.substr(peg$currPos, 3) === peg$c318) {
                                                                                                                                                                                        s0 = peg$c318;
                                                                                                                                                                                        peg$currPos += 3;
                                                                                                                                                                                      } else {
                                                                                                                                                                                        s0 = null;
                                                                                                                                                                                        if (peg$silentFails === 0) { peg$fail(peg$c319); }
                                                                                                                                                                                      }
                                                                                                                                                                                      if (s0 === null) {
                                                                                                                                                                                        if (input.substr(peg$currPos, 3) === peg$c320) {
                                                                                                                                                                                          s0 = peg$c320;
                                                                                                                                                                                          peg$currPos += 3;
                                                                                                                                                                                        } else {
                                                                                                                                                                                          s0 = null;
                                                                                                                                                                                          if (peg$silentFails === 0) { peg$fail(peg$c321); }
                                                                                                                                                                                        }
                                                                                                                                                                                        if (s0 === null) {
                                                                                                                                                                                          if (input.substr(peg$currPos, 3) === peg$c322) {
                                                                                                                                                                                            s0 = peg$c322;
                                                                                                                                                                                            peg$currPos += 3;
                                                                                                                                                                                          } else {
                                                                                                                                                                                            s0 = null;
                                                                                                                                                                                            if (peg$silentFails === 0) { peg$fail(peg$c323); }
                                                                                                                                                                                          }
                                                                                                                                                                                          if (s0 === null) {
                                                                                                                                                                                            if (input.substr(peg$currPos, 3) === peg$c324) {
                                                                                                                                                                                              s0 = peg$c324;
                                                                                                                                                                                              peg$currPos += 3;
                                                                                                                                                                                            } else {
                                                                                                                                                                                              s0 = null;
                                                                                                                                                                                              if (peg$silentFails === 0) { peg$fail(peg$c325); }
                                                                                                                                                                                            }
                                                                                                                                                                                            if (s0 === null) {
                                                                                                                                                                                              if (input.substr(peg$currPos, 3) === peg$c326) {
                                                                                                                                                                                                s0 = peg$c326;
                                                                                                                                                                                                peg$currPos += 3;
                                                                                                                                                                                              } else {
                                                                                                                                                                                                s0 = null;
                                                                                                                                                                                                if (peg$silentFails === 0) { peg$fail(peg$c327); }
                                                                                                                                                                                              }
                                                                                                                                                                                              if (s0 === null) {
                                                                                                                                                                                                if (input.substr(peg$currPos, 3) === peg$c328) {
                                                                                                                                                                                                  s0 = peg$c328;
                                                                                                                                                                                                  peg$currPos += 3;
                                                                                                                                                                                                } else {
                                                                                                                                                                                                  s0 = null;
                                                                                                                                                                                                  if (peg$silentFails === 0) { peg$fail(peg$c329); }
                                                                                                                                                                                                }
                                                                                                                                                                                                if (s0 === null) {
                                                                                                                                                                                                  if (input.substr(peg$currPos, 3) === peg$c330) {
                                                                                                                                                                                                    s0 = peg$c330;
                                                                                                                                                                                                    peg$currPos += 3;
                                                                                                                                                                                                  } else {
                                                                                                                                                                                                    s0 = null;
                                                                                                                                                                                                    if (peg$silentFails === 0) { peg$fail(peg$c331); }
                                                                                                                                                                                                  }
                                                                                                                                                                                                  if (s0 === null) {
                                                                                                                                                                                                    if (input.substr(peg$currPos, 3) === peg$c332) {
                                                                                                                                                                                                      s0 = peg$c332;
                                                                                                                                                                                                      peg$currPos += 3;
                                                                                                                                                                                                    } else {
                                                                                                                                                                                                      s0 = null;
                                                                                                                                                                                                      if (peg$silentFails === 0) { peg$fail(peg$c333); }
                                                                                                                                                                                                    }
                                                                                                                                                                                                    if (s0 === null) {
                                                                                                                                                                                                      if (input.substr(peg$currPos, 3) === peg$c334) {
                                                                                                                                                                                                        s0 = peg$c334;
                                                                                                                                                                                                        peg$currPos += 3;
                                                                                                                                                                                                      } else {
                                                                                                                                                                                                        s0 = null;
                                                                                                                                                                                                        if (peg$silentFails === 0) { peg$fail(peg$c335); }
                                                                                                                                                                                                      }
                                                                                                                                                                                                      if (s0 === null) {
                                                                                                                                                                                                        if (input.substr(peg$currPos, 3) === peg$c336) {
                                                                                                                                                                                                          s0 = peg$c336;
                                                                                                                                                                                                          peg$currPos += 3;
                                                                                                                                                                                                        } else {
                                                                                                                                                                                                          s0 = null;
                                                                                                                                                                                                          if (peg$silentFails === 0) { peg$fail(peg$c337); }
                                                                                                                                                                                                        }
                                                                                                                                                                                                        if (s0 === null) {
                                                                                                                                                                                                          if (input.substr(peg$currPos, 3) === peg$c338) {
                                                                                                                                                                                                            s0 = peg$c338;
                                                                                                                                                                                                            peg$currPos += 3;
                                                                                                                                                                                                          } else {
                                                                                                                                                                                                            s0 = null;
                                                                                                                                                                                                            if (peg$silentFails === 0) { peg$fail(peg$c339); }
                                                                                                                                                                                                          }
                                                                                                                                                                                                          if (s0 === null) {
                                                                                                                                                                                                            if (input.substr(peg$currPos, 3) === peg$c340) {
                                                                                                                                                                                                              s0 = peg$c340;
                                                                                                                                                                                                              peg$currPos += 3;
                                                                                                                                                                                                            } else {
                                                                                                                                                                                                              s0 = null;
                                                                                                                                                                                                              if (peg$silentFails === 0) { peg$fail(peg$c341); }
                                                                                                                                                                                                            }
                                                                                                                                                                                                            if (s0 === null) {
                                                                                                                                                                                                              if (input.substr(peg$currPos, 3) === peg$c342) {
                                                                                                                                                                                                                s0 = peg$c342;
                                                                                                                                                                                                                peg$currPos += 3;
                                                                                                                                                                                                              } else {
                                                                                                                                                                                                                s0 = null;
                                                                                                                                                                                                                if (peg$silentFails === 0) { peg$fail(peg$c343); }
                                                                                                                                                                                                              }
                                                                                                                                                                                                              if (s0 === null) {
                                                                                                                                                                                                                if (input.substr(peg$currPos, 3) === peg$c344) {
                                                                                                                                                                                                                  s0 = peg$c344;
                                                                                                                                                                                                                  peg$currPos += 3;
                                                                                                                                                                                                                } else {
                                                                                                                                                                                                                  s0 = null;
                                                                                                                                                                                                                  if (peg$silentFails === 0) { peg$fail(peg$c345); }
                                                                                                                                                                                                                }
                                                                                                                                                                                                                if (s0 === null) {
                                                                                                                                                                                                                  if (input.substr(peg$currPos, 3) === peg$c346) {
                                                                                                                                                                                                                    s0 = peg$c346;
                                                                                                                                                                                                                    peg$currPos += 3;
                                                                                                                                                                                                                  } else {
                                                                                                                                                                                                                    s0 = null;
                                                                                                                                                                                                                    if (peg$silentFails === 0) { peg$fail(peg$c347); }
                                                                                                                                                                                                                  }
                                                                                                                                                                                                                  if (s0 === null) {
                                                                                                                                                                                                                    if (input.substr(peg$currPos, 2) === peg$c348) {
                                                                                                                                                                                                                      s0 = peg$c348;
                                                                                                                                                                                                                      peg$currPos += 2;
                                                                                                                                                                                                                    } else {
                                                                                                                                                                                                                      s0 = null;
                                                                                                                                                                                                                      if (peg$silentFails === 0) { peg$fail(peg$c349); }
                                                                                                                                                                                                                    }
                                                                                                                                                                                                                    if (s0 === null) {
                                                                                                                                                                                                                      if (input.substr(peg$currPos, 2) === peg$c350) {
                                                                                                                                                                                                                        s0 = peg$c350;
                                                                                                                                                                                                                        peg$currPos += 2;
                                                                                                                                                                                                                      } else {
                                                                                                                                                                                                                        s0 = null;
                                                                                                                                                                                                                        if (peg$silentFails === 0) { peg$fail(peg$c351); }
                                                                                                                                                                                                                      }
                                                                                                                                                                                                                      if (s0 === null) {
                                                                                                                                                                                                                        if (input.substr(peg$currPos, 2) === peg$c352) {
                                                                                                                                                                                                                          s0 = peg$c352;
                                                                                                                                                                                                                          peg$currPos += 2;
                                                                                                                                                                                                                        } else {
                                                                                                                                                                                                                          s0 = null;
                                                                                                                                                                                                                          if (peg$silentFails === 0) { peg$fail(peg$c353); }
                                                                                                                                                                                                                        }
                                                                                                                                                                                                                        if (s0 === null) {
                                                                                                                                                                                                                          if (input.substr(peg$currPos, 2) === peg$c354) {
                                                                                                                                                                                                                            s0 = peg$c354;
                                                                                                                                                                                                                            peg$currPos += 2;
                                                                                                                                                                                                                          } else {
                                                                                                                                                                                                                            s0 = null;
                                                                                                                                                                                                                            if (peg$silentFails === 0) { peg$fail(peg$c355); }
                                                                                                                                                                                                                          }
                                                                                                                                                                                                                          if (s0 === null) {
                                                                                                                                                                                                                            if (input.substr(peg$currPos, 2) === peg$c356) {
                                                                                                                                                                                                                              s0 = peg$c356;
                                                                                                                                                                                                                              peg$currPos += 2;
                                                                                                                                                                                                                            } else {
                                                                                                                                                                                                                              s0 = null;
                                                                                                                                                                                                                              if (peg$silentFails === 0) { peg$fail(peg$c357); }
                                                                                                                                                                                                                            }
                                                                                                                                                                                                                            if (s0 === null) {
                                                                                                                                                                                                                              if (input.substr(peg$currPos, 2) === peg$c358) {
                                                                                                                                                                                                                                s0 = peg$c358;
                                                                                                                                                                                                                                peg$currPos += 2;
                                                                                                                                                                                                                              } else {
                                                                                                                                                                                                                                s0 = null;
                                                                                                                                                                                                                                if (peg$silentFails === 0) { peg$fail(peg$c359); }
                                                                                                                                                                                                                              }
                                                                                                                                                                                                                              if (s0 === null) {
                                                                                                                                                                                                                                if (input.substr(peg$currPos, 2) === peg$c360) {
                                                                                                                                                                                                                                  s0 = peg$c360;
                                                                                                                                                                                                                                  peg$currPos += 2;
                                                                                                                                                                                                                                } else {
                                                                                                                                                                                                                                  s0 = null;
                                                                                                                                                                                                                                  if (peg$silentFails === 0) { peg$fail(peg$c361); }
                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                if (s0 === null) {
                                                                                                                                                                                                                                  if (input.substr(peg$currPos, 2) === peg$c362) {
                                                                                                                                                                                                                                    s0 = peg$c362;
                                                                                                                                                                                                                                    peg$currPos += 2;
                                                                                                                                                                                                                                  } else {
                                                                                                                                                                                                                                    s0 = null;
                                                                                                                                                                                                                                    if (peg$silentFails === 0) { peg$fail(peg$c363); }
                                                                                                                                                                                                                                  }
                                                                                                                                                                                                                                  if (s0 === null) {
                                                                                                                                                                                                                                    if (input.substr(peg$currPos, 2) === peg$c364) {
                                                                                                                                                                                                                                      s0 = peg$c364;
                                                                                                                                                                                                                                      peg$currPos += 2;
                                                                                                                                                                                                                                    } else {
                                                                                                                                                                                                                                      s0 = null;
                                                                                                                                                                                                                                      if (peg$silentFails === 0) { peg$fail(peg$c365); }
                                                                                                                                                                                                                                    }
                                                                                                                                                                                                                                    if (s0 === null) {
                                                                                                                                                                                                                                      if (input.substr(peg$currPos, 2) === peg$c366) {
                                                                                                                                                                                                                                        s0 = peg$c366;
                                                                                                                                                                                                                                        peg$currPos += 2;
                                                                                                                                                                                                                                      } else {
                                                                                                                                                                                                                                        s0 = null;
                                                                                                                                                                                                                                        if (peg$silentFails === 0) { peg$fail(peg$c367); }
                                                                                                                                                                                                                                      }
                                                                                                                                                                                                                                      if (s0 === null) {
                                                                                                                                                                                                                                        if (input.substr(peg$currPos, 2) === peg$c368) {
                                                                                                                                                                                                                                          s0 = peg$c368;
                                                                                                                                                                                                                                          peg$currPos += 2;
                                                                                                                                                                                                                                        } else {
                                                                                                                                                                                                                                          s0 = null;
                                                                                                                                                                                                                                          if (peg$silentFails === 0) { peg$fail(peg$c369); }
                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                        if (s0 === null) {
                                                                                                                                                                                                                                          if (input.substr(peg$currPos, 2) === peg$c370) {
                                                                                                                                                                                                                                            s0 = peg$c370;
                                                                                                                                                                                                                                            peg$currPos += 2;
                                                                                                                                                                                                                                          } else {
                                                                                                                                                                                                                                            s0 = null;
                                                                                                                                                                                                                                            if (peg$silentFails === 0) { peg$fail(peg$c371); }
                                                                                                                                                                                                                                          }
                                                                                                                                                                                                                                          if (s0 === null) {
                                                                                                                                                                                                                                            if (input.substr(peg$currPos, 2) === peg$c372) {
                                                                                                                                                                                                                                              s0 = peg$c372;
                                                                                                                                                                                                                                              peg$currPos += 2;
                                                                                                                                                                                                                                            } else {
                                                                                                                                                                                                                                              s0 = null;
                                                                                                                                                                                                                                              if (peg$silentFails === 0) { peg$fail(peg$c373); }
                                                                                                                                                                                                                                            }
                                                                                                                                                                                                                                            if (s0 === null) {
                                                                                                                                                                                                                                              if (input.substr(peg$currPos, 2) === peg$c374) {
                                                                                                                                                                                                                                                s0 = peg$c374;
                                                                                                                                                                                                                                                peg$currPos += 2;
                                                                                                                                                                                                                                              } else {
                                                                                                                                                                                                                                                s0 = null;
                                                                                                                                                                                                                                                if (peg$silentFails === 0) { peg$fail(peg$c375); }
                                                                                                                                                                                                                                              }
                                                                                                                                                                                                                                              if (s0 === null) {
                                                                                                                                                                                                                                                if (input.substr(peg$currPos, 2) === peg$c376) {
                                                                                                                                                                                                                                                  s0 = peg$c376;
                                                                                                                                                                                                                                                  peg$currPos += 2;
                                                                                                                                                                                                                                                } else {
                                                                                                                                                                                                                                                  s0 = null;
                                                                                                                                                                                                                                                  if (peg$silentFails === 0) { peg$fail(peg$c377); }
                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                if (s0 === null) {
                                                                                                                                                                                                                                                  if (input.substr(peg$currPos, 2) === peg$c378) {
                                                                                                                                                                                                                                                    s0 = peg$c378;
                                                                                                                                                                                                                                                    peg$currPos += 2;
                                                                                                                                                                                                                                                  } else {
                                                                                                                                                                                                                                                    s0 = null;
                                                                                                                                                                                                                                                    if (peg$silentFails === 0) { peg$fail(peg$c379); }
                                                                                                                                                                                                                                                  }
                                                                                                                                                                                                                                                  if (s0 === null) {
                                                                                                                                                                                                                                                    if (input.substr(peg$currPos, 2) === peg$c380) {
                                                                                                                                                                                                                                                      s0 = peg$c380;
                                                                                                                                                                                                                                                      peg$currPos += 2;
                                                                                                                                                                                                                                                    } else {
                                                                                                                                                                                                                                                      s0 = null;
                                                                                                                                                                                                                                                      if (peg$silentFails === 0) { peg$fail(peg$c381); }
                                                                                                                                                                                                                                                    }
                                                                                                                                                                                                                                                    if (s0 === null) {
                                                                                                                                                                                                                                                      if (input.substr(peg$currPos, 2) === peg$c382) {
                                                                                                                                                                                                                                                        s0 = peg$c382;
                                                                                                                                                                                                                                                        peg$currPos += 2;
                                                                                                                                                                                                                                                      } else {
                                                                                                                                                                                                                                                        s0 = null;
                                                                                                                                                                                                                                                        if (peg$silentFails === 0) { peg$fail(peg$c383); }
                                                                                                                                                                                                                                                      }
                                                                                                                                                                                                                                                      if (s0 === null) {
                                                                                                                                                                                                                                                        if (input.substr(peg$currPos, 2) === peg$c384) {
                                                                                                                                                                                                                                                          s0 = peg$c384;
                                                                                                                                                                                                                                                          peg$currPos += 2;
                                                                                                                                                                                                                                                        } else {
                                                                                                                                                                                                                                                          s0 = null;
                                                                                                                                                                                                                                                          if (peg$silentFails === 0) { peg$fail(peg$c385); }
                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                        if (s0 === null) {
                                                                                                                                                                                                                                                          if (input.substr(peg$currPos, 2) === peg$c386) {
                                                                                                                                                                                                                                                            s0 = peg$c386;
                                                                                                                                                                                                                                                            peg$currPos += 2;
                                                                                                                                                                                                                                                          } else {
                                                                                                                                                                                                                                                            s0 = null;
                                                                                                                                                                                                                                                            if (peg$silentFails === 0) { peg$fail(peg$c387); }
                                                                                                                                                                                                                                                          }
                                                                                                                                                                                                                                                          if (s0 === null) {
                                                                                                                                                                                                                                                            if (input.substr(peg$currPos, 2) === peg$c388) {
                                                                                                                                                                                                                                                              s0 = peg$c388;
                                                                                                                                                                                                                                                              peg$currPos += 2;
                                                                                                                                                                                                                                                            } else {
                                                                                                                                                                                                                                                              s0 = null;
                                                                                                                                                                                                                                                              if (peg$silentFails === 0) { peg$fail(peg$c389); }
                                                                                                                                                                                                                                                            }
                                                                                                                                                                                                                                                            if (s0 === null) {
                                                                                                                                                                                                                                                              if (input.charCodeAt(peg$currPos) === 117) {
                                                                                                                                                                                                                                                                s0 = peg$c390;
                                                                                                                                                                                                                                                                peg$currPos++;
                                                                                                                                                                                                                                                              } else {
                                                                                                                                                                                                                                                                s0 = null;
                                                                                                                                                                                                                                                                if (peg$silentFails === 0) { peg$fail(peg$c391); }
                                                                                                                                                                                                                                                              }
                                                                                                                                                                                                                                                              if (s0 === null) {
                                                                                                                                                                                                                                                                if (input.charCodeAt(peg$currPos) === 115) {
                                                                                                                                                                                                                                                                  s0 = peg$c392;
                                                                                                                                                                                                                                                                  peg$currPos++;
                                                                                                                                                                                                                                                                } else {
                                                                                                                                                                                                                                                                  s0 = null;
                                                                                                                                                                                                                                                                  if (peg$silentFails === 0) { peg$fail(peg$c393); }
                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                if (s0 === null) {
                                                                                                                                                                                                                                                                  if (input.charCodeAt(peg$currPos) === 113) {
                                                                                                                                                                                                                                                                    s0 = peg$c394;
                                                                                                                                                                                                                                                                    peg$currPos++;
                                                                                                                                                                                                                                                                  } else {
                                                                                                                                                                                                                                                                    s0 = null;
                                                                                                                                                                                                                                                                    if (peg$silentFails === 0) { peg$fail(peg$c395); }
                                                                                                                                                                                                                                                                  }
                                                                                                                                                                                                                                                                  if (s0 === null) {
                                                                                                                                                                                                                                                                    if (input.charCodeAt(peg$currPos) === 112) {
                                                                                                                                                                                                                                                                      s0 = peg$c396;
                                                                                                                                                                                                                                                                      peg$currPos++;
                                                                                                                                                                                                                                                                    } else {
                                                                                                                                                                                                                                                                      s0 = null;
                                                                                                                                                                                                                                                                      if (peg$silentFails === 0) { peg$fail(peg$c397); }
                                                                                                                                                                                                                                                                    }
                                                                                                                                                                                                                                                                    if (s0 === null) {
                                                                                                                                                                                                                                                                      if (input.charCodeAt(peg$currPos) === 105) {
                                                                                                                                                                                                                                                                        s0 = peg$c398;
                                                                                                                                                                                                                                                                        peg$currPos++;
                                                                                                                                                                                                                                                                      } else {
                                                                                                                                                                                                                                                                        s0 = null;
                                                                                                                                                                                                                                                                        if (peg$silentFails === 0) { peg$fail(peg$c399); }
                                                                                                                                                                                                                                                                      }
                                                                                                                                                                                                                                                                      if (s0 === null) {
                                                                                                                                                                                                                                                                        if (input.charCodeAt(peg$currPos) === 98) {
                                                                                                                                                                                                                                                                          s0 = peg$c400;
                                                                                                                                                                                                                                                                          peg$currPos++;
                                                                                                                                                                                                                                                                        } else {
                                                                                                                                                                                                                                                                          s0 = null;
                                                                                                                                                                                                                                                                          if (peg$silentFails === 0) { peg$fail(peg$c401); }
                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                                        if (s0 === null) {
                                                                                                                                                                                                                                                                          if (input.charCodeAt(peg$currPos) === 97) {
                                                                                                                                                                                                                                                                            s0 = peg$c402;
                                                                                                                                                                                                                                                                            peg$currPos++;
                                                                                                                                                                                                                                                                          } else {
                                                                                                                                                                                                                                                                            s0 = null;
                                                                                                                                                                                                                                                                            if (peg$silentFails === 0) { peg$fail(peg$c403); }
                                                                                                                                                                                                                                                                          }
                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                                      }
                                                                                                                                                                                                                                                                    }
                                                                                                                                                                                                                                                                  }
                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                              }
                                                                                                                                                                                                                                                            }
                                                                                                                                                                                                                                                          }
                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                      }
                                                                                                                                                                                                                                                    }
                                                                                                                                                                                                                                                  }
                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                              }
                                                                                                                                                                                                                                            }
                                                                                                                                                                                                                                          }
                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                      }
                                                                                                                                                                                                                                    }
                                                                                                                                                                                                                                  }
                                                                                                                                                                                                                                }
                                                                                                                                                                                                                              }
                                                                                                                                                                                                                            }
                                                                                                                                                                                                                          }
                                                                                                                                                                                                                        }
                                                                                                                                                                                                                      }
                                                                                                                                                                                                                    }
                                                                                                                                                                                                                  }
                                                                                                                                                                                                                }
                                                                                                                                                                                                              }
                                                                                                                                                                                                            }
                                                                                                                                                                                                          }
                                                                                                                                                                                                        }
                                                                                                                                                                                                      }
                                                                                                                                                                                                    }
                                                                                                                                                                                                  }
                                                                                                                                                                                                }
                                                                                                                                                                                              }
                                                                                                                                                                                            }
                                                                                                                                                                                          }
                                                                                                                                                                                        }
                                                                                                                                                                                      }
                                                                                                                                                                                    }
                                                                                                                                                                                  }
                                                                                                                                                                                }
                                                                                                                                                                              }
                                                                                                                                                                            }
                                                                                                                                                                          }
                                                                                                                                                                        }
                                                                                                                                                                      }
                                                                                                                                                                    }
                                                                                                                                                                  }
                                                                                                                                                                }
                                                                                                                                                              }
                                                                                                                                                            }
                                                                                                                                                          }
                                                                                                                                                        }
                                                                                                                                                      }
                                                                                                                                                    }
                                                                                                                                                  }
                                                                                                                                                }
                                                                                                                                              }
                                                                                                                                            }
                                                                                                                                          }
                                                                                                                                        }
                                                                                                                                      }
                                                                                                                                    }
                                                                                                                                  }
                                                                                                                                }
                                                                                                                              }
                                                                                                                            }
                                                                                                                          }
                                                                                                                        }
                                                                                                                      }
                                                                                                                    }
                                                                                                                  }
                                                                                                                }
                                                                                                              }
                                                                                                            }
                                                                                                          }
                                                                                                        }
                                                                                                      }
                                                                                                    }
                                                                                                  }
                                                                                                }
                                                                                              }
                                                                                            }
                                                                                          }
                                                                                        }
                                                                                      }
                                                                                    }
                                                                                  }
                                                                                }
                                                                              }
                                                                            }
                                                                          }
                                                                        }
                                                                      }
                                                                    }
                                                                  }
                                                                }
                                                              }
                                                            }
                                                          }
                                                        }
                                                      }
                                                    }
                                                  }
                                                }
                                              }
                                            }
                                          }
                                        }
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
      peg$silentFails--;
      if (s0 === null) {
        s1 = null;
        if (peg$silentFails === 0) { peg$fail(peg$c139); }
      }

      return s0;
    }

    function peg$parseknownEvent() {
      var s0, s1;

      peg$silentFails++;
      if (input.substr(peg$currPos, 10) === peg$c405) {
        s0 = peg$c405;
        peg$currPos += 10;
      } else {
        s0 = null;
        if (peg$silentFails === 0) { peg$fail(peg$c406); }
      }
      if (s0 === null) {
        if (input.substr(peg$currPos, 9) === peg$c407) {
          s0 = peg$c407;
          peg$currPos += 9;
        } else {
          s0 = null;
          if (peg$silentFails === 0) { peg$fail(peg$c408); }
        }
        if (s0 === null) {
          if (input.substr(peg$currPos, 8) === peg$c409) {
            s0 = peg$c409;
            peg$currPos += 8;
          } else {
            s0 = null;
            if (peg$silentFails === 0) { peg$fail(peg$c410); }
          }
          if (s0 === null) {
            if (input.substr(peg$currPos, 11) === peg$c411) {
              s0 = peg$c411;
              peg$currPos += 11;
            } else {
              s0 = null;
              if (peg$silentFails === 0) { peg$fail(peg$c412); }
            }
            if (s0 === null) {
              if (input.substr(peg$currPos, 7) === peg$c413) {
                s0 = peg$c413;
                peg$currPos += 7;
              } else {
                s0 = null;
                if (peg$silentFails === 0) { peg$fail(peg$c414); }
              }
              if (s0 === null) {
                if (input.substr(peg$currPos, 5) === peg$c415) {
                  s0 = peg$c415;
                  peg$currPos += 5;
                } else {
                  s0 = null;
                  if (peg$silentFails === 0) { peg$fail(peg$c416); }
                }
                if (s0 === null) {
                  if (input.substr(peg$currPos, 8) === peg$c417) {
                    s0 = peg$c417;
                    peg$currPos += 8;
                  } else {
                    s0 = null;
                    if (peg$silentFails === 0) { peg$fail(peg$c418); }
                  }
                  if (s0 === null) {
                    if (input.substr(peg$currPos, 9) === peg$c419) {
                      s0 = peg$c419;
                      peg$currPos += 9;
                    } else {
                      s0 = null;
                      if (peg$silentFails === 0) { peg$fail(peg$c420); }
                    }
                    if (s0 === null) {
                      if (input.substr(peg$currPos, 7) === peg$c421) {
                        s0 = peg$c421;
                        peg$currPos += 7;
                      } else {
                        s0 = null;
                        if (peg$silentFails === 0) { peg$fail(peg$c422); }
                      }
                      if (s0 === null) {
                        if (input.substr(peg$currPos, 11) === peg$c423) {
                          s0 = peg$c423;
                          peg$currPos += 11;
                        } else {
                          s0 = null;
                          if (peg$silentFails === 0) { peg$fail(peg$c424); }
                        }
                        if (s0 === null) {
                          if (input.substr(peg$currPos, 5) === peg$c425) {
                            s0 = peg$c425;
                            peg$currPos += 5;
                          } else {
                            s0 = null;
                            if (peg$silentFails === 0) { peg$fail(peg$c426); }
                          }
                          if (s0 === null) {
                            if (input.substr(peg$currPos, 11) === peg$c427) {
                              s0 = peg$c427;
                              peg$currPos += 11;
                            } else {
                              s0 = null;
                              if (peg$silentFails === 0) { peg$fail(peg$c428); }
                            }
                            if (s0 === null) {
                              if (input.substr(peg$currPos, 9) === peg$c429) {
                                s0 = peg$c429;
                                peg$currPos += 9;
                              } else {
                                s0 = null;
                                if (peg$silentFails === 0) { peg$fail(peg$c430); }
                              }
                              if (s0 === null) {
                                if (input.substr(peg$currPos, 7) === peg$c431) {
                                  s0 = peg$c431;
                                  peg$currPos += 7;
                                } else {
                                  s0 = null;
                                  if (peg$silentFails === 0) { peg$fail(peg$c432); }
                                }
                                if (s0 === null) {
                                  if (input.substr(peg$currPos, 8) === peg$c433) {
                                    s0 = peg$c433;
                                    peg$currPos += 8;
                                  } else {
                                    s0 = null;
                                    if (peg$silentFails === 0) { peg$fail(peg$c434); }
                                  }
                                  if (s0 === null) {
                                    if (input.substr(peg$currPos, 10) === peg$c435) {
                                      s0 = peg$c435;
                                      peg$currPos += 10;
                                    } else {
                                      s0 = null;
                                      if (peg$silentFails === 0) { peg$fail(peg$c436); }
                                    }
                                    if (s0 === null) {
                                      if (input.substr(peg$currPos, 10) === peg$c437) {
                                        s0 = peg$c437;
                                        peg$currPos += 10;
                                      } else {
                                        s0 = null;
                                        if (peg$silentFails === 0) { peg$fail(peg$c438); }
                                      }
                                      if (s0 === null) {
                                        if (input.substr(peg$currPos, 6) === peg$c439) {
                                          s0 = peg$c439;
                                          peg$currPos += 6;
                                        } else {
                                          s0 = null;
                                          if (peg$silentFails === 0) { peg$fail(peg$c440); }
                                        }
                                        if (s0 === null) {
                                          if (input.substr(peg$currPos, 5) === peg$c256) {
                                            s0 = peg$c256;
                                            peg$currPos += 5;
                                          } else {
                                            s0 = null;
                                            if (peg$silentFails === 0) { peg$fail(peg$c257); }
                                          }
                                          if (s0 === null) {
                                            if (input.substr(peg$currPos, 6) === peg$c441) {
                                              s0 = peg$c441;
                                              peg$currPos += 6;
                                            } else {
                                              s0 = null;
                                              if (peg$silentFails === 0) { peg$fail(peg$c442); }
                                            }
                                            if (s0 === null) {
                                              if (input.substr(peg$currPos, 9) === peg$c443) {
                                                s0 = peg$c443;
                                                peg$currPos += 9;
                                              } else {
                                                s0 = null;
                                                if (peg$silentFails === 0) { peg$fail(peg$c444); }
                                              }
                                              if (s0 === null) {
                                                if (input.substr(peg$currPos, 4) === peg$c445) {
                                                  s0 = peg$c445;
                                                  peg$currPos += 4;
                                                } else {
                                                  s0 = null;
                                                  if (peg$silentFails === 0) { peg$fail(peg$c446); }
                                                }
                                                if (s0 === null) {
                                                  if (input.substr(peg$currPos, 9) === peg$c447) {
                                                    s0 = peg$c447;
                                                    peg$currPos += 9;
                                                  } else {
                                                    s0 = null;
                                                    if (peg$silentFails === 0) { peg$fail(peg$c448); }
                                                  }
                                                  if (s0 === null) {
                                                    if (input.substr(peg$currPos, 9) === peg$c449) {
                                                      s0 = peg$c449;
                                                      peg$currPos += 9;
                                                    } else {
                                                      s0 = null;
                                                      if (peg$silentFails === 0) { peg$fail(peg$c450); }
                                                    }
                                                    if (s0 === null) {
                                                      if (input.substr(peg$currPos, 8) === peg$c451) {
                                                        s0 = peg$c451;
                                                        peg$currPos += 8;
                                                      } else {
                                                        s0 = null;
                                                        if (peg$silentFails === 0) { peg$fail(peg$c452); }
                                                      }
                                                      if (s0 === null) {
                                                        if (input.substr(peg$currPos, 4) === peg$c453) {
                                                          s0 = peg$c453;
                                                          peg$currPos += 4;
                                                        } else {
                                                          s0 = null;
                                                          if (peg$silentFails === 0) { peg$fail(peg$c454); }
                                                        }
                                                        if (s0 === null) {
                                                          if (input.substr(peg$currPos, 7) === peg$c455) {
                                                            s0 = peg$c455;
                                                            peg$currPos += 7;
                                                          } else {
                                                            s0 = null;
                                                            if (peg$silentFails === 0) { peg$fail(peg$c456); }
                                                          }
                                                        }
                                                      }
                                                    }
                                                  }
                                                }
                                              }
                                            }
                                          }
                                        }
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
      peg$silentFails--;
      if (s0 === null) {
        s1 = null;
        if (peg$silentFails === 0) { peg$fail(peg$c404); }
      }

      return s0;
    }

    function peg$parseINDENT() {
      var s0, s1;

      peg$silentFails++;
      s0 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 61423) {
        s1 = peg$c458;
        peg$currPos++;
      } else {
        s1 = null;
        if (peg$silentFails === 0) { peg$fail(peg$c459); }
      }
      if (s1 !== null) {
        peg$reportedPos = s0;
        s1 = peg$c460();
      }
      if (s1 === null) {
        peg$currPos = s0;
        s0 = s1;
      } else {
        s0 = s1;
      }
      peg$silentFails--;
      if (s0 === null) {
        s1 = null;
        if (peg$silentFails === 0) { peg$fail(peg$c457); }
      }

      return s0;
    }

    function peg$parseDEDENT() {
      var s0, s1;

      peg$silentFails++;
      s0 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 61438) {
        s1 = peg$c462;
        peg$currPos++;
      } else {
        s1 = null;
        if (peg$silentFails === 0) { peg$fail(peg$c463); }
      }
      if (s1 !== null) {
        peg$reportedPos = s0;
        s1 = peg$c460();
      }
      if (s1 === null) {
        peg$currPos = s0;
        s0 = s1;
      } else {
        s0 = s1;
      }
      peg$silentFails--;
      if (s0 === null) {
        s1 = null;
        if (peg$silentFails === 0) { peg$fail(peg$c461); }
      }

      return s0;
    }

    function peg$parseTERM() {
      var s0, s1, s2;

      peg$silentFails++;
      s0 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 10) {
        s1 = peg$c465;
        peg$currPos++;
      } else {
        s1 = null;
        if (peg$silentFails === 0) { peg$fail(peg$c466); }
      }
      if (s1 !== null) {
        if (input.charCodeAt(peg$currPos) === 61439) {
          s2 = peg$c467;
          peg$currPos++;
        } else {
          s2 = null;
          if (peg$silentFails === 0) { peg$fail(peg$c468); }
        }
        if (s2 !== null) {
          s1 = [s1, s2];
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$c2;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c2;
      }
      peg$silentFails--;
      if (s0 === null) {
        s1 = null;
        if (peg$silentFails === 0) { peg$fail(peg$c464); }
      }

      return s0;
    }

    function peg$parse__() {
      var s0, s1;

      peg$silentFails++;
      s0 = [];
      s1 = peg$parsewhitespace();
      if (s1 !== null) {
        while (s1 !== null) {
          s0.push(s1);
          s1 = peg$parsewhitespace();
        }
      } else {
        s0 = peg$c2;
      }
      peg$silentFails--;
      if (s0 === null) {
        s1 = null;
        if (peg$silentFails === 0) { peg$fail(peg$c469); }
      }

      return s0;
    }

    function peg$parse_() {
      var s0, s1;

      peg$silentFails++;
      s0 = [];
      s1 = peg$parsewhitespace();
      while (s1 !== null) {
        s0.push(s1);
        s1 = peg$parsewhitespace();
      }
      peg$silentFails--;
      if (s0 === null) {
        s1 = null;
        if (peg$silentFails === 0) { peg$fail(peg$c470); }
      }

      return s0;
    }

    function peg$parsewhitespace() {
      var s0, s1;

      peg$silentFails++;
      if (peg$c472.test(input.charAt(peg$currPos))) {
        s0 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s0 = null;
        if (peg$silentFails === 0) { peg$fail(peg$c473); }
      }
      peg$silentFails--;
      if (s0 === null) {
        s1 = null;
        if (peg$silentFails === 0) { peg$fail(peg$c471); }
      }

      return s0;
    }

    function peg$parselineChar() {
      var s0, s1, s2;

      s0 = peg$currPos;
      s1 = peg$currPos;
      peg$silentFails++;
      s2 = peg$parseINDENT();
      if (s2 === null) {
        s2 = peg$parseDEDENT();
        if (s2 === null) {
          s2 = peg$parseTERM();
        }
      }
      peg$silentFails--;
      if (s2 === null) {
        s1 = peg$c3;
      } else {
        peg$currPos = s1;
        s1 = peg$c2;
      }
      if (s1 !== null) {
        if (input.length > peg$currPos) {
          s2 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s2 = null;
          if (peg$silentFails === 0) { peg$fail(peg$c84); }
        }
        if (s2 !== null) {
          peg$reportedPos = s0;
          s1 = peg$c85(s2);
          if (s1 === null) {
            peg$currPos = s0;
            s0 = s1;
          } else {
            s0 = s1;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c2;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c2;
      }

      return s0;
    }

    function peg$parselineContent() {
      var s0, s1, s2;

      s0 = peg$currPos;
      s1 = [];
      s2 = peg$parselineChar();
      while (s2 !== null) {
        s1.push(s2);
        s2 = peg$parselineChar();
      }
      if (s1 !== null) {
        s1 = input.substring(s0, peg$currPos);
      }
      s0 = s1;

      return s0;
    }


      var SELF_CLOSING_TAG = {
        area: true,
        base: true,
        br: true,
        col: true,
        command: true,
        embed: true,
        hr: true,
        img: true,
        input: true,
        keygen: true,
        link: true,
        meta: true,
        param: true,
        source: true,
        track: true,
        wbr: true
      };

      // Returns a new MustacheNode with a new preceding param (id).
      function unshiftParam(mustacheNode, helperName, newHashPairs) {

        var hash = mustacheNode.hash;

        // Merge hash.
        if(newHashPairs) {
          hash = hash || new Handlebars.AST.HashNode([]);

          for(var i = 0; i < newHashPairs.length; ++i) {
            hash.pairs.push(newHashPairs[i]);
          }
        }

        var params = [mustacheNode.id].concat(mustacheNode.params);
        params.unshift(new Handlebars.AST.IdNode([helperName]));
        return new Handlebars.AST.MustacheNode(params, hash, !mustacheNode.escaped);
      }


    peg$result = peg$startRuleFunction();

    if (peg$result !== null && peg$currPos === input.length) {
      return peg$result;
    } else {
      peg$cleanupExpected(peg$maxFailExpected);
      peg$reportedPos = Math.max(peg$currPos, peg$maxFailPos);

      throw new SyntaxError(
        peg$maxFailExpected,
        peg$reportedPos < input.length ? input.charAt(peg$reportedPos) : null,
        peg$reportedPos,
        peg$computePosDetails(peg$reportedPos).line,
        peg$computePosDetails(peg$reportedPos).column
      );
    }
  }

  return {
    SyntaxError: SyntaxError,
    parse      : parse
  };
})();

//exports = Emblem.Parser;
;
// lib/compiler.js
var Emblem, Handlebars,
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

//

//

Emblem.throwCompileError = function(line, msg) {
  throw new Error("Emblem syntax error, line " + line + ": " + msg);
};

Emblem.parse = function(string) {
  var line, lines, msg, processed;
  try {
    processed = Emblem.Preprocessor.processSync(string);
    return new Handlebars.AST.ProgramNode(Emblem.Parser.parse(processed), []);
  } catch (e) {
    if (e instanceof Emblem.Parser.SyntaxError) {
      lines = string.split("\n");
      line = lines[e.line - 1];
      msg = "" + e.message + "\n" + line + "\n";
      msg += new Array(e.column).join("-");
      msg += "^";
      return Emblem.throwCompileError(e.line, msg);
    } else {
      throw e;
    }
  }
};

Emblem.precompileRaw = function(string, options) {
  var ast, environment;
  if (options == null) {
    options = {};
  }
  if (typeof string !== 'string') {
    throw new Handlebars.Exception("You must pass a string to Emblem.precompile. You passed " + string);
  }
  if (__indexOf.call(options, 'data') < 0) {
    options.data = true;
  }
  ast = Emblem.parse(string);
  environment = new Handlebars.Compiler().compile(ast, options);
  return new Handlebars.JavaScriptCompiler().compile(environment, options);
};

Emblem.compileRaw = function(string, options) {
  var compile, compiled;
  if (options == null) {
    options = {};
  }
  if (typeof string !== 'string') {
    throw new Handlebars.Exception("You must pass a string to Emblem.compile. You passed " + string);
  }
  if (__indexOf.call(options, 'data') < 0) {
    options.data = true;
  }
  compiled = null;
  compile = function() {
    var ast, environment, templateSpec;
    ast = Emblem.parse(string);
    environment = new Handlebars.Compiler().compile(ast, options);
    templateSpec = new Handlebars.JavaScriptCompiler().compile(environment, options, void 0, true);
    return Handlebars.template(templateSpec);
  };
  return function(context, options) {
    if (!compiled) {
      compiled = compile();
    }
    return compiled.call(this, context, options);
  };
};

Emblem.precompile = Emblem.precompileRaw;

Emblem.compile = Emblem.compileRaw;

Emblem.precompileEmber = function(string) {
  var ast, environment, options;
  ast = Emblem.parse(string);
  options = {
    knownHelpers: {
      action: true,
      unbound: true,
      bindAttr: true,
      template: true,
      view: true,
      _triageMustache: true
    },
    data: true,
    stringParams: true
  };
  environment = new Ember.Handlebars.Compiler().compile(ast, options);
  return new Ember.Handlebars.JavaScriptCompiler().compile(environment, options, void 0, true);
};

Emblem.compileEmber = function(string) {
  var ast, environment, options, templateSpec;
  ast = Emblem.parse(string);
  options = {
    data: true,
    stringParams: true
  };
  environment = new Ember.Handlebars.Compiler().compile(ast, options);
  templateSpec = new Ember.Handlebars.JavaScriptCompiler().compile(environment, options, void 0, true);
  return Ember.Handlebars.template(templateSpec);
};
;
// lib/preprocessor.js
var Emblem, Preprocessor, StringScanner;

//

//

Emblem.Preprocessor = Preprocessor = (function() {
  var DEDENT, INDENT, TERM, anyWhitespaceAndNewlinesTouchingEOF, any_whitespaceFollowedByNewlines_, processInput, ws;

  ws = '\\t\\x0B\\f \\xA0\\u1680\\u180E\\u2000-\\u200A\\u202F\\u205F\\u3000\\uFEFF';

  INDENT = '\uEFEF';

  DEDENT = '\uEFFE';

  TERM = '\uEFFF';

  anyWhitespaceAndNewlinesTouchingEOF = RegExp("[" + ws + "\\n]*$");

  any_whitespaceFollowedByNewlines_ = RegExp("(?:[" + ws + "]*\\n)+");

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
    if (this.StringScanner) {
      this.ss = new this.StringScanner('');
    } else if (Emblem.StringScanner) {
      this.ss = new Emblem.StringScanner('');
    } else {
      this.ss = new StringScanner('');
    }
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
      var b, indent, lines, message, newIndent, tok;
      if (!isEnd) {
        this.ss.concat(data);
        this.discard(any_whitespaceFollowedByNewlines_);
      }
      while (!this.ss.eos()) {
        switch (this.context.peek()) {
          case null:
          case INDENT:
            if (this.ss.bol() || this.discard(any_whitespaceFollowedByNewlines_)) {
              if (this.base != null) {
                if ((this.discard(this.base)) == null) {
                  throw new Error("inconsistent base indentation");
                }
              } else {
                b = this.discard(RegExp("[" + ws + "]*"));
                this.base = RegExp("" + b);
              }
              if (this.indents.length === 0) {
                if (newIndent = this.discard(RegExp("[" + ws + "]+"))) {
                  this.indents.push(newIndent);
                  this.context.observe(INDENT);
                  this.p(INDENT);
                }
              } else {
                indent = this.indents[this.indents.length - 1];
                if (newIndent = this.discard(RegExp("(" + indent + "[" + ws + "]+)"))) {
                  this.indents.push(newIndent);
                  this.context.observe(INDENT);
                  this.p(INDENT);
                } else {
                  while (this.indents.length) {
                    indent = this.indents[this.indents.length - 1];
                    if (this.discard(RegExp("(?:" + indent + ")"))) {
                      break;
                    }
                    this.context.observe(DEDENT);
                    this.p(DEDENT);
                    this.indents.pop();
                  }
                  if (this.ss.check(RegExp("[" + ws + "]+"))) {
                    lines = this.ss.str.substr(0, this.ss.pos).split(/\n/) || [''];
                    message = "Invalid indentation";
                    Emblem.throwCompileError(lines.length, message);
                  }
                }
              }
            }
            this.scan(/[^\n\\]+/);
            if (tok = this.discard(/\//)) {
              this.context.observe(tok);
            } else if (this.scan(/\n/)) {
              this.p("" + TERM);
            }
            this.discard(any_whitespaceFollowedByNewlines_);
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

  Preprocessor.processSync = function(input) {
    var pre;
    input += "\n";
    pre = new Preprocessor;
    pre.processData(input);
    pre.processEnd();
    return pre.output;
  };

  return Preprocessor;

})();
;
// lib/emberties.js
var ENV, Emblem, _base;

//

Emblem.bootstrap = function(ctx) {
  if (ctx == null) {
    ctx = Ember.$(document);
  }
  Emblem.precompile = Emblem.precompileEmber;
  Emblem.compile = Emblem.compileEmber;
  return Ember.$('script[type="text/x-emblem"]', ctx).each(function() {
    var script, templateName;
    script = Ember.$(this);
    templateName = script.attr('data-template-name') || script.attr('id') || 'application';
    Ember.TEMPLATES[templateName] = Emblem.compile(script.html());
    return script.remove();
  });
};

this.ENV || (this.ENV = {});

ENV = this.ENV;

ENV.EMBER_LOAD_HOOKS || (ENV.EMBER_LOAD_HOOKS = {});

(_base = ENV.EMBER_LOAD_HOOKS).application || (_base.application = []);

ENV.EMBER_LOAD_HOOKS.application.push(function() {
  return Emblem.bootstrap();
});
;

    root.Handlebars = Handlebars;
    root.Emblem = Emblem;

  }(this));
