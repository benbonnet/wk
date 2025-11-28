class CreateFeatureTools < ActiveRecord::Migration[8.0]
  def change
    create_table :feature_tools do |t|
      t.references :feature, null: false, foreign_key: true
      t.string :title, null: false
      t.string :slug, null: false
      t.string :tool_type
      t.text :description
      t.jsonb :config
      t.datetime :deleted_at

      t.timestamps
    end
    add_index :feature_tools, %i[slug feature_id], unique: true
    add_index :feature_tools, :deleted_at
  end
end
