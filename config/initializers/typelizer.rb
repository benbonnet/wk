# frozen_string_literal: true

Typelizer.configure do |config|
  config.output_dir = Rails.root.join("app/frontend/types/api")
  config.types_import_path = "@/types/api"
end

Typelizer.dirs = [
  Rails.root.join("app", "resources")
]
