---
"rooks": patch
---

Remove useTimeTravelState default export

The useTimeTravelState was exported as default and named exports which
creates possible differences in our dual packaging (cjs, esm). 

This is a potentially breaking change. If it affecting you, raise an issue or
adapt the import as below.

```typescript
// Change 'import useTimeTravelState from "rooks"' into
import { useTimeTravelState } from "rooks";
```