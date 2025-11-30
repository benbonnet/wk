# frozen_string_literal: true

# A strict test schema for use in specs that need a valid schema
# but don't care about specific business domain schemas
class TestSchema < Core::Schema::Base
  title "Test"
  slug "test"
  description "Schema for test purposes"

  string :name, required: false, description: "Name field"
  string :value, required: false, description: "Value field"
  string :status, required: false, description: "Status field"
  string :type, required: false, description: "Type field"

  timestamps
  soft_delete
end
