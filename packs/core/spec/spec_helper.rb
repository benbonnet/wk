# frozen_string_literal: true

require "rails_helper"

RSpec.configure do |config|
  config.before(:each) do
    Core::Schema::Registry.clear!
    Core::Relationships::Registry.reload!
    Core::Features::Registry.clear!
  end
end
