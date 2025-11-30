# frozen_string_literal: true

module Core
  class << self
    def reload!
      Schema::Registry.clear!
      Relationships::Registry.reload!
      Features::Registry.clear!
    end
  end
end
