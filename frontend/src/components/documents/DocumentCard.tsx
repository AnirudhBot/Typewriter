import React from 'react';
import { formatDate } from '../../utils/helpers';

const DocumentCard = ({ document, onClick }: { document: any, onClick: () => void }) => {
    return (
        <div
            onClick={onClick}
            className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer"
        >
            <h3 className="text-xl font-semibold mb-2">{document.title}</h3>
            <p className="text-gray-600 text-sm">
                Last edited: {formatDate(document.updatedAt)}
            </p>
            <div className="mt-4 flex items-center text-sm text-gray-500">
                <span>Owner: {document.createdBy.email}</span>
            </div>
        </div>
    );
};

export default DocumentCard;