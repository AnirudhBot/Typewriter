import { useEffect, useRef, useState } from 'react';
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import { QuillBinding } from 'y-quill';
import Quill from 'quill';
import QuillCursors from 'quill-cursors';
import { useAuth } from './useAuth';

Quill.register('modules/cursors', QuillCursors);

export const useCollaboration = (documentId: string, quillInstance: Quill | null) => {
    const { user } = useAuth();
    const ydocRef = useRef<Y.Doc | null>(null);
    const providerRef = useRef<WebsocketProvider | null>(null);
    const bindingRef = useRef<QuillBinding | null>(null);

    const [status, setStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting');
    const [users, setUsers] = useState<Array<{ id: string; email: string; color: string }>>([]);

    useEffect(() => {
        if (!quillInstance) return;
        if (!documentId || !user) return;

        const ydoc = new Y.Doc();
        ydocRef.current = ydoc;
        const ytext = ydoc.getText('quill');
        const wsUrl = import.meta.env.VITE_WS_URL || 'ws://localhost:1234';

        // Create WebSocket provider with user authentication
        const provider = new WebsocketProvider(wsUrl, `document-${documentId}`, ydoc, {
            params: { userId: user._id },
            connect: true
        });
        providerRef.current = provider;

        // Set initial awareness state
        const userColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
        provider.awareness.setLocalStateField('user', {
            name: user.email,
            email: user.email,
            color: userColor,
        });

        provider.on('status', (event: { status: 'connecting' | 'connected' | 'disconnected' }) => {
            setStatus(event.status);
        });

        provider.awareness.on('change', () => {
            // Update users list when awareness changes
            const states = Array.from(provider.awareness.getStates().entries());
            const updatedUsers = states.map(([clientId, state]: [number, any]) => ({
                id: clientId.toString(),
                email: state.user.email,
                color: state.user.color,
            }));
            setUsers(updatedUsers);
        });

        const binding = new QuillBinding(ytext, quillInstance, provider.awareness);
        bindingRef.current = binding;

        return () => {
            // Destroy binding
            if (bindingRef.current) {
                bindingRef.current.destroy();
            }

            // Disconnect provider
            if (providerRef.current) {
                providerRef.current.disconnect();
            }

            // Destroy ydoc
            if (ydocRef.current) {
                ydocRef.current.destroy();
            }
        };
    }, [documentId, user, quillInstance]);

    return {
        status,
        users,
        provider: providerRef.current,
        ydoc: ydocRef.current,
    };
};