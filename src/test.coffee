{Preprocessor} = require 'preprocessor'
inspect = (o) -> (require 'util').inspect o, no, 9e9, yes
fs = require 'fs'

content = fs.readFileSync '../test/samples/simple.emblem'
p = Preprocessor.processSync content

console.log "Preprocessed:\n#{p}\n\n"

parser = require 'grammar'
result = parser.parse p
console.log inspect result
#console.log result[0].attrs.classes[0]

#console.log()
#console.log result[2].content


