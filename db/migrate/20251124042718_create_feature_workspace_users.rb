class CreateFeatureWorkspaceUsers < ActiveRecord::Migration[8.0]
  def change
    create_table :feature_workspace_users do |t|
      t.references :workspace, null: false, foreign_key: true
      t.references :user, null: false, foreign_key: true
      t.references :feature, null: false, foreign_key: true
      t.boolean :enabled, null: false, default: false
      t.jsonb :config

      t.timestamps
    end
    add_index :feature_workspace_users, %i[workspace_id user_id feature_id], unique: true, name: "idx_feature_workspace_users_unique"
  end
end
