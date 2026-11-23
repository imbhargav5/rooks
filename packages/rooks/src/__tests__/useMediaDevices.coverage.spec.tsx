import { renderHook, act, waitFor } from "@testing-library/react";
import { useMediaDevices } from "@/hooks/useMediaDevices";

const originalDescriptor = Object.getOwnPropertyDescriptor(
  navigator,
  "mediaDevices"
);

function setMediaDevices(value: unknown) {
  Object.defineProperty(navigator, "mediaDevices", {
    configurable: true,
    value,
  });
}

const mic = { deviceId: "1", kind: "audioinput", label: "Mic" };
const speaker = { deviceId: "2", kind: "audiooutput", label: "Speaker" };
const cam = { deviceId: "3", kind: "videoinput", label: "Cam" };

describe("useMediaDevices coverage", () => {
  afterEach(() => {
    if (originalDescriptor) {
      Object.defineProperty(navigator, "mediaDevices", originalDescriptor);
    } else {
      delete (navigator as any).mediaDevices;
    }
    vi.restoreAllMocks();
  });

  it("reports unsupported and refresh/requestAccess reset state", async () => {
    setMediaDevices(undefined);
    const { result } = renderHook(() => useMediaDevices());
    expect(result.current.isSupported).toBe(false);
    await act(async () => {
      await result.current.refresh();
      await result.current.requestAccess();
    });
    expect(result.current.devices).toEqual([]);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it("requestAccess is a no-op when getUserMedia is missing", async () => {
    setMediaDevices({
      enumerateDevices: vi.fn().mockResolvedValue([mic]),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    });
    const { result } = renderHook(() => useMediaDevices({ watch: false }));
    await waitFor(() => expect(result.current.devices).toHaveLength(1));
    await act(async () => {
      await result.current.requestAccess();
    });
    expect(result.current.devices).toEqual([]);
  });

  it("categorizes devices and refreshes on devicechange", async () => {
    const target = new EventTarget();
    const enumerateDevices = vi
      .fn()
      .mockResolvedValueOnce([mic])
      .mockResolvedValue([mic, speaker, cam]);
    setMediaDevices({
      enumerateDevices,
      addEventListener: target.addEventListener.bind(target),
      removeEventListener: target.removeEventListener.bind(target),
    });
    const { result, unmount } = renderHook(() => useMediaDevices());
    await waitFor(() => expect(result.current.devices).toHaveLength(1));

    await act(async () => {
      target.dispatchEvent(new Event("devicechange"));
    });
    await waitFor(() => expect(result.current.devices).toHaveLength(3));
    expect(result.current.audioInputs).toEqual([mic]);
    expect(result.current.audioOutputs).toEqual([speaker]);
    expect(result.current.videoInputs).toEqual([cam]);

    unmount();
    const callsBefore = enumerateDevices.mock.calls.length;
    target.dispatchEvent(new Event("devicechange"));
    expect(enumerateDevices.mock.calls.length).toBe(callsBefore);
  });

  it("does not listen for devicechange when watch is false", async () => {
    const addEventListener = vi.fn();
    setMediaDevices({
      enumerateDevices: vi.fn().mockResolvedValue([]),
      addEventListener,
      removeEventListener: vi.fn(),
    });
    const { result } = renderHook(() => useMediaDevices({ watch: false }));
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(addEventListener).not.toHaveBeenCalled();
  });

  it("captures enumerateDevices errors, wrapping non-Error values", async () => {
    setMediaDevices({
      enumerateDevices: vi.fn().mockRejectedValue("denied"),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    });
    const { result } = renderHook(() => useMediaDevices());
    await waitFor(() => expect(result.current.error).toBeInstanceOf(Error));
    expect(result.current.error?.message).toBe("denied");
    expect(result.current.devices).toEqual([]);
    expect(result.current.isLoading).toBe(false);
  });

  it("captures Error instances from enumerateDevices as-is", async () => {
    const failure = new Error("nope");
    setMediaDevices({
      enumerateDevices: vi.fn().mockRejectedValue(failure),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    });
    const { result } = renderHook(() => useMediaDevices());
    await waitFor(() => expect(result.current.error).toBe(failure));
  });

  it("requests access on mount with the given constraints and stops tracks", async () => {
    const stop = vi.fn();
    const getUserMedia = vi
      .fn()
      .mockResolvedValue({ getTracks: () => [{ stop }, { stop }] });
    const enumerateDevices = vi.fn().mockResolvedValue([mic, cam]);
    setMediaDevices({
      enumerateDevices,
      getUserMedia,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    });
    const { result } = renderHook(() =>
      useMediaDevices({ requestAccessOnMount: { audio: true } })
    );
    await waitFor(() => expect(result.current.devices).toHaveLength(2));
    expect(getUserMedia).toHaveBeenCalledWith({ audio: true });
    expect(stop).toHaveBeenCalledTimes(2);
  });

  it("surfaces getUserMedia errors from requestAccess", async () => {
    const getUserMedia = vi.fn().mockRejectedValue("permission denied");
    setMediaDevices({
      enumerateDevices: vi.fn().mockResolvedValue([]),
      getUserMedia,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    });
    const { result } = renderHook(() => useMediaDevices());
    await act(async () => {
      await result.current.requestAccess();
    });
    expect(getUserMedia).toHaveBeenCalledWith({ audio: true, video: true });
    expect(result.current.error?.message).toBe("permission denied");
    expect(result.current.isLoading).toBe(false);
  });

  it("surfaces Error instances from requestAccess as-is", async () => {
    const failure = new Error("blocked");
    setMediaDevices({
      enumerateDevices: vi.fn().mockResolvedValue([]),
      getUserMedia: vi.fn().mockRejectedValue(failure),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    });
    const { result } = renderHook(() => useMediaDevices());
    await act(async () => {
      await result.current.requestAccess();
    });
    expect(result.current.error).toBe(failure);
  });

  it("ignores results that resolve after unmount", async () => {
    let resolve!: (d: unknown[]) => void;
    setMediaDevices({
      enumerateDevices: vi.fn(
        () =>
          new Promise((r) => {
            resolve = r;
          })
      ),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    });
    const { unmount } = renderHook(() => useMediaDevices());
    unmount();
    await act(async () => {
      resolve([mic]);
    });
  });

  it("only applies the latest of overlapping refreshes", async () => {
    const resolvers: Array<(d: unknown[]) => void> = [];
    setMediaDevices({
      enumerateDevices: vi.fn(
        () =>
          new Promise((r) => {
            resolvers.push(r);
          })
      ),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    });
    const { result } = renderHook(() => useMediaDevices({ watch: false }));
    await waitFor(() => expect(resolvers).toHaveLength(1));
    let second!: Promise<void>;
    act(() => {
      second = result.current.refresh();
    });
    await act(async () => {
      resolvers[1]([cam]);
      await second;
    });
    await act(async () => {
      resolvers[0]([mic]);
    });
    expect(result.current.devices).toEqual([cam]);
  });
});
