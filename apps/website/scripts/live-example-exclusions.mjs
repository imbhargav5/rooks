// Hooks whose demos cannot run in an embedded Sandpack iframe, even after
// widening the iframe `allow` list. Keep this list small and justified — the
// augment script skips these files, and the strip script guarantees any
// pre-existing <LiveExample> in them is removed.
//
// Paths are relative to apps/website/content/docs/hooks/.
export const EXCLUDED_HOOKS = [
    // Web Workers need a separate worker.js file; single-file Sandpack can't host it.
    '(performance)/useWebWorker.mdx',
    // Multi-Screen Window Placement (window-management) is blocked in
    // cross-origin iframes regardless of permissions policy.
    '(browser)/useScreenDetailsApi.mdx',
    // IdleDetector requires the idle-detection permissions policy AND a
    // top-level user gesture; not reliably available in embedded iframes.
    '(browser)/useIdleDetectionApi.mdx',
];
