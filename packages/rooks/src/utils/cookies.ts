export type CookieScopeOptions = {
  path?: string;
  domain?: string;
  expires?: Date | string;
  maxAge?: number;
  sameSite?: "strict" | "lax" | "none" | "Strict" | "Lax" | "None";
  secure?: boolean;
  partitioned?: boolean;
};

function normalizeExpires(expires: CookieScopeOptions["expires"]) {
  if (expires instanceof Date) {
    return expires.toUTCString();
  }

  return expires;
}

export function getCookieValue(name: string): string | null {
  if (typeof document === "undefined") {
    return null;
  }

  const encodedName = encodeURIComponent(name);
  const cookies = document.cookie ? document.cookie.split("; ") : [];

  for (const cookie of cookies) {
    const separatorIndex = cookie.indexOf("=");
    const rawName =
      separatorIndex === -1 ? cookie : cookie.slice(0, separatorIndex);
    const rawValue =
      separatorIndex === -1 ? "" : cookie.slice(separatorIndex + 1);

    if (rawName === encodedName) {
      try {
        return decodeURIComponent(rawValue);
      } catch {
        return rawValue;
      }
    }
  }

  return null;
}

export function stringifyCookie(
  name: string,
  value: string,
  options: CookieScopeOptions = {}
): string {
  const segments = [`${encodeURIComponent(name)}=${encodeURIComponent(value)}`];

  if (options.path) {
    segments.push(`Path=${options.path}`);
  }

  if (options.domain) {
    segments.push(`Domain=${options.domain}`);
  }

  if (typeof options.maxAge === "number") {
    segments.push(`Max-Age=${options.maxAge}`);
  }

  const expires = normalizeExpires(options.expires);
  if (expires) {
    segments.push(`Expires=${expires}`);
  }

  if (options.sameSite) {
    segments.push(`SameSite=${options.sameSite}`);
  }

  if (options.secure) {
    segments.push("Secure");
  }

  if (options.partitioned) {
    segments.push("Partitioned");
  }

  return segments.join("; ");
}

export function removeCookie(name: string, options: CookieScopeOptions = {}) {
  if (typeof document === "undefined") {
    return;
  }

  document.cookie = stringifyCookie(name, "", {
    ...options,
    expires: new Date(0),
    maxAge: 0,
  });
}
