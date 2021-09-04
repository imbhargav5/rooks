/**
 * @jest-environment jsdom
 */
import React from "react";
import {
  render,
  getByTestId,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import { cleanup } from "@testing-library/react-hooks";
import { useGeolocation } from "../hooks/useGeolocation";

describe("useGeolocation", () => {
  let App;
  beforeEach(() => {
    const mockGeolocation = {
      getCurrentPosition: jest.fn().mockImplementationOnce((success) =>
        Promise.resolve(
          success({
            coords: {
              latitude: 51.1,
              longitude: 45.3,
            },
          })
        )
      ),
    };

    // @ts-ignore
    global.navigator.geolocation = mockGeolocation;

    App = function (props) {
      let { customRef } = props;
      if (!customRef) {
        customRef = React.useRef(0);
      }
      const [when, setWhen] = React.useState(false);
      const renderCountRef = customRef;
      const [geoObj, geoErr] = useGeolocation({
        when,
      });

      React.useEffect(() => {
        renderCountRef.current++;
      });

      return (
        <div className="App">
          <button
            data-testid="get-geolocation-btn"
            onClick={() => {
              setWhen(true);
            }}
          >
            Get Geolocation
          </button>
          <p data-testid="geo-info">{geoObj && JSON.stringify(geoObj)}</p>
        </div>
      );
    };
    //end
  });
  afterEach(cleanup);

  it("should be defined", () => {
    expect(useGeolocation).toBeDefined();
  });

  it("click on get geolocation gives geolocation", async () => {
    let container;
    act(() => {
      container = render(<App />).container;
    });

    const getGeolocationBtn = getByTestId(container, "get-geolocation-btn");
    const geoInfoPElem = getByTestId(container, "geo-info");

    act(() => {
      fireEvent.click(getGeolocationBtn);
    });
    await waitFor(() => {
      const { coords } = JSON.parse(geoInfoPElem.innerHTML);
      expect(`${coords.latitude}`).toBe("51.1");
      expect(`${coords.longitude}`).toBe("45.3");
    });
  });

  it("render should not happen infinitely, when 'when' attribute changes to true ", async () => {
    let container;
    let customRef;
    function TestComp() {
      customRef = React.useRef(0);
      return <App customRef={customRef} />;
    }
    act(() => {
      container = render(<TestComp />).container;
    });
    const getGeolocationBtn = getByTestId(container, "get-geolocation-btn");
    act(() => {
      fireEvent.click(getGeolocationBtn);
    });
    await waitFor(() => {
      expect(customRef.current).toBe(3);
    });
  });
});
