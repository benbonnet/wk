class CreateInviteItems < ActiveRecord::Migration[8.0]
  def change
    create_table :invite_items do |t|
      t.references :invite, null: false, foreign_key: true
      t.references :item, null: false, foreign_key: true

      t.timestamps
    end
    add_index :invite_items, %i[invite_id item_id], unique: true
  end
end
