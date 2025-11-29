# frozen_string_literal: true

Typelizer.configure do |config|
  config.output_dir = Rails.root.join("app/frontend/types/api")
  config.types_import_path = "@/types/api"
end

# Scan main app resources + pack lib directories (for *_serializer.rb)
pack_lib_dirs = Dir[Rails.root.join("packs/*/app/lib")]

Typelizer.dirs = [
  Rails.root.join("app", "resources"),
  *pack_lib_dirs
]
