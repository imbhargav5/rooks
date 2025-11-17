---
id: useNetworkInformation
title: useNetworkInformation
sidebar_label: useNetworkInformation
---

## About

React hook for detecting network connection quality and type using the Network Information API. Provides information about the user's connection including speed, type, and data saver mode.

## Installation

```bash
npm install rooks
```

## Usage

```jsx
import { useNetworkInformation } from "rooks";

function NetworkStatus() {
  const {
    effectiveType,
    downlink,
    rtt,
    saveData,
    type,
    isSupported
  } = useNetworkInformation();

  if (!isSupported) {
    return <div>Network Information API not supported</div>;
  }

  return (
    <div>
      <h2>Network Status</h2>
      <p>Connection Type: {type || "Unknown"}</p>
      <p>Effective Type: {effectiveType || "Unknown"}</p>
      {downlink && <p>Download Speed: {downlink} Mbps</p>}
      {rtt && <p>Round Trip Time: {rtt} ms</p>}
      {saveData && <p>⚠️ Data Saver Mode: Enabled</p>}
    </div>
  );
}
```

## Return Value

Returns an object with the following properties:

| Property      | Type                              | Description                                   |
| ------------- | --------------------------------- | --------------------------------------------- |
| type          | `ConnectionType \| null`          | Network connection type (wifi, cellular, etc.)|
| effectiveType | `EffectiveConnectionType \| null` | Effective connection type (4g, 3g, 2g, slow-2g)|
| downlink      | `number \| null`                  | Downlink speed in Mbps                        |
| downlinkMax   | `number \| null`                  | Maximum downlink speed in Mbps                |
| rtt           | `number \| null`                  | Round trip time in milliseconds               |
| saveData      | `boolean`                         | Whether data saver mode is enabled            |
| isSupported   | `boolean`                         | Whether Network Information API is supported  |

## Connection Types

- `"bluetooth"` - Bluetooth connection
- `"cellular"` - Cellular network (3G, 4G, 5G)
- `"ethernet"` - Wired ethernet connection
- `"wifi"` - WiFi connection
- `"wimax"` - WiMAX connection
- `"none"` - No network connection
- `"other"` - Other connection type
- `"unknown"` - Connection type unknown

## Effective Connection Types

- `"slow-2g"` - Very slow connection (~50 Kbps)
- `"2g"` - Slow connection (~70 Kbps)
- `"3g"` - Medium connection (~700 Kbps)
- `"4g"` - Fast connection (≥700 Kbps)

## Examples

### Adaptive Content Loading

```jsx
function AdaptiveImage() {
  const { effectiveType, saveData } = useNetworkInformation();

  const shouldLoadHighQuality =
    !saveData && (effectiveType === "4g" || effectiveType === "3g");

  return (
    <img
      src={shouldLoadHighQuality ? "/image-hq.jpg" : "/image-lq.jpg"}
      alt="Adaptive quality image"
    />
  );
}
```

### Data Saver Warning

```jsx
function VideoPlayer() {
  const { saveData, effectiveType } = useNetworkInformation();

  if (saveData) {
    return (
      <div>
        <p>Data Saver mode is enabled. Video quality will be reduced.</p>
        <button>Play anyway</button>
      </div>
    );
  }

  return <video src="/video.mp4" controls autoPlay={effectiveType === "4g"} />;
}
```

### Network-Aware Features

```jsx
function NetworkAwareApp() {
  const { effectiveType, downlink } = useNetworkInformation();

  const features = {
    autoplay: effectiveType === "4g",
    preload: downlink && downlink > 5,
    highQualityImages: effectiveType === "4g" || effectiveType === "3g",
  };

  return (
    <div>
      <p>Autoplay: {features.autoplay ? "Enabled" : "Disabled"}</p>
      <p>Preload: {features.preload ? "Enabled" : "Disabled"}</p>
      <p>Image Quality: {features.highQualityImages ? "High" : "Low"}</p>
    </div>
  );
}
```

## Features

- **Real-time updates** - Automatically updates when network changes
- **Connection type** - Detect WiFi, cellular, ethernet, etc.
- **Speed detection** - Get downlink speed and RTT measurements
- **Data saver mode** - Respect user's data saving preferences
- **Adaptive loading** - Load appropriate content based on connection
- **TypeScript support** - Full type definitions included

## Browser Support

The Network Information API is supported in:
- Chrome 61+
- Edge 79+
- Opera 48+
- Samsung Internet 8.0+

**Note:** Firefox and Safari do not currently support this API.

## Notes

- Values may be `null` if not available
- `effectiveType` is based on observed RTT and downlink values
- Data saver mode indicates user preference for reduced data usage
- Connection information updates automatically when network changes
- Use this for adaptive loading, not for tracking users
- Respecting `saveData` provides better user experience
