class CreateItemRecipients < ActiveRecord::Migration[8.0]
  def change
    create_table :item_recipients do |t|
      t.references :item, null: false, foreign_key: true
      t.references :user, null: false, foreign_key: true
      t.string :auth_status, null: false, default: "level1"

      t.timestamps
    end
    add_index :item_recipients, %i[item_id user_id], unique: true
  end
end
