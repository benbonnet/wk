class CreateFeatureToolUsages < ActiveRecord::Migration[8.0]
  def change
    create_table :feature_tool_usages do |t|
      t.references :feature_tool, null: false, foreign_key: true
      t.references :workspace, null: false, foreign_key: true
      t.references :user, null: false, foreign_key: true
      t.string :status, null: false, default: "success"
      t.integer :duration_ms
      t.integer :http_status_code
      t.jsonb :metadata

      t.timestamps
    end
    add_index :feature_tool_usages, %i[workspace_id feature_tool_id created_at], name: "feature_tool_usages_billing"
    add_index :feature_tool_usages, :created_at, name: "feature_tool_usages_time"
    add_index :feature_tool_usages, %i[feature_tool_id created_at], name: "feature_tool_usages_tool_time"
    add_index :feature_tool_usages, %i[user_id created_at], name: "feature_tool_usages_user_time"
    add_index :feature_tool_usages, %i[workspace_id created_at], name: "feature_tool_usages_workspace_time"
  end
end
