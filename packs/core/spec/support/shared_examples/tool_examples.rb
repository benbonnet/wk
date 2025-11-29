# frozen_string_literal: true

RSpec.shared_examples "a collection tool" do
  it "has route config for collection" do
    expect(described_class.route_config[:scope]).to eq(:collection)
  end

  it "is a collection tool" do
    expect(described_class.collection?).to be true
  end
end

RSpec.shared_examples "a member tool" do
  it "has route config for member" do
    expect(described_class.route_config[:scope]).to eq(:member)
  end

  it "is a member tool" do
    expect(described_class.member?).to be true
  end
end

RSpec.shared_examples "a tool with schema" do
  it "has a schema slug" do
    expect(described_class.schema_slug).to be_present
  end

  it "can find schema class" do
    # Requires schema to be registered first
    expect(described_class.schema_class).not_to be_nil
  end
end
