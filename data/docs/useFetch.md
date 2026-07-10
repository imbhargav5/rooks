---
id: useFetch
title: useFetch
sidebar_label: useFetch
---

## About

Manually fetch JSON data while tracking data, loading, and error state.

## Robustness and lifecycle

Starting a request aborts any request already in progress; only the newest request may update state or invoke callbacks. Unmounting aborts the active request. Abort cancellations are not reported as user errors.
