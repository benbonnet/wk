import type { ComponentType, ReactNode } from "react";
import type {
  UISchema,
  UISchemaColumn,
  Option,
  Rule,
  TranslationsMap,
} from "./types";

// ============================================
// COMPONENT PROPS CONTRACTS
// ============================================

export interface BaseComponentProps {
  schema: UISchema;
  data?: Record<string, unknown>;
  children?: ReactNode;
}

export interface PageProps extends BaseComponentProps {
  title?: string;
  description?: string;
  actions?: UISchema[];
}

export interface DrawerProps extends BaseComponentProps {
  title?: string;
  description?: string;
  open?: boolean;
  onClose?: () => void;
}

export interface FormProps extends BaseComponentProps {
  action?: string;
  onSubmit?: (data: Record<string, unknown>) => void | Promise<void>;
  defaultValues?: Record<string, unknown>;
}

export interface TableProps extends BaseComponentProps {
  columns: UISchemaColumn[];
  data?: Record<string, unknown>[];
  searchable?: boolean;
  selectable?: boolean;
  pageSize?: number;
  rowHref?: string;
  rowClick?: { opens?: string };
  rowActions?: { icon?: string; elements: UISchema[] };
  bulkActions?: { elements: UISchema[] };
  onRowClick?: (row: Record<string, unknown>) => void;
}

export interface ShowProps extends BaseComponentProps {
  record?: Record<string, unknown>;
}

export interface GroupProps extends BaseComponentProps {
  label?: string;
}

export interface CardGroupProps extends BaseComponentProps {
  label?: string;
}

export interface MultistepProps extends BaseComponentProps {
  currentStep?: number;
  onStepChange?: (step: number) => void;
}

export interface StepProps extends BaseComponentProps {
  label: string;
  active?: boolean;
}

export interface FormArrayProps extends BaseComponentProps {
  name: string;
  template: UISchema[];
  addLabel?: string;
  removeLabel?: string;
}

export interface DisplayArrayProps extends BaseComponentProps {
  name: string;
  template: UISchema[];
}

export interface AlertProps extends BaseComponentProps {
  label: string;
  color?: "default" | "red" | "green" | "blue" | "yellow";
}

export interface LinkProps extends BaseComponentProps {
  label: string;
  href?: string;
  opens?: string;
  api?: string;
  variant?: "primary" | "secondary" | "ghost" | "destructive";
  icon?: string;
  confirm?: string;
}

export interface ButtonProps extends BaseComponentProps {
  label: string;
  variant?: "primary" | "secondary" | "ghost" | "destructive";
  icon?: string;
  onClick?: () => void;
}

export interface DropdownProps extends BaseComponentProps {
  label?: string;
  icon?: string;
}

export interface OptionProps extends BaseComponentProps {
  label: string;
  href?: string;
  opens?: string;
  api?: string;
  icon?: string;
  confirm?: string;
  variant?: "primary" | "secondary" | "ghost" | "destructive";
}

export interface SearchProps extends BaseComponentProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
}

export interface SubmitProps extends BaseComponentProps {
  label?: string;
}

export interface RelationshipPickerProps extends BaseComponentProps {
  name: string;
  cardinality: "one" | "many";
  relationSchema: string;
  columns?: UISchemaColumn[];
  template?: UISchema[];
  confirmLabel?: string;
  emptyMessage?: string;
}

export interface ComponentProps extends BaseComponentProps {
  name: string;
  kind: string;
  options?: Option[];
  placeholder?: string;
  rules?: Rule[];
}

// ============================================
// INPUT PROPS CONTRACT
// ============================================

export interface InputProps {
  name: string;
  label?: string;
  placeholder?: string;
  helperText?: string;
  options?: Option[];
  rows?: number;
  disabled?: boolean;
  rules?: Rule[];
  value?: unknown;
  onChange?: (value: unknown) => void;
  error?: string;
}

// ============================================
// DISPLAY PROPS CONTRACT
// ============================================

export interface DisplayProps {
  name: string;
  label?: string;
  value?: unknown;
  options?: Option[];
}

// ============================================
// COMPONENT REGISTRIES
// ============================================

export interface ComponentRegistry {
  VIEW: ComponentType<BaseComponentProps>;
  PAGE: ComponentType<PageProps>;
  DRAWER: ComponentType<DrawerProps>;
  FORM: ComponentType<FormProps>;
  TABLE: ComponentType<TableProps>;
  SHOW: ComponentType<ShowProps>;
  ACTIONS: ComponentType<BaseComponentProps>;
  GROUP: ComponentType<GroupProps>;
  CARD_GROUP: ComponentType<CardGroupProps>;
  MULTISTEP: ComponentType<MultistepProps>;
  STEP: ComponentType<StepProps>;
  FORM_ARRAY: ComponentType<FormArrayProps>;
  DISPLAY_ARRAY: ComponentType<DisplayArrayProps>;
  ALERT: ComponentType<AlertProps>;
  LINK: ComponentType<LinkProps>;
  BUTTON: ComponentType<ButtonProps>;
  DROPDOWN: ComponentType<DropdownProps>;
  OPTION: ComponentType<OptionProps>;
  SEARCH: ComponentType<SearchProps>;
  SUBMIT: ComponentType<SubmitProps>;
  COMPONENT: ComponentType<ComponentProps>;
  RELATIONSHIP_PICKER: ComponentType<RelationshipPickerProps>;
}

export interface InputRegistry {
  INPUT_TEXT: ComponentType<InputProps>;
  INPUT_TEXTAREA: ComponentType<InputProps>;
  INPUT_SELECT: ComponentType<InputProps>;
  INPUT_CHECKBOX: ComponentType<InputProps>;
  INPUT_CHECKBOXES: ComponentType<InputProps>;
  INPUT_RADIOS: ComponentType<InputProps>;
  INPUT_DATE: ComponentType<InputProps>;
  INPUT_DATETIME: ComponentType<InputProps>;
  INPUT_TAGS: ComponentType<InputProps>;
  INPUT_AI_RICH_TEXT: ComponentType<InputProps>;
}

export interface DisplayRegistry {
  DISPLAY_TEXT: ComponentType<DisplayProps>;
  DISPLAY_LONGTEXT: ComponentType<DisplayProps>;
  DISPLAY_NUMBER: ComponentType<DisplayProps>;
  DISPLAY_DATE: ComponentType<DisplayProps>;
  DISPLAY_DATETIME: ComponentType<DisplayProps>;
  DISPLAY_BADGE: ComponentType<DisplayProps>;
  DISPLAY_TAGS: ComponentType<DisplayProps>;
  DISPLAY_BOOLEAN: ComponentType<DisplayProps>;
  DISPLAY_SELECT: ComponentType<DisplayProps>;
}

// ============================================
// SERVICES
// ============================================

export interface UIServices {
  fetch: (url: string, options?: RequestInit) => Promise<Response>;
  navigate: (path: string) => void;
  toast: (message: string, type: "success" | "error") => void;
  confirm: (message: string) => Promise<boolean>;
}

// ============================================
// CONTEXT VALUE
// ============================================

export interface UIContextValue {
  components: ComponentRegistry;
  inputs: InputRegistry;
  displays: DisplayRegistry;
  services: UIServices;
  translations?: TranslationsMap;
  locale: string;
  t: (key: string, namespace?: string) => string;
}
