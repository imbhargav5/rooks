import { render, screen, waitFor } from "@testing-library/react";
import { useRef } from "react";
import { vi } from "vitest";
import { useBoundingclientrect } from "@/hooks/useBoundingclientrect";

let currentRect = {
  x: 10,
  y: 20,
  width: 100,
  height: 50,
  top: 20,
  right: 110,
  bottom: 70,
  left: 10,
  toJSON: () => ({}),
};

const mockGetBoundingClientRect = vi.fn(() => currentRect);
const mockDisconnect = vi.fn();

describe("useBoundingclientrect", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    currentRect = {
      x: 10,
      y: 20,
      width: 100,
      height: 50,
      top: 20,
      right: 110,
      bottom: 70,
      left: 10,
      toJSON: () => ({}),
    };

    Object.defineProperty(HTMLElement.prototype, "getBoundingClientRect", {
      value: mockGetBoundingClientRect,
      writable: true,
      configurable: true,
    });

    global.MutationObserver = vi.fn().mockImplementation(function (
      callback: MutationCallback
    ) {
      return {
        observe: vi.fn(),
        disconnect: mockDisconnect,
      };
    }) as unknown as typeof MutationObserver;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  function TestComponent() {
    const ref = useRef<HTMLDivElement | null>(null);
    const rect = useBoundingclientrect(ref);

    return (
      <div>
        <div ref={ref} data-testid="target">
          Measure me
        </div>
        <div data-testid="rect">
          {rect ? `${rect.width}x${rect.height}` : "No rect"}
        </div>
        <div data-testid="position">
          {rect ? `${rect.left},${rect.top}` : "No position"}
        </div>
      </div>
    );
  }

  it("measures the element after mount", async () => {
    render(<TestComponent />);

    await waitFor(() => {
      expect(screen.getByTestId("rect")).toHaveTextContent("100x50");
    });

    expect(mockGetBoundingClientRect).toHaveBeenCalled();
  });

  it("exposes position values from the measured rect", async () => {
    render(<TestComponent />);

    await waitFor(() => {
      expect(screen.getByTestId("rect")).toHaveTextContent("100x50");
    });

    await waitFor(() => {
      expect(screen.getByTestId("position")).toHaveTextContent("10,20");
    });
  });
});
