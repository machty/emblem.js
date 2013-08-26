module.exports = (grunt) ->

  require('matchdep').filterDev('grunt-*')
                     .filter((n) -> n != 'grunt-cli')
                     .forEach(grunt.loadNpmTasks);

  # Project configuration.
  grunt.initConfig
    clean: ["tmp", "dist"]

    coffee:
      lib:
        files: [
          expand: true
          cwd: 'src/'
          src: ['**/*.coffee']
          dest: 'lib/'
          ext: '.js'
        ]
      test:
        files:
          'test/qunit_spec.js': 'test/qunit_spec.coffee'
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

    browserify: 
      dist:
        files:
          'dist/emblem.js': 'lib/emblem.js'

    uglify:
      dist:
        files:
          'dist/emblem.min.js': 'dist/emblem.js'
      options:
        beautify: 
          # Special unicode IN/DEDENT tokens get clobbered unless this is set.
          ascii_only : true

    qunit: 
      all: ['test/**/*.html']

    simplemocha:
      all: 
        src: ['test/**/*.js']

      options:
        ui: 'qunit'

  grunt.registerTask 'compileParser', 'Compile PegJS grammar file', 
                     ['peg', 'concat:grammar']

  grunt.registerTask 'build', ['clean', 'compileParser', 'coffee:lib', 'browserify', 'uglify']

  grunt.registerTask 'test', ['coffee:test', 'qunit', 'simplemocha']

  # Default task is to build and test.
  grunt.registerTask 'default', ['build', 'test']

