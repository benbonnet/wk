import { DisplayText } from "./text";
import { DisplayLongtext } from "./longtext";
import { DisplayNumber } from "./number";
import { DisplayDate } from "./date";
import { DisplayDatetime } from "./datetime";
import { DisplayBadge } from "./badge";
import { DisplayTags } from "./tags";
import { DisplayBoolean } from "./boolean";
import { DisplaySelect } from "./select";

export type { DisplayComponentProps } from "./types";

export const DISPLAY_COMPONENTS = {
  DISPLAY_TEXT: DisplayText,
  DISPLAY_LONGTEXT: DisplayLongtext,
  DISPLAY_NUMBER: DisplayNumber,
  DISPLAY_DATE: DisplayDate,
  DISPLAY_DATETIME: DisplayDatetime,
  DISPLAY_BADGE: DisplayBadge,
  DISPLAY_TAGS: DisplayTags,
  DISPLAY_BOOLEAN: DisplayBoolean,
  DISPLAY_SELECT: DisplaySelect,
} as const;

export type DisplayType = keyof typeof DISPLAY_COMPONENTS;
