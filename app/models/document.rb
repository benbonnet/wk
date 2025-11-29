# frozen_string_literal: true

class Document < ApplicationRecord
  include WorkspaceScoped

  belongs_to :user
  belongs_to :item, optional: true

  validates :title, presence: true
end
