# frozen_string_literal: true

require "rails_helper"

RSpec.describe "RIB Checks", type: :system do
  let(:user) { create(:user) }
  let(:workspace) { user.default_workspace }

  before do
    login_as(user, scope: :user)
    page.set_rack_session(workspace_id: workspace.id)
  end

  describe "Index page" do
    before do
      visit "/app/rib-checks"
    end

    describe "page structure" do
      it "displays page title" do
        expect(page).to have_content("Demandes RIB")
      end

      it "displays page description" do
        expect(page).to have_content("Gerer les demandes de collecte RIB")
      end

      it "displays 'New Request' button" do
        expect(page).to have_button("Nouvelle Demande")
      end
    end

    describe "table" do
      it "displays table with columns (status, request_type, message_body, deadline, created_at)" do
        expect(page).to have_css("table")
        expect(page).to have_css("th", text: "Statut")
        expect(page).to have_css("th", text: "Type")
        expect(page).to have_css("th", text: "Message")
        expect(page).to have_css("th", text: "Echeance")
        expect(page).to have_css("th", text: "Cree le")
      end

      it "displays empty state when no records" do
        expect(page).to have_content("No results.")
      end

      context "with existing records" do
        let!(:rib_request) do
          create(:item,
            workspace: workspace,
            schema_slug: "rib_request",
            tool_slug: "create",
            data: {
              "status" => "pending",
              "request_type" => "individual",
              "message_body" => "Please send your RIB",
              "end_at" => "2025-12-31T23:59:59Z"
            },
            created_by: user
          )
        end

        before { visit "/app/rib-checks" }

        it "displays records when they exist" do
          expect(page).to have_css("table tbody tr", minimum: 1)
        end

        it "displays status value" do
          within("table tbody tr:first-child") do
            expect(page).to have_content("En attente")
          end
        end

        it "displays request_type value" do
          within("table tbody tr:first-child") do
            expect(page).to have_content("Individuel")
          end
        end

        it "displays message_body" do
          within("table tbody tr:first-child") do
            expect(page).to have_content("Please send your RIB")
          end
        end
      end
    end

    describe "table search" do
      it "displays search input"
      it "filters records when typing"
    end

    describe "table pagination" do
      it "displays pagination controls"
      it "navigates between pages"
    end

    describe "row actions" do
      it "displays actions menu on row hover"
      it "opens edit drawer when clicking edit"
      it "opens view drawer when clicking row"
      it "shows cancel confirmation dialog"
      it "shows delete confirmation dialog"
    end
  end

  describe "Create (new drawer)" do
    describe "opening drawer" do
      it "opens drawer when clicking 'New Request'"
      it "displays drawer title 'New Request'"
    end

    describe "form structure" do
      it "displays 'Request Details' group"
      it "displays status select field"
      it "displays request_type select field"
      it "displays end_at datetime field"
      it "displays message_body textarea"
      it "displays comment textarea"
      it "displays 'Notification Settings' group"
      it "displays notify_via_email checkbox"
      it "displays notify_via_sms checkbox"
      it "displays recipients relationship picker"
      it "displays save button"
    end

    describe "form submission" do
      it "creates RIB request with valid data"
      it "shows success notification"
      it "closes drawer after success"
      it "displays new record in table"
    end

    describe "form validation" do
      it "shows validation errors for missing required fields"
      it "displays error on status field when invalid"
      it "displays error on request_type field when invalid"
    end
  end

  describe "Edit (edit drawer)" do
    describe "opening drawer" do
      it "opens drawer with existing record data"
      it "displays drawer title 'Edit Request'"
    end

    describe "form population" do
      it "populates status field with current value"
      it "populates request_type field with current value"
      it "populates message_body with current value"
      it "populates recipients with existing relationships"
    end

    describe "form submission" do
      it "updates RIB request with changed data"
      it "shows success notification"
      it "closes drawer after success"
      it "displays updated record in table"
    end
  end

  describe "View (view drawer)" do
    describe "opening drawer" do
      it "opens drawer when clicking row"
      it "displays drawer title 'View Request'"
    end

    describe "content display" do
      it "displays status value"
      it "displays request_type value"
      it "displays message_body value"
      it "displays deadline value"
      it "displays recipients list"
    end
  end

  describe "Cancel action" do
    describe "confirmation dialog" do
      it "shows confirmation dialog when clicking cancel"
      it "displays dialog title"
      it "displays dialog description"
      it "displays cancel button with correct label"
      it "displays confirm button with correct label"
      it "shows destructive variant styling"
    end

    describe "behavior" do
      it "cancels request when confirmed"
      it "updates status to 'cancelled'"
      it "shows success notification"
      it "does not cancel when dialog dismissed"
      it "closes dialog after cancel button clicked"
    end
  end

  describe "Delete action" do
    describe "confirmation dialog" do
      it "shows confirmation dialog when clicking delete"
      it "displays dialog title"
      it "displays dialog description"
      it "displays cancel button with correct label"
      it "displays confirm button with correct label"
      it "shows destructive variant styling"
    end

    describe "behavior" do
      it "soft deletes request when confirmed"
      it "removes record from table"
      it "shows success notification"
      it "does not delete when dialog dismissed"
      it "closes dialog after cancel button clicked"
    end
  end

  describe "Recipients relationship picker" do
    describe "empty state" do
      it "displays 'No recipients selected' message"
      it "displays 'Add Recipient' button"
    end

    describe "adding recipients" do
      it "opens picker drawer when clicking add"
      it "displays contact search/list"
      it "allows selecting multiple contacts"
      it "displays selected contacts in field"
    end

    describe "removing recipients" do
      it "displays remove button for each recipient"
      it "removes recipient when clicking remove"
    end

    describe "creating new contact" do
      it "allows creating new contact from picker"
      it "adds newly created contact to selection"
    end
  end
end
