# frozen_string_literal: true

require "rails_helper"
require "rake"

RSpec.describe "core:export_mocks" do
  before(:all) do
    Rails.application.load_tasks
  end

  around do |example|
    Dir.mktmpdir do |tmpdir|
      @output_dir = tmpdir
      example.run
    end
  end

  before do
    Rake::Task["core:export_mocks"].reenable
    Core::Schema::Registry.clear!
    Core::Features::Registry.clear!
  end

  let(:test_schema) do
    Class.new(Core::Schema::Base) do
      def self.name = "TestPack::ItemSchema"

      title "Item"
      string :name

      relationships do
        has_one :parent, schema: :item, inverse: :children
        has_many :children, schema: :item, inverse: :parent
      end

      translations(en: { name: "Name" })
    end
  end

  let(:test_view) do
    Class.new do
      include Ui::Views::BaseView

      def self.name = "TestPack::Views::Index"

      view do
        field :name, type: "INPUT_TEXT"
      end
    end
  end

  before do
    # Create test pack structure
    FileUtils.mkdir_p(Rails.root.join("packs/test_pack/app/lib"))

    # Register schema
    Core::Schema::Registry.register(test_schema)

    # Register feature with view
    Core::Features::Registry.register(
      namespace: :test,
      feature: :items,
      schema: :item,
      tools: [],
      views: [test_view]
    )

    Core::Relationships::Registry.reload!
  end

  after do
    FileUtils.rm_rf(Rails.root.join("packs/test_pack"))
  end

  it "exports schemas, relationships, and views to custom output directory" do
    ENV["OUTPUT_DIR"] = @output_dir
    ENV["SILENT"] = "true"

    Rake::Task["core:export_mocks"].invoke

    pack_dir = Pathname.new(@output_dir).join("test_pack")

    # Schemas exported
    schemas_file = pack_dir.join("schemas.json")
    expect(File.exist?(schemas_file)).to be true
    schemas = JSON.parse(File.read(schemas_file))
    expect(schemas.first["slug"]).to eq("item")

    # Relationships exported
    relationships_file = pack_dir.join("relationships.json")
    expect(File.exist?(relationships_file)).to be true
    rels = JSON.parse(File.read(relationships_file))
    expect(rels["item"]).to have_key("parent")
    expect(rels["item"]).to have_key("children")
    expect(rels["item"]["parent"]["cardinality"]).to eq("one")
    expect(rels["item"]["children"]["cardinality"]).to eq("many")

    # Views exported
    views_file = pack_dir.join("views/items_index.json")
    expect(File.exist?(views_file)).to be true
    view = JSON.parse(File.read(views_file))
    expect(view["type"]).to eq("VIEW")
  ensure
    ENV.delete("OUTPUT_DIR")
    ENV.delete("SILENT")
  end
end
