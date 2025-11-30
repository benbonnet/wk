# Phase 3: Component Registry

## Goal

Define component contracts and registry pattern for dependency injection.

## Files to Create

### 1. packs/ui/app/frontend/lib/registry.ts

```ts
import type { ComponentType, ReactNode } from "react";
import type { UISchemaInterface, Option, UISchemaColumn } from "./types";

// ============================================
// BASE PROPS (all renderers receive these)
// ============================================

export interface BaseRendererProps {
  schema: UISchemaInterface;
  children?: ReactNode;
}

// ============================================
// LAYOUT COMPONENT PROPS
// ============================================

export interface ViewProps extends BaseRendererProps {
  // VIEW is root container
}

export interface PageProps extends BaseRendererProps {
  title?: string;
  description?: string;
  actions?: ReactNode;
}

export interface DrawerProps extends BaseRendererProps {
  title?: string;
  description?: string;
  open?: boolean;
  onClose?: () => void;
}

export interface FormProps extends BaseRendererProps {
  initialValues?: Record<string, unknown>;
  onSubmit?: (values: Record<string, unknown>) => Promise<void>;
  validationSchema?: Record<string, unknown>;
}

export interface TableProps extends BaseRendererProps {
  columns: UISchemaColumn[];
  data?: Array<{ id: string | number; data: Record<string, unknown> }>;
  onRowClick?: (row: unknown) => void;
  searchable?: boolean;
  selectable?: boolean;
  pageSize?: number;
}

export interface ShowProps extends BaseRendererProps {
  data?: Record<string, unknown>;
}

export interface ActionsProps extends BaseRendererProps {}

export interface GroupProps extends BaseRendererProps {
  label?: string;
  subtitle?: string;
  direction?: "HORIZONTAL" | "VERTICAL";
}

export interface CardGroupProps extends BaseRendererProps {
  label?: string;
  subtitle?: string;
}

export interface MultistepProps extends BaseRendererProps {
  // Handles step navigation
}

export interface StepProps extends BaseRendererProps {
  label?: string;
  subtitle?: string;
}

export interface FormArrayProps extends BaseRendererProps {
  name: string;
  addLabel?: string;
  removeLabel?: string;
  template: UISchemaInterface[];
}

export interface DisplayArrayProps extends BaseRendererProps {
  name: string;
  data?: unknown[];
}

export interface AlertProps extends BaseRendererProps {
  label?: string;
  color?: "default" | "red" | "green" | "blue" | "yellow";
}

// ============================================
// PRIMITIVE COMPONENT PROPS
// ============================================

export interface LinkProps extends BaseRendererProps {
  label: string;
  href?: string;
  variant?: "primary" | "secondary" | "ghost" | "destructive";
  icon?: string;
  onClick?: () => void;
}

export interface ButtonProps extends BaseRendererProps {
  label: string;
  variant?: "primary" | "secondary" | "ghost" | "destructive";
  icon?: string;
  onClick?: () => void;
  loading?: boolean;
}

export interface DropdownProps extends BaseRendererProps {
  label?: string;
  searchable?: boolean;
  options: Option[];
}

export interface OptionProps extends BaseRendererProps {
  label: string;
  onClick?: () => void;
  icon?: string;
}

export interface SearchProps extends BaseRendererProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
}

export interface SubmitProps extends BaseRendererProps {
  label?: string;
  loadingLabel?: string;
}

export interface RelationshipPickerProps extends BaseRendererProps {
  name: string;
  cardinality: "one" | "many";
  relationSchema: string;
  columns: UISchemaColumn[];
}

// ============================================
// INPUT COMPONENT PROPS
// ============================================

export interface InputBaseProps {
  name: string;
  label?: string;
  helperText?: string;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  value?: unknown;
  onChange?: (value: unknown) => void;
}

export interface TextInputProps extends InputBaseProps {
  inputType?: "text" | "email" | "tel" | "url" | "password";
}

export interface TextareaProps extends InputBaseProps {
  rows?: number;
}

export interface SelectProps extends InputBaseProps {
  options: Option[];
  searchable?: boolean;
  searchPlaceholder?: string;
}

export interface CheckboxProps extends InputBaseProps {
  checked?: boolean;
}

export interface CheckboxesProps extends InputBaseProps {
  options: Option[];
}

export interface RadiosProps extends InputBaseProps {
  options: Option[];
}

export interface DateInputProps extends InputBaseProps {
  // Date-specific props
}

export interface DateTimeInputProps extends InputBaseProps {
  // DateTime-specific props
}

export interface TagsInputProps extends InputBaseProps {
  value?: string[];
}

export interface RichTextInputProps extends InputBaseProps {
  // AI-assisted rich text
}

// ============================================
// DISPLAY COMPONENT PROPS
// ============================================

export interface DisplayBaseProps {
  name?: string;
  label?: string;
  value?: unknown;
  className?: string;
}

export interface TextDisplayProps extends DisplayBaseProps {}
export interface LongTextDisplayProps extends DisplayBaseProps {}
export interface NumberDisplayProps extends DisplayBaseProps {}
export interface DateDisplayProps extends DisplayBaseProps {}
export interface DateTimeDisplayProps extends DisplayBaseProps {}
export interface BadgeDisplayProps extends DisplayBaseProps {
  options?: Option[];
}
export interface TagsDisplayProps extends DisplayBaseProps {}
export interface BooleanDisplayProps extends DisplayBaseProps {}
export interface SelectDisplayProps extends DisplayBaseProps {
  options?: Option[];
}

// ============================================
// COMPONENT REGISTRY
// ============================================

export interface ComponentRegistry {
  // Layouts (UPPERCASE keys matching UISchemaType)
  VIEW: ComponentType<ViewProps>;
  PAGE: ComponentType<PageProps>;
  DRAWER: ComponentType<DrawerProps>;
  FORM: ComponentType<FormProps>;
  TABLE: ComponentType<TableProps>;
  SHOW: ComponentType<ShowProps>;
  ACTIONS: ComponentType<ActionsProps>;
  GROUP: ComponentType<GroupProps>;
  CARD_GROUP: ComponentType<CardGroupProps>;
  MULTISTEP: ComponentType<MultistepProps>;
  STEP: ComponentType<StepProps>;
  FORM_ARRAY: ComponentType<FormArrayProps>;
  DISPLAY_ARRAY: ComponentType<DisplayArrayProps>;
  ALERT: ComponentType<AlertProps>;

  // Primitives
  LINK: ComponentType<LinkProps>;
  BUTTON: ComponentType<ButtonProps>;
  DROPDOWN: ComponentType<DropdownProps>;
  OPTION: ComponentType<OptionProps>;
  SEARCH: ComponentType<SearchProps>;
  SUBMIT: ComponentType<SubmitProps>;
  COMPONENT: ComponentType<BaseRendererProps>;
  RELATIONSHIP_PICKER: ComponentType<RelationshipPickerProps>;
}

export interface InputRegistry {
  INPUT_TEXT: ComponentType<TextInputProps>;
  INPUT_TEXTAREA: ComponentType<TextareaProps>;
  INPUT_SELECT: ComponentType<SelectProps>;
  INPUT_CHECKBOX: ComponentType<CheckboxProps>;
  INPUT_CHECKBOXES: ComponentType<CheckboxesProps>;
  INPUT_RADIOS: ComponentType<RadiosProps>;
  INPUT_DATE: ComponentType<DateInputProps>;
  INPUT_DATETIME: ComponentType<DateTimeInputProps>;
  INPUT_TAGS: ComponentType<TagsInputProps>;
  INPUT_AI_RICH_TEXT: ComponentType<RichTextInputProps>;
}

export interface DisplayRegistry {
  DISPLAY_TEXT: ComponentType<TextDisplayProps>;
  DISPLAY_LONGTEXT: ComponentType<LongTextDisplayProps>;
  DISPLAY_NUMBER: ComponentType<NumberDisplayProps>;
  DISPLAY_DATE: ComponentType<DateDisplayProps>;
  DISPLAY_DATETIME: ComponentType<DateTimeDisplayProps>;
  DISPLAY_BADGE: ComponentType<BadgeDisplayProps>;
  DISPLAY_TAGS: ComponentType<TagsDisplayProps>;
  DISPLAY_BOOLEAN: ComponentType<BooleanDisplayProps>;
  DISPLAY_SELECT: ComponentType<SelectDisplayProps>;
}

// ============================================
// SERVICES INTERFACE
// ============================================

export interface UIServices {
  fetch: (url: string, options?: RequestInit) => Promise<Response>;
  navigate: (path: string) => void;
  toast: (message: string, type: "success" | "error") => void;
  confirm: (message: string) => Promise<boolean>;
}

// ============================================
// FULL CONTEXT
// ============================================

export interface UIContextValue {
  components: ComponentRegistry;
  inputs: InputRegistry;
  displays: DisplayRegistry;
  services: UIServices;
  t: (namespace: string, key: string) => string;
}
```

## Verification

```bash
npx tsc --noEmit
```
