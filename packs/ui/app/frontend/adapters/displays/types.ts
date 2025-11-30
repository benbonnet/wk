export interface Option {
  value: string;
  label: string;
}

export interface DisplayComponentProps {
  value: unknown;
  isEmpty: boolean;
  emptyState: string;
  options?: Option[];
  t: (key: string) => string;
}
