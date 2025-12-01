# frozen_string_literal: true

module WorkspaceMembersService
  module Views
    class Index
      include Ui::Views::BaseView

      frontend_route "/members"

      view do
        translations(
          en: {
            page_title: "Team Members",
            page_description: "Manage your workspace team",
            invite_member: "Add Member",
            edit_member: "Edit Member",
            search_placeholder: "Search by name or email...",
            actions: "Actions",
            edit: "Edit",
            remove: "Remove",
            block: "Block",
            unblock: "Unblock",
            resend_invite: "Resend Invite",
            name: "Name",
            email: "Email",
            role: "Role",
            status: "Status",
            joined: "Joined",
            admin: "Admin",
            manager: "Manager",
            editor: "Editor",
            active: "Active",
            blocked: "Blocked",
            pending: "Pending Invite",
            # Notifications
            member_added: "Member added successfully",
            member_add_failed: "Failed to add member",
            member_updated: "Member updated successfully",
            member_update_failed: "Failed to update member",
            member_removed: "Member removed successfully",
            member_remove_failed: "Failed to remove member",
            member_blocked: "Member blocked successfully",
            member_unblocked: "Member unblocked successfully",
            invite_resent: "Invitation resent successfully",
            invite_resend_failed: "Failed to resend invitation",
            # Confirm dialogs
            remove_title: "Remove team member?",
            remove_description: "This will remove the member from the workspace. They will lose access to all workspace data.",
            remove_confirm: "Remove Member",
            block_title: "Block team member?",
            block_description: "This will block the member from accessing the workspace. You can unblock them later.",
            block_confirm: "Block Member"
          },
          fr: {
            page_title: "Membres de l'equipe",
            page_description: "Gerez votre equipe",
            invite_member: "Ajouter un membre",
            edit_member: "Modifier le membre",
            search_placeholder: "Rechercher par nom ou email...",
            actions: "Actions",
            edit: "Modifier",
            remove: "Supprimer",
            block: "Bloquer",
            unblock: "Debloquer",
            resend_invite: "Renvoyer l'invitation",
            name: "Nom",
            email: "Email",
            role: "Role",
            status: "Statut",
            joined: "Inscrit le",
            admin: "Admin",
            manager: "Manager",
            editor: "Editeur",
            active: "Actif",
            blocked: "Bloque",
            pending: "Invitation en attente",
            # Notifications
            member_added: "Membre ajoute avec succes",
            member_add_failed: "Echec de l'ajout du membre",
            member_updated: "Membre mis a jour avec succes",
            member_update_failed: "Echec de la mise a jour du membre",
            member_removed: "Membre supprime avec succes",
            member_remove_failed: "Echec de la suppression du membre",
            member_blocked: "Membre bloque avec succes",
            member_unblocked: "Membre debloque avec succes",
            invite_resent: "Invitation renvoyee avec succes",
            invite_resend_failed: "Echec du renvoi de l'invitation",
            # Confirm dialogs
            remove_title: "Supprimer ce membre?",
            remove_description: "Cette action supprimera le membre de l'espace de travail. Il perdra l'acces a toutes les donnees.",
            remove_confirm: "Supprimer le membre",
            block_title: "Bloquer ce membre?",
            block_description: "Cette action bloquera l'acces du membre a l'espace de travail. Vous pourrez le debloquer plus tard.",
            block_confirm: "Bloquer le membre"
          }
        )

        drawers do |d|
          d.drawer(:add_drawer, className: "w-1/3") do |drawer|
            drawer.title "invite_member"
            drawer.body Form, action: :create, notification: {
              success: "member_added",
              error: "member_add_failed"
            }
          end

          d.drawer(:edit_drawer, className: "w-1/3") do |drawer|
            drawer.title "edit_member"
            drawer.body Form, action: :update, use_record: true, notification: {
              success: "member_updated",
              error: "member_update_failed"
            }
          end
        end

        page(classname: "bg-slate-50") do |c|
          c.title "page_title"
          c.description "page_description"

          c.actions do
            link "invite_member", opens: :add_drawer, variant: "primary", icon: "plus"
          end

          c.body do
            group(classname: "flex flex-col space-y-6 p-6") do
              table(
                classname: "bg-white rounded-lg border",
                searchable: true,
                search_placeholder: "search_placeholder",
                page_size: 20
              ) do |t|
                t.column :name, type: "DISPLAY_TEXT", label: "name", sortable: true
                t.column :email, type: "DISPLAY_TEXT", label: "email", sortable: true
                t.column :role, type: "DISPLAY_BADGE", label: "role", options: [
                  { label: "admin", value: "admin", variant: "purple" },
                  { label: "manager", value: "manager", variant: "blue" },
                  { label: "editor", value: "editor", variant: "gray" }
                ]
                t.column :status, type: "DISPLAY_BADGE", label: "status", options: [
                  { label: "active", value: "active", variant: "green" },
                  { label: "blocked", value: "blocked", variant: "red" },
                  { label: "pending", value: "pending", variant: "yellow" }
                ]
                t.column :created_at, type: "DISPLAY_DATE", label: "joined"

                t.row_actions icon: "ellipsis" do
                  link :edit, opens: :edit_drawer, icon: "pencil"
                  link :resend_invite,
                    api: :resend_invite,
                    icon: "mail",
                    condition: { field: "status", equals: "pending" },
                    notification: { success: "invite_resent", error: "invite_resend_failed" }
                  link :block,
                    api: :block,
                    icon: "ban",
                    confirm: {
                      title: "block_title",
                      description: "block_description",
                      confirm_label: "block_confirm",
                      variant: "destructive"
                    },
                    condition: { field: "status", equals: "active" },
                    params: { data: { blocked: true } },
                    notification: { success: "member_blocked", error: "member_update_failed" }
                  link :unblock,
                    api: :block,
                    icon: "check-circle",
                    condition: { field: "status", equals: "blocked" },
                    params: { data: { blocked: false } },
                    notification: { success: "member_unblocked", error: "member_update_failed" }
                  link :remove,
                    api: :destroy,
                    icon: "trash",
                    confirm: {
                      title: "remove_title",
                      description: "remove_description",
                      confirm_label: "remove_confirm",
                      variant: "destructive"
                    },
                    variant: "destructive",
                    notification: { success: "member_removed", error: "member_remove_failed" }
                end
              end
            end
          end
        end
      end
    end
  end
end
