import { act, renderHook, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import { usePermission } from "@/hooks/usePermission";

class PermissionStatusMock extends EventTarget implements PermissionStatus {
  name = "" as PermissionName;
  onchange: PermissionStatus["onchange"] = null;
  state: PermissionState;

  constructor(state: PermissionState) {
    super();
    this.state = state;
  }

  setState(nextState: PermissionState) {
    this.state = nextState;
    this.dispatchEvent(new Event("change"));
  }
}

const descriptorNames = [
  "clipboard-read",
  "geolocation",
  "notifications",
  "camera",
  "microphone",
] as const;

const permissionStates: PermissionState[] = ["prompt", "granted", "denied"];

const transitions = [
  { from: "prompt", to: "granted" },
  { from: "prompt", to: "denied" },
  { from: "granted", to: "denied" },
  { from: "denied", to: "prompt" },
] as const satisfies Array<{ from: PermissionState; to: PermissionState }>;

function descriptorFor(name: (typeof descriptorNames)[number]) {
  return { name } as PermissionDescriptor & { name: string };
}

function installPermissionsQuery(
  implementation: (
    descriptor: PermissionDescriptor
  ) => Promise<PermissionStatus>
) {
  const query = vi.fn(implementation);
  Object.defineProperty(navigator, "permissions", {
    configurable: true,
    value: {
      query,
    },
  });

  return query;
}

describe("usePermission matrix", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it.each(
    descriptorNames.flatMap((name) =>
      permissionStates.map((state) => ({
        name,
        state,
      }))
    )
  )("queries $name and returns $state on mount", async ({ name, state }) => {
    expect.hasAssertions();
    const permissionStatus = new PermissionStatusMock(state);
    installPermissionsQuery(async () => permissionStatus);

    const { result } = renderHook(() => usePermission(descriptorFor(name)));

    await waitFor(() => {
      expect(result.current.state).toBe(state);
    });
    expect(result.current.isSupported).toBe(true);
    expect(result.current.error).toBeNull();
  });

  it.each(
    descriptorNames.flatMap((name) =>
      transitions.map((transition) => ({
        name,
        ...transition,
      }))
    )
  )(
    "watches $name and updates from $from to $to",
    async ({ name, from, to }) => {
      expect.hasAssertions();
      const permissionStatus = new PermissionStatusMock(from);
      installPermissionsQuery(async () => permissionStatus);

      const { result } = renderHook(() => usePermission(descriptorFor(name)));

      await waitFor(() => {
        expect(result.current.state).toBe(from);
      });

      act(() => {
        permissionStatus.setState(to);
      });

      await waitFor(() => {
        expect(result.current.state).toBe(to);
      });
    }
  );

  it.each(
    descriptorNames.flatMap((name) =>
      transitions.map((transition) => ({
        name,
        ...transition,
      }))
    )
  )(
    "does not react to change events when watch is false for $name from $from to $to",
    async ({ name, from, to }) => {
      expect.hasAssertions();
      const permissionStatus = new PermissionStatusMock(from);
      installPermissionsQuery(async () => permissionStatus);

      const { result } = renderHook(() =>
        usePermission(descriptorFor(name), { watch: false })
      );

      await waitFor(() => {
        expect(result.current.state).toBe(from);
      });

      act(() => {
        permissionStatus.setState(to);
      });

      expect(result.current.state).toBe(from);
    }
  );

  it.each(
    descriptorNames.flatMap((name) =>
      [true, false].map((watch) => ({
        name,
        watch,
      }))
    )
  )(
    "returns unsupported without querying when enabled is false for $name (watch=$watch)",
    async ({ name, watch }) => {
      expect.hasAssertions();
      const query = installPermissionsQuery(
        async () => new PermissionStatusMock("granted")
      );

      const { result } = renderHook(() =>
        usePermission(descriptorFor(name), { enabled: false, watch })
      );

      await waitFor(() => {
        expect(result.current.state).toBe("unsupported");
      });
      expect(query).not.toHaveBeenCalled();
      expect(result.current.isLoading).toBe(false);
    }
  );

  it.each(descriptorNames)(
    "returns unsupported when the Permissions API is unavailable for %s",
    async (name) => {
      expect.hasAssertions();
      Object.defineProperty(navigator, "permissions", {
        configurable: true,
        value: undefined,
      });

      const { result } = renderHook(() => usePermission(descriptorFor(name)));

      await waitFor(() => {
        expect(result.current.state).toBe("unsupported");
      });
      expect(result.current.isSupported).toBe(false);
    }
  );

  it.each(descriptorNames)(
    "recovers after a refresh when the first query fails for %s",
    async (name) => {
      expect.hasAssertions();
      const permissionStatus = new PermissionStatusMock("granted");
      let hasFailed = false;
      const query = installPermissionsQuery(async () => {
        if (!hasFailed) {
          hasFailed = true;
          throw new Error("blocked");
        }

        return permissionStatus;
      });

      const { result } = renderHook(() => usePermission(descriptorFor(name)));

      await waitFor(() => {
        expect(result.current.error).toBeInstanceOf(Error);
        expect(result.current.state).toBe("unsupported");
      });

      await act(async () => {
        await result.current.refresh();
      });

      expect(query).toHaveBeenCalledTimes(2);
      expect(result.current.state).toBe("granted");
      expect(result.current.error).toBeNull();
    }
  );

  it.each(
    descriptorNames.map((name, index) => ({
      first: name,
      second: descriptorNames[(index + 1) % descriptorNames.length],
    }))
  )(
    "ignores stale query results when descriptors switch from $first to $second",
    async ({ first, second }) => {
      expect.hasAssertions();
      let resolveFirst: ((status: PermissionStatus) => void) | null = null;
      const secondStatus = new PermissionStatusMock("granted");
      const query = installPermissionsQuery(async (descriptor) => {
        if ((descriptor as { name: string }).name === first) {
          return new Promise<PermissionStatus>((resolve) => {
            resolveFirst = resolve;
          });
        }

        return secondStatus;
      });

      const { result, rerender } = renderHook(
        ({ descriptor }) => usePermission(descriptor),
        {
          initialProps: {
            descriptor: descriptorFor(first),
          },
        }
      );

      rerender({ descriptor: descriptorFor(second) });

      await waitFor(() => {
        expect(query).toHaveBeenCalledTimes(2);
        expect(result.current.state).toBe("granted");
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        resolveFirst?.(new PermissionStatusMock("denied"));
      });

      expect(result.current.state).toBe("granted");
    }
  );

  it.each(
    descriptorNames.map((name, index) => ({
      first: name,
      second: descriptorNames[(index + 1) % descriptorNames.length],
    }))
  )(
    "rebinds the change listener when descriptors swap with the same state from $first to $second",
    async ({ first, second }) => {
      expect.hasAssertions();
      const firstStatus = new PermissionStatusMock("granted");
      const secondStatus = new PermissionStatusMock("granted");
      const query = installPermissionsQuery(async (descriptor) => {
        return (descriptor as { name: string }).name === first
          ? firstStatus
          : secondStatus;
      });

      const { result, rerender } = renderHook(
        ({ descriptor }) => usePermission(descriptor),
        {
          initialProps: {
            descriptor: descriptorFor(first),
          },
        }
      );

      await waitFor(() => {
        expect(result.current.state).toBe("granted");
      });

      rerender({ descriptor: descriptorFor(second) });

      await waitFor(() => {
        expect(query).toHaveBeenCalledTimes(2);
        expect(result.current.state).toBe("granted");
        expect(result.current.isLoading).toBe(false);
      });

      act(() => {
        firstStatus.setState("denied");
      });
      expect(result.current.state).toBe("granted");

      act(() => {
        secondStatus.setState("denied");
      });
      expect(result.current.state).toBe("denied");
    }
  );

  it.each(descriptorNames)(
    "returns unsupported when descriptor is null for %s",
    async (name) => {
      expect.hasAssertions();
      const query = installPermissionsQuery(
        async () => new PermissionStatusMock("prompt")
      );

      const { result } = renderHook(() => usePermission(null));

      await waitFor(() => {
        expect(result.current.state).toBe("unsupported");
      });
      expect(query).not.toHaveBeenCalled();
      expect(name).toBeDefined();
    }
  );

  it.each(
    descriptorNames.flatMap((name) =>
      ["granted", "denied"].map((nextState) => ({
        name,
        nextState: nextState as PermissionState,
      }))
    )
  )(
    "refresh picks up external permission changes for $name -> $nextState",
    async ({ name, nextState }) => {
      expect.hasAssertions();
      const permissionStatus = new PermissionStatusMock("prompt");
      installPermissionsQuery(async () => permissionStatus);

      const { result } = renderHook(() =>
        usePermission(descriptorFor(name), { watch: false })
      );

      await waitFor(() => {
        expect(result.current.state).toBe("prompt");
      });

      permissionStatus.state = nextState;

      await act(async () => {
        await result.current.refresh();
      });

      expect(result.current.state).toBe(nextState);
    }
  );
});
