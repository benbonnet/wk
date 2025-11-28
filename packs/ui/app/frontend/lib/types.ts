import type { CSSProperties } from "react";

// ============================================
// FIELD KINDS (from inventory.json)
// ============================================

export type InputKind =
  | "INPUT_TEXT"
  | "INPUT_TEXTAREA"
  | "INPUT_SELECT"
  | "INPUT_CHECKBOX"
  | "INPUT_CHECKBOXES"
  | "INPUT_RADIOS"
  | "INPUT_AI_RICH_TEXT"
  | "INPUT_DATE"
  | "INPUT_DATETIME"
  | "INPUT_TAGS";

export type DisplayKind =
  | "DISPLAY_TEXT"
  | "DISPLAY_LONGTEXT"
  | "DISPLAY_NUMBER"
  | "DISPLAY_DATE"
  | "DISPLAY_DATETIME"
  | "DISPLAY_BADGE"
  | "DISPLAY_TAGS"
  | "DISPLAY_BOOLEAN"
  | "DISPLAY_SELECT";

export type KindType = InputKind | DisplayKind | "DROPDOWN";

// ============================================
// UI SCHEMA TYPES
// ============================================

export type UISchemaType =
  // Root containers
  | "VIEW"
  | "FORM"
  | "SHOW"
  | "TABLE"
  // Page layouts
  | "PAGE"
  | "DRAWER"
  | "ACTIONS"
  // Primitives
  | "LINK"
  | "BUTTON"
  | "DROPDOWN"
  | "OPTION"
  | "SEARCH"
  // Layout
  | "MULTISTEP"
  | "STEP"
  | "GROUP"
  | "CARD_GROUP"
  // Form elements
  | "COMPONENT"
  | "FORM_ARRAY"
  | "DISPLAY_ARRAY"
  | "RELATIONSHIP_PICKER"
  | "ALERT"
  | "SUBMIT";

// ============================================
// RULES & CONDITIONS
// ============================================

export type RuleEffect = "HIDE" | "SHOW" | "ENABLE" | "DISABLE";

export type Operator =
  | "EQ"
  | "NEQ"
  | "LT"
  | "LTE"
  | "GT"
  | "GTE"
  | "IN"
  | "NIN"
  | "NULL"
  | "NNULL"
  | "CONTAINS"
  | "EMPTY"
  | "NEMPTY";

export interface Condition {
  field: string;
  operator: Operator;
  values: (string | number | boolean | null | undefined)[];
}

export interface Rule {
  effect: RuleEffect;
  conditions: Condition[];
}

// ============================================
// OPTIONS
// ============================================

export interface Option {
  label: string;
  value: string;
  description?: string;
}

// ============================================
// COLUMN INTERFACE
// ============================================

export interface UISchemaColumn {
  name: string;
  kind: KindType;
  label?: string;
  sortable?: boolean;
  hideable?: boolean;
  filterable?: boolean;
}

// ============================================
// TRANSLATIONS
// ============================================

export interface TranslationsMap {
  schemas: Record<string, Record<string, string>>;
  views: Record<string, Record<string, string>>;
  common: Record<string, string>;
}

export type Translations = Record<string, TranslationsMap>;

// ============================================
// UI SCHEMA INTERFACE
// ============================================

export interface UISchemaInterface {
  type: UISchemaType;
  _ns?: string;

  // Common
  label?: string;
  subtitle?: string;
  helperText?: string;
  className?: string;
  style?: Record<string, CSSProperties>;
  rules?: Rule[];

  // Children
  elements?: UISchemaInterface[];
  template?: UISchemaInterface[];

  // Field
  name?: string;
  kind?: KindType;
  options?: Option[];
  placeholder?: string;
  searchPlaceholder?: string;
  rows?: number;
  inputType?: "text" | "number" | "email" | "tel" | "url" | "password" | "date";

  // Page/Drawer
  title?: string;
  description?: string;
  actions?: UISchemaInterface[];

  // Link/Button
  href?: string;
  variant?: "primary" | "secondary" | "ghost" | "destructive";
  icon?: string;
  opens?: string;
  confirm?: string;
  api?: string | Record<string, { method: string; path: string }>;
  notification?: { success?: string; error?: string; _ns?: string };

  // Table
  columns?: UISchemaColumn[];
  searchable?: boolean;
  selectable?: boolean;
  pageSize?: number;
  rowHref?: string;
  rowClick?: { opens?: string };
  rowActions?: { icon?: string; elements: UISchemaInterface[] };
  bulkActions?: { elements: UISchemaInterface[] };

  // Form
  action?: string;
  use_record?: boolean;
  schema?: Record<string, unknown>;

  // FORM_ARRAY
  addLabel?: string;
  removeLabel?: string;
  loadingLabel?: string;

  // RELATIONSHIP_PICKER
  cardinality?: "one" | "many";
  relationSchema?: string;
  confirmLabel?: string;
  emptyMessage?: string;
  formSchema?: Record<string, unknown>;

  // ALERT
  color?: "default" | "red" | "green" | "blue" | "yellow";

  // VIEW level
  drawers?: Record<
    string,
    {
      title?: string;
      description?: string;
      elements?: UISchemaInterface[];
      _ns?: string;
    }
  >;
  translations?: Translations;
}

export type UISchema = UISchemaInterface;
