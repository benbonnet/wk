# frozen_string_literal: true

require "rails_helper"

RSpec.describe Core::Features::Registry do
  let(:index_tool) do
    Class.new(Core::Tools::Base) do
      route method: :get, scope: :collection
    end
  end

  let(:show_tool) do
    Class.new(Core::Tools::Base) do
      route method: :get, scope: :member
    end
  end

  let(:create_tool) do
    Class.new(Core::Tools::Base) do
      route method: :post, scope: :collection
    end
  end

  let(:publish_tool) do
    Class.new(Core::Tools::Base) do
      route method: :post, scope: :member, action: "publish"
    end
  end

  before { described_class.clear! }

  describe ".register" do
    it "registers a feature with tools" do
      described_class.register(
        namespace: :workspaces,
        feature: :contacts,
        tools: [ index_tool, show_tool, create_tool ]
      )

      expect(described_class.find(:workspaces, :contacts)).to be_present
    end
  end

  describe ".find" do
    before do
      described_class.register(
        namespace: :workspaces,
        feature: :contacts,
        schema: :contact,
        tools: [ index_tool ]
      )
    end

    it "finds registered feature" do
      feature = described_class.find(:workspaces, :contacts)
      expect(feature[:schema]).to eq(:contact)
    end

    it "returns nil for unregistered feature" do
      expect(described_class.find(:unknown, :feature)).to be_nil
    end
  end

  describe ".tools_for" do
    before do
      described_class.register(
        namespace: :workspaces,
        feature: :contacts,
        tools: [ index_tool, show_tool ]
      )
    end

    it "returns tools for feature" do
      tools = described_class.tools_for(:workspaces, :contacts)
      expect(tools).to contain_exactly(index_tool, show_tool)
    end

    it "returns empty array for unknown feature" do
      expect(described_class.tools_for(:unknown, :feature)).to eq([])
    end
  end

  describe ".find_tool" do
    before do
      described_class.register(
        namespace: :workspaces,
        feature: :contacts,
        tools: [ index_tool, show_tool, create_tool, publish_tool ]
      )
    end

    it "finds GET collection tool" do
      tool = described_class.find_tool(
        :workspaces, :contacts,
        http_method: :get, scope: :collection
      )
      expect(tool).to eq(index_tool)
    end

    it "finds GET member tool" do
      tool = described_class.find_tool(
        :workspaces, :contacts,
        http_method: :get, scope: :member
      )
      expect(tool).to eq(show_tool)
    end

    it "finds POST collection tool" do
      tool = described_class.find_tool(
        :workspaces, :contacts,
        http_method: :post, scope: :collection
      )
      expect(tool).to eq(create_tool)
    end

    it "finds custom action tool" do
      tool = described_class.find_tool(
        :workspaces, :contacts,
        http_method: :post, scope: :member, action: "publish"
      )
      expect(tool).to eq(publish_tool)
    end

    it "returns nil for non-matching route" do
      tool = described_class.find_tool(
        :workspaces, :contacts,
        http_method: :delete, scope: :collection
      )
      expect(tool).to be_nil
    end
  end

  describe ".clear!" do
    it "removes all registrations" do
      described_class.register(
        namespace: :workspaces,
        feature: :contacts,
        tools: [ index_tool ]
      )

      described_class.clear!
      expect(described_class.all).to be_empty
    end
  end

  describe ".to_mock_data" do
    before do
      described_class.register(
        namespace: :workspaces,
        feature: :contacts,
        schema: :contact,
        tools: [ index_tool ]
      )
    end

    it "exports features for frontend mocks" do
      mocks = described_class.to_mock_data
      expect(mocks.first[:namespace]).to eq(:workspaces)
      expect(mocks.first[:features].first[:slug]).to eq(:contacts)
    end
  end
end
