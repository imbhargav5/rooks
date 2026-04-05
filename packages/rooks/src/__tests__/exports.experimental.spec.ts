import * as experimental from "@/experimental";
import * as stable from "@/index";

describe("experimental exports", () => {
  it("exports disposable hooks from rooks/experimental only", () => {
    expect(experimental.useDisposable).toBeDefined();
    expect(experimental.useAsyncDisposable).toBeDefined();
    expect("useDisposable" in stable).toBe(false);
    expect("useAsyncDisposable" in stable).toBe(false);
  });
});
