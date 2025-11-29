# 15 - Example Usage (contacts_service pack)

## File: packs/contacts_service/app/lib/contacts_service/contact_schema.rb

```ruby
# frozen_string_literal: true

module ContactsService
  class ContactSchema < Core::Schema::Base
    title "Contact"
    description "A contact record with personal information"

    # Basic fields
    string :first_name, description: "First name", max_length: 255
    string :last_name, description: "Last name", max_length: 255
    string :email, format: "email", required: false
    string :phone, required: false
    string :company, required: false
    string :job_title, required: false
    string :gender, enum: %w[male female other prefer_not_to_say], required: false
    string :date_of_birth, format: "date", required: false
    array :tags, of: :string, required: false

    # Common helpers
    timestamps
    soft_delete

    # Relationships
    relationships do
      has_one :spouse, schema: :contact, inverse: :spouse
      has_many :addresses, schema: :address, inverse: :contact
      has_many :children, schema: :contact, inverse: :parents
      has_many :parents, schema: :contact, inverse: :children
      has_many :phones, schema: :phone, inverse: :contact
      has_many :emails, schema: :email, inverse: :contact
    end

    # Translations
    translations(
      en: {
        first_name: "First Name",
        last_name: "Last Name",
        email: "Email Address",
        phone: "Phone Number",
        company: "Company",
        job_title: "Job Title",
        spouse: "Spouse",
        children: "Children",
        addresses: "Addresses"
      },
      fr: {
        first_name: "Prénom",
        last_name: "Nom",
        email: "Adresse e-mail",
        phone: "Numéro de téléphone",
        company: "Entreprise",
        job_title: "Poste",
        spouse: "Conjoint(e)",
        children: "Enfants",
        addresses: "Adresses"
      }
    )
  end
end
```

## File: packs/contacts_service/app/lib/contacts_service/tools/index.rb

```ruby
# frozen_string_literal: true

module ContactsService
  module Tools
    class Index < Core::Tools::Base
      route method: :get, scope: :collection
      schema "contact"

      def execute(page: 1, per_page: 25, search: nil, **filters)
        query = items.active

        if search.present?
          query = query.where(
            "data->>'first_name' ILIKE :q OR data->>'last_name' ILIKE :q OR data->>'email' ILIKE :q",
            q: "%#{search}%"
          )
        end

        total = query.count
        records = query.order(created_at: :desc)
                       .offset((page.to_i - 1) * per_page.to_i)
                       .limit(per_page.to_i)

        {
          data: records.map { |r| serialize(r) },
          meta: {
            page: page.to_i,
            per_page: per_page.to_i,
            total: total,
            total_pages: (total.to_f / per_page.to_i).ceil
          }
        }
      end

      private

      def serialize(item)
        item.data.merge(
          "id" => item.id,
          "created_at" => item.created_at,
          "updated_at" => item.updated_at
        )
      end
    end
  end
end
```

## File: packs/contacts_service/app/lib/contacts_service/tools/show.rb

```ruby
# frozen_string_literal: true

module ContactsService
  module Tools
    class Show < Core::Tools::Base
      route method: :get, scope: :member
      schema "contact"

      def execute(id:, include_relationships: false, **_)
        item = find_item!(id)

        data = item.data.merge(
          "id" => item.id,
          "created_at" => item.created_at,
          "updated_at" => item.updated_at
        )

        if include_relationships
          data["relationships"] = item.load_relationships.transform_values do |rel|
            case rel
            when Array
              rel.map { |r| serialize_related(r) }
            when Item
              serialize_related(rel)
            else
              rel
            end
          end
        end

        { data: data }
      end

      private

      def serialize_related(item)
        return nil unless item
        item.data.merge("id" => item.id)
      end
    end
  end
end
```

## File: packs/contacts_service/app/lib/contacts_service/tools/create.rb

```ruby
# frozen_string_literal: true

module ContactsService
  module Tools
    class Create < Core::Tools::Base
      route method: :post, scope: :collection
      schema "contact"

      def execute(contact: {}, **_)
        validate!(contact)

        item = Item.create!(
          schema_slug: "contact",
          tool_slug: "create",
          data: contact,
          created_by: current_user,
          workspace: current_workspace
        )

        { data: serialize(item), meta: { created: true } }
      end

      private

      def validate!(data)
        errors = {}
        errors[:first_name] = "is required" if data[:first_name].blank?
        errors[:last_name] = "is required" if data[:last_name].blank?

        if errors.any?
          raise Core::Tools::ValidationError.new("Validation failed", errors)
        end
      end

      def serialize(item)
        item.data.merge(
          "id" => item.id,
          "created_at" => item.created_at
        )
      end
    end
  end
end
```

## File: packs/contacts_service/app/lib/contacts_service/tools/update.rb

```ruby
# frozen_string_literal: true

module ContactsService
  module Tools
    class Update < Core::Tools::Base
      route method: :put, scope: :member
      schema "contact"

      def execute(id:, contact: {}, **_)
        item = find_item!(id)

        item.update!(
          data: item.data.merge(contact.stringify_keys),
          updated_by: current_user
        )

        { data: serialize(item), meta: { updated: true } }
      end

      private

      def serialize(item)
        item.data.merge(
          "id" => item.id,
          "updated_at" => item.updated_at
        )
      end
    end
  end
end
```

## File: packs/contacts_service/app/lib/contacts_service/tools/destroy.rb

```ruby
# frozen_string_literal: true

module ContactsService
  module Tools
    class Destroy < Core::Tools::Base
      route method: :delete, scope: :member
      schema "contact"

      def execute(id:, **_)
        item = find_item!(id)

        item.update!(
          deleted_at: Time.current,
          deleted_by: current_user
        )

        { meta: { deleted: true, id: id } }
      end
    end
  end
end
```

## File: packs/contacts_service/app/lib/contacts_service/tools/add_relationship.rb

```ruby
# frozen_string_literal: true

module ContactsService
  module Tools
    class AddRelationship < Core::Tools::Base
      route method: :post, scope: :member, action: "relationships"
      schema "contact"

      def execute(id:, relationship_type:, target_id:, metadata: {}, **_)
        source = find_item!(id)
        target = Item.find(target_id)

        relationship = source.add_relationship(
          target,
          relationship_type,
          metadata: metadata
        )

        {
          data: {
            id: relationship.id,
            relationship_type: relationship_type,
            source_id: source.id,
            target_id: target.id
          },
          meta: { created: true }
        }
      end
    end
  end
end
```

## File: packs/contacts_service/config/initializers/feature_registration.rb

```ruby
# frozen_string_literal: true

Rails.application.config.after_initialize do
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
      # ContactsService::Views::Index,
      # ContactsService::Views::Form,
      # ContactsService::Views::Show
    ]
  )
end
```

## API Endpoints Generated

| Method | Path | Tool |
|--------|------|------|
| GET | /api/v1/workspaces/contacts | Index |
| POST | /api/v1/workspaces/contacts | Create |
| GET | /api/v1/workspaces/contacts/:id | Show |
| PUT | /api/v1/workspaces/contacts/:id | Update |
| DELETE | /api/v1/workspaces/contacts/:id | Destroy |
| POST | /api/v1/workspaces/contacts/:id/relationships | AddRelationship |
