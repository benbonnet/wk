class CreateItemRelationships < ActiveRecord::Migration[8.0]
  def change
    create_table :item_relationships do |t|
      t.references :source_item, null: false, foreign_key: { to_table: :items }
      t.references :target_item, null: false, foreign_key: { to_table: :items }
      t.string :relationship_type, null: false
      t.boolean :is_primary, default: false
      t.date :start_date
      t.date :end_date
      t.jsonb :metadata

      t.timestamps
    end
    add_index :item_relationships, %i[source_item_id target_item_id]
    add_index :item_relationships, :relationship_type
    add_index :item_relationships, %i[source_item_id relationship_type]
    add_index :item_relationships, %i[target_item_id relationship_type]
  end
end
