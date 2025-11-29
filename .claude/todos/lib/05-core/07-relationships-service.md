# 07 - Relationships Service

## File: packs/core/app/lib/core/relationships/service.rb

```ruby
# frozen_string_literal: true

module Core
  module Relationships
    class Service
      attr_reader :source_item, :target_item, :relationship_type, :metadata

      def initialize(source_item:, target_item:, relationship_type:, metadata: {})
        @source_item = source_item
        @target_item = target_item
        @relationship_type = relationship_type.to_s
        @metadata = metadata
      end

      def create(create_inverse: true)
        validate_relationship!

        ActiveRecord::Base.transaction do
          forward = create_link(source_item, target_item, relationship_type)

          if create_inverse && inverse_type
            create_link(target_item, source_item, inverse_type)
          end

          forward
        end
      end

      def destroy(destroy_inverse: true)
        ActiveRecord::Base.transaction do
          destroy_link(source_item, target_item, relationship_type)

          if destroy_inverse && inverse_type
            destroy_link(target_item, source_item, inverse_type)
          end
        end
      end

      def self.create(**args)
        new(**args).create
      end

      def self.destroy(**args)
        new(**args).destroy
      end

      private

      def inverse_type
        @inverse_type ||= Registry.inverse_of(source_item.schema_slug, relationship_type)&.to_s
      end

      def validate_relationship!
        valid = Registry.valid?(
          source_schema: source_item.schema_slug,
          target_schema: target_item.schema_slug,
          relationship_type: relationship_type
        )

        unless valid
          raise InvalidRelationshipError,
                "Invalid relationship: #{source_item.schema_slug}->#{relationship_type}->#{target_item.schema_slug}"
        end
      end

      def create_link(source, target, type)
        ItemRelationship.create!(
          source_item: source,
          target_item: target,
          relationship_type: type,
          metadata: metadata
        )
      end

      def destroy_link(source, target, type)
        ItemRelationship.where(
          source_item: source,
          target_item: target,
          relationship_type: type
        ).destroy_all
      end

      class InvalidRelationshipError < StandardError; end
    end
  end
end
```

## Spec: packs/core/spec/lib/core/relationships/service_spec.rb

```ruby
# frozen_string_literal: true

require "rails_helper"

RSpec.describe Core::Relationships::Service do
  let(:contact_schema) do
    Class.new(Core::Schema::Base) do
      def self.name
        "ContactSchema"
      end
      title "Contact"

      relationships do
        has_many :children, schema: :contact, inverse: :parents
        has_many :parents, schema: :contact, inverse: :children
      end
    end
  end

  let(:user) { create(:user) }
  let(:parent_item) { create(:item, schema_slug: "contact", created_by: user) }
  let(:child_item) { create(:item, schema_slug: "contact", created_by: user) }

  before do
    Core::Schema::Registry.clear!
    Core::Schema::Registry.register(contact_schema)
    Core::Relationships::Registry.reload!
  end

  describe "#create" do
    subject(:service) do
      described_class.new(
        source_item: parent_item,
        target_item: child_item,
        relationship_type: "children"
      )
    end

    it "creates the forward relationship" do
      expect { service.create }.to change(ItemRelationship, :count).by(2)
    end

    it "creates the inverse relationship" do
      service.create

      inverse = ItemRelationship.find_by(
        source_item: child_item,
        target_item: parent_item,
        relationship_type: "parents"
      )
      expect(inverse).to be_present
    end

    it "skips inverse when create_inverse: false" do
      expect { service.create(create_inverse: false) }
        .to change(ItemRelationship, :count).by(1)
    end

    it "raises error for invalid relationship" do
      invalid_service = described_class.new(
        source_item: parent_item,
        target_item: child_item,
        relationship_type: "invalid"
      )

      expect { invalid_service.create }
        .to raise_error(Core::Relationships::Service::InvalidRelationshipError)
    end
  end

  describe "#destroy" do
    before do
      described_class.create(
        source_item: parent_item,
        target_item: child_item,
        relationship_type: "children"
      )
    end

    subject(:service) do
      described_class.new(
        source_item: parent_item,
        target_item: child_item,
        relationship_type: "children"
      )
    end

    it "destroys forward and inverse relationships" do
      expect { service.destroy }.to change(ItemRelationship, :count).by(-2)
    end

    it "destroys only forward when destroy_inverse: false" do
      expect { service.destroy(destroy_inverse: false) }
        .to change(ItemRelationship, :count).by(-1)
    end
  end

  describe ".create class method" do
    it "creates relationships" do
      expect do
        described_class.create(
          source_item: parent_item,
          target_item: child_item,
          relationship_type: "children"
        )
      end.to change(ItemRelationship, :count).by(2)
    end
  end

  describe ".destroy class method" do
    before do
      described_class.create(
        source_item: parent_item,
        target_item: child_item,
        relationship_type: "children"
      )
    end

    it "destroys relationships" do
      expect do
        described_class.destroy(
          source_item: parent_item,
          target_item: child_item,
          relationship_type: "children"
        )
      end.to change(ItemRelationship, :count).by(-2)
    end
  end
end
```
