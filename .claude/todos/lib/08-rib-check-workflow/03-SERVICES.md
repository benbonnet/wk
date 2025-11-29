# Phase 3: Service Packs

## Checklist

- [ ] Create activities_service pack
  - [ ] ActivitySerializer
  - [ ] Tools::Create
- [ ] Create invites_service pack
  - [ ] InviteSerializer
  - [ ] Tools::Create
  - [ ] Tools::Cancel
- [ ] Create items_service pack
  - [ ] Tools::Create
  - [ ] Tools::Update

---

## Architecture

Tools are workflow step implementations. They:

1. Inherit from `Core::Tools::Base`
2. Define `def execute(user_id:, workspace_id:, **params)`
3. Return hashes (JSON-serializable)
4. Use Alba serializers for AR objects
5. Optionally have HTTP routes (some are workflow-only)

```
HTTP Request → Controller → Tool.execute(user_id:, workspace_id:, **params)
Workflow Step → Tool.execute(user_id:, workspace_id:, **params)
```

Same entry point for both.

---

## 3.1 Activities Service

```
packs/activities_service/
├── app/lib/activities_service/
│   ├── activity_serializer.rb
│   └── tools/
│       └── create.rb
├── spec/lib/activities_service/
│   ├── activity_serializer_spec.rb
│   └── tools/
│       └── create_spec.rb
└── package.yml
```

### package.yml

```yaml
# packs/activities_service/package.yml
enforce_dependencies: true
enforce_privacy: true
dependencies:
  - packs/core
```

### ActivitySerializer

```ruby
# packs/activities_service/app/lib/activities_service/activity_serializer.rb
module ActivitiesService
  class ActivitySerializer
    include Alba::Resource

    attributes :id, :workspace_id, :user_id, :activity_type, :category, :level, :message
    attributes :item_id, :schema_slug, :tool_slug, :feature_slug
    attributes :error_code, :error_stack, :duration_ms, :metadata

    attribute :created_at do |activity|
      activity.created_at&.iso8601
    end
  end
end
```

### Tools::Create

```ruby
# packs/activities_service/app/lib/activities_service/tools/create.rb
module ActivitiesService
  module Tools
    class Create < Core::Tools::Base
      # No route - workflow only

      def execute(
        user_id:,
        workspace_id:,
        activity_type:,
        category:,
        level:,
        message:,
        item_id: nil,
        schema_slug: nil,
        tool_slug: nil,
        feature_slug: nil,
        metadata: {},
        **_
      )
        activity = Activity.create!(
          workspace_id:,
          user_id:,
          activity_type:,
          category:,
          level:,
          message:,
          item_id:,
          schema_slug:,
          tool_slug:,
          feature_slug:,
          metadata:
        )

        ActivitySerializer.new(activity).to_h
      end
    end
  end
end
```

---

## 3.2 Invites Service

```
packs/invites_service/
├── app/lib/invites_service/
│   ├── invite_serializer.rb
│   └── tools/
│       ├── create.rb
│       └── cancel.rb
├── spec/lib/invites_service/
│   ├── invite_serializer_spec.rb
│   └── tools/
│       ├── create_spec.rb
│       └── cancel_spec.rb
└── package.yml
```

### package.yml

```yaml
# packs/invites_service/package.yml
enforce_dependencies: true
enforce_privacy: true
dependencies:
  - packs/core
```

### InviteSerializer

```ruby
# packs/invites_service/app/lib/invites_service/invite_serializer.rb
module InvitesService
  class InviteSerializer
    include Alba::Resource

    attributes :id, :inviter_id, :invitee_id, :recipient_workspace_id, :status, :auth_link_hash

    attribute :created_at do |invite|
      invite.created_at&.iso8601
    end

    attribute :updated_at do |invite|
      invite.updated_at&.iso8601
    end

    attribute :item_ids do |invite|
      invite.invite_items.pluck(:item_id)
    end
  end
end
```

### Tools::Create

```ruby
# packs/invites_service/app/lib/invites_service/tools/create.rb
module InvitesService
  module Tools
    class Create < Core::Tools::Base
      # No route - workflow only

      def execute(
        user_id:,
        workspace_id:,
        inviter_id:,
        invitee_id:,
        recipient_workspace_id: nil,
        status: 'pending',
        item_ids: [],
        **_
      )
        invite = nil

        ActiveRecord::Base.transaction do
          invite = Invite.create!(
            inviter_id:,
            invitee_id:,
            recipient_workspace_id:,
            status:
          )

          item_ids.each do |item_id|
            InviteItem.create!(invite_id: invite.id, item_id:)
          end
        end

        invite.reload
        InviteSerializer.new(invite).to_h
      end
    end
  end
end
```

### Tools::Cancel

```ruby
# packs/invites_service/app/lib/invites_service/tools/cancel.rb
module InvitesService
  module Tools
    class Cancel < Core::Tools::Base
      # No route - workflow only

      CANCELLABLE_STATUSES = %w[pending sent opened clicked].freeze

      def execute(user_id:, workspace_id:, invite_id:, **_)
        invite = Invite.find(invite_id)

        unless invite.status.in?(CANCELLABLE_STATUSES)
          return {
            id: invite.id,
            status: invite.status,
            cancelled: false,
            error: "Cannot cancel invite with status: #{invite.status}"
          }
        end

        invite.update!(status: 'cancelled')

        InviteSerializer.new(invite).to_h.merge(cancelled: true)
      end
    end
  end
end
```

---

## 3.3 Items Service

Shared item operations used across workflows.

```
packs/items_service/
├── app/lib/items_service/
│   └── tools/
│       ├── create.rb
│       └── update.rb
├── spec/lib/items_service/
│   └── tools/
│       ├── create_spec.rb
│       └── update_spec.rb
└── package.yml
```

### package.yml

```yaml
# packs/items_service/package.yml
enforce_dependencies: true
enforce_privacy: true
dependencies:
  - packs/core
```

### Tools::Create

```ruby
# packs/items_service/app/lib/items_service/tools/create.rb
module ItemsService
  module Tools
    class Create < Core::Tools::Base
      # No route - workflow only

      def execute(
        user_id:,
        workspace_id:,
        schema_slug:,
        tool_slug:,
        data:,
        **_
      )
        item = Item.create!(
          schema_slug:,
          tool_slug:,
          data:,
          created_by_id: user_id,
          workspace_id:
        )

        Core::Serializers::ItemSerializer.new(item).to_h
      end
    end
  end
end
```

### Tools::Update

```ruby
# packs/items_service/app/lib/items_service/tools/update.rb
module ItemsService
  module Tools
    class Update < Core::Tools::Base
      # No route - workflow only

      def execute(user_id:, workspace_id:, id:, data:, **_)
        item = Item.find(id)

        item.update!(
          data: item.data.merge(data.stringify_keys),
          updated_by_id: user_id
        )

        Core::Serializers::ItemSerializer.new(item).to_h
      end
    end
  end
end
```

---

## Summary

| Pack               | Serializer         | Tools          | Has Routes? |
| ------------------ | ------------------ | -------------- | ----------- |
| activities_service | ActivitySerializer | Create         | No          |
| invites_service    | InviteSerializer   | Create, Cancel | No          |
| items_service      | (uses Core)        | Create, Update | No          |

These are workflow building blocks. No HTTP routes - called only from workflows.
