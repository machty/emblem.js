require "rubygems"
require "bundler/setup"

def compile_parser
  system "./node_modules/.bin/pegjs src/emblem.pegjs lib/emblem/compiler/parser.js"

  unless $?.success?
    puts "Failed to run PEG.js."
  end
end

file "lib/emblem/compiler/parser.js" => ["src/emblem.pegjs"] do
  if File.exists?('./node_modules/pegjs')
    compile_parser
  else
    puts "PEG.js is not installed. Trying `npm install`."
    sh "npm install"
    compile_parser
  end
end

task :compile => "lib/emblem/compiler/parser.js"

desc "run the spec suite"
task :spec => [:release] do
  rc = system "rspec -cfs spec"
  fail "rspec spec failed with exit code #{$?.exitstatus}" if (rc.nil? || ! rc || $?.exitstatus != 0)
end

desc "run the npm test suite"
task :npm_test => [:release] do
  rc = system "npm test"
  fail "npm test failed with exit code #{$?.exitstatus}" if (rc.nil? || ! rc || $?.exitstatus != 0)
end

task :default => [:compile, :spec, :npm_test]

def remove_exports(string)
  match = string.match(%r{^// BEGIN\(BROWSER\)\n(.*)\n^// END\(BROWSER\)}m)
  match ? match[1] : string
end

minimal_deps = %w(base compiler/parser compiler/base compiler/ast utils compiler/compiler).map do |file|
  "lib/emblem/#{file}.js"
end

directory "dist"

minimal_deps.unshift "dist"

def build_for_task(task)
  FileUtils.rm_rf("dist/*") if File.directory?("dist")
  FileUtils.mkdir_p("dist")

  contents = []
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

task :build => [:compile, "dist/emblem.js"]

desc "build the build and runtime version of emblem"
task :release => [:build]

# Benchmark

directory "vendor"

desc "benchmark against dust.js and mustache.js"
task :bench => "vendor" do
  require "open-uri"
  system "node bench/emblem.js"
end

