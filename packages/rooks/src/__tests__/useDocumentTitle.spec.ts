import { renderHook } from "@testing-library/react-hooks";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

describe("useDocumentTitle", () => {
  // Mock window.document.title
  Object.defineProperty(window.document, "title", {
    value: "",
    writable: true,
  });

  it("should set document title", () => {
    expect.hasAssertions();
    const { rerender } = renderHook(({ title }) => useDocumentTitle(title), {
      initialProps: { title: "Initial Title" },
    });

    expect(document.title).toBe("Initial Title");

    rerender({ title: "Updated Title" });

    expect(document.title).toBe("Updated Title");
  });

  it("should reset document title when resetOnUnmount is true", () => {
    expect.hasAssertions();
    // Set an initial document title
    const initialTitle = "Initial Title";
    document.title = initialTitle;

    const { unmount } = renderHook(
      ({ title, options }) => useDocumentTitle(title, options),
      {
        initialProps: {
          title: "Title with Reset",
          options: { resetOnUnmount: true },
        },
      }
    );

    expect(document.title).toBe("Title with Reset");

    unmount();

    expect(document.title).toBe(initialTitle);
  });

  it("should not reset document title when resetOnUnmount is false or not provided", () => {
    expect.hasAssertions();
    const { unmount } = renderHook(
      ({ title, options }) => useDocumentTitle(title, options),
      {
        initialProps: {
          title: "Title without Reset",
          options: { resetOnUnmount: false },
        },
      }
    );

    expect(document.title).toBe("Title without Reset");

    unmount();

    expect(document.title).toBe("Title without Reset");
  });
});
