import "@testing-library/jest-dom";

// setupTests.ts
class SpeechSynthesisUtteranceMock {
  text: string;
  lang: string;
  voiceURI: string;
  volume: number;
  rate: number;
  pitch: number;
  onstart: (() => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
  onpause: (() => void) | null;
  onresume: (() => void) | null;
  onboundary: (() => void) | null;

  constructor() {
    this.text = "";
    this.lang = "";
    this.voiceURI = "";
    this.volume = 1;
    this.rate = 1;
    this.pitch = 1;
    this.onstart = null;
    this.onend = null;
    this.onerror = null;
    this.onpause = null;
    this.onresume = null;
    this.onboundary = null;
  }
}

// Add the mock implementation to the global scope
(global as any).SpeechSynthesisUtterance = SpeechSynthesisUtteranceMock;

// With SWC, we need to set up the global environment differently
if (typeof global !== 'undefined') {
  // Initialize the property first
  (global as any).IS_REACT_ACT_ENVIRONMENT = true;

  // Define self if it doesn't exist
  if (typeof (global as any).self === 'undefined') {
    (global as any).self = global;
  }

  // Set the property on self as well
  (global.self as any).IS_REACT_ACT_ENVIRONMENT = true;
}