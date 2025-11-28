class CreateItems < ActiveRecord::Migration[8.0]
  def change
    create_table :items do |t|
      t.references :workspace, foreign_key: true
      t.references :created_by, null: false, foreign_key: { to_table: :users }
      t.references :updated_by, foreign_key: { to_table: :users }
      t.references :deleted_by, foreign_key: { to_table: :users }
      t.string :schema_slug, null: false
      t.string :tool_slug, null: false
      t.jsonb :data, null: false, default: {}
      t.datetime :deleted_at

      t.timestamps
    end
    add_index :items, :schema_slug
    add_index :items, :tool_slug
    add_index :items, %i[schema_slug tool_slug]
    add_index :items, :deleted_at
  end
end
