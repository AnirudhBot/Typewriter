import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDocuments } from '../../hooks/useDocuments';
import DocumentCard from './DocumentCard';
import { Loading } from '../common/Loading'; 

const DocumentList = () => {
    const { documents, loading, error, createDocument } = useDocuments();
    const navigate = useNavigate();

    if (loading) return <Loading />;
    if (error) return <div className="text-red-500">{error}</div>;

    return (
        <div className="pt-24 pb-10">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">My Documents</h1>
                <button
                    onClick={createDocument}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 cursor-pointer"
                >
                    New Document
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {documents.map((doc: any) => (
                    <DocumentCard
                        key={doc._id}
                        document={doc}
                        onClick={() => navigate(`/documents/${doc._id}`)}
                    />
                ))}
            </div>
        </div>
    );
};

export default DocumentList;