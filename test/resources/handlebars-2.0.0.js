/* exported Handlebars */
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory();
    } else {
        root.Handlebars = factory();
    }
}(this, function () {
// handlebars\safe-string.js
    var __module4__ = (function() {
        "use strict";
        var __exports__;
        // Build out our basic SafeString type
        function SafeString(string) {
            this.string = string;
        }

        SafeString.prototype.toString = SafeString.prototype.toHTML = function() {
            return "" + this.string;
        };

        __exports__ = SafeString;
        return __exports__;
    })();

// handlebars\utils.js
    var __module3__ = (function(__dependency1__) {
        "use strict";
        var __exports__ = {};
        /*jshint -W004 */
        var SafeString = __dependency1__;


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

        function escapeChar(chr) {
            return escape[chr];
        }

        function extend(obj /* , ...source */) {
            for (var i = 1; i < arguments.length; i++) {
                for (var key in arguments[i]) {
                    if (Object.prototype.hasOwnProperty.call(arguments[i], key)) {
                        obj[key] = arguments[i][key];
                    }
                }
            }

            return obj;
        }
        __exports__.extend = extend;
        var toString = Object.prototype.toString;
        __exports__.toString = toString;

        // Sourced from lodash
        // https://github.com/bestiejs/lodash/blob/master/LICENSE.txt
        var isFunction = function(value) {
            return typeof value === 'function';
        };
        // fallback for older versions of Chrome and Safari
        /* istanbul ignore next */
        if (isFunction(/x/)) {
            isFunction = function(value) {
                return typeof value === 'function' && toString.call(value) === '[object Function]';
            };
        }
        var isFunction;
        __exports__.isFunction = isFunction;

        /* istanbul ignore next */
        var isArray = Array.isArray || function(value) {
                return (value && typeof value === 'object') ? toString.call(value) === '[object Array]' : false;
            };
        __exports__.isArray = isArray;


        function escapeExpression(string) {
            // don't escape SafeStrings, since they're already safe
            if (string && string.toHTML) {
                return string.toHTML();
            } else if (string == null) {
                return "";
            } else if (!string) {
                return string + '';
            }

            // Force a string conversion as this will be done by the append regardless and
            // the regex test will do this transparently behind the scenes, causing issues if
            // an object's to string has escaped characters in it.
            string = "" + string;

            if(!possible.test(string)) { return string; }
            return string.replace(badChars, escapeChar);
        }
        __exports__.escapeExpression = escapeExpression;
        function isEmpty(value) {
            if (!value && value !== 0) {
                return true;
            } else if (isArray(value) && value.length === 0) {
                return true;
            } else {
                return false;
            }
        }
        __exports__.isEmpty = isEmpty;
        function appendContextPath(contextPath, id) {
            return (contextPath ? contextPath + '.' : '') + id;
        }
        __exports__.appendContextPath = appendContextPath;
        return __exports__;
    })(__module4__);

// handlebars\exception.js
    var __module5__ = (function() {
        "use strict";
        var __exports__;

        var errorProps = ['description', 'fileName', 'lineNumber', 'message', 'name', 'number', 'stack'];

        function Exception(message, node) {
            var loc = node && node.loc,
                line,
                column;
            if (loc) {
                line = loc.start.line;
                column = loc.start.column;

                message += ' - ' + line + ':' + column;
            }

            var tmp = Error.prototype.constructor.call(this, message);

            // Unfortunately errors are not enumerable in Chrome (at least), so `for prop in tmp` doesn't work.
            for (var idx = 0; idx < errorProps.length; idx++) {
                this[errorProps[idx]] = tmp[errorProps[idx]];
            }

            if (loc) {
                this.lineNumber = line;
                this.column = column;
            }
        }

        Exception.prototype = new Error();

        __exports__ = Exception;
        return __exports__;
    })();

// handlebars\base.js
    var __module2__ = (function(__dependency1__, __dependency2__) {
        "use strict";
        var __exports__ = {};
        var Utils = __dependency1__;

        var Exception = __dependency2__;


        var VERSION = "2.0.0";
        __exports__.VERSION = VERSION;
        var COMPILER_REVISION = 6;
        __exports__.COMPILER_REVISION = COMPILER_REVISION;

        var REVISION_CHANGES = {
            1: '<= 1.0.rc.2', // 1.0.rc.2 is actually rev2 but doesn't report it
            2: '== 1.0.0-rc.3',
            3: '== 1.0.0-rc.4',
            4: '== 1.x.x',
            5: '== 2.0.0-alpha.x',
            6: '>= 2.0.0-beta.1'
        };
        __exports__.REVISION_CHANGES = REVISION_CHANGES;

        var isArray = Utils.isArray,
            isFunction = Utils.isFunction,
            toString = Utils.toString,
            objectType = '[object Object]';

        function HandlebarsEnvironment(helpers, partials) {
            this.helpers = helpers || {};
            this.partials = partials || {};

            registerDefaultHelpers(this);
        }
        __exports__.HandlebarsEnvironment = HandlebarsEnvironment;
        HandlebarsEnvironment.prototype = {
            constructor: HandlebarsEnvironment,

            logger: logger,
            log: log,

            registerHelper: function(name, fn) {
                if (toString.call(name) === objectType) {
                    if (fn) { throw new Exception('Arg not supported with multiple helpers'); }
                    Utils.extend(this.helpers, name);
                } else {
                    this.helpers[name] = fn;
                }
            },
            unregisterHelper: function(name) {
                delete this.helpers[name];
            },

            registerPartial: function(name, partial) {
                if (toString.call(name) === objectType) {
                    Utils.extend(this.partials,  name);
                } else {
                    if (typeof partial === 'undefined') {
                        throw new Exception('Attempting to register a partial as undefined');
                    }
                    this.partials[name] = partial;
                }
            },
            unregisterPartial: function(name) {
                delete this.partials[name];
            }
        };

        function registerDefaultHelpers(instance) {
            instance.registerHelper('helperMissing', function(/* [args, ]options */) {
                if(arguments.length === 1) {
                    // A missing field in a {{foo}} constuct.
                    return undefined;
                } else {
                    // Someone is actually trying to call something, blow up.
                    throw new Exception("Missing helper: '" + arguments[arguments.length-1].name + "'");
                }
            });

            instance.registerHelper('blockHelperMissing', function(context, options) {
                var inverse = options.inverse,
                    fn = options.fn;

                if(context === true) {
                    return fn(this);
                } else if(context === false || context == null) {
                    return inverse(this);
                } else if (isArray(context)) {
                    if(context.length > 0) {
                        if (options.ids) {
                            options.ids = [options.name];
                        }

                        return instance.helpers.each(context, options);
                    } else {
                        return inverse(this);
                    }
                } else {
                    if (options.data && options.ids) {
                        var data = createFrame(options.data);
                        data.contextPath = Utils.appendContextPath(options.data.contextPath, options.name);
                        options = {data: data};
                    }

                    return fn(context, options);
                }
            });

            instance.registerHelper('each', function(context, options) {
                if (!options) {
                    throw new Exception('Must pass iterator to #each');
                }

                var fn = options.fn, inverse = options.inverse;
                var i = 0, ret = "", data;

                var contextPath;
                if (options.data && options.ids) {
                    contextPath = Utils.appendContextPath(options.data.contextPath, options.ids[0]) + '.';
                }

                if (isFunction(context)) { context = context.call(this); }

                if (options.data) {
                    data = createFrame(options.data);
                }

                function execIteration(key, i, last) {
                    if (data) {
                        data.key = key;
                        data.index = i;
                        data.first = i === 0;
                        data.last  = !!last;

                        if (contextPath) {
                            data.contextPath = contextPath + key;
                        }
                    }
                    ret = ret + fn(context[key], { data: data });
                }

                if(context && typeof context === 'object') {
                    if (isArray(context)) {
                        for(var j = context.length; i<j; i++) {
                            execIteration(i, i, i === context.length-1);
                        }
                    } else {
                        var priorKey;

                        for(var key in context) {
                            if(context.hasOwnProperty(key)) {
                                // We're running the iterations one step out of sync so we can detect
                                // the last iteration without have to scan the object twice and create
                                // an itermediate keys array.
                                if (priorKey) {
                                    execIteration(priorKey, i-1);
                                }
                                priorKey = key;
                                i++;
                            }
                        }
                        if (priorKey) {
                            execIteration(priorKey, i-1, true);
                        }
                    }
                }

                if(i === 0){
                    ret = inverse(this);
                }

                return ret;
            });

            instance.registerHelper('if', function(conditional, options) {
                if (isFunction(conditional)) { conditional = conditional.call(this); }

                // Default behavior is to render the positive path if the value is truthy and not empty.
                // The `includeZero` option may be set to treat the condtional as purely not empty based on the
                // behavior of isEmpty. Effectively this determines if 0 is handled by the positive path or negative.
                if ((!options.hash.includeZero && !conditional) || Utils.isEmpty(conditional)) {
                    return options.inverse(this);
                } else {
                    return options.fn(this);
                }
            });

            instance.registerHelper('unless', function(conditional, options) {
                return instance.helpers['if'].call(this, conditional, {fn: options.inverse, inverse: options.fn, hash: options.hash});
            });

            instance.registerHelper('with', function(context, options) {
                if (isFunction(context)) { context = context.call(this); }

                var fn = options.fn;

                if (!Utils.isEmpty(context)) {
                    if (options.data && options.ids) {
                        var data = createFrame(options.data);
                        data.contextPath = Utils.appendContextPath(options.data.contextPath, options.ids[0]);
                        options = {data:data};
                    }

                    return fn(context, options);
                } else {
                    return options.inverse(this);
                }
            });

            instance.registerHelper('log', function(message, options) {
                var level = options.data && options.data.level != null ? parseInt(options.data.level, 10) : 1;
                instance.log(level, message);
            });

            instance.registerHelper('lookup', function(obj, field) {
                return obj && obj[field];
            });
        }

        var logger = {
            methodMap: { 0: 'debug', 1: 'info', 2: 'warn', 3: 'error' },

            // State enum
            DEBUG: 0,
            INFO: 1,
            WARN: 2,
            ERROR: 3,
            level: 3,

            // Can be overridden in the host environment
            log: function(level, message) {
                if (logger.level <= level) {
                    var method = logger.methodMap[level];
                    if (typeof console !== 'undefined' && console[method]) {
                        console[method].call(console, message);
                    }
                }
            }
        };
        __exports__.logger = logger;

        var log = logger.log;
        __exports__.log = log;

        var createFrame = function(object) {
            var frame = Utils.extend({}, object);
            frame._parent = object;
            return frame;
        };
        __exports__.createFrame = createFrame;
        return __exports__;
    })(__module3__, __module5__);

// handlebars\runtime.js
    var __module6__ = (function(__dependency1__, __dependency2__, __dependency3__) {
        "use strict";
        var __exports__ = {};
        var Utils = __dependency1__;

        var Exception = __dependency2__;

        var COMPILER_REVISION = __dependency3__.COMPILER_REVISION;
        var REVISION_CHANGES = __dependency3__.REVISION_CHANGES;
        var createFrame = __dependency3__.createFrame;


        function checkRevision(compilerInfo) {
            var compilerRevision = compilerInfo && compilerInfo[0] || 1,
                currentRevision = COMPILER_REVISION;

            if (compilerRevision !== currentRevision) {
                if (compilerRevision < currentRevision) {
                    var runtimeVersions = REVISION_CHANGES[currentRevision],
                        compilerVersions = REVISION_CHANGES[compilerRevision];
                    throw new Exception("Template was precompiled with an older version of Handlebars than the current runtime. "+
                    "Please update your precompiler to a newer version ("+runtimeVersions+") or downgrade your runtime to an older version ("+compilerVersions+").");
                } else {
                    // Use the embedded version info since the runtime doesn't know about this revision yet
                    throw new Exception("Template was precompiled with a newer version of Handlebars than the current runtime. "+
                    "Please update your runtime to a newer version ("+compilerInfo[1]+").");
                }
            }
        }
        __exports__.checkRevision = checkRevision;
        // TODO: Remove this line and break up compilePartial

        function template(templateSpec, env) {
            /* istanbul ignore next */
            if (!env) {
                throw new Exception("No environment passed to template");
            }
            if (!templateSpec || !templateSpec.main) {
                throw new Exception('Unknown template object: ' + typeof templateSpec);
            }

            // Note: Using env.VM references rather than local var references throughout this section to allow
            // for external users to override these as psuedo-supported APIs.
            env.VM.checkRevision(templateSpec.compiler);

            var invokePartialWrapper = function(partial, context, options) {
                if (options.hash) {
                    context = Utils.extend({}, context, options.hash);
                }
                if (!partial) {
                    partial = options.partials[options.name];
                }

                var result = env.VM.invokePartial.call(this, partial, context, options);

                if (result == null && env.compile) {
                    options.partials[options.name] = env.compile(partial, templateSpec.compilerOptions, env);
                    result = options.partials[options.name](context, options);
                }
                if (result != null) {
                    if (options.indent) {
                        var lines = result.split('\n');
                        for (var i = 0, l = lines.length; i < l; i++) {
                            if (!lines[i] && i + 1 === l) {
                                break;
                            }

                            lines[i] = options.indent + lines[i];
                        }
                        result = lines.join('\n');
                    }
                    return result;
                } else {
                    throw new Exception("The partial " + options.name + " could not be compiled when running in runtime-only mode");
                }
            };

            // Just add water
            var container = {
                lookup: function(depths, name) {
                    var len = depths.length;
                    for (var i = 0; i < len; i++) {
                        if (depths[i] && depths[i][name] != null) {
                            return depths[i][name];
                        }
                    }
                },
                lambda: function(current, context) {
                    return typeof current === 'function' ? current.call(context) : current;
                },

                escapeExpression: Utils.escapeExpression,
                invokePartial: invokePartialWrapper,

                fn: function(i) {
                    return templateSpec[i];
                },

                programs: [],
                program: function(i, data, depths) {
                    var programWrapper = this.programs[i],
                        fn = this.fn(i);
                    if (data || depths) {
                        programWrapper = program(this, i, fn, data, depths);
                    } else if (!programWrapper) {
                        programWrapper = this.programs[i] = program(this, i, fn);
                    }
                    return programWrapper;
                },

                data: function(data, depth) {
                    while (data && depth--) {
                        data = data._parent;
                    }
                    return data;
                },
                merge: function(param, common) {
                    var ret = param || common;

                    if (param && common && (param !== common)) {
                        ret = Utils.extend({}, common, param);
                    }

                    return ret;
                },

                noop: env.VM.noop,
                compilerInfo: templateSpec.compiler
            };

            var ret = function(context, options) {
                options = options || {};
                var data = options.data;

                ret._setup(options);
                if (!options.partial && templateSpec.useData) {
                    data = initData(context, data);
                }
                var depths;
                if (templateSpec.useDepths) {
                    depths = options.depths ? [context].concat(options.depths) : [context];
                }

                return templateSpec.main.call(container, context, container.helpers, container.partials, data, depths);
            };
            ret.isTop = true;

            ret._setup = function(options) {
                if (!options.partial) {
                    container.helpers = container.merge(options.helpers, env.helpers);

                    if (templateSpec.usePartial) {
                        container.partials = container.merge(options.partials, env.partials);
                    }
                } else {
                    container.helpers = options.helpers;
                    container.partials = options.partials;
                }
            };

            ret._child = function(i, data, depths) {
                if (templateSpec.useDepths && !depths) {
                    throw new Exception('must pass parent depths');
                }

                return program(container, i, templateSpec[i], data, depths);
            };
            return ret;
        }
        __exports__.template = template;
        function program(container, i, fn, data, depths) {
            var prog = function(context, options) {
                options = options || {};

                return fn.call(container, context, container.helpers, container.partials, options.data || data, depths && [context].concat(depths));
            };
            prog.program = i;
            prog.depth = depths ? depths.length : 0;
            return prog;
        }
        __exports__.program = program;
        function invokePartial(partial, context, options) {
            options.partial = true;

            if(partial === undefined) {
                throw new Exception("The partial " + options.name + " could not be found");
            } else if(partial instanceof Function) {
                return partial(context, options);
            }
        }
        __exports__.invokePartial = invokePartial;
        function noop() { return ""; }
        __exports__.noop = noop;
        function initData(context, data) {
            if (!data || !('root' in data)) {
                data = data ? createFrame(data) : {};
                data.root = context;
            }
            return data;
        }
        return __exports__;
    })(__module3__, __module5__, __module2__);

// handlebars.runtime.js
    var __module1__ = (function(__dependency1__, __dependency2__, __dependency3__, __dependency4__, __dependency5__) {
        "use strict";
        var __exports__;
        /*globals Handlebars: true */
        var base = __dependency1__;


        // Each of these augment the Handlebars object. No need to setup here.
        // (This is done to easily share code between commonjs and browse envs)
        var SafeString = __dependency2__;

        var Exception = __dependency3__;

        var Utils = __dependency4__;

        var runtime = __dependency5__;


        // For compatibility and usage outside of module systems, make the Handlebars object a namespace
        var create = function() {
            var hb = new base.HandlebarsEnvironment();

            Utils.extend(hb, base);
            hb.SafeString = SafeString;
            hb.Exception = Exception;
            hb.Utils = Utils;
            hb.escapeExpression = Utils.escapeExpression;

            hb.VM = runtime;
            hb.template = function(spec) {
                return runtime.template(spec, hb);
            };

            return hb;
        };

        var Handlebars = create();
        Handlebars.create = create;

        /*jshint -W040 */
        var root = typeof global !== 'undefined' ? global : window,
            $Handlebars = root.Handlebars;
        Handlebars.noConflict = function() {
            if (root.Handlebars === Handlebars) {
                root.Handlebars = $Handlebars;
            }
        };

        Handlebars['default'] = Handlebars;

        __exports__ = Handlebars;
        return __exports__;
    })(__module2__, __module4__, __module5__, __module3__, __module6__);

// handlebars\compiler\ast.js
    var __module7__ = (function(__dependency1__) {
        "use strict";
        var __exports__;
        var Exception = __dependency1__;


        var AST = {
            Program: function(statements, blockParams, strip, locInfo) {
                this.loc = locInfo;
                this.type = 'Program';
                this.body = statements;

                this.blockParams = blockParams;
                this.strip = strip;
            },

            MustacheStatement: function(sexpr, escaped, strip, locInfo) {
                this.loc = locInfo;
                this.type = 'MustacheStatement';

                this.sexpr = sexpr;
                this.escaped = escaped;

                this.strip = strip;
            },

            BlockStatement: function(sexpr, program, inverse, openStrip, inverseStrip, closeStrip, locInfo) {
                this.loc = locInfo;

                this.type = 'BlockStatement';
                this.sexpr = sexpr;
                this.program  = program;
                this.inverse  = inverse;

                this.openStrip = openStrip;
                this.inverseStrip = inverseStrip;
                this.closeStrip = closeStrip;
            },

            PartialStatement: function(sexpr, strip, locInfo) {
                this.loc = locInfo;
                this.type = 'PartialStatement';
                this.sexpr = sexpr;
                this.indent = '';

                this.strip = strip;
            },

            ContentStatement: function(string, locInfo) {
                this.loc = locInfo;
                this.type = 'ContentStatement';
                this.original = this.value = string;
            },

            CommentStatement: function(comment, strip, locInfo) {
                this.loc = locInfo;
                this.type = 'CommentStatement';
                this.value = comment;

                this.strip = strip;
            },

            SubExpression: function(path, params, hash, locInfo) {
                this.loc = locInfo;

                this.type = 'SubExpression';
                this.path = path;
                this.params = params || [];
                this.hash = hash;
            },

            PathExpression: function(data, depth, parts, original, locInfo) {
                this.loc = locInfo;
                this.type = 'PathExpression';

                this.data = data;
                this.original = original;
                this.parts    = parts;
                this.depth    = depth;
            },

            StringLiteral: function(string, locInfo) {
                this.loc = locInfo;
                this.type = 'StringLiteral';
                this.original =
                    this.value = string;
            },

            NumberLiteral: function(number, locInfo) {
                this.loc = locInfo;
                this.type = 'NumberLiteral';
                this.original =
                    this.value = Number(number);
            },

            BooleanLiteral: function(bool, locInfo) {
                this.loc = locInfo;
                this.type = 'BooleanLiteral';
                this.original =
                    this.value = bool === 'true';
            },

            Hash: function(pairs, locInfo) {
                this.loc = locInfo;
                this.type = 'Hash';
                this.pairs = pairs;
            },
            HashPair: function(key, value, locInfo) {
                this.loc = locInfo;
                this.type = 'HashPair';
                this.key = key;
                this.value = value;
            }
        };


        // Must be exported as an object rather than the root of the module as the jison lexer
        // most modify the object to operate properly.
        __exports__ = AST;
        return __exports__;
    })(__module5__);

// handlebars\compiler\parser.js
    var __module9__ = (function() {
        "use strict";
        var __exports__;
        /* jshint ignore:start */
        /* istanbul ignore next */
        /* Jison generated parser */
        var handlebars = (function(){
            var parser = {trace: function trace() { },
                yy: {},
                symbols_: {"error":2,"root":3,"program":4,"EOF":5,"program_repetition0":6,"statement":7,"mustache":8,"block":9,"rawBlock":10,"partial":11,"content":12,"COMMENT":13,"CONTENT":14,"openRawBlock":15,"END_RAW_BLOCK":16,"OPEN_RAW_BLOCK":17,"sexpr":18,"CLOSE_RAW_BLOCK":19,"openBlock":20,"block_option0":21,"closeBlock":22,"openInverse":23,"block_option1":24,"OPEN_BLOCK":25,"openBlock_option0":26,"CLOSE":27,"OPEN_INVERSE":28,"openInverse_option0":29,"openInverseChain":30,"OPEN_INVERSE_CHAIN":31,"openInverseChain_option0":32,"inverseAndProgram":33,"INVERSE":34,"inverseChain":35,"inverseChain_option0":36,"OPEN_ENDBLOCK":37,"path":38,"OPEN":39,"OPEN_UNESCAPED":40,"CLOSE_UNESCAPED":41,"OPEN_PARTIAL":42,"helperName":43,"sexpr_repetition0":44,"sexpr_option0":45,"dataName":46,"param":47,"STRING":48,"NUMBER":49,"BOOLEAN":50,"OPEN_SEXPR":51,"CLOSE_SEXPR":52,"hash":53,"hash_repetition_plus0":54,"hashSegment":55,"ID":56,"EQUALS":57,"blockParams":58,"OPEN_BLOCK_PARAMS":59,"blockParams_repetition_plus0":60,"CLOSE_BLOCK_PARAMS":61,"DATA":62,"pathSegments":63,"SEP":64,"$accept":0,"$end":1},
                terminals_: {2:"error",5:"EOF",13:"COMMENT",14:"CONTENT",16:"END_RAW_BLOCK",17:"OPEN_RAW_BLOCK",19:"CLOSE_RAW_BLOCK",25:"OPEN_BLOCK",27:"CLOSE",28:"OPEN_INVERSE",31:"OPEN_INVERSE_CHAIN",34:"INVERSE",37:"OPEN_ENDBLOCK",39:"OPEN",40:"OPEN_UNESCAPED",41:"CLOSE_UNESCAPED",42:"OPEN_PARTIAL",48:"STRING",49:"NUMBER",50:"BOOLEAN",51:"OPEN_SEXPR",52:"CLOSE_SEXPR",56:"ID",57:"EQUALS",59:"OPEN_BLOCK_PARAMS",61:"CLOSE_BLOCK_PARAMS",62:"DATA",64:"SEP"},
                productions_: [0,[3,2],[4,1],[7,1],[7,1],[7,1],[7,1],[7,1],[7,1],[12,1],[10,3],[15,3],[9,4],[9,4],[20,4],[23,4],[30,4],[33,2],[35,3],[35,1],[22,3],[8,3],[8,3],[11,3],[18,3],[18,1],[47,1],[47,1],[47,1],[47,1],[47,1],[47,3],[53,1],[55,3],[58,3],[43,1],[43,1],[43,1],[46,2],[38,1],[63,3],[63,1],[6,0],[6,2],[21,0],[21,1],[24,0],[24,1],[26,0],[26,1],[29,0],[29,1],[32,0],[32,1],[36,0],[36,1],[44,0],[44,2],[45,0],[45,1],[54,1],[54,2],[60,1],[60,2]],
                performAction: function anonymous(yytext,yyleng,yylineno,yy,yystate,$$,_$) {

                    var $0 = $$.length - 1;
                    switch (yystate) {
                        case 1: return $$[$0-1];
                            break;
                        case 2:this.$ = new yy.Program($$[$0], null, {}, yy.locInfo(this._$));
                            break;
                        case 3:this.$ = $$[$0];
                            break;
                        case 4:this.$ = $$[$0];
                            break;
                        case 5:this.$ = $$[$0];
                            break;
                        case 6:this.$ = $$[$0];
                            break;
                        case 7:this.$ = $$[$0];
                            break;
                        case 8:this.$ = new yy.CommentStatement(yy.stripComment($$[$0]), yy.stripFlags($$[$0], $$[$0]), yy.locInfo(this._$));
                            break;
                        case 9:this.$ = new yy.ContentStatement($$[$0], yy.locInfo(this._$));
                            break;
                        case 10:this.$ = yy.prepareRawBlock($$[$0-2], $$[$0-1], $$[$0], this._$);
                            break;
                        case 11:this.$ = { sexpr: $$[$0-1] };
                            break;
                        case 12:this.$ = yy.prepareBlock($$[$0-3], $$[$0-2], $$[$0-1], $$[$0], false, this._$);
                            break;
                        case 13:this.$ = yy.prepareBlock($$[$0-3], $$[$0-2], $$[$0-1], $$[$0], true, this._$);
                            break;
                        case 14:this.$ = { sexpr: $$[$0-2], blockParams: $$[$0-1], strip: yy.stripFlags($$[$0-3], $$[$0]) };
                            break;
                        case 15:this.$ = { sexpr: $$[$0-2], blockParams: $$[$0-1], strip: yy.stripFlags($$[$0-3], $$[$0]) };
                            break;
                        case 16:this.$ = { sexpr: $$[$0-2], blockParams: $$[$0-1], strip: yy.stripFlags($$[$0-3], $$[$0]) };
                            break;
                        case 17:this.$ = { strip: yy.stripFlags($$[$0-1], $$[$0-1]), program: $$[$0] };
                            break;
                        case 18:
                            var inverse = yy.prepareBlock($$[$0-2], $$[$0-1], $$[$0], $$[$0], false, this._$),
                                program = new yy.Program([inverse], null, {}, yy.locInfo(this._$));
                            program.chained = true;

                            this.$ = { strip: $$[$0-2].strip, program: program, chain: true };

                            break;
                        case 19:this.$ = $$[$0];
                            break;
                        case 20:this.$ = {path: $$[$0-1], strip: yy.stripFlags($$[$0-2], $$[$0])};
                            break;
                        case 21:this.$ = yy.prepareMustache($$[$0-1], $$[$0-2], yy.stripFlags($$[$0-2], $$[$0]), this._$);
                            break;
                        case 22:this.$ = yy.prepareMustache($$[$0-1], $$[$0-2], yy.stripFlags($$[$0-2], $$[$0]), this._$);
                            break;
                        case 23:this.$ = new yy.PartialStatement($$[$0-1], yy.stripFlags($$[$0-2], $$[$0]), yy.locInfo(this._$));
                            break;
                        case 24:this.$ = new yy.SubExpression($$[$0-2], $$[$0-1], $$[$0], yy.locInfo(this._$));
                            break;
                        case 25:this.$ = new yy.SubExpression($$[$0], null, null, yy.locInfo(this._$));
                            break;
                        case 26:this.$ = $$[$0];
                            break;
                        case 27:this.$ = new yy.StringLiteral($$[$0], yy.locInfo(this._$));
                            break;
                        case 28:this.$ = new yy.NumberLiteral($$[$0], yy.locInfo(this._$));
                            break;
                        case 29:this.$ = new yy.BooleanLiteral($$[$0], yy.locInfo(this._$));
                            break;
                        case 30:this.$ = $$[$0];
                            break;
                        case 31:this.$ = $$[$0-1];
                            break;
                        case 32:this.$ = new yy.Hash($$[$0], yy.locInfo(this._$));
                            break;
                        case 33:this.$ = new yy.HashPair($$[$0-2], $$[$0], yy.locInfo(this._$));
                            break;
                        case 34:this.$ = $$[$0-1];
                            break;
                        case 35:this.$ = $$[$0];
                            break;
                        case 36:this.$ = new yy.StringLiteral($$[$0], yy.locInfo(this._$)), yy.locInfo(this._$);
                            break;
                        case 37:this.$ = new yy.NumberLiteral($$[$0], yy.locInfo(this._$));
                            break;
                        case 38:this.$ = yy.preparePath(true, $$[$0], this._$);
                            break;
                        case 39:this.$ = yy.preparePath(false, $$[$0], this._$);
                            break;
                        case 40: $$[$0-2].push({part: $$[$0], separator: $$[$0-1]}); this.$ = $$[$0-2];
                            break;
                        case 41:this.$ = [{part: $$[$0]}];
                            break;
                        case 42:this.$ = [];
                            break;
                        case 43:$$[$0-1].push($$[$0]);
                            break;
                        case 56:this.$ = [];
                            break;
                        case 57:$$[$0-1].push($$[$0]);
                            break;
                        case 60:this.$ = [$$[$0]];
                            break;
                        case 61:$$[$0-1].push($$[$0]);
                            break;
                        case 62:this.$ = [$$[$0]];
                            break;
                        case 63:$$[$0-1].push($$[$0]);
                            break;
                    }
                },
                table: [{3:1,4:2,5:[2,42],6:3,13:[2,42],14:[2,42],17:[2,42],25:[2,42],28:[2,42],39:[2,42],40:[2,42],42:[2,42]},{1:[3]},{5:[1,4]},{5:[2,2],7:5,8:6,9:7,10:8,11:9,12:10,13:[1,11],14:[1,18],15:16,17:[1,21],20:14,23:15,25:[1,19],28:[1,20],31:[2,2],34:[2,2],37:[2,2],39:[1,12],40:[1,13],42:[1,17]},{1:[2,1]},{5:[2,43],13:[2,43],14:[2,43],17:[2,43],25:[2,43],28:[2,43],31:[2,43],34:[2,43],37:[2,43],39:[2,43],40:[2,43],42:[2,43]},{5:[2,3],13:[2,3],14:[2,3],17:[2,3],25:[2,3],28:[2,3],31:[2,3],34:[2,3],37:[2,3],39:[2,3],40:[2,3],42:[2,3]},{5:[2,4],13:[2,4],14:[2,4],17:[2,4],25:[2,4],28:[2,4],31:[2,4],34:[2,4],37:[2,4],39:[2,4],40:[2,4],42:[2,4]},{5:[2,5],13:[2,5],14:[2,5],17:[2,5],25:[2,5],28:[2,5],31:[2,5],34:[2,5],37:[2,5],39:[2,5],40:[2,5],42:[2,5]},{5:[2,6],13:[2,6],14:[2,6],17:[2,6],25:[2,6],28:[2,6],31:[2,6],34:[2,6],37:[2,6],39:[2,6],40:[2,6],42:[2,6]},{5:[2,7],13:[2,7],14:[2,7],17:[2,7],25:[2,7],28:[2,7],31:[2,7],34:[2,7],37:[2,7],39:[2,7],40:[2,7],42:[2,7]},{5:[2,8],13:[2,8],14:[2,8],17:[2,8],25:[2,8],28:[2,8],31:[2,8],34:[2,8],37:[2,8],39:[2,8],40:[2,8],42:[2,8]},{18:22,38:25,43:23,46:24,48:[1,26],49:[1,27],56:[1,30],62:[1,28],63:29},{18:31,38:25,43:23,46:24,48:[1,26],49:[1,27],56:[1,30],62:[1,28],63:29},{4:32,6:3,13:[2,42],14:[2,42],17:[2,42],25:[2,42],28:[2,42],31:[2,42],34:[2,42],37:[2,42],39:[2,42],40:[2,42],42:[2,42]},{4:33,6:3,13:[2,42],14:[2,42],17:[2,42],25:[2,42],28:[2,42],34:[2,42],37:[2,42],39:[2,42],40:[2,42],42:[2,42]},{12:34,14:[1,18]},{18:35,38:25,43:23,46:24,48:[1,26],49:[1,27],56:[1,30],62:[1,28],63:29},{5:[2,9],13:[2,9],14:[2,9],16:[2,9],17:[2,9],25:[2,9],28:[2,9],31:[2,9],34:[2,9],37:[2,9],39:[2,9],40:[2,9],42:[2,9]},{18:36,38:25,43:23,46:24,48:[1,26],49:[1,27],56:[1,30],62:[1,28],63:29},{18:37,38:25,43:23,46:24,48:[1,26],49:[1,27],56:[1,30],62:[1,28],63:29},{18:38,38:25,43:23,46:24,48:[1,26],49:[1,27],56:[1,30],62:[1,28],63:29},{27:[1,39]},{19:[2,56],27:[2,56],41:[2,56],44:40,48:[2,56],49:[2,56],50:[2,56],51:[2,56],52:[2,56],56:[2,56],59:[2,56],62:[2,56]},{19:[2,25],27:[2,25],41:[2,25],52:[2,25],59:[2,25]},{19:[2,35],27:[2,35],41:[2,35],48:[2,35],49:[2,35],50:[2,35],51:[2,35],52:[2,35],56:[2,35],59:[2,35],62:[2,35]},{19:[2,36],27:[2,36],41:[2,36],48:[2,36],49:[2,36],50:[2,36],51:[2,36],52:[2,36],56:[2,36],59:[2,36],62:[2,36]},{19:[2,37],27:[2,37],41:[2,37],48:[2,37],49:[2,37],50:[2,37],51:[2,37],52:[2,37],56:[2,37],59:[2,37],62:[2,37]},{56:[1,30],63:41},{19:[2,39],27:[2,39],41:[2,39],48:[2,39],49:[2,39],50:[2,39],51:[2,39],52:[2,39],56:[2,39],59:[2,39],62:[2,39],64:[1,42]},{19:[2,41],27:[2,41],41:[2,41],48:[2,41],49:[2,41],50:[2,41],51:[2,41],52:[2,41],56:[2,41],59:[2,41],62:[2,41],64:[2,41]},{41:[1,43]},{21:44,30:46,31:[1,48],33:47,34:[1,49],35:45,37:[2,44]},{24:50,33:51,34:[1,49],37:[2,46]},{16:[1,52]},{27:[1,53]},{26:54,27:[2,48],58:55,59:[1,56]},{27:[2,50],29:57,58:58,59:[1,56]},{19:[1,59]},{5:[2,21],13:[2,21],14:[2,21],17:[2,21],25:[2,21],28:[2,21],31:[2,21],34:[2,21],37:[2,21],39:[2,21],40:[2,21],42:[2,21]},{19:[2,58],27:[2,58],38:63,41:[2,58],45:60,46:67,47:61,48:[1,64],49:[1,65],50:[1,66],51:[1,68],52:[2,58],53:62,54:69,55:70,56:[1,71],59:[2,58],62:[1,28],63:29},{19:[2,38],27:[2,38],41:[2,38],48:[2,38],49:[2,38],50:[2,38],51:[2,38],52:[2,38],56:[2,38],59:[2,38],62:[2,38],64:[1,42]},{56:[1,72]},{5:[2,22],13:[2,22],14:[2,22],17:[2,22],25:[2,22],28:[2,22],31:[2,22],34:[2,22],37:[2,22],39:[2,22],40:[2,22],42:[2,22]},{22:73,37:[1,74]},{37:[2,45]},{4:75,6:3,13:[2,42],14:[2,42],17:[2,42],25:[2,42],28:[2,42],31:[2,42],34:[2,42],37:[2,42],39:[2,42],40:[2,42],42:[2,42]},{37:[2,19]},{18:76,38:25,43:23,46:24,48:[1,26],49:[1,27],56:[1,30],62:[1,28],63:29},{4:77,6:3,13:[2,42],14:[2,42],17:[2,42],25:[2,42],28:[2,42],37:[2,42],39:[2,42],40:[2,42],42:[2,42]},{22:78,37:[1,74]},{37:[2,47]},{5:[2,10],13:[2,10],14:[2,10],17:[2,10],25:[2,10],28:[2,10],31:[2,10],34:[2,10],37:[2,10],39:[2,10],40:[2,10],42:[2,10]},{5:[2,23],13:[2,23],14:[2,23],17:[2,23],25:[2,23],28:[2,23],31:[2,23],34:[2,23],37:[2,23],39:[2,23],40:[2,23],42:[2,23]},{27:[1,79]},{27:[2,49]},{56:[1,81],60:80},{27:[1,82]},{27:[2,51]},{14:[2,11]},{19:[2,24],27:[2,24],41:[2,24],52:[2,24],59:[2,24]},{19:[2,57],27:[2,57],41:[2,57],48:[2,57],49:[2,57],50:[2,57],51:[2,57],52:[2,57],56:[2,57],59:[2,57],62:[2,57]},{19:[2,59],27:[2,59],41:[2,59],52:[2,59],59:[2,59]},{19:[2,26],27:[2,26],41:[2,26],48:[2,26],49:[2,26],50:[2,26],51:[2,26],52:[2,26],56:[2,26],59:[2,26],62:[2,26]},{19:[2,27],27:[2,27],41:[2,27],48:[2,27],49:[2,27],50:[2,27],51:[2,27],52:[2,27],56:[2,27],59:[2,27],62:[2,27]},{19:[2,28],27:[2,28],41:[2,28],48:[2,28],49:[2,28],50:[2,28],51:[2,28],52:[2,28],56:[2,28],59:[2,28],62:[2,28]},{19:[2,29],27:[2,29],41:[2,29],48:[2,29],49:[2,29],50:[2,29],51:[2,29],52:[2,29],56:[2,29],59:[2,29],62:[2,29]},{19:[2,30],27:[2,30],41:[2,30],48:[2,30],49:[2,30],50:[2,30],51:[2,30],52:[2,30],56:[2,30],59:[2,30],62:[2,30]},{18:83,38:25,43:23,46:24,48:[1,26],49:[1,27],56:[1,30],62:[1,28],63:29},{19:[2,32],27:[2,32],41:[2,32],52:[2,32],55:84,56:[1,85],59:[2,32]},{19:[2,60],27:[2,60],41:[2,60],52:[2,60],56:[2,60],59:[2,60]},{19:[2,41],27:[2,41],41:[2,41],48:[2,41],49:[2,41],50:[2,41],51:[2,41],52:[2,41],56:[2,41],57:[1,86],59:[2,41],62:[2,41],64:[2,41]},{19:[2,40],27:[2,40],41:[2,40],48:[2,40],49:[2,40],50:[2,40],51:[2,40],52:[2,40],56:[2,40],59:[2,40],62:[2,40],64:[2,40]},{5:[2,12],13:[2,12],14:[2,12],17:[2,12],25:[2,12],28:[2,12],31:[2,12],34:[2,12],37:[2,12],39:[2,12],40:[2,12],42:[2,12]},{38:87,56:[1,30],63:29},{30:46,31:[1,48],33:47,34:[1,49],35:89,36:88,37:[2,54]},{27:[2,52],32:90,58:91,59:[1,56]},{37:[2,17]},{5:[2,13],13:[2,13],14:[2,13],17:[2,13],25:[2,13],28:[2,13],31:[2,13],34:[2,13],37:[2,13],39:[2,13],40:[2,13],42:[2,13]},{13:[2,14],14:[2,14],17:[2,14],25:[2,14],28:[2,14],31:[2,14],34:[2,14],37:[2,14],39:[2,14],40:[2,14],42:[2,14]},{56:[1,93],61:[1,92]},{56:[2,62],61:[2,62]},{13:[2,15],14:[2,15],17:[2,15],25:[2,15],28:[2,15],34:[2,15],37:[2,15],39:[2,15],40:[2,15],42:[2,15]},{52:[1,94]},{19:[2,61],27:[2,61],41:[2,61],52:[2,61],56:[2,61],59:[2,61]},{57:[1,86]},{38:63,46:67,47:95,48:[1,64],49:[1,65],50:[1,66],51:[1,68],56:[1,30],62:[1,28],63:29},{27:[1,96]},{37:[2,18]},{37:[2,55]},{27:[1,97]},{27:[2,53]},{27:[2,34]},{56:[2,63],61:[2,63]},{19:[2,31],27:[2,31],41:[2,31],48:[2,31],49:[2,31],50:[2,31],51:[2,31],52:[2,31],56:[2,31],59:[2,31],62:[2,31]},{19:[2,33],27:[2,33],41:[2,33],52:[2,33],56:[2,33],59:[2,33]},{5:[2,20],13:[2,20],14:[2,20],17:[2,20],25:[2,20],28:[2,20],31:[2,20],34:[2,20],37:[2,20],39:[2,20],40:[2,20],42:[2,20]},{13:[2,16],14:[2,16],17:[2,16],25:[2,16],28:[2,16],31:[2,16],34:[2,16],37:[2,16],39:[2,16],40:[2,16],42:[2,16]}],
                defaultActions: {4:[2,1],45:[2,45],47:[2,19],51:[2,47],55:[2,49],58:[2,51],59:[2,11],77:[2,17],88:[2,18],89:[2,55],91:[2,53],92:[2,34]},
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


                    function strip(start, end) {
                        return yy_.yytext = yy_.yytext.substr(start, yy_.yyleng-end);
                    }


                    var YYSTATE=YY_START
                    switch($avoiding_name_collisions) {
                        case 0:
                            if(yy_.yytext.slice(-2) === "\\\\") {
                                strip(0,1);
                                this.begin("mu");
                            } else if(yy_.yytext.slice(-1) === "\\") {
                                strip(0,1);
                                this.begin("emu");
                            } else {
                                this.begin("mu");
                            }
                            if(yy_.yytext) return 14;

                            break;
                        case 1:return 14;
                            break;
                        case 2:
                            this.popState();
                            return 14;

                            break;
                        case 3:
                            yy_.yytext = yy_.yytext.substr(5, yy_.yyleng-9);
                            this.popState();
                            return 16;

                            break;
                        case 4: return 14;
                            break;
                        case 5:
                            this.popState();
                            return 13;

                            break;
                        case 6:return 51;
                            break;
                        case 7:return 52;
                            break;
                        case 8: return 17;
                            break;
                        case 9:
                            this.popState();
                            this.begin('raw');
                            return 19;

                            break;
                        case 10:return 42;
                            break;
                        case 11:return 25;
                            break;
                        case 12:return 37;
                            break;
                        case 13:this.popState(); return 34;
                            break;
                        case 14:this.popState(); return 34;
                            break;
                        case 15:return 28;
                            break;
                        case 16:return 31;
                            break;
                        case 17:return 40;
                            break;
                        case 18:return 39;
                            break;
                        case 19:
                            this.unput(yy_.yytext);
                            this.popState();
                            this.begin('com');

                            break;
                        case 20:
                            this.popState();
                            return 13;

                            break;
                        case 21:return 39;
                            break;
                        case 22:return 57;
                            break;
                        case 23:return 56;
                            break;
                        case 24:return 56;
                            break;
                        case 25:return 64;
                            break;
                        case 26:// ignore whitespace
                            break;
                        case 27:this.popState(); return 41;
                            break;
                        case 28:this.popState(); return 27;
                            break;
                        case 29:yy_.yytext = strip(1,2).replace(/\\"/g,'"'); return 48;
                            break;
                        case 30:yy_.yytext = strip(1,2).replace(/\\'/g,"'"); return 48;
                            break;
                        case 31:return 62;
                            break;
                        case 32:return 50;
                            break;
                        case 33:return 50;
                            break;
                        case 34:return 49;
                            break;
                        case 35:return 59;
                            break;
                        case 36:return 61;
                            break;
                        case 37:return 56;
                            break;
                        case 38:yy_.yytext = strip(1,2); return 56;
                            break;
                        case 39:return 'INVALID';
                            break;
                        case 40:return 5;
                            break;
                    }
                };
                lexer.rules = [/^(?:[^\x00]*?(?=(\{\{)))/,/^(?:[^\x00]+)/,/^(?:[^\x00]{2,}?(?=(\{\{|\\\{\{|\\\\\{\{|$)))/,/^(?:\{\{\{\{\/[^\s!"#%-,\.\/;->@\[-\^`\{-~]+(?=[=}\s\/.])\}\}\}\})/,/^(?:[^\x00]*?(?=(\{\{\{\{\/)))/,/^(?:[\s\S]*?--(~)?\}\})/,/^(?:\()/,/^(?:\))/,/^(?:\{\{\{\{)/,/^(?:\}\}\}\})/,/^(?:\{\{(~)?>)/,/^(?:\{\{(~)?#)/,/^(?:\{\{(~)?\/)/,/^(?:\{\{(~)?\^\s*(~)?\}\})/,/^(?:\{\{(~)?\s*else\s*(~)?\}\})/,/^(?:\{\{(~)?\^)/,/^(?:\{\{(~)?\s*else\b)/,/^(?:\{\{(~)?\{)/,/^(?:\{\{(~)?&)/,/^(?:\{\{(~)?!--)/,/^(?:\{\{(~)?![\s\S]*?\}\})/,/^(?:\{\{(~)?)/,/^(?:=)/,/^(?:\.\.)/,/^(?:\.(?=([=~}\s\/.)|])))/,/^(?:[\/.])/,/^(?:\s+)/,/^(?:\}(~)?\}\})/,/^(?:(~)?\}\})/,/^(?:"(\\["]|[^"])*")/,/^(?:'(\\[']|[^'])*')/,/^(?:@)/,/^(?:true(?=([~}\s)])))/,/^(?:false(?=([~}\s)])))/,/^(?:-?[0-9]+(?:\.[0-9]+)?(?=([~}\s)])))/,/^(?:as\s+\|)/,/^(?:\|)/,/^(?:([^\s!"#%-,\.\/;->@\[-\^`\{-~]+(?=([=~}\s\/.)|]))))/,/^(?:\[[^\]]*\])/,/^(?:.)/,/^(?:$)/];
                lexer.conditions = {"mu":{"rules":[6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40],"inclusive":false},"emu":{"rules":[2],"inclusive":false},"com":{"rules":[5],"inclusive":false},"raw":{"rules":[3,4],"inclusive":false},"INITIAL":{"rules":[0,1,40],"inclusive":true}};
                return lexer;})()
            parser.lexer = lexer;
            function Parser () { this.yy = {}; }Parser.prototype = parser;parser.Parser = Parser;
            return new Parser;
        })();__exports__ = handlebars;
        /* jshint ignore:end */
        return __exports__;
    })();

// handlebars\compiler\visitor.js
    var __module11__ = (function() {
        "use strict";
        var __exports__;
        function Visitor() {}

        Visitor.prototype = {
            constructor: Visitor,

            accept: function(object) {
                return object && this[object.type](object);
            },

            Program: function(program) {
                var body = program.body,
                    i, l;

                for(i=0, l=body.length; i<l; i++) {
                    this.accept(body[i]);
                }
            },

            MustacheStatement: function(mustache) {
                this.accept(mustache.sexpr);
            },

            BlockStatement: function(block) {
                this.accept(block.sexpr);
                this.accept(block.program);
                this.accept(block.inverse);
            },

            PartialStatement: function(partial) {
                this.accept(partial.partialName);
                this.accept(partial.context);
                this.accept(partial.hash);
            },

            ContentStatement: function(content) {},
            CommentStatement: function(comment) {},

            SubExpression: function(sexpr) {
                var params = sexpr.params, paramStrings = [], hash;

                this.accept(sexpr.path);
                for(var i=0, l=params.length; i<l; i++) {
                    this.accept(params[i]);
                }
                this.accept(sexpr.hash);
            },

            PathExpression: function(path) {},

            StringLiteral: function(string) {},
            NumberLiteral: function(number) {},
            BooleanLiteral: function(bool) {},

            Hash: function(hash) {
                var pairs = hash.pairs;

                for(var i=0, l=pairs.length; i<l; i++) {
                    this.accept(pairs[i]);
                }
            },
            HashPair: function(pair) {
                this.accept(pair.value);
            }
        };

        __exports__ = Visitor;
        return __exports__;
    })();

// handlebars\compiler\whitespace-control.js
    var __module10__ = (function(__dependency1__) {
        "use strict";
        var __exports__;
        var Visitor = __dependency1__;


        function WhitespaceControl() {
        }
        WhitespaceControl.prototype = new Visitor();

        WhitespaceControl.prototype.Program = function(program) {
            var isRoot = !this.isRootSeen;
            this.isRootSeen = true;

            var body = program.body;
            for (var i = 0, l = body.length; i < l; i++) {
                var current = body[i],
                    strip = this.accept(current);

                if (!strip) {
                    continue;
                }

                var _isPrevWhitespace = isPrevWhitespace(body, i, isRoot),
                    _isNextWhitespace = isNextWhitespace(body, i, isRoot),

                    openStandalone = strip.openStandalone && _isPrevWhitespace,
                    closeStandalone = strip.closeStandalone && _isNextWhitespace,
                    inlineStandalone = strip.inlineStandalone && _isPrevWhitespace && _isNextWhitespace;

                if (strip.close) {
                    omitRight(body, i, true);
                }
                if (strip.open) {
                    omitLeft(body, i, true);
                }

                if (inlineStandalone) {
                    omitRight(body, i);

                    if (omitLeft(body, i)) {
                        // If we are on a standalone node, save the indent info for partials
                        if (current.type === 'PartialStatement') {
                            // Pull out the whitespace from the final line
                            current.indent = (/([ \t]+$)/).exec(body[i-1].original)[1];
                        }
                    }
                }
                if (openStandalone) {
                    omitRight((current.program || current.inverse).body);

                    // Strip out the previous content node if it's whitespace only
                    omitLeft(body, i);
                }
                if (closeStandalone) {
                    // Always strip the next node
                    omitRight(body, i);

                    omitLeft((current.inverse || current.program).body);
                }
            }

            return program;
        };
        WhitespaceControl.prototype.BlockStatement = function(block) {
            this.accept(block.program);
            this.accept(block.inverse);

            // Find the inverse program that is involed with whitespace stripping.
            var program = block.program || block.inverse,
                inverse = block.program && block.inverse,
                firstInverse = inverse,
                lastInverse = inverse;

            if (inverse && inverse.chained) {
                firstInverse = inverse.body[0].program;

                // Walk the inverse chain to find the last inverse that is actually in the chain.
                while (lastInverse.chained) {
                    lastInverse = lastInverse.body[lastInverse.body.length-1].program;
                }
            }

            var strip = {
                open: block.openStrip.open,
                close: block.closeStrip.close,

                // Determine the standalone candiacy. Basically flag our content as being possibly standalone
                // so our parent can determine if we actually are standalone
                openStandalone: isNextWhitespace(program.body),
                closeStandalone: isPrevWhitespace((firstInverse || program).body)
            };

            if (block.openStrip.close) {
                omitRight(program.body, null, true);
            }

            if (inverse) {
                var inverseStrip = block.inverseStrip;

                if (inverseStrip.open) {
                    omitLeft(program.body, null, true);
                }

                if (inverseStrip.close) {
                    omitRight(firstInverse.body, null, true);
                }
                if (block.closeStrip.open) {
                    omitLeft(lastInverse.body, null, true);
                }

                // Find standalone else statments
                if (isPrevWhitespace(program.body)
                    && isNextWhitespace(firstInverse.body)) {

                    omitLeft(program.body);
                    omitRight(firstInverse.body);
                }
            } else {
                if (block.closeStrip.open) {
                    omitLeft(program.body, null, true);
                }
            }

            return strip;
        };

        WhitespaceControl.prototype.MustacheStatement = function(mustache) {
            return mustache.strip;
        };

        WhitespaceControl.prototype.PartialStatement =
            WhitespaceControl.prototype.CommentStatement = function(node) {
                var strip = node.strip || {};
                return {
                    inlineStandalone: true,
                    open: strip.open,
                    close: strip.close
                };
            };


        function isPrevWhitespace(body, i, isRoot) {
            if (i === undefined) {
                i = body.length;
            }

            // Nodes that end with newlines are considered whitespace (but are special
            // cased for strip operations)
            var prev = body[i-1],
                sibling = body[i-2];
            if (!prev) {
                return isRoot;
            }

            if (prev.type === 'ContentStatement') {
                return (sibling || !isRoot ? (/\r?\n\s*?$/) : (/(^|\r?\n)\s*?$/)).test(prev.original);
            }
        }
        function isNextWhitespace(body, i, isRoot) {
            if (i === undefined) {
                i = -1;
            }

            var next = body[i+1],
                sibling = body[i+2];
            if (!next) {
                return isRoot;
            }

            if (next.type === 'ContentStatement') {
                return (sibling || !isRoot ? (/^\s*?\r?\n/) : (/^\s*?(\r?\n|$)/)).test(next.original);
            }
        }

        // Marks the node to the right of the position as omitted.
        // I.e. {{foo}}' ' will mark the ' ' node as omitted.
        //
        // If i is undefined, then the first child will be marked as such.
        //
        // If mulitple is truthy then all whitespace will be stripped out until non-whitespace
        // content is met.
        function omitRight(body, i, multiple) {
            var current = body[i == null ? 0 : i + 1];
            if (!current || current.type !== 'ContentStatement' || (!multiple && current.rightStripped)) {
                return;
            }

            var original = current.value;
            current.value = current.value.replace(multiple ? (/^\s+/) : (/^[ \t]*\r?\n?/), '');
            current.rightStripped = current.value !== original;
        }

        // Marks the node to the left of the position as omitted.
        // I.e. ' '{{foo}} will mark the ' ' node as omitted.
        //
        // If i is undefined then the last child will be marked as such.
        //
        // If mulitple is truthy then all whitespace will be stripped out until non-whitespace
        // content is met.
        function omitLeft(body, i, multiple) {
            var current = body[i == null ? body.length - 1 : i - 1];
            if (!current || current.type !== 'ContentStatement' || (!multiple && current.leftStripped)) {
                return;
            }

            // We omit the last node if it's whitespace only and not preceeded by a non-content node.
            var original = current.value;
            current.value = current.value.replace(multiple ? (/\s+$/) : (/[ \t]+$/), '');
            current.leftStripped = current.value !== original;
            return current.leftStripped;
        }

        __exports__ = WhitespaceControl;
        return __exports__;
    })(__module11__);

// handlebars\compiler\helpers.js
    var __module12__ = (function(__dependency1__) {
        "use strict";
        var __exports__ = {};
        var Exception = __dependency1__;


        function SourceLocation(source, locInfo) {
            this.source = source;
            this.start = {
                line: locInfo.first_line,
                column: locInfo.first_column
            };
            this.end = {
                line: locInfo.last_line,
                column: locInfo.last_column
            };
        }
        __exports__.SourceLocation = SourceLocation;
        function stripFlags(open, close) {
            return {
                open: open.charAt(2) === '~',
                close: close.charAt(close.length-3) === '~'
            };
        }
        __exports__.stripFlags = stripFlags;
        function stripComment(comment) {
            return comment.replace(/^\{\{~?\!-?-?/, '')
                .replace(/-?-?~?\}\}$/, '');
        }
        __exports__.stripComment = stripComment;
        function preparePath(data, parts, locInfo) {
            /*jshint -W040 */
            locInfo = this.locInfo(locInfo);

            var original = data ? '@' : '',
                dig = [],
                depth = 0,
                depthString = '';

            for(var i=0,l=parts.length; i<l; i++) {
                var part = parts[i].part;
                original += (parts[i].separator || '') + part;

                if (part === '..' || part === '.' || part === 'this') {
                    if (dig.length > 0) {
                        throw new Exception('Invalid path: ' + original, {loc: locInfo});
                    } else if (part === '..') {
                        depth++;
                        depthString += '../';
                    }
                } else {
                    dig.push(part);
                }
            }

            return new this.PathExpression(data, depth, dig, original, locInfo);
        }
        __exports__.preparePath = preparePath;
        function prepareMustache(sexpr, open, strip, locInfo) {
            /*jshint -W040 */
            // Must use charAt to support IE pre-10
            var escapeFlag = open.charAt(3) || open.charAt(2),
                escaped = escapeFlag !== '{' && escapeFlag !== '&';

            return new this.MustacheStatement(sexpr, escaped, strip, this.locInfo(locInfo));
        }
        __exports__.prepareMustache = prepareMustache;
        function prepareRawBlock(openRawBlock, content, close, locInfo) {
            /*jshint -W040 */
            if (openRawBlock.sexpr.path.original !== close) {
                var errorNode = {loc: openRawBlock.sexpr.loc};

                throw new Exception(openRawBlock.sexpr.path.original + " doesn't match " + close, errorNode);
            }

            locInfo = this.locInfo(locInfo);
            var program = new this.Program([content], null, {}, locInfo);

            return new this.BlockStatement(
                openRawBlock.sexpr, program, undefined,
                {}, {}, {},
                locInfo);
        }
        __exports__.prepareRawBlock = prepareRawBlock;
        function prepareBlock(openBlock, program, inverseAndProgram, close, inverted, locInfo) {
            /*jshint -W040 */
            // When we are chaining inverse calls, we will not have a close path
            if (close && close.path && openBlock.sexpr.path.original !== close.path.original) {
                var errorNode = {loc: openBlock.sexpr.loc};

                throw new Exception(openBlock.sexpr.path.original + ' doesn\'t match ' + close.path.original, errorNode);
            }

            program.blockParams = openBlock.blockParams;

            var inverse,
                inverseStrip;

            if (inverseAndProgram) {
                if (inverseAndProgram.chain) {
                    inverseAndProgram.program.body[0].closeStrip = close.strip || close.openStrip;
                }

                inverseStrip = inverseAndProgram.strip;
                inverse = inverseAndProgram.program;
            }

            if (inverted) {
                inverted = inverse;
                inverse = program;
                program = inverted;
            }

            return new this.BlockStatement(
                openBlock.sexpr, program, inverse,
                openBlock.strip, inverseStrip, close && (close.strip || close.openStrip),
                this.locInfo(locInfo));
        }
        __exports__.prepareBlock = prepareBlock;
        return __exports__;
    })(__module5__);

// handlebars\compiler\base.js
    var __module8__ = (function(__dependency1__, __dependency2__, __dependency3__, __dependency4__, __dependency5__) {
        "use strict";
        var __exports__ = {};
        var parser = __dependency1__;

        var AST = __dependency2__;

        var WhitespaceControl = __dependency3__;

        var Helpers = __dependency4__;

        var extend = __dependency5__.extend;


        __exports__.parser = parser;


        var yy = {};
        extend(yy, Helpers, AST);

        function parse(input, options) {
            // Just return if an already-compile AST was passed in.
            if (input.type === 'Program') { return input; }

            parser.yy = yy;

            // Altering the shared object here, but this is ok as parser is a sync operation
            yy.locInfo = function(locInfo) {
                return new yy.SourceLocation(options && options.srcName, locInfo);
            };

            var strip = new WhitespaceControl();
            return strip.accept(parser.parse(input));
        }
        __exports__.parse = parse;
        return __exports__;
    })(__module9__, __module7__, __module10__, __module12__, __module3__);

// handlebars\compiler\compiler.js
    var __module13__ = (function(__dependency1__, __dependency2__) {
        "use strict";
        var __exports__ = {};
        var Exception = __dependency1__;

        var isArray = __dependency2__.isArray;


        var slice = [].slice;


        // a mustache is definitely a helper if:
        // * it is an eligible helper, and
        // * it has at least one parameter or hash segment
        function helperExpr(sexpr) {
            return !!(sexpr.isHelper || sexpr.params.length || sexpr.hash);
        }

        function scopedId(path) {
            return (/^\.|this\b/).test(path.original);
        }

        // an ID is simple if it only has one part, and that part is not
        // `..` or `this`.
        function simpleId(path) {
            var part = path.parts[0];

            return path.parts.length === 1 && !scopedId(path) && !path.depth;
        }

        function Compiler() {}
        __exports__.Compiler = Compiler;
        // the foundHelper register will disambiguate helper lookup from finding a
        // function in a context. This is necessary for mustache compatibility, which
        // requires that context functions in blocks are evaluated by blockHelperMissing,
        // and then proceed as if the resulting value was provided to blockHelperMissing.

        Compiler.prototype = {
            compiler: Compiler,

            equals: function(other) {
                var len = this.opcodes.length;
                if (other.opcodes.length !== len) {
                    return false;
                }

                for (var i = 0; i < len; i++) {
                    var opcode = this.opcodes[i],
                        otherOpcode = other.opcodes[i];
                    if (opcode.opcode !== otherOpcode.opcode || !argEquals(opcode.args, otherOpcode.args)) {
                        return false;
                    }
                }

                // We know that length is the same between the two arrays because they are directly tied
                // to the opcode behavior above.
                len = this.children.length;
                for (i = 0; i < len; i++) {
                    if (!this.children[i].equals(other.children[i])) {
                        return false;
                    }
                }

                return true;
            },

            guid: 0,

            compile: function(program, options) {
                this.sourceNode = [];
                this.opcodes = [];
                this.children = [];
                this.depths = {list: []};
                this.options = options;
                this.stringParams = options.stringParams;
                this.trackIds = options.trackIds;

                // These changes will propagate to the other compiler components
                var knownHelpers = this.options.knownHelpers;
                this.options.knownHelpers = {
                    'helperMissing': true,
                    'blockHelperMissing': true,
                    'each': true,
                    'if': true,
                    'unless': true,
                    'with': true,
                    'log': true,
                    'lookup': true
                };
                if (knownHelpers) {
                    for (var name in knownHelpers) {
                        this.options.knownHelpers[name] = knownHelpers[name];
                    }
                }

                return this.accept(program);
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

            accept: function(node) {
                this.sourceNode.unshift(node);
                var ret = this[node.type](node);
                this.sourceNode.shift();
                return ret;
            },

            Program: function(program) {
                var body = program.body;

                for(var i=0, l=body.length; i<l; i++) {
                    this.accept(body[i]);
                }

                this.isSimple = l === 1;

                this.depths.list = this.depths.list.sort(function(a, b) {
                    return a - b;
                });

                return this;
            },

            BlockStatement: function(block) {
                var sexpr = block.sexpr,
                    program = block.program,
                    inverse = block.inverse;

                program = program && this.compileProgram(program);
                inverse = inverse && this.compileProgram(inverse);

                var type = this.classifySexpr(sexpr);

                if (type === 'helper') {
                    this.helperSexpr(sexpr, program, inverse);
                } else if (type === 'simple') {
                    this.simpleSexpr(sexpr);

                    // now that the simple mustache is resolved, we need to
                    // evaluate it by executing `blockHelperMissing`
                    this.opcode('pushProgram', program);
                    this.opcode('pushProgram', inverse);
                    this.opcode('emptyHash');
                    this.opcode('blockValue', sexpr.path.original);
                } else {
                    this.ambiguousSexpr(sexpr, program, inverse);

                    // now that the simple mustache is resolved, we need to
                    // evaluate it by executing `blockHelperMissing`
                    this.opcode('pushProgram', program);
                    this.opcode('pushProgram', inverse);
                    this.opcode('emptyHash');
                    this.opcode('ambiguousBlockValue');
                }

                this.opcode('append');
            },

            PartialStatement: function(partial) {
                var partialName = partial.sexpr.path.original;
                this.usePartial = true;

                var params = partial.sexpr.params;
                if (params.length > 1) {
                    throw new Exception('Unsupported number of partial arguments: ' + params.length, partial);
                } else if (!params.length) {
                    params.push({type: 'PathExpression', parts: [], depth: 0});
                }

                this.setupFullMustacheParams(partial.sexpr, undefined, undefined, true);

                var indent = partial.indent || '';
                if (this.options.preventIndent && indent) {
                    this.opcode('appendContent', indent);
                    indent = '';
                }
                this.opcode('invokePartial', partialName, indent);
                this.opcode('append');
            },

            MustacheStatement: function(mustache) {
                this.accept(mustache.sexpr);

                if(mustache.escaped && !this.options.noEscape) {
                    this.opcode('appendEscaped');
                } else {
                    this.opcode('append');
                }
            },

            ContentStatement: function(content) {
                if (content.value) {
                    this.opcode('appendContent', content.value);
                }
            },

            CommentStatement: function() {},

            SubExpression: function(sexpr) {
                var type = this.classifySexpr(sexpr);

                if (type === 'simple') {
                    this.simpleSexpr(sexpr);
                } else if (type === 'helper') {
                    this.helperSexpr(sexpr);
                } else {
                    this.ambiguousSexpr(sexpr);
                }
            },
            ambiguousSexpr: function(sexpr, program, inverse) {
                var path = sexpr.path,
                    name = path.parts[0],
                    isBlock = program != null || inverse != null;

                this.opcode('getContext', path.depth);

                this.opcode('pushProgram', program);
                this.opcode('pushProgram', inverse);

                this.accept(path);

                this.opcode('invokeAmbiguous', name, isBlock);
            },

            simpleSexpr: function(sexpr) {
                this.accept(sexpr.path);
                this.opcode('resolvePossibleLambda');
            },

            helperSexpr: function(sexpr, program, inverse) {
                var params = this.setupFullMustacheParams(sexpr, program, inverse),
                    path = sexpr.path,
                    name = path.parts[0];

                if (this.options.knownHelpers[name]) {
                    this.opcode('invokeKnownHelper', params.length, name);
                } else if (this.options.knownHelpersOnly) {
                    throw new Exception("You specified knownHelpersOnly, but used the unknown helper " + name, sexpr);
                } else {
                    path.falsy = true;

                    this.accept(path);
                    this.opcode('invokeHelper', params.length, path.original, simpleId(path));
                }
            },

            PathExpression: function(path) {
                this.addDepth(path.depth);
                this.opcode('getContext', path.depth);

                var name = path.parts[0];
                if (!name) {
                    // Context reference, i.e. `{{foo .}}` or `{{foo ..}}`
                    this.opcode('pushContext');
                } else if (path.data) {
                    this.options.data = true;
                    this.opcode('lookupData', path.depth, path.parts);
                } else {
                    this.opcode('lookupOnContext', path.parts, path.falsy, scopedId(path));
                }
            },

            StringLiteral: function(string) {
                this.opcode('pushString', string.value);
            },

            NumberLiteral: function(number) {
                this.opcode('pushLiteral', number.value);
            },

            BooleanLiteral: function(bool) {
                this.opcode('pushLiteral', bool.value);
            },

            Hash: function(hash) {
                var pairs = hash.pairs, i, l;

                this.opcode('pushHash');

                for (i=0, l=pairs.length; i<l; i++) {
                    this.pushParam(pairs[i].value);
                }
                while (i--) {
                    this.opcode('assignToHash', pairs[i].key);
                }
                this.opcode('popHash');
            },

            // HELPERS
            opcode: function(name) {
                this.opcodes.push({ opcode: name, args: slice.call(arguments, 1), loc: this.sourceNode[0].loc });
            },

            addDepth: function(depth) {
                if(depth === 0) { return; }

                if(!this.depths[depth]) {
                    this.depths[depth] = true;
                    this.depths.list.push(depth);
                }
            },

            classifySexpr: function(sexpr) {
                // a mustache is an eligible helper if:
                // * its id is simple (a single part, not `this` or `..`)
                var isHelper = helperExpr(sexpr);

                // if a mustache is an eligible helper but not a definite
                // helper, it is ambiguous, and will be resolved in a later
                // pass or at runtime.
                var isEligible = isHelper || simpleId(sexpr.path);

                var options = this.options;

                // if ambiguous, we can possibly resolve the ambiguity now
                // An eligible helper is one that does not have a complex path, i.e. `this.foo`, `../foo` etc.
                if (isEligible && !isHelper) {
                    var name = sexpr.path.parts[0];

                    if (options.knownHelpers[name]) {
                        isHelper = true;
                    } else if (options.knownHelpersOnly) {
                        isEligible = false;
                    }
                }

                if (isHelper) { return 'helper'; }
                else if (isEligible) { return 'ambiguous'; }
                else { return 'simple'; }
            },

            pushParams: function(params) {
                for(var i=0, l=params.length; i<l; i++) {
                    this.pushParam(params[i]);
                }
            },

            pushParam: function(val) {
                var value = val.value != null ? val.value : val.original || '';

                // Force helper evaluation
                if (val.type === 'SubExpression') {
                    val.isHelper = true;
                }

                if (this.stringParams) {
                    if (value.replace) {
                        value = value
                            .replace(/^(\.?\.\/)*/g, '')
                            .replace(/\//g, '.');
                    }

                    if(val.depth) {
                        this.addDepth(val.depth);
                    }
                    this.opcode('getContext', val.depth || 0);
                    this.opcode('pushStringParam', value, val.type);

                    if (val.type === 'SubExpression') {
                        // SubExpressions get evaluated and passed in
                        // in string params mode.
                        this.accept(val);
                    }
                } else {
                    if (this.trackIds) {
                        value = val.original || value;
                        if (value.replace) {
                            value = value
                                .replace(/^\.\//g, '')
                                .replace(/^\.$/g, '');
                        }

                        this.opcode('pushId', val.type, value);
                    }
                    this.accept(val);
                }
            },

            setupFullMustacheParams: function(sexpr, program, inverse, omitEmpty) {
                var params = sexpr.params;
                this.pushParams(params);

                this.opcode('pushProgram', program);
                this.opcode('pushProgram', inverse);

                if (sexpr.hash) {
                    this.accept(sexpr.hash);
                } else {
                    this.opcode('emptyHash', omitEmpty);
                }

                return params;
            }
        };

        function precompile(input, options, env) {
            if (input == null || (typeof input !== 'string' && input.type !== 'Program')) {
                throw new Exception("You must pass a string or Handlebars AST to Handlebars.precompile. You passed " + input);
            }

            options = options || {};
            if (!('data' in options)) {
                options.data = true;
            }
            if (options.compat) {
                options.useDepths = true;
            }

            var ast = env.parse(input, options);
            var environment = new env.Compiler().compile(ast, options);
            return new env.JavaScriptCompiler().compile(environment, options);
        }
        __exports__.precompile = precompile;
        function compile(input, options, env) {
            if (input == null || (typeof input !== 'string' && input.type !== 'Program')) {
                throw new Exception("You must pass a string or Handlebars AST to Handlebars.compile. You passed " + input);
            }

            options = options || {};

            if (!('data' in options)) {
                options.data = true;
            }
            if (options.compat) {
                options.useDepths = true;
            }

            var compiled;

            function compileInput() {
                var ast = env.parse(input, options);
                var environment = new env.Compiler().compile(ast, options);
                var templateSpec = new env.JavaScriptCompiler().compile(environment, options, undefined, true);
                return env.template(templateSpec);
            }

            // Template is only compiled on first use and cached after that point.
            var ret = function(context, options) {
                if (!compiled) {
                    compiled = compileInput();
                }
                return compiled.call(this, context, options);
            };
            ret._setup = function(options) {
                if (!compiled) {
                    compiled = compileInput();
                }
                return compiled._setup(options);
            };
            ret._child = function(i, data, depths) {
                if (!compiled) {
                    compiled = compileInput();
                }
                return compiled._child(i, data, depths);
            };
            return ret;
        }
        __exports__.compile = compile;
        function argEquals(a, b) {
            if (a === b) {
                return true;
            }

            if (isArray(a) && isArray(b) && a.length === b.length) {
                for (var i = 0; i < a.length; i++) {
                    if (!argEquals(a[i], b[i])) {
                        return false;
                    }
                }
                return true;
            }
        }
        return __exports__;
    })(__module5__, __module3__);

// handlebars\compiler\code-gen.js
    var __module15__ = (function(__dependency1__) {
        "use strict";
        var __exports__;
        var isArray = __dependency1__.isArray;


        try {
            var SourceMap = require('source-map'),
                SourceNode = SourceMap.SourceNode;
        } catch (err) {
            /* istanbul ignore next: tested but not covered in istanbul due to dist build  */
            SourceNode = function(line, column, srcFile, chunks) {
                this.src = '';
                if (chunks) {
                    this.add(chunks);
                }
            };
            /* istanbul ignore next */
            SourceNode.prototype = {
                add: function(chunks) {
                    if (isArray(chunks)) {
                        chunks = chunks.join('');
                    }
                    this.src += chunks;
                },
                prepend: function(chunks) {
                    if (isArray(chunks)) {
                        chunks = chunks.join('');
                    }
                    this.src = chunks + this.src;
                },
                toStringWithSourceMap: function() {
                    return {code: this.toString()};
                },
                toString: function() {
                    return this.src;
                }
            };
        }


        function castChunk(chunk, codeGen, loc) {
            if (isArray(chunk)) {
                var ret = [];

                for (var i = 0, len = chunk.length; i < len; i++) {
                    ret.push(codeGen.wrap(chunk[i], loc));
                }
                return ret;
            } else if (typeof chunk === 'boolean' || typeof chunk === 'number') {
                // Handle primitives that the SourceNode will throw up on
                return chunk+'';
            }
            return chunk;
        }


        function CodeGen(srcFile) {
            this.srcFile = srcFile;
            this.source = [];
        }

        CodeGen.prototype = {
            prepend: function(source, loc) {
                this.source.unshift(this.wrap(source, loc));
            },
            push: function(source, loc) {
                this.source.push(this.wrap(source, loc));
            },

            merge: function() {
                var source = this.empty();
                this.each(function(line) {
                    source.add(['  ', line, '\n']);
                });
                return source;
            },

            each: function(iter) {
                for (var i = 0, len = this.source.length; i < len; i++) {
                    iter(this.source[i]);
                }
            },

            empty: function(loc) {
                loc = loc || this.currentLocation || {start:{}};
                return new SourceNode(loc.start.line, loc.start.column, this.srcFile);
            },
            wrap: function(chunk, loc) {
                if (chunk instanceof SourceNode) {
                    return chunk;
                }

                loc = loc || this.currentLocation || {start:{}};
                chunk = castChunk(chunk, this, loc);

                return new SourceNode(loc.start.line, loc.start.column, this.srcFile, chunk);
            },

            functionCall: function(fn, type, params) {
                params = this.generateList(params);
                return this.wrap([fn, type ? '.' + type + '(' : '(', params, ')']);
            },

            quotedString: function(str) {
                return '"' + (str + '')
                        .replace(/\\/g, '\\\\')
                        .replace(/"/g, '\\"')
                        .replace(/\n/g, '\\n')
                        .replace(/\r/g, '\\r')
                        .replace(/\u2028/g, '\\u2028')   // Per Ecma-262 7.3 + 7.8.4
                        .replace(/\u2029/g, '\\u2029') + '"';
            },

            objectLiteral: function(obj) {
                var pairs = [];

                for (var key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        var value = castChunk(obj[key], this);
                        if (value !== 'undefined') {
                            pairs.push([this.quotedString(key), ':', value]);
                        }
                    }
                }

                var ret = this.generateList(pairs);
                ret.prepend('{');
                ret.add('}');
                return ret;
            },


            generateList: function(entries, loc) {
                var ret = this.empty(loc);

                for (var i = 0, len = entries.length; i < len; i++) {
                    if (i) {
                        ret.add(',');
                    }

                    ret.add(castChunk(entries[i], this, loc));
                }

                return ret;
            },

            generateArray: function(entries, loc) {
                var ret = this.generateList(entries, loc);
                ret.prepend('[');
                ret.add(']');

                return ret;
            }
        };

        __exports__ = CodeGen;
        return __exports__;
    })(__module3__);

// handlebars\compiler\javascript-compiler.js
    var __module14__ = (function(__dependency1__, __dependency2__, __dependency3__, __dependency4__) {
        "use strict";
        var __exports__;
        var COMPILER_REVISION = __dependency1__.COMPILER_REVISION;
        var REVISION_CHANGES = __dependency1__.REVISION_CHANGES;

        var Exception = __dependency2__;

        var isArray = __dependency3__.isArray;

        var CodeGen = __dependency4__;


        function Literal(value) {
            this.value = value;
        }

        function JavaScriptCompiler() {}

        JavaScriptCompiler.prototype = {
            // PUBLIC API: You can override these methods in a subclass to provide
            // alternative compiled forms for name lookup and buffering semantics
            nameLookup: function(parent, name /* , type*/) {
                if (JavaScriptCompiler.isValidJavaScriptVariableName(name)) {
                    return [parent, ".", name];
                } else {
                    return [parent, "['", name, "']"];
                }
            },
            depthedLookup: function(name) {
                return [this.aliasable('this.lookup'), '(depths, "', name, '")'];
            },

            compilerInfo: function() {
                var revision = COMPILER_REVISION,
                    versions = REVISION_CHANGES[revision];
                return [revision, versions];
            },

            appendToBuffer: function(source, location, explicit) {
                // Force a source as this simplifies the merge logic.
                if (!isArray(source)) {
                    source = [source];
                }
                source = this.source.wrap(source, location);

                if (this.environment.isSimple) {
                    return ['return ', source, ';'];
                } else if (explicit) {
                    // This is a case where the buffer operation occurs as a child of another
                    // construct, generally braces. We have to explicitly output these buffer
                    // operations to ensure that the emitted code goes in the correct location.
                    return ['buffer += ', source, ';'];
                } else {
                    source.appendToBuffer = true;
                    return source;
                }
            },

            initializeBuffer: function() {
                return this.quotedString("");
            },
            // END PUBLIC API

            compile: function(environment, options, context, asObject) {
                this.environment = environment;
                this.options = options;
                this.stringParams = this.options.stringParams;
                this.trackIds = this.options.trackIds;
                this.precompile = !asObject;

                this.name = this.environment.name;
                this.isChild = !!context;
                this.context = context || {
                    programs: [],
                    environments: []
                };

                this.preamble();

                this.stackSlot = 0;
                this.stackVars = [];
                this.aliases = {};
                this.registers = { list: [] };
                this.hashes = [];
                this.compileStack = [];
                this.inlineStack = [];

                this.compileChildren(environment, options);

                this.useDepths = this.useDepths || environment.depths.list.length || this.options.compat;

                var opcodes = environment.opcodes,
                    opcode,
                    firstLoc,
                    i,
                    l;

                for (i = 0, l = opcodes.length; i < l; i++) {
                    opcode = opcodes[i];

                    this.source.currentLocation = opcode.loc;
                    firstLoc = firstLoc || opcode.loc;
                    this[opcode.opcode].apply(this, opcode.args);
                }

                // Flush any trailing content that might be pending.
                this.source.currentLocation = firstLoc;
                this.pushSource('');

                /* istanbul ignore next */
                if (this.stackSlot || this.inlineStack.length || this.compileStack.length) {
                    throw new Exception('Compile completed with content left on stack');
                }

                var fn = this.createFunctionContext(asObject);
                if (!this.isChild) {
                    var ret = {
                        compiler: this.compilerInfo(),
                        main: fn
                    };
                    var programs = this.context.programs;
                    for (i = 0, l = programs.length; i < l; i++) {
                        if (programs[i]) {
                            ret[i] = programs[i];
                        }
                    }

                    if (this.environment.usePartial) {
                        ret.usePartial = true;
                    }
                    if (this.options.data) {
                        ret.useData = true;
                    }
                    if (this.useDepths) {
                        ret.useDepths = true;
                    }
                    if (this.options.compat) {
                        ret.compat = true;
                    }

                    if (!asObject) {
                        ret.compiler = JSON.stringify(ret.compiler);

                        this.source.currentLocation = {start: {line: 1, column: 0}};
                        ret = this.objectLiteral(ret);

                        if (options.srcName) {
                            ret = ret.toStringWithSourceMap({file: options.destName});
                            ret.map = ret.map && ret.map.toString();
                        } else {
                            ret = ret.toString();
                        }
                    } else {
                        ret.compilerOptions = this.options;
                    }

                    return ret;
                } else {
                    return fn;
                }
            },

            preamble: function() {
                // track the last context pushed into place to allow skipping the
                // getContext opcode when it would be a noop
                this.lastContext = 0;
                this.source = new CodeGen(this.options.srcName);
            },

            createFunctionContext: function(asObject) {
                var varDeclarations = '';

                var locals = this.stackVars.concat(this.registers.list);
                if(locals.length > 0) {
                    varDeclarations += ", " + locals.join(", ");
                }

                // Generate minimizer alias mappings
                //
                // When using true SourceNodes, this will update all references to the given alias
                // as the source nodes are reused in situ. For the non-source node compilation mode,
                // aliases will not be used, but this case is already being run on the client and
                // we aren't concern about minimizing the template size.
                var aliasCount = 0;
                for (var alias in this.aliases) {
                    var node = this.aliases[alias];

                    if (this.aliases.hasOwnProperty(alias) && node.children && node.referenceCount > 1) {
                        varDeclarations += ', alias' + (++aliasCount) + '=' + alias;
                        node.children[0] = 'alias' + aliasCount;
                    }
                }

                var params = ["depth0", "helpers", "partials", "data"];

                if (this.useDepths) {
                    params.push('depths');
                }

                // Perform a second pass over the output to merge content when possible
                var source = this.mergeSource(varDeclarations);

                if (asObject) {
                    params.push(source);

                    return Function.apply(this, params);
                } else {
                    return this.source.wrap(['function(', params.join(','), ') {\n  ', source, '}']);
                }
            },
            mergeSource: function(varDeclarations) {
                var isSimple = this.environment.isSimple,
                    appendOnly = !this.forceBuffer,
                    appendFirst,

                    sourceSeen,
                    bufferStart,
                    bufferEnd;
                this.source.each(function(line) {
                    if (line.appendToBuffer) {
                        if (bufferStart) {
                            line.prepend('  + ');
                        } else {
                            bufferStart = line;
                        }
                        bufferEnd = line;
                    } else {
                        if (bufferStart) {
                            if (!sourceSeen) {
                                appendFirst = true;
                            } else {
                                bufferStart.prepend('buffer += ');
                            }
                            bufferEnd.add(';');
                            bufferStart = bufferEnd = undefined;
                        }

                        sourceSeen = true;
                        if (!isSimple) {
                            appendOnly = false;
                        }
                    }
                });


                if (appendOnly) {
                    if (bufferStart) {
                        bufferStart.prepend('return ');
                        bufferEnd.add(';');
                    } else {
                        this.source.push('return "";');
                    }
                } else {
                    varDeclarations += ", buffer = " + (appendFirst ? '' : this.initializeBuffer());

                    if (bufferStart) {
                        bufferStart.prepend('return buffer + ');
                        bufferEnd.add(';');
                    } else {
                        this.source.push('return buffer;');
                    }
                }

                if (varDeclarations) {
                    this.source.prepend('var ' + varDeclarations.substring(2) + (appendFirst ? '' : ';\n  '));
                }

                return this.source.merge();
            },

            // [blockValue]
            //
            // On stack, before: hash, inverse, program, value
            // On stack, after: return value of blockHelperMissing
            //
            // The purpose of this opcode is to take a block of the form
            // `{{#this.foo}}...{{/this.foo}}`, resolve the value of `foo`, and
            // replace it on the stack with the result of properly
            // invoking blockHelperMissing.
            blockValue: function(name) {
                var blockHelperMissing = this.aliasable('helpers.blockHelperMissing'),
                    params = [this.contextName(0)];
                this.setupHelperArgs(name, 0, params);

                var blockName = this.popStack();
                params.splice(1, 0, blockName);

                this.push(this.source.functionCall(blockHelperMissing, 'call', params));
            },

            // [ambiguousBlockValue]
            //
            // On stack, before: hash, inverse, program, value
            // Compiler value, before: lastHelper=value of last found helper, if any
            // On stack, after, if no lastHelper: same as [blockValue]
            // On stack, after, if lastHelper: value
            ambiguousBlockValue: function() {
                // We're being a bit cheeky and reusing the options value from the prior exec
                var blockHelperMissing = this.aliasable('helpers.blockHelperMissing'),
                    params = [this.contextName(0)];
                this.setupHelperArgs('', 0, params, true);

                this.flushInline();

                var current = this.topStack();
                params.splice(1, 0, current);

                this.pushSource([
                    'if (!', this.lastHelper, ') { ',
                    current, ' = ', this.source.functionCall(blockHelperMissing, 'call', params),
                    '}']);
            },

            // [appendContent]
            //
            // On stack, before: ...
            // On stack, after: ...
            //
            // Appends the string value of `content` to the current buffer
            appendContent: function(content) {
                if (this.pendingContent) {
                    content = this.pendingContent + content;
                } else {
                    this.pendingLocation = this.source.currentLocation;
                }

                this.pendingContent = content;
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
                if (this.isInline()) {
                    this.replaceStack(function(current) {
                        return [' != null ? ', current, ' : ""'];
                    });

                    this.pushSource(this.appendToBuffer(this.popStack()));
                } else {
                    var local = this.popStack();
                    this.pushSource(['if (', local, ' != null) { ', this.appendToBuffer(local, undefined, true), ' }']);
                    if (this.environment.isSimple) {
                        this.pushSource(['else { ', this.appendToBuffer("''", undefined, true), ' }']);
                    }
                }
            },

            // [appendEscaped]
            //
            // On stack, before: value, ...
            // On stack, after: ...
            //
            // Escape `value` and append it to the buffer
            appendEscaped: function() {
                this.pushSource(this.appendToBuffer(
                    [this.aliasable('this.escapeExpression'), '(', this.popStack(), ')']));
            },

            // [getContext]
            //
            // On stack, before: ...
            // On stack, after: ...
            // Compiler value, after: lastContext=depth
            //
            // Set the value of the `lastContext` compiler value to the depth
            getContext: function(depth) {
                this.lastContext = depth;
            },

            // [pushContext]
            //
            // On stack, before: ...
            // On stack, after: currentContext, ...
            //
            // Pushes the value of the current context onto the stack.
            pushContext: function() {
                this.pushStackLiteral(this.contextName(this.lastContext));
            },

            // [lookupOnContext]
            //
            // On stack, before: ...
            // On stack, after: currentContext[name], ...
            //
            // Looks up the value of `name` on the current context and pushes
            // it onto the stack.
            lookupOnContext: function(parts, falsy, scoped) {
                /*jshint -W083 */
                var i = 0,
                    len = parts.length;

                if (!scoped && this.options.compat && !this.lastContext) {
                    // The depthed query is expected to handle the undefined logic for the root level that
                    // is implemented below, so we evaluate that directly in compat mode
                    this.push(this.depthedLookup(parts[i++]));
                } else {
                    this.pushContext();
                }

                for (; i < len; i++) {
                    this.replaceStack(function(current) {
                        var lookup = this.nameLookup(current, parts[i], 'context');
                        // We want to ensure that zero and false are handled properly if the context (falsy flag)
                        // needs to have the special handling for these values.
                        if (!falsy) {
                            return [' != null ? ', lookup, ' : ', current];
                        } else {
                            // Otherwise we can use generic falsy handling
                            return [' && ', lookup];
                        }
                    });
                }
            },

            // [lookupData]
            //
            // On stack, before: ...
            // On stack, after: data, ...
            //
            // Push the data lookup operator
            lookupData: function(depth, parts) {
                /*jshint -W083 */
                if (!depth) {
                    this.pushStackLiteral('data');
                } else {
                    this.pushStackLiteral('this.data(data, ' + depth + ')');
                }

                for (var i = 0, len = parts.length; i < len; i++) {
                    this.replaceStack(function(current) {
                        return [' && ', this.nameLookup(current, parts[i], 'data')];
                    });
                }
            },

            // [resolvePossibleLambda]
            //
            // On stack, before: value, ...
            // On stack, after: resolved value, ...
            //
            // If the `value` is a lambda, replace it on the stack by
            // the return value of the lambda
            resolvePossibleLambda: function() {
                this.push([this.aliasable('this.lambda'), '(', this.popStack(), ', ', this.contextName(0), ')']);
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
                this.pushContext();
                this.pushString(type);

                // If it's a subexpression, the string result
                // will be pushed after this opcode.
                if (type !== 'SubExpression') {
                    if (typeof string === 'string') {
                        this.pushString(string);
                    } else {
                        this.pushStackLiteral(string);
                    }
                }
            },

            emptyHash: function(omitEmpty) {
                if (this.trackIds) {
                    this.push('{}'); // hashIds
                }
                if (this.stringParams) {
                    this.push('{}'); // hashContexts
                    this.push('{}'); // hashTypes
                }
                this.pushStackLiteral(omitEmpty ? 'undefined' : '{}');
            },
            pushHash: function() {
                if (this.hash) {
                    this.hashes.push(this.hash);
                }
                this.hash = {values: [], types: [], contexts: [], ids: []};
            },
            popHash: function() {
                var hash = this.hash;
                this.hash = this.hashes.pop();

                if (this.trackIds) {
                    this.push(this.objectLiteral(hash.ids));
                }
                if (this.stringParams) {
                    this.push(this.objectLiteral(hash.contexts));
                    this.push(this.objectLiteral(hash.types));
                }

                this.push(this.objectLiteral(hash.values));
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
            invokeHelper: function(paramSize, name, isSimple) {
                var nonHelper = this.popStack();
                var helper = this.setupHelper(paramSize, name);
                var simple = isSimple ? [helper.name, ' || '] : '';

                this.push(
                    this.source.functionCall(
                        ['('].concat(simple, nonHelper, ' || ', this.aliasable('helpers.helperMissing'), ')'),
                        'call',
                        helper.callParams));
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
                this.push(this.source.functionCall(helper.name, 'call', helper.callParams));
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
            invokeAmbiguous: function(name, helperCall) {
                this.useRegister('helper');

                var nonHelper = this.popStack();

                this.emptyHash();
                var helper = this.setupHelper(0, name, helperCall);

                var helperName = this.lastHelper = this.nameLookup('helpers', name, 'helper');

                this.push([
                    '((helper = (helper = ', helperName, ' || ', nonHelper, ') != null ? helper : ',
                    this.aliasable('helpers.helperMissing'),
                    (helper.paramsInit ? ['),(', helper.paramsInit] : []), '),',
                    '(typeof helper === ', this.aliasable('"function"'), ' ? ',
                    this.source.functionCall('helper','call', helper.callParams), ' : helper))'
                ]);
            },

            // [invokePartial]
            //
            // On stack, before: context, ...
            // On stack after: result of partial invocation
            //
            // This operation pops off a context, invokes a partial with that context,
            // and pushes the result of the invocation back.
            invokePartial: function(name, indent) {
                var params = [],
                    options = this.setupParams(name, 1, params, false);

                if (indent) {
                    options.indent = JSON.stringify(indent);
                }
                options.helpers = 'helpers';
                options.partials = 'partials';

                params.unshift(this.nameLookup('partials', name, 'partial'));

                if (this.options.compat) {
                    options.depths = 'depths';
                }
                options = this.objectLiteral(options);
                params.push(options);

                this.push(this.source.functionCall('this.invokePartial', '', params));
            },

            // [assignToHash]
            //
            // On stack, before: value, ..., hash, ...
            // On stack, after: ..., hash, ...
            //
            // Pops a value off the stack and assigns it to the current hash
            assignToHash: function(key) {
                var value = this.popStack(),
                    context,
                    type,
                    id;

                if (this.trackIds) {
                    id = this.popStack();
                }
                if (this.stringParams) {
                    type = this.popStack();
                    context = this.popStack();
                }

                var hash = this.hash;
                if (context) {
                    hash.contexts[key] = context;
                }
                if (type) {
                    hash.types[key] = type;
                }
                if (id) {
                    hash.ids[key] = id;
                }
                hash.values[key] = value;
            },

            pushId: function(type, name) {
                if (type === 'PathExpression') {
                    this.pushString(name);
                } else if (type === 'SubExpression') {
                    this.pushStackLiteral('true');
                } else {
                    this.pushStackLiteral('null');
                }
            },

            // HELPERS

            compiler: JavaScriptCompiler,

            compileChildren: function(environment, options) {
                var children = environment.children, child, compiler;

                for(var i=0, l=children.length; i<l; i++) {
                    child = children[i];
                    compiler = new this.compiler();

                    var index = this.matchExistingProgram(child);

                    if (index == null) {
                        this.context.programs.push('');     // Placeholder to prevent name conflicts for nested children
                        index = this.context.programs.length;
                        child.index = index;
                        child.name = 'program' + index;
                        this.context.programs[index] = compiler.compile(child, options, this.context, !this.precompile);
                        this.context.environments[index] = child;

                        this.useDepths = this.useDepths || compiler.useDepths;
                    } else {
                        child.index = index;
                        child.name = 'program' + index;
                    }
                }
            },
            matchExistingProgram: function(child) {
                for (var i = 0, len = this.context.environments.length; i < len; i++) {
                    var environment = this.context.environments[i];
                    if (environment && environment.equals(child)) {
                        return i;
                    }
                }
            },

            programExpression: function(guid) {
                var child = this.environment.children[guid],
                    depths = child.depths.list,
                    useDepths = this.useDepths,
                    depth;

                var programParams = [child.index, 'data'];

                if (useDepths) {
                    programParams.push('depths');
                }

                return 'this.program(' + programParams.join(', ') + ')';
            },

            useRegister: function(name) {
                if(!this.registers[name]) {
                    this.registers[name] = true;
                    this.registers.list.push(name);
                }
            },

            push: function(expr) {
                if (!(expr instanceof Literal)) {
                    expr = this.source.wrap(expr);
                }

                this.inlineStack.push(expr);
                return expr;
            },

            pushStackLiteral: function(item) {
                this.push(new Literal(item));
            },

            pushSource: function(source) {
                if (this.pendingContent) {
                    this.source.push(
                        this.appendToBuffer(this.source.quotedString(this.pendingContent), this.pendingLocation));
                    this.pendingContent = undefined;
                }

                if (source) {
                    this.source.push(source);
                }
            },

            replaceStack: function(callback) {
                var prefix = ['('],
                    inline = this.isInline(),
                    stack,
                    createdStack,
                    usedLiteral;

                /* istanbul ignore next */
                if (!this.isInline()) {
                    throw new Exception('replaceStack on non-inline');
                }

                // We want to merge the inline statement into the replacement statement via ','
                var top = this.popStack(true);

                if (top instanceof Literal) {
                    // Literals do not need to be inlined
                    stack = [top.value];
                    prefix = ['(', stack];
                    usedLiteral = true;
                } else {
                    // Get or create the current stack name for use by the inline
                    createdStack = true;
                    var name = this.incrStack();

                    prefix = ['((', this.push(name), ' = ', top, ')'];
                    stack = this.topStack();
                }

                var item = callback.call(this, stack);

                if (!usedLiteral) {
                    this.popStack();
                }
                if (createdStack) {
                    this.stackSlot--;
                }
                this.push(prefix.concat(item, ')'));
            },

            incrStack: function() {
                this.stackSlot++;
                if(this.stackSlot > this.stackVars.length) { this.stackVars.push("stack" + this.stackSlot); }
                return this.topStackName();
            },
            topStackName: function() {
                return "stack" + this.stackSlot;
            },
            flushInline: function() {
                var inlineStack = this.inlineStack;
                this.inlineStack = [];
                for (var i = 0, len = inlineStack.length; i < len; i++) {
                    var entry = inlineStack[i];
                    /* istanbul ignore if */
                    if (entry instanceof Literal) {
                        this.compileStack.push(entry);
                    } else {
                        var stack = this.incrStack();
                        this.pushSource([stack, ' = ', entry, ';']);
                        this.compileStack.push(stack);
                    }
                }
            },
            isInline: function() {
                return this.inlineStack.length;
            },

            popStack: function(wrapped) {
                var inline = this.isInline(),
                    item = (inline ? this.inlineStack : this.compileStack).pop();

                if (!wrapped && (item instanceof Literal)) {
                    return item.value;
                } else {
                    if (!inline) {
                        /* istanbul ignore next */
                        if (!this.stackSlot) {
                            throw new Exception('Invalid stack pop');
                        }
                        this.stackSlot--;
                    }
                    return item;
                }
            },

            topStack: function() {
                var stack = (this.isInline() ? this.inlineStack : this.compileStack),
                    item = stack[stack.length - 1];

                /* istanbul ignore if */
                if (item instanceof Literal) {
                    return item.value;
                } else {
                    return item;
                }
            },

            contextName: function(context) {
                if (this.useDepths && context) {
                    return 'depths[' + context + ']';
                } else {
                    return 'depth' + context;
                }
            },

            quotedString: function(str) {
                return this.source.quotedString(str);
            },

            objectLiteral: function(obj) {
                return this.source.objectLiteral(obj);
            },

            aliasable: function(name) {
                var ret = this.aliases[name];
                if (ret) {
                    ret.referenceCount++;
                    return ret;
                }

                ret = this.aliases[name] = this.source.wrap(name);
                ret.aliasable = true;
                ret.referenceCount = 1;

                return ret;
            },

            setupHelper: function(paramSize, name, blockHelper) {
                var params = [],
                    paramsInit = this.setupHelperArgs(name, paramSize, params, blockHelper);
                var foundHelper = this.nameLookup('helpers', name, 'helper');

                return {
                    params: params,
                    paramsInit: paramsInit,
                    name: foundHelper,
                    callParams: [this.contextName(0)].concat(params)
                };
            },

            setupParams: function(helper, paramSize, params) {
                var options = {}, contexts = [], types = [], ids = [], param;

                options.name = this.quotedString(helper);
                options.hash = this.popStack();

                if (this.trackIds) {
                    options.hashIds = this.popStack();
                }
                if (this.stringParams) {
                    options.hashTypes = this.popStack();
                    options.hashContexts = this.popStack();
                }

                var inverse = this.popStack(),
                    program = this.popStack();

                // Avoid setting fn and inverse if neither are set. This allows
                // helpers to do a check for `if (options.fn)`
                if (program || inverse) {
                    options.fn = program || 'this.noop';
                    options.inverse = inverse || 'this.noop';
                }

                // The parameters go on to the stack in order (making sure that they are evaluated in order)
                // so we need to pop them off the stack in reverse order
                var i = paramSize;
                while (i--) {
                    param = this.popStack();
                    params[i] = param;

                    if (this.trackIds) {
                        ids[i] = this.popStack();
                    }
                    if (this.stringParams) {
                        types[i] = this.popStack();
                        contexts[i] = this.popStack();
                    }
                }

                if (this.trackIds) {
                    options.ids = this.source.generateArray(ids);
                }
                if (this.stringParams) {
                    options.types = this.source.generateArray(types);
                    options.contexts = this.source.generateArray(contexts);
                }

                if (this.options.data) {
                    options.data = "data";
                }
                return options;
            },

            setupHelperArgs: function(helper, paramSize, params, useRegister) {
                var options = this.setupParams(helper, paramSize, params, true);
                options = this.objectLiteral(options);
                if (useRegister) {
                    this.useRegister('options');
                    params.push('options');
                    return ['options=', options];
                } else {
                    params.push(options);
                    return '';
                }
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
            return !JavaScriptCompiler.RESERVED_WORDS[name] && /^[a-zA-Z_$][0-9a-zA-Z_$]*$/.test(name);
        };

        __exports__ = JavaScriptCompiler;
        return __exports__;
    })(__module2__, __module5__, __module3__, __module15__);

// handlebars.js
    var __module0__ = (function(__dependency1__, __dependency2__, __dependency3__, __dependency4__, __dependency5__) {
        "use strict";
        var __exports__;
        /*globals Handlebars: true */
        var Handlebars = __dependency1__;


        // Compiler imports
        var AST = __dependency2__;

        var Parser = __dependency3__.parser;
        var parse = __dependency3__.parse;

        var Compiler = __dependency4__.Compiler;
        var compile = __dependency4__.compile;
        var precompile = __dependency4__.precompile;

        var JavaScriptCompiler = __dependency5__;


        var _create = Handlebars.create;
        var create = function() {
            var hb = _create();

            hb.compile = function(input, options) {
                return compile(input, options, hb);
            };
            hb.precompile = function (input, options) {
                return precompile(input, options, hb);
            };

            hb.AST = AST;
            hb.Compiler = Compiler;
            hb.JavaScriptCompiler = JavaScriptCompiler;
            hb.Parser = Parser;
            hb.parse = parse;

            return hb;
        };

        Handlebars = create();
        Handlebars.create = create;

        /*jshint -W040 */
        var root = typeof global !== 'undefined' ? global : window,
            $Handlebars = root.Handlebars;
        Handlebars.noConflict = function() {
            if (root.Handlebars === Handlebars) {
                root.Handlebars = $Handlebars;
            }
        };

        Handlebars['default'] = Handlebars;

        __exports__ = Handlebars;
        return __exports__;
    })(__module1__, __module7__, __module8__, __module13__, __module14__);

    return __module0__;
}));
