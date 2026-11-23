import { renderHook, act } from "@testing-library/react";
import { useSpeech } from "@/hooks/useSpeech";

class FakeUtterance {
  text: string;
  lang = "";
  volume = 0;
  pitch = 0;
  rate = 0;
  voice: unknown = null;
  onstart: (() => void) | null = null;
  onend: (() => void) | null = null;
  onerror: (() => void) | null = null;
  constructor(text: string) {
    this.text = text;
  }
}

describe("useSpeech coverage", () => {
  let synth: {
    speak: ReturnType<typeof vi.fn>;
    cancel: ReturnType<typeof vi.fn>;
    pause: ReturnType<typeof vi.fn>;
    resume: ReturnType<typeof vi.fn>;
    getVoices: ReturnType<typeof vi.fn>;
  };
  const voices = [
    { voiceURI: "voice-a", name: "A" },
    { voiceURI: "voice-b", name: "B" },
  ];
  let spoken: FakeUtterance[];

  beforeEach(() => {
    spoken = [];
    synth = {
      speak: vi.fn((u: FakeUtterance) => {
        spoken.push(u);
      }),
      cancel: vi.fn(),
      pause: vi.fn(),
      resume: vi.fn(),
      getVoices: vi.fn(() => voices),
    };
    vi.stubGlobal("SpeechSynthesisUtterance", FakeUtterance);
    Object.defineProperty(window, "speechSynthesis", {
      configurable: true,
      writable: true,
      value: synth,
    });
  });

  afterEach(() => {
    delete (window as any).speechSynthesis;
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("logs an error and does nothing when the Web Speech API is unsupported", () => {
    delete (window as any).speechSynthesis;
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const { result } = renderHook(() => useSpeech({ text: "hi" }));
    act(() => {
      result.current.start();
    });
    expect(errorSpy).toHaveBeenCalledWith(
      "Web Speech API is not supported in your browser."
    );
    expect(result.current.isPlaying).toBe(false);
  });

  it("configures the utterance and selects the voice matching voiceURI", () => {
    const { result } = renderHook(() =>
      useSpeech({
        text: "hello",
        language: "fr-FR",
        voiceURI: "voice-b",
        volume: 0.5,
        pitch: 1.5,
        rate: 2,
      })
    );
    act(() => {
      result.current.start();
    });
    const utterance = spoken[0];
    expect(utterance.text).toBe("hello");
    expect(utterance.lang).toBe("fr-FR");
    expect(utterance.volume).toBe(0.5);
    expect(utterance.pitch).toBe(1.5);
    expect(utterance.rate).toBe(2);
    expect(utterance.voice).toBe(voices[1]);
  });

  it("leaves the voice unset when voiceURI matches nothing", () => {
    const { result } = renderHook(() =>
      useSpeech({ text: "hello", voiceURI: "missing" })
    );
    act(() => {
      result.current.start();
    });
    expect(spoken[0].voice).toBeNull();
  });

  it("tracks playing state via utterance events and calls the latest onEnd", () => {
    const onEnd = vi.fn();
    const { result } = renderHook(() => useSpeech({ text: "hello", onEnd }));
    act(() => {
      result.current.start();
    });
    act(() => {
      spoken[0].onstart?.();
    });
    expect(result.current.isPlaying).toBe(true);
    act(() => {
      spoken[0].onend?.();
    });
    expect(result.current.isPlaying).toBe(false);
    expect(onEnd).toHaveBeenCalledTimes(1);

    act(() => {
      spoken[0].onstart?.();
    });
    act(() => {
      spoken[0].onerror?.();
    });
    expect(result.current.isPlaying).toBe(false);
  });

  it("cancels the previous utterance when started again", () => {
    const { result } = renderHook(() => useSpeech({ text: "hello" }));
    act(() => {
      result.current.start();
    });
    expect(synth.cancel).not.toHaveBeenCalled();
    act(() => {
      result.current.start();
    });
    expect(synth.cancel).toHaveBeenCalledTimes(1);
    expect(spoken).toHaveLength(2);
  });

  it("updates the active utterance when options change while playing", () => {
    const { result, rerender } = renderHook(
      (props: { text: string; voiceURI?: string; volume: number }) =>
        useSpeech(props),
      { initialProps: { text: "one", volume: 1 } }
    );
    act(() => {
      result.current.start();
    });
    act(() => {
      spoken[0].onstart?.();
    });
    rerender({ text: "two", voiceURI: "voice-a", volume: 0.25 });
    expect(spoken[0].text).toBe("two");
    expect(spoken[0].volume).toBe(0.25);
    expect(spoken[0].voice).toBe(voices[0]);

    rerender({ text: "three", voiceURI: "missing", volume: 0.25 });
    expect(spoken[0].text).toBe("three");
    expect(spoken[0].voice).toBe(voices[0]);
  });

  it("pauses, resumes and stops through speechSynthesis", () => {
    const { result } = renderHook(() => useSpeech({ text: "hello" }));
    act(() => {
      result.current.start();
    });
    act(() => {
      spoken[0].onstart?.();
    });
    act(() => {
      result.current.pause();
    });
    expect(synth.pause).toHaveBeenCalledTimes(1);
    expect(result.current.isPlaying).toBe(false);

    act(() => {
      result.current.pause();
    });
    expect(synth.pause).toHaveBeenCalledTimes(1);

    act(() => {
      result.current.resume();
    });
    expect(synth.resume).toHaveBeenCalledTimes(1);
    expect(result.current.isPlaying).toBe(true);

    act(() => {
      result.current.resume();
    });
    expect(synth.resume).toHaveBeenCalledTimes(1);

    act(() => {
      result.current.stop();
    });
    expect(synth.cancel).toHaveBeenCalledTimes(1);
    expect(result.current.isPlaying).toBe(false);
  });

  it("pause, resume and stop are no-ops without speechSynthesis", () => {
    const { result } = renderHook(() => useSpeech({ text: "hello" }));
    delete (window as any).speechSynthesis;
    Object.defineProperty(window, "speechSynthesis", {
      configurable: true,
      writable: true,
      value: undefined,
    });
    act(() => {
      result.current.pause();
      result.current.resume();
      result.current.stop();
    });
    expect(result.current.isPlaying).toBe(false);
  });
});
