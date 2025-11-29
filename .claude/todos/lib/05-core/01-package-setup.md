# 01 - Package Setup

## Files

### packs/core/package.yml

```yaml
enforce_dependencies: true
enforce_privacy: true

metadata:
  owner: platform
```

### packs/core/lib/core.rb

```ruby
# frozen_string_literal: true

module Core
  class << self
    def reload!
      Schema::Registry.clear!
      Relationships::Registry.reload!
      Features::Registry.clear!
    end
  end
end
```

## Directory Creation

```bash
mkdir -p packs/core/{config,lib}
mkdir -p packs/core/app/controllers/core
mkdir -p packs/core/app/lib/core/{schema,relationships,tools,features}
mkdir -p packs/core/app/models/concerns/core
mkdir -p packs/core/lib/tasks
mkdir -p packs/core/spec/{lib/core/{schema,relationships,tools,features},models/concerns/core}
```
