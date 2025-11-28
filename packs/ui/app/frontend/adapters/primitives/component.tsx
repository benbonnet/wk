import { useInputs, useDisplays } from "@ui/provider";
import { useField } from "../layouts/form";
import { useShowData } from "../layouts/show";
import type { ComponentProps } from "@ui/registry";

/**
 * COMPONENT adapter routes to the appropriate input or display
 * based on the `kind` property in the schema.
 */
export function COMPONENT({
  schema,
  name,
  kind,
  options,
  placeholder,
  rules,
  data,
}: ComponentProps) {
  const inputs = useInputs();
  const displays = useDisplays();
  const showData = useShowData();

  const fieldName = name || schema.name!;
  const fieldKind = kind || schema.kind!;
  const fieldOptions = options || schema.options;
  const fieldPlaceholder = placeholder || schema.placeholder;
  const fieldRules = rules || schema.rules;
  const fieldLabel = schema.label;
  const fieldHelperText = schema.helperText;
  const fieldRows = schema.rows;

  // Check if this is an input or display kind
  const isInput = fieldKind.startsWith("INPUT_");
  const isDisplay = fieldKind.startsWith("DISPLAY_");

  if (isInput) {
    // Use FormContext for inputs
    const field = useField(fieldName);

    const InputComponent = inputs[fieldKind as keyof typeof inputs];
    if (!InputComponent) {
      console.warn(`Unknown input kind: ${fieldKind}`);
      return null;
    }

    return (
      <InputComponent
        name={fieldName}
        label={fieldLabel}
        placeholder={fieldPlaceholder}
        helperText={fieldHelperText}
        options={fieldOptions}
        rows={fieldRows}
        rules={fieldRules}
        value={field.value}
        onChange={field.onChange}
        error={field.error}
        disabled={false}
      />
    );
  }

  if (isDisplay) {
    const DisplayComponent = displays[fieldKind as keyof typeof displays];
    if (!DisplayComponent) {
      console.warn(`Unknown display kind: ${fieldKind}`);
      return null;
    }

    // Get value from ShowContext or passed data
    const value = (data as Record<string, unknown>)?.[fieldName] ?? showData[fieldName];

    return (
      <DisplayComponent
        name={fieldName}
        label={fieldLabel}
        value={value}
        options={fieldOptions}
      />
    );
  }

  console.warn(`Unknown component kind: ${fieldKind}`);
  return null;
}
