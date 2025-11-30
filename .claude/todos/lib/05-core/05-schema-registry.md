# 05 - Schema Registry

## File: packs/core/app/lib/core/schema/registry.rb

```ruby
# frozen_string_literal: true

module Core
  module Schema
    class Registry
      class << self
        def all
          @all ||= Set.new
        end

        def register(schema_class)
          all.add(schema_class)
        end

        def find(slug)
          all.find { |s| s.slug == slug.to_s }
        end

        def find!(slug)
          find(slug) || raise(NotFoundError, "Schema '#{slug}' not found")
        end

        def slugs
          all.map(&:slug)
        end

        def clear!
          @all = nil
        end

        # Export all schemas for frontend mocks
        def to_mock_data
          all.map(&:to_mock_data)
        end
      end

      class NotFoundError < StandardError; end
    end

    # Auto-register on inheritance
    class Base
      def self.inherited(subclass)
        super
        # Defer registration until class is fully defined
        TracePoint.new(:end) do |tp|
          if tp.self == subclass
            Registry.register(subclass) unless subclass.name.nil?
            tp.disable
          end
        end.enable
      end
    end
  end
end
```

## Spec: packs/core/spec/lib/core/schema/registry_spec.rb

```ruby
# frozen_string_literal: true

require "rails_helper"

RSpec.describe Core::Schema::Registry do
  let(:schema_class) do
    Class.new(Core::Schema::Base) do
      def self.name
        "TestContactSchema"
      end
      title "TestContact"
    end
  end

  before { described_class.clear! }

  describe ".register" do
    it "adds schema to registry" do
      described_class.register(schema_class)
      expect(described_class.all).to include(schema_class)
    end

    it "prevents duplicates" do
      described_class.register(schema_class)
      described_class.register(schema_class)
      expect(described_class.all.count { |s| s == schema_class }).to eq(1)
    end
  end

  describe ".find" do
    before { described_class.register(schema_class) }

    it "finds schema by slug" do
      expect(described_class.find("test-contact")).to eq(schema_class)
    end

    it "returns nil for unknown slug" do
      expect(described_class.find("unknown")).to be_nil
    end
  end

  describe ".find!" do
    before { described_class.register(schema_class) }

    it "returns schema when found" do
      expect(described_class.find!("test-contact")).to eq(schema_class)
    end

    it "raises NotFoundError when not found" do
      expect { described_class.find!("unknown") }
        .to raise_error(Core::Schema::Registry::NotFoundError)
    end
  end

  describe ".slugs" do
    before { described_class.register(schema_class) }

    it "returns all registered slugs" do
      expect(described_class.slugs).to include("test-contact")
    end
  end

  describe ".clear!" do
    it "removes all registered schemas" do
      described_class.register(schema_class)
      described_class.clear!
      expect(described_class.all).to be_empty
    end
  end

  describe ".to_mock_data" do
    before { described_class.register(schema_class) }

    it "returns array of mock data for all schemas" do
      mocks = described_class.to_mock_data
      expect(mocks).to be_an(Array)
      expect(mocks.first[:slug]).to eq("test-contact")
    end
  end
end
```
