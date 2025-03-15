import { useState, useEffect } from 'react';
import api from '../services/api';

export const useDocument = <T>(documentId: string) => {
    const [document, setDocument] = useState<T | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDocument = async () => {
            try {
                const response = await api.get(`/documents/${documentId}`);
                setDocument(response.data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchDocument();
    }, [documentId]);

    return { document, loading, error, setDocument };
};