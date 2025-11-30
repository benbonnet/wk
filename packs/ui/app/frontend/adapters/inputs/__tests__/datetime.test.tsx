import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Formik, Form } from "formik";
import { InputDatetime } from "../datetime";

const defaultProps = {
  name: "end_at",
  label: "End At",
  t: (key: string) => key,
};

function renderWithFormik(
  initialValue: string = "",
  onSubmit = vi.fn()
) {
  return render(
    <Formik initialValues={{ end_at: initialValue }} onSubmit={onSubmit}>
      {({ values }) => (
        <Form>
          <InputDatetime
            field={{
              name: "end_at",
              value: values.end_at,
              onChange: vi.fn(),
              onBlur: vi.fn(),
            }}
            meta={{ touched: false, error: undefined }}
            helpers={{
              setValue: vi.fn((val) => {
                values.end_at = val;
              }),
              setTouched: vi.fn(),
              setError: vi.fn(),
            }}
            {...defaultProps}
          />
          <button type="submit">Submit</button>
          <div data-testid="form-value">{values.end_at}</div>
        </Form>
      )}
    </Formik>
  );
}

describe("InputDatetime", () => {
  describe("RFC3339 conversion", () => {
    it("converts datetime-local to RFC3339 on change", async () => {
      const user = userEvent.setup();
      const setValue = vi.fn();

      render(
        <Formik initialValues={{ end_at: "" }} onSubmit={vi.fn()}>
          <Form>
            <InputDatetime
              field={{
                name: "end_at",
                value: "",
                onChange: vi.fn(),
                onBlur: vi.fn(),
              }}
              meta={{ touched: false, error: undefined }}
              helpers={{
                setValue,
                setTouched: vi.fn(),
                setError: vi.fn(),
              }}
              {...defaultProps}
            />
          </Form>
        </Formik>
      );

      const input = screen.getByLabelText("End At");
      // datetime-local input value format: 2024-01-15T10:30
      await user.type(input, "2024-01-15T10:30");

      // Should convert to RFC3339: 2024-01-15T10:30:00Z
      expect(setValue).toHaveBeenLastCalledWith("2024-01-15T10:30:00Z");
    });

    it("displays RFC3339 value in datetime-local format", () => {
      render(
        <Formik initialValues={{ end_at: "2024-01-15T10:30:00Z" }} onSubmit={vi.fn()}>
          <Form>
            <InputDatetime
              field={{
                name: "end_at",
                value: "2024-01-15T10:30:00Z",
                onChange: vi.fn(),
                onBlur: vi.fn(),
              }}
              meta={{ touched: false, error: undefined }}
              helpers={{
                setValue: vi.fn(),
                setTouched: vi.fn(),
                setError: vi.fn(),
              }}
              {...defaultProps}
            />
          </Form>
        </Formik>
      );

      const input = screen.getByLabelText("End At") as HTMLInputElement;
      // Should display without seconds and Z: 2024-01-15T10:30
      expect(input.value).toBe("2024-01-15T10:30");
    });

    it("handles RFC3339 with timezone offset", () => {
      render(
        <Formik initialValues={{ end_at: "2024-01-15T10:30:00+02:00" }} onSubmit={vi.fn()}>
          <Form>
            <InputDatetime
              field={{
                name: "end_at",
                value: "2024-01-15T10:30:00+02:00",
                onChange: vi.fn(),
                onBlur: vi.fn(),
              }}
              meta={{ touched: false, error: undefined }}
              helpers={{
                setValue: vi.fn(),
                setTouched: vi.fn(),
                setError: vi.fn(),
              }}
              {...defaultProps}
            />
          </Form>
        </Formik>
      );

      const input = screen.getByLabelText("End At") as HTMLInputElement;
      expect(input.value).toBe("2024-01-15T10:30");
    });

    it("handles empty value", () => {
      render(
        <Formik initialValues={{ end_at: "" }} onSubmit={vi.fn()}>
          <Form>
            <InputDatetime
              field={{
                name: "end_at",
                value: "",
                onChange: vi.fn(),
                onBlur: vi.fn(),
              }}
              meta={{ touched: false, error: undefined }}
              helpers={{
                setValue: vi.fn(),
                setTouched: vi.fn(),
                setError: vi.fn(),
              }}
              {...defaultProps}
            />
          </Form>
        </Formik>
      );

      const input = screen.getByLabelText("End At") as HTMLInputElement;
      expect(input.value).toBe("");
    });

    it("handles undefined value", () => {
      render(
        <Formik initialValues={{ end_at: undefined }} onSubmit={vi.fn()}>
          <Form>
            <InputDatetime
              field={{
                name: "end_at",
                value: undefined,
                onChange: vi.fn(),
                onBlur: vi.fn(),
              }}
              meta={{ touched: false, error: undefined }}
              helpers={{
                setValue: vi.fn(),
                setTouched: vi.fn(),
                setError: vi.fn(),
              }}
              {...defaultProps}
            />
          </Form>
        </Formik>
      );

      const input = screen.getByLabelText("End At") as HTMLInputElement;
      expect(input.value).toBe("");
    });
  });
});
