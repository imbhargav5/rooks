import React, { Suspense, useEffect } from "react";
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { clearCache, useSuspenseFavicon } from "@/hooks/useSuspenseFavicon";

function getFaviconLinks(): HTMLLinkElement[] {
  return Array.from(document.head.querySelectorAll('link[rel][href]')).filter(
    (node): node is HTMLLinkElement =>
      node instanceof HTMLLinkElement &&
      node
        .getAttribute("rel")
        ?.split(/\s+/)
        .map((token) => token.trim().toLowerCase())
        .includes("icon") === true
  );
}

function setHeadWithFaviconLinks(markup: string): void {
  document.head.innerHTML = markup;
}

function FaviconConsumer({
  testId = "favicon",
  sameOriginRelativeHref = "/managed.ico?v=1",
  externalUrl = "https://cdn.example.com/managed.ico",
  options,
  onControls,
}: {
  testId?: string;
  sameOriginRelativeHref?: string;
  externalUrl?: string;
  options?: { unmountStrategy?: "restore-originals" | "leave-as-is" };
  onControls?: (controls: {
    updateFaviconURL: (
      config:
        | { kind: "same-origin"; relativeHref: string }
        | { kind: "external"; url: string }
    ) => void;
  }) => void;
}) {
  const [favicon, controls] = useSuspenseFavicon(options);

  useEffect(() => {
    onControls?.(controls);
  }, [controls, onControls]);

  return (
    <div>
      <div data-testid={`${testId}-value`}>
        {favicon === null ? "null" : JSON.stringify(favicon)}
      </div>
      <button
        data-testid={`${testId}-same-origin`}
        onClick={() =>
          controls.updateFaviconURL({
            kind: "same-origin",
            relativeHref: sameOriginRelativeHref,
          })
        }
      >
        Same origin
      </button>
      <button
        data-testid={`${testId}-external`}
        onClick={() =>
          controls.updateFaviconURL({
            kind: "external",
            url: externalUrl,
          })
        }
      >
        External
      </button>
    </div>
  );
}

function SuspenseWrapper({
  children,
  fallback = "Loading favicon...",
}: {
  children: React.ReactNode;
  fallback?: string;
}) {
  return (
    <Suspense fallback={<div data-testid="loading">{fallback}</div>}>
      {children}
    </Suspense>
  );
}

describe("useSuspenseFavicon", () => {
  beforeEach(() => {
    clearCache();
    document.head.innerHTML = "";
  });

  afterEach(() => {
    cleanup();
    clearCache();
    document.head.innerHTML = "";
  });

  it("should be defined", () => {
    expect.hasAssertions();
    expect(useSuspenseFavicon).toBeDefined();
  });

  it("should suspend during initialization", async () => {
    expect.hasAssertions();

    render(
      <SuspenseWrapper>
        <FaviconConsumer />
      </SuspenseWrapper>
    );

    expect(screen.getByTestId("loading")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByTestId("favicon-value")).toBeInTheDocument();
    });

    expect(screen.getByTestId("favicon-value").textContent).toBe("null");
  });

  it("should return null when no explicit favicon link exists", async () => {
    expect.hasAssertions();

    render(
      <SuspenseWrapper>
        <FaviconConsumer />
      </SuspenseWrapper>
    );

    await waitFor(() => {
      expect(screen.getByTestId("favicon-value").textContent).toBe("null");
    });
  });

  it("should classify an existing same-origin favicon", async () => {
    expect.hasAssertions();

    setHeadWithFaviconLinks('<link rel="icon" href="/favicon.svg?v=2#hash" />');

    render(
      <SuspenseWrapper>
        <FaviconConsumer />
      </SuspenseWrapper>
    );

    await waitFor(() => {
      expect(screen.getByTestId("favicon-value")).toBeInTheDocument();
    });

    expect(screen.getByTestId("favicon-value").textContent).toBe(
      JSON.stringify({
        kind: "same-origin",
        relativeHref: "/favicon.svg?v=2#hash",
        href: new URL("/favicon.svg?v=2#hash", document.baseURI).href,
      })
    );
  });

  it("should classify an existing external favicon", async () => {
    expect.hasAssertions();

    setHeadWithFaviconLinks(
      '<link rel="shortcut icon" href="https://cdn.example.com/favicon.ico" />'
    );

    render(
      <SuspenseWrapper>
        <FaviconConsumer />
      </SuspenseWrapper>
    );

    await waitFor(() => {
      expect(screen.getByTestId("favicon-value")).toBeInTheDocument();
    });

    expect(screen.getByTestId("favicon-value").textContent).toBe(
      JSON.stringify({
        kind: "external",
        url: "https://cdn.example.com/favicon.ico",
        href: "https://cdn.example.com/favicon.ico",
      })
    );
  });

  it("should use the last DOM-order favicon link as the current favicon", async () => {
    expect.hasAssertions();

    setHeadWithFaviconLinks(`
      <link rel="icon" href="/first.ico" />
      <link rel="shortcut icon" href="https://cdn.example.com/second.ico" />
    `);

    render(
      <SuspenseWrapper>
        <FaviconConsumer />
      </SuspenseWrapper>
    );

    await waitFor(() => {
      expect(screen.getByTestId("favicon-value")).toBeInTheDocument();
    });

    expect(screen.getByTestId("favicon-value").textContent).toBe(
      JSON.stringify({
        kind: "external",
        url: "https://cdn.example.com/second.ico",
        href: "https://cdn.example.com/second.ico",
      })
    );
  });

  it("should update to a managed same-origin favicon", async () => {
    expect.hasAssertions();

    setHeadWithFaviconLinks('<link rel="icon" href="/original.ico" />');

    render(
      <SuspenseWrapper>
        <FaviconConsumer sameOriginRelativeHref="../icons/managed.svg?v=7" />
      </SuspenseWrapper>
    );

    await waitFor(() => {
      expect(screen.getByTestId("favicon-value")).toBeInTheDocument();
    });

    await act(async () => {
      fireEvent.click(screen.getByTestId("favicon-same-origin"));
    });

    expect(screen.getByTestId("favicon-value").textContent).toBe(
      JSON.stringify({
        kind: "same-origin",
        relativeHref: "../icons/managed.svg?v=7",
        href: new URL("../icons/managed.svg?v=7", document.baseURI).href,
      })
    );

    const faviconLinks = getFaviconLinks();
    expect(faviconLinks).toHaveLength(1);
    expect(faviconLinks[0].getAttribute("href")).toBe("../icons/managed.svg?v=7");
    expect(faviconLinks[0].getAttribute("data-rooks-managed-favicon")).toBe(
      "true"
    );
  });

  it("should update to a managed external favicon", async () => {
    expect.hasAssertions();

    render(
      <SuspenseWrapper>
        <FaviconConsumer externalUrl="https://assets.example.org/favicon.png" />
      </SuspenseWrapper>
    );

    await waitFor(() => {
      expect(screen.getByTestId("favicon-value")).toBeInTheDocument();
    });

    await act(async () => {
      fireEvent.click(screen.getByTestId("favicon-external"));
    });

    expect(screen.getByTestId("favicon-value").textContent).toBe(
      JSON.stringify({
        kind: "external",
        url: "https://assets.example.org/favicon.png",
        href: "https://assets.example.org/favicon.png",
      })
    );

    const faviconLinks = getFaviconLinks();
    expect(faviconLinks).toHaveLength(1);
    expect(faviconLinks[0].href).toBe("https://assets.example.org/favicon.png");
  });

  it("should reject absolute URLs passed to same-origin updates", async () => {
    expect.hasAssertions();
    let capturedControls:
      | {
          updateFaviconURL: (
            config:
              | { kind: "same-origin"; relativeHref: string }
              | { kind: "external"; url: string }
          ) => void;
        }
      | undefined;

    render(
      <SuspenseWrapper>
        <FaviconConsumer
          sameOriginRelativeHref="https://example.com/icon.ico"
          onControls={(controls) => {
            capturedControls = controls;
          }}
        />
      </SuspenseWrapper>
    );

    await waitFor(() => {
      expect(screen.getByTestId("favicon-value")).toBeInTheDocument();
    });

    expect(capturedControls).toBeDefined();

    expect(() => {
      capturedControls!.updateFaviconURL({
        kind: "same-origin",
        relativeHref: "https://example.com/icon.ico",
      });
    }).toThrow(
      "useSuspenseFavicon expected same-origin updates to use a relative href string."
    );
  });

  it("should reject same-origin URLs passed to external updates", async () => {
    expect.hasAssertions();
    let capturedControls:
      | {
          updateFaviconURL: (
            config:
              | { kind: "same-origin"; relativeHref: string }
              | { kind: "external"; url: string }
          ) => void;
        }
      | undefined;

    render(
      <SuspenseWrapper>
        <FaviconConsumer
          externalUrl="/favicon.ico"
          onControls={(controls) => {
            capturedControls = controls;
          }}
        />
      </SuspenseWrapper>
    );

    await waitFor(() => {
      expect(screen.getByTestId("favicon-value")).toBeInTheDocument();
    });

    expect(capturedControls).toBeDefined();

    expect(() => {
      capturedControls!.updateFaviconURL({
        kind: "external",
        url: "/favicon.ico",
      });
    }).toThrow(
      "useSuspenseFavicon expected external updates to resolve to a different origin."
    );
  });

  it("should keep multiple hook instances synchronized", async () => {
    expect.hasAssertions();

    render(
      <div>
        <SuspenseWrapper>
          <FaviconConsumer testId="first" />
        </SuspenseWrapper>
        <SuspenseWrapper>
          <FaviconConsumer testId="second" />
        </SuspenseWrapper>
      </div>
    );

    await waitFor(() => {
      expect(screen.getByTestId("first-value")).toBeInTheDocument();
      expect(screen.getByTestId("second-value")).toBeInTheDocument();
    });

    await act(async () => {
      fireEvent.click(screen.getByTestId("first-external"));
    });

    const expectedValue = JSON.stringify({
      kind: "external",
      url: "https://cdn.example.com/managed.ico",
      href: "https://cdn.example.com/managed.ico",
    });

    expect(screen.getByTestId("first-value").textContent).toBe(expectedValue);
    expect(screen.getByTestId("second-value").textContent).toBe(expectedValue);
    expect(getFaviconLinks()).toHaveLength(1);
  });

  it("should restore original favicon links when the last instance unmounts with restore-originals", async () => {
    expect.hasAssertions();

    setHeadWithFaviconLinks(`
      <meta charset="utf-8" />
      <link rel="icon" href="/first.ico" />
      <link rel="shortcut icon" href="https://cdn.example.com/second.ico" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
    `);

    const { unmount } = render(
      <SuspenseWrapper>
        <FaviconConsumer options={{ unmountStrategy: "restore-originals" }} />
      </SuspenseWrapper>
    );

    await waitFor(() => {
      expect(screen.getByTestId("favicon-value")).toBeInTheDocument();
    });

    await act(async () => {
      fireEvent.click(screen.getByTestId("favicon-external"));
    });

    expect(getFaviconLinks()).toHaveLength(1);

    unmount();

    const restoredLinks = getFaviconLinks();
    expect(restoredLinks).toHaveLength(2);
    expect(restoredLinks[0].getAttribute("href")).toBe("/first.ico");
    expect(restoredLinks[1].getAttribute("href")).toBe(
      "https://cdn.example.com/second.ico"
    );
    expect(
      document.head.querySelector(`link[data-rooks-managed-favicon="true"]`)
    ).toBeNull();
  });

  it("should leave the managed favicon in place when the last instance unmounts with leave-as-is", async () => {
    expect.hasAssertions();

    setHeadWithFaviconLinks('<link rel="icon" href="/original.ico" />');

    const { unmount } = render(
      <SuspenseWrapper>
        <FaviconConsumer
          options={{ unmountStrategy: "leave-as-is" }}
          externalUrl="https://cdn.example.com/persisted.ico"
        />
      </SuspenseWrapper>
    );

    await waitFor(() => {
      expect(screen.getByTestId("favicon-value")).toBeInTheDocument();
    });

    await act(async () => {
      fireEvent.click(screen.getByTestId("favicon-external"));
    });

    unmount();

    const faviconLinks = getFaviconLinks();
    expect(faviconLinks).toHaveLength(1);
    expect(faviconLinks[0].getAttribute("href")).toBe(
      "https://cdn.example.com/persisted.ico"
    );
    expect(faviconLinks[0].getAttribute("data-rooks-managed-favicon")).toBe(
      "true"
    );
  });
});
