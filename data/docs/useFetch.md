---
id: useFetch
title: useFetch
sidebar_label: useFetch
---

## About

Manually fetch JSON data while tracking data, loading, and error state.

## Robustness and lifecycle

Starting another request does not cancel earlier calls; overlapping requests may still complete and update state. Unmounting aborts active requests and prevents callbacks or state updates after unmount. `startFetch` is bound to the URL and options object from its render, so memoize `options` before using `startFetch` as an effect dependency.
