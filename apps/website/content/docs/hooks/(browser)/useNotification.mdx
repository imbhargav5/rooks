---
id: useNotification
title: useNotification
sidebar_label: useNotification
---

## About

React hook for sending browser notifications with permission handling using the Notifications API.

## Installation

```bash
npm install rooks
```

## Usage

```jsx
import { useNotification } from "rooks";

function NotificationDemo() {
  const { show, permission, requestPermission, isSupported } = useNotification();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const handleRequestPermission = async () => {
    const result = await requestPermission();
    if (result === "granted") {
      console.log("Permission granted!");
    } else {
      console.log("Permission denied");
    }
  };

  const handleShowNotification = async () => {
    if (permission === "granted") {
      await show(title, {
        body: body,
        icon: "/logo192.png",
        tag: "demo-notification",
        requireInteraction: false,
      });
    }
  };

  if (!isSupported) {
    return <div>Notifications not supported in this browser</div>;
  }

  return (
    <div>
      <h2>Browser Notifications</h2>
      <p>Current permission: <strong>{permission}</strong></p>

      {permission === "default" && (
        <div>
          <p>You need to grant permission to show notifications</p>
          <button onClick={handleRequestPermission}>Request Permission</button>
        </div>
      )}

      {permission === "granted" && (
        <div>
          <input
            placeholder="Notification title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            placeholder="Notification body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />
          <button onClick={handleShowNotification}>Show Notification</button>
        </div>
      )}

      {permission === "denied" && (
        <p>Permission denied. Please enable notifications in browser settings.</p>
      )}
    </div>
  );
}
```

## Return Value

Returns an object with the following properties:

| Property          | Type                                                           | Description                                  |
| ----------------- | -------------------------------------------------------------- | -------------------------------------------- |
| show              | `(title: string, options?: NotificationOptions) => Promise<Notification \| null>` | Show a notification |
| permission        | `"default" \| "granted" \| "denied"`                           | Current permission state                     |
| requestPermission | `() => Promise<NotificationPermission>`                        | Request notification permission from user    |
| isSupported       | `boolean`                                                      | Whether the Notification API is supported    |

## Notification Options

The `show` function accepts an options object with the following properties:

| Option              | Type                | Description                                           |
| ------------------- | ------------------- | ----------------------------------------------------- |
| body                | `string`            | The body text of the notification                     |
| icon                | `string`            | URL of an icon to display in the notification         |
| badge               | `string`            | URL of a badge image                                  |
| tag                 | `string`            | Unique tag to identify the notification               |
| data                | `any`               | Custom data to associate with the notification        |
| requireInteraction  | `boolean`           | Whether notification should remain active until clicked|
| silent              | `boolean`           | Whether notification should be silent                 |
| vibrate             | `number \| number[]`| Vibration pattern for devices that support it         |
| image               | `string`            | URL of an image to display in the notification        |

## Features

- **Permission management** - Request and track notification permissions
- **Rich notifications** - Support for icons, images, badges, and more
- **Error handling** - Graceful handling of permission denials
- **Browser support detection** - Automatically detects API availability
- **TypeScript support** - Full type definitions included

## Browser Support

The Notifications API is supported in:
- Chrome 22+
- Firefox 22+
- Safari 7+
- Edge 14+
- Opera 25+

## Notes

- Notifications require user permission and will prompt the user on first request
- Some browsers block notification requests if not triggered by user interaction
- Notifications may not work in cross-origin iframes
- Users can revoke permission at any time through browser settings
- On mobile devices, notifications behavior varies by browser and OS
