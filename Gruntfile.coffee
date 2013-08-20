module.exports = (grunt) ->

  # Project configuration.
  grunt.initConfig
    foo: 123
    pkg: grunt.file.readJSON('package.json')
    borf: "snork"
    woot:
      shart: "Bork bork nork nork <%= foo %> stork fork"
    uglify: 
      options: 
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      build: 
        src: 'src/<%= pkg.name %>.js'
        dest: 'build/<%= pkg.name %>.min.js'

    clean: ["tmp", "dist"]

    coffee:
      lib:
        files:
          'lib/compiler.js':     'src/compiler.coffee'
          'lib/emberties.js':    'src/emberties.coffee'
          'lib/emblem.js':       'src/emblem.coffee'
          'lib/preprocessor.js': 'src/preprocessor.coffee'
      options:
        bare: true
         
    peg:
      grammar: 
        src: "src/grammar.pegjs"
        dest: "tmp/grammar.js"
        options: 
          exportVar: 'Emblem.Parser'

    concat:
      grammar:
        src: "tmp/grammar.js"
        dest: "lib/parser.js"
        options:
          banner: "var Emblem = require('./emblem');\n\n"
          footer: "\n\nmodule.exports = Emblem.Parser;\n"

  grunt.registerTask 'compileParser', 'Compile PegJS grammar file', 
                     ['peg', 'concat:grammar']

  grunt.loadNpmTasks 'grunt-coffeeify'
  grunt.loadNpmTasks 'grunt-contrib-coffee'
  grunt.loadNpmTasks 'grunt-peg'
  grunt.loadNpmTasks 'grunt-contrib-clean'
  grunt.loadNpmTasks 'grunt-contrib-concat'

  grunt.registerTask 'build', ['clean', 'compileParser', 'coffee'] #, 'browserify']

  # Default task is to build and test.
  grunt.registerTask 'default', ['build']

  # We need to:
  # 2) Compile *.coffee into *.js
  #    -- At this point, everything should be in lib/ with proper requires that you'd expect.
  # 3) Create dist/emblem.js
  # 4) Create dist/emblem.min.js


