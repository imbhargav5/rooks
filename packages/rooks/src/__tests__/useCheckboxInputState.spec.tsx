/**
 */
import { renderHook, act } from "@testing-library/react";
import { useCheckboxInputState } from "../hooks/useCheckboxInputState";

describe("useCheckboxInputState", () => {
  it("should initialize with the provided initial value", () => {
    const { result } = renderHook(() => useCheckboxInputState(true));
    expect(result.current.checked).toBe(true);
    expect(result.current.inputProps.checked).toBe(true);
  });

  it("should initialize as unchecked with false initial value", () => {
    const { result } = renderHook(() => useCheckboxInputState(false));
    expect(result.current.checked).toBe(false);
    expect(result.current.inputProps.checked).toBe(false);
  });

  it("should toggle the checked state", () => {
    const { result } = renderHook(() => useCheckboxInputState(false));
    
    act(() => {
      result.current.toggle();
    });
    
    expect(result.current.checked).toBe(true);
    expect(result.current.inputProps.checked).toBe(true);
    
    act(() => {
      result.current.toggle();
    });
    
    expect(result.current.checked).toBe(false);
    expect(result.current.inputProps.checked).toBe(false);
  });

  it("should set checked state explicitly", () => {
    const { result } = renderHook(() => useCheckboxInputState(false));
    
    act(() => {
      result.current.setChecked(true);
    });
    
    expect(result.current.checked).toBe(true);
    expect(result.current.inputProps.checked).toBe(true);
    
    act(() => {
      result.current.setChecked(false);
    });
    
    expect(result.current.checked).toBe(false);
    expect(result.current.inputProps.checked).toBe(false);
  });

  it("should handle onChange from input element", () => {
    const { result } = renderHook(() => useCheckboxInputState(false));
    
    act(() => {
      result.current.inputProps.onChange({
        target: { checked: true }
      } as React.ChangeEvent<HTMLInputElement>);
    });
    
    expect(result.current.checked).toBe(true);
    expect(result.current.inputProps.checked).toBe(true);
  });

  it("should return stable inputProps references", () => {
    const { result, rerender } = renderHook(() => useCheckboxInputState(false));
    
    const firstInputProps = result.current.inputProps;
    rerender();
    const secondInputProps = result.current.inputProps;
    
    // The references should remain stable when state hasn't changed
    expect(firstInputProps).toBe(secondInputProps);
  });

  it("should update inputProps when checked state changes", () => {
    const { result } = renderHook(() => useCheckboxInputState(false));
    
    const initialInputProps = result.current.inputProps;
    expect(initialInputProps.checked).toBe(false);
    
    act(() => {
      result.current.toggle();
    });
    
    const updatedInputProps = result.current.inputProps;
    expect(updatedInputProps.checked).toBe(true);
    // The object reference should be different when state changes
    expect(initialInputProps).not.toBe(updatedInputProps);
  });

  it("should provide stable toggle and setChecked function references", () => {
    const { result, rerender } = renderHook(() => useCheckboxInputState(false));
    
    const firstToggle = result.current.toggle;
    const firstSetChecked = result.current.setChecked;
    
    rerender();
    
    const secondToggle = result.current.toggle;
    const secondSetChecked = result.current.setChecked;
    
    expect(firstToggle).toBe(secondToggle);
    expect(firstSetChecked).toBe(secondSetChecked);
  });
});