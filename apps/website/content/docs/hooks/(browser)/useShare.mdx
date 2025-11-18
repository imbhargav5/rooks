---
id: useShare
title: useShare
sidebar_label: useShare
---

## About

React hook for the Web Share API, enabling native sharing on mobile and desktop platforms. Provides an easy way to share content using the device's native share dialog.

## Installation

```bash
npm install rooks
```

## Usage

```jsx
import { useShare } from "rooks";

function ShareButton() {
  const { share, isSupported, error, isSharing } = useShare();

  const handleShare = async () => {
    try {
      await share({
        title: "Check this out!",
        text: "This is an amazing article about React hooks",
        url: "https://example.com/article",
      });
      console.log("Content shared successfully!");
    } catch (err) {
      console.error("Share failed:", err);
    }
  };

  if (!isSupported) {
    return (
      <div>
        <p>Sharing not supported on this device</p>
        {/* Fallback UI - show social media buttons, copy link, etc. */}
      </div>
    );
  }

  return (
    <div>
      <button onClick={handleShare} disabled={isSharing}>
        {isSharing ? "Sharing..." : "Share"}
      </button>
      {error && <p style={{ color: "red" }}>Error: {error.message}</p>}
    </div>
  );
}
```

## Return Value

Returns an object with the following properties:

| Property   | Type                                      | Description                                  |
| ---------- | ----------------------------------------- | -------------------------------------------- |
| share      | `(data: ShareData) => Promise<void>`      | Share content using the Web Share API       |
| isSupported| `boolean`                                 | Whether the Web Share API is supported       |
| error      | `Error \| null`                           | Any error that occurred during sharing       |
| isSharing  | `boolean`                                 | Whether sharing is currently in progress     |

## Share Data

The `share` function accepts an object with the following properties:

| Property | Type       | Description                    |
| -------- | ---------- | ------------------------------ |
| title    | `string`   | Title to share                 |
| text     | `string`   | Text content to share          |
| url      | `string`   | URL to share                   |
| files    | `File[]`   | Files to share (if supported)  |

## Examples

### Share with Files

```jsx
function ShareImage() {
  const { share } = useShare();

  const handleShareImage = async (file: File) => {
    await share({
      files: [file],
      title: "Check out this image!",
      text: "I wanted to share this with you",
    });
  };

  return <button onClick={() => handleShareImage(imageFile)}>Share Image</button>;
}
```

### Share Current Page

```jsx
function ShareCurrentPage() {
  const { share } = useShare();

  const handleShare = async () => {
    await share({
      title: document.title,
      url: window.location.href,
    });
  };

  return <button onClick={handleShare}>Share This Page</button>;
}
```

## Features

- **Native share dialog** - Uses the device's built-in sharing UI
- **Mobile-friendly** - Works seamlessly on iOS and Android
- **File sharing** - Share images, PDFs, and other files
- **Error handling** - Comprehensive error handling including user cancellation
- **TypeScript support** - Full type definitions included

## Browser Support

The Web Share API is supported in:
- Chrome 61+ (Android), 89+ (Desktop)
- Safari 12.1+ (iOS), 14+ (macOS)
- Edge 79+
- Opera 48+ (Android), 75+ (Desktop)

**Note:** File sharing requires additional browser support (Chrome 75+, Safari 15+)

## Notes

- The Web Share API requires a secure context (HTTPS or localhost)
- Some browsers require user interaction to trigger sharing
- User cancelling the share dialog is not treated as an error
- Not all browsers support file sharing - check `navigator.canShare()` for file support
- Share data must include at least one of: title, text, url, or files
