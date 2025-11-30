# 09 - Tools Base Class

## File: packs/core/app/lib/core/tools/base.rb

```ruby
# frozen_string_literal: true

module Core
  module Tools
    class Base
      include Routing

      class << self
        attr_reader :schema_slug, :serializer_name

        def schema(slug)
          @schema_slug = slug.to_s
        end

        def serializer(name)
          @serializer_name = name
        end

        def schema_class
          Schema::Registry.find(schema_slug)
        end

        def call(context, params = {})
          new(context).execute(**params.symbolize_keys)
        end
      end

      attr_reader :context

      def initialize(context)
        @context = context
      end

      def execute(**params)
        raise NotImplementedError, "#{self.class}#execute must be implemented"
      end

      protected

      def current_user
        context.respond_to?(:current_user) ? context.current_user : nil
      end

      def current_workspace
        context.respond_to?(:current_workspace) ? context.current_workspace : nil
      end

      def schema_class
        self.class.schema_class
      end

      def items
        Item.where(schema_slug: self.class.schema_slug)
      end

      def find_item(id)
        items.find_by(id: id)
      end

      def find_item!(id)
        items.find(id)
      rescue ActiveRecord::RecordNotFound
        raise NotFoundError, "#{self.class.schema_slug} not found: #{id}"
      end
    end

    # Error classes
    class ValidationError < StandardError
      attr_reader :details
      def initialize(message, details = {})
        super(message)
        @details = details
      end
    end

    class NotFoundError < StandardError; end
    class ForbiddenError < StandardError; end
  end
end
```

## Spec: packs/core/spec/lib/core/tools/base_spec.rb

```ruby
# frozen_string_literal: true

require "rails_helper"

RSpec.describe Core::Tools::Base do
  let(:schema_class) do
    Class.new(Core::Schema::Base) do
      def self.name
        "ContactSchema"
      end
      title "Contact"
      string :name
    end
  end

  let(:tool_class) do
    Class.new(Core::Tools::Base) do
      route method: :get, scope: :collection
      schema "contact"

      def execute(page: 1, **_)
        { page: page, items: [] }
      end
    end
  end

  let(:context) { double("controller", current_user: nil, current_workspace: nil) }

  before do
    Core::Schema::Registry.clear!
    Core::Schema::Registry.register(schema_class)
  end

  describe ".schema" do
    it "stores schema slug" do
      expect(tool_class.schema_slug).to eq("contact")
    end
  end

  describe ".schema_class" do
    it "returns the schema class from registry" do
      expect(tool_class.schema_class).to eq(schema_class)
    end
  end

  describe ".call" do
    it "instantiates and executes tool" do
      result = tool_class.call(context, page: 2)
      expect(result[:page]).to eq(2)
    end
  end

  describe "#execute" do
    it "must be implemented by subclass" do
      base_tool = Class.new(Core::Tools::Base)

      expect { base_tool.call(context, {}) }
        .to raise_error(NotImplementedError)
    end
  end

  describe "#context" do
    it "stores the controller context" do
      tool = tool_class.new(context)
      expect(tool.context).to eq(context)
    end
  end

  describe "#current_user" do
    it "delegates to context" do
      user = double("user")
      allow(context).to receive(:current_user).and_return(user)

      tool = tool_class.new(context)
      expect(tool.send(:current_user)).to eq(user)
    end
  end

  describe "#find_item!" do
    let(:user) { create(:user) }
    let(:item) { create(:item, schema_slug: "contact", created_by: user) }

    it "returns item when found" do
      tool = tool_class.new(context)
      expect(tool.send(:find_item!, item.id)).to eq(item)
    end

    it "raises NotFoundError when not found" do
      tool = tool_class.new(context)
      expect { tool.send(:find_item!, 99999) }
        .to raise_error(Core::Tools::NotFoundError)
    end
  end
end
```
