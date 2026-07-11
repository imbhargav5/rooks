---
id: useAsyncEffect
title: useAsyncEffect
sidebar_label: useAsyncEffect
---

## About

This is a version of `useEffect` that accepts an async function.

`useEffect` only works with effect functions that run synchronously. The go-to solution for most people is to simply run an async function inside `useEffect`, but that approach has a lot of gotchas involving React state manipulation.

[//]: # "Main"

## Examples

### Basic example

## Robustness and lifecycle

Only changes to `deps` restart the async effect. The latest cleanup callback is used when that generation ends, and `shouldContinueEffect()` becomes false for stale or unmounted generations.
