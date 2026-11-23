import { DOMRectPolyfill } from "@/utils/domrect-polyfill";

describe("DOMRectPolyfill", () => {
  it("defaults all values to zero", () => {
    const rect = new DOMRectPolyfill();
    expect(rect.toJSON()).toEqual({
      bottom: 0,
      height: 0,
      left: 0,
      right: 0,
      top: 0,
      width: 0,
      x: 0,
      y: 0,
    });
  });

  it("computes edges from constructor args", () => {
    const rect = new DOMRectPolyfill(10, 20, 30, 40);
    expect(rect.top).toBe(20);
    expect(rect.left).toBe(10);
    expect(rect.right).toBe(40);
    expect(rect.bottom).toBe(60);
    expect(rect.toJSON()).toEqual({
      bottom: 60,
      height: 40,
      left: 10,
      right: 40,
      top: 20,
      width: 30,
      x: 10,
      y: 20,
    });
  });

  it("fromRect fills missing values with zero", () => {
    const rect = DOMRectPolyfill.fromRect({ x: 1, height: 5 });
    expect(rect).toBeInstanceOf(DOMRectPolyfill);
    expect(rect.toJSON()).toMatchObject({ x: 1, y: 0, width: 0, height: 5 });
    expect(DOMRectPolyfill.fromRect().width).toBe(0);
  });
});
