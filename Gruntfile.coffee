module.exports = (grunt) ->

  require('matchdep').filterDev('grunt-*')
                     .filter((n) -> n != 'grunt-cli')
                     .forEach(grunt.loadNpmTasks);

  browsers = [
      browserName: "firefox",
      version: "19",
      platform: "XP"
  , 
      browserName: "chrome",
      platform: "XP"
  , 
      browserName: "chrome",
      platform: "linux"
  , 
      browserName: "internet explorer",
      platform: "WIN8",
      version: "10"
  , 
      browserName: "internet explorer",
      platform: "VISTA",
      version: "9"
  , 
      browserName: "opera",
      platform: "Windows 2008",
      version: "12"
  ]


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

    connect:
      server:
        options:
          base: ""
          port: 9999
          middleware: (connect, options) ->
            [
              require('connect-redirection')(),
              ((req, res, next) ->
                if (req.url == '/') 
                  res.redirect('/test') 
                else
                  next()
              ),
              connect.static(options.base)
            ]
    watch: {}       

    open: 
      dev:
        path: 'http://127.0.0.1:9999/',
        app: 'Google Chrome'

    'saucelabs-qunit': 
      all: 
        options: 
          urls: ["http://127.0.0.1:9999/test/index.html"]
          tunnelTimeout: 5
          build: process.env.TRAVIS_JOB_ID
          concurrency: 3
          browsers: browsers
          testname: "qunit tests"
          tags: ["master"]

  grunt.registerTask 'dev', ['connect', 'open:dev', 'watch']

  grunt.registerTask 'compileParser', 'Compile PegJS grammar file', 
                     ['peg', 'concat:grammar']

  grunt.registerTask 'build', ['clean', 'compileParser', 'coffee:lib', 'browserify', 'uglify']

  grunt.registerTask 'test', ['coffee:test', 'qunit', 'simplemocha', 'saucelabs']

  grunt.registerTask 'saucelabs', ['connect', 'saucelabs-qunit']

  # Default task is to build and test.
  grunt.registerTask 'default', ['build', 'test']

