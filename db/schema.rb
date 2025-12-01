# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.0].define(version: 2025_12_01_131840) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_catalog.plpgsql"

  create_table "activities", force: :cascade do |t|
    t.bigint "workspace_id", null: false
    t.bigint "user_id", null: false
    t.bigint "item_id"
    t.string "activity_type", null: false
    t.string "category", null: false
    t.string "level", null: false
    t.text "message", null: false
    t.string "error_code"
    t.text "error_stack"
    t.jsonb "metadata"
    t.integer "duration_ms"
    t.string "schema_slug"
    t.string "tool_slug"
    t.string "feature_slug"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["activity_type"], name: "index_activities_on_activity_type"
    t.index ["created_at"], name: "index_activities_on_created_at"
    t.index ["feature_slug"], name: "index_activities_on_feature_slug"
    t.index ["item_id"], name: "index_activities_on_item_id"
    t.index ["schema_slug"], name: "index_activities_on_schema_slug"
    t.index ["tool_slug"], name: "index_activities_on_tool_slug"
    t.index ["user_id"], name: "index_activities_on_user_id"
    t.index ["workspace_id"], name: "index_activities_on_workspace_id"
  end

  create_table "documents", force: :cascade do |t|
    t.string "title", null: false
    t.text "description"
    t.text "file_data"
    t.bigint "user_id", null: false
    t.bigint "workspace_id", null: false
    t.bigint "item_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["created_at"], name: "index_documents_on_created_at"
    t.index ["item_id"], name: "index_documents_on_item_id"
    t.index ["user_id"], name: "index_documents_on_user_id"
    t.index ["workspace_id"], name: "index_documents_on_workspace_id"
  end

  create_table "feature_tool_usages", force: :cascade do |t|
    t.bigint "feature_tool_id", null: false
    t.bigint "workspace_id", null: false
    t.bigint "user_id", null: false
    t.string "status", default: "success", null: false
    t.integer "duration_ms"
    t.integer "http_status_code"
    t.jsonb "metadata"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["created_at"], name: "feature_tool_usages_time"
    t.index ["feature_tool_id", "created_at"], name: "feature_tool_usages_tool_time"
    t.index ["feature_tool_id"], name: "index_feature_tool_usages_on_feature_tool_id"
    t.index ["user_id", "created_at"], name: "feature_tool_usages_user_time"
    t.index ["user_id"], name: "index_feature_tool_usages_on_user_id"
    t.index ["workspace_id", "created_at"], name: "feature_tool_usages_workspace_time"
    t.index ["workspace_id", "feature_tool_id", "created_at"], name: "feature_tool_usages_billing"
    t.index ["workspace_id"], name: "index_feature_tool_usages_on_workspace_id"
  end

  create_table "feature_tools", force: :cascade do |t|
    t.bigint "feature_id", null: false
    t.string "title", null: false
    t.string "slug", null: false
    t.string "tool_type"
    t.text "description"
    t.jsonb "config"
    t.datetime "deleted_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "schema_id"
    t.index ["deleted_at"], name: "index_feature_tools_on_deleted_at"
    t.index ["feature_id"], name: "index_feature_tools_on_feature_id"
    t.index ["schema_id"], name: "index_feature_tools_on_schema_id"
    t.index ["slug", "feature_id"], name: "index_feature_tools_on_slug_and_feature_id", unique: true
  end

  create_table "feature_views", force: :cascade do |t|
    t.bigint "feature_id", null: false
    t.string "title", null: false
    t.string "slug", null: false
    t.string "view_type"
    t.text "description"
    t.jsonb "config"
    t.datetime "deleted_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["deleted_at"], name: "index_feature_views_on_deleted_at"
    t.index ["feature_id"], name: "index_feature_views_on_feature_id"
    t.index ["slug", "feature_id"], name: "index_feature_views_on_slug_and_feature_id", unique: true
  end

  create_table "feature_workspace_users", force: :cascade do |t|
    t.bigint "workspace_id", null: false
    t.bigint "user_id", null: false
    t.bigint "feature_id", null: false
    t.boolean "enabled", default: false, null: false
    t.jsonb "config"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["feature_id"], name: "index_feature_workspace_users_on_feature_id"
    t.index ["user_id"], name: "index_feature_workspace_users_on_user_id"
    t.index ["workspace_id", "user_id", "feature_id"], name: "idx_feature_workspace_users_unique", unique: true
    t.index ["workspace_id"], name: "index_feature_workspace_users_on_workspace_id"
  end

  create_table "features", force: :cascade do |t|
    t.string "title", null: false
    t.jsonb "config"
    t.string "feature_type"
    t.string "identifier"
    t.datetime "deleted_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["deleted_at"], name: "index_features_on_deleted_at"
    t.index ["identifier"], name: "index_features_on_identifier", unique: true
  end

  create_table "invite_items", force: :cascade do |t|
    t.bigint "invite_id", null: false
    t.bigint "item_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["invite_id", "item_id"], name: "index_invite_items_on_invite_id_and_item_id", unique: true
    t.index ["invite_id"], name: "index_invite_items_on_invite_id"
    t.index ["item_id"], name: "index_invite_items_on_item_id"
  end

  create_table "invites", force: :cascade do |t|
    t.bigint "inviter_id", null: false
    t.bigint "invitee_id"
    t.bigint "recipient_workspace_id"
    t.string "status", default: "pending", null: false
    t.string "auth_link_hash", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "workspace_id", null: false
    t.string "invitee_email"
    t.string "invitee_phone"
    t.string "source_type"
    t.bigint "source_id"
    t.index ["auth_link_hash"], name: "index_invites_on_auth_link_hash", unique: true
    t.index ["invitee_email"], name: "index_invites_on_invitee_email"
    t.index ["invitee_id"], name: "index_invites_on_invitee_id"
    t.index ["inviter_id"], name: "index_invites_on_inviter_id"
    t.index ["recipient_workspace_id"], name: "index_invites_on_recipient_workspace_id"
    t.index ["source_type", "source_id"], name: "index_invites_on_source_type_and_source_id"
    t.index ["status"], name: "index_invites_on_status"
    t.index ["workspace_id"], name: "index_invites_on_workspace_id"
  end

  create_table "item_recipients", force: :cascade do |t|
    t.bigint "item_id", null: false
    t.bigint "user_id", null: false
    t.string "auth_status", default: "level1", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["item_id", "user_id"], name: "index_item_recipients_on_item_id_and_user_id", unique: true
    t.index ["item_id"], name: "index_item_recipients_on_item_id"
    t.index ["user_id"], name: "index_item_recipients_on_user_id"
  end

  create_table "item_relationships", force: :cascade do |t|
    t.bigint "source_item_id", null: false
    t.bigint "target_item_id", null: false
    t.string "relationship_type", null: false
    t.boolean "is_primary", default: false
    t.date "start_date"
    t.date "end_date"
    t.jsonb "metadata"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["relationship_type"], name: "index_item_relationships_on_relationship_type"
    t.index ["source_item_id", "relationship_type"], name: "idx_on_source_item_id_relationship_type_505fcadb13"
    t.index ["source_item_id", "target_item_id"], name: "index_item_relationships_on_source_item_id_and_target_item_id"
    t.index ["source_item_id"], name: "index_item_relationships_on_source_item_id"
    t.index ["target_item_id", "relationship_type"], name: "idx_on_target_item_id_relationship_type_07d3008893"
    t.index ["target_item_id"], name: "index_item_relationships_on_target_item_id"
  end

  create_table "items", force: :cascade do |t|
    t.bigint "workspace_id"
    t.bigint "created_by_id", null: false
    t.bigint "updated_by_id"
    t.bigint "deleted_by_id"
    t.string "schema_slug", null: false
    t.string "tool_slug", null: false
    t.jsonb "data", default: {}, null: false
    t.datetime "deleted_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["created_by_id"], name: "index_items_on_created_by_id"
    t.index ["deleted_at"], name: "index_items_on_deleted_at"
    t.index ["deleted_by_id"], name: "index_items_on_deleted_by_id"
    t.index ["schema_slug", "tool_slug"], name: "index_items_on_schema_slug_and_tool_slug"
    t.index ["schema_slug"], name: "index_items_on_schema_slug"
    t.index ["tool_slug"], name: "index_items_on_tool_slug"
    t.index ["updated_by_id"], name: "index_items_on_updated_by_id"
    t.index ["workspace_id"], name: "index_items_on_workspace_id"
  end

  create_table "schemas", force: :cascade do |t|
    t.bigint "workspace_id"
    t.string "identifier", null: false
    t.jsonb "data", null: false
    t.datetime "deleted_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["deleted_at"], name: "index_schemas_on_deleted_at"
    t.index ["identifier"], name: "index_schemas_on_identifier", unique: true
    t.index ["workspace_id"], name: "index_schemas_on_workspace_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "login", null: false
    t.string "name"
    t.string "email"
    t.string "avatar_url"
    t.string "auth0_id", null: false
    t.text "access_token"
    t.datetime "last_login_at"
    t.boolean "internal", default: false, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["auth0_id"], name: "index_users_on_auth0_id", unique: true
    t.index ["login"], name: "index_users_on_login", unique: true
  end

  create_table "workflow_entries", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "execution_id", null: false
    t.string "step_id", null: false
    t.string "step_type", null: false
    t.string "action", null: false
    t.integer "duration_ms"
    t.jsonb "input"
    t.jsonb "output"
    t.text "error"
    t.datetime "timestamp", null: false
    t.index ["execution_id"], name: "index_workflow_entries_on_execution_id"
    t.index ["step_id"], name: "index_workflow_entries_on_step_id"
    t.index ["timestamp"], name: "index_workflow_entries_on_timestamp"
  end

  create_table "workflow_executions", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "workflow_id", null: false
    t.string "status", default: "running", null: false
    t.jsonb "input", default: {}
    t.jsonb "ctx", default: {}
    t.string "current_step"
    t.jsonb "result"
    t.string "recover_to"
    t.jsonb "halt_data"
    t.text "error"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["created_at"], name: "index_workflow_executions_on_created_at"
    t.index ["status"], name: "index_workflow_executions_on_status"
    t.index ["workflow_id"], name: "index_workflow_executions_on_workflow_id"
  end

  create_table "workspace_users", force: :cascade do |t|
    t.bigint "workspace_id", null: false
    t.bigint "user_id", null: false
    t.string "role", default: "editor", null: false
    t.string "api_key"
    t.string "api_secret"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "status", default: "active", null: false
    t.datetime "invited_at"
    t.bigint "invite_id"
    t.index ["api_key"], name: "index_workspace_users_on_api_key", unique: true
    t.index ["api_secret"], name: "index_workspace_users_on_api_secret", unique: true
    t.index ["invite_id"], name: "index_workspace_users_on_invite_id"
    t.index ["status"], name: "index_workspace_users_on_status"
    t.index ["user_id"], name: "index_workspace_users_on_user_id"
    t.index ["workspace_id", "user_id"], name: "index_workspace_users_on_workspace_id_and_user_id", unique: true
    t.index ["workspace_id"], name: "index_workspace_users_on_workspace_id"
  end

  create_table "workspaces", force: :cascade do |t|
    t.string "name", null: false
    t.string "slug", null: false
    t.boolean "active", default: true, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["slug"], name: "index_workspaces_on_slug", unique: true
  end

  add_foreign_key "activities", "items"
  add_foreign_key "activities", "users"
  add_foreign_key "activities", "workspaces"
  add_foreign_key "documents", "items"
  add_foreign_key "documents", "users"
  add_foreign_key "documents", "workspaces"
  add_foreign_key "feature_tool_usages", "feature_tools"
  add_foreign_key "feature_tool_usages", "users"
  add_foreign_key "feature_tool_usages", "workspaces"
  add_foreign_key "feature_tools", "features"
  add_foreign_key "feature_tools", "schemas"
  add_foreign_key "feature_views", "features"
  add_foreign_key "feature_workspace_users", "features"
  add_foreign_key "feature_workspace_users", "users"
  add_foreign_key "feature_workspace_users", "workspaces"
  add_foreign_key "invite_items", "invites"
  add_foreign_key "invite_items", "items"
  add_foreign_key "invites", "users", column: "invitee_id"
  add_foreign_key "invites", "users", column: "inviter_id"
  add_foreign_key "invites", "workspaces"
  add_foreign_key "invites", "workspaces", column: "recipient_workspace_id"
  add_foreign_key "item_recipients", "items"
  add_foreign_key "item_recipients", "users"
  add_foreign_key "item_relationships", "items", column: "source_item_id"
  add_foreign_key "item_relationships", "items", column: "target_item_id"
  add_foreign_key "items", "users", column: "created_by_id"
  add_foreign_key "items", "users", column: "deleted_by_id"
  add_foreign_key "items", "users", column: "updated_by_id"
  add_foreign_key "items", "workspaces"
  add_foreign_key "schemas", "workspaces"
  add_foreign_key "workflow_entries", "workflow_executions", column: "execution_id"
  add_foreign_key "workspace_users", "invites", on_delete: :nullify
  add_foreign_key "workspace_users", "users"
  add_foreign_key "workspace_users", "workspaces"
end
