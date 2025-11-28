class CreateFeatures < ActiveRecord::Migration[8.0]
  def change
    create_table :features do |t|
      t.string :title, null: false
      t.jsonb :config
      t.string :feature_type
      t.string :identifier
      t.datetime :deleted_at

      t.timestamps
    end
    add_index :features, :identifier, unique: true
    add_index :features, :deleted_at
  end
end
