var ENV, Emblem, _base;

Emblem = require('./emblem');

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
