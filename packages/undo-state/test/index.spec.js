/**
 * @jest-environment jsdom
 */
import React from "react"
import useUndoState from ".."
import { render, cleanup, fireEvent, act } from "@testing-library/react"

// eslint-disable-next-line react/prop-types
const App = ({ defaultValue, options }) => {
  const [value, setValue, undo] = useUndoState(defaultValue, options)

  return (
    <div>
      <button onClick={() => setValue(current => (current || 0) + 1)} data-testid="value">
        {value}
      </button>
      <button onClick={undo} data-testid="undo">
        Undo
      </button>
    </div>
  )
}

describe('useUndoState', () => {
  afterEach(cleanup)

  it('should be defined', () => {
    expect(useUndoState).toBeDefined()
  })

  it('should honor default value', () => {
    const { getByTestId } = render(<App defaultValue={42} />)
    const button = getByTestId('value')

    expect(button.innerHTML).toBe('42')
  })

  it('should show latest value', () => {
    const { getByTestId } = render(<App />)
    const button = getByTestId('value')

    act(() => {
      fireEvent.click(button)
    })

    expect(button.innerHTML).toBe('1')
  })

  it('should show previous value after undo', () => {
    const { getByTestId } = render(<App />)
    const button = getByTestId('value')
    const undoButton = getByTestId('undo')

    act(() => {
      fireEvent.click(button)
      fireEvent.click(button)
      fireEvent.click(undoButton)
    })

    expect(button.innerHTML).toBe('1')
  })

  it('should show initial value after multiple undo', () => {
    const { getByTestId } = render(<App defaultValue={42} />)
    const button = getByTestId('value')
    const undoButton = getByTestId('undo')

    act(() => {
      fireEvent.click(button)
      fireEvent.click(button)
      fireEvent.click(button)
      
      fireEvent.click(undoButton)
      fireEvent.click(undoButton)
      fireEvent.click(undoButton)
      fireEvent.click(undoButton)
      fireEvent.click(undoButton)
    })

    expect(button.innerHTML).toBe('42')
  })

  it('should respect maxSize option', () => {
    const { getByTestId } = render(<App defaultValue={42} options={{ maxSize: 2 }} />)
    const button = getByTestId('value')
    const undoButton = getByTestId('undo')

    act(() => {
      fireEvent.click(button)
      fireEvent.click(button)
      fireEvent.click(button)
      fireEvent.click(button)
      
      fireEvent.click(undoButton)
      fireEvent.click(undoButton)
      fireEvent.click(undoButton)
      fireEvent.click(undoButton)
    })

    expect(button.innerHTML).toBe('44')
  })
})

// figure out tests
