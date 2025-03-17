import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDocument } from '../../hooks/useDocument';
import { useCollaboration } from '../../hooks/useCollaboration';
import { useAuth } from '../../hooks/useAuth';
import CollaboratorsList from './CollaboratorsList';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import api from '../../services/api';
import QuillCursors from 'quill-cursors';
import { Document, Collaborator } from '../../interfaces/interface';
import { useSpeechRecognition } from '../../hooks/useSpeechRecognition';
import MicrophoneButton from './MicrophoneButton';
import { Loading } from '../common/Loading';
// Register the cursors module
Quill.register('modules/cursors', QuillCursors);

const Editor = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const editorRef = useRef<HTMLDivElement>(null);
    const quillRef = useRef<Quill | null>(null);
    const { document, loading, error, setDocument } = useDocument<Document>(id || '');
    const [showShareDialog, setShowShareDialog] = useState(false);
    const [selectedRole, setSelectedRole] = useState<'editor' | 'viewer'>('editor');
    const [email, setEmail] = useState('');
    const [shareError, setShareError] = useState('');
    const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [editedTitle, setEditedTitle] = useState('');
    const [userPermission, setUserPermission] = useState<any | undefined>(undefined);
    const { isListening, toggleSpeechRecognition } = useSpeechRecognition({ quillRef });
    const isOwner = document?.createdBy.userId === user?.id;

    useEffect(() => {
        setUserPermission(document?.permissions?.find(p => p.user === user?.id));
    }, [document, user]);

    useEffect(() => {
        if (loading || error || !document || !editorRef.current) {
            console.log('Editor initialization conditions not met:', {
                loading,
                error,
                hasDocument: !!document,
                hasEditorRef: !!editorRef.current
            });
            return;
        }

        // Add a small delay to ensure DOM is ready
        const initializeEditor = () => {
            if (!editorRef.current) {
                console.log('Editor ref lost during initialization');
                return;
            }

            const quill = new Quill(editorRef.current, {
                theme: 'snow',
                modules: {
                    cursors: true,
                    toolbar: [
                        [{ 'header': [false, 1, 2, 3, false] }],
                        ['bold', 'italic', 'underline', 'blockquote'],
                        [{ 'font': [] }, { 'size': ['small', false, 'large', 'huge'] }],
                        [{ 'color': [] }, { 'background': [] }],
                        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                        [{ 'align': [] }],
                        ['link', 'image']
                    ],
                    clipboard: {
                        matchVisual: false
                    }
                },
                readOnly: userPermission?.role === 'viewer'
            });

            // Custom link handler
            const toolbar = quill.getModule('toolbar') as any;
            toolbar.addHandler('link', function (value: boolean) {
                if (value) {
                    const range = quill.getSelection();
                    if (range) {
                        let url = prompt('Enter link URL:');
                        if (url) {
                            // Ensure URL is absolute
                            if (!/^https?:\/\//i.test(url)) {
                                url = 'https://' + url;
                            }
                            quill.format('link', url);
                        }
                    }
                } else {
                    quill.format('link', false);
                }
            });

            quillRef.current = quill;
        };

        // Small delay to ensure DOM is fully mounted
        const timeoutId = setTimeout(initializeEditor, 100);

        return () => {
            clearTimeout(timeoutId);
            quillRef.current = null;
        };
    }, [document, user]);

    const onContentChange = async (content: string) => {
        try {
            await api.put(`/documents/${id}/content`, { content });
        } catch (err) {
            console.error('Failed to save document:', err);
        }
    };

    useEffect(() => {
        if (!quillRef.current || !onContentChange) return;

        let saveTimeout: ReturnType<typeof setTimeout>;

        const handler = () => {
            const content = quillRef.current?.root.innerHTML || '';
            clearTimeout(saveTimeout);
            saveTimeout = setTimeout(() => {
                onContentChange(content);
            }, 1000); // saved after 1 second of inactivity
        };

        quillRef.current.on('text-change', handler);

        return () => {
            quillRef.current?.off('text-change', handler);
            clearTimeout(saveTimeout);
        };
    }, [onContentChange]);

    const handleShare = async () => {
        try {
            setShareError('');
            await api.post(`/documents/${id}/share`, {
                email,
                role: selectedRole
            });
            setEmail('');
            setShowShareDialog(false);
        } catch (err) {
            setShareError('Failed to share document. Please check the email address.');
            console.error('Failed to share document:', err);
        }
    };

    const handleTitleEdit = async () => {
        try {
            await api.put(`/documents/${id}/title`, { title: editedTitle });
            setIsEditingTitle(false);
            if (document) {
                setDocument({
                    ...document,
                    title: editedTitle
                });
            }
        } catch (err) {
            console.error('Failed to update title:', err);
        }
    };

    const collaboration = useCollaboration(id || '', quillRef.current);
    useEffect(() => {
        setCollaborators(collaboration.users);
    }, [collaboration.users]);

    if (error) return <div className="pt-20 text-red-500">{error}</div>;
    if (loading) return <Loading />;
    if (!userPermission) return <div className="pt-20 text-red-500">You don't have permission to access this document</div>;

    return (
        <div className="h-screen flex flex-col pt-20 pb-10">
            <div className="flex justify-between items-center py-4 border-b">
                <div className="flex items-center gap-2">
                    {isEditingTitle ? (
                        <>
                            <input
                                type="text"
                                value={editedTitle}
                                onChange={(e) => setEditedTitle(e.target.value)}
                                className="text-2xl font-bold border rounded px-2 py-1"
                                autoFocus
                            />
                            <button
                                onClick={handleTitleEdit}
                                className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                            >
                                Save
                            </button>
                        </>
                    ) : (
                        <h1
                            className="text-2xl font-bold cursor-pointer hover:bg-gray-100 px-2 py-1 rounded"
                            onClick={() => {
                                setIsEditingTitle(true);
                                setEditedTitle(document?.title || '');
                            }}
                        >
                            {document?.title}
                        </h1>
                    )}
                </div>
                <div className="flex items-center gap-4">
                    <MicrophoneButton
                        isListening={isListening}
                        onClick={toggleSpeechRecognition}
                    />
                    {isOwner && (
                        <button
                            onClick={() => {
                                setShowShareDialog(true);
                            }}
                            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 cursor-pointer"
                        >
                            Share
                        </button>
                    )}
                    <CollaboratorsList collaborators={collaborators} />
                </div>
            </div>
            <div className="flex-grow overflow-auto">
                <div ref={editorRef} />
            </div>

            {showShareDialog && (
                <div className="fixed z-999 inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg w-96">
                        <h2 className="text-xl font-bold mb-4">Share Document</h2>
                        <div className="mb-4">
                            <label className="block mb-2">Email:</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter recipient's email"
                                className="w-full p-2 border rounded"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block mb-2">Permission:</label>
                            <select
                                value={selectedRole}
                                onChange={(e) => setSelectedRole(e.target.value as 'editor' | 'viewer')}
                                className="w-full p-2 border rounded"
                            >
                                <option value="editor">Editor</option>
                                <option value="viewer">Viewer</option>
                            </select>
                        </div>
                        {shareError && (
                            <div className="mb-4 text-red-500 text-sm">
                                {shareError}
                            </div>
                        )}
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={handleShare}
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 cursor-pointer"
                            >
                                Share
                            </button>
                            <button
                                onClick={() => {
                                    setShowShareDialog(false);
                                    setEmail('');
                                    setShareError('');
                                }}
                                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 cursor-pointer"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Editor;