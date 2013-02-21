# -*- encoding: utf-8 -*-
require 'json'

package = JSON.parse(File.read('package.json'))

Gem::Specification.new do |gem|
  gem.name          = "emblem-source"
  gem.authors       = ["Alex Matchneer"]
  gem.email         = ["machty@gmail.com"]
  gem.date          = Time.now.strftime("%Y-%m-%d")
  gem.description   = %q{Emblem.js source code wrapper for (pre)compilation gems.}
  gem.summary       = %q{Emblem.js source code wrapper}
  gem.homepage      = "https://github.com/machty/emblem.js/"
  gem.version       = package["version"]

  gem.files = [
    'dist/emblem.js',
    'dist/emblem.min.js',
    'lib/emblem/source.rb'
  ]
end
