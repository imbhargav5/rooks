// useSpeech.test.ts
import { renderHook, act } from "@testing-library/react-hooks";
import { useSpeech } from "@/hooks/useSpeech";
import { waitFor } from "@testing-library/react";

jest.useFakeTimers();

const originalSpeechSynthesis = window.speechSynthesis;

describe("useSpeech", () => {
  let mockSpeak: jest.Mock;
  let mockCancel: jest.Mock;
  let mockPause: jest.Mock;
  let mockResume: jest.Mock;
  let mockOnvoiceschanged: jest.Mock;

  beforeEach(() => {
    mockSpeak = jest
      .fn()
      .mockImplementation((utterance: SpeechSynthesisUtterance) => {
        utterance?.onstart?.(new Event("start") as SpeechSynthesisEvent);
      });
    mockCancel = jest
      .fn()
      .mockImplementation((utterance: SpeechSynthesisUtterance) => {
        utterance?.onend?.(new Event("end") as SpeechSynthesisEvent);
      });
    mockPause = jest
      .fn()
      .mockImplementation((utterance: SpeechSynthesisUtterance) => {
        utterance?.onpause?.(new Event("pause") as SpeechSynthesisEvent);
      });
    mockResume = jest
      .fn()
      .mockImplementation((utterance: SpeechSynthesisUtterance) => {
        utterance?.onresume?.(new Event("resume") as SpeechSynthesisEvent);
      });
    mockOnvoiceschanged = jest.fn();

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

  it("should pause the speech when pause is called", async () => {
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

    await waitFor(() => {
      expect(mockPause).toHaveBeenCalled();
    });
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
