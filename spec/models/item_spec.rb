# frozen_string_literal: true

# == Schema Information
#
# Table name: items
#
#  id            :bigint           not null, primary key
#  data          :jsonb            not null
#  deleted_at    :datetime
#  schema_slug   :string           not null
#  tool_slug     :string           not null
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#  created_by_id :bigint           not null
#  deleted_by_id :bigint
#  updated_by_id :bigint
#  workspace_id  :bigint
#
# Indexes
#
#  index_items_on_created_by_id              (created_by_id)
#  index_items_on_deleted_at                 (deleted_at)
#  index_items_on_deleted_by_id              (deleted_by_id)
#  index_items_on_schema_slug                (schema_slug)
#  index_items_on_schema_slug_and_tool_slug  (schema_slug,tool_slug)
#  index_items_on_tool_slug                  (tool_slug)
#  index_items_on_updated_by_id              (updated_by_id)
#  index_items_on_workspace_id               (workspace_id)
#
# Foreign Keys
#
#  fk_rails_...  (created_by_id => users.id)
#  fk_rails_...  (deleted_by_id => users.id)
#  fk_rails_...  (updated_by_id => users.id)
#  fk_rails_...  (workspace_id => workspaces.id)
#
require "rails_helper"

RSpec.describe Item, type: :model do
  describe "associations" do
    it { is_expected.to belong_to(:workspace).required }
    it { is_expected.to belong_to(:created_by).class_name("User") }
    it { is_expected.to belong_to(:updated_by).class_name("User").optional }
    it { is_expected.to belong_to(:deleted_by).class_name("User").optional }
    it { is_expected.to have_many(:item_recipients).dependent(:destroy) }
    it { is_expected.to have_many(:documents).dependent(:destroy) }
    it { is_expected.to have_many(:activities).dependent(:destroy) }
  end

  describe "validations" do
    subject { build(:item) }

    it { is_expected.to validate_presence_of(:schema_slug) }
    it { is_expected.to validate_presence_of(:tool_slug) }
    it { is_expected.to validate_presence_of(:data) }
    it { is_expected.to validate_presence_of(:created_by) }

    it { is_expected.to allow_value("contacts").for(:schema_slug) }
    it { is_expected.to allow_value("my-schema_123").for(:schema_slug) }
    it { is_expected.not_to allow_value("My Schema").for(:schema_slug) }

    it { is_expected.to allow_value("create").for(:tool_slug) }
    it { is_expected.not_to allow_value("Create Tool").for(:tool_slug) }
  end

  describe "scopes" do
    let!(:active_item) { create(:item) }
    let!(:deleted_item) { create(:item, deleted_at: Time.current) }

    it ".active returns non-deleted items" do
      expect(described_class.active).to include(active_item)
      expect(described_class.active).not_to include(deleted_item)
    end

    it ".deleted returns deleted items" do
      expect(described_class.deleted).to include(deleted_item)
      expect(described_class.deleted).not_to include(active_item)
    end
  end
end
