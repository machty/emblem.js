
this.Emblem = {}
Emblem = this.Emblem

Emblem.VERSION = "0.3.3"

module.exports = Emblem

# TODO: don't pollute the global namespace.
# The use of global here is necessary because
# of the prevalence of precompilation libs/gems
# that expect it to be global. 
# Looking at you, barber-emblem...
window.Emblem = Emblem if window?
global.Emblem = Emblem

require './parser'
require './compiler'
require './preprocessor'
require './emberties'

