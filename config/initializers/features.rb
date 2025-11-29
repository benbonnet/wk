# frozen_string_literal: true

Rails.application.config.after_initialize do
  # Register contacts feature
  Core::Features::Registry.register(
    namespace: :workspaces,
    feature: :contacts,
    schema: :contact,
    tools: [
      ContactsService::Tools::Index,
      ContactsService::Tools::Show,
      ContactsService::Tools::Create,
      ContactsService::Tools::Update,
      ContactsService::Tools::Destroy,
      ContactsService::Tools::AddRelationship
    ],
    views: [
      ContactsService::Views::Index,
      ContactsService::Views::Show,
      ContactsService::Views::Form
    ]
  )

  # Register activities feature
  Core::Features::Registry.register(
    namespace: :workspaces,
    feature: :activities,
    tools: [
      ActivitiesService::Tools::Index
    ]
  )

  # Register rib_requests feature
  Core::Features::Registry.register(
    namespace: :workspaces,
    feature: :rib_requests,
    schema: :rib_request,
    tools: [
      RibCheckWorkflow::Tools::Index,
      RibCheckWorkflow::Tools::Show,
      RibCheckWorkflow::Tools::Create,
      RibCheckWorkflow::Tools::Update,
      RibCheckWorkflow::Tools::Destroy,
      RibCheckWorkflow::Tools::Cancel
    ]
  )
end
