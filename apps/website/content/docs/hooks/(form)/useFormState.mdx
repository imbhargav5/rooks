---
id: useFormState
title: useFormState
sidebar_label: useFormState
---

## About

React hook for comprehensive form state management with validation and error handling. Manages form values, errors, touched state, and submission.

## Installation

```bash
npm install rooks
```

## Usage

```jsx
import { useFormState } from "rooks";

interface LoginForm {
  email: string;
  password: string;
  remember: boolean;
}

function LoginComponent() {
  const {
    values,
    errors,
    touched,
    isSubmitting,
    isValid,
    handleChange,
    handleSubmit,
    reset,
  } = useFormState<LoginForm>({
    initialValues: {
      email: "",
      password: "",
      remember: false,
    },
    validate: (name, value, values) => {
      if (name === "email" && !value.includes("@")) {
        return "Please enter a valid email address";
      }
      if (name === "password" && value.length < 6) {
        return "Password must be at least 6 characters";
      }
      return undefined;
    },
    onSubmit: async (values) => {
      console.log("Form submitted:", values);
      // Perform login
      await loginUser(values);
    },
  });

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Email:</label>
        <input
          name="email"
          type="email"
          value={values.email}
          onChange={handleChange}
        />
        {touched.email && errors.email && (
          <span style={{ color: "red" }}>{errors.email}</span>
        )}
      </div>

      <div>
        <label>Password:</label>
        <input
          name="password"
          type="password"
          value={values.password}
          onChange={handleChange}
        />
        {touched.password && errors.password && (
          <span style={{ color: "red" }}>{errors.password}</span>
        )}
      </div>

      <div>
        <label>
          <input
            name="remember"
            type="checkbox"
            checked={values.remember}
            onChange={handleChange}
          />
          Remember me
        </label>
      </div>

      <button type="submit" disabled={!isValid || isSubmitting}>
        {isSubmitting ? "Logging in..." : "Login"}
      </button>
      <button type="button" onClick={reset}>
        Reset
      </button>
    </form>
  );
}
```

## API

### Options

| Property      | Type                                           | Description                                  |
| ------------- | ---------------------------------------------- | -------------------------------------------- |
| initialValues | `T`                                            | Initial form values                          |
| validate      | `(name, value, values) => string \| undefined` | Validation function for fields               |
| onSubmit      | `(values: T) => void \| Promise<void>`         | Callback when form is submitted with valid data |

### Return Value

Returns an object with the following properties:

| Property         | Type                          | Description                              |
| ---------------- | ----------------------------- | ---------------------------------------- |
| values           | `T`                           | Current form values                      |
| errors           | `Partial<Record<keyof T, string>>` | Validation errors for each field    |
| touched          | `Partial<Record<keyof T, boolean>>` | Touched state for each field       |
| isSubmitting     | `boolean`                     | Whether the form is currently submitting |
| isValid          | `boolean`                     | Whether the form is valid                |
| handleChange     | `(event) => void`             | Handle input change events               |
| handleSubmit     | `(event) => void`             | Handle form submit events                |
| setFieldValue    | `(name, value) => void`       | Set a specific field value               |
| setFieldError    | `(name, error) => void`       | Set a specific field error               |
| setFieldTouched  | `(name, touched) => void`     | Set a specific field as touched          |
| reset            | `() => void`                  | Reset the form to initial values         |

## Features

- **Complete form state** - Values, errors, touched state, and submission status
- **Field validation** - Validate individual fields on change
- **Form validation** - Validate entire form on submit
- **Error tracking** - Per-field error messages
- **Touched tracking** - Know which fields the user has interacted with
- **Async submission** - Support for async onSubmit handlers
- **Programmatic control** - Manually set field values, errors, and touched state
- **TypeScript support** - Full type safety with generics
- **Input type support** - Handles text, checkbox, textarea, and select inputs

## Validation

The validation function receives three parameters:

1. `name` - The field name being validated
2. `value` - The current value of the field
3. `values` - All current form values

Return a string for validation errors, or `undefined` if valid.

```jsx
validate: (name, value, values) => {
  if (name === "password" && value.length < 8) {
    return "Password must be at least 8 characters";
  }
  if (name === "confirmPassword" && value !== values.password) {
    return "Passwords do not match";
  }
  return undefined;
}
```

## Use Cases

- Login/registration forms
- Multi-step forms
- Profile update forms
- Complex forms with cross-field validation
- Forms with async submission
- Forms requiring field-level validation feedback
