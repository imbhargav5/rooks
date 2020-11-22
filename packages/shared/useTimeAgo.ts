import { useEffect, useReducer, ReducerAction } from "react";
import { useInterval } from "./useInterval";
import timeago, { TimeAgoInterface } from "timeago.js";

const defaultOpts = {
  intervalMs: 1000
};

interface Options {
  intervalMs: number;
  locale: string;
  relativeDate: any;
}

function computeTimeAgo(input, locale, relativeDate) {
  let instance;
  if (relativeDate) {
    instance = timeago(relativeDate);
  } else {
    instance = timeago();
  }
  return instance.format(input, locale);
}

function reducer(state: string, action: any) {
  switch (action.type) {
    case "update":
      var { input, locale, relativeDate } = action.payload;
      return computeTimeAgo(input, locale, relativeDate);
    default:
      return state;
  }
}

/**
 * useTimeAgo hook
 * A hook that gives a human readable format of how much time has passed since a time
 * @deprecated
 * @param input 
 * @param argOpts 
 */
function useTimeAgo(input: any, argOpts: Options): string {
  const opts = Object.assign({}, argOpts, defaultOpts);
  const { intervalMs, locale, relativeDate } = opts;
  const [state, dispatcher] = useReducer(
    reducer,
    computeTimeAgo(input, locale, relativeDate)
  );
  useInterval(
    () => {
      update();
    },
    intervalMs,
    true
  );

  useEffect(() => {
    update();
  }, [input, argOpts]);
  return state;

  function update() {
    dispatcher({
      type: "update",
      payload: {
        input,
        locale,
        relativeDate
      }
    });
  }
}
export { useTimeAgo };
