---
id: usePreferredColorScheme
title: usePreferredColorScheme
sidebar_label: usePreferredColorScheme
---

## About

React hook to detect and track the user's preferred color scheme (dark mode or light mode). Automatically updates when the user changes their system preference.

## Installation

```bash
npm install rooks
```

## Usage

```jsx
import { usePreferredColorScheme } from "rooks";

function ThemeAwareComponent() {
  const { colorScheme, isDark, isLight } = usePreferredColorScheme();

  const styles = {
    backgroundColor: isDark ? "#1a1a1a" : "#ffffff",
    color: isDark ? "#ffffff" : "#000000",
    padding: "20px",
    borderRadius: "8px",
  };

  return (
    <div style={styles}>
      <h1>Theme-Aware Component</h1>
      <p>Current color scheme: <strong>{colorScheme}</strong></p>
      <p>Dark mode: {isDark ? "✓ Enabled" : "✗ Disabled"}</p>
      <p>Light mode: {isLight ? "✓ Enabled" : "✗ Disabled"}</p>
    </div>
  );
}
```

## Return Value

Returns an object with the following properties:

| Property     | Type                                      | Description                                    |
| ------------ | ----------------------------------------- | ---------------------------------------------- |
| colorScheme  | `"light" \| "dark" \| "no-preference" \| null` | The preferred color scheme              |
| isDark       | `boolean`                                 | Whether the preferred scheme is dark           |
| isLight      | `boolean`                                 | Whether the preferred scheme is light          |

## Examples

### Theme Toggler with System Preference

```jsx
function App() {
  const { colorScheme, isDark } = usePreferredColorScheme();
  const [theme, setTheme] = useState(colorScheme || "light");

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <div className={theme === "dark" ? "dark-theme" : "light-theme"}>
      <h1>My App</h1>
      <p>System preference: {colorScheme}</p>
      <p>Current theme: {theme}</p>
      <button onClick={toggleTheme}>Toggle Theme</button>
      {theme === colorScheme ? (
        <p>✓ Matching system preference</p>
      ) : (
        <button onClick={() => setTheme(colorScheme)}>
          Reset to system preference
        </button>
      )}
    </div>
  );
}
```

### Automatic Theme Application

```jsx
function AutoThemeApp() {
  const { isDark } = usePreferredColorScheme();

  useEffect(() => {
    document.body.className = isDark ? "dark" : "light";
  }, [isDark]);

  return <div>Theme automatically matches your system preferences</div>;
}
```

### Theme-Aware Image Loading

```jsx
function LogoImage() {
  const { isDark } = usePreferredColorScheme();

  return (
    <img
      src={isDark ? "/logo-dark.svg" : "/logo-light.svg"}
      alt="Logo"
    />
  );
}
```

### CSS Variables with Color Scheme

```jsx
function ThemedApp() {
  const { isDark } = usePreferredColorScheme();

  const cssVariables = {
    "--bg-primary": isDark ? "#1a1a1a" : "#ffffff",
    "--bg-secondary": isDark ? "#2d2d2d" : "#f5f5f5",
    "--text-primary": isDark ? "#ffffff" : "#000000",
    "--text-secondary": isDark ? "#b3b3b3" : "#666666",
    "--accent": isDark ? "#4a9eff" : "#0066cc",
  };

  return (
    <div style={cssVariables}>
      <header style={{
        background: "var(--bg-secondary)",
        color: "var(--text-primary)",
        padding: "20px",
      }}>
        <h1>Themed Application</h1>
      </header>
      <main style={{
        background: "var(--bg-primary)",
        color: "var(--text-primary)",
        padding: "20px",
      }}>
        <p>Content automatically adapts to your system theme preference</p>
      </main>
    </div>
  );
}
```

## Features

- **Automatic detection** - Reads system color scheme preference
- **Real-time updates** - Updates when user changes system settings
- **Helper booleans** - Convenient `isDark` and `isLight` flags
- **SSR compatible** - Returns `null` on server-side rendering
- **TypeScript support** - Full type definitions included

## Browser Support

The `prefers-color-scheme` media query is supported in:
- Chrome 76+
- Firefox 67+
- Safari 12.1+
- Edge 79+
- Opera 62+

## Notes

- The hook automatically subscribes to system theme changes
- Returns `null` during server-side rendering
- `colorScheme` can be `"light"`, `"dark"`, or `"no-preference"`
- Updates happen in real-time when user changes system settings
- Use this to provide automatic dark mode support
- Consider allowing users to override system preference
