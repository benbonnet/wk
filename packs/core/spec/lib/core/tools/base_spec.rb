# frozen_string_literal: true

require "rails_helper"

RSpec.describe Core::Tools::Base do
  let(:schema_class) do
    Class.new(Core::Schema::Base) do
      def self.name
        "ContactSchema"
      end
      title "Contact"
      string :name
    end
  end

  let(:tool_class) do
    Class.new(Core::Tools::Base) do
      route method: :get, scope: :collection
      schema "contact"

      def execute(user_id:, workspace_id:, page: 1, **_)
        { page:, items: [], user_id:, workspace_id: }
      end
    end
  end

  let(:user) { create(:user) }
  let(:workspace) { create(:workspace) }

  before do
    Core::Schema::Registry.clear!
    Core::Schema::Registry.register(schema_class)
  end

  describe ".schema" do
    it "stores schema slug" do
      expect(tool_class.schema_slug).to eq("contact")
    end
  end

  describe ".schema_class" do
    it "returns the schema class from registry" do
      expect(tool_class.schema_class).to eq(schema_class)
    end
  end

  describe ".execute" do
    it "instantiates and executes tool with explicit params" do
      result = tool_class.execute(user_id: user.id, workspace_id: workspace.id, page: 2)
      expect(result[:page]).to eq(2)
      expect(result[:user_id]).to eq(user.id)
      expect(result[:workspace_id]).to eq(workspace.id)
    end
  end

  describe "#execute" do
    it "must be implemented by subclass" do
      base_tool = Class.new(Core::Tools::Base)

      expect { base_tool.execute(user_id: user.id, workspace_id: workspace.id) }
        .to raise_error(NotImplementedError)
    end
  end

  describe "#find_item!" do
    let(:item) { create(:item, schema_slug: "contact", created_by: user, workspace:) }

    it "returns item when found" do
      tool = tool_class.new
      tool.instance_variable_set(:@workspace_id, workspace.id)
      expect(tool.send(:find_item!, item.id)).to eq(item)
    end

    it "raises NotFoundError when not found" do
      tool = tool_class.new
      tool.instance_variable_set(:@workspace_id, workspace.id)
      expect { tool.send(:find_item!, 99999) }
        .to raise_error(Core::Tools::NotFoundError)
    end
  end
end
