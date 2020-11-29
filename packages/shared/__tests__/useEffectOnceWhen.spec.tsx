/**
 * @jest-environment jsdom
 */
import { useState } from "react";
import { useEffectOnceWhen } from "../useEffectOnceWhen";
import { act, renderHook, cleanup } from "@testing-library/react-hooks";

describe("useEffectOnceWhen", () => {
    let useHook;
    beforeEach(() => {
        useHook = function () {
            const [value, setValue] = useState(0)
            const [isEnabled, setIsEnabled] = useState(false)
            useEffectOnceWhen(() => {
                setValue(value + 1);
            }, isEnabled)
            return { value, setIsEnabled };
        }
    })
    afterEach(cleanup); // <-- add this

    it("should be defined", () => {
        expect(useEffectOnceWhen).toBeDefined();
    });

    it('runs immediately after condition is enabled', async () => {
        const { result } = renderHook(() => useHook())
        expect(result.current.value).toBe(0)
        act(() => {
            result.current.setIsEnabled(true);
        })
        expect(result.current.value).toBe(1);
    })

    it("doesn't run twice after condition is enabled", async () => {
        const { result } = renderHook(() => useHook())
        expect(result.current.value).toBe(0)
        act(() => {
            result.current.setIsEnabled(true);
        })
        expect(result.current.value).toBe(1);
        act(() => {
            result.current.setIsEnabled(false);
        })
        act(() => {
            result.current.setIsEnabled(true);
        })
        expect(result.current.value).toBe(1);

    })


});
