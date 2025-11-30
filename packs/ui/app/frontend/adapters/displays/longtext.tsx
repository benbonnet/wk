import type { DisplayComponentProps } from "./types";

export function DisplayLongtext({ value, isEmpty, emptyState }: DisplayComponentProps) {
  return (
    <p className="text-sm whitespace-pre-wrap">
      {isEmpty ? emptyState : String(value)}
    </p>
  );
}
