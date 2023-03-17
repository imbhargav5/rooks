/**
 * @jest-environment jsdom
 */
import { useVideo } from "@/hooks/useVideo";
// write a simple test which checks if useAudio is defined
describe("useVideo", () => {
  it("is defined", () => {
    expect.hasAssertions();
    expect(useVideo).not.toBeUndefined();
  });
});
