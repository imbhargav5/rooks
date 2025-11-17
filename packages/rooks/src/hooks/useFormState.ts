import { useState, useCallback, ChangeEvent, FormEvent } from "react";

/**
 * Validation function type
 */
type ValidatorFunction<T> = (
  name: keyof T,
  value: any,
  values: T
) => string | undefined;

/**
 * Options for the useFormState hook
 */
interface UseFormStateOptions<T> {
  /**
   * Initial form values
   */
  initialValues: T;
  /**
   * Validation function
   */
  validate?: ValidatorFunction<T>;
  /**
   * Callback when form is submitted with valid data
   */
  onSubmit?: (values: T) => void | Promise<void>;
}

/**
 * Return value for the useFormState hook
 */
interface UseFormStateReturnValue<T> {
  /**
   * Current form values
   */
  values: T;
  /**
   * Validation errors for each field
   */
  errors: Partial<Record<keyof T, string>>;
  /**
   * Touched state for each field
   */
  touched: Partial<Record<keyof T, boolean>>;
  /**
   * Whether the form is currently submitting
   */
  isSubmitting: boolean;
  /**
   * Whether the form is valid
   */
  isValid: boolean;
  /**
   * Handle input change events
   */
  handleChange: (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => void;
  /**
   * Handle form submit events
   */
  handleSubmit: (event: FormEvent<HTMLFormElement>) => void;
  /**
   * Set a specific field value
   */
  setFieldValue: (name: keyof T, value: any) => void;
  /**
   * Set a specific field error
   */
  setFieldError: (name: keyof T, error: string) => void;
  /**
   * Set a specific field as touched
   */
  setFieldTouched: (name: keyof T, touched: boolean) => void;
  /**
   * Reset the form to initial values
   */
  reset: () => void;
}

/**
 * useFormState hook
 *
 * Comprehensive form state management with validation and error handling.
 * Handles form values, errors, touched state, and submission.
 *
 * @param options - Configuration options for the form
 * @returns Object containing form state and handlers
 *
 * @example
 * ```tsx
 * import { useFormState } from "rooks";
 *
 * interface LoginForm {
 *   email: string;
 *   password: string;
 * }
 *
 * function LoginComponent() {
 *   const {
 *     values,
 *     errors,
 *     touched,
 *     isSubmitting,
 *     isValid,
 *     handleChange,
 *     handleSubmit,
 *     reset,
 *   } = useFormState<LoginForm>({
 *     initialValues: { email: "", password: "" },
 *     validate: (name, value, values) => {
 *       if (name === "email" && !value.includes("@")) {
 *         return "Invalid email";
 *       }
 *       if (name === "password" && value.length < 6) {
 *         return "Password must be at least 6 characters";
 *       }
 *     },
 *     onSubmit: async (values) => {
 *       await loginUser(values);
 *     },
 *   });
 *
 *   return (
 *     <form onSubmit={handleSubmit}>
 *       <input
 *         name="email"
 *         value={values.email}
 *         onChange={handleChange}
 *       />
 *       {touched.email && errors.email && <span>{errors.email}</span>}
 *
 *       <input
 *         name="password"
 *         type="password"
 *         value={values.password}
 *         onChange={handleChange}
 *       />
 *       {touched.password && errors.password && <span>{errors.password}</span>}
 *
 *       <button type="submit" disabled={!isValid || isSubmitting}>
 *         {isSubmitting ? "Submitting..." : "Login"}
 *       </button>
 *       <button type="button" onClick={reset}>Reset</button>
 *     </form>
 *   );
 * }
 * ```
 *
 * @see https://rooks.vercel.app/docs/hooks/useFormState
 */
function useFormState<T extends Record<string, any>>({
  initialValues,
  validate,
  onSubmit,
}: UseFormStateOptions<T>): UseFormStateReturnValue<T> {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateField = useCallback(
    (name: keyof T, value: any): string | undefined => {
      if (validate) {
        return validate(name, value, values);
      }
      return undefined;
    },
    [validate, values]
  );

  const validateForm = useCallback((): boolean => {
    if (!validate) {
      return true;
    }

    const newErrors: Partial<Record<keyof T, string>> = {};
    let isValid = true;

    for (const key in values) {
      const error = validate(key as keyof T, values[key], values);
      if (error) {
        newErrors[key as keyof T] = error;
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  }, [validate, values]);

  const isValid = Object.keys(errors).length === 0;

  const handleChange = useCallback(
    (
      event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ): void => {
      const { name, value, type } = event.target;
      const fieldName = name as keyof T;

      // Handle checkbox inputs
      const fieldValue =
        type === "checkbox"
          ? (event.target as HTMLInputElement).checked
          : value;

      setValues((prev) => ({ ...prev, [fieldName]: fieldValue }));
      setTouched((prev) => ({ ...prev, [fieldName]: true }));

      // Validate field
      const error = validateField(fieldName, fieldValue);
      setErrors((prev) => {
        const newErrors = { ...prev };
        if (error) {
          newErrors[fieldName] = error;
        } else {
          delete newErrors[fieldName];
        }
        return newErrors;
      });
    },
    [validateField]
  );

  const handleSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>): void => {
      event.preventDefault();

      // Mark all fields as touched
      const allTouched: Partial<Record<keyof T, boolean>> = {};
      for (const key in values) {
        allTouched[key as keyof T] = true;
      }
      setTouched(allTouched);

      // Validate form
      const formIsValid = validateForm();

      if (formIsValid && onSubmit) {
        setIsSubmitting(true);
        Promise.resolve(onSubmit(values)).finally(() => {
          setIsSubmitting(false);
        });
      }
    },
    [values, validateForm, onSubmit]
  );

  const setFieldValue = useCallback((name: keyof T, value: any): void => {
    setValues((prev) => ({ ...prev, [name]: value }));
  }, []);

  const setFieldError = useCallback((name: keyof T, error: string): void => {
    setErrors((prev) => ({ ...prev, [name]: error }));
  }, []);

  const setFieldTouched = useCallback(
    (name: keyof T, isTouched: boolean): void => {
      setTouched((prev) => ({ ...prev, [name]: isTouched }));
    },
    []
  );

  const reset = useCallback((): void => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    isValid,
    handleChange,
    handleSubmit,
    setFieldValue,
    setFieldError,
    setFieldTouched,
    reset,
  };
}

export { useFormState };
export type {
  UseFormStateOptions,
  UseFormStateReturnValue,
  ValidatorFunction,
};
