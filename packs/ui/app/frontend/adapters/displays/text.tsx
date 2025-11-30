import type { DisplayComponentProps } from "./types";

export function DisplayText({ value, isEmpty, emptyState }: DisplayComponentProps) {
  return <p className="text-sm">{isEmpty ? emptyState : String(value)}</p>;
}
