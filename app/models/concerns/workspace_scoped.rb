# frozen_string_literal: true

module WorkspaceScoped
  extend ActiveSupport::Concern

  included do
    belongs_to :workspace
    validates :workspace_id, presence: true

    scope :for_workspace, ->(id) { where(workspace_id: id) }
  end
end
