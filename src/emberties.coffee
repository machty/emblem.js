Emblem = require './emblem'

# This allows you put <script type="text/x-emblem"> tags
# in your HTML with Emblem code that will be compiled into 
# handlebars.
#
# See packages/ember-handlebars/lib/loader.js in Ember for
# further explanation.
Emblem.bootstrap = (ctx = Ember.$(document)) ->

  Ember.$('script[type="text/x-emblem"]', ctx).each ->
    script = Ember.$(@)
    templateName = script.attr('data-template-name') || script.attr('id') || 'application'
    Ember.TEMPLATES[templateName] = Emblem.compile(script.html())
    script.remove()

# Register hook. If this functionality isn't in the present version of Ember,
# must mqnually put the following code after Ember has been included:
#
#   Ember.onLoad('application', function() { 
#     Emblem.bootstrap();
#   });
#
this.ENV ||= {}
ENV = this.ENV
ENV.EMBER_LOAD_HOOKS ||= {}
ENV.EMBER_LOAD_HOOKS.application ||= []
ENV.EMBER_LOAD_HOOKS.application.push -> Emblem.bootstrap()

