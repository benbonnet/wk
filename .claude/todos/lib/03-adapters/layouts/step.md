# STEP Adapter

## Purpose

Individual step within a MULTISTEP form. Contains fields for that step.

## Registry Interface

```ts
export interface StepProps extends BaseRendererProps {
  label?: string;
  subtitle?: string;
}
```

## shadcn Components Used

- None directly (wrapper div)
- Content styled by parent MULTISTEP

## Implementation

```tsx
import type { StepProps } from "@ui/registry";

export function StepAdapter({ schema, label, subtitle, children }: StepProps) {
  const stepLabel = label || schema.label;
  const stepSubtitle = subtitle || schema.subtitle;

  return (
    <div className={cn("space-y-6", schema.className)}>
      {/* Step Header */}
      {(stepLabel || stepSubtitle) && (
        <div className="space-y-2">
          {stepLabel && (
            <h2 className="text-lg font-semibold">{stepLabel}</h2>
          )}
          {stepSubtitle && (
            <p className="text-sm text-muted-foreground">{stepSubtitle}</p>
          )}
        </div>
      )}

      {/* Step Content */}
      <div className="space-y-4">{children}</div>
    </div>
  );
}
```

## Schema Example

```json
{
  "type": "STEP",
  "label": "Account Details",
  "subtitle": "Set up your login credentials",
  "elements": [
    { "type": "COMPONENT", "name": "username", "kind": "INPUT_TEXT", "label": "Username" },
    { "type": "COMPONENT", "name": "password", "kind": "INPUT_TEXT", "inputType": "password", "label": "Password" },
    { "type": "COMPONENT", "name": "confirm_password", "kind": "INPUT_TEXT", "inputType": "password", "label": "Confirm Password" }
  ]
}
```

## Notes

- Simple wrapper with optional header
- Visibility controlled by parent MULTISTEP
- Can access multistep context via `useMultistep()` hook
