class CreateInvites < ActiveRecord::Migration[8.0]
  def change
    create_table :invites do |t|
      t.references :inviter, null: false, foreign_key: { to_table: :users }
      t.references :invitee, null: false, foreign_key: { to_table: :users }
      t.references :recipient_workspace, foreign_key: { to_table: :workspaces }
      t.string :status, null: false, default: "pending"
      t.string :auth_link_hash, null: false

      t.timestamps
    end
    add_index :invites, :auth_link_hash, unique: true
    add_index :invites, :status
  end
end
