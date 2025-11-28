class CreateWorkspaceUsers < ActiveRecord::Migration[8.0]
  def change
    create_table :workspace_users do |t|
      t.references :workspace, null: false, foreign_key: true
      t.references :user, null: false, foreign_key: true
      t.string :role, null: false, default: "editor"
      t.string :api_key
      t.string :api_secret

      t.timestamps
    end
    add_index :workspace_users, %i[workspace_id user_id], unique: true
    add_index :workspace_users, :api_key, unique: true
    add_index :workspace_users, :api_secret, unique: true
  end
end
