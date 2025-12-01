# frozen_string_literal: true

# Explicit feature registration
# Add new features here when creating new packs

Rails.application.config.to_prepare do
  Core::Features.reset!

  Core::Features.configure do
    # Contacts
    feature :contacts, namespace: :workspaces, schema: ContactsService::ContactSchema do
      tools ContactsService::Tools::Index,
            ContactsService::Tools::Show,
            ContactsService::Tools::Create,
            ContactsService::Tools::Update,
            ContactsService::Tools::Destroy,
            ContactsService::Tools::AddRelationship

      views ContactsService::Views::Index,
            ContactsService::Views::Show,
            ContactsService::Views::Form
    end

    # RIB Checks
    feature :rib_checks, namespace: :workspaces, schema: RibCheckService::RibRequestSchema do
      tools RibCheckService::Tools::Index,
            RibCheckService::Tools::Show,
            RibCheckService::Tools::Create,
            RibCheckService::Tools::Update,
            RibCheckService::Tools::Destroy,
            RibCheckService::Tools::Cancel

      views RibCheckService::Views::Index,
            RibCheckService::Views::Show,
            RibCheckService::Views::Form
    end

    # Activities (internal, no views)
    feature :activities, namespace: :workspaces, schema: ActivitiesService::ActivitySchema do
      tools ActivitiesService::Tools::Index,
            ActivitiesService::Tools::Create
    end

    # Invites (internal, no views)
    feature :invites, namespace: :workspaces, schema: InvitesService::InviteSchema do
      tools InvitesService::Tools::Create,
            InvitesService::Tools::Cancel
    end

    # Items (internal, no views)
    feature :items, namespace: :workspaces, schema: ItemsService::ItemSchema do
      tools ItemsService::Tools::Create,
            ItemsService::Tools::Update
    end
  end

  # Reload relationships after all schemas registered
  Core::Relationships::Registry.reload!
end
