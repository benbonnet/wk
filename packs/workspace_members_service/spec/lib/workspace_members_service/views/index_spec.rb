# frozen_string_literal: true

require "rails_helper"

RSpec.describe WorkspaceMembersService::Views::Index do
  subject(:config) { described_class.view_config_raw }

  let(:page) { config[:elements]&.find { |e| e[:type] == "PAGE" } }
  let(:group) { page[:elements]&.find { |e| e[:type] == "GROUP" } }
  let(:table) { group[:elements]&.find { |e| e[:type] == "TABLE" } }

  it "has frontend route" do
    expect(described_class.frontend_route).to eq("/members")
  end

  describe "translations" do
    it "has English translations" do
      expect(config[:translations][:en][:page_title]).to eq("Team Members")
    end

    it "has French translations" do
      expect(config[:translations][:fr][:page_title]).to eq("Membres de l'equipe")
    end

    it "has confirm dialog translations" do
      expect(config[:translations][:en][:remove_title]).to eq("Remove team member?")
      expect(config[:translations][:en][:block_title]).to eq("Block team member?")
    end
  end

  describe "drawers" do
    it { expect(config[:drawers]).to be_a(Hash) }
    it { expect(config[:drawers]).to have_key(:add_drawer) }
    it { expect(config[:drawers]).to have_key(:edit_drawer) }
  end

  describe "table" do
    it "has required columns" do
      column_names = table[:columns].map { |c| c[:name].to_s }
      expect(column_names).to include("name", "email", "role", "status", "created_at")
    end

    it "has row actions" do
      expect(table[:rowActions]).to be_present
    end
  end
end
