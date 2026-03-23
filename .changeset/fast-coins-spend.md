---
"rooks": patch
---

Fix `TypeError: e.BigInt is not a function` crash caused by `@js-temporal/polyfill` being eagerly loaded for all imports.

Temporal hooks (`useTemporalNow`, `useTemporalAge`, `useTemporalCountdown`, `useTemporalElapsed`) are now available via a separate entry point:

```js
import { useTemporalNow } from "rooks/temporal";
```

`@js-temporal/polyfill` moved to `optionalDependencies` — install it explicitly if using temporal hooks.
