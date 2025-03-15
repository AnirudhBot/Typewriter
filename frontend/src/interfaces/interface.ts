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