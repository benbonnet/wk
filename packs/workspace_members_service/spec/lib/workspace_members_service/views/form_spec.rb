# frozen_string_literal: true

require "rails_helper"

RSpec.describe WorkspaceMembersService::Views::Form do
  subject(:config) { described_class.view_config_raw }

  it "links to schema" do
    expect(described_class.schema).to eq(WorkspaceMembersService::WorkspaceMemberSchema)
  end

  describe "form structure" do
    let(:form) { config[:elements].find { |e| e[:type] == "FORM" } }
    let(:fields) { extract_fields(form) }

    it "has email field" do
      email = fields.find { |f| f[:name] == "email" }
      expect(email[:type]).to eq("INPUT_EMAIL")
    end

    it "has role field" do
      role = fields.find { |f| f[:name] == "role" }
      expect(role[:type]).to eq("INPUT_SELECT")
      expect(role[:options].length).to eq(3)
    end

    it "has submit button" do
      submit = find_element(form, "SUBMIT")
      expect(submit).to be_present
    end
  end

  describe "translations" do
    it { expect(config[:translations]).to have_key(:en) }
    it { expect(config[:translations]).to have_key(:fr) }

    it "has button translations" do
      expect(config[:translations][:en]).to include(save: "Save", saving: "Saving...")
    end
  end

  private

  def extract_fields(element, fields = [])
    return fields unless element

    if element[:type]&.start_with?("INPUT_")
      fields << element
    end

    element[:elements]&.each { |e| extract_fields(e, fields) }
    fields
  end

  def find_element(element, type)
    return element if element[:type] == type

    element[:elements]&.each do |e|
      result = find_element(e, type)
      return result if result
    end
    nil
  end
end
