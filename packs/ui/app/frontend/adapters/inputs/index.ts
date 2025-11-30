import { InputText } from "./text";
import { InputTextarea } from "./textarea";
import { InputSelect } from "./select";
import { InputCheckbox } from "./checkbox";
import { InputCheckboxes } from "./checkboxes";
import { InputRadios } from "./radios";
import { InputDate } from "./date";
import { InputDatetime } from "./datetime";
import { InputRichText } from "./rich-text";
import { InputTags } from "./tags";

export type { InputComponentProps } from "./types";

export const INPUT_COMPONENTS = {
  INPUT_TEXT: InputText,
  INPUT_TEXTAREA: InputTextarea,
  INPUT_SELECT: InputSelect,
  INPUT_CHECKBOX: InputCheckbox,
  INPUT_CHECKBOXES: InputCheckboxes,
  INPUT_RADIOS: InputRadios,
  INPUT_DATE: InputDate,
  INPUT_DATETIME: InputDatetime,
  INPUT_AI_RICH_TEXT: InputRichText,
  INPUT_TAGS: InputTags,
} as const;

export type InputType = keyof typeof INPUT_COMPONENTS;
