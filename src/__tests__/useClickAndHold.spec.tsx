/**
 * @jest-environment jsdom
 */
import { act, render, fireEvent } from "@testing-library/react";
import React from "react";
import { useClickAndHold } from "../hooks/useClickAndHold";

describe("useClickAndHold", () => {
  it("should be defined", () => {
    expect(useClickAndHold).toBeDefined();
  });

  it("should call onAction one time when is normal click", () => {
    const actionSpy = jest.fn();
    const { getByTestId } = render(<Component onAction={actionSpy} />);
    act(() => {
      fireEvent.click(getByTestId("btn"));
    });
    expect(actionSpy).toHaveBeenCalledTimes(1);
    expect(actionSpy).toHaveBeenCalledWith(false);
  });

  it("should call onAction based on time holding the button with mouse", async () => {
    expect.assertions(2);

    const DELAY = 200;
    const NUM_CLICKS = 3;
    const actionSpy = jest.fn();
    const { getByTestId } = render(
      <Component delay={DELAY} onAction={actionSpy} />
    );

    await act(async () => {
      fireEvent.mouseDown(getByTestId("btn"));
      await sleep(NUM_CLICKS * DELAY + 50);
      fireEvent.mouseUp(getByTestId("btn"));
      await sleep(100);
    });

    expect(actionSpy).toHaveBeenCalledTimes(3);
    expect(actionSpy).toHaveBeenCalledWith(true);
  });

  it("should stop the onAction event calls when mouse leave of element", async () => {
    expect.assertions(2);

    const DELAY = 200;
    const NUM_CLICKS = 3;
    const actionSpy = jest.fn();
    const { getByTestId } = render(
      <Component delay={DELAY} onAction={actionSpy} />
    );

    await act(async () => {
      fireEvent.mouseDown(getByTestId("btn"));
      await sleep(NUM_CLICKS * DELAY + 50);
      fireEvent.mouseLeave(getByTestId("btn"));
      await sleep(DELAY);
    });

    expect(actionSpy).toHaveBeenCalledTimes(3);
    expect(actionSpy).toHaveBeenCalledWith(true);
  });

  it("should call onAction based on time holding button with touch", async () => {
    expect.assertions(2);

    const DELAY = 200;
    const NUM_CLICKS = 3;
    const actionSpy = jest.fn();
    const { getByTestId } = render(
      <Component delay={DELAY} onAction={actionSpy} />
    );

    await act(async () => {
      fireEvent.touchStart(getByTestId("btn"));
      await sleep(NUM_CLICKS * DELAY + 50);
      fireEvent.touchEnd(getByTestId("btn"));
    });

    expect(actionSpy).toHaveBeenCalledTimes(3);
    expect(actionSpy).toHaveBeenCalledWith(true);
  });

  it("should stop onAction calls after provide disabled arg as true", async () => {
    expect.assertions(2);

    const DELAY = 200;
    const NUM_CLICKS = 3;
    const actionSpy = jest.fn();
    const { getByTestId, rerender } = render(
      <Component delay={DELAY} onAction={actionSpy} />
    );

    await act(async () => {
      fireEvent.mouseDown(getByTestId("btn"));
      await sleep(NUM_CLICKS * DELAY + 50);
    });

    rerender(<Component delay={DELAY} disabled onAction={actionSpy} />);

    await act(() => sleep(DELAY));

    expect(actionSpy).toHaveBeenCalledTimes(3);
    expect(actionSpy).toHaveBeenCalledWith(true);
  });
});

type AppProps = {
  onAction: (isHolding: boolean) => void;
  delay?: number;
  disabled?: boolean;
};

function Component({ onAction, delay = 300, disabled = false }: AppProps) {
  const handlers = useClickAndHold(onAction, { delay, disabled });

  return (
    <div>
      <button type="button" {...handlers} data-testid="btn">
        Button
      </button>
    </div>
  );
}

function sleep(ms: number) {
  return new Promise<void>((resolve) => {
    setTimeout(() => resolve(), ms);
  });
}
