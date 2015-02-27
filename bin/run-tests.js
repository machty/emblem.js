#!/usr/bin/env node

var RSVP = require('rsvp');
var spawn = require('child_process').spawn;
var fs = require('fs');
var chalk = require('chalk');
var testrunner = require("qunit");

testrunner.setup({log:{errors:true}});

function runBrowserTests(command, args) {
  return new RSVP.Promise(function(resolve, reject) {
    console.log('Running: ' + command + ' ' + args.join(' '));

    var child = spawn(command, args);
    var result = {output: [], errors: [], code: null};

    child.stdout.on('data', function (data) {
      var string = data.toString();
      var lines = string.split('\n');

      if (lines.length > 1) {
        lines.forEach(function(line) {
          if (line.indexOf('0 failed.') > -1) {
            console.log(chalk.green(line));
          } else {
            console.log(line);
          }
        });
      } else {
        process.stdout.write(string);
      }
      result.output.push(string);
    });

    child.stderr.on('data', function (data) {
      var string = data.toString();
      result.errors.push(string);
      console.error(chalk.red(string));
    });

    child.on('close', function (code) {
      result.code = code;

      if (code === 0) {
        resolve(result);
      } else {
        reject(result);
      }
    });
  });
}

function walkSync(dir, filelist) {

  if (dir[dir.length-1] != '/') {
    dir = dir.concat('/');
  }

  var files = fs.readdirSync(dir);
  files.forEach(function(file) {
    if (fs.statSync(dir + file).isDirectory()) {
      walkSync(dir + file + '/', filelist);
    }
    else {
      filelist.push(dir+file);
    }
  });
};

function runNodeTests(testDir) {
  var nodeTests = [],
      testPaths = [];

  walkSync(testDir, nodeTests);

  for (var i=0;i<nodeTests.length;i++){
    if (nodeTests[i].match(/.*-test\.js$/)) {
      testPaths.push(nodeTests[i]);
    }
  }

  return new RSVP.Promise(function(resolve, reject){
    if (testPaths.length === 0) {
      resolve();
      return;
    }

    console.log('----');
    console.log("Running: Node test runner against "+testPaths.join(", "));
    testrunner.run({
      code: "tests/support/node-context.js",
      tests: testPaths
    }, function(e, summary){
      if (e) {
        console.log(chalk.red("Error running node tests"));
        return reject(e);
      }
      var summaryText = "Took "+summary.runtime+"ms to run "+
        summary.assertions+" assertions ("+summary.tests+" tests) in node. "+
        summary.passed+" passed, "+summary.failed+" failed.";
      if (summary.failed > 0) {
        console.log(chalk.red(summaryText));
        return reject(e);
      }
      console.log(chalk.green(summaryText));
      resolve(e);
    });
  });
}

// Run tests

var testRuns = RSVP.resolve();

testRuns.then(function(){
  return runBrowserTests('./node_modules/.bin/testem', ['ci', '-R', 'dot']);
}).then(function(){
  return runNodeTests('dist/cjs/tests/');
}).then(function(){
  console.log(chalk.green('Passed!'));
  process.exit(0);
}).catch(function(e) {
  console.error(chalk.red('Failed!'), e.stack);
  process.exit(1);
});
