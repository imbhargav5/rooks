import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import React, { useRef } from "react";
import { useMutationObserver } from "../hooks/useMutationObserver";

describe("useMutationObserver", () => {
  it("should watch for children changes being made to the DOM node", () => {
    expect.hasAssertions();
    let id = 1;
    const TestComp = () => {
      const ref = useRef<HTMLUListElement>(null);
      const addTodo = () => {
        const todo = document.createElement("li");
        id += 1;
        todo.textContent = `todo ${id}`;
        ref.current?.appendChild(todo);
      };

      useMutationObserver(ref, (mutations) => {
        for (const mutation of mutations) {
          if (mutation.type === "childList") {
            for (const node of Array.from(mutation.addedNodes)) {
              console.log(`${node.textContent} has been added to todo list.`);
            }
          }
        }
      });

      return (
        <div>
          <ul ref={ref}>
            <li>todo {id}</li>
          </ul>
          <button onClick={addTodo} type="button">
            Add Todo
          </button>
        </div>
      );
    };

    render(<TestComp />);
    const button = screen.getByText(/add todo/iu);
    fireEvent.click(button);
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
  });

  it("should observe the same DOM node multiple times when provide multiple listeners", async () => {
    expect.hasAssertions();
    const listener1 = jest.fn();
    const listener2 = jest.fn();
    const TestComp = () => {
      const ref = useRef<HTMLDivElement>(null);
      useMutationObserver(ref, listener1);
      useMutationObserver(ref, listener2);

      return (
        <div>
          <div ref={ref}>status: coding</div>
          <button
            onClick={() => {
              if (ref.current) {
                ref.current.textContent = "status: Gaming";
              }
            }}
            type="button"
          >
            Start to play game!
          </button>
        </div>
      );
    };

    render(<TestComp />);
    const button = screen.getByText(/start to play game!/iu);
    fireEvent.click(button);
    await waitFor(() => {
      expect(listener1).toHaveBeenCalled();
      expect(listener2).toHaveBeenCalled();
    });
  });

  it("should observe the DOM node multiple times even if the listener is same", async () => {
    expect.hasAssertions();
    let calls = 0;
    const TestComp = () => {
      const ref = useRef<HTMLDivElement>(null);

      const listener = () => {
        calls++;
      };

      useMutationObserver(ref, listener);
      useMutationObserver(ref, listener);

      return (
        <div>
          <div ref={ref}>status: coding</div>
          <button
            onClick={() => {
              if (ref.current) {
                ref.current.textContent = "status: Gaming";
              }
            }}
            type="button"
          >
            Start to play game!
          </button>
        </div>
      );
    };

    render(<TestComp />);
    const button = screen.getByText(/start to play game!/iu);
    fireEvent.click(button);
    await waitFor(() => {
      expect(calls).toBe(2);
    });
  });

  it("should stop the MutationObserver instance from receiving further notifications", async () => {
    expect.hasAssertions();
    let calls = 0;
    const TestComp = () => {
      const ref = useRef<HTMLDivElement>(null);

      const listener = (_: unknown, observer: MutationObserver) => {
        if (calls === 1) {
          observer.disconnect();
        }

        calls++;
      };

      useMutationObserver(ref, listener);

      return (
        <div>
          <div ref={ref}>status: coding</div>
          <button
            onClick={() => {
              if (ref.current) {
                ref.current.textContent = "status: Gaming";
              }
            }}
            type="button"
          >
            Start to play game!
          </button>
        </div>
      );
    };

    render(<TestComp />);
    const button = screen.getByText(/start to play game!/iu);
    fireEvent.click(button);
    fireEvent.click(button);
    fireEvent.click(button);
    await waitFor(() => {
      expect(calls).toBe(1);
    });
  });
});
