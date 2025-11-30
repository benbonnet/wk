// Registry
export { adapterRegistry, type AdapterType, INPUT_TYPES, DISPLAY_TYPES } from "./registry";

// Unified adapters
export { FormikAdapter } from "./formik-adapter";
export { DisplayAdapter } from "./display-adapter";

// Layouts
export {
  Page,
  Drawer,
  Show,
  ShowContext,
  useShowData,
  Group,
  CardGroup,
  Multistep,
  MultistepContext,
  useMultistep,
  Step,
  DisplayArray,
  Alert,
  Actions,
} from "./layouts";

// Primitives
export { Button, Link, Dropdown, Option, Search, Submit } from "./primitives";

// Custom (complex components)
export { View, DrawerContext, ViewContext, useDrawer, useViewConfig } from "./custom/view";
export { Table } from "./custom/table";
export { Form, FormArray } from "./custom/form";
export { RelationshipPicker, RelationshipPickerField } from "./custom/relationship-picker";
