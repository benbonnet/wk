import type { DisplayComponentProps } from "./types";

function formatNumber(num: number): string {
  return num.toLocaleString("en-US");
}

export function DisplayNumber({ value, isEmpty, emptyState }: DisplayComponentProps) {
  const numValue = typeof value === "number" ? formatNumber(value) : emptyState;
  return (
    <p className="text-sm font-mono">
      {isEmpty && value !== 0 ? emptyState : numValue}
    </p>
  );
}
