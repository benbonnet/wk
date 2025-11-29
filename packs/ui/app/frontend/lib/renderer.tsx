import { useComponents, useInputs, useDisplays } from "./provider";
import { resolveRules } from "./resolver";
import type { UISchema } from "./types";

interface DynamicRendererProps {
  schema: UISchema;
  data?: Record<string, unknown>;
}

export function DynamicRenderer({ schema, data = {} }: DynamicRendererProps) {
  const components = useComponents();

  // Check visibility rules
  const { visible, enabled } = resolveRules(schema.rules, data);
  if (!visible) {
    return null;
  }

  const Component = components[schema.type as keyof typeof components];

  if (!Component) {
    console.warn(`Unknown component type: ${schema.type}`);
    return null;
  }

  // For VIEW type, render children
  if (schema.type === "VIEW") {
    return (
      <Component schema={schema} data={data}>
        {schema.elements?.map((child, index) => (
          <DynamicRenderer key={index} schema={child} data={data} />
        ))}
      </Component>
    );
  }

  // For COMPONENT type, use the COMPONENT adapter which handles FormContext
  if (schema.type === "COMPONENT" && schema.kind) {
    const ComponentAdapter = components["COMPONENT" as keyof typeof components];
    if (ComponentAdapter) {
      return <ComponentAdapter schema={schema} data={data} />;
    }
    // Fallback to ComponentRouter if COMPONENT adapter not registered
    return <ComponentRouter schema={schema} data={data} disabled={!enabled} />;
  }

  // For containers with elements
  if (schema.elements) {
    return (
      <Component schema={schema} data={data}>
        {schema.elements.map((child, index) => (
          <DynamicRenderer key={index} schema={child} data={data} />
        ))}
      </Component>
    );
  }

  // For containers with template (arrays)
  if (schema.template) {
    return (
      <Component schema={schema} data={data}>
        {schema.template.map((child, index) => (
          <DynamicRenderer key={index} schema={child} data={data} />
        ))}
      </Component>
    );
  }

  // Leaf components
  return <Component schema={schema} data={data} />;
}

interface ComponentRouterProps {
  schema: UISchema;
  data?: Record<string, unknown>;
  disabled?: boolean;
}

function ComponentRouter({ schema, data, disabled }: ComponentRouterProps) {
  const inputs = useInputs();
  const displays = useDisplays();

  const kind = schema.kind as string;

  // Route to input component
  if (kind.startsWith("INPUT_")) {
    const InputComponent = inputs[kind as keyof typeof inputs];
    if (!InputComponent) {
      console.warn(`Unknown input kind: ${kind}`);
      return null;
    }

    const value = schema.name && data ? data[schema.name] : undefined;

    return (
      <InputComponent
        name={schema.name || ""}
        label={schema.label}
        placeholder={schema.placeholder}
        helperText={schema.helperText}
        options={schema.options}
        rows={schema.rows}
        rules={schema.rules}
        value={value}
        disabled={disabled}
      />
    );
  }

  // Route to display component
  if (kind.startsWith("DISPLAY_")) {
    const DisplayComponent = displays[kind as keyof typeof displays];
    if (!DisplayComponent) {
      console.warn(`Unknown display kind: ${kind}`);
      return null;
    }

    const value = schema.name && data ? data[schema.name] : undefined;

    return (
      <DisplayComponent
        name={schema.name || ""}
        label={schema.label}
        value={value}
        options={schema.options}
      />
    );
  }

  console.warn(`Unknown kind: ${kind}`);
  return null;
}

export { ComponentRouter };
