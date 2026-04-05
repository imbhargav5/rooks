const EXPLICIT_RESOURCE_MANAGEMENT_POLYFILL =
  "core-js/proposals/explicit-resource-management";

type ResourceRecord = Record<PropertyKey, unknown>;

function isDisposableResource(value: unknown): value is ResourceRecord {
  return (
    (typeof value === "object" && value !== null) || typeof value === "function"
  );
}

function createMissingSupportError(
  hookName: string,
  symbolName: "Symbol.dispose" | "Symbol.asyncDispose"
): Error {
  return new Error(
    `${hookName} requires ${symbolName} support. Install a polyfill such as ` +
      `"${EXPLICIT_RESOURCE_MANAGEMENT_POLYFILL}" before using this hook in ` +
      "unsupported browsers like Safari."
  );
}

function getRequiredMethod(
  resource: unknown,
  symbol: symbol,
  hookName: string,
  symbolName: "Symbol.dispose" | "Symbol.asyncDispose"
): (...arguments_: never[]) => unknown {
  if (!isDisposableResource(resource)) {
    throw new TypeError(
      `${hookName} expected the resource returned by the factory to implement ` +
        `[${symbolName}]().`
    );
  }

  const method = resource[symbol];

  if (typeof method !== "function") {
    throw new TypeError(
      `${hookName} expected the resource returned by the factory to implement ` +
        `[${symbolName}]().`
    );
  }

  return method.bind(resource) as (...arguments_: never[]) => unknown;
}

const explicitResourceManagement = {
  getDisposeSymbol(): symbol | null {
    return typeof Symbol.dispose === "symbol" ? Symbol.dispose : null;
  },

  getAsyncDisposeSymbol(): symbol | null {
    return typeof Symbol.asyncDispose === "symbol"
      ? Symbol.asyncDispose
      : null;
  },
};

function assertSyncDisposeSupport(hookName: string): symbol {
  const symbol = explicitResourceManagement.getDisposeSymbol();

  if (symbol === null) {
    throw createMissingSupportError(hookName, "Symbol.dispose");
  }

  return symbol;
}

function assertAsyncDisposeSupport(hookName: string): symbol {
  const symbol = explicitResourceManagement.getAsyncDisposeSymbol();

  if (symbol === null) {
    throw createMissingSupportError(hookName, "Symbol.asyncDispose");
  }

  return symbol;
}

function disposeSync(resource: unknown, hookName: string): void {
  const symbol = assertSyncDisposeSupport(hookName);
  const dispose = getRequiredMethod(resource, symbol, hookName, "Symbol.dispose");

  dispose();
}

async function disposeAsync(resource: unknown, hookName: string): Promise<void> {
  const symbol = assertAsyncDisposeSupport(hookName);
  const dispose = getRequiredMethod(
    resource,
    symbol,
    hookName,
    "Symbol.asyncDispose"
  );

  await dispose();
}

export {
  EXPLICIT_RESOURCE_MANAGEMENT_POLYFILL,
  assertAsyncDisposeSupport,
  assertSyncDisposeSupport,
  disposeAsync,
  disposeSync,
  explicitResourceManagement,
};
