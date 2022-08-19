import { useDocumentVisibilityState } from "@/hooks/useDocumentVisibilityState";

describe("useDocumentVisibilityState", () => {
  it("should be defined", () => {
    expect.hasAssertions();
    expect(useDocumentVisibilityState).toBeDefined();
  });
});
