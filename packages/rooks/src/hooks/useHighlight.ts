/**
 * useHighlight
 * @description search for a keyword in the DOM and highlight them
 * @see {@link https://rooks.vercel.app/docs/useHighlight}
 */
import { useEffect, useRef } from "react";

function useHighlight(
  keyword: string,
  {
    when = true,
    render = (match) => `<mark class="highlighted">${match}</mark>`,
  }: { when: boolean; render: (match: string) => string }
) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (keyword && when && ref.current) {
      const contentElement = ref.current;
      if (contentElement) {
        const text = contentElement.innerHTML;
        const regex = new RegExp(keyword, "g");
        const newText = text.replace(regex, render);
        contentElement.innerHTML = newText;
      }
    }
  }, [when, keyword, render]);

  return ref;
}

export { useHighlight };
