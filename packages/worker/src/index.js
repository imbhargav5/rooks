import { useState, useEffect } from "react";

const defaultOptions = {
  onMessage: () => {},
  onMessageError: () => {}
};

export default function useWorker(scriptPath, opts) {
  const options = Object.assign({}, defaultOptions, opts);
  const { onMessage, onMessageError } = options;
  const [worker, setWorker] = useState(undefined);

  useEffect(
    () => {
      let _worker = new Worker(scriptPath);
      _worker.onmessage = onMessage;
      _worker.onmessageerror = onMessageError;
      setWorker(_worker);

      return () => {
        _worker.terminate();
        setWorker(undefined);
      };
    },
    [scriptPath]
  );
  return worker;
}
