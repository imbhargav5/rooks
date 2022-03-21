"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useMediaMatch = void 0;
var react_1 = require("react");
/**
 * useMediaMatch
 *
 * A react hook that signals whether or not a media query is matched.
 *
 * @param query The media query to signal on. Example, `"print"` will signal
 * `true` when previewing in print mode, and `false` otherwise.
 * @returns Whether or not the media query is currently matched.
 */
function useMediaMatch(query) {
  if (typeof window === "undefined") {
    console.warn("useMediaMatch cannot function as window is undefined.");
    return false;
  }
  var matchMedia = (0, react_1.useMemo)(
    function () {
      return window.matchMedia(query);
    },
    [query]
  );
  var _a = (0, react_1.useState)(function () {
      return matchMedia.matches;
    }),
    matches = _a[0],
    setMatches = _a[1];
  (0, react_1.useEffect)(
    function () {
      setMatches(matchMedia.matches);
      var listener = function (event_) {
        return setMatches(event_.matches);
      };
      if (matchMedia.addEventListener) {
        matchMedia.addEventListener("change", listener);
        return function () {
          return matchMedia.removeEventListener("change", listener);
        };
      } else {
        matchMedia.addListener(listener);
        return function () {
          return matchMedia.removeListener(listener);
        };
      }
    },
    [matchMedia]
  );
  return matches;
}
exports.useMediaMatch = useMediaMatch;
