# UI Views Library - Integration Testing Strategy

## Principles

- **No component mocking** - All adapters render as real components
- **React Testing Library only** - No `querySelector`, use roles/labels/test-ids
- **Gradual complexity** - Start with pure functions, end with multi-layer interactions
- **Real schema** - Use actual `contacts_index.json` view schema

---

## Phase 1: Pure Functions (No React)

Test the resolver logic in isolation.

### 1.1 Rule Evaluation - Basic Operators

```
resolveRules() with EQ operator
resolveRules() with NEQ operator
resolveRules() with NULL operator
resolveRules() with NNULL operator
resolveRules() with EMPTY operator
resolveRules() with NEMPTY operator
```

### 1.2 Rule Evaluation - Numeric Operators

```
resolveRules() with LT operator
resolveRules() with LTE operator
resolveRules() with GT operator
resolveRules() with GTE operator
```

### 1.3 Rule Evaluation - Collection Operators

```
resolveRules() with IN operator
resolveRules() with NIN operator
resolveRules() with CONTAINS operator
```

### 1.4 Rule Effects

```
resolveRules() HIDE effect - returns visible:false when conditions met
resolveRules() SHOW effect - returns visible:false when conditions NOT met
resolveRules() DISABLE effect - returns enabled:false when conditions met
resolveRules() ENABLE effect - returns enabled:false when conditions NOT met
```

### 1.5 Multiple Rules

```
resolveRules() with multiple conditions (AND logic)
resolveRules() with multiple rules (processed sequentially)
resolveRules() with no rules returns default state
```

---

## Phase 2: Display Adapters (Read-Only, No State)

Test display components render values correctly.

### 2.1 Text Displays

```
DISPLAY_TEXT renders string value
DISPLAY_TEXT renders empty state for null/undefined
DISPLAY_LONGTEXT renders multiline text
DISPLAY_NUMBER renders numeric value
DISPLAY_NUMBER renders formatted number
```

### 2.2 Date Displays

```
DISPLAY_DATE renders formatted date
DISPLAY_DATE renders empty state for null
DISPLAY_DATETIME renders date with time
```

### 2.3 Semantic Displays

```
DISPLAY_BOOLEAN renders "Yes" for true
DISPLAY_BOOLEAN renders "No" for false
DISPLAY_BADGE renders value as badge
DISPLAY_TAGS renders array of tags as badges
DISPLAY_SELECT renders label from options matching value
```

### 2.4 Display with Labels

```
Display renders label when provided
Display renders without label when not provided
```

---

## Phase 3: Input Adapters (Controlled State)

Test inputs render and respond to user interaction.

### 3.1 Text Inputs

```
INPUT_TEXT renders with label
INPUT_TEXT renders with placeholder
INPUT_TEXT displays initial value
INPUT_TEXT calls onChange on user type
INPUT_TEXTAREA renders multiline input
INPUT_TEXTAREA respects rows prop
```

### 3.2 Selection Inputs

```
INPUT_SELECT renders options from schema
INPUT_SELECT displays selected value label
INPUT_SELECT calls onChange on selection
INPUT_CHECKBOX renders checkbox
INPUT_CHECKBOX toggles on click
INPUT_CHECKBOXES renders multiple checkboxes
INPUT_RADIOS renders radio group
INPUT_RADIOS allows single selection
```

### 3.3 Date Inputs

```
INPUT_DATE renders date picker trigger
INPUT_DATE opens calendar on click
INPUT_DATETIME renders datetime picker
```

### 3.4 Complex Inputs

```
INPUT_TAGS renders tag list
INPUT_TAGS adds tag on enter
INPUT_TAGS removes tag on delete click
INPUT_AI_RICH_TEXT renders rich text editor
```

### 3.5 Input States

```
Input renders disabled state
Input renders error message when provided
Input renders helper text
```

---

## Phase 4: Primitive Adapters (Actions)

Test action components trigger callbacks.

### 4.1 Button/Link

```
BUTTON renders with label
BUTTON calls onClick when clicked
BUTTON renders with variant styles
LINK renders with href
LINK with opens attribute renders as button
```

### 4.2 Dropdown

```
DROPDOWN renders trigger button
DROPDOWN opens menu on click
DROPDOWN renders OPTION children
OPTION triggers action on click
```

### 4.3 Submit

```
SUBMIT renders submit button
SUBMIT shows loading state when form submitting
SUBMIT displays loadingLabel during submission
```

---

## Phase 5: Layout Adapters (Container + Children)

Test containers render children correctly.

### 5.1 Basic Layouts

```
GROUP renders children
GROUP renders label as heading
CARD_GROUP renders children in card
ALERT renders message with color variant
```

### 5.2 Show Layout

```
SHOW renders children with data context
SHOW provides record data to child displays
```

### 5.3 Actions Layout

```
ACTIONS renders children inline
ACTIONS applies gap styling
```

---

## Phase 6: DynamicRenderer (Component Routing)

Test the renderer routes schemas to correct components.

### 6.1 Type Routing

```
DynamicRenderer routes VIEW type to VIEW component
DynamicRenderer routes PAGE type to PAGE component
DynamicRenderer routes TABLE type to TABLE component
DynamicRenderer routes FORM type to FORM component
DynamicRenderer routes GROUP type to GROUP component
```

### 6.2 COMPONENT Kind Routing

```
DynamicRenderer routes COMPONENT with INPUT_TEXT to text input
DynamicRenderer routes COMPONENT with DISPLAY_TEXT to text display
DynamicRenderer routes COMPONENT with INPUT_SELECT to select input
DynamicRenderer routes COMPONENT with DISPLAY_DATE to date display
```

### 6.3 Nested Rendering

```
DynamicRenderer renders nested elements recursively
DynamicRenderer renders template array items
DynamicRenderer passes data to children
```

### 6.4 Rule Application

```
DynamicRenderer hides element when HIDE rule matches
DynamicRenderer shows element when SHOW rule matches
DynamicRenderer disables input when DISABLE rule matches
```

---

## Phase 7: PAGE Adapter (Header + Content)

Test page structure renders correctly.

### 7.1 Page Structure

```
PAGE renders title from schema
PAGE renders description from schema
PAGE renders children in content area
PAGE applies className from schema
```

### 7.2 Page Actions

```
PAGE renders actions in header
PAGE renders LINK action
PAGE renders DROPDOWN action
PAGE renders multiple actions
```

### 7.3 Page Translations

```
PAGE translates title via t()
PAGE translates description via t()
PAGE actions have translated labels
```

---

## Phase 8: TABLE Adapter (Data Grid)

Test table renders data and handles interactions.

### 8.1 Table Structure

```
TABLE renders column headers from schema
TABLE translates column labels
TABLE renders sortable column with sort button
TABLE renders non-sortable column as plain text
```

### 8.2 Table Data

```
TABLE renders rows from data prop
TABLE renders cell values
TABLE renders empty state when no data
TABLE renders "" for null values
```

### 8.3 Table Selection

```
TABLE renders checkbox column when selectable=true
TABLE header checkbox selects all rows
TABLE row checkbox selects single row
TABLE tracks selected row count
```

### 8.4 Table Search

```
TABLE renders search input when searchable=true
TABLE filters rows on search input
TABLE shows search placeholder from schema
```

### 8.5 Table Pagination

```
TABLE paginates based on pageSize
TABLE shows page count
TABLE Previous button disabled on first page
TABLE Next button disabled on last page
TABLE navigates pages on button click
```

### 8.6 Table Sorting

```
TABLE sorts ascending on column header click
TABLE sorts descending on second click
TABLE shows sort indicator
```

---

## Phase 9: FORM Adapter (State Management)

Test form manages field state and submission.

### 9.1 Form Context

```
FORM provides Formik context to children
FORM children can read values via useField
FORM children can update values via useField.onChange
```

### 9.2 Form Initial Values

```
FORM initializes with defaultValues prop
FORM initializes with drawerData when use_record=true
FORM updates when drawerData changes
```

### 9.3 Form Dirty State

```
FORM tracks isDirty when values change
FORM isDirty is false when values match initial
```

### 9.4 Form Errors

```
FORM displays error on field after touch
FORM clears error when field value changes
FORM validates required fields on submit
```

### 9.5 Form Submission

```
FORM calls onSubmit with values
FORM prevents default form submission
FORM sets isSubmitting during submission
FORM resets isSubmitting after completion
```

---

## Phase 10: VIEW Adapter (Root Container)

Test VIEW manages drawers and API execution.

### 10.1 View Structure

```
VIEW renders children
VIEW provides DrawerContext
VIEW provides ViewContext
```

### 10.2 Drawer State

```
VIEW openDrawer() sets activeDrawer
VIEW closeDrawer() clears activeDrawer
VIEW passes drawerData to drawer content
```

### 10.3 Drawer Rendering

```
VIEW renders Sheet when drawer active
VIEW renders drawer title from drawers registry
VIEW renders drawer elements
VIEW closes drawer on Sheet close
```

---

## Phase 11: API Integration (Services)

Test components call services correctly.

### 11.1 Table Data Fetching

```
TABLE calls services.fetch for index endpoint
TABLE uses viewConfig.url as base path
TABLE passes method from api registry
```

### 11.2 Form API Calls

```
FORM calls executeApi on submit
FORM uses "create" endpoint when no id (POST)
FORM uses "update" endpoint when id present (PATCH)
FORM interpolates :id in path
```

### 11.3 Row Action API Calls

```
Row action with api="destroy" calls DELETE endpoint
Row action interpolates :id from row data
Row action invalidates table queries on success
```

### 11.4 Notifications

```
API success shows toast with notification.success message
API error shows toast with notification.error message
Toast uses translated message
```

### 11.5 Confirmation

```
Action with confirm shows confirm dialog
Confirm cancel prevents API call
Confirm accept proceeds with API call
```

---

## Phase 12: Full Page Integration (contacts_index)

Test complete page renders and functions.

### 12.1 Initial Render

```
Page renders translated title "Contacts"
Page renders translated description
Page renders "New Contact" action button
Page renders "Actions" dropdown
Table renders all column headers
```

### 12.2 Table Data Flow

```
Table fetches data from /api/v1/workspaces/contacts
Table renders contact rows
Table shows search input with placeholder
```

### 12.3 New Contact Flow

```
Click "New Contact" opens new_drawer
Drawer title shows "New Contact"
Form renders empty input fields
Form renders all field groups (Basic Info, Professional, Personal)
Click Save calls POST to base URL
Success shows toast "Contact created successfully"
```

### 12.4 View Contact Flow

```
Click table row opens view_drawer
Drawer title shows "View Contact"
Drawer displays contact data in read-only mode
No input fields present in view drawer
```

### 12.5 Edit Contact Flow

```
Click row action menu
Click "Edit" opens edit_drawer
Drawer title shows "Edit Contact"
Form fields pre-populated with row data
Click Save calls PATCH to /:id
Success shows toast "Contact updated successfully"
```

### 12.6 Delete Contact Flow

```
Click row action menu
Click "Delete" shows confirm dialog
Confirm calls DELETE to /:id
Success shows toast "Contact deleted successfully"
Table refreshes after delete
```

---

## Phase 13: RELATIONSHIP_PICKER (Multi-Layer)

Test nested drawer interactions.

### 13.1 Picker Element

```
RELATIONSHIP_PICKER renders in form
RELATIONSHIP_PICKER shows selected items table
RELATIONSHIP_PICKER has "Add" button
```

### 13.2 Picker Drawer (Layer 2)

```
Click Add opens picker drawer
Picker drawer shows searchable table
Picker table shows columns from schema
Picker allows row selection
Confirm button adds selected items
```

### 13.3 Create Drawer (Layer 3)

```
Picker has "Create New" button
Click Create New opens create drawer
Create drawer renders form from template
Submit creates new item
New item auto-selected in picker
Create drawer closes after submit
```

### 13.4 Selection Management

```
Selected items display in main form
Remove button removes item from selection
cardinality="one" allows single selection
cardinality="many" allows multiple selection
```

---

## Phase 14: FORM_ARRAY (Dynamic Fields)

Test repeatable field groups.

### 14.1 Array Rendering

```
FORM_ARRAY renders template for each array item
FORM_ARRAY renders empty state when array empty
FORM_ARRAY renders add button with addLabel
```

### 14.2 Array Manipulation

```
Click add button adds new item from template
Each item has remove button
Click remove removes item from array
Item indices update after removal
```

### 14.3 Array Data

```
Array field values included in form submission
Array maintains item identity across re-renders
```

---

## Phase 15: DISPLAY_ARRAY (Read-Only Arrays)

Test array display in show context.

### 15.1 Array Display

```
DISPLAY_ARRAY renders template for each item
DISPLAY_ARRAY renders label/title
DISPLAY_ARRAY handles empty array
```

### 15.2 Nested Displays

```
Each array item renders display components
Display components receive item data
```

---

## Phase 16: MULTISTEP Form (Wizard)

Test multi-step form navigation.

### 16.1 Step Rendering

```
MULTISTEP renders STEP children
MULTISTEP shows only active step content
MULTISTEP renders step indicators
```

### 16.2 Step Navigation

```
Next button advances to next step
Previous button returns to previous step
Previous disabled on first step
Submit appears on final step
```

### 16.3 Step Validation

```
Cannot advance if current step invalid
Step indicator shows completed state
```

---

## Phase 17: Translations

Test i18n throughout.

### 17.1 View Translations

```
t() returns translation for key
t() returns key as fallback when missing
Locale switch updates all translations
```

### 17.2 Translation Contexts

```
views namespace for UI labels
schemas namespace for field labels
common namespace for shared terms
```

### 17.3 French Locale

```
Page renders French title when locale=fr
Form labels in French
Action labels in French
```

---

## Phase 18: Edge Cases

### 18.1 Error Handling

```
Unknown component type logs warning
Unknown input kind logs warning
Unknown display kind logs warning
Missing component doesn't crash renderer
```

### 18.2 Empty States

```
Table with no columns renders
Form with no elements renders
Drawer with no elements renders
```

### 18.3 Null Data

```
Display handles undefined value
Input handles undefined initial value
Table handles undefined data
```

---

## Test File Organization

```
__tests__/
  integrations/
    phase-01-resolver.test.ts
    phase-02-displays.test.tsx
    phase-03-inputs.test.tsx
    phase-04-primitives.test.tsx
    phase-05-layouts.test.tsx
    phase-06-renderer.test.tsx
    phase-07-page.test.tsx
    phase-08-table.test.tsx
    phase-09-form.test.tsx
    phase-10-view.test.tsx
    phase-11-api.test.tsx
    phase-12-full-page.test.tsx
    phase-13-relationship-picker.test.tsx
    phase-14-form-array.test.tsx
    phase-15-display-array.test.tsx
    phase-16-multistep.test.tsx
    phase-17-translations.test.tsx
    phase-18-edge-cases.test.tsx
    test-utils.tsx
  mocks/
    views/
      contacts_index.json
      contacts_form.json
      contacts_show.json
    data.json
```

---

## Test Utils Requirements

```tsx
// Required exports
export function createMockServices(overrides?)  // Factory for UIServices
export function createTestQueryClient()         // QueryClient for React Query
export function TestWrapper({ children, ...})   // Full provider wrapper
export function PageRenderer()                  // Renders full contacts_index schema

// Schema helpers
export const schema                             // Full VIEW schema
export const pageSchema                         // PAGE element
export const tableSchema                        // TABLE element
export const getApiRegistry()                   // API endpoints
export const getDrawersRegistry()               // Drawer definitions
export const getTranslations()                  // i18n map

// Data
export const data                               // Mock contact items
```

---

## Query Patterns (React Testing Library)

```tsx
// By role (preferred)
screen.getByRole('button', { name: 'Save' })
screen.getByRole('textbox', { name: 'First Name' })
screen.getByRole('heading', { name: 'Contacts' })
screen.getByRole('table')
screen.getByRole('row')
screen.getByRole('checkbox')
screen.getByRole('combobox')

// By label (for form fields)
screen.getByLabelText('Email')

// By text (for content)
screen.getByText('John')
screen.getByText('No results.')

// By test-id (escape hatch for drawers)
screen.getByTestId('drawer-new_drawer')
screen.getByTestId('table-renderer')
screen.getByTestId('form-renderer')

// By placeholder
screen.getByPlaceholderText('Search contacts...')

// Queries for absence
screen.queryByRole('textbox')  // returns null if not found
screen.queryByText('Error')

// Async queries
await screen.findByText('John')  // waits for element
await waitFor(() => expect(...))
```

---

## User Event Patterns

```tsx
const user = userEvent.setup();

// Clicks
await user.click(button);
await user.dblClick(element);

// Typing
await user.type(input, "Hello");
await user.clear(input);

// Selection
await user.selectOptions(select, "option-value");

// Keyboard
await user.keyboard("{Enter}");
await user.tab();

// Hover (for dropdowns)
await user.hover(element);
```
