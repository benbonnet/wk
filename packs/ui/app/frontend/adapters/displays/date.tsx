import type { DisplayComponentProps } from "./types";

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const day = date.getDate();
  const month = date.toLocaleString("en-US", { month: "long" });
  const year = date.getFullYear();

  const suffix =
    day === 1 || day === 21 || day === 31
      ? "st"
      : day === 2 || day === 22
        ? "nd"
        : day === 3 || day === 23
          ? "rd"
          : "th";

  return `${month} ${day}${suffix}, ${year}`;
}

export function DisplayDate({ value, isEmpty, emptyState }: DisplayComponentProps) {
  const dateValue = !isEmpty && value ? formatDate(value as string) : emptyState;
  return <p className="text-sm">{dateValue}</p>;
}
