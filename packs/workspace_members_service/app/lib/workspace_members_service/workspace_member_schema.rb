# frozen_string_literal: true

module WorkspaceMembersService
  class WorkspaceMemberSchema < Core::Schema::Base
    title "Workspace Member"
    description "User membership in a workspace"

    string :email, description: "User email", required: true
    string :name, description: "User name", required: false
    string :login, description: "User login", required: false
    string :role, enum: %w[admin manager editor]
    string :status, enum: %w[active blocked pending]
    string :avatar_url, required: false

    timestamps

    translations(
      en: {
        email: "Email",
        name: "Name",
        login: "Username",
        role: "Role",
        status: "Status",
        avatar_url: "Avatar",
        admin: "Admin",
        manager: "Manager",
        editor: "Editor",
        active: "Active",
        blocked: "Blocked",
        pending: "Pending"
      },
      fr: {
        email: "Email",
        name: "Nom",
        login: "Identifiant",
        role: "Role",
        status: "Statut",
        avatar_url: "Avatar",
        admin: "Admin",
        manager: "Manager",
        editor: "Editeur",
        active: "Actif",
        blocked: "Bloque",
        pending: "En attente"
      }
    )
  end
end
