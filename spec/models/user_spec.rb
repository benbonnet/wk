# frozen_string_literal: true

# == Schema Information
#
# Table name: users
#
#  id            :bigint           not null, primary key
#  access_token  :text
#  avatar_url    :string
#  email         :string
#  internal      :boolean          default(FALSE), not null
#  last_login_at :datetime
#  login         :string           not null
#  name          :string
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#  auth0_id      :string           not null
#
# Indexes
#
#  index_users_on_auth0_id  (auth0_id) UNIQUE
#  index_users_on_login     (login) UNIQUE
#
require "rails_helper"

RSpec.describe User, type: :model do
  describe "associations" do
    it { is_expected.to have_many(:workspace_users).dependent(:destroy) }
    it { is_expected.to have_many(:workspaces).through(:workspace_users) }
  end

  describe "validations" do
    subject { build(:user) }

    it { is_expected.to validate_presence_of(:login) }
    it { is_expected.to validate_uniqueness_of(:login) }
    it { is_expected.to validate_presence_of(:auth0_id) }
    it { is_expected.to validate_uniqueness_of(:auth0_id) }
  end
end
