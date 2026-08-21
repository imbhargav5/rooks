import { useEffect, useMemo, useState } from "react";

export type UseScriptStatus = "idle" | "loading" | "ready" | "error";

export type UseScriptOptions = {
  id?: string;
  removeOnUnmount?: boolean;
  shouldPreventLoad?: boolean;
  type?: HTMLScriptElement["type"];
  async?: boolean;
  defer?: boolean;
  noModule?: boolean;
  nonce?: string;
  crossOrigin?: HTMLScriptElement["crossOrigin"];
  integrity?: string;
  referrerPolicy?: HTMLScriptElement["referrerPolicy"];
  attrs?: Record<string, string>;
};

type ScriptState = {
  status: UseScriptStatus;
  error: Error | null;
  script: HTMLScriptElement | null;
};

type Subscriber = (state: ScriptState) => void;

type ScriptRecord = ScriptState & {
  key: string;
  keys: Set<string>;
  subscribers: Set<Subscriber>;
  refCount: number;
  createdByHook: boolean;
  removeWhenUnused: boolean;
  detachEvents: (() => void) | null;
};

const SCRIPT_STATUS_ATTRIBUTE = "data-rooks-script-status";
const scriptRegistry = new Map<string, ScriptRecord>();

function canonicalizeScriptSrc(src?: string | null) {
  if (!src) {
    return null;
  }

  if (typeof document === "undefined") {
    return src;
  }

  try {
    return new URL(src, document.baseURI).href;
  } catch {
    return src;
  }
}

function getRecordKeys(src?: string | null, id?: string) {
  const keys: string[] = [];
  if (id) {
    keys.push(`id:${id}`);
  }

  const canonicalSrc = canonicalizeScriptSrc(src);
  if (canonicalSrc) {
    keys.push(`src:${canonicalSrc}`);
  }

  return keys;
}

function getRecordKey(src?: string | null, id?: string) {
  return getRecordKeys(src, id)[0] ?? null;
}

function findExistingScript(
  src?: string | null,
  id?: string
): HTMLScriptElement | null {
  if (typeof document === "undefined") {
    return null;
  }

  if (id) {
    const byId = document.getElementById(id);
    if (byId instanceof HTMLScriptElement) {
      return byId;
    }
  }

  if (!src) {
    return null;
  }

  const canonicalSrc = canonicalizeScriptSrc(src);
  const scripts = Array.from(document.querySelectorAll("script"));
  for (const script of scripts) {
    if (script instanceof HTMLScriptElement && script.src === canonicalSrc) {
      return script;
    }
  }

  return null;
}

function getExistingStatus(script: HTMLScriptElement | null): UseScriptStatus {
  if (!script) {
    return "idle";
  }

  const attribute = script.getAttribute(SCRIPT_STATUS_ATTRIBUTE);
  if (
    attribute === "idle" ||
    attribute === "loading" ||
    attribute === "ready" ||
    attribute === "error"
  ) {
    return attribute;
  }

  const readyState = (script as HTMLScriptElement & { readyState?: string })
    .readyState;
  if (readyState === "loaded" || readyState === "complete") {
    return "ready";
  }

  if (script.src) {
    return document.readyState === "loading" ? "loading" : "ready";
  }

  return "idle";
}

function notify(record: ScriptRecord) {
  const state = {
    status: record.status,
    error: record.error,
    script: record.script,
  };

  for (const subscriber of record.subscribers) {
    subscriber(state);
  }
}

function setRecordState(
  record: ScriptRecord,
  status: UseScriptStatus,
  error: Error | null = null
) {
  record.status = status;
  record.error = error;

  if (record.script) {
    record.script.setAttribute(SCRIPT_STATUS_ATTRIBUTE, status);
  }

  notify(record);
}

function applyScriptOptions(
  script: HTMLScriptElement,
  src: string,
  options: UseScriptOptions
) {
  if (options.id) {
    script.id = options.id;
  }

  script.src = src;
  script.async = options.async ?? true;
  script.defer = options.defer ?? false;
  script.type = options.type ?? "text/javascript";
  script.noModule = options.noModule ?? false;

  if (options.nonce) {
    script.nonce = options.nonce;
  }

  if (typeof options.crossOrigin !== "undefined") {
    script.crossOrigin = options.crossOrigin;
  }

  if (options.integrity) {
    script.integrity = options.integrity;
  }

  if (options.referrerPolicy) {
    script.referrerPolicy = options.referrerPolicy;
  }

  for (const [attribute, value] of Object.entries(options.attrs ?? {})) {
    script.setAttribute(attribute, value);
  }
}

function attachScriptEvents(record: ScriptRecord) {
  const script = record.script;
  if (!script || record.detachEvents) {
    return;
  }

  const handleLoad = () => {
    setRecordState(record, "ready");
    record.detachEvents?.();
    record.detachEvents = null;
  };

  const handleError = () => {
    setRecordState(
      record,
      "error",
      new Error(`Failed to load script: ${script.src}`)
    );
    record.detachEvents?.();
    record.detachEvents = null;
  };

  script.addEventListener("load", handleLoad);
  script.addEventListener("error", handleError);

  record.detachEvents = () => {
    script.removeEventListener("load", handleLoad);
    script.removeEventListener("error", handleError);
  };
}

function createScript(
  record: ScriptRecord,
  src: string,
  options: UseScriptOptions
) {
  const script = document.createElement("script");
  applyScriptOptions(script, src, options);
  record.script = script;
  record.status = "loading";
  record.error = null;
  record.createdByHook = true;
  script.setAttribute(SCRIPT_STATUS_ATTRIBUTE, "loading");
  attachScriptEvents(record);
  document.body.appendChild(script);
}

function syncExistingScriptRecord(
  record: ScriptRecord,
  script: HTMLScriptElement
) {
  record.script = script;
  record.error = null;
  record.status = getExistingStatus(script);
  script.setAttribute(SCRIPT_STATUS_ATTRIBUTE, record.status);

  if (record.status === "loading") {
    attachScriptEvents(record);
  }
}

function getOrCreateRecord(
  src: string | null | undefined,
  options: UseScriptOptions
): ScriptRecord | null {
  const keys = getRecordKeys(src, options.id);
  const key = keys[0];
  if (!key || typeof document === "undefined") {
    return null;
  }

  const existing = keys
    .map((candidateKey) => scriptRegistry.get(candidateKey))
    .find((candidate): candidate is ScriptRecord => Boolean(candidate));
  if (existing) {
    for (const candidateKey of keys) {
      if (!scriptRegistry.has(candidateKey)) {
        scriptRegistry.set(candidateKey, existing);
        existing.keys.add(candidateKey);
      }
    }

    const existingScript = findExistingScript(src, options.id);

    if (existingScript && existing.script !== existingScript) {
      syncExistingScriptRecord(existing, existingScript);
    } else if (!existing.script && existingScript) {
      syncExistingScriptRecord(existing, existingScript);
    } else if (!existing.script && src && !options.shouldPreventLoad) {
      createScript(existing, src, options);
    } else if (existing.status === "loading") {
      attachScriptEvents(existing);
    }

    return existing;
  }

  const existingScript = findExistingScript(src, options.id);
  const record: ScriptRecord = {
    key,
    keys: new Set(keys),
    status: getExistingStatus(existingScript),
    error: null,
    script: existingScript,
    subscribers: new Set(),
    refCount: 0,
    createdByHook: false,
    removeWhenUnused: false,
    detachEvents: null,
  };

  if (existingScript) {
    syncExistingScriptRecord(record, existingScript);
  }

  if (!existingScript && src && !options.shouldPreventLoad) {
    createScript(record, src, options);
  }

  for (const candidateKey of keys) {
    scriptRegistry.set(candidateKey, record);
  }
  return record;
}

function subscribeToRecord(record: ScriptRecord, subscriber: Subscriber) {
  record.subscribers.add(subscriber);
  subscriber({
    status: record.status,
    error: record.error,
    script: record.script,
  });

  return () => {
    record.subscribers.delete(subscriber);
  };
}

function disposeRecord(record: ScriptRecord, removeOnUnmount: boolean) {
  record.removeWhenUnused ||= removeOnUnmount;
  record.refCount -= 1;

  if (record.refCount > 0) {
    return;
  }

  if (
    record.removeWhenUnused &&
    record.createdByHook &&
    record.script?.parentNode
  ) {
    record.detachEvents?.();
    record.script.parentNode.removeChild(record.script);
  }

  for (const key of record.keys) {
    if (scriptRegistry.get(key) === record) {
      scriptRegistry.delete(key);
    }
  }
}

/**
 * useScript
 * @description Loads and tracks a script element with shared lifecycle state.
 * @see {@link https://rooks.vercel.app/docs/hooks/useScript}
 */
function useScript(
  src: string | null | undefined,
  options: UseScriptOptions = {}
): ScriptState {
  const attrsKey = JSON.stringify(
    Object.entries(options.attrs ?? {}).sort(([first], [second]) =>
      first.localeCompare(second)
    )
  );
  const normalizedOptions = useMemo(
    () => ({
      id: options.id,
      removeOnUnmount: options.removeOnUnmount ?? false,
      shouldPreventLoad: options.shouldPreventLoad ?? false,
      type: options.type,
      async: options.async,
      defer: options.defer,
      noModule: options.noModule,
      nonce: options.nonce,
      crossOrigin: options.crossOrigin,
      integrity: options.integrity,
      referrerPolicy: options.referrerPolicy,
      attrs: Object.fromEntries(
        JSON.parse(attrsKey) as Array<[string, string]>
      ),
    }),
    [
      options.async,
      attrsKey,
      options.crossOrigin,
      options.defer,
      options.id,
      options.integrity,
      options.noModule,
      options.nonce,
      options.referrerPolicy,
      options.removeOnUnmount,
      options.shouldPreventLoad,
      options.type,
    ]
  );
  const recordKey = useMemo(
    () => getRecordKey(src, normalizedOptions.id),
    [normalizedOptions.id, src]
  );
  const [state, setState] = useState<ScriptState>({
    status: "idle",
    error: null,
    script: null,
  });

  useEffect(() => {
    if (!recordKey || typeof document === "undefined") {
      setState({
        status: "idle",
        error: null,
        script: null,
      });
      return () => {};
    }

    const record = getOrCreateRecord(src, normalizedOptions);

    if (!record) {
      setState({
        status: "idle",
        error: null,
        script: null,
      });
      return () => {};
    }

    record.refCount += 1;
    record.removeWhenUnused ||= normalizedOptions.removeOnUnmount;

    const unsubscribe = subscribeToRecord(record, setState);

    return () => {
      unsubscribe();
      disposeRecord(record, normalizedOptions.removeOnUnmount);
    };
  }, [normalizedOptions, recordKey, src]);

  return state;
}

export { useScript };
export type { ScriptState as UseScriptReturnValue };
