import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { useState } from "react";
import { useLockBodyScroll } from "@/hooks/useLockBodyScroll";

function ExampleComponent() {
  const [isLocked, setIsLocked] = useState(false);

  // Lock body scroll when isLocked is true
  useLockBodyScroll(isLocked);

  return (
    <div>
      <button onClick={() => setIsLocked(!isLocked)}>
        {isLocked ? "Unlock scroll" : "Lock scroll"}
      </button>
    </div>
  );
}

describe("useLockBodyScroll", () => {
  test("lock and unlock body scroll", () => {
    expect.hasAssertions();
    render(<ExampleComponent />);

    const button = screen.getByText("Lock scroll");

    // Check if the body scroll is initially unlocked
    expect(document.body.style.overflow).toBe("");

    // Lock the body scroll
    act(() => {
      fireEvent.click(button);
    });
    expect(document.body.style.overflow).toBe("hidden");
    expect(button.textContent).toBe("Unlock scroll");

    // Unlock the body scroll
    act(() => {
      fireEvent.click(button);
    });
    expect(document.body.style.overflow).toBe("");
    expect(button.textContent).toBe("Lock scroll");
  });
});
