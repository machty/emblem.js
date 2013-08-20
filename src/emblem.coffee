
this.Emblem = {}
Emblem = this.Emblem

Emblem.VERSION = "0.3.1"

module.exports = Emblem

window.Emblem = Emblem if window?

require './parser'
require './compiler'
require './preprocessor'
require './emberties'

