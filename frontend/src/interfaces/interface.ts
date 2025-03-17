export interface Collaborator {
    id: string;
    email: string;
    color: string;
}

export interface CollaboratorsListProps {
    collaborators: Collaborator[];
}

export interface Document {
    title: string;
    content?: string;
    permissions: {
        user: string;
        role: 'owner' | 'editor' | 'viewer';
    }[];
    createdBy: {
        userId: string;
    };
}

export interface SpeechRecognitionEvent extends Event {
    results: {
        length: number;
        item(index: number): {
            item(index: number): {
                transcript: string;
            };
            isFinal: boolean;
        };
        [index: number]: {
            [index: number]: {
                transcript: string;
            };
            isFinal: boolean;
        };
    };
}

export interface SpeechRecognitionErrorEvent extends Event {
    error: string;
}

export interface SpeechRecognition extends EventTarget {
    continuous: boolean;
    interimResults: boolean;
    start(): void;
    stop(): void;
    onresult: (event: SpeechRecognitionEvent) => void;
    onerror: (event: SpeechRecognitionErrorEvent) => void;
}