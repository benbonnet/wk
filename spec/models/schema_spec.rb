# frozen_string_literal: true

require "rails_helper"

RSpec.describe Schema, type: :model do
  describe "associations" do
    it { is_expected.to belong_to(:workspace).optional }
    it { is_expected.to have_many(:feature_tools).dependent(:nullify) }
  end

  describe "validations" do
    subject { build(:schema) }

    it { is_expected.to validate_presence_of(:identifier) }
    it { is_expected.to validate_uniqueness_of(:identifier) }
    it { is_expected.to validate_presence_of(:data) }
  end

  describe "scopes" do
    let!(:active_schema) { create(:schema) }
    let!(:archived_schema) { create(:schema, deleted_at: Time.current) }

    it ".active returns non-archived schemas" do
      expect(described_class.active).to include(active_schema)
      expect(described_class.active).not_to include(archived_schema)
    end

    it ".archived returns archived schemas" do
      expect(described_class.archived).to include(archived_schema)
      expect(described_class.archived).not_to include(active_schema)
    end
  end
end
