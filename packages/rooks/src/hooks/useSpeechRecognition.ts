import { useCallback, useEffect, useRef, useState } from "react";

// Define types that might not be in TypeScript's standard lib
interface SpeechRecognitionEvent extends Event {
    resultIndex: number;
    results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
    error: string;
    message: string;
}

interface SpeechRecognitionResultList {
    length: number;
    item(index: number): SpeechRecognitionResult;
    [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
    length: number;
    item(index: number): SpeechRecognitionAlternative;
    [index: number]: SpeechRecognitionAlternative;
    isFinal: boolean;
}

interface SpeechRecognitionAlternative {
    transcript: string;
    confidence: number;
}

interface SpeechGrammarList {
    length: number;
    item(index: number): SpeechGrammar;
    [index: number]: SpeechGrammar;
    addFromURI(src: string, weight?: number): void;
    addFromString(string: string, weight?: number): void;
}

interface SpeechGrammar {
    src: string;
    weight: number;
}

// Extend Window interface
interface Window {
    SpeechRecognition?: new () => SpeechRecognition;
    webkitSpeechRecognition?: new () => SpeechRecognition;
    mozSpeechRecognition?: new () => SpeechRecognition;
    msSpeechRecognition?: new () => SpeechRecognition;
    SpeechGrammarList?: new () => SpeechGrammarList;
    webkitSpeechGrammarList?: new () => SpeechGrammarList;
}

interface SpeechRecognition extends EventTarget {
    continuous: boolean;
    interimResults: boolean;
    lang: string;
    maxAlternatives: number;
    grammars: SpeechGrammarList;
    start(): void;
    stop(): void;
    abort(): void;
    onstart: (event: Event) => void;
    onend: (event: Event) => void;
    onerror: (event: SpeechRecognitionErrorEvent) => void;
    onresult: (event: SpeechRecognitionEvent) => void;
}

export type SpeechRecognitionOptions = {
    continuous?: boolean;
    interimResults?: boolean;
    lang?: string;
    maxAlternatives?: number;
    grammars?: SpeechGrammarList;
    onStart?: () => void;
    onEnd?: () => void;
    onError?: (error: SpeechRecognitionErrorEvent) => void;
    onResult?: (event: SpeechRecognitionEvent) => void;
};

export type SpeechRecognitionHandler = {
    start: () => void;
    stop: () => void;
    abort: () => void;
    transcript: string;
    isListening: boolean;
    error: Error | null;
    clearTranscript: () => void;
    isSupported: boolean;
    interimTranscript: string;
    finalTranscript: string;
};

/**
 * useSpeechRecognition
 * @description A hook for voice input capture and processing
 * @param {SpeechRecognitionOptions} options Options for speech recognition
 * @returns {SpeechRecognitionHandler} Methods and state for speech recognition
 * @see {@link https://rooks.vercel.app/docs/useSpeechRecognition}
 *
 * @example
 *
 * const { 
 *   start, 
 *   stop, 
 *   transcript, 
 *   isListening, 
 *   error, 
 *   clearTranscript 
 * } = useSpeechRecognition({ continuous: true });
 *
 * // Start listening
 * start();
 *
 * // Use the transcript
 * console.log(transcript);
 */
function useSpeechRecognition(options: SpeechRecognitionOptions = {}): SpeechRecognitionHandler {
    const {
        continuous = false,
        interimResults = true,
        lang = "en-US",
        maxAlternatives = 1,
        grammars,
        onStart,
        onEnd,
        onError,
        onResult
    } = options;

    const [isListening, setIsListening] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);
    const [interimTranscript, setInterimTranscript] = useState<string>("");
    const [finalTranscript, setFinalTranscript] = useState<string>("");

    // Check if SpeechRecognition is supported
    const SpeechRecognition = useRef<any>(
        typeof window !== "undefined" &&
        ((window as any).SpeechRecognition ||
            (window as any).webkitSpeechRecognition ||
            (window as any).mozSpeechRecognition ||
            (window as any).msSpeechRecognition)
    ).current;

    const isSupported = !!SpeechRecognition;

    const recognitionRef = useRef<SpeechRecognition | null>(null);

    // Initialize speech recognition
    useEffect(() => {
        if (!isSupported) {
            return;
        }

        // Create a new SpeechRecognition instance
        recognitionRef.current = new SpeechRecognition();

        // Configure the recognition
        const recognition = recognitionRef.current;
        if (!recognition) return;

        recognition.continuous = continuous;
        recognition.interimResults = interimResults;
        recognition.lang = lang;
        recognition.maxAlternatives = maxAlternatives;

        if (grammars) {
            recognition.grammars = grammars;
        }

        // Set up event handlers
        recognition.onstart = () => {
            setIsListening(true);
            onStart?.();
        };

        recognition.onend = () => {
            setIsListening(false);
            onEnd?.();
        };

        recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
            setError(new Error(`Speech recognition error: ${event.error}`));
            onError?.(event);
        };

        recognition.onresult = (event: SpeechRecognitionEvent) => {
            let interimText = "";
            let finalText = finalTranscript;

            for (let i = event.resultIndex; i < event.results.length; i++) {
                const transcript = event.results[i][0].transcript;

                if (event.results[i].isFinal) {
                    finalText += transcript + " ";
                } else {
                    interimText += transcript;
                }
            }

            setInterimTranscript(interimText);
            setFinalTranscript(finalText);
            onResult?.(event);
        };

        // Clean up
        return () => {
            if (recognition && isListening) {
                recognition.stop();
            }
        };
    }, [
        isSupported,
        continuous,
        interimResults,
        lang,
        maxAlternatives,
        grammars,
        onStart,
        onEnd,
        onError,
        onResult,
        isListening,
        finalTranscript
    ]);

    // Start recognition
    const start = useCallback(() => {
        if (!isSupported) {
            setError(new Error("Speech recognition is not supported in this browser"));
            return;
        }

        if (isListening) {
            return;
        }

        try {
            recognitionRef.current?.start();
        } catch (err) {
            setError(err instanceof Error ? err : new Error(String(err)));
        }
    }, [isSupported, isListening]);

    // Stop recognition
    const stop = useCallback(() => {
        if (!isSupported || !isListening || !recognitionRef.current) {
            return;
        }

        try {
            recognitionRef.current.stop();
        } catch (err) {
            setError(err instanceof Error ? err : new Error(String(err)));
        }
    }, [isSupported, isListening]);

    // Abort recognition
    const abort = useCallback(() => {
        if (!isSupported || !recognitionRef.current) {
            return;
        }

        try {
            recognitionRef.current.abort();
        } catch (err) {
            setError(err instanceof Error ? err : new Error(String(err)));
        }
    }, [isSupported]);

    // Clear the transcript
    const clearTranscript = useCallback(() => {
        setInterimTranscript("");
        setFinalTranscript("");
    }, []);

    // Combine final and interim transcripts for the current full transcript
    const transcript = finalTranscript + interimTranscript;

    return {
        start,
        stop,
        abort,
        transcript,
        isListening,
        error,
        clearTranscript,
        isSupported,
        interimTranscript,
        finalTranscript
    };
}

export { useSpeechRecognition }; 