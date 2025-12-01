# frozen_string_literal: true

module Core
  module Features
    class << self
      def configure(&block)
        Configurator.new.instance_eval(&block)
      end

      def reset!
        Registry.clear!
        Schema::Registry.clear!
        Relationships::Registry.clear!
      end
    end
  end
end
