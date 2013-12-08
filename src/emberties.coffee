Emblem = require './emblem'

if window?

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

  window.ENV ||= {}
  ENV = window.ENV
  ENV.EMBER_LOAD_HOOKS ||= {}

  # Support old and new styles.
  # Note: New style (Ember.Application) is necessary for Ember.Component support.
  ENV.EMBER_LOAD_HOOKS.application ||= []
  ENV.EMBER_LOAD_HOOKS['Ember.Application'] ||= []
  ENV.EMBER_LOAD_HOOKS.application.push Emblem.compileScriptTags
  ENV.EMBER_LOAD_HOOKS['Ember.Application'].push (Application) -> 
    if Application.initializer
      Application.initializer
        name: 'emblemDomTemplates'
        before: 'registerComponentLookup'
        initialize: Emblem.compileScriptTags
    else 
      Ember.onLoad 'application', Emblem.compileScriptTags

