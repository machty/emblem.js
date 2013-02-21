module Emblem
  module Source
    def self.bundled_path
      File.expand_path("../../../dist/emblem.js", __FILE__)
    end

    def self.min_bundled_path
      File.expand_path("../../../dist/emblem.min.js", __FILE__)
    end
  end
end
