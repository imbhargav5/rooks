/**
 * @jest-environment jsdom
 */
import { renderHook } from "@testing-library/react-hooks";
import React, { useEffect, useState } from "react";
import { act } from "react-test-renderer";
import { useAsyncEffect } from "../hooks/useAsyncEffect";

describe("useAsyncEffect", () => {
  it("is defined", () => {
    expect(useAsyncEffect).toBeDefined();
  });

  it("runs the callback", async () => {
    const { waitFor, result } = renderHook(() => {
      const [value, setValue] = useState(false);

      useAsyncEffect(async () => {
        setValue(true);
      }, []);

      return value;
    });

    expect(result.all[0]).toBe(false);

    await act(async () => {
      await expect(waitFor(() => result.current)).resolves.toBeUndefined();
    });
  });

  it("sends the abort signal", async () => {
    const { waitFor, result } = renderHook(() => {
      const [aborted, setAborted] = useState(false);
      const [forceUnload, setForceUnload] = useState(0);

      useAsyncEffect(
        async (signal) => {
          const listener = () => setAborted(true);
          signal.addEventListener("abort", listener);

          return () => signal.removeEventListener("abort", listener);
        },
        [forceUnload]
      );

      return { aborted, forceUnload, setForceUnload };
    });

    expect(result.current.aborted).toBe(false);

    act(() => {
      result.current.setForceUnload((old) => old + 1);
    });

    await act(async () => {
      await expect(
        waitFor(() => result.current.aborted)
      ).resolves.toBeUndefined();
    });
  });

  it("runs the cleanup function", async () => {
    const { waitFor, result } = renderHook(() => {
      const [cleanupRan, setCleanupRan] = useState(false);
      const [forceUnload, setForceUnload] = useState(0);

      useAsyncEffect(
        async (signal) => {
          return () => setCleanupRan(true);
        },
        [forceUnload]
      );

      return { cleanupRan, forceUnload, setForceUnload };
    });

    expect(result.current.cleanupRan).toBe(false);

    act(() => {
      result.current.setForceUnload((old) => old + 1);
    });

    await expect(
      waitFor(() => result.current.cleanupRan)
    ).resolves.toBeUndefined();
  });

  it("errors when the effect function rejects", (done) => {
    const consoleSpy = jest
      .spyOn(global.console, "error")
      .mockImplementation(() => {});

    renderHook(() => {
      useAsyncEffect(async () => {
        await new Promise((_, reject) => {
          reject();
        });
      }, []);
    });

    setTimeout(() => {
      expect(consoleSpy).toHaveBeenCalledTimes(1);
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining(
          "You should NEVER throw inside useAsyncEffect. This means the cleanup function will not run, which can cause unintended side effects. Please wrap your useAsyncEffect function in a try/catch."
        )
      );
      done();
    });
  });
});
