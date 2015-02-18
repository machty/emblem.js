import { compile } from './compiler';

function compileScriptTags(scope) {
  var Handlebars = scope.Handlebars;
  var Ember = scope.Ember;

  if (typeof Ember === "undefined" || Ember === null) {
    throw new Error("Can't run Emblem.enableEmber before Ember has been defined");
  }
  if (typeof document !== "undefined" && document !== null) {
    return Ember.$('script[type="text/x-emblem"], script[type="text/x-raw-emblem"]', Ember.$(document)).each(function() {
      var handlebarsVariant, script, templateName;
      script = Ember.$(this);
      handlebarsVariant = script.attr('type') === 'text/x-raw-handlebars' ? Handlebars : Ember.Handlebars;
      templateName = script.attr('data-template-name') || script.attr('id') || 'application';
      Ember.TEMPLATES[templateName] = compile(handlebarsVariant, script.html());
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
  ENV.EMBER_LOAD_HOOKS['Ember.Application'].push(function(Application) {
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

