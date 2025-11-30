# Phase 5: Dynamic Renderer

## Goal
Create the core rendering logic that routes UISchema types to components.

## Files to Create

### 1. packs/ui/app/frontend/lib/renderer/index.ts

```ts
export { DynamicRenderer } from "./dynamic-renderer";
export { DynamicResolver } from "./dynamic-resolver";
```

### 2. packs/ui/app/frontend/lib/renderer/dynamic-renderer.tsx

```tsx
import type { JSX } from "react";
import type { UISchemaInterface } from "../types";
import { useComponents, useInputs, useDisplays } from "../provider";
import { DynamicResolver } from "./dynamic-resolver";

interface DynamicRendererProps {
  schema: UISchemaInterface;
}

// Types that handle their own children (don't render elements as React children)
const SELF_CONTAINED_TYPES = ["DROPDOWN", "TABLE"] as const;

export function DynamicRenderer({ schema }: DynamicRendererProps): JSX.Element {
  const components = useComponents();
  const inputs = useInputs();
  const displays = useDisplays();

  const { elements = [], type } = schema;

  // Get component from registry
  const Component = components[type as keyof typeof components];

  if (!Component) {
    return <div className="text-red-600">Unknown type: {type}</div>;
  }

  // COMPONENT type routes to input or display based on kind
  if (type === "COMPONENT") {
    return <ComponentRouter schema={schema} />;
  }

  // Check if type handles its own children
  const isSelfContained = SELF_CONTAINED_TYPES.includes(
    type as (typeof SELF_CONTAINED_TYPES)[number]
  );

  return (
    <DynamicResolver rules={schema.rules}>
      <Component schema={schema}>
        {!isSelfContained &&
          elements.map((element, index) => (
            <DynamicRenderer key={index} schema={element} />
          ))}
      </Component>
    </DynamicResolver>
  );
}

// ============================================
// COMPONENT ROUTER
// ============================================

interface ComponentRouterProps {
  schema: UISchemaInterface;
}

function ComponentRouter({ schema }: ComponentRouterProps): JSX.Element {
  const inputs = useInputs();
  const displays = useDisplays();

  const { kind, name } = schema;

  if (!kind) {
    return <div className="text-red-600">COMPONENT requires kind</div>;
  }

  if (!name) {
    return <div className="text-red-600">COMPONENT requires name</div>;
  }

  // Route based on kind prefix
  if (kind.startsWith("INPUT_")) {
    const InputComponent = inputs[kind as keyof typeof inputs];
    if (!InputComponent) {
      return <div className="text-red-600">Unknown input: {kind}</div>;
    }
    return (
      <InputComponent
        name={name}
        label={schema.label}
        helperText={schema.helperText}
        placeholder={schema.placeholder}
        options={schema.options}
        rows={schema.rows}
      />
    );
  }

  if (kind.startsWith("DISPLAY_")) {
    const DisplayComponent = displays[kind as keyof typeof displays];
    if (!DisplayComponent) {
      return <div className="text-red-600">Unknown display: {kind}</div>;
    }
    return (
      <DisplayComponent
        name={name}
        label={schema.label}
        options={schema.options}
        className={schema.className}
      />
    );
  }

  return <div className="text-red-600">Invalid kind: {kind}</div>;
}
```

### 3. packs/ui/app/frontend/lib/renderer/dynamic-resolver.tsx

```tsx
import type { ReactNode } from "react";
import type { Rule } from "../types";

interface DynamicResolverProps {
  rules?: Rule[];
  children: ReactNode;
}

/**
 * Evaluates visibility/behavior rules for an element.
 * For now, just renders children. Full implementation evaluates conditions.
 */
export function DynamicResolver({
  rules,
  children,
}: DynamicResolverProps): JSX.Element {
  // TODO: Implement rule evaluation against form values
  // For now, always render
  if (!rules || rules.length === 0) {
    return <>{children}</>;
  }

  // Placeholder: evaluate rules
  // const shouldRender = evaluateRules(rules, formValues);
  // if (!shouldRender) return null;

  return <>{children}</>;
}
```

## Verification
```bash
npx tsc --noEmit
```
