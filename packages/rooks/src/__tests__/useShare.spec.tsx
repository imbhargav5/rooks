import { vi } from "vitest";
/**
 */
import { renderHook, act } from "@testing-library/react";
import { useShare } from "@/hooks/useShare";

describe("useShare", () => {
  let mockShare: vi.Mock;

  beforeEach(() => {
    mockShare = vi.fn();
    Object.assign(navigator, { share: mockShare });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should be defined", () => {
    expect.hasAssertions();
    expect(useShare).toBeDefined();
  });

  it("should return initial state", () => {
    expect.hasAssertions();
    const { result } = renderHook(() => useShare());

    expect(result.current.isSupported).toBe(true);
    expect(result.current.error).toBe(null);
    expect(result.current.isSharing).toBe(false);
    expect(typeof result.current.share).toBe("function");
  });

  it("should detect when Web Share API is not supported", () => {
    expect.hasAssertions();
    const originalShare = navigator.share;
    // @ts-ignore
    delete navigator.share;

    const { result } = renderHook(() => useShare());

    expect(result.current.isSupported).toBe(false);

    // Restore
    Object.assign(navigator, { share: originalShare });
  });

  it("should share content successfully", async () => {
    expect.hasAssertions();
    mockShare.mockResolvedValue(undefined);

    const { result } = renderHook(() => useShare());

    const shareData = {
      title: "Test Title",
      text: "Test text",
      url: "https://example.com",
    };

    await act(async () => {
      await result.current.share(shareData);
    });

    expect(mockShare).toHaveBeenCalledWith(shareData);
    expect(result.current.error).toBe(null);
    expect(result.current.isSharing).toBe(false);
  });

  it("should handle share with files", async () => {
    expect.hasAssertions();
    mockShare.mockResolvedValue(undefined);

    const { result } = renderHook(() => useShare());

    const file = new File(["content"], "test.txt", { type: "text/plain" });
    const shareData = {
      files: [file],
      title: "Share File",
    };

    await act(async () => {
      await result.current.share(shareData);
    });

    expect(mockShare).toHaveBeenCalledWith(shareData);
    expect(result.current.error).toBe(null);
  });

  it("should set isSharing to true while sharing", async () => {
    expect.hasAssertions();
    let resolveShare: () => void;
    const sharePromise = new Promise<void>((resolve) => {
      resolveShare = resolve;
    });
    mockShare.mockReturnValue(sharePromise);

    const { result } = renderHook(() => useShare());

    act(() => {
      result.current.share({ title: "Test" });
    });

    expect(result.current.isSharing).toBe(true);

    await act(async () => {
      resolveShare!();
      await sharePromise;
    });

    expect(result.current.isSharing).toBe(false);
  });

  it("should handle AbortError when user cancels", async () => {
    expect.hasAssertions();
    const abortError = new Error("User cancelled");
    abortError.name = "AbortError";
    mockShare.mockRejectedValue(abortError);

    const { result } = renderHook(() => useShare());

    await act(async () => {
      await result.current.share({ title: "Test" });
    });

    // AbortError should not be treated as an error
    expect(result.current.error).toBe(null);
    expect(result.current.isSharing).toBe(false);
  });

  it("should handle share errors", async () => {
    expect.hasAssertions();
    const shareError = new Error("Share failed");
    mockShare.mockRejectedValue(shareError);

    const { result } = renderHook(() => useShare());

    let thrownError: Error | null = null;
    await act(async () => {
      try {
        await result.current.share({ title: "Test" });
      } catch (e) {
        thrownError = e as Error;
      }
    });

    expect(thrownError?.message).toBe("Share failed");
    expect(result.current.error).toEqual(shareError);
    expect(result.current.isSharing).toBe(false);
  });

  it("should handle non-Error rejections", async () => {
    expect.hasAssertions();
    mockShare.mockRejectedValue("String error");

    const { result } = renderHook(() => useShare());

    let thrownError: Error | null = null;
    await act(async () => {
      try {
        await result.current.share({ title: "Test" });
      } catch (e) {
        thrownError = e as Error;
      }
    });

    expect(thrownError?.message).toBe("Failed to share");
    expect(result.current.error?.message).toBe("Failed to share");
  });

  it("should throw error when sharing without support", async () => {
    expect.hasAssertions();
    const originalShare = navigator.share;
    // @ts-ignore
    delete navigator.share;

    const { result } = renderHook(() => useShare());

    let thrownError: Error | null = null;
    await act(async () => {
      try {
        await result.current.share({ title: "Test" });
      } catch (e) {
        thrownError = e as Error;
      }
    });

    expect(thrownError?.message).toBe("Web Share API is not supported");
    expect(result.current.error?.message).toBe("Web Share API is not supported");

    // Restore
    Object.assign(navigator, { share: originalShare });
  });

  it("should clear error on successful share after error", async () => {
    expect.hasAssertions();
    mockShare
      .mockRejectedValueOnce(new Error("First error"))
      .mockResolvedValueOnce(undefined);

    const { result } = renderHook(() => useShare());

    // First share fails
    await act(async () => {
      try {
        await result.current.share({ title: "Test 1" });
      } catch {
        // Expected to throw
      }
    });

    expect(result.current.error).not.toBe(null);

    // Second share succeeds
    await act(async () => {
      await result.current.share({ title: "Test 2" });
    });

    expect(result.current.error).toBe(null);
  });

  it("should share with only title", async () => {
    expect.hasAssertions();
    mockShare.mockResolvedValue(undefined);

    const { result } = renderHook(() => useShare());

    await act(async () => {
      await result.current.share({ title: "Only Title" });
    });

    expect(mockShare).toHaveBeenCalledWith({ title: "Only Title" });
  });

  it("should share with only url", async () => {
    expect.hasAssertions();
    mockShare.mockResolvedValue(undefined);

    const { result } = renderHook(() => useShare());

    await act(async () => {
      await result.current.share({ url: "https://example.com" });
    });

    expect(mockShare).toHaveBeenCalledWith({ url: "https://example.com" });
  });
});
