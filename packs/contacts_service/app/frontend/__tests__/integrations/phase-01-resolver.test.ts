import { describe, it, expect } from "vitest";
import { resolveRules } from "@ui/resolver";
import type { Rule } from "@ui/types";

describe("Phase 1: Resolver - Pure Functions", () => {
  describe("1.1 Basic Operators", () => {
    it("EQ returns true when field equals value", () => {
      const rules: Rule[] = [
        { effect: "HIDE", conditions: [{ field: "status", operator: "EQ", values: ["active"] }] },
      ];
      const result = resolveRules(rules, { status: "active" });
      expect(result.visible).toBe(false);
    });

    it("EQ returns false when field does not equal value", () => {
      const rules: Rule[] = [
        { effect: "HIDE", conditions: [{ field: "status", operator: "EQ", values: ["active"] }] },
      ];
      const result = resolveRules(rules, { status: "inactive" });
      expect(result.visible).toBe(true);
    });

    it("NEQ returns true when field does not equal value", () => {
      const rules: Rule[] = [
        { effect: "HIDE", conditions: [{ field: "status", operator: "NEQ", values: ["active"] }] },
      ];
      const result = resolveRules(rules, { status: "inactive" });
      expect(result.visible).toBe(false);
    });

    it("NEQ returns false when field equals value", () => {
      const rules: Rule[] = [
        { effect: "HIDE", conditions: [{ field: "status", operator: "NEQ", values: ["active"] }] },
      ];
      const result = resolveRules(rules, { status: "active" });
      expect(result.visible).toBe(true);
    });

    it("NULL returns true when field is null", () => {
      const rules: Rule[] = [
        { effect: "HIDE", conditions: [{ field: "name", operator: "NULL", values: [] }] },
      ];
      const result = resolveRules(rules, { name: null });
      expect(result.visible).toBe(false);
    });

    it("NULL returns true when field is undefined", () => {
      const rules: Rule[] = [
        { effect: "HIDE", conditions: [{ field: "name", operator: "NULL", values: [] }] },
      ];
      const result = resolveRules(rules, {});
      expect(result.visible).toBe(false);
    });

    it("NULL returns false when field has value", () => {
      const rules: Rule[] = [
        { effect: "HIDE", conditions: [{ field: "name", operator: "NULL", values: [] }] },
      ];
      const result = resolveRules(rules, { name: "John" });
      expect(result.visible).toBe(true);
    });

    it("NNULL returns true when field has value", () => {
      const rules: Rule[] = [
        { effect: "HIDE", conditions: [{ field: "name", operator: "NNULL", values: [] }] },
      ];
      const result = resolveRules(rules, { name: "John" });
      expect(result.visible).toBe(false);
    });

    it("NNULL returns false when field is null", () => {
      const rules: Rule[] = [
        { effect: "HIDE", conditions: [{ field: "name", operator: "NNULL", values: [] }] },
      ];
      const result = resolveRules(rules, { name: null });
      expect(result.visible).toBe(true);
    });

    it("EMPTY returns true for null value", () => {
      const rules: Rule[] = [
        { effect: "HIDE", conditions: [{ field: "name", operator: "EMPTY", values: [] }] },
      ];
      const result = resolveRules(rules, { name: null });
      expect(result.visible).toBe(false);
    });

    it("EMPTY returns true for empty string", () => {
      const rules: Rule[] = [
        { effect: "HIDE", conditions: [{ field: "name", operator: "EMPTY", values: [] }] },
      ];
      const result = resolveRules(rules, { name: "" });
      expect(result.visible).toBe(false);
    });

    it("EMPTY returns true for empty array", () => {
      const rules: Rule[] = [
        { effect: "HIDE", conditions: [{ field: "tags", operator: "EMPTY", values: [] }] },
      ];
      const result = resolveRules(rules, { tags: [] });
      expect(result.visible).toBe(false);
    });

    it("EMPTY returns false for non-empty value", () => {
      const rules: Rule[] = [
        { effect: "HIDE", conditions: [{ field: "name", operator: "EMPTY", values: [] }] },
      ];
      const result = resolveRules(rules, { name: "John" });
      expect(result.visible).toBe(true);
    });

    it("NEMPTY returns true for non-empty string", () => {
      const rules: Rule[] = [
        { effect: "HIDE", conditions: [{ field: "name", operator: "NEMPTY", values: [] }] },
      ];
      const result = resolveRules(rules, { name: "John" });
      expect(result.visible).toBe(false);
    });

    it("NEMPTY returns true for non-empty array", () => {
      const rules: Rule[] = [
        { effect: "HIDE", conditions: [{ field: "tags", operator: "NEMPTY", values: [] }] },
      ];
      const result = resolveRules(rules, { tags: ["a", "b"] });
      expect(result.visible).toBe(false);
    });

    it("NEMPTY returns false for empty value", () => {
      const rules: Rule[] = [
        { effect: "HIDE", conditions: [{ field: "name", operator: "NEMPTY", values: [] }] },
      ];
      const result = resolveRules(rules, { name: "" });
      expect(result.visible).toBe(true);
    });
  });

  describe("1.2 Numeric Operators", () => {
    it("LT returns true when field is less than value", () => {
      const rules: Rule[] = [
        { effect: "HIDE", conditions: [{ field: "age", operator: "LT", values: [18] }] },
      ];
      const result = resolveRules(rules, { age: 16 });
      expect(result.visible).toBe(false);
    });

    it("LT returns false when field equals value", () => {
      const rules: Rule[] = [
        { effect: "HIDE", conditions: [{ field: "age", operator: "LT", values: [18] }] },
      ];
      const result = resolveRules(rules, { age: 18 });
      expect(result.visible).toBe(true);
    });

    it("LT returns false when field is greater than value", () => {
      const rules: Rule[] = [
        { effect: "HIDE", conditions: [{ field: "age", operator: "LT", values: [18] }] },
      ];
      const result = resolveRules(rules, { age: 25 });
      expect(result.visible).toBe(true);
    });

    it("LTE returns true when field is less than value", () => {
      const rules: Rule[] = [
        { effect: "HIDE", conditions: [{ field: "age", operator: "LTE", values: [18] }] },
      ];
      const result = resolveRules(rules, { age: 16 });
      expect(result.visible).toBe(false);
    });

    it("LTE returns true when field equals value", () => {
      const rules: Rule[] = [
        { effect: "HIDE", conditions: [{ field: "age", operator: "LTE", values: [18] }] },
      ];
      const result = resolveRules(rules, { age: 18 });
      expect(result.visible).toBe(false);
    });

    it("LTE returns false when field is greater than value", () => {
      const rules: Rule[] = [
        { effect: "HIDE", conditions: [{ field: "age", operator: "LTE", values: [18] }] },
      ];
      const result = resolveRules(rules, { age: 25 });
      expect(result.visible).toBe(true);
    });

    it("GT returns true when field is greater than value", () => {
      const rules: Rule[] = [
        { effect: "HIDE", conditions: [{ field: "age", operator: "GT", values: [18] }] },
      ];
      const result = resolveRules(rules, { age: 25 });
      expect(result.visible).toBe(false);
    });

    it("GT returns false when field equals value", () => {
      const rules: Rule[] = [
        { effect: "HIDE", conditions: [{ field: "age", operator: "GT", values: [18] }] },
      ];
      const result = resolveRules(rules, { age: 18 });
      expect(result.visible).toBe(true);
    });

    it("GT returns false when field is less than value", () => {
      const rules: Rule[] = [
        { effect: "HIDE", conditions: [{ field: "age", operator: "GT", values: [18] }] },
      ];
      const result = resolveRules(rules, { age: 16 });
      expect(result.visible).toBe(true);
    });

    it("GTE returns true when field is greater than value", () => {
      const rules: Rule[] = [
        { effect: "HIDE", conditions: [{ field: "age", operator: "GTE", values: [18] }] },
      ];
      const result = resolveRules(rules, { age: 25 });
      expect(result.visible).toBe(false);
    });

    it("GTE returns true when field equals value", () => {
      const rules: Rule[] = [
        { effect: "HIDE", conditions: [{ field: "age", operator: "GTE", values: [18] }] },
      ];
      const result = resolveRules(rules, { age: 18 });
      expect(result.visible).toBe(false);
    });

    it("GTE returns false when field is less than value", () => {
      const rules: Rule[] = [
        { effect: "HIDE", conditions: [{ field: "age", operator: "GTE", values: [18] }] },
      ];
      const result = resolveRules(rules, { age: 16 });
      expect(result.visible).toBe(true);
    });

    it("LT returns false for non-numeric field", () => {
      const rules: Rule[] = [
        { effect: "HIDE", conditions: [{ field: "age", operator: "LT", values: [18] }] },
      ];
      const result = resolveRules(rules, { age: "not a number" });
      expect(result.visible).toBe(true);
    });
  });

  describe("1.3 Collection Operators", () => {
    it("IN returns true when field value is in values array", () => {
      const rules: Rule[] = [
        { effect: "HIDE", conditions: [{ field: "status", operator: "IN", values: ["active", "pending"] }] },
      ];
      const result = resolveRules(rules, { status: "active" });
      expect(result.visible).toBe(false);
    });

    it("IN returns true for second value in array", () => {
      const rules: Rule[] = [
        { effect: "HIDE", conditions: [{ field: "status", operator: "IN", values: ["active", "pending"] }] },
      ];
      const result = resolveRules(rules, { status: "pending" });
      expect(result.visible).toBe(false);
    });

    it("IN returns false when field value is not in values array", () => {
      const rules: Rule[] = [
        { effect: "HIDE", conditions: [{ field: "status", operator: "IN", values: ["active", "pending"] }] },
      ];
      const result = resolveRules(rules, { status: "inactive" });
      expect(result.visible).toBe(true);
    });

    it("NIN returns true when field value is not in values array", () => {
      const rules: Rule[] = [
        { effect: "HIDE", conditions: [{ field: "status", operator: "NIN", values: ["active", "pending"] }] },
      ];
      const result = resolveRules(rules, { status: "inactive" });
      expect(result.visible).toBe(false);
    });

    it("NIN returns false when field value is in values array", () => {
      const rules: Rule[] = [
        { effect: "HIDE", conditions: [{ field: "status", operator: "NIN", values: ["active", "pending"] }] },
      ];
      const result = resolveRules(rules, { status: "active" });
      expect(result.visible).toBe(true);
    });

    it("CONTAINS returns true when string field contains value", () => {
      const rules: Rule[] = [
        { effect: "HIDE", conditions: [{ field: "email", operator: "CONTAINS", values: ["@gmail"] }] },
      ];
      const result = resolveRules(rules, { email: "user@gmail.com" });
      expect(result.visible).toBe(false);
    });

    it("CONTAINS returns false when string field does not contain value", () => {
      const rules: Rule[] = [
        { effect: "HIDE", conditions: [{ field: "email", operator: "CONTAINS", values: ["@gmail"] }] },
      ];
      const result = resolveRules(rules, { email: "user@yahoo.com" });
      expect(result.visible).toBe(true);
    });

    it("CONTAINS returns true when string contains any of multiple values", () => {
      const rules: Rule[] = [
        { effect: "HIDE", conditions: [{ field: "email", operator: "CONTAINS", values: ["@gmail", "@yahoo"] }] },
      ];
      const result = resolveRules(rules, { email: "user@yahoo.com" });
      expect(result.visible).toBe(false);
    });

    it("CONTAINS returns false for non-string field", () => {
      const rules: Rule[] = [
        { effect: "HIDE", conditions: [{ field: "count", operator: "CONTAINS", values: ["5"] }] },
      ];
      const result = resolveRules(rules, { count: 5 });
      expect(result.visible).toBe(true);
    });
  });

  describe("1.4 Rule Effects", () => {
    it("HIDE effect sets visible:false when conditions met", () => {
      const rules: Rule[] = [
        { effect: "HIDE", conditions: [{ field: "hidden", operator: "EQ", values: [true] }] },
      ];
      const result = resolveRules(rules, { hidden: true });
      expect(result.visible).toBe(false);
      expect(result.enabled).toBe(true);
    });

    it("HIDE effect keeps visible:true when conditions not met", () => {
      const rules: Rule[] = [
        { effect: "HIDE", conditions: [{ field: "hidden", operator: "EQ", values: [true] }] },
      ];
      const result = resolveRules(rules, { hidden: false });
      expect(result.visible).toBe(true);
      expect(result.enabled).toBe(true);
    });

    it("SHOW effect sets visible:false when conditions NOT met", () => {
      const rules: Rule[] = [
        { effect: "SHOW", conditions: [{ field: "visible", operator: "EQ", values: [true] }] },
      ];
      const result = resolveRules(rules, { visible: false });
      expect(result.visible).toBe(false);
    });

    it("SHOW effect keeps visible:true when conditions met", () => {
      const rules: Rule[] = [
        { effect: "SHOW", conditions: [{ field: "visible", operator: "EQ", values: [true] }] },
      ];
      const result = resolveRules(rules, { visible: true });
      expect(result.visible).toBe(true);
    });

    it("DISABLE effect sets enabled:false when conditions met", () => {
      const rules: Rule[] = [
        { effect: "DISABLE", conditions: [{ field: "locked", operator: "EQ", values: [true] }] },
      ];
      const result = resolveRules(rules, { locked: true });
      expect(result.enabled).toBe(false);
      expect(result.visible).toBe(true);
    });

    it("DISABLE effect keeps enabled:true when conditions not met", () => {
      const rules: Rule[] = [
        { effect: "DISABLE", conditions: [{ field: "locked", operator: "EQ", values: [true] }] },
      ];
      const result = resolveRules(rules, { locked: false });
      expect(result.enabled).toBe(true);
    });

    it("ENABLE effect sets enabled:false when conditions NOT met", () => {
      const rules: Rule[] = [
        { effect: "ENABLE", conditions: [{ field: "editable", operator: "EQ", values: [true] }] },
      ];
      const result = resolveRules(rules, { editable: false });
      expect(result.enabled).toBe(false);
    });

    it("ENABLE effect keeps enabled:true when conditions met", () => {
      const rules: Rule[] = [
        { effect: "ENABLE", conditions: [{ field: "editable", operator: "EQ", values: [true] }] },
      ];
      const result = resolveRules(rules, { editable: true });
      expect(result.enabled).toBe(true);
    });
  });

  describe("1.5 Multiple Rules and Conditions", () => {
    it("multiple conditions use AND logic - all must match", () => {
      const rules: Rule[] = [
        {
          effect: "HIDE",
          conditions: [
            { field: "role", operator: "EQ", values: ["admin"] },
            { field: "level", operator: "GT", values: [5] },
          ],
        },
      ];
      // Both conditions met
      expect(resolveRules(rules, { role: "admin", level: 10 }).visible).toBe(false);
      // Only first condition met
      expect(resolveRules(rules, { role: "admin", level: 3 }).visible).toBe(true);
      // Only second condition met
      expect(resolveRules(rules, { role: "user", level: 10 }).visible).toBe(true);
      // Neither condition met
      expect(resolveRules(rules, { role: "user", level: 3 }).visible).toBe(true);
    });

    it("multiple rules are processed sequentially", () => {
      const rules: Rule[] = [
        { effect: "HIDE", conditions: [{ field: "a", operator: "EQ", values: [true] }] },
        { effect: "DISABLE", conditions: [{ field: "b", operator: "EQ", values: [true] }] },
      ];
      // Both rules apply
      const result1 = resolveRules(rules, { a: true, b: true });
      expect(result1.visible).toBe(false);
      expect(result1.enabled).toBe(false);

      // Only first rule applies
      const result2 = resolveRules(rules, { a: true, b: false });
      expect(result2.visible).toBe(false);
      expect(result2.enabled).toBe(true);

      // Only second rule applies
      const result3 = resolveRules(rules, { a: false, b: true });
      expect(result3.visible).toBe(true);
      expect(result3.enabled).toBe(false);

      // No rules apply
      const result4 = resolveRules(rules, { a: false, b: false });
      expect(result4.visible).toBe(true);
      expect(result4.enabled).toBe(true);
    });

    it("no rules returns default state (visible:true, enabled:true)", () => {
      const result = resolveRules(undefined, { anything: "value" });
      expect(result.visible).toBe(true);
      expect(result.enabled).toBe(true);
    });

    it("empty rules array returns default state", () => {
      const result = resolveRules([], { anything: "value" });
      expect(result.visible).toBe(true);
      expect(result.enabled).toBe(true);
    });

    it("SHOW does not undo previous HIDE - both effects accumulate", () => {
      const rules: Rule[] = [
        { effect: "HIDE", conditions: [{ field: "hide", operator: "EQ", values: [true] }] },
        { effect: "SHOW", conditions: [{ field: "show", operator: "EQ", values: [true] }] },
      ];
      // HIDE applies (hide=true), SHOW does nothing (show=true met, so no action)
      // Result: hidden because SHOW doesn't restore visibility
      const result1 = resolveRules(rules, { hide: true, show: true });
      expect(result1.visible).toBe(false);

      // HIDE doesn't apply (hide=false), SHOW does nothing (show=true met)
      const result2 = resolveRules(rules, { hide: false, show: true });
      expect(result2.visible).toBe(true);

      // HIDE doesn't apply (hide=false), SHOW hides (show=false, condition NOT met)
      const result3 = resolveRules(rules, { hide: false, show: false });
      expect(result3.visible).toBe(false);

      // Both hide: HIDE applies (hide=true), SHOW also hides (show=false NOT met)
      const result4 = resolveRules(rules, { hide: true, show: false });
      expect(result4.visible).toBe(false);
    });
  });
});
