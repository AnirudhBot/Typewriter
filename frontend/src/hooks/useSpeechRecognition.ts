import { useState, useRef, useCallback, RefObject } from 'react';
import Quill from 'quill';
import { SpeechRecognition, SpeechRecognitionEvent, SpeechRecognitionErrorEvent } from '../interfaces/interface';

declare global {
    interface Window {
        SpeechRecognition: {
            new(): SpeechRecognition;
        };
        webkitSpeechRecognition: {
            new(): SpeechRecognition;
        };
    }
}

interface UseSpeechRecognitionProps {
    quillRef: RefObject<Quill | null>;
}

export const useSpeechRecognition = ({ quillRef }: UseSpeechRecognitionProps) => {
    const [isListening, setIsListening] = useState(false);
    const recognition = useRef<SpeechRecognition | null>(null);

    const initializeSpeechRecognition = useCallback(() => {
        if (!recognition.current) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

            if (!SpeechRecognition) {
                console.error('Speech recognition is not supported in this browser');
                return false;
            }

            recognition.current = new SpeechRecognition();
            recognition.current.continuous = true;
            recognition.current.interimResults = true;

            recognition.current.onresult = (event: SpeechRecognitionEvent) => {
                const results = Array.from({ length: event.results.length },
                    (_, i) => event.results.item(i).item(0));
                const transcript = results
                    .map(result => result.transcript)
                    .join('');

                if (event.results[0].isFinal && quillRef.current) {
                    const range = quillRef.current.getSelection() || {
                        index: quillRef.current.getLength(),
                        length: 0
                    };
                    quillRef.current.insertText(range.index, transcript + ' ');
                }
            };

            recognition.current.onerror = (event: SpeechRecognitionErrorEvent) => {
                console.error('Speech recognition error:', event.error);
                setIsListening(false);
            };
        }
        return true;
    }, [quillRef]);

    const toggleSpeechRecognition = useCallback(() => {
        const isInitialized = initializeSpeechRecognition();

        if (!isInitialized || !recognition.current) {
            return;
        }

        if (isListening) {
            recognition.current.stop();
            setIsListening(false);
        } else {
            recognition.current.start();
            setIsListening(true);
        }
    }, [isListening, initializeSpeechRecognition]);

    return {
        isListening,
        toggleSpeechRecognition
    };
};