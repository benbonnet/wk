# Phase 1: Backend Structure Setup

## Goal

Create `packs/ui` backend package.

## Directory Structure

```
packs/
└── ui/
    ├── package.yml
    └── lib/
        └── ui/
            ├── views.rb
            └── views/
                ├── base_view.rb
                ├── view_builder.rb
                └── builders/
                    ├── api_builder.rb
                    ├── drawers_builder.rb
                    ├── page_builder.rb
                    ├── table_builder.rb
                    └── relationship_picker_builder.rb
```

## Tasks

### 1. Create directory structure

```bash
mkdir -p packs/ui/lib/ui/views/builders
```

### 2. Create packs/ui/package.yml

```yaml
# UI Views Package
# Pure DSL for generating UISchema JSON
# Zero dependencies

enforce_dependencies: true
enforce_privacy: true
dependencies: []
```

### 3. Create packs/ui/lib/ui/views.rb

```ruby
# frozen_string_literal: true

require_relative "views/builders/api_builder"
require_relative "views/builders/drawers_builder"
require_relative "views/builders/page_builder"
require_relative "views/builders/table_builder"
require_relative "views/builders/relationship_picker_builder"
require_relative "views/view_builder"
require_relative "views/base_view"

module UI
  module Views
  end
end
```

No configuration. No setup. Just require and use.

## Verification

```bash
bin/packwerk check
```
