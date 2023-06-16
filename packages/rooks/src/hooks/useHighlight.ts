/**
 * useHighlight
 * @description search for a keyword in the DOM and highlight them
 * @see {@link https://rooks.vercel.app/docs/useHighlight}
 */
import { useEffect, useRef } from "react";

function useHighlight({
  isReady = false,
  keyword = "",
}: {
  isReady: boolean;
  keyword: string;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (keyword && isReady) {
      const contentElement = ref.current;
      if (contentElement) {
        const text = contentElement.innerHTML;
        const regex = new RegExp(keyword, "g");
        const newText = text.replace(
          regex,
          `<mark class="highlighted">${keyword}</mark>`
        );
        contentElement.innerHTML = newText;
      }
    }
  }, [isReady, keyword]);

  return ref;
}

export { useHighlight };
