class CreateSchemas < ActiveRecord::Migration[8.0]
  def change
    create_table :schemas do |t|
      t.references :workspace, foreign_key: true
      t.string :identifier, null: false
      t.jsonb :data, null: false
      t.datetime :deleted_at

      t.timestamps
    end
    add_index :schemas, :identifier, unique: true
    add_index :schemas, :deleted_at
  end
end
