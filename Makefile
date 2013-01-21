default: all

SRC = $(shell find src -name "*.coffee" -type f | sort)

# LIB is everything is src/*.coffee mapped to to lib/emblem/*.js and parser.js
LIB = $(SRC:src/%.coffee=lib/emblem/%.js) lib/emblem/parser.js
ROOT = $(shell pwd)

COFFEE = node_modules/.bin/coffee -c --bare
PEGJS = node_modules/.bin/pegjs --cache --export-var 'module.exports'
MOCHA = node_modules/.bin/mocha --compilers coffee:. -u tdd
BROWSERIFY = node_modules/.bin/browserify
MINIFIER = node_modules/.bin/esmangle

all: lib/emblem $(LIB)
build: all
parser: lib/emblem lib/emblem/parser.js

lib:
	mkdir lib/
lib/emblem: lib
	mkdir -p lib/emblem/

dist: $(LIB)
	mkdir -p dist
	$(BROWSERIFY) lib/emblem/module.js | $(MINIFIER) > dist/emblem.min.js

lib/emblem/parser.js: src/grammar.pegjs
	$(PEGJS) <"$<" >"$(@:%=%.tmp)" && mv "$(@:%=%.tmp)" "$@"

lib/emblem/%.js: src/%.coffee 
	$(COFFEE) -c -o lib/emblem/ "$<" #&& mv "$(@:%=%.tmp)" "$@"


.PHONY: test install clean


test:
	$(MOCHA) -R dot

install:
	npm install

clean:
	rm -rf instrumented
	rm -f coverage.html
	rm -rf lib/emblem
