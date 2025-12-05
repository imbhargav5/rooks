import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';

// SpeechSynthesisUtterance mock
class SpeechSynthesisUtteranceMock {
  text: string = '';
  lang: string = '';
  voiceURI: string = '';
  volume: number = 1;
  rate: number = 1;
  pitch: number = 1;
  onstart: (() => void) | null = null;
  onend: (() => void) | null = null;
  onerror: (() => void) | null = null;
  onpause: (() => void) | null = null;
  onresume: (() => void) | null = null;
  onboundary: (() => void) | null = null;
}

(global as any).SpeechSynthesisUtterance = SpeechSynthesisUtteranceMock;
(global as any).fetch = vi.fn();
