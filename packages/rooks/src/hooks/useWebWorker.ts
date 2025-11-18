import { useState, useCallback, useEffect, useRef } from "react";

/**
 * Status of the web worker
 */
type WorkerStatus = "idle" | "running" | "success" | "error" | "terminated";

/**
 * Return value for the useWebWorker hook
 */
interface UseWebWorkerReturnValue<T = any> {
  /**
   * Post a message to the web worker
   * @param message - The message to send to the worker
   */
  postMessage: (message: any) => void;
  /**
   * Terminate the web worker
   */
  terminate: () => void;
  /**
   * The current status of the web worker
   */
  status: WorkerStatus;
  /**
   * The last data received from the worker
   */
  data: T | null;
  /**
   * Any error that occurred
   */
  error: Error | null;
  /**
   * Whether Web Workers are supported
   */
  isSupported: boolean;
}

/**
 * useWebWorker hook
 *
 * Simplified Web Worker management with message passing.
 * Provides an easy way to offload heavy computations to a background thread
 * without blocking the main UI thread.
 *
 * @param workerUrl - The URL to the worker script file
 * @returns Object containing worker operations and state
 *
 * @example
 * ```tsx
 * import { useWebWorker } from "rooks";
 *
 * function HeavyComputationComponent() {
 *   const { postMessage, data, status, error, terminate, isSupported } =
 *     useWebWorker<number>("/worker.js");
 *
 *   const handleCompute = () => {
 *     postMessage({ type: "compute", value: 1000000 });
 *   };
 *
 *   if (!isSupported) {
 *     return <div>Web Workers not supported</div>;
 *   }
 *
 *   return (
 *     <div>
 *       <button onClick={handleCompute} disabled={status === "running"}>
 *         Start Computation
 *       </button>
 *       <button onClick={terminate}>Terminate</button>
 *       <p>Status: {status}</p>
 *       {data !== null && <p>Result: {data}</p>}
 *       {error && <p>Error: {error.message}</p>}
 *     </div>
 *   );
 * }
 * ```
 *
 * @see https://rooks.vercel.app/docs/hooks/useWebWorker
 */
function useWebWorker<T = any>(
  workerUrl: string
): UseWebWorkerReturnValue<T> {
  const [status, setStatus] = useState<WorkerStatus>("idle");
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const workerRef = useRef<Worker | null>(null);

  const isSupported = typeof window !== "undefined" && "Worker" in window;

  useEffect(() => {
    if (!isSupported || !workerUrl) {
      return;
    }

    try {
      const worker = new Worker(workerUrl);
      workerRef.current = worker;

      worker.onmessage = (event: MessageEvent) => {
        setData(event.data);
        setStatus("success");
        setError(null);
      };

      worker.onerror = (event: ErrorEvent) => {
        const err = new Error(event.message || "Worker error");
        setError(err);
        setStatus("error");
      };

      return () => {
        worker.terminate();
        workerRef.current = null;
      };
    } catch (err) {
      const error =
        err instanceof Error ? err : new Error("Failed to create worker");
      setError(error);
      setStatus("error");
    }
  }, [workerUrl, isSupported]);

  const postMessage = useCallback(
    (message: any): void => {
      if (!isSupported) {
        console.warn("Web Workers are not supported");
        return;
      }

      if (!workerRef.current) {
        console.warn("Worker not initialized");
        return;
      }

      if (status === "terminated") {
        console.warn("Cannot post message to terminated worker");
        return;
      }

      try {
        setStatus("running");
        setError(null);
        workerRef.current.postMessage(message);
      } catch (err) {
        const error =
          err instanceof Error ? err : new Error("Failed to post message");
        setError(error);
        setStatus("error");
      }
    },
    [isSupported, status]
  );

  const terminate = useCallback((): void => {
    if (workerRef.current) {
      workerRef.current.terminate();
      workerRef.current = null;
      setStatus("terminated");
    }
  }, []);

  return {
    postMessage,
    terminate,
    status,
    data,
    error,
    isSupported,
  };
}

export { useWebWorker };
export type { UseWebWorkerReturnValue, WorkerStatus };
