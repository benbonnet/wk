# frozen_string_literal: true

RSpec.shared_examples "a valid schema" do
  it "has a title" do
    expect(described_class.title).to be_present
  end

  it "has a slug" do
    expect(described_class.slug).to be_present
    expect(described_class.slug).to match(/^[a-z0-9-]+$/)
  end

  it "has properties" do
    expect(described_class.properties).to be_a(Hash)
  end

  it "generates valid JSON schema" do
    expect { described_class.new.to_json_schema }.not_to raise_error
  end
end

RSpec.shared_examples "a schema with relationships" do
  it "has relationship definitions" do
    expect(described_class.relationships).to be_an(Array)
    expect(described_class.relationships).not_to be_empty
  end

  it "has valid relationship structure" do
    described_class.relationships.each do |rel|
      expect(rel).to have_key(:name)
      expect(rel).to have_key(:cardinality)
      expect(rel).to have_key(:target_schema)
      expect(rel[:cardinality]).to be_in([ :one, :many ])
    end
  end
end

RSpec.shared_examples "a schema with translations" do
  it "has translation data" do
    expect(described_class.translations).to be_a(Hash)
    expect(described_class.translations).not_to be_empty
  end

  it "supports English locale" do
    expect(described_class.translations).to have_key(:en)
  end
end
