import { languages } from "prismjs/components/prism-core";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-markup";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-css";
import "prismjs/components/prism-json";
import "prismjs/components/prism-bash";
import "prismjs/components/prism-markdown";
import "prismjs/components/prism-diff";

// NOTE: This highlights template-strings as strings of CSS
Prism.languages.insertBefore("jsx", "template-string", {
  "styled-template-string": {
    pattern: /(styled(\.\w+|\([^\)]*\))(\.\w+(\([^\)]*\))*)*|css|injectGlobal|createGlobalStyle|keyframes|\.extend|\.withComponent)`(?:\$\{[^}]+\}|\\\\|\\?[^\\])*?`/,
    lookbehind: true,
    greedy: true,
    inside: {
      interpolation: {
        pattern: /\$\{[^}]+\}/,
        inside: {
          "interpolation-punctuation": {
            pattern: /^\$\{|\}$/,
            alias: "punctuation"
          },
          rest: languages.jsx
        }
      },
      string: {
        pattern: /[^$;]+/,
        inside: languages.css,
        alias: "language-css"
      }
    }
  }
});

export { languages };
