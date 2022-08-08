/**
 * @jest-environment jsdom
 */
import React from "react";
import {
  act,
  cleanup,
  fireEvent,
  screen,
  render,
  waitFor,
} from "@testing-library/react";
import type { MutableRefObject } from "react";
import { useGeolocation } from "@/hooks/useGeolocation";

describe("useGeolocation", () => {
  type AppProps = {
    customRef?: MutableRefObject<number>;
  };
  let App: React.FC<AppProps>;
  beforeEach(() => {
    App = function ({ customRef }: AppProps) {
      const [when, setWhen] = React.useState(false);
      const geoObject = useGeolocation({ when });
      React.useEffect(() => {
        if (typeof customRef === "undefined") return;
        customRef.current++;
      });

      return (
        <div className="App">
          <button
            data-testid="get-geolocation-btn"
            onClick={() => {
              setWhen(true);
            }}
            type="button"
          >
            Get Geolocation
          </button>
          {geoObject ? (
            <p data-testid="geo-info">{JSON.stringify(geoObject)}</p>
          ) : null}
        </div>
      );
    };
  });
  afterEach(cleanup);

  it("click on get geolocation gives geolocation", async () => {
    expect.assertions(4);
    const mockGeolocation = {
      getCurrentPosition: jest
        .fn()
        .mockImplementationOnce((successCallback) =>
          successCallback({ coords: { latitude: 51.1, longitude: 45.3 } })
        ),
    };

    Object.defineProperty(global.navigator, "geolocation", {
      value: mockGeolocation,
      writable: true,
    });

    render(<App />);
    const getGeolocationButton = screen.getByTestId("get-geolocation-btn");
    act(() => {
      fireEvent.click(getGeolocationButton);
    });
    const geoInfoPElement = await screen.findByTestId("geo-info");
    screen.debug(screen.getByTestId("geo-info"));
    const geoObject = JSON.parse(geoInfoPElement.innerHTML);
    expect(`${geoObject.lat}`).toBe("51.1");
    expect(`${geoObject.lng}`).toBe("45.3");
    expect(geoObject.isError).toBe(false);
    expect(geoObject.message).toBe("");
  });

  it("render should not happen infinitely, when 'when' attribute changes to true", async () => {
    expect.hasAssertions();
    let customRef: MutableRefObject<number>;
    function TestComp() {
      customRef = React.useRef<number>(0);

      return <App customRef={customRef} />;
    }
    render(<TestComp />);
    const getGeolocationButton = screen.getByTestId("get-geolocation-btn");
    act(() => {
      fireEvent.click(getGeolocationButton);
    });
    await waitFor(() => expect(customRef.current).toBe(2));
  });

  // GeolocationPositionError - https://developer.mozilla.org/en-US/docs/Web/API/GeolocationPositionError
  it("should return error if user denied Geolocation", async () => {
    expect.assertions(2);
    const PERMISSION_DENIED_ERROR = new Error("User denied Geolocation");
    const mockGeolocation = {
      getCurrentPosition: jest
        .fn()
        .mockImplementationOnce((_, errorCallback) =>
          errorCallback(PERMISSION_DENIED_ERROR, false)
        ),
    };

    Object.defineProperty(global.navigator, "geolocation", {
      value: mockGeolocation,
      writable: true,
    });

    render(<App />);
    const getGeolocationButton = screen.getByTestId("get-geolocation-btn");
    act(() => {
      fireEvent.click(getGeolocationButton);
    });
    const geoInfoPElement = await screen.findByTestId("geo-info");
    const geoObject = JSON.parse(geoInfoPElement.innerHTML);
    expect(geoObject.isError).toBe(true);
    expect(geoObject.message).toBe("User denied Geolocation");
  });

  it("should return error if browser does not support Geolocation", async () => {
    expect.assertions(2);
    Object.defineProperty(global.navigator, "geolocation", {
      value: undefined,
      writable: false,
    });
    render(<App />);
    const getGeolocationButton = screen.getByTestId("get-geolocation-btn");
    act(() => {
      fireEvent.click(getGeolocationButton);
    });
    const geoInfoPElement = await screen.findByTestId("geo-info");
    const geoObject = JSON.parse(geoInfoPElement.innerHTML);
    expect(geoObject.isError).toBe(true);
    expect(geoObject.message).toBe(
      "Geolocation is not supported for this Browser/OS."
    );
  });
});
