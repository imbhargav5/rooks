import { vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import TestRenderer from "react-test-renderer";
import { hydrateRoot } from "react-dom/client";
import { renderToString } from "react-dom/server";
import { useMediaMatch } from "@/hooks/useMediaMatch";

const { act } = TestRenderer;

type MediaQueryListListener = (
  event_: MediaQueryListEventMap["change"]
) => void;

describe("useMediaMatch", () => {
  afterEach(() => {
    delete (window as any).matchMedia;
  });

  it("should track a boolean", async () => {
    expect.hasAssertions();
    const addEventListener = vi.fn<
      void,
      [string, () => void]
    >();
    const removeEventListener = vi.fn<void, [string, () => void]>();
    let listener: (() => void) | undefined;
    let currentMatches = true;

    const matchMedia = vi.fn<MediaQueryList, [string]>().mockImplementation(() => ({
      addEventListener,
      matches: currentMatches,
      removeEventListener,
    } as any));

    addEventListener.mockImplementation((_, l) => (listener = l));

    window.matchMedia = matchMedia;

    const { rerender, result, unmount } = renderHook(
      ({ query }) => useMediaMatch(query),
      {
        initialProps: { query: "print" },
      }
    );

    // useSyncExternalStore calls matchMedia for both subscribe and getSnapshot
    expect(matchMedia).toHaveBeenCalled();
    expect(matchMedia.mock.calls[0]![0]).toBe("print");
    expect(addEventListener).toHaveBeenCalledTimes(1);
    expect(addEventListener).toHaveBeenCalledWith(
      "change",
      expect.any(Function)
    );
    expect(result.current).toBe(true);

    // Invoking the listener changes the value
    const l = expectDefined<() => void>(listener);
    currentMatches = false;
    act(() => l());
    expect(result.current).toBe(false);

    // Changing the query instantiates a new matchMedia and resets the match value to true
    expect(removeEventListener).not.toHaveBeenCalled();
    currentMatches = true;
    rerender({ query: "(max-width: 640px)" });
    // matchMedia is called again for the new query
    expect(matchMedia).toHaveBeenCalledWith("(max-width: 640px)");
    expect(result.current).toBe(true);
    // We should have also cleaned up the old event listener and bound a new one
    expect(removeEventListener).toHaveBeenCalledTimes(1);
    expect(addEventListener).toHaveBeenCalledTimes(2);

    // Unmount, ensuring we unbind the listener
    unmount();
    expect(removeEventListener).toHaveBeenCalledTimes(2);
  });

  // SSR tests are in ssr.spec.ts which runs in Node environment

  it("should work normally when window is defined", () => {
    expect.hasAssertions();

    const addEventListener = vi.fn<
      void,
      [string, () => void]
    >();
    const removeEventListener = vi.fn<void, [string, () => void]>();

    const matchMedia = vi.fn<MediaQueryList, [string]>().mockReturnValue({
      addEventListener,
      matches: true,
      removeEventListener,
    } as any);

    window.matchMedia = matchMedia;

    // Test that defaultServerRenderedValue parameter doesn't affect behavior when window is defined
    const { result } = renderHook(() => useMediaMatch("(max-width: 600px)", true));

    expect(result.current).toBe(true);
    expect(matchMedia).toHaveBeenCalledWith("(max-width: 600px)");
  });

  it("hydrates the server snapshot before reporting the client match", async () => {
    expect.hasAssertions();
    const addEventListener = vi.fn();
    const removeEventListener = vi.fn();
    const onRecoverableError = vi.fn();

    window.matchMedia = vi
      .fn<(query: string) => MediaQueryList>()
      .mockReturnValue({
        addEventListener,
        matches: true,
        removeEventListener,
      } as unknown as MediaQueryList);

    function MediaMatchStatus() {
      return <span>{String(useMediaMatch("(max-width: 600px)"))}</span>;
    }

    const container = document.createElement("div");
    container.innerHTML = renderToString(<MediaMatchStatus />);
    expect(container).toHaveTextContent("false");

    const root = hydrateRoot(container, <MediaMatchStatus />, {
      onRecoverableError,
    });

    try {
      await waitFor(() => {
        expect(container).toHaveTextContent("true");
      });
      expect(onRecoverableError).not.toHaveBeenCalled();
      expect(addEventListener).toHaveBeenCalledWith(
        "change",
        expect.any(Function)
      );
    } finally {
      act(() => {
        root.unmount();
      });
    }
  });
});

function expectDefined<T>(t: T | undefined): T {
  expect(t).toBeDefined();

  return t as T;
}
