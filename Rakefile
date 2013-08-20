require "rubygems"
require "bundler/setup"
require 'find'
require 'uglifier'
require 'coffee-script'

SRC_PATH   = './src'
BUILD_PATH = './lib'

COFFEES = %w{ emblem compiler preprocessor emberties }

def join_filenames(filenames, base='./')
  filenames.map { |f| File.expand_path(File.join(base, f)) }.join(' ')
end

file "spec/qunit_spec.js" => ["spec/qunit_spec.coffee"] do
  `coffee -b --compile spec/qunit_spec.coffee`
end

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

directory "node_modules" do
  `npm install`
end

task :default => [:build, :spec, :npm_test]

def remove_exports(string)
  # TODO: HACK, this regex might catch some future code. need a better way to strip out requires
  string = string.gsub(/^[^\s].*equire[ (].*$/, "")
  string = string.gsub(/^module\..*$/, "")
end

minimal_deps = %w(emblem parser compiler preprocessor emberties).map do |file|
  "lib/#{file}.js"
end

directory "dist"

minimal_deps.unshift "dist"

def build_for_task(task)
  contents = []
  contents << File.read('./vendor/StringScanner.js')

  task.prerequisites.each do |filename|
    next if filename == "dist"

    contents << "// #{filename}\n" + remove_exports(File.read(filename)) + ";"
  end

  contents = <<-EOS
  (function(root) {

    #{contents.join("\n")}

    root.Emblem = Emblem;

  }(this));
  EOS
  #contents = contents.join("\n")

  File.open(task.name, "w") do |file|
    file.puts contents
  end
end

file "dist/emblem.js" => minimal_deps do |task|
  build_for_task(task)
end

file "dist/emblem.min.js" => ["dist/emblem.js"] do
  minjs = Uglifier.new.compile(File.read("dist/emblem.js"))
  File.open("dist/emblem.min.js", 'w') { |f| f.write(minjs) }
end

task :build => ["node_modules", :compile, "dist/emblem.js", "dist/emblem.min.js"]

desc "build the browser and version of emblem"
task :release => [:build]

