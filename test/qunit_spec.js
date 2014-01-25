var CompilerContext, Ember, EmberHandlebars, Emblem, Handlebars, LoadedEmber, bindAttrHelper, compileWithPartials, equal, equals, ok, precompileEmber, runTextLineSuite, shouldCompileTo, shouldCompileToString, shouldCompileToWithPartials, shouldEmberPrecompileToHelper, shouldThrow, supportsSubexpressions, throws, _equal, _ref,
  __hasProp = {}.hasOwnProperty;

Ember = (typeof window !== "undefined" && window !== null ? window.Emblem : void 0) || this.Emblem || {};

LoadedEmber = LoadedEmber || {};

Ember.Handlebars = LoadedEmber.Handlebars;

Ember.warn = LoadedEmber.warn;

if (typeof Emblem !== "undefined" && Emblem !== null) {
  _equal = equal;
  equals = equal = function(a, b, msg) {
    return _equal(a, b, msg || '');
  };
  window.suite = module;
} else {
  Handlebars = require('handlebars');
  EmberHandlebars = require('./resources/ember-template-compiler.js').EmberHandlebars;
  Emblem = require('../lib/emblem');
  expect = function() {};;
  _ref = require("assert"), equal = _ref.equal, equals = _ref.equals, ok = _ref.ok, throws = _ref.throws;
}

if (typeof CompilerContext === "undefined" || CompilerContext === null) {
  CompilerContext = {
    compile: function(template, options) {
      return Emblem.compile(Handlebars, template, options);
    }
  };
}

supportsSubexpressions = Handlebars.VERSION.slice(0, 3) >= 1.3;

precompileEmber = function(emblem) {
  return Emblem.precompile(EmberHandlebars, emblem).toString();
};

shouldEmberPrecompileToHelper = function(emblem, helper) {
  var result;
  if (helper == null) {
    helper = 'bind-attr';
  }
  result = precompileEmber(emblem);
  ok((result.match("helpers." + helper)) || (result.match("helpers\\['" + helper + "'\\]")));
  return result;
};

shouldCompileToString = function(string, hashOrArray, expected) {
  if (hashOrArray.constructor === String) {
    return shouldCompileToWithPartials(string, {}, false, hashOrArray, null, true);
  } else {
    return shouldCompileToWithPartials(string, hashOrArray, false, expected, null, true);
  }
};

shouldCompileTo = function(string, hashOrArray, expected, message) {
  if (hashOrArray.constructor === String) {
    return shouldCompileToWithPartials(string, {}, false, hashOrArray, message);
  } else {
    return shouldCompileToWithPartials(string, hashOrArray, false, expected, message);
  }
};

shouldCompileToWithPartials = function(string, hashOrArray, partials, expected, message, strings) {
  var options, result;
  options = null;
  if (strings) {
    options = {};
    options.stringParams = true;
  }
  result = compileWithPartials(string, hashOrArray, partials, options);
  return equal(result, expected, "'" + result + "' should === '" + expected + "': " + message);
};

compileWithPartials = function(string, hashOrArray, partials, options) {
  var ary, helpers, prop, template;
  if (options == null) {
    options = {};
  }
  template = CompilerContext.compile(string, options);
  if (Object.prototype.toString.call(hashOrArray) === "[object Array]") {
    if (helpers = hashOrArray[1]) {
      for (prop in Handlebars.helpers) {
        helpers[prop] = helpers[prop] || Handlebars.helpers[prop];
      }
    }
    ary = [];
    ary.push(hashOrArray[0]);
    ary.push({
      helpers: hashOrArray[1],
      partials: hashOrArray[2]
    });
  } else {
    ary = [hashOrArray];
  }
  return template.apply(this, ary);
};

shouldThrow = function(fn, exMessage) {
  var caught, e;
  caught = false;
  try {
    fn();
  } catch (_error) {
    e = _error;
    caught = true;
    if (exMessage) {
      ok(e.message.match(exMessage), "exception message matched");
    }
  }
  return ok(caught, "an exception was thrown");
};

Handlebars.registerHelper('echo', function(param) {
  return "ECHO " + param;
});

suite("html one-liners");

test("element only", function() {
  return shouldCompileTo("p", "<p></p>");
});

test("with text", function() {
  return shouldCompileTo("p Hello", "<p>Hello</p>");
});

test("with more complex text", function() {
  return shouldCompileTo("p Hello, how's it going with you today?", "<p>Hello, how's it going with you today?</p>");
});

test("with trailing space", function() {
  return shouldCompileTo("p Hello   ", "<p>Hello   </p>");
});

suite("html multi-lines");

test("two lines", function() {
  var emblem;
  emblem = "p This is\n  pretty cool.";
  return shouldCompileTo(emblem, "<p>This is pretty cool.</p>");
});

test("three lines", function() {
  var emblem;
  emblem = "p This is\n  pretty damn\n  cool.";
  return shouldCompileTo(emblem, "<p>This is pretty damn cool.</p>");
});

test("three lines w/ embedded html", function() {
  var emblem;
  emblem = "p This is\n  pretty <span>damn</span>\n  cool.";
  return shouldCompileTo(emblem, "<p>This is pretty <span>damn</span> cool.</p>");
});

test("indentation doesn't need to match starting inline content's", function() {
  var emblem;
  emblem = "span Hello,\n  How are you?";
  return shouldCompileTo(emblem, "<span>Hello, How are you?</span>");
});

test("indentation may vary between parent/child, must be consistent within inline-block", function() {
  var emblem;
  emblem = "div\n      span Hello,\n           How are you?\n           Excellent.\n      p asd";
  shouldCompileTo(emblem, "<div><span>Hello, How are you? Excellent.</span><p>asd</p></div>");
  emblem = "div\n  span Hello,\n       How are you?\n     Excellent.";
  return shouldThrow(function() {
    return CompilerContext.compile(emblem);
  });
});

test("indentation may vary between parent/child, must be consistent within inline-block pt 2", function() {
  var emblem;
  emblem = "div\n  span Hello,\n       How are you?\n       Excellent.";
  return shouldCompileTo(emblem, "<div><span>Hello, How are you? Excellent.</span></div>");
});

test("w/ mustaches", function() {
  var emblem;
  emblem = "div\n  span Hello,\n       {{foo}} are you?\n       Excellent.";
  return shouldCompileTo(emblem, {
    foo: "YEAH"
  }, "<div><span>Hello, YEAH are you? Excellent.</span></div>");
});

test("w/ block mustaches", function() {
  var emblem;
  emblem = 'p Hello, #{ sally | Hello},\n  and {{sally: span Hello}}!';
  shouldCompileTo(emblem, '<p>Hello, <sally class="none">Hello</sally>, and <sally class="none"><span>Hello</span></sally>!</p>');
  emblem = 'p Hello, #{ sally: span: a Hello}!';
  return shouldCompileTo(emblem, '<p>Hello, <sally class="none"><span><a>Hello</a></span></sally>!</p>');
});

test("with followup", function() {
  var emblem;
  emblem = "p This is\n  pretty cool.\np Hello.";
  return shouldCompileTo(emblem, "<p>This is pretty cool.</p><p>Hello.</p>");
});

suite('#{} syntax');

test('acts like {{}}', function() {
  var emblem;
  emblem = 'span Yo #{foo}, I herd.';
  return shouldCompileTo(emblem, {
    foo: '<span>123</span>'
  }, "<span>Yo &lt;span&gt;123&lt;/span&gt;, I herd.</span>");
});

test('can start inline content', function() {
  var emblem;
  emblem = 'span #{foo}, I herd.';
  return shouldCompileTo(emblem, {
    foo: "dawg"
  }, "<span>dawg, I herd.</span>");
});

test('can end inline content', function() {
  var emblem;
  emblem = 'span I herd #{foo}';
  return shouldCompileTo(emblem, {
    foo: "dawg"
  }, "<span>I herd dawg</span>");
});

test("doesn't screw up parsing when # used in text nodes", function() {
  var emblem;
  emblem = 'span OMG #YOLO';
  return shouldCompileTo(emblem, "<span>OMG #YOLO</span>");
});

test("# can be only thing on line", function() {
  var emblem;
  emblem = 'span #';
  return shouldCompileTo(emblem, "<span>#</span>");
});

/* TODO: this
test "can be escaped", ->
  emblem =
  '''
  span #\\{yes}
  '''
  shouldCompileTo emblem, '<span>#{yes}</span>'
*/


runTextLineSuite = function(ch) {
  var sct;
  sct = function(emblem, obj, expected) {
    if (expected == null) {
      expected = obj;
      obj = {};
    }
    if (ch !== '`') {
      expected = expected.replace(/\n/g, "");
    }
    if (ch === "'") {
      expected = expected.replace(/\t/g, " ");
    } else {
      expected = expected.replace(/\t/g, "");
    }
    emblem = emblem.replace(/_/g, ch);
    return shouldCompileTo(emblem, obj, expected);
  };
  suite("text lines starting with '" + ch + "'");
  test("basic", function() {
    return sct("_ What what", "What what\n\t");
  });
  test("with html", function() {
    return sct('_ What <span id="woot" data-t="oof" class="f">what</span>!', 'What <span id="woot" data-t="oof" class="f">what</span>!\n\t');
  });
  test("multiline", function() {
    var emblem;
    emblem = "_ Blork\n  Snork";
    return sct(emblem, "Blork\nSnork\n\t");
  });
  test("triple multiline", function() {
    var emblem;
    emblem = "_ Blork\n  Snork\n  Bork";
    return sct(emblem, "Blork\nSnork\nBork\n\t");
  });
  test("quadruple multiline", function() {
    var emblem;
    emblem = "_ Blork\n  Snork\n  Bork\n  Fork";
    return sct(emblem, "Blork\nSnork\nBork\nFork\n\t");
  });
  test("multiline w/ trailing whitespace", function() {
    var emblem;
    emblem = "_ Blork \n  Snork";
    return sct(emblem, "Blork \nSnork\n\t");
  });
  test("secondline", function() {
    var emblem;
    emblem = "_\n  Good";
    return sct(emblem, "Good\n\t");
  });
  test("secondline multiline", function() {
    var emblem;
    emblem = "_ \n  Good\n  Bork";
    return sct(emblem, "Good\nBork\n\t");
  });
  test("with a mustache", function() {
    var emblem;
    emblem = "_ Bork {{foo}}!";
    return sct(emblem, {
      foo: "YEAH"
    }, 'Bork YEAH!\n\t');
  });
  test("with mustaches", function() {
    var emblem;
    emblem = "_ Bork {{foo}} {{{bar}}}!";
    return sct(emblem, {
      foo: "YEAH",
      bar: "<span>NO</span>"
    }, 'Bork YEAH <span>NO</span>!\n\t');
  });
  test("indented, then in a row", function() {
    var emblem;
    expect(0);
    return "PENDING";
    emblem = "_ \n  Good\n    riddance2\n    dude\n    gnar\n    foo";
    return sct(emblem, "Good\n  riddance2\n  dude\n  gnar\n  foo\n\t");
  });
  test("indented, then in a row, then indented", function() {
    var emblem;
    expect(0);
    return "PENDING";
    emblem = "_ \n  Good\n    riddance2\n    dude\n    gnar\n      foo\n      far\n      faz";
    return sct(emblem, "Good \n  riddance2 \n  dude \n  gnar \n    foo \n    far \n    faz \n\t");
  });
  test("uneven indentation megatest", function() {
    var emblem;
    expect(0);
    return "PENDING";
    emblem = "_ \n  Good\n    riddance\n  dude";
    sct(emblem, "Good\n  riddance\ndude\n\t");
    emblem = "_ \n  Good\n   riddance3\n    dude";
    sct(emblem, "Good\n riddance3\n  dude\n\t");
    emblem = "_ Good\n  riddance\n   dude";
    return sct(emblem, "Good\nriddance\n dude\n\t");
  });
  test("on each line", function() {
    var emblem;
    emblem = "pre\n  _ This\n  _   should\n  _  hopefully\n  _    work, and work well.";
    return sct(emblem, '<pre>This\n\t  should\n\t hopefully\n\t   work, and work well.\n\t</pre>');
  });
  return test("with blank", function() {
    var emblem;
    emblem = "pre\n  _ This\n  _   should\n  _\n  _  hopefully\n  _    work, and work well.";
    return sct(emblem, '<pre>This\n\t  should\n\t\n\t hopefully\n\t   work, and work well.\n\t</pre>');
  });
};

runTextLineSuite('|');

runTextLineSuite('`');

runTextLineSuite("'");

suite("text line starting with angle bracket");

test("can start with angle bracket html", function() {
  var emblem;
  emblem = "<span>Hello</span>";
  return shouldCompileTo(emblem, "<span>Hello</span>");
});

test("can start with angle bracket html and go to multiple lines", function() {
  var emblem;
  emblem = "<span>Hello dude, \n      what's up?</span>";
  return shouldCompileTo(emblem, "<span>Hello dude, what's up?</span>");
});

suite("preprocessor");

test("it strips out preceding whitespace", function() {
  var emblem;
  emblem = "\np Hello";
  return shouldCompileTo(emblem, "<p>Hello</p>");
});

test("it handles preceding indentation", function() {
  var emblem;
  emblem = "  p Woot\n  p Ha";
  return shouldCompileTo(emblem, "<p>Woot</p><p>Ha</p>");
});

test("it handles preceding indentation and newlines", function() {
  var emblem;
  emblem = "\n  p Woot\n  p Ha";
  return shouldCompileTo(emblem, "<p>Woot</p><p>Ha</p>");
});

test("it handles preceding indentation and newlines pt 2", function() {
  var emblem;
  emblem = "  \n  p Woot\n  p Ha";
  return shouldCompileTo(emblem, "<p>Woot</p><p>Ha</p>");
});

suite("comments");

test("it strips out single line '/' comments", function() {
  var emblem;
  emblem = "p Hello\n\n/ A comment\n\nh1 How are you?";
  return shouldCompileTo(emblem, "<p>Hello</p><h1>How are you?</h1>");
});

test("it strips out multi-line '/' comments", function() {
  var emblem;
  emblem = "p Hello\n\n/ A comment\n  that goes on to two lines\n  even three!\n\nh1 How are you?";
  return shouldCompileTo(emblem, "<p>Hello</p><h1>How are you?</h1>");
});

test("it strips out multi-line '/' comments without text on the first line", function() {
  var emblem;
  emblem = "p Hello\n\n/ \n  A comment\n  that goes on to two lines\n  even three!\n\nh1 How are you?";
  return shouldCompileTo(emblem, "<p>Hello</p><h1>How are you?</h1>");
});

test("mix and match with various indentation", function() {
  var emblem;
  emblem = "/ A test\np Hello\n\nspan\n  / This is gnarly\n  p Yessir nope.\n\n/ Nothin but comments\n  so many comments.\n\n/\n  p Should not show up";
  return shouldCompileTo(emblem, "<p>Hello</p><span><p>Yessir nope.</p></span>");
});

test("uneven indentation", function() {
  var emblem;
  emblem = "/ nop\n  nope\n    nope";
  return shouldCompileTo(emblem, "");
});

test("uneven indentation 2", function() {
  var emblem;
  emblem = "/ n\n  no\n    nop\n  nope";
  return shouldCompileTo(emblem, "");
});

test("uneven indentation 3", function() {
  var emblem;
  emblem = "/ n\n  no\n    nop\n  nope";
  return shouldCompileTo(emblem, "");
});

test("empty first line", function() {
  var emblem;
  emblem = "/ \n  nop\n  nope\n    nope\n  no";
  return shouldCompileTo(emblem, "");
});

test("on same line as html content", function() {
  var emblem;
  emblem = ".container / This comment doesn't show up\n  .row / Nor does this\n    p Hello";
  return shouldCompileTo(emblem, '<div class="container"><div class="row"><p>Hello</p></div></div>');
});

test("on same line as mustache content", function() {
  return shouldCompileTo('frank text="YES" text2="NO" / omg', 'WOO: YES NO');
});

test("on same line as colon syntax", function() {
  var emblem;
  emblem = "ul: li: span / omg\n  | Hello";
  return shouldCompileTo(emblem, '<ul><li><span>Hello</span></li></ul>');
});

suite("indentation");

test("it doesn't throw when indenting after a line with inline content", function() {
  var emblem;
  emblem = "p Hello\n  p invalid";
  return shouldCompileTo(emblem, "<p>Hello p invalid</p>");
});

test("it throws on half dedent", function() {
  var emblem;
  emblem = "p\n    span This is ok\n  span This aint";
  return shouldThrow(function() {
    return CompilerContext.compile(emblem);
  });
});

test("new indentation levels don't have to match parents'", function() {
  var emblem;
  emblem = "p \n  span\n     div\n      span yes";
  return shouldCompileTo(emblem, "<p><span><div><span>yes</span></div></span></p>");
});

suite("whitespace fussiness");

test("spaces after html elements", function() {
  shouldCompileTo("p \n  span asd", "<p><span>asd</span></p>");
  return shouldCompileTo("p \nspan  \n\ndiv\nspan", "<p></p><span></span><div></div><span></span>");
});

test("spaces after mustaches", function() {
  return shouldCompileTo("each foo    \n  p \n  span", {
    foo: [1, 2]
  }, "<p></p><span></span><p></p><span></span>");
});

suite("attribute shorthand");

test("id shorthand", function() {
  shouldCompileTo("#woot", '<div id="woot"></div>');
  return shouldCompileTo("span#woot", '<span id="woot"></span>');
});

test("class shorthand", function() {
  shouldCompileTo(".woot", '<div class="woot"></div>');
  shouldCompileTo("span.woot", '<span class="woot"></span>');
  return shouldCompileTo("span.woot.loot", '<span class="woot loot"></span>');
});

test("class can come first", function() {
  shouldCompileTo(".woot#hello", '<div id="hello" class="woot"></div>');
  shouldCompileTo("span.woot#hello", '<span id="hello" class="woot"></span>');
  shouldCompileTo("span.woot.loot#hello", '<span id="hello" class="woot loot"></span>');
  return shouldCompileTo("span.woot.loot#hello.boot", '<span id="hello" class="woot loot boot"></span>');
});

suite("full attributes - tags with content");

test("class only", function() {
  return shouldCompileTo('p class="yes" Blork', '<p class="yes">Blork</p>');
});

test("id only", function() {
  return shouldCompileTo('p id="yes" Hyeah', '<p id="yes">Hyeah</p>');
});

test("class and id", function() {
  return shouldCompileTo('p id="yes" class="no" Blork', '<p id="yes" class="no">Blork</p>');
});

test("class and id and embedded html one-liner", function() {
  return shouldCompileTo('p id="yes" class="no" One <b>asd</b>!', '<p id="yes" class="no">One <b>asd</b>!</p>');
});

test("nesting", function() {
  var emblem;
  emblem = "p class=\"hello\" data-foo=\"gnarly\"\n  span Yes";
  return shouldCompileTo(emblem, '<p class="hello" data-foo="gnarly"><span>Yes</span></p>');
});

suite("full attributes - mixed quotes");

test("single empty", function() {
  return shouldCompileTo("p class=''", '<p class=""></p>');
});

test("single full", function() {
  return shouldCompileTo("p class='woot yeah'", '<p class="woot yeah"></p>');
});

test("mixed", function() {
  return shouldCompileTo("p class='woot \"oof\" yeah'", '<p class="woot "oof" yeah"></p>');
});

suite("full attributes - tags without content");

test("empty", function() {
  return shouldCompileTo('p class=""', '<p class=""></p>');
});

test("class only", function() {
  return shouldCompileTo('p class="yes"', '<p class="yes"></p>');
});

test("id only", function() {
  return shouldCompileTo('p id="yes"', '<p id="yes"></p>');
});

test("class and id", function() {
  return shouldCompileTo('p id="yes" class="no"', '<p id="yes" class="no"></p>');
});

suite("full attributes w/ mustaches");

test("with mustache", function() {
  var emblem;
  shouldCompileTo('p class="foo {{yes}}"', {
    yes: "ALEX"
  }, '<p class="foo ALEX"></p>');
  shouldCompileTo('p class="foo {{yes}}" Hello', {
    yes: "ALEX"
  }, '<p class="foo ALEX">Hello</p>');
  emblem = "p class=\"foo {{yes}}\"\n  | Hello";
  return shouldCompileTo(emblem, {
    yes: "ALEX"
  }, '<p class="foo ALEX">Hello</p>');
});

test("with mustache calling helper", function() {
  var emblem;
  shouldCompileTo('p class="foo {{{echo "YES"}}}"', '<p class="foo ECHO YES"></p>');
  shouldCompileTo('p class="foo #{echo "NO"} and {{{echo "YES"}}}" Hello', '<p class="foo ECHO NO and ECHO YES">Hello</p>');
  emblem = "p class=\"foo {{echo \"BORF\"}}\"\n  | Hello";
  return shouldCompileTo(emblem, '<p class="foo ECHO BORF">Hello</p>');
});

suite("boolean attributes");

test("static", function() {
  shouldCompileTo('p borf=true', '<p borf></p>');
  shouldCompileTo('p borf=true Woot', '<p borf>Woot</p>');
  shouldCompileTo('p borf=false', '<p></p>');
  shouldCompileTo('p borf=false Nork', '<p>Nork</p>');
  return shouldCompileTo('option selected=true Thingeroo', '<option selected>Thingeroo</option>');
});

suite("html nested");

test("basic", function() {
  var emblem;
  emblem = "p\n  span Hello\n  strong Hi\ndiv\n  p Hooray";
  return shouldCompileTo(emblem, '<p><span>Hello</span><strong>Hi</strong></p><div><p>Hooray</p></div>');
});

test("empty nest", function() {
  var emblem;
  emblem = "p\n  span\n    strong\n      i";
  return shouldCompileTo(emblem, '<p><span><strong><i></i></strong></span></p>');
});

test("empty nest w/ attribute shorthand", function() {
  var emblem;
  emblem = "p.woo\n  span#yes\n    strong.no.yes\n      i";
  return shouldCompileTo(emblem, '<p class="woo"><span id="yes"><strong class="no yes"><i></i></strong></span></p>');
});

suite("simple mustache");

test("various one-liners", function() {
  var emblem;
  emblem = "= foo\narf\np = foo\nspan.foo\np data-foo=\"yes\" = goo";
  return shouldCompileTo(emblem, {
    foo: "ASD",
    arf: "QWE",
    goo: "WER"
  }, 'ASDQWE<p>ASD</p><span class="foo"></span><p data-foo="yes">WER</p>');
});

test("double =='s un-escape", function() {
  var emblem;
  emblem = "== foo\nfoo\np == foo";
  return shouldCompileTo(emblem, {
    foo: '<span>123</span>'
  }, '<span>123</span>&lt;span&gt;123&lt;/span&gt;<p><span>123</span></p>');
});

test("nested combo syntax", function() {
  var emblem;
  emblem = "ul = each items\n  li = foo";
  return shouldCompileTo(emblem, {
    items: [
      {
        foo: "YEAH"
      }, {
        foo: "BOI"
      }
    ]
  }, '<ul><li>YEAH</li><li>BOI</li></ul>');
});

suite("mustache helpers");

Handlebars.registerHelper('booltest', function(options) {
  var hash, result;
  hash = options.hash;
  result = hash.what === true ? "true" : hash.what === false ? "false" : "neither";
  return result;
});

Handlebars.registerHelper('hashtypetest', function(options) {
  var hash;
  hash = options.hash;
  return typeof hash.what;
});

Handlebars.registerHelper('typetest', function(num, options) {
  return typeof num;
});

Handlebars.registerHelper('frank', function() {
  var options;
  options = arguments[arguments.length - 1];
  return "WOO: " + options.hash.text + " " + options.hash.text2;
});

Handlebars.registerHelper('sally', function() {
  var content, options, param, params;
  options = arguments[arguments.length - 1];
  params = Array.prototype.slice.call(arguments, 0, -1);
  param = params[0] || 'none';
  if (options.fn) {
    content = options.fn(this);
    return new Handlebars.SafeString("<sally class=\"" + param + "\">" + content + "</sally>");
  } else {
    content = param;
    return new Handlebars.SafeString("<sally class=\"" + param + "\">" + content + "</sally>");
  }
});

test("basic", function() {
  return shouldCompileTo('echo foo', {
    foo: "YES"
  }, 'ECHO YES');
});

test("hashed parameters should work", function() {
  return shouldCompileTo('frank text="YES" text2="NO"', 'WOO: YES NO');
});

Handlebars.registerHelper('concatenator', function() {
  var key, options, value;
  options = arguments[arguments.length - 1];
  return new Handlebars.SafeString(((function() {
    var _ref1, _results;
    _ref1 = options.hash;
    _results = [];
    for (key in _ref1) {
      value = _ref1[key];
      _results.push("'" + key + "'='" + value + "'");
    }
    return _results;
  })()).sort().join(" "));
});

test("negative integers should work", function() {
  return shouldCompileTo('concatenator positive=100 negative=-100', "'negative'='-100' 'positive'='100'");
});

test("booleans", function() {
  shouldCompileToString('typetest true', 'boolean');
  shouldCompileToString('typetest false', 'boolean');
  shouldCompileTo('booltest what=false', 'false');
  shouldCompileTo('booltest what=true', 'true');
  shouldCompileTo('booltest what="false"', 'neither');
  return shouldCompileTo('booltest what="true"', 'neither');
});

test("integers", function() {
  shouldCompileToString('typetest 200', 'number');
  shouldCompileTo('hashtypetest what=1', 'number');
  return shouldCompileTo('hashtypetest what=200', 'number');
});

test("nesting", function() {
  var emblem;
  emblem = "sally\n  p Hello";
  return shouldCompileTo(emblem, '<sally class="none"><p>Hello</p></sally>');
});

test("recursive nesting", function() {
  var emblem;
  emblem = "sally\n  sally\n    p Hello";
  return shouldCompileTo(emblem, '<sally class="none"><sally class="none"><p>Hello</p></sally></sally>');
});

test("recursive nesting pt 2", function() {
  var emblem;
  emblem = "sally\n  sally thing\n    p Hello";
  return shouldCompileTo(emblem, {
    thing: "woot"
  }, '<sally class="none"><sally class="woot"><p>Hello</p></sally></sally>');
});

test("should handle subexpressions", function() {
  var emblem;
  emblem = "div class=(typetest 200) Hello";
  return shouldCompileTo(emblem, '<div class="number">Hello</div>');
});

Handlebars.registerHelper('view', function(param, a, b, c) {
  var content, hashString, k, options, v, _ref1;
  options = arguments[arguments.length - 1];
  content = param;
  if (options.fn) {
    content = options.fn(this);
  }
  hashString = "";
  _ref1 = options.hash;
  for (k in _ref1) {
    if (!__hasProp.call(_ref1, k)) continue;
    v = _ref1[k];
    hashString += " " + k + "=" + v;
  }
  if (!hashString) {
    hashString = " nohash";
  }
  return new Handlebars.SafeString("<" + param + hashString + ">" + content + "</" + param + ">");
});

suite("capitalized line-starter");

test("should invoke `view` helper by default", function() {
  var emblem;
  emblem = "SomeView";
  return shouldEmberPrecompileToHelper(emblem, 'view');
});

test("should not invoke `view` helper for vanilla HB", function() {
  var emblem;
  emblem = "SomeView";
  return shouldCompileToString(emblem, {
    SomeView: "ALEX"
  }, 'ALEX');
});

test("should support block mode", function() {
  var emblem;
  emblem = "SomeView\n  p View content";
  return shouldEmberPrecompileToHelper(emblem, 'view');
});

test("should not kick in if preceded by equal sign", function() {
  var emblem;
  emblem = "= SomeView";
  return shouldCompileTo(emblem, {
    SomeView: 'erp'
  }, 'erp');
});

test("should not kick in explicit {{mustache}}", function() {
  var emblem;
  emblem = "p Yeah {{SomeView}}";
  return shouldCompileTo(emblem, {
    SomeView: 'erp'
  }, '<p>Yeah erp</p>');
});

suite("bang syntax defaults to `unbound` helper syntax");

Handlebars.registerHelper('unbound', function() {
  var content, options, params, stringedParams;
  options = arguments[arguments.length - 1];
  params = Array.prototype.slice.call(arguments, 0, -1);
  stringedParams = params.join(' ');
  content = options.fn ? options.fn(this) : stringedParams;
  return new Handlebars.SafeString("<unbound class=\"" + stringedParams + "\">" + content + "</unbound>");
});

test("bang helper defaults to `unbound` invocation", function() {
  var emblem;
  emblem = "foo! Yar\n= foo!";
  return shouldCompileToString(emblem, '<unbound class="foo Yar">foo Yar</unbound><unbound class="foo">foo</unbound>');
});

test("bang helper works with blocks", function() {
  var emblem;
  emblem = "hey! you suck\n  = foo!";
  return shouldCompileToString(emblem, '<unbound class="hey you suck"><unbound class="foo">foo</unbound></unbound>');
});

suite("question mark syntax defaults to `if` helper syntax");

test("? helper defaults to `if` invocation", function() {
  var emblem;
  emblem = "foo?\n  p Yeah";
  return shouldCompileTo(emblem, {
    foo: true
  }, '<p>Yeah</p>');
});

test("else works", function() {
  var emblem;
  emblem = "foo?\n  p Yeah\nelse\n  p No";
  return shouldCompileTo(emblem, {
    foo: false
  }, '<p>No</p>');
});

test("compound", function() {
  var emblem;
  emblem = "p = foo? \n  | Hooray\nelse\n  | No\np = bar? \n  | Hooray\nelse\n  | No";
  return shouldCompileTo(emblem, {
    foo: true,
    bar: false
  }, '<p>Hooray</p><p>No</p>');
});

test("compound", function() {
  var emblem;
  emblem = "p = foo? \n  bar\nelse\n  baz";
  return shouldCompileTo(emblem, {
    foo: true,
    bar: "borf",
    baz: "narsty"
  }, '<p>borf</p>');
});

suite("conditionals");

test("simple if statement", function() {
  var emblem;
  emblem = "if foo\n  | Foo\nif bar\n  | Bar";
  return shouldCompileTo(emblem, {
    foo: true,
    bar: false
  }, 'Foo');
});

test("if else ", function() {
  var emblem;
  emblem = "if foo\n  | Foo\n  if bar\n    | Bar\n  else\n    | Woot\nelse\n  | WRONG\nif bar\n  | WRONG\nelse\n  | Hooray";
  return shouldCompileTo(emblem, {
    foo: true,
    bar: false
  }, 'FooWootHooray');
});

test("else with preceding `=`", function() {
  var emblem;
  emblem = "= if foo\n  p Yeah\n= else\n  p No\n= if bar\n  p Yeah!\n= else\n  p No!\n=if bar\n  p Yeah!\n=else\n  p No!";
  return shouldCompileTo(emblem, {
    foo: true,
    bar: false
  }, '<p>Yeah</p><p>No!</p><p>No!</p>');
});

test("unless", function() {
  var emblem;
  emblem = "unless bar\n  | Foo\n  unless foo\n    | Bar\n  else\n    | Woot\nelse\n  | WRONG\nunless foo\n  | WRONG\nelse\n  | Hooray";
  return shouldCompileTo(emblem, {
    foo: true,
    bar: false
  }, 'FooWootHooray');
});

test("else followed by newline doesn't gobble else content", function() {
  var emblem;
  emblem = "if something\n  p something\nelse\n\n  if nothing\n    p nothing\n  else\n    p not nothing";
  return shouldCompileTo(emblem, {}, '<p>not nothing</p>');
});

suite("class shorthand and explicit declaration is coalesced");

test("when literal class is used", function() {
  return shouldCompileTo('p.foo class="bar"', '<p class="foo bar"></p>');
});

test("when ember expression is used with variable", function() {
  return shouldCompileTo('p.foo class=bar', {
    bar: 'baz'
  }, '<p bind-attr class to :foo bar></p>');
});

test("when ember expression is used with variable in braces", function() {
  var result;
  result = shouldEmberPrecompileToHelper('p.foo class={ bar }');
  return ok(-1 !== result.indexOf('\'class\': (":foo bar")'));
});

test("when ember expression is used with constant in braces", function() {
  var result;
  result = shouldEmberPrecompileToHelper('p.foo class={ :bar }');
  return ok(-1 !== result.indexOf('\'class\': (":foo :bar")'));
});

test("when ember expression is used with constant and variable in braces", function() {
  var result;
  result = shouldEmberPrecompileToHelper('p.foo class={ :bar bar }');
  return ok(-1 !== result.indexOf('\'class\': (":foo :bar bar")'));
});

test("when ember expression is used with bind-attr", function() {
  var result;
  result = shouldEmberPrecompileToHelper('p.foo{ bind-attr class="bar" }');
  return ok(-1 !== result.indexOf('\'class\': (":foo bar")'));
});

test("when ember expression is used with bind-attr and multiple attrs", function() {
  var result;
  result = shouldEmberPrecompileToHelper('p.foo{ bind-attr something=bind class="bar" }');
  return ok(-1 !== result.indexOf('\'class\': (":foo bar")'));
});

test("only with bind-attr helper", function() {
  var result;
  result = shouldEmberPrecompileToHelper('p.foo{ someHelper class="bar" }', 'someHelper');
  ok(-1 !== result.indexOf('\'class\': ("bar")'));
  return ok(-1 !== result.indexOf('class=\\"foo\\"'));
});

bindAttrHelper = function() {
  var bindingString, k, options, param, params, v, _ref1;
  options = arguments[arguments.length - 1];
  params = Array.prototype.slice.call(arguments, 0, -1);
  bindingString = "";
  _ref1 = options.hash;
  for (k in _ref1) {
    if (!__hasProp.call(_ref1, k)) continue;
    v = _ref1[k];
    bindingString += " " + k + " to " + v;
  }
  if (!bindingString) {
    bindingString = " narf";
  }
  param = params[0] || 'none';
  return "bind-attr" + bindingString;
};

Handlebars.registerHelper('bind-attr', bindAttrHelper);

EmberHandlebars.registerHelper('bind-attr', bindAttrHelper);

suite("bind-attr behavior for unquoted attribute values");

test("basic", function() {
  var emblem;
  emblem = 'p class=foo';
  shouldCompileTo(emblem, {
    foo: "YEAH"
  }, '<p class="YEAH"></p>');
  return shouldEmberPrecompileToHelper(emblem);
});

test("basic w/ underscore", function() {
  var emblem;
  emblem = 'p class=foo_urns';
  shouldCompileTo(emblem, {
    foo_urns: "YEAH"
  }, '<p class="YEAH"></p>');
  return shouldEmberPrecompileToHelper(emblem);
});

test("subproperties", function() {
  var emblem;
  emblem = 'p class=foo._death.woot';
  shouldCompileTo(emblem, {
    foo: {
      _death: {
        woot: "YEAH"
      }
    }
  }, '<p class="YEAH"></p>');
  return shouldEmberPrecompileToHelper(emblem);
});

test("multiple", function() {
  return shouldCompileTo('p class=foo id="yup" data-thinger=yeah Hooray', {
    foo: "FOO",
    yeah: "YEAH"
  }, '<p class="FOO" id="yup" data-thinger="YEAH">Hooray</p>');
});

test("class bind-attr special syntax", function() {
  var emblem;
  emblem = 'p class=foo:bar:baz';
  shouldEmberPrecompileToHelper(emblem);
  return shouldThrow((function() {
    return CompilerContext.compile(emblem);
  }));
});

test("class bind-attr braced syntax w/ underscores and dashes", function() {
  var emblem;
  shouldEmberPrecompileToHelper('p class={f-oo:bar :b_az}');
  shouldEmberPrecompileToHelper('p class={ f-oo:bar :b_az }');
  shouldEmberPrecompileToHelper('p class={ f-oo:bar :b_az } Hello');
  emblem = ".input-prepend class={ filterOn:input-append }\n  span.add-on";
  return shouldEmberPrecompileToHelper(emblem);
});

test("exclamation modifier (vanilla)", function() {
  var emblem;
  emblem = 'p class=foo!';
  return shouldCompileTo(emblem, {
    foo: "YEAH"
  }, '<p class="YEAH"></p>');
});

test("exclamation modifier (ember)", function() {
  var emblem, result;
  emblem = 'p class=foo!';
  result = precompileEmber(emblem);
  ok(result.match(/p class/));
  return ok(result.match(/helpers\.unbound.*foo/));
});

suite("in-tag explicit mustache");

Handlebars.registerHelper('inTagHelper', function(p) {
  return p;
});

test("single", function() {
  return shouldCompileTo('p{inTagHelper foo}', {
    foo: "ALEX"
  }, '<p ALEX></p>');
});

test("double", function() {
  return shouldCompileTo('p{inTagHelper foo}', {
    foo: "ALEX"
  }, '<p ALEX></p>');
});

test("triple", function() {
  return shouldCompileTo('p{inTagHelper foo}', {
    foo: "ALEX"
  }, '<p ALEX></p>');
});

Handlebars.registerHelper('insertClass', function(p) {
  return 'class="' + p + '"';
});

test("with singlestache", function() {
  return shouldCompileTo('p{insertClass foo} Hello', {
    foo: "yar"
  }, '<p class=&quot;yar&quot;>Hello</p>');
});

test("singlestache can be used in text nodes", function() {
  return shouldCompileTo('p Hello {dork}', '<p>Hello {dork}</p>');
});

test("with doublestache", function() {
  return shouldCompileTo('p{{insertClass foo}} Hello', {
    foo: "yar"
  }, '<p class=&quot;yar&quot;>Hello</p>');
});

test("with triplestache", function() {
  return shouldCompileTo('p{{{insertClass foo}}} Hello', {
    foo: "yar"
  }, '<p class="yar">Hello</p>');
});

test("multiple", function() {
  return shouldCompileTo('p{{{insertClass foo}}}{{{insertClass boo}}} Hello', {
    foo: "yar",
    boo: "nar"
  }, '<p class="yar" class="nar">Hello</p>');
});

test("with nesting", function() {
  var emblem;
  emblem = "p{{bind-attr class=\"foo\"}}\n  span Hello";
  return shouldCompileTo(emblem, {
    foo: "yar"
  }, '<p bind-attr class to foo><span>Hello</span></p>');
});

suite("actions");

Handlebars.registerHelper('action', function() {
  var hashString, k, options, params, paramsString, v, _ref1;
  options = arguments[arguments.length - 1];
  params = Array.prototype.slice.call(arguments, 0, -1);
  hashString = "";
  paramsString = params.join('|');
  _ref1 = options.hash;
  for (k in _ref1) {
    if (!__hasProp.call(_ref1, k)) continue;
    v = _ref1[k];
    hashString += " " + k + "=" + v;
  }
  if (!hashString) {
    hashString = " nohash";
  }
  return "action " + paramsString + hashString;
});

test("basic (click)", function() {
  var emblem;
  emblem = "button click=\"submitComment\" Submit Comment";
  return shouldCompileToString(emblem, '<button action submitComment on=click>Submit Comment</button>');
});

test("basic (click) followed by attr", function() {
  var emblem;
  emblem = "button click=\"submitComment\" class=\"foo\" Submit Comment";
  shouldCompileToString(emblem, '<button action submitComment on=click class="foo">Submit Comment</button>');
  emblem = "button click=\"submitComment 'omg'\" class=\"foo\" Submit Comment";
  return shouldCompileToString(emblem, '<button action submitComment|omg on=click class="foo">Submit Comment</button>');
});

test("nested (mouseEnter)", function() {
  var emblem;
  emblem = "a mouseEnter='submitComment target=\"view\"'\n  | Submit Comment";
  return shouldCompileToString(emblem, '<a action submitComment target=view on=mouseEnter>Submit Comment</a>');
});

test("nested (mouseEnter, doublequoted)", function() {
  var emblem;
  emblem = "a mouseEnter=\"submitComment target='view'\"\n  | Submit Comment";
  return shouldCompileToString(emblem, '<a action submitComment target=view on=mouseEnter>Submit Comment</a>');
});

test("manual", function() {
  var emblem;
  emblem = "a{action submitComment target=\"view\"} Submit Comment";
  return shouldCompileToString(emblem, '<a action submitComment target=view>Submit Comment</a>');
});

test("manual nested", function() {
  var emblem;
  emblem = "a{action submitComment target=\"view\"}\n  p Submit Comment";
  return shouldCompileToString(emblem, '<a action submitComment target=view><p>Submit Comment</p></a>');
});

suite("haml style");

test("basic", function() {
  var emblem;
  emblem = "%borf";
  return shouldCompileToString(emblem, '<borf></borf>');
});

test("nested", function() {
  var emblem;
  emblem = "%borf\n    %sporf Hello";
  return shouldCompileToString(emblem, '<borf><sporf>Hello</sporf></borf>');
});

test("capitalized", function() {
  var emblem;
  emblem = "%Alex alex\n%Alex\n  %Woot";
  return shouldCompileToString(emblem, '<Alex>alex</Alex><Alex><Woot></Woot></Alex>');
});

test("funky chars", function() {
  var emblem;
  emblem = "%borf:narf\n%borf:narf Hello, {{foo}}.\n%alex = foo";
  return shouldCompileToString(emblem, {
    foo: "Alex"
  }, '<borf:narf></borf:narf><borf:narf>Hello, Alex.</borf:narf><alex>Alex</alex>');
});

suite("line-based errors");

test("line number is provided for pegjs error", function() {
  var emblem;
  emblem = "p Hello\np Hello {{narf}";
  return shouldThrow((function() {
    return CompilerContext.compile(emblem);
  }), "line 2");
});

test("single quote test", function() {
  var emblem;
  emblem = "button click='p' Frank\n      \n/ form s='d target=\"App\"'\n  label I'm a label!";
  return shouldCompileToString(emblem, '<button action p on=click>Frank</button>');
});

test("double quote test", function() {
  var emblem;
  emblem = "button click=\"p\" Frank\n      \n/ form s='d target=\"App\"'\n  label I'm a label!";
  return shouldCompileToString(emblem, '<button action p on=click>Frank</button>');
});

test("no quote test", function() {
  var emblem;
  emblem = "button click=p Frank\n      \n/ form s='d target=\"App\"'\n  label I'm a label!";
  return shouldCompileToString(emblem, '<button action p on=click>Frank</button>');
});

suite("mustache DOM attribute shorthand");

test("tagName w/o space", function() {
  var emblem, result;
  emblem = "App.FunView%span";
  result = precompileEmber(emblem);
  ok(result.match(/helpers\.view/));
  ok(result.match(/App\.FunView/));
  return ok(result.match(/tagName.*span/));
});

test("tagName w/ space", function() {
  var emblem, result;
  emblem = "App.FunView %span";
  result = precompileEmber(emblem);
  ok(result.match(/helpers\.view/));
  ok(result.match(/App\.FunView/));
  return ok(result.match(/tagName.*span/));
});

test("tagName block", function() {
  var emblem;
  emblem = "view App.FunView%span\n  p Hello";
  return shouldCompileToString(emblem, '<App.FunView tagName=span><p>Hello</p></App.FunView>');
});

test("class w/ space (needs space)", function() {
  var emblem, result;
  emblem = "App.FunView .bork";
  result = precompileEmber(emblem);
  ok(result.match(/helpers\.view/));
  ok(result.match(/App\.FunView/));
  return ok(result.match(/class.*bork/));
});

test("multiple classes", function() {
  var emblem, result;
  emblem = "App.FunView .bork.snork";
  result = precompileEmber(emblem);
  ok(result.match(/helpers\.view/));
  ok(result.match(/App\.FunView/));
  return ok(result.match(/class.*bork.*snork/));
});

test("elementId", function() {
  var emblem, result;
  emblem = "App.FunView#ohno";
  result = precompileEmber(emblem);
  ok(result.match(/helpers\.view/));
  ok(result.match(/App\.FunView/));
  return ok(result.match(/elementId.*ohno/));
});

test("mixed w/ hash`", function() {
  var emblem, result;
  emblem = "App.FunView .bork.snork funbags=\"yeah\"";
  result = precompileEmber(emblem);
  ok(result.match(/helpers\.view/));
  ok(result.match(/App\.FunView/));
  ok(result.match(/class.*bork.*snork/));
  ok(result.match(/hash/));
  ok(result.match(/funbags/));
  return ok(result.match(/yeah/));
});

test("mixture of all`", function() {
  var emblem, result;
  emblem = "App.FunView%alex#hell.bork.snork funbags=\"yeah\"";
  result = precompileEmber(emblem);
  ok(result.match(/helpers\.view/));
  ok(result.match(/App\.FunView/));
  ok(result.match(/tagName.*alex/));
  ok(result.match(/elementId.*hell/));
  ok(result.match(/class.*bork.*snork/));
  ok(result.match(/hash/));
  ok(result.match(/funbags/));
  return ok(result.match(/yeah/));
});

suite("self-closing html tags");

test("br", function() {
  var emblem;
  emblem = "br";
  return shouldCompileToString(emblem, '<br />');
});

test("br paragraph example", function() {
  var emblem;
  emblem = "p\n  | LOL!\n  br\n  | BORF!";
  return shouldCompileToString(emblem, '<p>LOL!<br />BORF!</p>');
});

test("input", function() {
  var emblem;
  emblem = "input type=\"text\"";
  return shouldCompileToString(emblem, '<input type="text" />');
});

suite("ember.");

test("should precompile with EmberHandlebars", function() {
  var emblem, result;
  emblem = "input type=\"text\"";
  result = Emblem.precompile(EmberHandlebars, 'p Hello').toString();
  return ok(result.match('<p>Hello</p>'));
});

suite("old school handlebars");

test("array", function() {
  var emblem, hash;
  emblem = 'goodbyes\n  | #{text}! \n| cruel #{world}!';
  hash = {
    goodbyes: [
      {
        text: "goodbye"
      }, {
        text: "Goodbye"
      }, {
        text: "GOODBYE"
      }
    ],
    world: "world"
  };
  shouldCompileToString(emblem, hash, "goodbye! Goodbye! GOODBYE! cruel world!");
  hash = {
    goodbyes: [],
    world: "world"
  };
  return shouldCompileToString(emblem, hash, "cruel world!");
});

Handlebars.registerPartial('hbPartial', '<a href="/people/{{id}}">{{name}}</a>');

test("calling handlebars partial", function() {
  var emblem;
  emblem = '> hbPartial\n| Hello #{> hbPartial}';
  return shouldCompileToString(emblem, {
    id: 666,
    name: "Death"
  }, '<a href="/people/666">Death</a>Hello <a href="/people/666">Death</a>');
});

Emblem.registerPartial(Handlebars, 'emblemPartial', 'a href="/people/{{id}}" = name');

Emblem.registerPartial(Handlebars, 'emblemPartialB', 'p Grr');

Emblem.registerPartial(Handlebars, 'emblemPartialC', 'p = a');

test("calling emblem partial", function() {
  return shouldCompileToString('> emblemPartial', {
    id: 666,
    name: "Death"
  }, '<a href="/people/666">Death</a>');
});

test("calling emblem partial with context", function() {
  return shouldCompileToString('> emblemPartialC foo', {
    foo: {
      a: "YES"
    }
  }, '<p>YES</p>');
});

test("partials in mustaches", function() {
  var emblem;
  emblem = "| Hello, {{> emblemPartialC foo}}{{>emblemPartialB}}{{>emblemPartialB }}";
  return shouldCompileToString(emblem, {
    foo: {
      a: "YES"
    }
  }, 'Hello, <p>YES</p><p>Grr</p><p>Grr</p>');
});

test("block as #each", function() {
  var emblem;
  emblem = 'thangs\n  p Woot #{yeah}';
  return shouldCompileToString(emblem, {
    thangs: [
      {
        yeah: 123
      }, {
        yeah: 456
      }
    ]
  }, '<p>Woot 123</p><p>Woot 456</p>');
});

/*
test "partial in block", ->
  emblem =
  """
  ul = people
    > link
  """
  data = 
    people: [
      { "name": "Alan", "id": 1 }
      { "name": "Yehuda", "id": 2 }
    ]
  shouldCompileToString emblem, data, '<ul><a href="/people/1">Alan</a><a href="/people/2">Yehuda</a><ul>'
*/


suite("inline block helper");

test("text only", function() {
  var emblem;
  emblem = "view SomeView | Hello";
  return shouldCompileToString(emblem, '<SomeView nohash>Hello</SomeView>');
});

test("multiline", function() {
  var emblem;
  emblem = "view SomeView | Hello, \n  How are you? \n  Sup?";
  return shouldCompileToString(emblem, '<SomeView nohash>Hello, How are you? Sup?</SomeView>');
});

test("more complicated", function() {
  var emblem;
  emblem = "view SomeView borf=\"yes\" | Hello, \n  How are you? \n  Sup?";
  return shouldCompileToString(emblem, '<SomeView borf=yes>Hello, How are you? Sup?</SomeView>');
});

suite("copy paste html");

test("indented", function() {
  var emblem;
  emblem = "<p>\n  <span>This be some text</span>\n  <title>Basic HTML Sample Page</title>\n</p>";
  return shouldCompileToString(emblem, '<p><span>This be some text</span><title>Basic HTML Sample Page</title></p>');
});

test("flatlina", function() {
  var emblem;
  emblem = "<p>\n<span>This be some text</span>\n<title>Basic HTML Sample Page</title>\n</p>";
  return shouldCompileToString(emblem, '<p><span>This be some text</span><title>Basic HTML Sample Page</title></p>');
});

test("bigass", function() {
  var emblem, expected;
  expect(0);
  return "PENDING";
  emblem = "<div class=\"content\">\n  <p>\n    We design and develop ambitious web and mobile applications, \n  </p>\n  <p>\n    A more official portfolio page is on its way, but in the meantime, \n    check out\n  </p>\n</div>";
  expected = '<div class="content"><p>  We design and develop ambitious web and mobile applications, </p><p>  A more official portfolio page is on its way, but in the meantime, check out</p></div>';
  return shouldCompileToString(emblem, expected);
});

suite("`this` keyword");

test("basic", function() {
  var emblem;
  emblem = 'each foo\n  p = this\n  this';
  return shouldCompileTo(emblem, {
    foo: ["Alex", "Emily"]
  }, '<p>Alex</p>Alex<p>Emily</p>Emily');
});

suite("colon separator");

test("basic", function() {
  var emblem;
  emblem = 'each foo: p Hello, #{this}';
  return shouldCompileTo(emblem, {
    foo: ["Alex", "Emily", "Nicole"]
  }, '<p>Hello, Alex</p><p>Hello, Emily</p><p>Hello, Nicole</p>');
});

test("html stack", function() {
  var emblem;
  emblem = '.container: .row: .span5: span Hello';
  return shouldCompileToString(emblem, '<div class="container"><div class="row"><div class="span5"><span>Hello</span></div></div></div>');
});

test("epic", function() {
  var emblem;
  emblem = '.container: .row: .span5\n  ul#list data-foo="yes": each foo: li\n    span: this';
  return shouldCompileTo(emblem, {
    foo: ["a", "b"]
  }, '<div class="container"><div class="row"><div class="span5"><ul id="list" data-foo="yes"><li><span>a</span></li><li><span>b</span></li></ul></div></div></div>');
});

test("html stack elements only", function() {
  var emblem;
  emblem = 'p: span: div: p: foo';
  return shouldCompileToString(emblem, {
    foo: "alex"
  }, '<p><span><div><p>alex</p></div></span></p>');
});

test("mixed separators", function() {
  var emblem;
  emblem = '.fun = each foo: %nork = this';
  return shouldCompileTo(emblem, {
    foo: ["Alex", "Emily", "Nicole"]
  }, '<div class="fun"><nork>Alex</nork><nork>Emily</nork><nork>Nicole</nork></div>');
});

test("mixed separators rewritten", function() {
  var emblem;
  emblem = '.fun: each foo: %nork: this';
  return shouldCompileTo(emblem, {
    foo: ["Alex", "Emily", "Nicole"]
  }, '<div class="fun"><nork>Alex</nork><nork>Emily</nork><nork>Nicole</nork></div>');
});

test("with text terminator", function() {
  var emblem;
  emblem = '.fun: view SomeView | Hello';
  return shouldCompileToString(emblem, '<div class="fun"><SomeView nohash>Hello</SomeView></div>');
});

test("test from heartsentwined", function() {
  shouldCompileTo('li data-foo=bar: a', {
    bar: "abc"
  }, '<li data-foo="abc"><a></a></li>');
  return shouldCompileTo("li data-foo='bar': a", '<li data-foo="bar"><a></a></li>');
});

test("mixture of colon and indentation", function() {
  var emblem;
  emblem = "li data-foo=bar: a\n  baz";
  return shouldCompileTo(emblem, {
    bar: "abc",
    baz: "Hello"
  }, '<li data-foo="abc"><a>Hello</a></li>');
});

test("mixture of colon and indentation pt.2", function() {
  var emblem, result;
  emblem = "ul\n  li data-foo=bar: a quux\n  li data-foo='bar': a quux\n  li data-foo=bar href='#': a quux";
  result = precompileEmber(emblem);
  return ok(!result.match("a quux"));
});

suite("base indent / predent");

test("predent", function() {
  var emblem, s;
  emblem = "        \n";
  s = "pre\n  ` This\n  `   should\n  `  hopefully\n  `    work, and work well.\n";
  emblem += s;
  return shouldCompileToString(emblem, '<pre>This\n  should\n hopefully\n   work, and work well.\n</pre>');
});

test("mixture", function() {
  var emblem;
  emblem = "        \n";
  emblem += "  p Hello\n";
  emblem += "  p\n";
  emblem += "    | Woot\n";
  emblem += "  span yes\n";
  return shouldCompileToString(emblem, '<p>Hello</p><p>Woot</p><span>yes</span>');
});

test("mixture w/o opening blank", function() {
  var emblem;
  emblem = "  p Hello\n";
  emblem += "  p\n";
  emblem += "    | Woot\n";
  emblem += "  span yes\n";
  return shouldCompileToString(emblem, '<p>Hello</p><p>Woot</p><span>yes</span>');
});

test("w/ blank lines", function() {
  var emblem;
  emblem = "  p Hello\n";
  emblem += "  p\n";
  emblem += "\n";
  emblem += "    | Woot\n";
  emblem += "\n";
  emblem += "  span yes\n";
  return shouldCompileToString(emblem, '<p>Hello</p><p>Woot</p><span>yes</span>');
});

test("w/ blank whitespaced lines", function() {
  var emblem;
  emblem = "  p Hello\n";
  emblem += "  p\n";
  emblem += "\n";
  emblem += "    | Woot\n";
  emblem += "        \n";
  emblem += "       \n";
  emblem += "         \n";
  emblem += "\n";
  emblem += "  span yes\n";
  emblem += "\n";
  emblem += "  sally\n";
  emblem += "\n";
  emblem += "         \n";
  emblem += "    | Woot\n";
  return shouldCompileToString(emblem, '<p>Hello</p><p>Woot</p><span>yes</span><sally class="none">Woot</sally>');
});

suite("EOL Whitespace");

test("shouldn't be necessary to insert a space", function() {
  var emblem;
  emblem = "p Hello,\n  How are you?\np I'm fine, thank you.";
  return shouldCompileToString(emblem, "<p>Hello, How are you?</p><p>I'm fine, thank you.</p>");
});

suite("misc.");

test("end with indent", function() {
  var emblem;
  expect(0);
  return "PENDING";
  emblem = "div\n  p\n    span Butts\n      em fpokasd\n      iunw\n        paosdk";
  return shouldCompileToString(emblem, '<div><p><span>Buttsem fpokasdiunw  paosdk</span></p></div>');
});

test("capitalized view helper should not kick in if suffix modifiers present", function() {
  var emblem;
  emblem = "Foo!";
  return shouldCompileToString(emblem, '<unbound class="Foo">Foo</unbound>');
});

test("GH-26: no need for space before equal sign", function() {
  var emblem;
  emblem = "span= foo";
  shouldCompileToString(emblem, {
    foo: "YEAH"
  }, '<span>YEAH</span>');
  emblem = "span.foo= foo";
  shouldCompileToString(emblem, {
    foo: "YEAH"
  }, '<span class="foo">YEAH</span>');
  emblem = "span#hooray.foo= foo";
  shouldCompileToString(emblem, {
    foo: "YEAH"
  }, '<span id="hooray" class="foo">YEAH</span>');
  emblem = "#hooray= foo";
  shouldCompileToString(emblem, {
    foo: "YEAH"
  }, '<div id="hooray">YEAH</div>');
  emblem = ".hooray= foo";
  return shouldCompileToString(emblem, {
    foo: "YEAH"
  }, '<div class="hooray">YEAH</div>');
});

test("numbers in shorthand", function() {
  shouldCompileToString('#4a', '<div id="4a"></div>');
  shouldCompileToString('.4a', '<div class="4a"></div>');
  shouldCompileToString('.4', '<div class="4"></div>');
  shouldCompileToString('#4', '<div id="4"></div>');
  shouldCompileToString('%4', '<4></4>');
  shouldCompileToString('%4 ermagerd', '<4>ermagerd</4>');
  return shouldCompileToString('%4#4.4 ermagerd', '<4 id="4" class="4">ermagerd</4>');
});

test("Emblem has a VERSION defined", function() {
  return ok(Emblem.VERSION, "Emblem.VERSION should be defined");
});

test("Windows line endings", function() {
  var emblem;
  emblem = ".navigation\r\n  p Hello\r\n#main\r\n  | hi";
  return shouldCompileToString(emblem, '<div class="navigation"><p>Hello</p></div><div id="main">hi</div>');
});

test("backslash doesn't cause infinite loop", function() {
  var emblem;
  emblem = '| \\';
  return shouldCompileTo(emblem, "\\");
});

test("backslash doesn't cause infinite loop with letter", function() {
  var emblem;
  emblem = '| \\a';
  return shouldCompileTo(emblem, "\\a");
});

test("self closing tag with forward slash", function() {
  var emblem;
  emblem = 'p/\n%bork/\n.omg/\n#hello.boo/\np/ class="asdasd"';
  return shouldCompileTo(emblem, '<p /><bork /><div class="omg" /><div id="hello" class="boo" /><p class="asdasd" />');
});

test("tagnames and attributes with colons", function() {
  var emblem;
  emblem = '%al:ex match:neer="snork" Hello!';
  return shouldCompileTo(emblem, '<al:ex match:neer="snork">Hello!</al:ex>');
});

test("windows newlines", function() {
  var emblem;
  emblem = "\r\n  \r\n  p Hello\r\n\r\n";
  return shouldCompileTo(emblem, '<p>Hello</p>');
});

if (supportsSubexpressions) {
  suite("subexpressions");
  Handlebars.registerHelper('echo', function(param) {
    return "ECHO " + param;
  });
  Handlebars.registerHelper('echofun', function() {
    var options;
    options = Array.prototype.pop.call(arguments);
    return "FUN = " + options.hash.fun;
  });
  Handlebars.registerHelper('hello', function(param) {
    return "hello";
  });
  Handlebars.registerHelper('equal', function(x, y) {
    return x === y;
  });
  test("arg-less helper", function() {
    var emblem;
    emblem = 'p {{echo (hello)}}';
    shouldCompileTo(emblem, '<p>ECHO hello</p>');
    emblem = '= echo (hello)';
    return shouldCompileTo(emblem, 'ECHO hello');
  });
  test("helper w args", function() {
    var emblem;
    emblem = 'p {{echo (equal 1 1)}}';
    shouldCompileTo(emblem, '<p>ECHO true</p>');
    emblem = '= echo (equal 1 1)';
    return shouldCompileTo(emblem, 'ECHO true');
  });
  test("supports much nesting", function() {
    var emblem;
    emblem = 'p {{echo (equal (equal 1 1) true)}}';
    shouldCompileTo(emblem, '<p>ECHO true</p>');
    emblem = '= echo (equal (equal 1 1) true)';
    return shouldCompileTo(emblem, 'ECHO true');
  });
  test("with hashes", function() {
    var emblem;
    emblem = 'p {{echo (equal (equal 1 1) true fun="yes")}}';
    shouldCompileTo(emblem, '<p>ECHO true</p>');
    emblem = '= echo (equal (equal 1 1) true fun="yes")';
    return shouldCompileTo(emblem, 'ECHO true');
  });
  test("as hashes", function() {
    var emblem;
    emblem = 'p {{echofun fun=(equal 1 1)}}';
    shouldCompileTo(emblem, '<p>FUN = true</p>');
    emblem = '= echofun fun=(equal 1 1)';
    return shouldCompileTo(emblem, 'FUN = true');
  });
  test("complex expression", function() {
    var emblem;
    emblem = 'p {{echofun true (hello how="are" you=false) 1 not=true fun=(equal "ECHO hello" (echo (hello))) win="yes"}}';
    shouldCompileTo(emblem, '<p>FUN = true</p>');
    emblem = '= echofun true (hello how="are" you=false) 1 not=true fun=(equal "ECHO hello" (echo (hello))) win="yes"';
    return shouldCompileTo(emblem, 'FUN = true');
  });
}
