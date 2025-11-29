# frozen_string_literal: true

module Ui
  module Views
    # Mixin for view classes
    # Provides view DSL and config storage
    module BaseView
      def self.included(base)
        base.extend(ClassMethods)
      end

      module ClassMethods
        def view(&block)
          @view_block = block
        end

        def view_config
          return @view_config if @view_config

          builder = ViewBuilder.new
          builder.instance_eval(&@view_block)
          @view_config = builder.to_ui_schema
        end

        def has_view?
          !@view_block.nil?
        end
      end
    end
  end
end
