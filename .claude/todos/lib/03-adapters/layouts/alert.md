# ALERT Adapter

## Purpose

Callout/alert message for user attention. Used for warnings, info, success, and error messages.

## Registry Interface

```ts
export interface AlertProps extends BaseRendererProps {
  label?: string;
  color?: "default" | "red" | "green" | "blue" | "yellow";
}
```

## shadcn Components Used

- `Alert`
- `AlertTitle`
- `AlertDescription`

## Implementation

```tsx
import { Alert, AlertTitle, AlertDescription } from "@ui-components/alert";
import {
  Info,
  AlertTriangle,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import type { AlertProps } from "@ui/registry";

const colorToVariant = {
  default: "default",
  red: "destructive",
  green: "default",
  blue: "default",
  yellow: "default",
} as const;

const colorToIcon = {
  default: Info,
  red: XCircle,
  green: CheckCircle,
  blue: Info,
  yellow: AlertTriangle,
};

const colorToClass = {
  default: "",
  red: "",  // destructive variant handles this
  green: "border-green-500 text-green-700 [&>svg]:text-green-500",
  blue: "border-blue-500 text-blue-700 [&>svg]:text-blue-500",
  yellow: "border-yellow-500 text-yellow-700 [&>svg]:text-yellow-500",
};

export function AlertAdapter({ schema, label, color = "default" }: AlertProps) {
  const alertColor = color || schema.color || "default";
  const Icon = colorToIcon[alertColor];
  const variant = colorToVariant[alertColor];
  const className = colorToClass[alertColor];

  return (
    <Alert variant={variant} className={cn(className, schema.className)}>
      <Icon className="h-4 w-4" />
      {(label || schema.label) && (
        <AlertTitle>{label || schema.label}</AlertTitle>
      )}
      {schema.subtitle && (
        <AlertDescription>{schema.subtitle}</AlertDescription>
      )}
    </Alert>
  );
}
```

## Schema Examples

### Info Alert

```json
{
  "type": "ALERT",
  "label": "Note",
  "subtitle": "This action will notify all team members.",
  "color": "blue"
}
```

### Warning Alert

```json
{
  "type": "ALERT",
  "label": "Warning",
  "subtitle": "You are about to delete this record permanently.",
  "color": "yellow"
}
```

### Error Alert

```json
{
  "type": "ALERT",
  "label": "Error",
  "subtitle": "Unable to save changes. Please try again.",
  "color": "red"
}
```

### Success Alert

```json
{
  "type": "ALERT",
  "label": "Success",
  "subtitle": "Your changes have been saved.",
  "color": "green"
}
```

## Notes

- `default` uses shadcn's default styling
- `red` maps to shadcn's `destructive` variant
- Other colors use custom classes for border/text coloring
- Icon is automatically selected based on color
