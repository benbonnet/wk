import type { DisplayComponentProps } from "./types";

export function DisplayBoolean({ value }: DisplayComponentProps) {
  const boolValue = value ? "Yes" : "No";
  return <p className="text-sm">{boolValue}</p>;
}
