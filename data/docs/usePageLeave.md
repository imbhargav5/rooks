---
id: usePageLeave
title: usePageLeave
sidebar_label: usePageLeave
---

## About

React hook to detect when user is about to leave the page using beforeunload, visibilitychange, and pagehide events. Useful for saving drafts, confirming navigation, or tracking engagement.

## Installation

```bash
npm install rooks
```

## Usage

```jsx
import { usePageLeave } from "rooks";

function DraftEditor() {
  const [draft, setDraft] = useState("");
  const [saved, setSaved] = useState(true);

  usePageLeave(() => {
    if (!saved && draft) {
      // Save draft before leaving
      localStorage.setItem("draft", draft);
      console.log("Draft saved before leaving");
    }
  });

  const handleChange = (e) => {
    setDraft(e.target.value);
    setSaved(false);
  };

  const handleSave = () => {
    localStorage.setItem("draft", draft);
    setSaved(true);
  };

  return (
    <div>
      <textarea
        value={draft}
        onChange={handleChange}
        placeholder="Start writing..."
        rows={10}
        style={{ width: "100%" }}
      />
      <button onClick={handleSave}>Save Draft</button>
      {!saved && (
        <p style={{ color: "orange" }}>⚠️ You have unsaved changes</p>
      )}
    </div>
  );
}
```

## Parameters

| Parameter   | Type                    | Description                                      |
| ----------- | ----------------------- | ------------------------------------------------ |
| onPageLeave | `() => void \| string`  | Callback executed when user is leaving the page  |

## Callback Return Value

The callback can return:
- `void` - Just execute side effects (save data, etc.)
- `string` - Show a confirmation dialog with the returned message

## Examples

### Confirm Before Leaving

```jsx
function FormWithConfirmation() {
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  usePageLeave(() => {
    if (hasUnsavedChanges) {
      return "You have unsaved changes. Are you sure you want to leave?";
    }
  });

  return (
    <form onChange={() => setHasUnsavedChanges(true)}>
      <input name="name" placeholder="Name" />
      <input name="email" placeholder="Email" />
      <button type="submit">Submit</button>
    </form>
  );
}
```

### Track Session Duration

```jsx
function SessionTracker() {
  const sessionStartRef = useRef(Date.now());

  usePageLeave(() => {
    const sessionDuration = Date.now() - sessionStartRef.current;

    // Send analytics
    fetch("/api/analytics", {
      method: "POST",
      body: JSON.stringify({
        sessionDuration,
        page: window.location.pathname,
      }),
    });
  });

  return <div>Your content here</div>;
}
```

### Auto-save on Page Leave

```jsx
function AutoSaveEditor() {
  const [content, setContent] = useState("");
  const contentRef = useRef(content);

  // Keep ref up to date
  useEffect(() => {
    contentRef.current = content;
  }, [content]);

  usePageLeave(() => {
    if (contentRef.current) {
      // Auto-save to server
      fetch("/api/save", {
        method: "POST",
        body: JSON.stringify({ content: contentRef.current }),
      });
    }
  });

  return (
    <textarea
      value={content}
      onChange={(e) => setContent(e.target.value)}
      placeholder="Your content is auto-saved when you leave"
    />
  );
}
```

### Clear Sensitive Data

```jsx
function SecureForm() {
  const [password, setPassword] = useState("");

  usePageLeave(() => {
    // Clear sensitive data from memory
    setPassword("");

    // Clear any cached sensitive data
    sessionStorage.removeItem("tempData");
  });

  return (
    <input
      type="password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      placeholder="Password"
    />
  );
}
```

## Events Handled

The hook listens to three different events for comprehensive coverage:

1. **beforeunload** - Fired when window is about to unload (closing tab, navigating away)
2. **visibilitychange** - Fired when page becomes hidden (tab switch, minimize)
3. **pagehide** - Fired when navigating away (more reliable than beforeunload in some cases)

## Features

- **Multiple event sources** - Covers all common page leave scenarios
- **Confirmation dialogs** - Return a string to show confirmation
- **Auto-save support** - Perfect for draft saving functionality
- **Analytics tracking** - Track session duration and engagement
- **Fresh callback** - Always uses the latest callback reference
- **TypeScript support** - Full type definitions included

## Browser Support

- **beforeunload**: All modern browsers
- **visibilitychange**: Chrome 13+, Firefox 10+, Safari 7+, Edge 12+
- **pagehide**: Chrome 3+, Firefox 1.5+, Safari 4+, Edge 79+

## Notes

- Modern browsers may ignore custom beforeunload messages for security
- The callback is called only once per page leave to avoid duplicates
- Use refs for values you need in the callback to avoid stale closures
- Don't perform long-running operations in the callback
- Network requests in page leave handlers may not complete - use `navigator.sendBeacon()` for analytics
- The hook uses `useFreshCallback` to ensure the latest callback is always used
- Showing confirmation dialogs requires returning a string from the callback
