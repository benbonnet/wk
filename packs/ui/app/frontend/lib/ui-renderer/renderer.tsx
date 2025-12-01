import { adapterRegistry, type AdapterType } from "@ui/adapters/registry";
import { resolveRules } from "./resolver";
import type { UISchema } from "./types";

interface DynamicRendererProps {
  schema: UISchema;
  data?: Record<string, unknown>;
  /** Passthrough prop for parent components like Multistep */
  active?: boolean;
}

/**
 * DynamicRenderer - the bridge between schema and components
 *
 * Takes a schema definition and renders the appropriate component.
 * Schema logic stops here - components receive spread props, not schema.
 */
export function DynamicRenderer({ schema, data = {}, active }: DynamicRendererProps) {
  const { visible, enabled } = resolveRules(schema.rules, data);
  if (!visible) {
    return null;
  }

  const Component = adapterRegistry[schema.type as AdapterType];

  if (!Component) {
    console.warn(`Unknown component type: ${schema.type}`);
    return null;
  }

  // Extract schema fields and spread the rest as props
  // Pass type to unified adapters (InputAdapter, DisplayAdapter)
  const { type, elements, template, rules: _, ...props } = schema;
  void _; // satisfy linter

  // Apply disabled state from rules
  const effectiveProps = enabled ? { ...props, type } : { ...props, type, disabled: true };

  // Pass data for display components to access
  // Don't overwrite schema.data if it exists (e.g., TABLE with inline data)
  const propsWithData = {
    ...effectiveProps,
    data: effectiveProps.data ?? data,
    // Pass through active prop from parent (e.g., Multistep cloning Step children)
    ...(active !== undefined && { active }),
  };

  // For containers with elements - render children
  if (elements) {
    return (
      <Component {...propsWithData} elements={elements}>
        {elements.map((child, index) => (
          <DynamicRenderer key={index} schema={child} data={data} />
        ))}
      </Component>
    );
  }

  // For containers with template (arrays) - pass template, don't render children
  if (template) {
    return <Component {...propsWithData} template={template} />;
  }

  // Leaf components - just spread props
  return <Component {...propsWithData} />;
}
