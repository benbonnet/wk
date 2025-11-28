class CreateActivities < ActiveRecord::Migration[8.0]
  def change
    create_table :activities do |t|
      t.references :workspace, null: false, foreign_key: true
      t.references :user, null: false, foreign_key: true
      t.references :item, foreign_key: true
      t.string :activity_type, null: false
      t.string :category, null: false
      t.string :level, null: false
      t.text :message, null: false
      t.string :error_code
      t.text :error_stack
      t.jsonb :metadata
      t.integer :duration_ms
      t.string :schema_slug
      t.string :tool_slug
      t.string :feature_slug

      t.timestamps
    end
    add_index :activities, :activity_type
    add_index :activities, :created_at
    add_index :activities, :schema_slug
    add_index :activities, :tool_slug
    add_index :activities, :feature_slug
  end
end
