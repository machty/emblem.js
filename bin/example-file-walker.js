var walk = require('walk');
var fs = require('fs');
var path = require('path');
var compile = require('emblem').compile;

var walker = walk.walk("app/templates");
var compiledCount = 0, totalCount = 0, erroredCount = 0;

walker.on("file", fileHandler);

function fileHandler(root, fileStat, next){
  if (path.extname(fileStat.name) !== ".emblem") {
    console.log('skipping ' + fileStat.name);
    return next();
  }
  var filePath = path.resolve(root, fileStat.name);
  var contents = fs.readFileSync(filePath, {encoding:'utf8'});

  try {
    var compiled = compile(contents);
    compiledCount++;

    console.log('compiled!: ',filePath);
  } catch(e) {
    erroredCount++;
    console.log('ERRORED',filePath,contents);
  }

  totalCount++;

  next();
}

walker.on("end", function(){
  console.log({totalCount:totalCount, erroredCount:erroredCount, compiledCount:compiledCount});
});
