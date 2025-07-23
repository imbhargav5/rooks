
# Rooks Code Style Guide

This document provides a comprehensive guide to the coding style, conventions, and best practices used in the Rooks project. Adhering to these guidelines ensures consistency, readability, and maintainability of the codebase.

## Guiding Principles

- **Clarity and Readability:** Code should be easy to understand. Prioritize clear naming and a logical structure.
- **Strict Type Safety:** We leverage TypeScript's strongest features to catch errors at compile time.
- **Consistency:** Following a consistent style across the project makes the code easier to read and maintain.
- **Thorough Testing:** Every hook must have comprehensive tests to ensure it is robust and reliable.

## File Structure

Each new hook should have the following file structure:

```
packages/rooks/
├── src/
│   └── hooks/
│       └── useMyNewHook.ts
└── __tests__/
    └── useMyNewHook.spec.ts
```

## TypeScript Style

We enforce a high level of type safety. The TypeScript configuration has `strict` and `noUncheckedIndexedAccess` set to `true`.

### `type` vs. `interface`

Prefer `type` over `interface` for defining object shapes and function signatures. This helps maintain consistency across the codebase.

**Example:**

```typescript
// Good
type CounterHandler = {
  decrement: () => void;
  increment: () => void;
  reset: () => void;
  value: number;
};

// Bad
interface CounterHandler {
  decrement: () => void;
  increment: () => void;
  reset: () => void;
  value: number;
}
```

### Avoiding `any`

The use of `any` is strictly discouraged. When a hook needs to work with a variety of value types, use generics.

**Example:**

```typescript
function useMyHook<T>(initialValue: T) {
  const [value, setValue] = useState<T>(initialValue);
  // ...
}
```

### Type Guards

For complex types, especially when dealing with unions, use type guards to narrow down the type.

**Example:**

```typescript
function isKeyboardEvent(event: Event): event is KeyboardEvent {
  return "key" in event;
}
```

### Variable and Function Declarations

- Use `const` for variables that are not reassigned.
- Use `let` only when a variable needs to be reassigned.
- Use function declarations (`function myFunction() {}`) for top-level functions.
- Use arrow functions for callbacks and when preserving the `this` context.

### Async/Await

- Use `async/await` for handling asynchronous operations.
- Always wrap `await` calls in `try...catch` blocks to handle potential errors gracefully.

**Example from `useAsyncEffect`:**

```typescript
try {
  return await effectRef.current(shouldContinueEffect);
} catch (error) {
  throw error;
}
```

## React Hook Structure

A typical hook in this project has the following structure:

1.  **Type Definitions:** Define `type` aliases for the hook's return value and any complex parameter types.
2.  **JSDoc:** A detailed JSDoc comment explaining the hook's purpose, parameters, return value, and a link to the documentation.
3.  **Hook Function:** The main function, starting with `use`.
4.  **Export:** The hook is exported using a named export.

### Example: `useCounter`

```typescript
import { useCallback, useState } from "react";

// 1. Type Definition
type CounterHandler = {
  decrement: () => void;
  decrementBy: (amount: number) => void;
  increment: () => void;
  incrementBy: (amount: number) => void;
  reset: () => void;
  value: number;
};

// 2. JSDoc
/**
 * Counter hook
 *
 * @param {number} initialValue The initial value of the counter
 * @returns {handler} A handler to interact with the counter
 * @see https://rooks.vercel.app/docs/hooks/useCounter
 */
// 3. Hook Function
function useCounter(initialValue: number): CounterHandler {
  const [counter, setCounter] = useState(initialValue);

  const incrementBy = useCallback((incrAmount: number) => {
    setCounter((currentCounter) => currentCounter + incrAmount);
  }, []);

  // ... other functions

  return {
    decrement,
    decrementBy,
    increment,
    incrementBy,
    reset,
    value: counter,
  };
}

// 4. Export
export { useCounter };
```

### Commonly Used React Hooks

- **`useState`:** For managing simple state.
- **`useEffect`:** For side effects. Remember to provide a dependency array.
- **`useCallback`:** To memoize functions, especially those passed down to child components.
- **`useMemo`:** To memoize expensive calculations.
- **`useRef`:** To create mutable ref objects.

## Testing

We use `@testing-library/react` for testing our hooks.

### Test Structure

- Tests are located in the `packages/rooks/__tests__` directory.
- Test files are named `useMyHook.spec.ts`.
- Each test file starts with `/** @jest-environment jsdom */`.

### Writing Tests

- **`renderHook`:** Use the `renderHook` function from `@testing-library/react` to test hooks in isolation.
- **`act`:** Wrap any state updates in `act` to ensure that React has processed the updates before you make assertions.
- **Assertions:**
    - Use `expect.hasAssertions()` at the beginning of each test to ensure that at least one assertion is called.
    - Write clear and concise assertions.
- **Mocking:** Use Jest's mocking capabilities (`jest.fn()`, `jest.spyOn()`, etc.) to mock dependencies and track function calls.
- **Fake Timers:** Use `jest.useFakeTimers()` for hooks that involve timeouts or intervals.

### Example Test: `useCounter.spec.ts`

```typescript
/**
 * @jest-environment jsdom
 */
import { renderHook, act } from "@testing-library/react";
import { useCounter } from "@/hooks/useCounter";

describe("useCounter", () => {
  it("should be defined", () => {
    expect.hasAssertions();
    expect(useCounter).toBeDefined();
  });

  it("should increment the value", () => {
    expect.hasAssertions();
    const { result } = renderHook(() => useCounter(0));
    act(() => {
      result.current.increment();
    });
    expect(result.current.value).toBe(1);
  });

  // ... other tests
});
```

## JSDoc Standards

- Every exported hook must have a JSDoc comment.
- The comment should include:
    - A brief description of the hook.
    - `@param` for each parameter.
    - `@returns` for the return value.
    - `@see` with a link to the official documentation page.

**Example:**

```typescript
/**
 * useKey hook
 *
 * Fires a callback on keyboard events like keyDown, keyPress and keyUp
 *
 * @param {TrackedKeyEvents} keys List of keys to listen for. Eg: ["a", "b"]
 * @param {Callback} callback  Callback to fire on keyboard events
 * @param {Options} options Options
 * @see https://rooks.vercel.app/docs/hooks/useKey
 */
```

By following these guidelines, we can maintain a high-quality, consistent, and easy-to-contribute-to codebase.
