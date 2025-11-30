# frozen_string_literal: true

# Auto-discover and register features from packs
# Convention:
#   packs/<pack_name>/app/lib/<pack_module>/
#     *_schema.rb  -> schema (one per pack typically)
#     tools/*.rb   -> tools
#     views/*.rb   -> views
#
# Pack module name derives namespace:
#   ContactsService -> :contacts (strips _service suffix)
#   SystemUsers -> :users

Rails.application.config.after_initialize do
  Core::Features::AutoDiscovery.run!
end
