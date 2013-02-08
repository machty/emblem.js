var ENV, Emblem, _base;

Emblem = require('./emblem');

Emblem.compileScriptTags = function() {
  if (typeof Ember === "undefined" || Ember === null) {
    throw new Error("Can't run Emblem.enableEmber before Ember has been defined");
  }
  if (typeof document !== "undefined" && document !== null) {
    return Ember.$('script[type="text/x-emblem"], script[type="text/x-raw-emblem"]', Ember.$(document)).each(function() {
      var handlebarsVariant, script, templateName;
      script = Ember.$(this);
      handlebarsVariant = script.attr('type') === 'text/x-raw-handlebars' ? Handlebars : Ember.Handlebars;
      templateName = script.attr('data-template-name') || script.attr('id') || 'application';
      Ember.TEMPLATES[templateName] = Emblem.compile(handlebarsVariant, script.html());
      return script.remove();
    });
  }
};

this.ENV || (this.ENV = {});

ENV = this.ENV;

ENV.EMBER_LOAD_HOOKS || (ENV.EMBER_LOAD_HOOKS = {});

(_base = ENV.EMBER_LOAD_HOOKS).application || (_base.application = []);

ENV.EMBER_LOAD_HOOKS.application.push(function() {
  return Emblem.enableEmber();
});
