---
id: useFetch
title: useFetch
sidebar_label: useFetch
---

## About

Manually fetch JSON data while tracking data, loading, and error state.

## Robustness and lifecycle

Starting another request does not cancel earlier calls; overlapping requests may still complete and update state. Unmounting aborts active requests and prevents callbacks or state updates after unmount.
