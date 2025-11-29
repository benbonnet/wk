import type { ComponentType } from "react";
import type {
  InputProps,
  DisplayProps,
  ViewProps,
  PageProps,
  DrawerProps,
  FormProps,
  TableProps,
  ShowProps,
  GroupProps,
  CardGroupProps,
  MultistepProps,
  StepProps,
  FormArrayProps,
  DisplayArrayProps,
  AlertProps,
  ActionsProps,
  LinkProps,
  ButtonProps,
  DropdownProps,
  OptionProps,
  SearchProps,
  SubmitProps,
  RelationshipPickerProps,
} from "@ui/lib/ui-renderer/registry";

// Inputs
import { TextInput } from "./text-input";
import { Textarea } from "./textarea";
import { Select } from "./select";
import { Checkbox } from "./checkbox";
import { Checkboxes } from "./checkboxes";
import { Radios } from "./radios";
import { DateInput } from "./date-input";
import { DatetimeInput } from "./datetime-input";
import { TagsInput } from "./tags-input";
import { RichTextInput } from "./rich-text-input";

// Displays
import { TextDisplay } from "./text-display";
import { LongtextDisplay } from "./longtext-display";
import { NumberDisplay } from "./number-display";
import { DateDisplay } from "./date-display";
import { DatetimeDisplay } from "./datetime-display";
import { BadgeDisplay } from "./badge-display";
import { TagsDisplay } from "./tags-display";
import { BooleanDisplay } from "./boolean-display";
import { SelectDisplay } from "./select-display";

// Layouts (simple)
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

// Primitives
import { Button } from "./button";
import { Link } from "./link";
import { Dropdown } from "./dropdown";
import { Option } from "./option";
import { Search } from "./search";
import { Submit } from "./submit";

// Custom (complex components)
import { View } from "./custom/view";
import { Table } from "./custom/table";
import { Form } from "./custom/form";
import { FormArray } from "./custom/form";
import { RelationshipPicker } from "./custom/relationship-picker";

/**
 * Registry mapping schema types (SCREAMING_CASE) to React components (PascalCase)
 * DynamicRenderer uses this to resolve components from schema.type
 */
export const adapterRegistry = {
  // Inputs
  INPUT_TEXT: TextInput as ComponentType<InputProps>,
  INPUT_TEXTAREA: Textarea as ComponentType<InputProps>,
  INPUT_SELECT: Select as ComponentType<InputProps>,
  INPUT_CHECKBOX: Checkbox as ComponentType<InputProps>,
  INPUT_CHECKBOXES: Checkboxes as ComponentType<InputProps>,
  INPUT_RADIOS: Radios as ComponentType<InputProps>,
  INPUT_DATE: DateInput as ComponentType<InputProps>,
  INPUT_DATETIME: DatetimeInput as ComponentType<InputProps>,
  INPUT_TAGS: TagsInput as ComponentType<InputProps>,
  INPUT_AI_RICH_TEXT: RichTextInput as ComponentType<InputProps>,

  // Displays
  DISPLAY_TEXT: TextDisplay as ComponentType<DisplayProps>,
  DISPLAY_LONGTEXT: LongtextDisplay as ComponentType<DisplayProps>,
  DISPLAY_NUMBER: NumberDisplay as ComponentType<DisplayProps>,
  DISPLAY_DATE: DateDisplay as ComponentType<DisplayProps>,
  DISPLAY_DATETIME: DatetimeDisplay as ComponentType<DisplayProps>,
  DISPLAY_BADGE: BadgeDisplay as ComponentType<DisplayProps>,
  DISPLAY_TAGS: TagsDisplay as ComponentType<DisplayProps>,
  DISPLAY_BOOLEAN: BooleanDisplay as ComponentType<DisplayProps>,
  DISPLAY_SELECT: SelectDisplay as ComponentType<DisplayProps>,

  // Layouts
  VIEW: View as ComponentType<ViewProps>,
  PAGE: Page as ComponentType<PageProps>,
  DRAWER: Drawer as ComponentType<DrawerProps>,
  FORM: Form as ComponentType<FormProps>,
  TABLE: Table as ComponentType<TableProps>,
  SHOW: Show as ComponentType<ShowProps>,
  GROUP: Group as ComponentType<GroupProps>,
  CARD_GROUP: CardGroup as ComponentType<CardGroupProps>,
  MULTISTEP: Multistep as ComponentType<MultistepProps>,
  STEP: Step as ComponentType<StepProps>,
  FORM_ARRAY: FormArray as ComponentType<FormArrayProps>,
  DISPLAY_ARRAY: DisplayArray as ComponentType<DisplayArrayProps>,
  ALERT: Alert as ComponentType<AlertProps>,
  ACTIONS: Actions as ComponentType<ActionsProps>,

  // Primitives
  BUTTON: Button as ComponentType<ButtonProps>,
  LINK: Link as ComponentType<LinkProps>,
  DROPDOWN: Dropdown as ComponentType<DropdownProps>,
  OPTION: Option as ComponentType<OptionProps>,
  SEARCH: Search as ComponentType<SearchProps>,
  SUBMIT: Submit as ComponentType<SubmitProps>,
  RELATIONSHIP_PICKER: RelationshipPicker as ComponentType<RelationshipPickerProps>,
} as const;

export type AdapterType = keyof typeof adapterRegistry;
