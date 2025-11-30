// Registry
export { adapterRegistry, type AdapterType, INPUT_TYPES, DISPLAY_TYPES } from "./registry";

// Unified adapters
export { FormikAdapter } from "./formik-adapter";
export { DisplayAdapter } from "./display-adapter";

// Layouts
export { Page } from "./page";
export { Drawer } from "./drawer";
export { Show, ShowContext, useShowData } from "./show";
export { Group } from "./group";
export { CardGroup } from "./card-group";
export { Multistep, MultistepContext, useMultistep } from "./multistep";
export { Step } from "./step";
export { DisplayArray } from "./display-array";
export { Alert } from "./alert";
export { Actions } from "./actions";

// Primitives
export { Button } from "./button";
export { Link } from "./link";
export { Dropdown } from "./dropdown";
export { Option } from "./option";
export { Search } from "./search";
export { Submit } from "./submit";

// Custom (complex components)
export { View, DrawerContext, ViewContext, useDrawer, useViewConfig } from "./custom/view";
export { Table } from "./custom/table";
export { Form, FormArray } from "./custom/form";
export { RelationshipPicker, RelationshipPickerField } from "./custom/relationship-picker";
