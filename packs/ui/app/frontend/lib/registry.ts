import type { ReactNode } from "react";
import type { UISchema, UISchemaColumn, Option, Rule } from "./types";

// ============================================
// BASE PROPS
// ============================================

export interface BaseProps {
  className?: string;
  disabled?: boolean;
  children?: ReactNode;
  data?: Record<string, unknown>;
}

// ============================================
// INPUT PROPS
// ============================================

export interface InputProps extends BaseProps {
  name: string;
  label?: string;
  placeholder?: string;
  helperText?: string;
  options?: Option[];
  rows?: number;
  rules?: Rule[];
}

// ============================================
// DISPLAY PROPS
// ============================================

export interface DisplayProps extends BaseProps {
  name: string;
  label?: string;
  options?: Option[];
}

// ============================================
// LAYOUT PROPS
// ============================================

export interface ViewProps extends BaseProps {
  url?: string;
  api?: Record<string, { method: string; path: string }>;
  drawers?: Record<string, { title?: string; elements?: UISchema[] }>;
}

export interface PageProps extends BaseProps {
  title?: string;
  description?: string;
  actions?: UISchema[];
}

export interface DrawerProps extends BaseProps {
  title?: string;
  description?: string;
  open?: boolean;
  onClose?: () => void;
}

export interface FormProps extends BaseProps {
  action?: string;
  use_record?: boolean;
  notification?: { success?: string; error?: string };
  onSubmit?: (data: Record<string, unknown>) => void | Promise<void>;
  defaultValues?: Record<string, unknown>;
}

export interface TableProps extends BaseProps {
  columns?: UISchemaColumn[];
  searchable?: boolean;
  selectable?: boolean;
  pageSize?: number;
  rowHref?: string;
  rowClick?: { opens?: string };
  rowActions?: { icon?: string; elements: UISchema[] };
  bulkActions?: { elements: UISchema[] };
  onRowClick?: (row: Record<string, unknown>) => void;
  search_placeholder?: string;
  toggle_columns?: boolean;
  page_size?: number;
}

export interface ShowProps extends BaseProps {
  record?: Record<string, unknown>;
}

export interface GroupProps extends BaseProps {
  label?: string;
  name?: string;
}

export interface CardGroupProps extends BaseProps {
  label?: string;
}

export interface MultistepProps extends BaseProps {
  currentStep?: number;
  onStepChange?: (step: number) => void;
}

export interface StepProps extends BaseProps {
  label: string;
  active?: boolean;
}

export interface FormArrayProps extends BaseProps {
  name: string;
  label?: string;
  template?: UISchema[];
  addLabel?: string;
  removeLabel?: string;
}

export interface DisplayArrayProps extends BaseProps {
  name: string;
  label?: string;
  template?: UISchema[];
}

export interface AlertProps extends BaseProps {
  label: string;
  color?: "default" | "red" | "green" | "blue" | "yellow";
}

export type ActionsProps = BaseProps;

// ============================================
// PRIMITIVE PROPS
// ============================================

export interface LinkProps extends BaseProps {
  label: string;
  href?: string;
  opens?: string;
  api?: string;
  variant?: "primary" | "secondary" | "ghost" | "destructive";
  icon?: string;
  confirm?: string;
  notification?: { success?: string; error?: string };
}

export interface ButtonProps extends BaseProps {
  label: string;
  variant?: "primary" | "secondary" | "ghost" | "destructive";
  icon?: string;
  onClick?: () => void;
}

export interface DropdownProps extends BaseProps {
  label?: string;
  icon?: string;
  elements?: UISchema[];
}

export interface OptionProps extends BaseProps {
  label: string;
  href?: string;
  opens?: string;
  api?: string;
  icon?: string;
  confirm?: string;
  variant?: "primary" | "secondary" | "ghost" | "destructive";
}

export interface SearchProps extends BaseProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
}

export interface SubmitProps extends BaseProps {
  label?: string;
  loadingLabel?: string;
}

export interface RelationshipPickerProps extends BaseProps {
  name: string;
  cardinality: "one" | "many";
  relationSchema: string;
  columns?: UISchemaColumn[];
  template?: UISchema[];
  confirmLabel?: string;
  emptyMessage?: string;
}

// ============================================
// SERVICES
// ============================================

export interface UIServices {
  fetch: (url: string, options?: RequestInit) => Promise<Response>;
  navigate: (path: string) => void;
  toast: (
    message: string | { type: string; message: string },
    type?: "success" | "error",
  ) => void;
  confirm: (message: string) => Promise<boolean>;
}

// ============================================
// CONTEXT VALUE
// ============================================

export interface UIContextValue {
  services: UIServices;
  translations?: Record<string, Record<string, string>>;
  locale: string;
  t: (key: string, namespace?: string) => string;
}
