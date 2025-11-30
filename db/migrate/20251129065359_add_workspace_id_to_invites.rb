class AddWorkspaceIdToInvites < ActiveRecord::Migration[8.0]
  def change
    add_reference :invites, :workspace, null: false, foreign_key: true
  end
end
