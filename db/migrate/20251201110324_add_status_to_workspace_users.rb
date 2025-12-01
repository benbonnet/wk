# frozen_string_literal: true

class AddStatusToWorkspaceUsers < ActiveRecord::Migration[8.0]
  def change
    add_column :workspace_users, :status, :string, default: "active", null: false
    add_column :workspace_users, :invited_at, :datetime
    add_column :workspace_users, :invite_id, :bigint

    add_index :workspace_users, :status
    add_index :workspace_users, :invite_id
    add_foreign_key :workspace_users, :invites, column: :invite_id, on_delete: :nullify
  end
end
