---
id: useBattery
title: useBattery
sidebar_label: useBattery
---

## About

React hook for monitoring device battery status including charge level, charging state, and time estimates. Non-suspense version of battery status monitoring using the Battery Status API.

## Installation

```bash
npm install rooks
```

## Usage

```jsx
import { useBattery } from "rooks";

function BatteryStatus() {
  const { level, charging, chargingTime, dischargingTime, isSupported, loading } = useBattery();

  if (!isSupported) {
    return <div>Battery Status API not supported in this browser</div>;
  }

  if (loading) {
    return <div>Loading battery status...</div>;
  }

  return (
    <div>
      <h2>Battery Status</h2>
      <div>
        <p>Battery Level: {(level * 100).toFixed(0)}%</p>
        <div
          style={{
            width: "200px",
            height: "20px",
            border: "1px solid #000",
            background: `linear-gradient(to right, green ${level * 100}%, white ${level * 100}%)`,
          }}
        />
      </div>

      <p>Status: {charging ? "⚡ Charging" : "🔋 Discharging"}</p>

      {charging && chargingTime !== Infinity && (
        <p>Time until fully charged: {Math.floor(chargingTime / 60)} minutes</p>
      )}

      {!charging && dischargingTime !== Infinity && (
        <p>Time remaining: {Math.floor(dischargingTime / 60)} minutes</p>
      )}
    </div>
  );
}
```

## Return Value

Returns an object with the following properties:

| Property         | Type      | Description                                                  |
| ---------------- | --------- | ------------------------------------------------------------ |
| level            | `number`  | Battery level as a decimal between 0 and 1                   |
| charging         | `boolean` | Whether the battery is currently charging                    |
| chargingTime     | `number`  | Time in seconds until fully charged (Infinity if not charging)|
| dischargingTime  | `number`  | Time in seconds until fully discharged (Infinity if charging)|
| isSupported      | `boolean` | Whether the Battery Status API is supported                  |
| loading          | `boolean` | Whether battery information is currently loading             |

## Examples

### Battery-Aware Features

```jsx
function AdaptiveQuality() {
  const { level, charging } = useBattery();
  const shouldReduceQuality = !charging && level < 0.2;

  return (
    <video
      src="/video.mp4"
      quality={shouldReduceQuality ? "low" : "high"}
      controls
    />
  );
}
```

### Low Battery Warning

```jsx
function LowBatteryWarning() {
  const { level, charging } = useBattery();
  const showWarning = !charging && level < 0.15;

  if (!showWarning) return null;

  return (
    <div style={{ background: "orange", padding: "10px" }}>
      ⚠️ Low battery ({(level * 100).toFixed(0)}%). Please save your work.
    </div>
  );
}
```

## Features

- **Real-time updates** - Automatically updates when battery status changes
- **Charging detection** - Know when the device is plugged in
- **Time estimates** - Get estimated time until charged/discharged
- **Loading state** - Handle async battery API initialization
- **TypeScript support** - Full type definitions included

## Browser Support

The Battery Status API is supported in:
- Chrome 38+
- Firefox 43+ (behind a flag)
- Edge 79+
- Opera 25+

**Note:** Safari does not support the Battery Status API.

## Notes

- The Battery Status API is being deprecated in some browsers due to privacy concerns
- Time estimates (chargingTime and dischargingTime) may be `Infinity` when not available
- Battery level is a decimal value from 0 to 1 (multiply by 100 for percentage)
- Updates occur automatically when battery status changes
- Use this for power-aware features, not for tracking users
