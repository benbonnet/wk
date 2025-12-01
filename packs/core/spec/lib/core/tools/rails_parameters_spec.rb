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

      it "includes basic data fields" do
        structure = described_class.permit_structure(tool_class)

        expect(structure).to include(:id)
        data_hash = structure.find { |item| item.is_a?(Hash) }
        expect(data_hash).to have_key(:data)

        data_fields = data_hash[:data]
        expect(data_fields).to include(:first_name)
        expect(data_fields).to include(:last_name)
        expect(data_fields).to include(:company)
      end

      it "includes addresses_attributes for has_many relationship" do
        structure = described_class.permit_structure(tool_class)

        data_hash = structure.find { |item| item.is_a?(Hash) }
        data_fields = data_hash[:data]
        nested = data_fields.find { |item| item.is_a?(Hash) }

        expect(nested).to have_key(:addresses_attributes)
        expect(nested[:addresses_attributes]).to include(:id)
        expect(nested[:addresses_attributes]).to include(:_destroy)
        expect(nested[:addresses_attributes]).to include(:address_line_1)
        expect(nested[:addresses_attributes]).to include(:city)
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

        data_hash = structure.find { |item| item.is_a?(Hash) }
        data_fields = data_hash[:data]
        nested = data_fields.find { |item| item.is_a?(Hash) }

        expect(nested).to have_key(:recipients_attributes)
        expect(nested[:recipients_attributes]).to include(:id)
        expect(nested[:recipients_attributes]).to include(:_destroy)
        # Recipients are contacts
        expect(nested[:recipients_attributes]).to include(:first_name)
        expect(nested[:recipients_attributes]).to include(:last_name)
        expect(nested[:recipients_attributes]).to include(:company)
      end

      it "includes documents_attributes for has_many relationship" do
        structure = described_class.permit_structure(tool_class)

        data_hash = structure.find { |item| item.is_a?(Hash) }
        data_fields = data_hash[:data]
        nested = data_fields.find { |item| item.is_a?(Hash) }

        expect(nested).to have_key(:documents_attributes)
        expect(nested[:documents_attributes]).to include(:id)
        expect(nested[:documents_attributes]).to include(:_destroy)
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
