// Re-export registry
export { adapterRegistry, type AdapterType } from "./registry";

// Inputs
export { TextInput } from "./text-input";
export { Textarea } from "./textarea";
export { Select } from "./select";
export { Checkbox } from "./checkbox";
export { Checkboxes } from "./checkboxes";
export { Radios } from "./radios";
export { DateInput } from "./date-input";
export { DatetimeInput } from "./datetime-input";
export { TagsInput } from "./tags-input";
export { RichTextInput } from "./rich-text-input";

// Displays
export { TextDisplay } from "./text-display";
export { LongtextDisplay } from "./longtext-display";
export { NumberDisplay } from "./number-display";
export { DateDisplay } from "./date-display";
export { DatetimeDisplay } from "./datetime-display";
export { BadgeDisplay } from "./badge-display";
export { TagsDisplay } from "./tags-display";
export { BooleanDisplay } from "./boolean-display";
export { SelectDisplay } from "./select-display";

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
export { Form, FormContext, useFormContext, useField, FormArray } from "./custom/form";
export { RelationshipPicker, RelationshipPickerField } from "./custom/relationship-picker";
