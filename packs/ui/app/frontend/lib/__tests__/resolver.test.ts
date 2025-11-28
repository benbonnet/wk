import { describe, it, expect } from "vitest";
import { resolveRules } from "../resolver";
import type { Rule } from "../types";

describe("resolveRules", () => {
  describe("with no rules", () => {
    it("returns visible and enabled by default", () => {
      const result = resolveRules(undefined, {});
      expect(result).toEqual({ visible: true, enabled: true });
    });

    it("returns visible and enabled with empty rules array", () => {
      const result = resolveRules([], {});
      expect(result).toEqual({ visible: true, enabled: true });
    });
  });

  describe("HIDE effect", () => {
    it("hides when condition is met", () => {
      const rules: Rule[] = [
        {
          effect: "HIDE",
          conditions: [{ field: "status", operator: "EQ", values: ["draft"] }],
        },
      ];

      const result = resolveRules(rules, { status: "draft" });
      expect(result.visible).toBe(false);
    });

    it("shows when condition is not met", () => {
      const rules: Rule[] = [
        {
          effect: "HIDE",
          conditions: [{ field: "status", operator: "EQ", values: ["draft"] }],
        },
      ];

      const result = resolveRules(rules, { status: "published" });
      expect(result.visible).toBe(true);
    });
  });

  describe("SHOW effect", () => {
    it("shows when condition is met", () => {
      const rules: Rule[] = [
        {
          effect: "SHOW",
          conditions: [{ field: "type", operator: "EQ", values: ["premium"] }],
        },
      ];

      const result = resolveRules(rules, { type: "premium" });
      expect(result.visible).toBe(true);
    });

    it("hides when condition is not met", () => {
      const rules: Rule[] = [
        {
          effect: "SHOW",
          conditions: [{ field: "type", operator: "EQ", values: ["premium"] }],
        },
      ];

      const result = resolveRules(rules, { type: "basic" });
      expect(result.visible).toBe(false);
    });
  });

  describe("DISABLE effect", () => {
    it("disables when condition is met", () => {
      const rules: Rule[] = [
        {
          effect: "DISABLE",
          conditions: [{ field: "locked", operator: "EQ", values: [true] }],
        },
      ];

      const result = resolveRules(rules, { locked: true });
      expect(result.enabled).toBe(false);
    });

    it("keeps enabled when condition is not met", () => {
      const rules: Rule[] = [
        {
          effect: "DISABLE",
          conditions: [{ field: "locked", operator: "EQ", values: [true] }],
        },
      ];

      const result = resolveRules(rules, { locked: false });
      expect(result.enabled).toBe(true);
    });
  });

  describe("ENABLE effect", () => {
    it("enables when condition is met", () => {
      const rules: Rule[] = [
        {
          effect: "ENABLE",
          conditions: [{ field: "active", operator: "EQ", values: [true] }],
        },
      ];

      const result = resolveRules(rules, { active: true });
      expect(result.enabled).toBe(true);
    });

    it("disables when condition is not met", () => {
      const rules: Rule[] = [
        {
          effect: "ENABLE",
          conditions: [{ field: "active", operator: "EQ", values: [true] }],
        },
      ];

      const result = resolveRules(rules, { active: false });
      expect(result.enabled).toBe(false);
    });
  });

  describe("operators", () => {
    describe("EQ", () => {
      it("matches equal values", () => {
        const rules: Rule[] = [
          {
            effect: "HIDE",
            conditions: [{ field: "count", operator: "EQ", values: [5] }],
          },
        ];

        expect(resolveRules(rules, { count: 5 }).visible).toBe(false);
        expect(resolveRules(rules, { count: 10 }).visible).toBe(true);
      });
    });

    describe("NEQ", () => {
      it("matches not equal values", () => {
        const rules: Rule[] = [
          {
            effect: "HIDE",
            conditions: [{ field: "status", operator: "NEQ", values: ["active"] }],
          },
        ];

        expect(resolveRules(rules, { status: "inactive" }).visible).toBe(false);
        expect(resolveRules(rules, { status: "active" }).visible).toBe(true);
      });
    });

    describe("LT", () => {
      it("matches less than", () => {
        const rules: Rule[] = [
          {
            effect: "HIDE",
            conditions: [{ field: "age", operator: "LT", values: [18] }],
          },
        ];

        expect(resolveRules(rules, { age: 16 }).visible).toBe(false);
        expect(resolveRules(rules, { age: 18 }).visible).toBe(true);
        expect(resolveRules(rules, { age: 21 }).visible).toBe(true);
      });
    });

    describe("LTE", () => {
      it("matches less than or equal", () => {
        const rules: Rule[] = [
          {
            effect: "HIDE",
            conditions: [{ field: "score", operator: "LTE", values: [50] }],
          },
        ];

        expect(resolveRules(rules, { score: 49 }).visible).toBe(false);
        expect(resolveRules(rules, { score: 50 }).visible).toBe(false);
        expect(resolveRules(rules, { score: 51 }).visible).toBe(true);
      });
    });

    describe("GT", () => {
      it("matches greater than", () => {
        const rules: Rule[] = [
          {
            effect: "HIDE",
            conditions: [{ field: "quantity", operator: "GT", values: [100] }],
          },
        ];

        expect(resolveRules(rules, { quantity: 101 }).visible).toBe(false);
        expect(resolveRules(rules, { quantity: 100 }).visible).toBe(true);
        expect(resolveRules(rules, { quantity: 50 }).visible).toBe(true);
      });
    });

    describe("GTE", () => {
      it("matches greater than or equal", () => {
        const rules: Rule[] = [
          {
            effect: "HIDE",
            conditions: [{ field: "price", operator: "GTE", values: [1000] }],
          },
        ];

        expect(resolveRules(rules, { price: 1001 }).visible).toBe(false);
        expect(resolveRules(rules, { price: 1000 }).visible).toBe(false);
        expect(resolveRules(rules, { price: 999 }).visible).toBe(true);
      });
    });

    describe("IN", () => {
      it("matches if value is in array", () => {
        const rules: Rule[] = [
          {
            effect: "HIDE",
            conditions: [{ field: "role", operator: "IN", values: ["admin", "superuser"] }],
          },
        ];

        expect(resolveRules(rules, { role: "admin" }).visible).toBe(false);
        expect(resolveRules(rules, { role: "superuser" }).visible).toBe(false);
        expect(resolveRules(rules, { role: "user" }).visible).toBe(true);
      });
    });

    describe("NIN", () => {
      it("matches if value is not in array", () => {
        const rules: Rule[] = [
          {
            effect: "HIDE",
            conditions: [{ field: "status", operator: "NIN", values: ["pending", "draft"] }],
          },
        ];

        expect(resolveRules(rules, { status: "published" }).visible).toBe(false);
        expect(resolveRules(rules, { status: "pending" }).visible).toBe(true);
      });
    });

    describe("NULL", () => {
      it("matches null or undefined", () => {
        const rules: Rule[] = [
          {
            effect: "HIDE",
            conditions: [{ field: "value", operator: "NULL", values: [] }],
          },
        ];

        expect(resolveRules(rules, { value: null }).visible).toBe(false);
        expect(resolveRules(rules, { value: undefined }).visible).toBe(false);
        expect(resolveRules(rules, {}).visible).toBe(false);
        expect(resolveRules(rules, { value: "something" }).visible).toBe(true);
      });
    });

    describe("NNULL", () => {
      it("matches non-null values", () => {
        const rules: Rule[] = [
          {
            effect: "HIDE",
            conditions: [{ field: "data", operator: "NNULL", values: [] }],
          },
        ];

        expect(resolveRules(rules, { data: "exists" }).visible).toBe(false);
        expect(resolveRules(rules, { data: 0 }).visible).toBe(false);
        expect(resolveRules(rules, { data: null }).visible).toBe(true);
        expect(resolveRules(rules, {}).visible).toBe(true);
      });
    });

    describe("CONTAINS", () => {
      it("matches substring", () => {
        const rules: Rule[] = [
          {
            effect: "HIDE",
            conditions: [{ field: "email", operator: "CONTAINS", values: ["@test.com"] }],
          },
        ];

        expect(resolveRules(rules, { email: "user@test.com" }).visible).toBe(false);
        expect(resolveRules(rules, { email: "user@example.com" }).visible).toBe(true);
      });
    });

    describe("EMPTY", () => {
      it("matches empty values", () => {
        const rules: Rule[] = [
          {
            effect: "HIDE",
            conditions: [{ field: "name", operator: "EMPTY", values: [] }],
          },
        ];

        expect(resolveRules(rules, { name: "" }).visible).toBe(false);
        expect(resolveRules(rules, { name: null }).visible).toBe(false);
        expect(resolveRules(rules, {}).visible).toBe(false);
        expect(resolveRules(rules, { name: [] }).visible).toBe(false);
        expect(resolveRules(rules, { name: "John" }).visible).toBe(true);
      });
    });

    describe("NEMPTY", () => {
      it("matches non-empty values", () => {
        const rules: Rule[] = [
          {
            effect: "HIDE",
            conditions: [{ field: "tags", operator: "NEMPTY", values: [] }],
          },
        ];

        expect(resolveRules(rules, { tags: ["a", "b"] }).visible).toBe(false);
        expect(resolveRules(rules, { tags: "value" }).visible).toBe(false);
        expect(resolveRules(rules, { tags: [] }).visible).toBe(true);
        expect(resolveRules(rules, { tags: "" }).visible).toBe(true);
      });
    });
  });

  describe("multiple conditions (AND logic)", () => {
    it("requires all conditions to be true", () => {
      const rules: Rule[] = [
        {
          effect: "HIDE",
          conditions: [
            { field: "status", operator: "EQ", values: ["active"] },
            { field: "type", operator: "EQ", values: ["premium"] },
          ],
        },
      ];

      expect(resolveRules(rules, { status: "active", type: "premium" }).visible).toBe(false);
      expect(resolveRules(rules, { status: "active", type: "basic" }).visible).toBe(true);
      expect(resolveRules(rules, { status: "inactive", type: "premium" }).visible).toBe(true);
    });
  });

  describe("multiple rules", () => {
    it("applies all rules in sequence", () => {
      const rules: Rule[] = [
        {
          effect: "HIDE",
          conditions: [{ field: "hidden", operator: "EQ", values: [true] }],
        },
        {
          effect: "DISABLE",
          conditions: [{ field: "locked", operator: "EQ", values: [true] }],
        },
      ];

      const result = resolveRules(rules, { hidden: true, locked: true });
      expect(result.visible).toBe(false);
      expect(result.enabled).toBe(false);
    });
  });
});
