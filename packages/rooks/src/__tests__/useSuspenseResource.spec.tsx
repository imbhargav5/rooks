import { waitFor, render, screen, act, cleanup } from "@testing-library/react";
import React, { Suspense } from "react";
import {
  createSuspenseResource,
  useSuspenseResource,
} from "../hooks/useSuspenseResource";
import { ErrorBoundary } from "./ErrorBoundary";

describe("useSuspenseResource", () => {
  it("should be defined", () => {
    expect.hasAssertions();
    expect(useSuspenseResource).toBeDefined();
  });

  beforeEach(() => {
    jest.useFakeTimers();
    jest.spyOn(global, "setTimeout");
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  // eslint-disable-next-line jest/prefer-expect-assertions
  it("should resolve a promise in suspense correctly", async () => {
    const promise = new Promise<string>((resolve) => {
      setTimeout(() => {
        resolve("success");
      }, 1000);
    });
    const resource = createSuspenseResource<string>(promise);
    const App = () => {
      const data = resource.read();
      console.log(data);
      return <div data-testid="resourceValue">{data}</div>;
    };
    render(
      <Suspense fallback={<div data-testid="loading" />}>
        <App />
      </Suspense>
    );
    expect.hasAssertions();
    expect(screen.getByTestId("loading")).toBeInTheDocument();
    expect(setTimeout).toHaveBeenCalledWith(expect.any(Function), 1000);
    act(() => {
      jest.runAllTimers();
    });
    await waitFor(() => screen.getByTestId("resourceValue"));
    expect(screen.getByTestId("resourceValue").innerHTML).toBe("success");
  });

  it("should throw an error if the promise errors out", async () => {
    expect.hasAssertions();
    const promise = new Promise<string>((_resolve, reject) => {
      setTimeout(() => {
        reject(new Error("failed"));
      }, 1000);
    });
    const resource = createSuspenseResource<string>(promise);
    const App = () => {
      const data = resource.read();
      console.log(data);
      return <div data-testid="resourceValue">{data}</div>;
    };
    render(
      <ErrorBoundary>
        <Suspense fallback={<div data-testid="loading" />}>
          <App />
        </Suspense>
      </ErrorBoundary>
    );
    expect.hasAssertions();
    expect(screen.getByTestId("loading")).toBeInTheDocument();
    expect(setTimeout).toHaveBeenCalledWith(expect.any(Function), 1000);
    act(() => {
      jest.runAllTimers();
    });
    await waitFor(() => screen.getByTestId("error"));
    expect(screen.getByTestId("error").innerHTML).toBe("failed");
  });
});
