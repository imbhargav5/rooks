/**
 * @vitest-environment node
 */
import { renderToString } from "react-dom/server";
import { useOnline } from "@/hooks/useOnline";

describe("useOnline SSR", () => {
  it("renders with the server snapshot when browser globals are unavailable", () => {
    expect.hasAssertions();

    function TestComponent() {
      const online = useOnline();
      return <span>{online === null ? "unknown" : String(online)}</span>;
    }

    expect(() => renderToString(<TestComponent />)).not.toThrow();
    expect(renderToString(<TestComponent />)).toContain("unknown");
  });
});
