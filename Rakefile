require "rubygems"
require "bundler/setup"
require 'find'
require 'uglifier'

SRC_PATH   = './src'        
BUILD_PATH = './lib' 

COFFEES = %w{ emblem compiler preprocessor translation emberties }

#minimal_deps = %w(base compiler/parser compiler/base compiler/ast utils compiler/compiler runtime).map do |file|

desc 'Compiles and concatenates source coffeescript files'
task :coffee do
  files = join_filenames(
    COFFEES.map { |file| "#{file}.coffee" },
    SRC_PATH
  )
 
  # Compile everything
  `coffee -b --output #{BUILD_PATH} --compile #{files}`
  if $?.to_i == 0
    puts "Compiled successfully."
  else
    # Send a growl notification on failure if enabled
    system "growlnotify -m 'An error occured while compiling!' 2>/dev/null"
  end
end

def join_filenames(filenames, base='./')
  filenames.map { |f| File.expand_path(File.join(base, f)) }.join(' ')
end

def compile_parser
  system "./node_modules/.bin/pegjs --export-var Emblem.Parser src/grammar.pegjs"
  if $?.success?
    File.open("lib/parser.js", "w") do |file|
      file.puts File.read("src/parser-prefix.js") + File.read("src/grammar.js") + File.read("src/parser-suffix.js")
    end

    # Remove tmp file.
    sh "rm src/grammar.js"
  else
    raise StandardError.new "Failed to run pegjs."
  end
end


file "lib/parser.js" => ["src/grammar.pegjs", "src/parser-prefix.js", "src/parser-suffix.js"] do
  if File.exists?('./node_modules/pegjs')
    compile_parser
  else
    puts "pegjs is not installed. Trying `npm install pegjs`."
    sh "npm install"
    compile_parser
  end
end

file "spec/qunit_spec.js" => ["spec/qunit_spec.coffee"] do
  `coffee -b --compile spec/qunit_spec.coffee`
end

task :compile => ["lib/parser.js", :coffee]

desc "run the spec suite"
task :spec => ["spec/qunit_spec.js", :release] do
  puts "Running RSpec suite"
  rc = system "rspec -cfs spec"
  fail "rspec spec failed with exit code #{$?.exitstatus}" if (rc.nil? || ! rc || $?.exitstatus != 0)
end

desc "run the npm test suite"
task :npm_test => ["spec/qunit_spec.js", :release] do
  puts "Running Mocha suite"
  rc = system "npm test"
  fail "npm test failed with exit code #{$?.exitstatus}" if (rc.nil? || ! rc || $?.exitstatus != 0)
end

task :default => [:compile, :spec, :npm_test]

def remove_exports(string)
  # TODO: HACK, this regex might catch some future code. need a better way to strip out requires
  string = string.gsub(/^([^\s].*equire[ (].*)$/, "// \1")
  string = string.gsub(/^(module\.)/, "// \1")
end

minimal_deps = %w(emblem parser compiler preprocessor translation emberties).map do |file|
  "lib/#{file}.js"
end

directory "dist"

minimal_deps.unshift "dist"

def build_for_task(task)
  FileUtils.rm_rf("dist/*") if File.directory?("dist")
  FileUtils.mkdir_p("dist")

  contents = []

  # Prepend the HB lib on to everything.
  contents << File.read('./vendor/StringScanner.js')
  contents << File.read('./node_modules/handlebars/dist/handlebars.js')

  task.prerequisites.each do |filename|
    next if filename == "dist"

    contents << "// #{filename}\n" + remove_exports(File.read(filename)) + ";"
  end

  File.open(task.name, "w") do |file|
    file.puts contents.join("\n")
  end
end

file "dist/emblem.js" => minimal_deps do |task|
  build_for_task(task)
end

file "dist/emblem.min.js" => ["dist/emblem.js"] do
  minjs = Uglifier.new.compile(File.read("dist/emblem.js"))
  File.open("dist/emblem.min.js", 'w') { |f| f.write(minjs) }
end

task :build => [:compile, "dist/emblem.js", "dist/emblem.min.js"]

desc "build the browser and version of emblem"
task :release => [:build]
