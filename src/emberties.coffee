Emblem = require './emblem'

# This allows you put <script type="text/x-emblem"> tags
# in your HTML with Emblem code that will be compiled into 
# handlebars.
#
# See packages/ember-handlebars/lib/loader.js in Ember for
# further explanation.
Emblem.compileScriptTags = () ->
  throw new Error("Can't run Emblem.enableEmber before Ember has been defined") unless Ember?

  if document?


    Ember.$('script[type="text/x-emblem"], script[type="text/x-raw-emblem"]', Ember.$(document)).each ->
      script = Ember.$(@)

      handlebarsVariant = if (script.attr('type') == 'text/x-raw-handlebars')
        Handlebars
      else
        Ember.Handlebars

      templateName = script.attr('data-template-name') || script.attr('id') || 'application'
      Ember.TEMPLATES[templateName] = Emblem.compile(handlebarsVariant, script.html())
      script.remove()

# Register hook. If this functionality isn't in the present version of Ember,
# must mqnually put the following code after Ember has been included:
#
#   Ember.onLoad('application', function() { 
#     Emblem.enableEmber();
#   });

this.ENV ||= {}
ENV = this.ENV
ENV.EMBER_LOAD_HOOKS ||= {}
ENV.EMBER_LOAD_HOOKS.application ||= []
ENV.EMBER_LOAD_HOOKS.application.push -> Emblem.enableEmber()
