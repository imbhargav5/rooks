import { act } from "@testing-library/react";

/**
 * Fast drop-in replacement for `waitFor` when the awaited condition is
 * really "a pending promise (macrotask or microtask) has settled and React
 * has re-rendered". `waitFor`'s setInterval/MutationObserver polling has a
 * ~300ms floor in this project's jsdom/vitest setup regardless of the
 * configured interval, so we instead flush real timer ticks through `act`
 * directly and re-check the assertion after each tick.
 */
export async function flushUntil(
  assertion: () => void,
  maxTicks = 20
): Promise<void> {
  for (let tick = 0; tick < maxTicks; tick += 1) {
    try {
      assertion();
      return;
    } catch {
      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 0));
      });
    }
  }

  assertion();
}
