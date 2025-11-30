import type { DisplayComponentProps } from "./types";

export function DisplaySelect({ value, isEmpty, emptyState, options = [], t }: DisplayComponentProps) {
  if (isEmpty) {
    return <p className="text-sm">{emptyState}</p>;
  }
  const selectedOption = options.find((o) => o.value === value);
  const selectDisplay = selectedOption ? t(selectedOption.label) : String(value);
  return <p className="text-sm">{selectDisplay}</p>;
}
