import type { ComponentType } from "react";

// Unified adapters
import { FormikAdapter } from "./formik-adapter";
import { DisplayAdapter } from "./display-adapter";

// Layouts
import { View } from "./custom/view";
import {
  Page,
  Drawer,
  Show,
  Group,
  CardGroup,
  Multistep,
  Step,
  DisplayArray,
  Alert,
  Actions,
} from "./layouts";

// Custom (complex)
import { Table } from "./custom/table";
import { Form, FormArray } from "./custom/form";
import { RelationshipPicker } from "./custom/relationship-picker";

// Primitives
import { Button, Link, Dropdown, Option, Search, Submit } from "./primitives";

// Type constants from inputs/displays
import { INPUT_COMPONENTS } from "./inputs";
import { DISPLAY_COMPONENTS } from "./displays";

// =============================================================================
// TYPE CONSTANTS (derived from component mappings)
// =============================================================================

export const INPUT_TYPES = Object.keys(
  INPUT_COMPONENTS,
) as (keyof typeof INPUT_COMPONENTS)[];
export const DISPLAY_TYPES = Object.keys(
  DISPLAY_COMPONENTS,
) as (keyof typeof DISPLAY_COMPONENTS)[];

// =============================================================================
// SUB-REGISTRIES
// =============================================================================

const inputAdapters = Object.fromEntries(
  INPUT_TYPES.map((type) => [type, FormikAdapter]),
) as Record<keyof typeof INPUT_COMPONENTS, typeof FormikAdapter>;

const displayAdapters = Object.fromEntries(
  DISPLAY_TYPES.map((type) => [type, DisplayAdapter]),
) as Record<keyof typeof DISPLAY_COMPONENTS, typeof DisplayAdapter>;

/** Layouts - structural components */
const layoutAdapters = {
  VIEW: View,
  PAGE: Page,
  DRAWER: Drawer,
  FORM: Form,
  TABLE: Table,
  SHOW: Show,
  GROUP: Group,
  CARD_GROUP: CardGroup,
  MULTISTEP: Multistep,
  STEP: Step,
  FORM_ARRAY: FormArray,
  DISPLAY_ARRAY: DisplayArray,
  ALERT: Alert,
  ACTIONS: Actions,
} as const;

/** Primitives - interactive elements */
const primitiveAdapters = {
  BUTTON: Button,
  LINK: Link,
  DROPDOWN: Dropdown,
  OPTION: Option,
  SEARCH: Search,
  SUBMIT: Submit,
  RELATIONSHIP_PICKER: RelationshipPicker,
} as const;

// =============================================================================
// MERGED REGISTRY
// =============================================================================

export const adapterRegistry = {
  ...inputAdapters,
  ...displayAdapters,
  ...layoutAdapters,
  ...primitiveAdapters,
} as Record<string, ComponentType<any>>;

export type AdapterType = keyof typeof adapterRegistry;
