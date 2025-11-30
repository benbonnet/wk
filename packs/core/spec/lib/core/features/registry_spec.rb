# frozen_string_literal: true

require "rails_helper"

RSpec.describe Core::Features::Registry do
  let(:index_tool) do
    Class.new(Core::Tools::Base) do
      route method: :get, scope: :collection

      def self.name
        "TestTools::Index"
      end
    end
  end

  let(:show_tool) do
    Class.new(Core::Tools::Base) do
      route method: :get, scope: :member

      def self.name
        "TestTools::Show"
      end
    end
  end

  let(:create_tool) do
    Class.new(Core::Tools::Base) do
      route method: :post, scope: :collection

      def self.name
        "TestTools::Create"
      end
    end
  end

  let(:publish_tool) do
    Class.new(Core::Tools::Base) do
      route method: :post, scope: :member, action: "publish"

      def self.name
        "TestTools::Publish"
      end
    end
  end

  describe ".register" do
    it "registers a feature with tools" do
      described_class.register(
        namespace: :test_ns,
        feature: :test_feature,
        tools: [index_tool, show_tool, create_tool]
      )

      expect(described_class.find(:test_ns, :test_feature)).to be_present
    end
  end

  describe ".find" do
    before do
      described_class.register(
        namespace: :test_ns,
        feature: :test_contacts,
        schema: :test_contact,
        tools: [index_tool]
      )
    end

    it "finds registered feature" do
      feature = described_class.find(:test_ns, :test_contacts)
      expect(feature[:schema]).to eq(:test_contact)
    end

    it "returns nil for unregistered feature" do
      expect(described_class.find(:unknown_ns, :unknown_feature)).to be_nil
    end
  end

  describe ".tools_for" do
    before do
      described_class.register(
        namespace: :test_ns,
        feature: :test_items,
        tools: [index_tool, show_tool]
      )
    end

    it "returns tools for feature" do
      tools = described_class.tools_for(:test_ns, :test_items)
      expect(tools).to contain_exactly(index_tool, show_tool)
    end

    it "returns empty array for unknown feature" do
      expect(described_class.tools_for(:unknown_ns, :unknown_feature)).to eq([])
    end
  end

  describe ".find_tool" do
    before do
      described_class.register(
        namespace: :test_ns,
        feature: :test_resources,
        tools: [index_tool, show_tool, create_tool, publish_tool]
      )
    end

    it "finds GET collection tool" do
      tool = described_class.find_tool(
        :test_ns, :test_resources,
        http_method: :get, scope: :collection
      )
      expect(tool).to eq(index_tool)
    end

    it "finds GET member tool" do
      tool = described_class.find_tool(
        :test_ns, :test_resources,
        http_method: :get, scope: :member
      )
      expect(tool).to eq(show_tool)
    end

    it "finds POST collection tool" do
      tool = described_class.find_tool(
        :test_ns, :test_resources,
        http_method: :post, scope: :collection
      )
      expect(tool).to eq(create_tool)
    end

    it "finds custom action tool" do
      tool = described_class.find_tool(
        :test_ns, :test_resources,
        http_method: :post, scope: :member, action: "publish"
      )
      expect(tool).to eq(publish_tool)
    end

    it "returns nil for non-matching route" do
      tool = described_class.find_tool(
        :test_ns, :test_resources,
        http_method: :delete, scope: :collection
      )
      expect(tool).to be_nil
    end
  end

  describe ".to_mock_data" do
    before do
      described_class.register(
        namespace: :mock_ns,
        feature: :mock_items,
        schema: :mock_item,
        tools: [index_tool]
      )
    end

    it "exports features for frontend mocks" do
      mocks = described_class.to_mock_data
      mock_ns = mocks.find { |m| m[:namespace] == :mock_ns }
      expect(mock_ns).to be_present
      expect(mock_ns[:features].first[:slug]).to eq(:mock_items)
    end
  end

  describe ".view_config" do
    let(:view_class) do
      Class.new do
        include Ui::Views::BaseView

        view do
          translations(en: { title: "Test" })
          page do |c|
            c.title "title"
          end
        end

        def self.name
          "TestViews::Index"
        end
      end
    end

    before do
      described_class.register(
        namespace: :workspaces,
        feature: :test_contacts,
        tools: [index_tool, show_tool, create_tool],
        views: [view_class]
      )
    end

    it "returns complete config with derived url" do
      config = described_class.view_config(:workspaces, :test_contacts, :index)
      expect(config[:url]).to eq("/api/v1/workspaces/test_contacts")
    end

    it "derives api from tools" do
      config = described_class.view_config(:workspaces, :test_contacts, :index)
      expect(config[:api]).to be_a(Hash)
      expect(config[:api].keys).to include(:index, :show, :create)
    end

    it "includes raw view config (translations, elements)" do
      config = described_class.view_config(:workspaces, :test_contacts, :index)
      expect(config[:translations]).to be_present
      expect(config[:elements]).to be_present
    end

    it "returns nil for non-existent view" do
      expect(described_class.view_config(:workspaces, :test_contacts, :nonexistent)).to be_nil
    end
  end

  describe ".derive_api_for_feature" do
    before do
      described_class.register(
        namespace: :api_ns,
        feature: :api_items,
        tools: [index_tool, show_tool, create_tool, publish_tool]
      )
    end

    it "derives API registry from tools" do
      api = described_class.derive_api_for_feature(:api_ns, :api_items)

      expect(api[:index]).to eq({ method: "GET", path: "" })
      expect(api[:show]).to eq({ method: "GET", path: ":id" })
      expect(api[:create]).to eq({ method: "POST", path: "" })
      expect(api[:publish]).to eq({ method: "POST", path: ":id/publish" })
    end

    it "returns empty hash for unknown feature" do
      expect(described_class.derive_api_for_feature(:unknown, :unknown)).to eq({})
    end
  end
end
