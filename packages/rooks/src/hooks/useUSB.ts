import { useCallback, useEffect, useRef, useState } from "react";

// Type definitions for WebUSB API
interface USBDeviceFilter {
    vendorId?: number;
    productId?: number;
    classCode?: number;
    subclassCode?: number;
    protocolCode?: number;
    serialNumber?: string;
}

interface USBDeviceRequestOptions {
    filters: USBDeviceFilter[];
}

interface NavigatorUSB {
    usb: USB;
}

interface USB extends EventTarget {
    onconnect: ((this: USB, ev: USBConnectionEvent) => any) | null;
    ondisconnect: ((this: USB, ev: USBConnectionEvent) => any) | null;
    getDevices(): Promise<USBDevice[]>;
    requestDevice(options?: USBDeviceRequestOptions): Promise<USBDevice>;
    addEventListener(
        type: string,
        listener: EventListenerOrEventListenerObject,
        options?: boolean | AddEventListenerOptions
    ): void;
    removeEventListener(
        type: string,
        listener: EventListenerOrEventListenerObject,
        options?: boolean | EventListenerOptions
    ): void;
}

interface USBConnectionEvent extends Event {
    device: USBDevice;
}

// Simplified type for USBDevice to prevent excessive nesting
interface USBDevice {
    opened: boolean;
    productName?: string;
    manufacturerName?: string;
    serialNumber?: string;
    vendorId: number;
    productId: number;
    open(): Promise<void>;
    close(): Promise<void>;
    selectConfiguration(configurationValue: number): Promise<void>;
    claimInterface(interfaceNumber: number): Promise<void>;
    releaseInterface(interfaceNumber: number): Promise<void>;
    selectAlternateInterface(interfaceNumber: number, alternateSetting: number): Promise<void>;
    controlTransferOut(setup: USBControlTransferParameters, data?: BufferSource): Promise<USBOutTransferResult>;
    controlTransferIn(setup: USBControlTransferParameters, length: number): Promise<USBInTransferResult>;
    transferOut(endpointNumber: number, data: BufferSource): Promise<USBOutTransferResult>;
    transferIn(endpointNumber: number, length: number): Promise<USBInTransferResult>;
    clearHalt(direction: USBDirection, endpointNumber: number): Promise<void>;
    reset(): Promise<void>;
}

interface USBControlTransferParameters {
    requestType: USBRequestType;
    recipient: USBRecipient;
    request: number;
    value: number;
    index: number;
}

type USBRequestType = "standard" | "class" | "vendor";
type USBRecipient = "device" | "interface" | "endpoint" | "other";
type USBDirection = "in" | "out";

interface USBInTransferResult {
    data?: DataView;
    status: USBTransferStatus;
}

interface USBOutTransferResult {
    bytesWritten: number;
    status: USBTransferStatus;
}

type USBTransferStatus = "ok" | "stall" | "babble";

export type USBDeviceInfo = {
    vendorId: number;
    productId: number;
    productName?: string;
    manufacturerName?: string;
    serialNumber?: string;
};

export type USBHandler = {
    requestDevice: (options: USBDeviceRequestOptions) => Promise<USBDeviceInfo | null>;
    connect: () => Promise<boolean>;
    disconnect: () => Promise<void>;
    sendData: (endpointNumber: number, data: BufferSource) => Promise<{ bytesWritten: number; status: USBTransferStatus } | null>;
    receiveData: (endpointNumber: number, length: number) => Promise<{ data: DataView | null; status: USBTransferStatus } | null>;
    listDevices: () => Promise<USBDeviceInfo[]>;
    device: USBDeviceInfo | null;
    isConnected: boolean;
    error: Error | null;
    isSupported: boolean;
};

/**
 * useUSB
 * @description A hook for WebUSB API
 * @returns {USBHandler} Methods and state for USB device interaction
 * @see {@link https://rooks.vercel.app/docs/useUSB}
 *
 * @example
 *
 * const { 
 *   requestDevice, 
 *   connect, 
 *   disconnect, 
 *   sendData, 
 *   receiveData, 
 *   device, 
 *   isConnected 
 * } = useUSB();
 *
 * // Request a USB device
 * requestDevice({ filters: [{ vendorId: 0x2341 }] }).then(() => {
 *   connect();
 *   // Send data to device
 *   sendData(1, new Uint8Array([0x01, 0x02, 0x03]));
 * });
 */
function useUSB(): USBHandler {
    const [device, setDevice] = useState<USBDeviceInfo | null>(null);
    const [isConnected, setIsConnected] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);

    const isSupported = typeof navigator !== "undefined" && "usb" in navigator;

    const usbDeviceRef = useRef<USBDevice | null>(null);

    // Set up USB device connection/disconnection listeners
    useEffect(() => {
        if (!isSupported) {
            return;
        }

        const handleConnectedDevice = (event: Event) => {
            const usbEvent = event as USBConnectionEvent;

            // Update the device state if it matches our current device
            if (usbDeviceRef.current && usbDeviceRef.current.serialNumber === usbEvent.device.serialNumber) {
                const deviceInfo: USBDeviceInfo = {
                    vendorId: usbEvent.device.vendorId,
                    productId: usbEvent.device.productId,
                    productName: usbEvent.device.productName,
                    manufacturerName: usbEvent.device.manufacturerName,
                    serialNumber: usbEvent.device.serialNumber,
                };

                setDevice(deviceInfo);
            }
        };

        const handleDisconnectedDevice = (event: Event) => {
            const usbEvent = event as USBConnectionEvent;

            // If our current device was disconnected, update the state
            if (
                usbDeviceRef.current &&
                usbDeviceRef.current.serialNumber === usbEvent.device.serialNumber
            ) {
                setIsConnected(false);
                usbDeviceRef.current = null;
            }
        };

        // Add event listeners
        (navigator as unknown as NavigatorUSB).usb.addEventListener('connect', handleConnectedDevice);
        (navigator as unknown as NavigatorUSB).usb.addEventListener('disconnect', handleDisconnectedDevice);

        // Clean up event listeners
        return () => {
            (navigator as unknown as NavigatorUSB).usb.removeEventListener('connect', handleConnectedDevice);
            (navigator as unknown as NavigatorUSB).usb.removeEventListener('disconnect', handleDisconnectedDevice);
        };
    }, [isSupported]);

    // Request a USB device
    const requestDevice = useCallback(async (options: USBDeviceRequestOptions): Promise<USBDeviceInfo | null> => {
        if (!isSupported) {
            const error = new Error("WebUSB API is not supported in this browser");
            setError(error);
            return null;
        }

        try {
            const usbDevice = await (navigator as unknown as NavigatorUSB).usb.requestDevice(options);

            usbDeviceRef.current = usbDevice;

            const deviceInfo: USBDeviceInfo = {
                vendorId: usbDevice.vendorId,
                productId: usbDevice.productId,
                productName: usbDevice.productName,
                manufacturerName: usbDevice.manufacturerName,
                serialNumber: usbDevice.serialNumber,
            };

            setDevice(deviceInfo);
            return deviceInfo;
        } catch (err) {
            // Don't set error if user cancelled device selection
            if (err instanceof Error && err.name === "NotFoundError") {
                return null;
            }

            const error = err instanceof Error ? err : new Error(String(err));
            setError(error);
            return null;
        }
    }, [isSupported]);

    // List all paired USB devices
    const listDevices = useCallback(async (): Promise<USBDeviceInfo[]> => {
        if (!isSupported) {
            const error = new Error("WebUSB API is not supported in this browser");
            setError(error);
            return [];
        }

        try {
            const devices = await (navigator as unknown as NavigatorUSB).usb.getDevices();

            return devices.map(device => ({
                vendorId: device.vendorId,
                productId: device.productId,
                productName: device.productName,
                manufacturerName: device.manufacturerName,
                serialNumber: device.serialNumber,
            }));
        } catch (err) {
            const error = err instanceof Error ? err : new Error(String(err));
            setError(error);
            return [];
        }
    }, [isSupported]);

    // Connect to the USB device
    const connect = useCallback(async (): Promise<boolean> => {
        if (!isSupported || !usbDeviceRef.current) {
            const error = new Error("No USB device selected");
            setError(error);
            return false;
        }

        try {
            if (!usbDeviceRef.current.opened) {
                await usbDeviceRef.current.open();
            }

            setIsConnected(true);
            return true;
        } catch (err) {
            const error = err instanceof Error ? err : new Error(String(err));
            setError(error);
            return false;
        }
    }, [isSupported]);

    // Disconnect from the USB device
    const disconnect = useCallback(async (): Promise<void> => {
        if (!isSupported || !usbDeviceRef.current) {
            return;
        }

        try {
            if (usbDeviceRef.current.opened) {
                await usbDeviceRef.current.close();
            }

            setIsConnected(false);
        } catch (err) {
            const error = err instanceof Error ? err : new Error(String(err));
            setError(error);
        }
    }, [isSupported]);

    // Send data to the USB device
    const sendData = useCallback(async (
        endpointNumber: number,
        data: BufferSource
    ): Promise<{ bytesWritten: number; status: USBTransferStatus } | null> => {
        if (!isSupported || !usbDeviceRef.current || !isConnected) {
            const error = new Error("USB device not connected");
            setError(error);
            return null;
        }

        try {
            const result = await usbDeviceRef.current.transferOut(endpointNumber, data);

            return {
                bytesWritten: result.bytesWritten,
                status: result.status,
            };
        } catch (err) {
            const error = err instanceof Error ? err : new Error(String(err));
            setError(error);
            return null;
        }
    }, [isSupported, isConnected]);

    // Receive data from the USB device
    const receiveData = useCallback(async (
        endpointNumber: number,
        length: number
    ): Promise<{ data: DataView | null; status: USBTransferStatus } | null> => {
        if (!isSupported || !usbDeviceRef.current || !isConnected) {
            const error = new Error("USB device not connected");
            setError(error);
            return null;
        }

        try {
            const result = await usbDeviceRef.current.transferIn(endpointNumber, length);

            return {
                data: result.data || null,
                status: result.status,
            };
        } catch (err) {
            const error = err instanceof Error ? err : new Error(String(err));
            setError(error);
            return null;
        }
    }, [isSupported, isConnected]);

    return {
        requestDevice,
        connect,
        disconnect,
        sendData,
        receiveData,
        listDevices,
        device,
        isConnected,
        error,
        isSupported
    };
}

export { useUSB }; 