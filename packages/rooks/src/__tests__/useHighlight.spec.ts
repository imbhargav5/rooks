import { render, cleanup } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import useHighlight from './useHighlight';

afterEach(cleanup);

describe('useHighlight', () => {
  it('should highlight the keyword in the DOM when isReady is true', () => {
    const keyword = 'example';
    const content = 'This is an example sentence.';
    
    const TestComponent = () => {
      const ref = useHighlight({ isReady: true, keyword });

      return <div ref={ref}>{content}</div>;
    };
    
    const { container } = render(<TestComponent />);
    
    const highlightedText = container.querySelector('mark.highlighted');
    
    expect(highlightedText).toBeInTheDocument();
    expect(highlightedText?.innerHTML).toEqual(keyword);
  });

  it('should not highlight the keyword in the DOM when isReady is false', () => {
    const keyword = 'example';
    const content = 'This is an example sentence.';

    const TestComponent = () => {
      const ref = useHighlight({ isReady: false, keyword });

      return <div ref={ref}>{content}</div>;
    };

    const { container } = render(<TestComponent />);

    const highlightedText = container.querySelector('mark.highlighted');

    expect(highlightedText).not.toBeInTheDocument();
  });

  it('should update the highlighted keyword when the keyword prop changes', () => {
    const initialKeyword = 'example';
    const updatedKeyword = 'sample';
    const content = 'This is an example sentence.';

    const TestComponent = () => {
      const ref = useHighlight({ isReady: true, keyword: initialKeyword });

      return <div ref={ref}>{content}</div>;
    };

    const { container, rerender } = render(<TestComponent />);

    const initialHighlightedText = container.querySelector('mark.highlighted');

    expect(initialHighlightedText?.innerHTML).toEqual(initialKeyword);

    act(() => {
      rerender(<TestComponent />);
    });

    const updatedHighlightedText = container.querySelector('mark.highlighted');

    expect(updatedHighlightedText?.innerHTML).toEqual(updatedKeyword);
  });
});

