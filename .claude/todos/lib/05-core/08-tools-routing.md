# 08 - Tools Routing Module

## File: packs/core/app/lib/core/tools/routing.rb

```ruby
# frozen_string_literal: true

module Core
  module Tools
    module Routing
      extend ActiveSupport::Concern

      class_methods do
        def route(method:, scope: :collection, action: nil)
          @route_config = {
            method: method.to_sym,
            scope: scope.to_sym,
            action: action&.to_s
          }
        end

        def route_config
          @route_config ||= { method: :get, scope: :collection, action: nil }
        end

        def matches?(http_method:, scope:, action: nil)
          route_config[:method] == http_method.to_sym &&
            route_config[:scope] == scope.to_sym &&
            route_config[:action] == action&.to_s.presence
        end

        def collection?
          route_config[:scope] == :collection
        end

        def member?
          route_config[:scope] == :member
        end
      end
    end
  end
end
```

## Spec: packs/core/spec/lib/core/tools/routing_spec.rb

```ruby
# frozen_string_literal: true

require "rails_helper"

RSpec.describe Core::Tools::Routing do
  let(:tool_class) do
    Class.new do
      include Core::Tools::Routing

      route method: :get, scope: :collection
    end
  end

  let(:member_tool) do
    Class.new do
      include Core::Tools::Routing

      route method: :put, scope: :member, action: "publish"
    end
  end

  describe ".route" do
    it "stores route configuration" do
      expect(tool_class.route_config[:method]).to eq(:get)
      expect(tool_class.route_config[:scope]).to eq(:collection)
    end

    it "stores action for custom routes" do
      expect(member_tool.route_config[:action]).to eq("publish")
    end
  end

  describe ".matches?" do
    it "returns true for matching request" do
      expect(tool_class.matches?(
        http_method: :get,
        scope: :collection,
        action: nil
      )).to be true
    end

    it "returns false for non-matching method" do
      expect(tool_class.matches?(
        http_method: :post,
        scope: :collection,
        action: nil
      )).to be false
    end

    it "returns false for non-matching scope" do
      expect(tool_class.matches?(
        http_method: :get,
        scope: :member,
        action: nil
      )).to be false
    end

    it "matches action for custom routes" do
      expect(member_tool.matches?(
        http_method: :put,
        scope: :member,
        action: "publish"
      )).to be true
    end

    it "fails when action doesn't match" do
      expect(member_tool.matches?(
        http_method: :put,
        scope: :member,
        action: "archive"
      )).to be false
    end
  end

  describe ".collection?" do
    it "returns true for collection scope" do
      expect(tool_class.collection?).to be true
    end

    it "returns false for member scope" do
      expect(member_tool.collection?).to be false
    end
  end

  describe ".member?" do
    it "returns false for collection scope" do
      expect(tool_class.member?).to be false
    end

    it "returns true for member scope" do
      expect(member_tool.member?).to be true
    end
  end
end
```
