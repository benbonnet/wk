import type { DisplayComponentProps } from "./types";

function formatDatetime(dateStr: string): string {
  const date = new Date(dateStr);
  const day = date.getDate();
  const month = date.toLocaleString("en-US", { month: "long" });
  const year = date.getFullYear();
  const time = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  const suffix =
    day === 1 || day === 21 || day === 31
      ? "st"
      : day === 2 || day === 22
        ? "nd"
        : day === 3 || day === 23
          ? "rd"
          : "th";

  return `${month} ${day}${suffix}, ${year} at ${time}`;
}

export function DisplayDatetime({ value, isEmpty, emptyState }: DisplayComponentProps) {
  const datetimeValue = !isEmpty && value ? formatDatetime(value as string) : emptyState;
  return <p className="text-sm">{datetimeValue}</p>;
}
