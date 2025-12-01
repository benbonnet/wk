# frozen_string_literal: true

class UpdateInvitesForEmailBasedInvitations < ActiveRecord::Migration[8.0]
  def change
    # Add new columns
    add_column :invites, :invitee_email, :string
    add_column :invites, :invitee_phone, :string
    add_column :invites, :source_type, :string
    add_column :invites, :source_id, :bigint

    # Make invitee_id nullable (will be set on auth)
    change_column_null :invites, :invitee_id, true

    # Add indexes
    add_index :invites, :invitee_email
    add_index :invites, [:source_type, :source_id]
  end
end
