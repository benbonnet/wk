# frozen_string_literal: true

class Document < ApplicationRecord
  belongs_to :user
  belongs_to :workspace
  belongs_to :item, optional: true

  validates :title, presence: true
end
