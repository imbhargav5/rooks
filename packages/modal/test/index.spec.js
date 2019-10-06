/**
 * @jest-environment jsdom
 */
import useModal, { ModalProvider, useToggle } from "..";

describe("useModal", () => {
  it("should be defined", () => {
    expect(useModal).toBeDefined();
    expect(ModalProvider).toBeDefined();
    expect(useToggle).toBeDefined();
  });
});

// TODO figure out tests
