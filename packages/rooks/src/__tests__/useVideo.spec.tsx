/**
 * @jest-environment jsdom
 */
import React from "react";
import {
  render,
  screen,
  waitFor,
  fireEvent,
  act,
} from "@testing-library/react";
import useVideo from "@/hooks/useVideo";

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

describe("useVideo behavior", () => {
  it("checks various states and controls", async () => {
    expect.assertions(27);
    const TestComponent = () => {
      const videoHook = useVideo();
      const [ref, state, controls] = videoHook;

      return (
        <div>
          <video data-testid="video-element" ref={ref} src="test-video.mp4" />
          <p data-testid="is-paused">{state.isPaused.toString()}</p>
          <p data-testid="is-muted">{state.isMuted.toString()}</p>
          <p data-testid="current-time">{state.currentTime}</p>
          <p data-testid="duration">{state.duration}</p>
          <p data-testid="volume">{state.volume}</p>
        </div>
      );
    };

    const { getByTestId } = screen;
    render(<TestComponent />);
    const videoElement = getByTestId("video-element") as HTMLVideoElement;

    // Test initial states
    expect(getByTestId("is-paused").textContent).toBe("true");
    expect(getByTestId("is-muted").textContent).toBe("false");
    expect(getByTestId("current-time").textContent).toBe("0");
    expect(getByTestId("duration").textContent).toBe("0"); // Since the video is not loaded yet
    expect(getByTestId("volume").textContent).toBe("1");

    // Test play and pause functionality
    act(() => {
      fireEvent.play(videoElement);
    });
    await act(async () => {
      await waitFor(() =>
        expect(getByTestId("is-paused").textContent).toBe("false")
      );
    });
    act(() => {
      fireEvent.pause(videoElement);
    });
    await act(async () => {
      await waitFor(() =>
        expect(getByTestId("is-paused").textContent).toBe("true")
      );
    });

    // Test mute and unmute functionality
    act(() => {
      fireEvent.volumeChange(videoElement, {
        target: { volume: 0, muted: true },
      });
    });
    await waitFor(() =>
      expect(getByTestId("is-muted").textContent).toBe("true")
    );

    act(() => {
      fireEvent.volumeChange(videoElement, {
        target: { volume: 1, muted: false },
      });
    });
    await waitFor(() =>
      expect(getByTestId("is-muted").textContent).toBe("false")
    );

    // Test updating current time
    act(() => {
      fireEvent.timeUpdate(videoElement, { target: { currentTime: 10 } });
    });
    await waitFor(() =>
      expect(getByTestId("current-time").textContent).toBe("10")
    );

    // Test updating volume
    act(() => {
      fireEvent.volumeChange(videoElement, { target: { volume: 0.5 } });
    });
    await waitFor(() => expect(getByTestId("volume").textContent).toBe("0.5"));
  });
  // Test cases go here
});
