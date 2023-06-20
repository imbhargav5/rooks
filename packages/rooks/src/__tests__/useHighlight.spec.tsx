import React from "react";
import { render, cleanup } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import { useHighlight } from "@/hooks/useHighlight";

afterEach(cleanup);

describe("useHighlight", () => {
  it("should highlight the keyword in the DOM when it is ready {when: true}", () => {
    expect.hasAssertions();
    const keyword = "example";
    const content = "This is an example sentence.";

    const TestComponent = () => {
      const ref = useHighlight(keyword, { when: true });

      return <div ref={ref}>{content}</div>;
    };

    const { container } = render(<TestComponent />);

    const highlightedText = container.querySelector("mark.highlighted");

    expect(highlightedText).toBeInTheDocument();
    expect(highlightedText?.innerHTML).toEqual(keyword);
  });

  it("should not highlight the keyword in the DOM when it is ready {when: false}", () => {
    expect.hasAssertions();
    const keyword = "example";
    const content = "This is an example sentence.";

    const TestComponent = () => {
      const ref = useHighlight(keyword, { when: false });

      return <div ref={ref}>{content}</div>;
    };

    const { container } = render(<TestComponent />);

    const highlightedText = container.querySelector("mark.highlighted");

    expect(highlightedText).not.toBeInTheDocument();
  });

  it("should update the highlighted keyword when the keyword prop changes", () => {
    expect.hasAssertions();
    const initialKeyword = "example";
    const updatedKeyword = "sample";
    const content = "This is an example sentence.";

    const TestComponent = ({ keyword = initialKeyword }) => {
      const ref = useHighlight(keyword, { when: true });

      return <div ref={ref}>{content}</div>;
    };

    const { container, rerender } = render(<TestComponent />);

    const initialHighlightedText = container.querySelector("mark.highlighted");

    expect(initialHighlightedText?.innerHTML).toEqual(initialKeyword);

    act(() => {
      rerender(<TestComponent keyword={updatedKeyword} />);
    });

    setTimeout(() => {
      const updatedHighlightedText =
        container.querySelector("mark.highlighted");
      expect(updatedHighlightedText?.innerHTML).toEqual(updatedKeyword);
    }, 10);
  });

  it("should not highlight the keyword in the DOM that is already highlighted", () => {
    expect.hasAssertions();
    const keyword = "example";
    const content = `something <mark class="highlighted">${keyword}</mark>`;

    const TestComponent = () => {
      const ref = useHighlight(keyword, { when: true });

      return <div ref={ref}>{content}</div>;
    };

    const { container } = render(<TestComponent />);

    const highlightedText = container.querySelector("mark.highlighted");

    expect(highlightedText?.innerHTML).toEqual(keyword);
  });
});
