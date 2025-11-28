# 01 - Package Setup

## Files to Create

### packs/core/package.yml

```yaml
enforce_dependencies: true
enforce_privacy: true

dependencies:
  - ui

metadata:
  owner: platform
  description: Core schema, relationships, tools, and features infrastructure
```

### packs/core/.rubocop.yml

```yaml
inherit_from:
  - ../../.rubocop.yml
```

### packs/core/spec/spec_helper.rb

```ruby
# frozen_string_literal: true

require "rails_helper"

RSpec.configure do |config|
  config.before(:suite) do
    Core.setup!
  end
end
```

## Commands

```bash
mkdir -p packs/core/{lib,app/lib/core/{schema,relationships,tools,features},app/models/core/concerns,app/controllers/core,spec/lib/core/{schema,relationships,tools,features},spec/models/core/concerns}
touch packs/core/package.yml
touch packs/core/.rubocop.yml
touch packs/core/spec/spec_helper.rb
```
