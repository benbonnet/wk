# frozen_string_literal: true

require "rails_helper"

RSpec.describe Core::Tools::RailsParameters do
  describe ".permit_structure" do
    context "with ContactSchema (has addresses relationship)" do
      let(:tool_class) do
        Class.new(Core::Tools::Base) do
          route method: :put, scope: :member
          schema "contact"

          params do
            integer :id, required: true
            object :data, of: ContactsService::ContactSchema
          end
        end
      end

      it "includes basic data fields at top level (flat structure for schema tools)" do
        structure = described_class.permit_structure(tool_class)

        # Structure is now flat for schema-based tools
        expect(structure).to include(:id)
        expect(structure).to include(:first_name)
        expect(structure).to include(:last_name)
        expect(structure).to include(:company)
      end

      it "includes addresses_attributes for has_many relationship" do
        structure = described_class.permit_structure(tool_class)

        # Relationship attributes are at top level as hash entries
        addresses_entry = structure.find { |item| item.is_a?(Hash) && item.key?(:addresses_attributes) }
        expect(addresses_entry).to be_present
        expect(addresses_entry[:addresses_attributes]).to include(:id)
        expect(addresses_entry[:addresses_attributes]).to include(:_destroy)
        expect(addresses_entry[:addresses_attributes]).to include(:address_line_1)
        expect(addresses_entry[:addresses_attributes]).to include(:city)
      end
    end

    context "with RibRequestSchema (has recipients relationship)" do
      let(:tool_class) do
        Class.new(Core::Tools::Base) do
          route method: :put, scope: :member
          schema "rib_request"

          params do
            integer :id, required: true
            object :data, of: RibCheckService::RibRequestSchema
          end
        end
      end

      it "includes recipients_attributes for has_many relationship" do
        structure = described_class.permit_structure(tool_class)

        # Relationship attributes are at top level as hash entries
        recipients_entry = structure.find { |item| item.is_a?(Hash) && item.key?(:recipients_attributes) }
        expect(recipients_entry).to be_present
        expect(recipients_entry[:recipients_attributes]).to include(:id)
        expect(recipients_entry[:recipients_attributes]).to include(:_destroy)
        # Recipients are contacts
        expect(recipients_entry[:recipients_attributes]).to include(:first_name)
        expect(recipients_entry[:recipients_attributes]).to include(:last_name)
        expect(recipients_entry[:recipients_attributes]).to include(:company)
      end

      it "includes documents_attributes for has_many relationship" do
        structure = described_class.permit_structure(tool_class)

        # Relationship attributes are at top level as hash entries
        documents_entry = structure.find { |item| item.is_a?(Hash) && item.key?(:documents_attributes) }
        expect(documents_entry).to be_present
        expect(documents_entry[:documents_attributes]).to include(:id)
        expect(documents_entry[:documents_attributes]).to include(:_destroy)
      end
    end

    context "with tool without schema" do
      let(:tool_class) do
        Class.new(Core::Tools::Base) do
          route method: :get, scope: :collection

          params do
            integer :page, required: false
            integer :per_page, required: false
          end
        end
      end

      it "returns basic fields without relationship attributes" do
        structure = described_class.permit_structure(tool_class)

        expect(structure).to include(:page)
        expect(structure).to include(:per_page)
        expect(structure.find { |item| item.is_a?(Hash) }).to be_nil
      end
    end
  end

  describe ".permitted_keys" do
    let(:tool_class) do
      Class.new(Core::Tools::Base) do
        route method: :put, scope: :member
        schema "contact"

        params do
          integer :id, required: true
          object :data, of: ContactsService::ContactSchema
        end
      end
    end

    it "returns top-level keys" do
      keys = described_class.permitted_keys(tool_class)

      expect(keys).to include(:id)
      expect(keys).to include(:data)
    end
  end
end
