# frozen_string_literal: true

require "rails_helper"

RSpec.describe Core::Validation::ErrorTransformer do
  describe ".call" do
    it "transforms missing required field" do
      errors = [{ fragment: "#/", message: "The property '#/' did not contain a required property of 'first_name'" }]
      expect(described_class.call(errors)).to eq({ "first_name" => ["can't be blank"] })
    end

    it "transforms multiple missing required fields" do
      errors = [
        { fragment: "#/", message: "The property '#/' did not contain a required property of 'first_name'" },
        { fragment: "#/", message: "The property '#/' did not contain a required property of 'last_name'" }
      ]
      result = described_class.call(errors)
      expect(result["first_name"]).to eq(["can't be blank"])
      expect(result["last_name"]).to eq(["can't be blank"])
    end

    it "transforms wrong type error (integer)" do
      errors = [{ fragment: "#/age", message: "The property '#/age' of type string is not of type integer" }]
      expect(described_class.call(errors)).to eq({ "age" => ["must be a number"] })
    end

    it "transforms wrong type error (boolean)" do
      errors = [{ fragment: "#/active", message: "The property '#/active' of type string is not of type boolean" }]
      expect(described_class.call(errors)).to eq({ "active" => ["must be true or false"] })
    end

    it "transforms wrong type error (array)" do
      errors = [{ fragment: "#/tags", message: "The property '#/tags' of type string is not of type array" }]
      expect(described_class.call(errors)).to eq({ "tags" => ["must be an array"] })
    end

    it "transforms enum validation error" do
      errors = [{ fragment: "#/gender", message: "The property '#/gender' value 'invalid' is not one of [\"male\", \"female\"]" }]
      expect(described_class.call(errors)).to eq({ "gender" => ["is not included in the list"] })
    end

    it "transforms format validation error (regex)" do
      errors = [{ fragment: "#/email", message: "The property '#/email' did not match the regex" }]
      expect(described_class.call(errors)).to eq({ "email" => ["is invalid"] })
    end

    it "transforms nested array error" do
      # The fragment contains the path, message contains "required property"
      errors = [{ fragment: "#/addresses_attributes/0", message: "The property '#/addresses_attributes/0' did not contain a required property of 'city'" }]
      result = described_class.call(errors)
      # When required property is missing, it extracts the field name from the message
      expect(result["city"]).to eq(["can't be blank"])
    end

    it "transforms nested object error (has_one)" do
      errors = [{ fragment: "#/spouse_attributes", message: "The property '#/spouse_attributes' did not contain a required property of 'first_name'" }]
      result = described_class.call(errors)
      # When required property is missing, it extracts the field name from the message
      expect(result["first_name"]).to eq(["can't be blank"])
    end

    it "deduplicates messages" do
      errors = [
        { fragment: "#/", message: "The property '#/' did not contain a required property of 'email'" },
        { fragment: "#/", message: "The property '#/' did not contain a required property of 'email'" }
      ]
      result = described_class.call(errors)
      expect(result["email"].length).to eq(1)
    end

    it "handles empty errors array" do
      expect(described_class.call([])).to eq({})
    end

    it "transforms min length error" do
      errors = [{ fragment: "#/name", message: "The property '#/name' has fewer than 2 characters allowed" }]
      expect(described_class.call(errors)).to eq({ "name" => ["is too short"] })
    end

    it "transforms max length error" do
      errors = [{ fragment: "#/name", message: "The property '#/name' has more than 255 characters allowed" }]
      expect(described_class.call(errors)).to eq({ "name" => ["is too long"] })
    end
  end
end
