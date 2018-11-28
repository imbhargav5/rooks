import { useEffect, useReducer } from "react";
import useInterval from "@rooks/use-interval";
import timeago from "timeago.js";

const defaultOpts = {
  intervalMs: 1000
};

function computeTimeAgo(input, locale, relativeDate) {
  let instance;
  if (relativeDate) {
    instance = timeago(relativeDate);
  } else {
    instance = timeago();
  }
  return instance.format(input, locale);
}

function useTimeAgo(input, argOpts) {
  const opts = Object.assign({}, argOpts, defaultOpts);
  const { intervalMs, locale, relativeDate } = opts;
  const [state, dispatcher] = useReducer(reducer, {
    timeAgo: computeTimeAgo(input, locale, relativeDate)
  });
  useInterval(
    () => {
      dispatcher({
        type: "update"
      });
    },
    intervalMs,
    true
  );

  function reducer(state, action) {
    switch (action.type) {
      case "update":
        return { timeAgo: computeTimeAgo(input, locale, relativeDate) };
      default:
        return state;
    }
  }

  useEffect(
    () => {
      dispatcher({
        type: "update"
      });
    },
    [input, argOpts]
  );

  return state.timeAgo;
}
module.exports = useTimeAgo;
