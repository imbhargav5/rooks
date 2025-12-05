/**
 */
import React from "react";
import { render, screen, act } from "@testing-library/react";
import { useOrientation } from "@/hooks/useOrientation";

describe("useOrientation", () => {
  const TestComponent = () => {
    const orientation = useOrientation();

    return (
      <div>
        {orientation ? (
          <p data-testid="orientation-type">{orientation.type}</p>
        ) : (
          <p data-testid="no-orientation">No orientation</p>
        )}
      </div>
    );
  };

  beforeAll(() => {
    const eventListeners = new Map();

    Object.defineProperty(window, "screen", {
      value: {
        orientation: {
          type: "portrait-primary",
          addEventListener: (type: string, listener: () => void) => {
            eventListeners.set(type, listener);
          },
          removeEventListener: (type: string) => {
            eventListeners.delete(type);
          },
          dispatchEvent: (event: Event) => {
            const listener = eventListeners.get(event.type);
            if (listener) {
              listener(event);
            }
          },
        },
      },
      writable: true,
    });
  });

  it("returns the initial orientation", () => {
    expect.hasAssertions();
    render(<TestComponent />);
    const orientationTypeElement = screen.getByTestId("orientation-type");
    expect(orientationTypeElement.textContent).toBe("portrait-primary");
  });

  it("updates the orientation when the event is fired", () => {
    expect.hasAssertions();
    render(<TestComponent />);

    act(() => {
      const originalScreen = Object.getOwnPropertyDescriptor(window, "screen");

      Object.defineProperty(window, "screen", {
        ...originalScreen,
        value: {
          ...window.screen,
          orientation: {
            ...window.screen.orientation,
            type: "landscape-primary",
          },
        },
        writable: true,
      });
      (window.screen.orientation.type as string) = "landscape-primary";
      // dispatch event on window.screen
      // Object.defineProperty(window.screen.orientation, 'type', {
      //   value: 'landscape-primary',
      //   writable: true,
      // });

      // Manually dispatch the event
      const event = new Event("change");
      window.screen.orientation.dispatchEvent(event);
    });

    const orientationTypeElement = screen.getByTestId("orientation-type");
    expect(orientationTypeElement.textContent).toBe("landscape-primary");
  });
});
