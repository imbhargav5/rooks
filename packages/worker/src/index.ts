import { useState, useEffect } from "react";

/**
 * useWorker hook
 *
 * @param {string} scriptPath - Path of the worker
 * @param {object} workerOptions - Additional options to create the worker
 * @param {object} attributes - Event handlers to attach to the worker
 * @return {Worker}
 */
export default function useWorker(
  scriptPath: string,
  workerOptions?: WorkerOptions,
  attributes?: Object
): Worker | undefined {
  const [worker, setWorker] = useState<Worker | undefined>(undefined);

  useEffect(() => {
    const _worker = new Worker(scriptPath, workerOptions);
    // attach attributes
    if (attributes) {
      for (const key in attributes) {
        _worker[key] = attributes[key];
      }
    }

    setWorker(_worker);

    return () => {
      _worker.terminate();
      setWorker(undefined);
    };
  }, [scriptPath]);

  return worker;
}
