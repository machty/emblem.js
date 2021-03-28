var loader, define, requireModule, require, requirejs;

(function (global) {
  'use strict';

  var heimdall = global.heimdall;

  var _heimdall$registerMon = heimdall.registerMonitor('loaderjs', 'define', 'require', 'reify', 'findDeps', 'modules', 'exports', 'resolve', 'resolveRelative', 'findModule', 'pendingQueueLength'),
      __define = _heimdall$registerMon.define,
      __require = _heimdall$registerMon.require,
      __exports = _heimdall$registerMon.exports,
      __findModule = _heimdall$registerMon.findModule,
      __resolve = _heimdall$registerMon.resolve,
      reify = _heimdall$registerMon.reify,
      findDeps = _heimdall$registerMon.findDeps,
      modules = _heimdall$registerMon.modules,
      resolveRelative = _heimdall$registerMon.resolveRelative,
      pendingQueueLength = _heimdall$registerMon.pendingQueueLength;

  function dict() {
    var obj = Object.create(null);
    obj['__'] = undefined;
    delete obj['__'];
    return obj;
  }

  // Save off the original values of these globals, so we can restore them if someone asks us to
  var oldGlobals = {
    loader: loader,
    define: define,
    requireModule: requireModule,
    require: require,
    requirejs: requirejs
  };

  requirejs = require = requireModule = function (id) {
    var token = heimdall.start('require');
    heimdall.increment(__require);
    var pending = [];
    var mod = findModule(id, '(require)', pending);

    for (var i = pending.length - 1; i >= 0; i--) {
      pending[i].exports();
    }

    heimdall.stop(token);
    return mod.module.exports;
  };

  loader = {
    noConflict: function (aliases) {
      var oldName, newName;

      for (oldName in aliases) {
        if (aliases.hasOwnProperty(oldName)) {
          if (oldGlobals.hasOwnProperty(oldName)) {
            newName = aliases[oldName];

            global[newName] = global[oldName];
            global[oldName] = oldGlobals[oldName];
          }
        }
      }
    },
    // Option to enable or disable the generation of default exports
    makeDefaultExport: true
  };

  var registry = dict();
  var seen = dict();

  var uuid = 0;

  function unsupportedModule(length) {
    throw new Error('an unsupported module was defined, expected `define(id, deps, module)` instead got: `' + length + '` arguments to define`');
  }

  var defaultDeps = ['require', 'exports', 'module'];

  function Module(id, deps, callback, alias) {
    heimdall.increment(modules);
    this.uuid = uuid++;
    this.id = id;
    this.deps = !deps.length && callback.length ? defaultDeps : deps;
    this.module = { exports: {} };
    this.callback = callback;
    this.hasExportsAsDep = false;
    this.isAlias = alias;
    this.reified = new Array(deps.length);

    /*
       Each module normally passes through these states, in order:
         new       : initial state
         pending   : this module is scheduled to be executed
         reifying  : this module's dependencies are being executed
         reified   : this module's dependencies finished executing successfully
         errored   : this module's dependencies failed to execute
         finalized : this module executed successfully
     */
    this.state = 'new';
  }

  Module.prototype.makeDefaultExport = function () {
    var exports = this.module.exports;
    if (exports !== null && (typeof exports === 'object' || typeof exports === 'function') && exports['default'] === undefined && Object.isExtensible(exports)) {
      exports['default'] = exports;
    }
  };

  Module.prototype.exports = function () {
    // if finalized, there is no work to do. If reifying, there is a
    // circular dependency so we must return our (partial) exports.
    if (this.state === 'finalized' || this.state === 'reifying') {
      return this.module.exports;
    }
    heimdall.increment(__exports);

    if (loader.wrapModules) {
      this.callback = loader.wrapModules(this.id, this.callback);
    }

    this.reify();

    var result = this.callback.apply(this, this.reified);
    this.reified.length = 0;
    this.state = 'finalized';

    if (!(this.hasExportsAsDep && result === undefined)) {
      this.module.exports = result;
    }
    if (loader.makeDefaultExport) {
      this.makeDefaultExport();
    }
    return this.module.exports;
  };

  Module.prototype.unsee = function () {
    this.state = 'new';
    this.module = { exports: {} };
  };

  Module.prototype.reify = function () {
    if (this.state === 'reified') {
      return;
    }
    this.state = 'reifying';
    try {
      this.reified = this._reify();
      this.state = 'reified';
    } finally {
      if (this.state === 'reifying') {
        this.state = 'errored';
      }
    }
  };

  Module.prototype._reify = function () {
    heimdall.increment(reify);
    var reified = this.reified.slice();
    for (var i = 0; i < reified.length; i++) {
      var mod = reified[i];
      reified[i] = mod.exports ? mod.exports : mod.module.exports();
    }
    return reified;
  };

  Module.prototype.findDeps = function (pending) {
    if (this.state !== 'new') {
      return;
    }

    heimdall.increment(findDeps);
    this.state = 'pending';

    var deps = this.deps;

    for (var i = 0; i < deps.length; i++) {
      var dep = deps[i];
      var entry = this.reified[i] = { exports: undefined, module: undefined };
      if (dep === 'exports') {
        this.hasExportsAsDep = true;
        entry.exports = this.module.exports;
      } else if (dep === 'require') {
        entry.exports = this.makeRequire();
      } else if (dep === 'module') {
        entry.exports = this.module;
      } else {
        entry.module = findModule(resolve(dep, this.id), this.id, pending);
      }
    }
  };

  Module.prototype.makeRequire = function () {
    var id = this.id;
    var r = function (dep) {
      return require(resolve(dep, id));
    };
    r['default'] = r;
    r.moduleId = id;
    r.has = function (dep) {
      return has(resolve(dep, id));
    };
    return r;
  };

  define = function (id, deps, callback) {
    var module = registry[id];

    // If a module for this id has already been defined and is in any state
    // other than `new` (meaning it has been or is currently being required),
    // then we return early to avoid redefinition.
    if (module && module.state !== 'new') {
      return;
    }

    var token = heimdall.start('define');
    heimdall.increment(__define);
    if (arguments.length < 2) {
      unsupportedModule(arguments.length);
    }

    if (!Array.isArray(deps)) {
      callback = deps;
      deps = [];
    }

    if (callback instanceof Alias) {
      registry[id] = new Module(callback.id, deps, callback, true);
    } else {
      registry[id] = new Module(id, deps, callback, false);
    }
    heimdall.stop(token);
  };

  define.exports = function (name, defaultExport) {
    var module = registry[name];

    // If a module for this name has already been defined and is in any state
    // other than `new` (meaning it has been or is currently being required),
    // then we return early to avoid redefinition.
    if (module && module.state !== 'new') {
      return;
    }

    module = new Module(name, [], noop, null);
    module.module.exports = defaultExport;
    module.state = 'finalized';
    registry[name] = module;

    return module;
  };

  function noop() {}
  // we don't support all of AMD
  // define.amd = {};

  function Alias(id) {
    this.id = id;
  }

  define.alias = function (id, target) {
    if (arguments.length === 2) {
      return define(target, new Alias(id));
    }

    return new Alias(id);
  };

  function missingModule(id, referrer) {
    throw new Error('Could not find module `' + id + '` imported from `' + referrer + '`');
  }

  function findModule(id, referrer, pending) {
    heimdall.increment(__findModule);
    var mod = registry[id] || registry[id + '/index'];

    while (mod && mod.isAlias) {
      mod = registry[mod.id] || registry[mod.id + '/index'];
    }

    if (!mod) {
      missingModule(id, referrer);
    }

    if (pending && mod.state !== 'pending' && mod.state !== 'finalized') {
      mod.findDeps(pending);
      pending.push(mod);
      heimdall.increment(pendingQueueLength);
    }
    return mod;
  }

  function resolve(child, id) {
    heimdall.increment(__resolve);
    if (child.charAt(0) !== '.') {
      return child;
    }
    heimdall.increment(resolveRelative);

    var parts = child.split('/');
    var nameParts = id.split('/');
    var parentBase = nameParts.slice(0, -1);

    for (var i = 0, l = parts.length; i < l; i++) {
      var part = parts[i];

      if (part === '..') {
        if (parentBase.length === 0) {
          throw new Error('Cannot access parent module of root');
        }
        parentBase.pop();
      } else if (part === '.') {
        continue;
      } else {
        parentBase.push(part);
      }
    }

    return parentBase.join('/');
  }

  function has(id) {
    return !!(registry[id] || registry[id + '/index']);
  }

  requirejs.entries = requirejs._eak_seen = registry;
  requirejs.has = has;
  requirejs.unsee = function (id) {
    findModule(id, '(unsee)', false).unsee();
  };

  requirejs.clear = function () {
    requirejs.entries = requirejs._eak_seen = registry = dict();
    seen = dict();
  };

  // This code primes the JS engine for good performance by warming the
  // JIT compiler for these functions.
  define('foo', function () {});
  define('foo/bar', [], function () {});
  define('foo/asdf', ['module', 'exports', 'require'], function (module, exports, require) {
    if (require.has('foo/bar')) {
      require('foo/bar');
    }
  });
  define('foo/baz', [], define.alias('foo'));
  define('foo/quz', define.alias('foo'));
  define.alias('foo', 'foo/qux');
  define('foo/bar', ['foo', './quz', './baz', './asdf', './bar', '../foo'], function () {});
  define('foo/main', ['foo/bar'], function () {});
  define.exports('foo/exports', {});

  require('foo/exports');
  require('foo/main');
  require.unsee('foo/bar');

  requirejs.clear();

  if (typeof exports === 'object' && typeof module === 'object' && module.exports) {
    module.exports = { require: require, define: define };
  }
})(this);