/**
 * Storybook Integration Tests
 *
 * This file tests that all story files are valid and can be imported.
 * For full story testing with interactions, use the Storybook test-runner.
 */

import { describe, it, expect, vi } from "vitest";

// Mock MSW to prevent initialization errors
vi.mock("msw-storybook-addon", () => ({
  initialize: vi.fn(),
  mswLoader: vi.fn(),
}));

describe("Storybook Stories", () => {
  describe("Display Stories", () => {
    it("text-display stories are valid", { timeout: 10000 }, async () => {
      const stories = await import("../displays/text-display.stories");
      expect(stories.default).toBeDefined();
      expect(stories.default.title).toBe("Displays/Text");
      expect(stories.Default).toBeDefined();
      expect(stories.WithLabel).toBeDefined();
    });

    it("longtext-display stories are valid", async () => {
      const stories = await import("../displays/longtext-display.stories");
      expect(stories.default).toBeDefined();
      expect(stories.default.title).toBe("Displays/Longtext");
    });

    it("number-display stories are valid", async () => {
      const stories = await import("../displays/number-display.stories");
      expect(stories.default).toBeDefined();
      expect(stories.default.title).toBe("Displays/Number");
    });

    it("date-display stories are valid", async () => {
      const stories = await import("../displays/date-display.stories");
      expect(stories.default).toBeDefined();
      expect(stories.default.title).toBe("Displays/Date");
    });

    it("datetime-display stories are valid", async () => {
      const stories = await import("../displays/datetime-display.stories");
      expect(stories.default).toBeDefined();
      expect(stories.default.title).toBe("Displays/Datetime");
    });

    it("badge-display stories are valid", async () => {
      const stories = await import("../displays/badge-display.stories");
      expect(stories.default).toBeDefined();
      expect(stories.default.title).toBe("Displays/Badge");
    });

    it("tags-display stories are valid", async () => {
      const stories = await import("../displays/tags-display.stories");
      expect(stories.default).toBeDefined();
      expect(stories.default.title).toBe("Displays/Tags");
    });

    it("boolean-display stories are valid", async () => {
      const stories = await import("../displays/boolean-display.stories");
      expect(stories.default).toBeDefined();
      expect(stories.default.title).toBe("Displays/Boolean");
    });

    it("select-display stories are valid", async () => {
      const stories = await import("../displays/select-display.stories");
      expect(stories.default).toBeDefined();
      expect(stories.default.title).toBe("Displays/Select");
    });
  });

  describe("Input Stories", () => {
    it("text-input stories are valid", async () => {
      const stories = await import("../inputs/text-input.stories");
      expect(stories.default).toBeDefined();
      expect(stories.default.title).toBe("Inputs/Text");
      expect(stories.Default).toBeDefined();
      expect(stories.WithError).toBeDefined();
    });

    it("textarea stories are valid", async () => {
      const stories = await import("../inputs/textarea.stories");
      expect(stories.default).toBeDefined();
      expect(stories.default.title).toBe("Inputs/Textarea");
    });

    it("select stories are valid", async () => {
      const stories = await import("../inputs/select.stories");
      expect(stories.default).toBeDefined();
      expect(stories.default.title).toBe("Inputs/Select");
    });

    it("checkbox stories are valid", async () => {
      const stories = await import("../inputs/checkbox.stories");
      expect(stories.default).toBeDefined();
      expect(stories.default.title).toBe("Inputs/Checkbox");
    });

    it("checkboxes stories are valid", async () => {
      const stories = await import("../inputs/checkboxes.stories");
      expect(stories.default).toBeDefined();
      expect(stories.default.title).toBe("Inputs/Checkboxes");
    });

    it("radios stories are valid", async () => {
      const stories = await import("../inputs/radios.stories");
      expect(stories.default).toBeDefined();
      expect(stories.default.title).toBe("Inputs/Radios");
    });

    it("date-input stories are valid", async () => {
      const stories = await import("../inputs/date-input.stories");
      expect(stories.default).toBeDefined();
      expect(stories.default.title).toBe("Inputs/Date");
    });

    it("datetime-input stories are valid", async () => {
      const stories = await import("../inputs/datetime-input.stories");
      expect(stories.default).toBeDefined();
      expect(stories.default.title).toBe("Inputs/Datetime");
    });

    it("tags-input stories are valid", async () => {
      const stories = await import("../inputs/tags-input.stories");
      expect(stories.default).toBeDefined();
      expect(stories.default.title).toBe("Inputs/Tags");
    });

    it("rich-text-input stories are valid", async () => {
      const stories = await import("../inputs/rich-text-input.stories");
      expect(stories.default).toBeDefined();
      expect(stories.default.title).toBe("Inputs/RichText");
    });
  });

  describe("Layout Stories", () => {
    it("group stories are valid", async () => {
      const stories = await import("../layouts/group.stories");
      expect(stories.default).toBeDefined();
      expect(stories.default.title).toBe("Layouts/Group");
    });

    it("card-group stories are valid", async () => {
      const stories = await import("../layouts/card-group.stories");
      expect(stories.default).toBeDefined();
      expect(stories.default.title).toBe("Layouts/CardGroup");
    });

    it("actions stories are valid", async () => {
      const stories = await import("../layouts/actions.stories");
      expect(stories.default).toBeDefined();
      expect(stories.default.title).toBe("Layouts/Actions");
    });

    it("alert stories are valid", async () => {
      const stories = await import("../layouts/alert.stories");
      expect(stories.default).toBeDefined();
      expect(stories.default.title).toBe("Layouts/Alert");
    });

    it("page stories are valid", async () => {
      const stories = await import("../layouts/page.stories");
      expect(stories.default).toBeDefined();
      expect(stories.default.title).toBe("Layouts/Page");
    });

    it("drawer stories are valid", async () => {
      const stories = await import("../layouts/drawer.stories");
      expect(stories.default).toBeDefined();
      expect(stories.default.title).toBe("Layouts/Drawer");
    });

    it("multistep stories are valid", async () => {
      const stories = await import("../layouts/multistep.stories");
      expect(stories.default).toBeDefined();
      expect(stories.default.title).toBe("Layouts/Multistep");
    });

    it("step stories are valid", async () => {
      const stories = await import("../layouts/step.stories");
      expect(stories.default).toBeDefined();
      expect(stories.default.title).toBe("Layouts/Step");
    });

    it("table stories are valid", async () => {
      const stories = await import("../layouts/table.stories");
      expect(stories.default).toBeDefined();
      expect(stories.default.title).toBe("Layouts/Table");
    });
  });

  describe("Primitive Stories", () => {
    it("button stories are valid", async () => {
      const stories = await import("../primitives/button.stories");
      expect(stories.default).toBeDefined();
      expect(stories.default.title).toBe("Primitives/Button");
      expect(stories.Primary).toBeDefined();
      expect(stories.Secondary).toBeDefined();
    });

    it("link stories are valid", async () => {
      const stories = await import("../primitives/link.stories");
      expect(stories.default).toBeDefined();
      expect(stories.default.title).toBe("Primitives/Link");
    });

    it("search stories are valid", async () => {
      const stories = await import("../primitives/search.stories");
      expect(stories.default).toBeDefined();
      expect(stories.default.title).toBe("Primitives/Search");
    });

    it("dropdown stories are valid", async () => {
      const stories = await import("../primitives/dropdown.stories");
      expect(stories.default).toBeDefined();
      expect(stories.default.title).toBe("Primitives/Dropdown");
    });
  });

  describe("Complex Stories", () => {
    it("relationship-picker stories are valid", async () => {
      const stories = await import("../primitives/relationship-picker.stories");
      expect(stories.default).toBeDefined();
      expect(stories.default.title).toBe("Complex/RelationshipPicker");
    });
  });

  describe("Composition Stories", () => {
    it("form-patterns stories are valid", async () => {
      const stories = await import("@ui/lib/stories/form-patterns.stories");
      expect(stories.default).toBeDefined();
      expect(stories.default.title).toBe("Compositions/Form Patterns");
    });

    it("display-patterns stories are valid", async () => {
      const stories = await import("@ui/lib/stories/display-patterns.stories");
      expect(stories.default).toBeDefined();
      expect(stories.default.title).toBe("Compositions/Display Patterns");
    });

    it("crud-page stories are valid", async () => {
      const stories = await import("@ui/lib/stories/crud-page.stories");
      expect(stories.default).toBeDefined();
      expect(stories.default.title).toBe("Compositions/CRUD Page");
    });
  });
});
