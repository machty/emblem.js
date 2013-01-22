require "v8"

# Monkey patches due to bugs in RubyRacer
class V8::JSError
  def initialize(try, to)
    @to = to
    begin
      super(initialize_unsafe(try))
    rescue Exception => e
      # Original code does not make an Array here
      @boundaries = [Boundary.new(:rbframes => e.backtrace)]
      @value = e
      super("BUG! please report. JSError#initialize failed!: #{e.message}")
    end
  end

  def parse_js_frames(try)
    raw = @to.rb(try.StackTrace())
    if raw && !raw.empty?
      raw.split("\n")[1..-1].tap do |frames|
        # Original code uses strip!, and the frames are not guaranteed to be strippable
        frames.each {|frame| frame.strip.chomp!(",")}
      end
    else
      []
    end
  end
end

module Emblem
  module Spec
    def self.js_backtrace(context)
      begin
        context.eval("throw")
      rescue V8::JSError => e
        return e.backtrace(:javascript)
      end
    end

    def self.remove_exports(string)
      string = string.gsub(/^([^\s].*equire[ (].*)$/, "// \1")
      string = string.gsub(/^(module\.)/, "// \1")
    end

    def self.load_helpers(context)
      context["exports"] = nil

      context["p"] = proc do |this, val|
        p val if ENV["DEBUG_JS"]
      end

      context["puts"] = proc do |this, val|
        puts val if ENV["DEBUG_JS"]
      end

      context["puts_caller"] = proc do
        puts "BACKTRACE:"
        puts Emblem::Spec.js_backtrace(context)
        puts
      end
    end

    def self.js_load(context, file)
      str = File.read(file)
      context.eval(remove_exports(str), file)
    end

    CONTEXT = V8::Context.new
    CONTEXT.instance_eval do |context|
      Emblem::Spec.load_helpers(context);

      Emblem::Spec.js_load(context, './node_modules/handlebars/dist/handlebars.js')
      Emblem::Spec.js_load(context, 'vendor/StringScanner.js')
      Emblem::Spec.js_load(context, 'lib/emblem.js')
      Emblem::Spec.js_load(context, 'lib/parser.js')
      Emblem::Spec.js_load(context, 'lib/compiler.js')
      Emblem::Spec.js_load(context, 'lib/preprocessor.js')
      Emblem::Spec.js_load(context, 'lib/translation.js')
      Emblem::Spec.js_load(context, 'lib/emberties.js')

      context["Handlebars"]["logger"]["level"] = ENV["DEBUG_JS"] ? context["Handlebars"]["logger"][ENV["DEBUG_JS"]] : 4

      context["Handlebars"]["logger"]["log"] = proc do |this, level, str|
        logger_level = context["Handlebars"]["logger"]["level"].to_i

        if logger_level <= level
          puts str
        end
      end
    end
  end
end

require "test/unit/assertions"

RSpec.configure do |config|
  config.include Test::Unit::Assertions

  # Each is required to allow classes to mark themselves as compiler tests
  config.before(:each) do
    @context = Emblem::Spec::CONTEXT
  end
end
