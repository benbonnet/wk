# frozen_string_literal: true

require "rails_helper"

RSpec.describe WorkspaceMembersService::WorkspaceMemberSerializer do
  let(:user) { create(:user, email: "test@example.com", name: "Test User", login: "testuser") }
  let(:workspace) { create(:workspace) }
  let(:workspace_user) { create(:workspace_user, workspace:, user:, role: "editor") }

  subject(:result) { described_class.new(workspace_user).to_h }

  it "includes id" do
    expect(result["id"]).to eq(workspace_user.id)
  end

  it "includes role" do
    expect(result["role"]).to eq("editor")
  end

  it "includes status" do
    expect(result["status"]).to eq("active")
  end

  it "includes user email" do
    expect(result["email"]).to eq("test@example.com")
  end

  it "includes user name" do
    expect(result["name"]).to eq("Test User")
  end

  it "includes user login" do
    expect(result["login"]).to eq("testuser")
  end

  it "includes timestamps" do
    expect(result["created_at"]).to be_present
    expect(result["updated_at"]).to be_present
  end
end
