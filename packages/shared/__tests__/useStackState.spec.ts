import { renderHook } from "@testing-library/react-hooks";
import TestRenderer from 'react-test-renderer';
import { useStackState } from "../useStackState";

const {act} = TestRenderer;

describe("useStackState", () => {
  it("should be defined", () => {
    expect(useStackState).toBeDefined()
  })
  it('should initialize correctly', () =>{
    const { result } = renderHook(() => useStackState([1,2,3]))    
    expect(result.current[0]).toEqual([1,2,3])
  })
  it('should return length correctly', () =>{
    const { result } = renderHook(() => useStackState([1,2,3]))    
    const [, controls] = result.current;
    expect(controls.length).toBe(3)
  })
  it('should push correctly', () =>{
    const { result } = renderHook(() => useStackState([1,2,3]))    
    
    act(() => {
        result.current[1].push(7);
    })
    const [list, controls] = result.current;
    expect(list).toEqual([1,2,3,7])
    expect(controls.length).toBe(4)
  })
  it('should peek and pop correctly', () =>{
    const { result } = renderHook(() => useStackState([1,2,3]))    
    
    act(() => {
        result.current[1].push(7);
    })    
    act(() => {
        result.current[1].push(11);
    })
    const [, controls] = result.current;
    expect(controls.peek()).toEqual(11)
    act(() => {
        result.current[1].pop();
    })
    act(() => {
        result.current[1].pop();
    })
    expect(result.current[1].peek()).toEqual(3)
    expect(result.current[1].length).toEqual(3)
  })
  it("handles empty arrays", () => {
    const { result } = renderHook(() => useStackState([]))    
    act(() => {
        
        result.current[1].pop();
    })
    act(() => {
        
        result.current[1].pop();
    })
    const [, controls] = result.current;
    expect(controls.peek()).toEqual(undefined)
    expect(controls.length).toEqual(0)
    act(() => {
        result.current[1].push(7);
    })
    act(() => {
        result.current[1].push(11);
    })
    expect(result.current[2]).toEqual([11,7]);
    expect(result.current[1].peek()).toEqual(11)
    act(() => {
        result.current[1].pop();
    })
    expect(result.current[2]).toEqual([7]);
    expect(result.current[1].peek()).toEqual(7)
    act(() => {
        result.current[1].pop();
    })
    expect(result.current[1].peek()).toBeUndefined()
    expect(result.current[1].length).toEqual(0)
    expect(result.current[2]).toEqual([])
  })
});