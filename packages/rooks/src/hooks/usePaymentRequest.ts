import { useCallback, useEffect, useRef, useState } from "react";

export type PaymentMethodData = {
    supportedMethods: string;
    data?: any;
};

export type PaymentCurrencyAmount = {
    currency: string;
    value: string;
};

export type PaymentDetailsModifier = {
    supportedMethods: string;
    total?: {
        label: string;
        amount: PaymentCurrencyAmount;
    };
    additionalDisplayItems?: {
        label: string;
        amount: PaymentCurrencyAmount;
    }[];
    data?: any;
};

export type PaymentDetailsInit = {
    id?: string;
    displayItems?: {
        label: string;
        amount: PaymentCurrencyAmount;
    }[];
    total: {
        label: string;
        amount: PaymentCurrencyAmount;
    };
    modifiers?: PaymentDetailsModifier[];
    shippingOptions?: {
        id: string;
        label: string;
        amount: PaymentCurrencyAmount;
        selected?: boolean;
    }[];
};

export type PaymentOptions = {
    requestPayerName?: boolean;
    requestPayerEmail?: boolean;
    requestPayerPhone?: boolean;
    requestShipping?: boolean;
    shippingType?: "shipping" | "delivery" | "pickup";
};

export type PaymentRequestHandler = {
    show: () => Promise<PaymentResponse | null>;
    abort: () => Promise<void>;
    canMakePayment: boolean;
    paymentResponse: PaymentResponse | null;
    error: Error | null;
    isSupported: boolean;
    updateWith: (details: PaymentDetailsInit) => void;
};

/**
 * usePaymentRequest
 * @description A hook for the Web Payment API
 * @param {PaymentMethodData[]} methodData Payment method data
 * @param {PaymentDetailsInit} details Payment details
 * @param {PaymentOptions} options Payment options
 * @returns {PaymentRequestHandler} Methods and state for payment request management
 * @see {@link https://rooks.vercel.app/docs/usePaymentRequest}
 *
 * @example
 *
 * const { 
 *   show, 
 *   abort, 
 *   canMakePayment, 
 *   paymentResponse 
 * } = usePaymentRequest(
 *   [{ supportedMethods: "basic-card" }],
 *   { total: { label: "Total", amount: { currency: "USD", value: "19.99" } } }
 * );
 *
 * // Show payment UI
 * if (canMakePayment) {
 *   show();
 * }
 */
function usePaymentRequest(
    methodData: PaymentMethodData[],
    details: PaymentDetailsInit,
    options?: PaymentOptions
): PaymentRequestHandler {
    const [canMakePayment, setCanMakePayment] = useState<boolean>(false);
    const [paymentResponse, setPaymentResponse] = useState<PaymentResponse | null>(null);
    const [error, setError] = useState<Error | null>(null);
    const isSupported = typeof window !== "undefined" && "PaymentRequest" in window;

    const paymentRequestRef = useRef<PaymentRequest | null>(null);

    // Create a PaymentRequest on mount or when inputs change
    useEffect(() => {
        if (!isSupported) {
            return;
        }

        try {
            paymentRequestRef.current = new PaymentRequest(methodData, details, options);

            // Check if the payment method is supported
            paymentRequestRef.current.canMakePayment().then((result) => {
                setCanMakePayment(result);
            }).catch((err) => {
                setError(err instanceof Error ? err : new Error(String(err)));
            });
        } catch (err) {
            setError(err instanceof Error ? err : new Error(String(err)));
        }
    }, [isSupported, methodData, details, options]);

    // Show the payment UI
    const show = useCallback(async (): Promise<PaymentResponse | null> => {
        if (!isSupported || !paymentRequestRef.current) {
            return null;
        }

        try {
            const response = await paymentRequestRef.current.show();
            setPaymentResponse(response);
            return response;
        } catch (err) {
            // Don't treat user abort as an error
            if (err instanceof Error && err.name === "AbortError") {
                return null;
            }

            setError(err instanceof Error ? err : new Error(String(err)));
            return null;
        }
    }, [isSupported]);

    // Abort the payment request
    const abort = useCallback(async (): Promise<void> => {
        if (!paymentRequestRef.current) {
            return;
        }

        try {
            await paymentRequestRef.current.abort();
            setPaymentResponse(null);
        } catch (err) {
            setError(err instanceof Error ? err : new Error(String(err)));
        }
    }, []);

    // Update the payment request with new details
    const updateWith = useCallback((newDetails: PaymentDetailsInit): void => {
        if (!paymentResponse) {
            setError(new Error("No active payment response to update"));
            return;
        }

        try {
            // Use type assertion since PaymentResponse.updateWith might not be fully recognized
            (paymentResponse as any).updateWith(newDetails);
        } catch (err) {
            setError(err instanceof Error ? err : new Error(String(err)));
        }
    }, [paymentResponse]);

    return {
        show,
        abort,
        canMakePayment,
        paymentResponse,
        error,
        isSupported,
        updateWith
    };
}

export { usePaymentRequest }; 