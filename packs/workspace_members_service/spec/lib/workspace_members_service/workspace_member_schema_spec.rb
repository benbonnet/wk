# frozen_string_literal: true

require "rails_helper"

RSpec.describe WorkspaceMembersService::WorkspaceMemberSchema do
  subject(:schema_class) { described_class }

  describe "metadata" do
    it { expect(schema_class.title).to eq("Workspace Member") }
    it { expect(schema_class.slug).to eq("workspace-member") }
  end

  describe "fields" do
    subject(:properties) { schema_class.new.to_json_schema.dig(:schema, :properties) }

    it "has email field" do
      expect(properties[:email]).to include(type: "string")
    end

    it "has role field with enum" do
      expect(properties[:role]).to include(enum: %w[admin manager editor])
    end

    it "has status field with enum" do
      expect(properties[:status]).to include(enum: %w[active blocked pending])
    end
  end

  describe "translations" do
    subject(:translations) { schema_class.translations }

    it { expect(translations).to have_key(:en) }
    it { expect(translations).to have_key(:fr) }

    it "has English translations" do
      expect(translations[:en]).to include(email: "Email", role: "Role")
    end

    it "has French translations" do
      expect(translations[:fr]).to include(email: "Email", role: "Role")
    end
  end
end
