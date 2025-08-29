/**
 * @jest-environment jsdom
 */
import { renderHook, act } from "@testing-library/react-hooks";
import { useBroadcastChannel } from "@/hooks/useBroadcastChannel";

// Mock BroadcastChannel
class MockBroadcastChannel {
  public name: string;
  public onmessage: ((this: BroadcastChannel, ev: MessageEvent) => any) | null = null;
  public onmessageerror: ((this: BroadcastChannel, ev: MessageEvent) => any) | null = null;
  private listeners: Map<string, Set<EventListener>> = new Map();

  constructor(name: string) {
    this.name = name;
  }

  addEventListener(type: string, listener: EventListener): void {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, new Set());
    }
    this.listeners.get(type)!.add(listener);
  }

  removeEventListener(type: string, listener: EventListener): void {
    const listeners = this.listeners.get(type);
    if (listeners) {
      listeners.delete(listener);
    }
  }

  postMessage(data: any): void {
    // Simulate async message dispatch
    setTimeout(() => {
      const messageEvent = new MessageEvent("message", { data });
      const listeners = this.listeners.get("message");
      if (listeners) {
        listeners.forEach((listener) => {
          (listener as any)(messageEvent);
        });
      }
    }, 0);
  }

  close(): void {
    this.listeners.clear();
  }

  // Helper method to simulate errors for testing
  simulateError(): void {
    setTimeout(() => {
      const errorEvent = new Event("messageerror");
      const listeners = this.listeners.get("messageerror");
      if (listeners) {
        listeners.forEach((listener) => {
          (listener as any)(errorEvent);
        });
      }
    }, 0);
  }
}

// Store original BroadcastChannel
const originalBroadcastChannel = (global as any).BroadcastChannel;

describe("useBroadcastChannel", () => {
  beforeEach(() => {
    // Mock BroadcastChannel globally
    (global as any).BroadcastChannel = MockBroadcastChannel;
  });

  afterEach(() => {
    // Restore original BroadcastChannel
    (global as any).BroadcastChannel = originalBroadcastChannel;
    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect.hasAssertions();
    expect(useBroadcastChannel).toBeDefined();
  });

  describe("Basic Functionality", () => {
    it("should return correct initial state when supported", () => {
      expect.hasAssertions();
      const { result } = renderHook(() => useBroadcastChannel("test-channel"));

      expect(result.current.isSupported).toBe(true);
      expect(result.current.postMessage).toBeInstanceOf(Function);
      expect(result.current.close).toBeInstanceOf(Function);
    });

    it("should detect when BroadcastChannel is not supported", () => {
      expect.hasAssertions();
      
      // Mock undefined BroadcastChannel
      (global as any).BroadcastChannel = undefined;

      const { result } = renderHook(() => useBroadcastChannel("test-channel"));

      expect(result.current.isSupported).toBe(false);
      expect(result.current.postMessage).toBeInstanceOf(Function);
      expect(result.current.close).toBeInstanceOf(Function);
    });

    it("should detect when window is undefined (SSR)", () => {
      expect.hasAssertions();
      
      // Mock window as undefined
      const originalWindow = global.window;
      delete (global as any).window;

      const { result } = renderHook(() => useBroadcastChannel("test-channel"));

      expect(result.current.isSupported).toBe(false);

      // Restore window
      (global as any).window = originalWindow;
    });
  });

  describe("Message Handling", () => {
    it("should receive messages through onMessage callback", async () => {
      expect.hasAssertions();
      const onMessageSpy = jest.fn();
      const testData = { message: "Hello", timestamp: Date.now() };

      const { result } = renderHook(() => 
        useBroadcastChannel("test-channel", { onMessage: onMessageSpy })
      );

      // Post a message
      act(() => {
        result.current.postMessage(testData);
      });

      // Wait for async message dispatch
      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 10));
      });

      expect(onMessageSpy).toHaveBeenCalledWith(testData);
    });

    it("should handle different data types", async () => {
      expect.hasAssertions();
      const onMessageSpy = jest.fn();

      const { result } = renderHook(() => 
        useBroadcastChannel("test-channel", { onMessage: onMessageSpy })
      );

      // Test string
      act(() => {
        result.current.postMessage("string message");
      });

      // Test number
      act(() => {
        result.current.postMessage(42);
      });

      // Test boolean
      act(() => {
        result.current.postMessage(true);
      });

      // Test object
      const testObject = { type: "test", data: [1, 2, 3] };
      act(() => {
        result.current.postMessage(testObject);
      });

      // Wait for all async message dispatches
      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 50));
      });

      expect(onMessageSpy).toHaveBeenCalledTimes(4);
      expect(onMessageSpy).toHaveBeenNthCalledWith(1, "string message");
      expect(onMessageSpy).toHaveBeenNthCalledWith(2, 42);
      expect(onMessageSpy).toHaveBeenNthCalledWith(3, true);
      expect(onMessageSpy).toHaveBeenNthCalledWith(4, testObject);
    });

    it("should work without onMessage callback", () => {
      expect.hasAssertions();
      const { result } = renderHook(() => useBroadcastChannel("test-channel"));

      // Should not throw when no onMessage callback is provided
      expect(() => {
        act(() => {
          result.current.postMessage("test");
        });
      }).not.toThrow();
    });
  });

  describe("Error Handling", () => {
    it("should handle errors through onError callback", async () => {
      expect.hasAssertions();
      const onErrorSpy = jest.fn();

      // Create a mock that can simulate errors
      class ErroringBroadcastChannel extends MockBroadcastChannel {
        constructor(name: string) {
          super(name);
          // Simulate error after construction
          setTimeout(() => {
            const errorEvent = new Event("messageerror");
            const listeners = (this as any).listeners.get("messageerror");
            if (listeners) {
              listeners.forEach((listener: any) => {
                listener(errorEvent);
              });
            }
          }, 5);
        }
      }

      (global as any).BroadcastChannel = ErroringBroadcastChannel;

      const { result } = renderHook(() => 
        useBroadcastChannel("test-channel", { onError: onErrorSpy })
      );

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 10));
      });

      expect(onErrorSpy).toHaveBeenCalled();
    });

    it("should warn when posting message on unsupported browser", () => {
      expect.hasAssertions();
      const consoleSpy = jest.spyOn(console, "warn").mockImplementation();

      // Mock undefined BroadcastChannel
      (global as any).BroadcastChannel = undefined;

      const { result } = renderHook(() => useBroadcastChannel("test-channel"));

      act(() => {
        result.current.postMessage("test");
      });

      expect(consoleSpy).toHaveBeenCalledWith(
        "useBroadcastChannel: BroadcastChannel API is not supported"
      );

      consoleSpy.mockRestore();
    });

    it("should handle postMessage errors gracefully", () => {
      expect.hasAssertions();
      const onErrorSpy = jest.fn();
      const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();

      // Mock BroadcastChannel that throws on postMessage
      class ThrowingBroadcastChannel extends MockBroadcastChannel {
        postMessage(): void {
          throw new Error("Post message failed");
        }
      }

      (global as any).BroadcastChannel = ThrowingBroadcastChannel;

      const { result } = renderHook(() => 
        useBroadcastChannel("test-channel", { onError: onErrorSpy })
      );

      act(() => {
        result.current.postMessage("test");
      });

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "useBroadcastChannel: Failed to post message",
        expect.any(Error)
      );
      expect(onErrorSpy).toHaveBeenCalledWith(expect.any(Error));

      consoleErrorSpy.mockRestore();
    });
  });

  describe("Channel Management", () => {
    it("should create different channels for different channel names", () => {
      expect.hasAssertions();
      const { result: result1 } = renderHook(() => useBroadcastChannel("channel-1"));
      const { result: result2 } = renderHook(() => useBroadcastChannel("channel-2"));

      // Both should be supported and have their own functions
      expect(result1.current.isSupported).toBe(true);
      expect(result2.current.isSupported).toBe(true);
      expect(result1.current.postMessage).not.toBe(result2.current.postMessage);
    });

    it("should recreate channel when channel name changes", () => {
      expect.hasAssertions();
      const closeSpy = jest.fn();
      
      // Mock BroadcastChannel with close spy
      class SpyBroadcastChannel extends MockBroadcastChannel {
        close(): void {
          closeSpy();
          super.close();
        }
      }

      (global as any).BroadcastChannel = SpyBroadcastChannel;

      const { result, rerender } = renderHook(
        ({ channelName }) => useBroadcastChannel(channelName),
        { initialProps: { channelName: "channel-1" } }
      );

      expect(result.current.isSupported).toBe(true);

      // Change channel name - this should close the old channel and create a new one
      rerender({ channelName: "channel-2" });

      // Should have closed the previous channel
      expect(closeSpy).toHaveBeenCalled();
      expect(result.current.isSupported).toBe(true);
    });

    it("should close channel manually", () => {
      expect.hasAssertions();
      const { result } = renderHook(() => useBroadcastChannel("test-channel"));

      // Should not throw
      expect(() => {
        act(() => {
          result.current.close();
        });
      }).not.toThrow();
    });

    it("should handle close when channel is already closed", () => {
      expect.hasAssertions();
      const { result } = renderHook(() => useBroadcastChannel("test-channel"));

      act(() => {
        result.current.close();
      });

      // Second close should not throw
      expect(() => {
        act(() => {
          result.current.close();
        });
      }).not.toThrow();
    });

    it("should clean up on unmount", () => {
      expect.hasAssertions();
      const closeSpy = jest.fn();
      
      // Mock BroadcastChannel with close spy
      class SpyBroadcastChannel extends MockBroadcastChannel {
        close(): void {
          closeSpy();
          super.close();
        }
      }

      (global as any).BroadcastChannel = SpyBroadcastChannel;

      const { unmount } = renderHook(() => useBroadcastChannel("test-channel"));

      unmount();

      expect(closeSpy).toHaveBeenCalled();
    });
  });

  describe("Callback Stability", () => {
    it("should maintain stable postMessage reference", () => {
      expect.hasAssertions();
      const { result, rerender } = renderHook(
        ({ onMessage }: { onMessage: jest.Mock }) => useBroadcastChannel("test-channel", { onMessage }),
        { initialProps: { onMessage: jest.fn() } }
      );

      const firstPostMessage = result.current.postMessage;

      // Rerender with same channel name but different callback
      rerender({ onMessage: jest.fn() });

      // postMessage should remain stable for same channel
      expect(result.current.postMessage).toBe(firstPostMessage);
    });

    it("should maintain stable close reference", () => {
      expect.hasAssertions();
      const { result, rerender } = renderHook(
        ({ onMessage }: { onMessage: jest.Mock }) => useBroadcastChannel("test-channel", { onMessage }),
        { initialProps: { onMessage: jest.fn() } }
      );

      const firstClose = result.current.close;

      // Rerender with different callback
      rerender({ onMessage: jest.fn() });

      expect(result.current.close).toBe(firstClose);
    });
  });

  describe("TypeScript Generics", () => {
    it("should work with typed messages", async () => {
      expect.hasAssertions();
      
      interface TestMessage {
        type: "test";
        payload: string;
        timestamp: number;
      }

      const onMessageSpy = jest.fn<void, [TestMessage]>();

      const { result } = renderHook(() => 
        useBroadcastChannel<TestMessage>("typed-channel", { onMessage: onMessageSpy })
      );

      const testMessage: TestMessage = {
        type: "test",
        payload: "Hello TypeScript",
        timestamp: Date.now()
      };

      act(() => {
        result.current.postMessage(testMessage);
      });

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 10));
      });

      expect(onMessageSpy).toHaveBeenCalledWith(testMessage);
    });
  });
});