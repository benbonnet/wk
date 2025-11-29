# frozen_string_literal: true

Rails.application.config.after_initialize do
  Core::Workflow::Registry.load_all!
end
