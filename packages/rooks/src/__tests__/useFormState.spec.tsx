/**
 * @jest-environment jsdom
 */
import { renderHook, act } from "@testing-library/react-hooks";
import { useFormState } from "@/hooks/useFormState";
import { ChangeEvent, FormEvent } from "react";

interface TestForm {
  email: string;
  password: string;
  age: number;
  remember: boolean;
}

describe("useFormState", () => {
  const initialValues: TestForm = {
    email: "",
    password: "",
    age: 0,
    remember: false,
  };

  it("should be defined", () => {
    expect.hasAssertions();
    expect(useFormState).toBeDefined();
  });

  it("should return initial state", () => {
    expect.hasAssertions();
    const { result } = renderHook(() =>
      useFormState({ initialValues })
    );

    expect(result.current.values).toEqual(initialValues);
    expect(result.current.errors).toEqual({});
    expect(result.current.touched).toEqual({});
    expect(result.current.isSubmitting).toBe(false);
    expect(result.current.isValid).toBe(true);
  });

  it("should handle input change", () => {
    expect.hasAssertions();
    const { result } = renderHook(() =>
      useFormState({ initialValues })
    );

    const event = {
      target: { name: "email", value: "test@example.com", type: "text" },
    } as ChangeEvent<HTMLInputElement>;

    act(() => {
      result.current.handleChange(event);
    });

    expect(result.current.values.email).toBe("test@example.com");
    expect(result.current.touched.email).toBe(true);
  });

  it("should handle checkbox input change", () => {
    expect.hasAssertions();
    const { result } = renderHook(() =>
      useFormState({ initialValues })
    );

    const event = {
      target: { name: "remember", checked: true, type: "checkbox" },
    } as ChangeEvent<HTMLInputElement>;

    act(() => {
      result.current.handleChange(event);
    });

    expect(result.current.values.remember).toBe(true);
    expect(result.current.touched.remember).toBe(true);
  });

  it("should validate field on change", () => {
    expect.hasAssertions();
    const validate = jest.fn((name: keyof TestForm, value: any) => {
      if (name === "email" && !value.includes("@")) {
        return "Invalid email";
      }
      return undefined;
    });

    const { result } = renderHook(() =>
      useFormState({ initialValues, validate })
    );

    const event = {
      target: { name: "email", value: "invalid", type: "text" },
    } as ChangeEvent<HTMLInputElement>;

    act(() => {
      result.current.handleChange(event);
    });

    expect(result.current.errors.email).toBe("Invalid email");
    expect(result.current.isValid).toBe(false);
  });

  it("should clear error when field becomes valid", () => {
    expect.hasAssertions();
    const validate = jest.fn((name: keyof TestForm, value: any) => {
      if (name === "email" && !value.includes("@")) {
        return "Invalid email";
      }
      return undefined;
    });

    const { result } = renderHook(() =>
      useFormState({ initialValues, validate })
    );

    // First, set invalid value
    act(() => {
      result.current.handleChange({
        target: { name: "email", value: "invalid", type: "text" },
      } as ChangeEvent<HTMLInputElement>);
    });

    expect(result.current.errors.email).toBe("Invalid email");

    // Then, set valid value
    act(() => {
      result.current.handleChange({
        target: { name: "email", value: "valid@example.com", type: "text" },
      } as ChangeEvent<HTMLInputElement>);
    });

    expect(result.current.errors.email).toBeUndefined();
    expect(result.current.isValid).toBe(true);
  });

  it("should handle form submission", () => {
    expect.hasAssertions();
    const onSubmit = jest.fn();
    const { result } = renderHook(() =>
      useFormState({ initialValues, onSubmit })
    );

    const event = {
      preventDefault: jest.fn(),
    } as unknown as FormEvent<HTMLFormElement>;

    act(() => {
      result.current.handleSubmit(event);
    });

    expect(event.preventDefault).toHaveBeenCalled();
    expect(onSubmit).toHaveBeenCalledWith(initialValues);
  });

  it("should mark all fields as touched on submit", () => {
    expect.hasAssertions();
    const { result } = renderHook(() =>
      useFormState({ initialValues })
    );

    const event = {
      preventDefault: jest.fn(),
    } as unknown as FormEvent<HTMLFormElement>;

    act(() => {
      result.current.handleSubmit(event);
    });

    expect(result.current.touched.email).toBe(true);
    expect(result.current.touched.password).toBe(true);
    expect(result.current.touched.age).toBe(true);
    expect(result.current.touched.remember).toBe(true);
  });

  it("should not submit if form is invalid", () => {
    expect.hasAssertions();
    const onSubmit = jest.fn();
    const validate = (name: keyof TestForm, value: any) => {
      if (name === "email" && !value.includes("@")) {
        return "Invalid email";
      }
      return undefined;
    };

    const { result } = renderHook(() =>
      useFormState({ initialValues, validate, onSubmit })
    );

    const event = {
      preventDefault: jest.fn(),
    } as unknown as FormEvent<HTMLFormElement>;

    act(() => {
      result.current.handleSubmit(event);
    });

    expect(onSubmit).not.toHaveBeenCalled();
    expect(result.current.errors.email).toBe("Invalid email");
  });

  it("should handle async onSubmit", async () => {
    expect.hasAssertions();
    const onSubmit = jest.fn(
      () => new Promise((resolve) => setTimeout(resolve, 100))
    );

    const { result } = renderHook(() =>
      useFormState({ initialValues, onSubmit })
    );

    const event = {
      preventDefault: jest.fn(),
    } as unknown as FormEvent<HTMLFormElement>;

    act(() => {
      result.current.handleSubmit(event);
    });

    expect(result.current.isSubmitting).toBe(true);

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 150));
    });

    expect(result.current.isSubmitting).toBe(false);
  });

  it("should set field value programmatically", () => {
    expect.hasAssertions();
    const { result } = renderHook(() =>
      useFormState({ initialValues })
    );

    act(() => {
      result.current.setFieldValue("email", "test@example.com");
    });

    expect(result.current.values.email).toBe("test@example.com");
  });

  it("should set field error programmatically", () => {
    expect.hasAssertions();
    const { result } = renderHook(() =>
      useFormState({ initialValues })
    );

    act(() => {
      result.current.setFieldError("email", "Custom error");
    });

    expect(result.current.errors.email).toBe("Custom error");
  });

  it("should set field touched programmatically", () => {
    expect.hasAssertions();
    const { result } = renderHook(() =>
      useFormState({ initialValues })
    );

    act(() => {
      result.current.setFieldTouched("email", true);
    });

    expect(result.current.touched.email).toBe(true);

    act(() => {
      result.current.setFieldTouched("email", false);
    });

    expect(result.current.touched.email).toBe(false);
  });

  it("should reset form to initial values", () => {
    expect.hasAssertions();
    const { result } = renderHook(() =>
      useFormState({ initialValues })
    );

    // Make changes
    act(() => {
      result.current.setFieldValue("email", "test@example.com");
      result.current.setFieldError("password", "Error");
      result.current.setFieldTouched("email", true);
    });

    expect(result.current.values.email).toBe("test@example.com");
    expect(result.current.errors.password).toBe("Error");
    expect(result.current.touched.email).toBe(true);

    // Reset
    act(() => {
      result.current.reset();
    });

    expect(result.current.values).toEqual(initialValues);
    expect(result.current.errors).toEqual({});
    expect(result.current.touched).toEqual({});
    expect(result.current.isSubmitting).toBe(false);
  });

  it("should handle multiple validation errors", () => {
    expect.hasAssertions();
    const validate = (name: keyof TestForm, value: any) => {
      if (name === "email" && !value.includes("@")) {
        return "Invalid email";
      }
      if (name === "password" && value.length < 6) {
        return "Password too short";
      }
      return undefined;
    };

    const { result } = renderHook(() =>
      useFormState({ initialValues, validate })
    );

    act(() => {
      result.current.handleChange({
        target: { name: "email", value: "invalid", type: "text" },
      } as ChangeEvent<HTMLInputElement>);
      result.current.handleChange({
        target: { name: "password", value: "123", type: "text" },
      } as ChangeEvent<HTMLInputElement>);
    });

    expect(result.current.errors.email).toBe("Invalid email");
    expect(result.current.errors.password).toBe("Password too short");
    expect(result.current.isValid).toBe(false);
  });

  it("should handle textarea change", () => {
    expect.hasAssertions();
    const { result } = renderHook(() =>
      useFormState({ initialValues })
    );

    const event = {
      target: { name: "password", value: "textarea content", type: "textarea" },
    } as ChangeEvent<HTMLTextAreaElement>;

    act(() => {
      result.current.handleChange(event);
    });

    expect(result.current.values.password).toBe("textarea content");
  });

  it("should handle select change", () => {
    expect.hasAssertions();
    const { result } = renderHook(() =>
      useFormState({ initialValues })
    );

    const event = {
      target: { name: "age", value: "25", type: "select" },
    } as ChangeEvent<HTMLSelectElement>;

    act(() => {
      result.current.handleChange(event);
    });

    expect(result.current.values.age).toBe("25");
  });

  it("should call validate function with all parameters", () => {
    expect.hasAssertions();
    const validate = jest.fn(() => undefined);

    const { result } = renderHook(() =>
      useFormState({ initialValues, validate })
    );

    act(() => {
      result.current.handleChange({
        target: { name: "email", value: "test@example.com", type: "text" },
      } as ChangeEvent<HTMLInputElement>);
    });

    expect(validate).toHaveBeenCalledWith(
      "email",
      "test@example.com",
      expect.objectContaining({ email: "test@example.com" })
    );
  });
});
