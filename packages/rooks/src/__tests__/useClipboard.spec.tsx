/**
 * @jest-environment jsdom
 */
import { renderHook, act } from "@testing-library/react-hooks";
import { useClipboard } from "@/hooks/useClipboard";

describe("useClipboard", () => {
  let clipboardWriteText: jest.Mock;
  let clipboardReadText: jest.Mock;

  beforeEach(() => {
    clipboardWriteText = jest.fn();
    clipboardReadText = jest.fn();

    Object.assign(navigator, {
      clipboard: {
        writeText: clipboardWriteText,
        readText: clipboardReadText,
      },
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should be defined", () => {
    expect.hasAssertions();
    expect(useClipboard).toBeDefined();
  });

  it("should return initial state", () => {
    expect.hasAssertions();
    const { result } = renderHook(() => useClipboard());

    expect(result.current.text).toBe(null);
    expect(result.current.error).toBe(null);
    expect(result.current.isSupported).toBe(true);
    expect(typeof result.current.copy).toBe("function");
    expect(typeof result.current.paste).toBe("function");
  });

  it("should detect when clipboard API is supported", () => {
    expect.hasAssertions();
    const { result } = renderHook(() => useClipboard());

    expect(result.current.isSupported).toBe(true);
  });

  it("should detect when clipboard API is not supported", () => {
    expect.hasAssertions();
    const originalClipboard = navigator.clipboard;
    // @ts-ignore
    delete navigator.clipboard;

    const { result } = renderHook(() => useClipboard());

    expect(result.current.isSupported).toBe(false);

    // Restore
    Object.assign(navigator, { clipboard: originalClipboard });
  });

  it("should copy text to clipboard", async () => {
    expect.hasAssertions();
    clipboardWriteText.mockResolvedValue(undefined);

    const { result } = renderHook(() => useClipboard());

    await act(async () => {
      await result.current.copy("Hello, World!");
    });

    expect(clipboardWriteText).toHaveBeenCalledWith("Hello, World!");
    expect(result.current.text).toBe("Hello, World!");
    expect(result.current.error).toBe(null);
  });

  it("should handle copy errors", async () => {
    expect.hasAssertions();
    const copyError = new Error("Permission denied");
    clipboardWriteText.mockRejectedValue(copyError);

    const { result } = renderHook(() => useClipboard());

    await expect(
      act(async () => {
        await result.current.copy("Test");
      })
    ).rejects.toThrow("Permission denied");

    expect(result.current.error).toEqual(copyError);
  });

  it("should handle copy with non-Error rejection", async () => {
    expect.hasAssertions();
    clipboardWriteText.mockRejectedValue("String error");

    const { result } = renderHook(() => useClipboard());

    await expect(
      act(async () => {
        await result.current.copy("Test");
      })
    ).rejects.toThrow("Failed to copy to clipboard");

    expect(result.current.error?.message).toBe("Failed to copy to clipboard");
  });

  it("should throw error when copying without clipboard support", async () => {
    expect.hasAssertions();
    const originalClipboard = navigator.clipboard;
    // @ts-ignore
    delete navigator.clipboard;

    const { result } = renderHook(() => useClipboard());

    await expect(
      act(async () => {
        await result.current.copy("Test");
      })
    ).rejects.toThrow("Clipboard API is not supported");

    expect(result.current.error?.message).toBe(
      "Clipboard API is not supported"
    );

    // Restore
    Object.assign(navigator, { clipboard: originalClipboard });
  });

  it("should read text from clipboard", async () => {
    expect.hasAssertions();
    clipboardReadText.mockResolvedValue("Pasted text");

    const { result } = renderHook(() => useClipboard());

    await act(async () => {
      await result.current.paste();
    });

    expect(clipboardReadText).toHaveBeenCalled();
    expect(result.current.text).toBe("Pasted text");
    expect(result.current.error).toBe(null);
  });

  it("should handle paste errors", async () => {
    expect.hasAssertions();
    const pasteError = new Error("Permission denied");
    clipboardReadText.mockRejectedValue(pasteError);

    const { result } = renderHook(() => useClipboard());

    await expect(
      act(async () => {
        await result.current.paste();
      })
    ).rejects.toThrow("Permission denied");

    expect(result.current.error).toEqual(pasteError);
  });

  it("should handle paste with non-Error rejection", async () => {
    expect.hasAssertions();
    clipboardReadText.mockRejectedValue("String error");

    const { result } = renderHook(() => useClipboard());

    await expect(
      act(async () => {
        await result.current.paste();
      })
    ).rejects.toThrow("Failed to read from clipboard");

    expect(result.current.error?.message).toBe(
      "Failed to read from clipboard"
    );
  });

  it("should throw error when pasting without clipboard support", async () => {
    expect.hasAssertions();
    const originalClipboard = navigator.clipboard;
    // @ts-ignore
    delete navigator.clipboard;

    const { result } = renderHook(() => useClipboard());

    await expect(
      act(async () => {
        await result.current.paste();
      })
    ).rejects.toThrow("Clipboard API is not supported");

    expect(result.current.error?.message).toBe(
      "Clipboard API is not supported"
    );

    // Restore
    Object.assign(navigator, { clipboard: originalClipboard });
  });

  it("should clear error on successful copy after error", async () => {
    expect.hasAssertions();
    clipboardWriteText
      .mockRejectedValueOnce(new Error("First error"))
      .mockResolvedValueOnce(undefined);

    const { result } = renderHook(() => useClipboard());

    // First copy fails
    await expect(
      act(async () => {
        await result.current.copy("Test 1");
      })
    ).rejects.toThrow("First error");

    expect(result.current.error).not.toBe(null);

    // Second copy succeeds
    await act(async () => {
      await result.current.copy("Test 2");
    });

    expect(result.current.error).toBe(null);
    expect(result.current.text).toBe("Test 2");
  });

  it("should clear error on successful paste after error", async () => {
    expect.hasAssertions();
    clipboardReadText
      .mockRejectedValueOnce(new Error("First error"))
      .mockResolvedValueOnce("Success");

    const { result } = renderHook(() => useClipboard());

    // First paste fails
    await expect(
      act(async () => {
        await result.current.paste();
      })
    ).rejects.toThrow("First error");

    expect(result.current.error).not.toBe(null);

    // Second paste succeeds
    await act(async () => {
      await result.current.paste();
    });

    expect(result.current.error).toBe(null);
    expect(result.current.text).toBe("Success");
  });
});
