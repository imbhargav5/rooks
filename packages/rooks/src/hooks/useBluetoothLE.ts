import { useCallback, useEffect, useRef, useState } from "react";

// Type definitions for Web Bluetooth API
interface BluetoothRequestDeviceFilter {
    services?: BluetoothServiceUUID[];
    name?: string;
    namePrefix?: string;
    manufacturerId?: number;
    serviceDataUUID?: BluetoothServiceUUID;
}

type BluetoothServiceUUID = string | number;

interface RequestDeviceOptions {
    filters?: BluetoothRequestDeviceFilter[];
    optionalServices?: BluetoothServiceUUID[];
    acceptAllDevices?: boolean;
}

interface BluetoothRemoteGATTDescriptor {
    characteristic: BluetoothRemoteGATTCharacteristic;
    uuid: string;
    value?: DataView;
    readValue(): Promise<DataView>;
    writeValue(value: BufferSource): Promise<void>;
}

interface BluetoothRemoteGATTCharacteristic {
    service: BluetoothRemoteGATTService;
    uuid: string;
    properties: {
        broadcast: boolean;
        read: boolean;
        writeWithoutResponse: boolean;
        write: boolean;
        notify: boolean;
        indicate: boolean;
        authenticatedSignedWrites: boolean;
        reliableWrite: boolean;
        writableAuxiliaries: boolean;
    };
    value?: DataView;
    getDescriptor(uuid: string): Promise<BluetoothRemoteGATTDescriptor>;
    getDescriptors(uuid?: string): Promise<BluetoothRemoteGATTDescriptor[]>;
    readValue(): Promise<DataView>;
    writeValue(value: BufferSource): Promise<void>;
    startNotifications(): Promise<BluetoothRemoteGATTCharacteristic>;
    stopNotifications(): Promise<BluetoothRemoteGATTCharacteristic>;
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

interface BluetoothRemoteGATTService {
    device: BluetoothDevice;
    uuid: string;
    isPrimary: boolean;
    getCharacteristic(uuid: string): Promise<BluetoothRemoteGATTCharacteristic>;
    getCharacteristics(
        uuid?: string
    ): Promise<BluetoothRemoteGATTCharacteristic[]>;
    getIncludedService(uuid: string): Promise<BluetoothRemoteGATTService>;
    getIncludedServices(uuid?: string): Promise<BluetoothRemoteGATTService[]>;
}

interface BluetoothRemoteGATTServer {
    device: BluetoothDevice;
    connected: boolean;
    connect(): Promise<BluetoothRemoteGATTServer>;
    disconnect(): void;
    getPrimaryService(uuid: string): Promise<BluetoothRemoteGATTService>;
    getPrimaryServices(uuid?: string): Promise<BluetoothRemoteGATTService[]>;
}

interface BluetoothDevice extends EventTarget {
    id: string;
    name?: string;
    gatt?: BluetoothRemoteGATTServer;
    forget(): Promise<void>;
    watchAdvertisements(): Promise<void>;
    unwatchAdvertisements(): void;
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

// Extend Navigator interface
interface NavigatorBluetooth {
    bluetooth: {
        getAvailability(): Promise<boolean>;
        requestDevice(options?: RequestDeviceOptions): Promise<BluetoothDevice>;
        getDevices(): Promise<BluetoothDevice[]>;
    };
}

export type BluetoothLEOptions = {
    filters?: BluetoothRequestDeviceFilter[];
    optionalServices?: BluetoothServiceUUID[];
    acceptAllDevices?: boolean;
};

export type BluetoothDeviceInfo = {
    id: string;
    name?: string;
};

export type BluetoothLEHandler = {
    requestDevice: (options?: BluetoothLEOptions) => Promise<BluetoothDeviceInfo | null>;
    connect: () => Promise<boolean>;
    disconnect: () => Promise<void>;
    readValue: (serviceUUID: string, characteristicUUID: string) => Promise<DataView | null>;
    writeValue: (serviceUUID: string, characteristicUUID: string, value: BufferSource) => Promise<boolean>;
    startNotifications: (serviceUUID: string, characteristicUUID: string, listener: (event: Event) => void) => Promise<boolean>;
    stopNotifications: (serviceUUID: string, characteristicUUID: string) => Promise<boolean>;
    device: BluetoothDeviceInfo | null;
    isConnected: boolean;
    error: Error | null;
    isSupported: boolean;
};

/**
 * useBluetoothLE
 * @description A hook for the Web Bluetooth API
 * @returns {BluetoothLEHandler} Methods and state for Bluetooth LE interaction
 * @see {@link https://rooks.vercel.app/docs/useBluetoothLE}
 *
 * @example
 *
 * const { 
 *   requestDevice, 
 *   connect, 
 *   disconnect, 
 *   readValue, 
 *   writeValue, 
 *   device, 
 *   isConnected 
 * } = useBluetoothLE();
 *
 * // Request a device
 * requestDevice({ filters: [{ services: ['heart_rate'] }] }).then(() => {
 *   connect();
 *   // Read heart rate
 *   readValue("heart_rate", "heart_rate_measurement").then(value => {
 *     console.log(value);
 *   });
 * });
 */
function useBluetoothLE(): BluetoothLEHandler {
    const [device, setDevice] = useState<BluetoothDeviceInfo | null>(null);
    const [isConnected, setIsConnected] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);

    const isSupported = typeof navigator !== "undefined" && "bluetooth" in navigator;

    const bluetoothDeviceRef = useRef<BluetoothDevice | null>(null);
    const gattServerRef = useRef<BluetoothRemoteGATTServer | null>(null);
    const servicesRef = useRef<Map<string, BluetoothRemoteGATTService>>(new Map());
    const characteristicsRef = useRef<Map<string, BluetoothRemoteGATTCharacteristic>>(new Map());

    // Handle device disconnection
    useEffect(() => {
        const handleDisconnected = () => {
            setIsConnected(false);
            servicesRef.current.clear();
            characteristicsRef.current.clear();
            gattServerRef.current = null;
        };

        if (bluetoothDeviceRef.current) {
            bluetoothDeviceRef.current.addEventListener("gattserverdisconnected", handleDisconnected);
        }

        return () => {
            if (bluetoothDeviceRef.current) {
                bluetoothDeviceRef.current.removeEventListener("gattserverdisconnected", handleDisconnected);
            }
        };
    }, []);

    // Request a Bluetooth device
    const requestDevice = useCallback(async (options: BluetoothLEOptions = {}): Promise<BluetoothDeviceInfo | null> => {
        if (!isSupported) {
            const error = new Error("Web Bluetooth API is not supported in this browser");
            setError(error);
            return null;
        }

        try {
            const requestOptions: RequestDeviceOptions = {};

            if (options.acceptAllDevices) {
                requestOptions.acceptAllDevices = true;
            } else if (options.filters) {
                requestOptions.filters = options.filters;
            } else {
                requestOptions.acceptAllDevices = true;
            }

            if (options.optionalServices) {
                requestOptions.optionalServices = options.optionalServices;
            }

            const bluetoothDevice = await (navigator as unknown as NavigatorBluetooth).bluetooth.requestDevice(requestOptions);

            bluetoothDeviceRef.current = bluetoothDevice;

            const deviceInfo: BluetoothDeviceInfo = {
                id: bluetoothDevice.id,
                name: bluetoothDevice.name,
            };

            setDevice(deviceInfo);
            return deviceInfo;
        } catch (err) {
            if (err instanceof Error && err.name === "NotFoundError") {
                // User cancelled the device picker, not an actual error
                return null;
            }

            const error = err instanceof Error ? err : new Error(String(err));
            setError(error);
            return null;
        }
    }, [isSupported]);

    // Connect to a Bluetooth device
    const connect = useCallback(async (): Promise<boolean> => {
        if (!isSupported || !bluetoothDeviceRef.current) {
            const error = new Error("No Bluetooth device selected");
            setError(error);
            return false;
        }

        try {
            // Connect to the GATT server
            const server = await bluetoothDeviceRef.current.gatt?.connect();

            if (!server) {
                throw new Error("Failed to connect to GATT server");
            }

            gattServerRef.current = server;
            setIsConnected(true);
            return true;
        } catch (err) {
            const error = err instanceof Error ? err : new Error(String(err));
            setError(error);
            return false;
        }
    }, [isSupported]);

    // Disconnect from a Bluetooth device
    const disconnect = useCallback(async (): Promise<void> => {
        if (!isSupported || !gattServerRef.current) {
            return;
        }

        try {
            gattServerRef.current.disconnect();
            setIsConnected(false);
            servicesRef.current.clear();
            characteristicsRef.current.clear();
        } catch (err) {
            const error = err instanceof Error ? err : new Error(String(err));
            setError(error);
        }
    }, [isSupported]);

    // Get a GATT service
    const getService = useCallback(async (serviceUUID: string): Promise<BluetoothRemoteGATTService | null> => {
        if (!isSupported || !gattServerRef.current) {
            const error = new Error("Bluetooth device not connected");
            setError(error);
            return null;
        }

        try {
            // Check if we already have this service
            if (servicesRef.current.has(serviceUUID)) {
                return servicesRef.current.get(serviceUUID) || null;
            }

            // Get the service
            const service = await gattServerRef.current.getPrimaryService(serviceUUID);

            if (!service) {
                throw new Error(`Service ${serviceUUID} not found`);
            }

            servicesRef.current.set(serviceUUID, service);
            return service;
        } catch (err) {
            const error = err instanceof Error ? err : new Error(String(err));
            setError(error);
            return null;
        }
    }, [isSupported]);

    // Get a GATT characteristic
    const getCharacteristic = useCallback(async (
        serviceUUID: string,
        characteristicUUID: string
    ): Promise<BluetoothRemoteGATTCharacteristic | null> => {
        if (!isSupported || !gattServerRef.current) {
            const error = new Error("Bluetooth device not connected");
            setError(error);
            return null;
        }

        try {
            // Generate a key for this characteristic
            const charKey = `${serviceUUID}:${characteristicUUID}`;

            // Check if we already have this characteristic
            if (characteristicsRef.current.has(charKey)) {
                return characteristicsRef.current.get(charKey) || null;
            }

            // Get the service
            const service = await getService(serviceUUID);

            if (!service) {
                throw new Error(`Service ${serviceUUID} not found`);
            }

            // Get the characteristic
            const characteristic = await service.getCharacteristic(characteristicUUID);

            if (!characteristic) {
                throw new Error(`Characteristic ${characteristicUUID} not found`);
            }

            characteristicsRef.current.set(charKey, characteristic);
            return characteristic;
        } catch (err) {
            const error = err instanceof Error ? err : new Error(String(err));
            setError(error);
            return null;
        }
    }, [isSupported, getService]);

    // Read a value from a characteristic
    const readValue = useCallback(async (
        serviceUUID: string,
        characteristicUUID: string
    ): Promise<DataView | null> => {
        if (!isSupported || !gattServerRef.current) {
            const error = new Error("Bluetooth device not connected");
            setError(error);
            return null;
        }

        try {
            const characteristic = await getCharacteristic(serviceUUID, characteristicUUID);

            if (!characteristic) {
                throw new Error(`Characteristic ${characteristicUUID} not found`);
            }

            const value = await characteristic.readValue();
            return value;
        } catch (err) {
            const error = err instanceof Error ? err : new Error(String(err));
            setError(error);
            return null;
        }
    }, [isSupported, getCharacteristic]);

    // Write a value to a characteristic
    const writeValue = useCallback(async (
        serviceUUID: string,
        characteristicUUID: string,
        value: BufferSource
    ): Promise<boolean> => {
        if (!isSupported || !gattServerRef.current) {
            const error = new Error("Bluetooth device not connected");
            setError(error);
            return false;
        }

        try {
            const characteristic = await getCharacteristic(serviceUUID, characteristicUUID);

            if (!characteristic) {
                throw new Error(`Characteristic ${characteristicUUID} not found`);
            }

            await characteristic.writeValue(value);
            return true;
        } catch (err) {
            const error = err instanceof Error ? err : new Error(String(err));
            setError(error);
            return false;
        }
    }, [isSupported, getCharacteristic]);

    // Start notifications from a characteristic
    const startNotifications = useCallback(async (
        serviceUUID: string,
        characteristicUUID: string,
        listener: (event: Event) => void
    ): Promise<boolean> => {
        if (!isSupported || !gattServerRef.current) {
            const error = new Error("Bluetooth device not connected");
            setError(error);
            return false;
        }

        try {
            const characteristic = await getCharacteristic(serviceUUID, characteristicUUID);

            if (!characteristic) {
                throw new Error(`Characteristic ${characteristicUUID} not found`);
            }

            await characteristic.startNotifications();
            characteristic.addEventListener('characteristicvaluechanged', listener);
            return true;
        } catch (err) {
            const error = err instanceof Error ? err : new Error(String(err));
            setError(error);
            return false;
        }
    }, [isSupported, getCharacteristic]);

    // Stop notifications from a characteristic
    const stopNotifications = useCallback(async (
        serviceUUID: string,
        characteristicUUID: string
    ): Promise<boolean> => {
        if (!isSupported || !gattServerRef.current) {
            const error = new Error("Bluetooth device not connected");
            setError(error);
            return false;
        }

        try {
            const characteristic = await getCharacteristic(serviceUUID, characteristicUUID);

            if (!characteristic) {
                throw new Error(`Characteristic ${characteristicUUID} not found`);
            }

            await characteristic.stopNotifications();
            return true;
        } catch (err) {
            const error = err instanceof Error ? err : new Error(String(err));
            setError(error);
            return false;
        }
    }, [isSupported, getCharacteristic]);

    return {
        requestDevice,
        connect,
        disconnect,
        readValue,
        writeValue,
        startNotifications,
        stopNotifications,
        device,
        isConnected,
        error,
        isSupported
    };
}

export { useBluetoothLE }; 