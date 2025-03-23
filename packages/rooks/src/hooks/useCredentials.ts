import { useCallback, useState } from "react";

export type CredentialMediationRequirement = "silent" | "optional" | "required";

export type CredentialRequestOptions = {
    mediation?: CredentialMediationRequirement;
    signal?: AbortSignal;
    password?: boolean;
    federated?: {
        providers: string[];
        protocols?: string[];
    };
    publicKey?: {
        challenge: BufferSource;
        rpId?: string;
        userVerification?: "required" | "preferred" | "discouraged";
        extensions?: any;
    };
};

export type PasswordCredentialOptions = {
    id: string;
    password: string;
    name?: string;
    iconURL?: string;
};

export type CredentialsHandler = {
    get: (options?: CredentialRequestOptions) => Promise<Credential | null>;
    store: (credential: PasswordCredentialOptions) => Promise<Credential | null>;
    preventSilentAccess: () => Promise<void>;
    credential: Credential | null;
    error: Error | null;
    isSupported: boolean;
};

/**
 * useCredentials
 * @description A hook for the Credential Management API
 * @returns {CredentialsHandler} Methods and state for credential management
 * @see {@link https://rooks.vercel.app/docs/useCredentials}
 *
 * @example
 *
 * const { 
 *   get, 
 *   store, 
 *   preventSilentAccess, 
 *   credential 
 * } = useCredentials();
 *
 * // Get stored credentials
 * get({ password: true }).then(cred => {
 *   if (cred) {
 *     // Auto sign in
 *   }
 * });
 *
 * // Store new credentials
 * store({ id: "user@example.com", password: "password123", name: "User Name" });
 */
function useCredentials(): CredentialsHandler {
    const [credential, setCredential] = useState<Credential | null>(null);
    const [error, setError] = useState<Error | null>(null);
    const isSupported = typeof window !== "undefined" && "credentials" in navigator;

    const get = useCallback(async (options: CredentialRequestOptions = {}): Promise<Credential | null> => {
        if (!isSupported) {
            const error = new Error("Credential Management API is not supported in this browser");
            setError(error);
            return null;
        }

        try {
            // Attempt to get credentials
            const cred = await navigator.credentials.get(options);
            setCredential(cred);
            return cred;
        } catch (err) {
            setError(err instanceof Error ? err : new Error(String(err)));
            return null;
        }
    }, [isSupported]);

    const store = useCallback(async (options: PasswordCredentialOptions): Promise<Credential | null> => {
        if (!isSupported) {
            const error = new Error("Credential Management API is not supported in this browser");
            setError(error);
            return null;
        }

        try {
            // Create a password credential
            const passwordCredential = new (window as any).PasswordCredential(options);

            // Store the credential
            await navigator.credentials.store(passwordCredential);
            setCredential(passwordCredential);
            return passwordCredential;
        } catch (err) {
            setError(err instanceof Error ? err : new Error(String(err)));
            return null;
        }
    }, [isSupported]);

    const preventSilentAccess = useCallback(async (): Promise<void> => {
        if (!isSupported) {
            const error = new Error("Credential Management API is not supported in this browser");
            setError(error);
            return;
        }

        try {
            await navigator.credentials.preventSilentAccess();
            setCredential(null);
        } catch (err) {
            setError(err instanceof Error ? err : new Error(String(err)));
        }
    }, [isSupported]);

    return {
        get,
        store,
        preventSilentAccess,
        credential,
        error,
        isSupported
    };
}

export { useCredentials }; 