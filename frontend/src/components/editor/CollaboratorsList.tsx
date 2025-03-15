import React from 'react';
import { CollaboratorsListProps } from '../../interfaces/interface';

const CollaboratorsList: React.FC<CollaboratorsListProps> = ({ collaborators }) => {
    return (
        <div className="flex items-center space-x-2">
            {collaborators.map((collaborator) => (
                <div
                    key={collaborator.id}
                    className="flex items-center relative group"
                >
                    <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white border-1 border-black cursor-pointer"
                        style={{ backgroundColor: collaborator.color || '#6B7280' }}
                    >
                        {collaborator.email.charAt(0).toUpperCase()}
                    </div>
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                        {collaborator.email}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default CollaboratorsList;
