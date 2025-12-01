import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ConfirmDialog } from "../confirm-dialog";

describe("ConfirmDialog", () => {
  const defaultProps = {
    open: true,
    title: "Confirm this action?",
    description: "This cannot be undone.",
    cancelLabel: "Cancel",
    confirmLabel: "Confirm",
    onConfirm: vi.fn(),
    onCancel: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders title and description when open", () => {
    render(<ConfirmDialog {...defaultProps} />);
    expect(screen.getByText("Confirm this action?")).toBeInTheDocument();
    expect(screen.getByText("This cannot be undone.")).toBeInTheDocument();
  });

  it("renders cancel and confirm buttons with labels", () => {
    render(<ConfirmDialog {...defaultProps} />);
    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Confirm" })).toBeInTheDocument();
  });

  it("calls onConfirm when confirm button clicked", async () => {
    const onConfirm = vi.fn();
    render(<ConfirmDialog {...defaultProps} onConfirm={onConfirm} />);
    await userEvent.click(screen.getByRole("button", { name: "Confirm" }));
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it("calls onCancel when cancel button clicked", async () => {
    const onCancel = vi.fn();
    render(<ConfirmDialog {...defaultProps} onCancel={onCancel} />);
    await userEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(onCancel).toHaveBeenCalled();
  });

  it("does not render when open is false", () => {
    render(<ConfirmDialog {...defaultProps} open={false} />);
    expect(screen.queryByText("Confirm this action?")).not.toBeInTheDocument();
  });

  it("shows alert icon for destructive variant", () => {
    render(<ConfirmDialog {...defaultProps} variant="destructive" />);
    // AlertTriangle icon should be present
    expect(document.querySelector("svg")).toBeInTheDocument();
  });

  it("hides alert icon for default variant", () => {
    render(<ConfirmDialog {...defaultProps} variant="default" />);
    // No icon for default variant
    expect(document.querySelector(".bg-red-100")).not.toBeInTheDocument();
  });
});
