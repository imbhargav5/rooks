import { useAudio } from "@/hooks/useAudio";

// write a simple test which checks if useAudio is defined
describe("useAudio", () => {
  it("is defined", () => {
    expect.hasAssertions();
    expect(useAudio).not.toBeUndefined();
  });
});
