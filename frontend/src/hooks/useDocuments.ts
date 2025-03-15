import { useState, useEffect } from 'react';
import api from '../services/api';

export const useDocuments = () => {
    const [documents, setDocuments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDocuments = async () => {
            try {
                const response = await api.get('/documents');
                setDocuments(response.data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchDocuments();
    }, []);

    const createDocument = async () => {
        try {
            const response = await api.post('/documents', {
                title: 'Untitled Document',
                content: ''
            });
            setDocuments([...documents, response.data]);
            return response.data;
        } catch (err: any) {
            setError(err.message);
            return null;
        }
    };

    return { documents, loading, error, createDocument };
};
