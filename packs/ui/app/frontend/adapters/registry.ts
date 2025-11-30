import type { ComponentType } from "react";

// Unified adapters
import { FormikAdapter } from "./formik-adapter";
import { DisplayAdapter } from "./display-adapter";

// Layouts
import { View } from "./custom/view";
import { Page } from "./page";
import { Drawer } from "./drawer";
import { Show } from "./show";
import { Group } from "./group";
import { CardGroup } from "./card-group";
import { Multistep } from "./multistep";
import { Step } from "./step";
import { DisplayArray } from "./display-array";
import { Alert } from "./alert";
import { Actions } from "./actions";

// Custom (complex)
import { Table } from "./custom/table";
import { Form, FormArray } from "./custom/form";
import { RelationshipPicker } from "./custom/relationship-picker";

// Primitives
import { Button } from "./button";
import { Link } from "./link";
import { Dropdown } from "./dropdown";
import { Option } from "./option";
import { Search } from "./search";
import { Submit } from "./submit";

// =============================================================================
// TYPE CONSTANTS
// =============================================================================

export const INPUT_TYPES = [
  "INPUT_TEXT",
  "INPUT_TEXTAREA",
  "INPUT_SELECT",
  "INPUT_CHECKBOX",
  "INPUT_CHECKBOXES",
  "INPUT_RADIOS",
  "INPUT_DATE",
  "INPUT_DATETIME",
  "INPUT_TAGS",
  "INPUT_AI_RICH_TEXT",
] as const;

export const DISPLAY_TYPES = [
  "DISPLAY_TEXT",
  "DISPLAY_LONGTEXT",
  "DISPLAY_NUMBER",
  "DISPLAY_DATE",
  "DISPLAY_DATETIME",
  "DISPLAY_BADGE",
  "DISPLAY_TAGS",
  "DISPLAY_BOOLEAN",
  "DISPLAY_SELECT",
] as const;

// =============================================================================
// SUB-REGISTRIES (generated)
// =============================================================================

const inputAdapters = Object.fromEntries(
  INPUT_TYPES.map((type) => [type, FormikAdapter])
) as Record<(typeof INPUT_TYPES)[number], typeof FormikAdapter>;

const displayAdapters = Object.fromEntries(
  DISPLAY_TYPES.map((type) => [type, DisplayAdapter])
) as Record<(typeof DISPLAY_TYPES)[number], typeof DisplayAdapter>;

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
