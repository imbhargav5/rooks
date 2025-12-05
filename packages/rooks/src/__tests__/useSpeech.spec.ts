import { vi } from "vitest";
// useSpeech.test.ts
import { renderHook, act } from "@testing-library/react";
import { useSpeech } from "@/hooks/useSpeech";

const originalSpeechSynthesis = window.speechSynthesis;

describe("useSpeech", () => {
  let mockSpeak: vi.Mock;
  let mockCancel: vi.Mock;
  let mockPause: vi.Mock;
  let mockResume: vi.Mock;
  let mockOnvoiceschanged: vi.Mock;

  beforeEach(() => {
    mockSpeak = vi
      .fn()
      .mockImplementation((utterance: SpeechSynthesisUtterance) => {
        utterance?.onstart?.(new Event("start") as SpeechSynthesisEvent);
      });
    mockCancel = vi
      .fn()
      .mockImplementation((utterance: SpeechSynthesisUtterance) => {
        utterance?.onend?.(new Event("end") as SpeechSynthesisEvent);
      });
    mockPause = vi
      .fn()
      .mockImplementation((utterance: SpeechSynthesisUtterance) => {
        utterance?.onpause?.(new Event("pause") as SpeechSynthesisEvent);
      });
    mockResume = vi
      .fn()
      .mockImplementation((utterance: SpeechSynthesisUtterance) => {
        utterance?.onresume?.(new Event("resume") as SpeechSynthesisEvent);
      });
    mockOnvoiceschanged = vi.fn();

    (window as any).speechSynthesis = {
      speak: mockSpeak,
      cancel: mockCancel,
      pause: mockPause,
      resume: mockResume,
      onvoiceschanged: mockOnvoiceschanged,
    };
  });

  afterEach(() => {
    window.speechSynthesis = originalSpeechSynthesis;
  });

  it("should define the useSpeech hook", () => {
    expect.hasAssertions();
    expect(useSpeech).toBeDefined();
  });

  it("should start the speech when start is called", () => {
    expect.hasAssertions();
    const { result } = renderHook(() =>
      useSpeech({ text: "Hello, how are you?" })
    );

    act(() => {
      result.current.start();
    });

    expect(mockSpeak).toHaveBeenCalled();
  });

  it("should pause the speech when pause is called", () => {
    expect.hasAssertions();
    const { result } = renderHook(() =>
      useSpeech({ text: "Hello, how are you?" })
    );

    act(() => {
      result.current.start();
    });

    act(() => {
      result.current.pause();
    });

    expect(mockPause).toHaveBeenCalled();
  });

  it("should resume the speech when resume is called", () => {
    expect.hasAssertions();
    const { result } = renderHook(() =>
      useSpeech({ text: "Hello, how are you?" })
    );

    act(() => {
      result.current.resume();
    });

    expect(mockResume).toHaveBeenCalled();
  });

  it("should stop the speech when stop is called", () => {
    expect.hasAssertions();
    const { result } = renderHook(() =>
      useSpeech({ text: "Hello, how are you?" })
    );

    act(() => {
      result.current.stop();
    });

    expect(mockCancel).toHaveBeenCalled();
  });

  it("should update the isPlaying state when the speech starts and stops", () => {
    expect.hasAssertions();
    const { result } = renderHook(() =>
      useSpeech({ text: "Hello, how are you?" })
    );

    act(() => {
      result.current.start();
    });

    expect(result.current.isPlaying).toBe(true);

    act(() => {
      result.current.stop();
    });

    expect(result.current.isPlaying).toBe(false);
  });
});
