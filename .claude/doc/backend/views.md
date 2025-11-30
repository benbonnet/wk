# Backend Views System

Views define UI structure using a Ruby DSL. The frontend fetches and renders these via the UI Renderer.

## Architecture

```
packs/{service}/app/lib/{service}/views/
  index.rb      →  GET /api/v1/views/:namespace/:feature/index
  show.rb       →  GET /api/v1/views/:namespace/:feature/show
  form.rb       →  (embedded in drawers, or standalone)
```

## View DSL

**Location:** `packs/ui/app/lib/ui/views/base_view.rb`

```ruby
module RibCheckWorkflow
  module Views
    class Index
      include Ui::Views::BaseView

      view do
        frontend_route "/rib-checks"  # Exposes as frontend route
        url "/api/v1/workspaces/rib_requests"

        api do |a|
          a.index method: :get, path: ""
          a.show method: :get, path: ":id"
          a.create method: :post, path: ""
          a.update method: :patch, path: ":id"
          a.destroy method: :delete, path: ":id"
        end

        translations(
          en: { page_title: "RIB Requests", ... },
          fr: { page_title: "Demandes RIB", ... }
        )

        drawers do |d|
          d.drawer(:new_drawer) do |drawer|
            drawer.title "new_request"
            drawer.body Form, action: :save
          end
        end

        page(classname: "bg-slate-50") do |c|
          c.title "page_title"
          c.description "page_description"
          c.actions { link "new_request", opens: :new_drawer }
          c.body do
            table(searchable: true) do |t|
              t.column :status, type: "DISPLAY_BADGE"
              t.column :created_at, type: "DISPLAY_DATE"
            end
          end
        end
      end
    end
  end
end
```

---

## frontend_route DSL

Makes a view routable from the frontend. **No `/app` prefix** - React Router's `basename` handles it.

```ruby
view do
  frontend_route "/contacts"      # URL: /app/contacts
  # ...
end
```

**With route params:**
```ruby
view do
  frontend_route "/contacts/:id"  # URL: /app/contacts/123
  # ...
end
```

**No frontend_route = component only:**
```ruby
# form.rb - used inside drawers, not a standalone page
view do
  # No frontend_route
  # ...
end
```

### Routable vs Component Views

| View Type | frontend_route | Usage |
|-----------|----------------|-------|
| Page | Yes | Standalone route, full page |
| Component | No | Embedded in drawers, other views |

**Example: contacts_service**
```
views/
  index.rb   frontend_route "/contacts"       # List page
  show.rb    frontend_route "/contacts/:id"   # Detail page
  form.rb    (no route)                       # Drawer content
```

**Example: rib_check_workflow**
```
views/
  index.rb   frontend_route "/rib-checks"     # List page with drawers
  show.rb    (no route)                       # Drawer content
  form.rb    (no route)                       # Drawer content
```

---

## View Elements

### page

Top-level page container.

```ruby
page(classname: "bg-slate-50") do |c|
  c.title "page_title"
  c.description "page_description"
  c.actions { ... }
  c.body { ... }
end
```

### table

Data table with pagination, search, sorting.

```ruby
table(searchable: true, page_size: 10) do |t|
  t.column :name, type: "DISPLAY_TEXT", sortable: true
  t.column :status, type: "DISPLAY_BADGE", options: [...]
  t.row_click opens: :view_drawer
  t.row_actions icon: "ellipsis" do
    link :edit, opens: :edit_drawer
    link :delete, api: :destroy, confirm: "delete_confirm"
  end
end
```

### drawers

Slide-out panels for forms, details.

```ruby
drawers do |d|
  d.drawer(:edit_drawer, className: "w-1/2") do |drawer|
    drawer.title "edit_title"
    drawer.body Form, action: :save, use_record: true
  end
end
```

### group

Layout container.

```ruby
group(classname: "flex gap-4") do
  # child elements
end
```

### link

Action button/link.

```ruby
link "new_item", opens: :new_drawer, variant: "primary"
link :delete, api: :destroy, confirm: "are_you_sure", icon: "trash"
```

---

## API Block

Defines CRUD endpoints for the view.

```ruby
api do |a|
  a.index method: :get, path: ""
  a.show method: :get, path: ":id"
  a.create method: :post, path: ""
  a.update method: :patch, path: ":id"
  a.destroy method: :delete, path: ":id"
  a.cancel method: :post, path: ":id/cancel"  # Custom action
end
```

Frontend uses these for API calls (via `executeApi`).

---

## Translations

Inline translations for view-specific labels.

```ruby
translations(
  en: {
    page_title: "Contacts",
    new_contact: "New Contact",
    delete_confirm: "Are you sure?"
  },
  fr: {
    page_title: "Contacts",
    new_contact: "Nouveau Contact",
    delete_confirm: "Etes-vous sur?"
  }
)
```

---

## Column Types

| Type | Description |
|------|-------------|
| `DISPLAY_TEXT` | Plain text |
| `DISPLAY_BADGE` | Colored badge with options |
| `DISPLAY_DATE` | Formatted date |
| `DISPLAY_DATETIME` | Formatted datetime |
| `DISPLAY_BOOLEAN` | Yes/No or checkmark |
| `DISPLAY_SELECT` | Mapped value from options |
| `DISPLAY_TAGS` | Tag list |

---

## Routes Endpoint

Frontend fetches available routes at startup.

**GET /api/v1/routes**

```json
{
  "routes": [
    {
      "path": "/contacts",
      "namespace": "workspaces",
      "feature": "contacts",
      "view": "index"
    },
    {
      "path": "/contacts/:id",
      "namespace": "workspaces",
      "feature": "contacts",
      "view": "show"
    }
  ]
}
```

Only views with `frontend_route` are included.

---

## Best Practices

1. **One view per file** - index.rb, show.rb, form.rb
2. **Use frontend_route for pages** - Omit for drawer/embedded content
3. **No /app prefix** - React Router basename handles it
4. **Translations inline** - Keep view-specific labels in the view
5. **Match URL to feature** - `/contacts` for `contacts` feature
6. **Consistent naming** - index (list), show (detail), form (create/edit)
