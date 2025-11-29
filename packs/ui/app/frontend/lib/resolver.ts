import type { Rule, Condition, RuleEffect } from "./types";

/**
 * Evaluates a single condition against form data
 */
function evaluateCondition(
  condition: Condition,
  data: Record<string, unknown>,
): boolean {
  const fieldValue = data[condition.field];
  const { operator, values } = condition;

  switch (operator) {
    case "EQ":
      return values.includes(fieldValue as string | number | boolean | null);
    case "NEQ":
      return !values.includes(fieldValue as string | number | boolean | null);
    case "LT":
      return (
        typeof fieldValue === "number" && fieldValue < (values[0] as number)
      );
    case "LTE":
      return (
        typeof fieldValue === "number" && fieldValue <= (values[0] as number)
      );
    case "GT":
      return (
        typeof fieldValue === "number" && fieldValue > (values[0] as number)
      );
    case "GTE":
      return (
        typeof fieldValue === "number" && fieldValue >= (values[0] as number)
      );
    case "IN":
      return values.includes(fieldValue as string | number | boolean | null);
    case "NIN":
      return !values.includes(fieldValue as string | number | boolean | null);
    case "NULL":
      return fieldValue === null || fieldValue === undefined;
    case "NNULL":
      return fieldValue !== null && fieldValue !== undefined;
    case "CONTAINS":
      return (
        typeof fieldValue === "string" &&
        values.some((v) => fieldValue.includes(String(v)))
      );
    case "EMPTY":
      return (
        fieldValue === null ||
        fieldValue === undefined ||
        fieldValue === "" ||
        (Array.isArray(fieldValue) && fieldValue.length === 0)
      );
    case "NEMPTY":
      return (
        fieldValue !== null &&
        fieldValue !== undefined &&
        fieldValue !== "" &&
        (!Array.isArray(fieldValue) || fieldValue.length > 0)
      );
    default:
      return true;
  }
}

/**
 * Evaluates all conditions in a rule (AND logic)
 */
function evaluateRule(rule: Rule, data: Record<string, unknown>): boolean {
  return rule.conditions.every((condition) =>
    evaluateCondition(condition, data),
  );
}

/**
 * Determines the effective state of a field based on rules
 */
export interface ResolvedState {
  visible: boolean;
  enabled: boolean;
}

export function resolveRules(
  rules: Rule[] | undefined,
  data: Record<string, unknown>,
): ResolvedState {
  const state: ResolvedState = {
    visible: true,
    enabled: true,
  };

  if (!rules || rules.length === 0) {
    return state;
  }

  for (const rule of rules) {
    const conditionsMet = evaluateRule(rule, data);

    switch (rule.effect) {
      case "HIDE":
        if (conditionsMet) state.visible = false;
        break;
      case "SHOW":
        if (!conditionsMet) state.visible = false;
        break;
      case "DISABLE":
        if (conditionsMet) state.enabled = false;
        break;
      case "ENABLE":
        if (!conditionsMet) state.enabled = false;
        break;
    }
  }

  return state;
}

/**
 * Hook-friendly wrapper for resolving rules
 */
export function useResolvedState(
  rules: Rule[] | undefined,
  data: Record<string, unknown>,
): ResolvedState {
  return resolveRules(rules, data);
}
