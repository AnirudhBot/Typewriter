import { useAuth } from '../hooks/useAuth';
import { Link } from 'react-router-dom';

const LandingPage = () => {
    const { isAuthenticated } = useAuth();

    return (
        <div className="min-h-screen flex items-center">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className={`text-center`}>
                    <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
                        Welcome to Typewriter
                    </h1>
                    <p className="mt-4 text-xl text-gray-600">
                        A powerful collaborative document editing platform for your team
                    </p>

                    <div className="mt-8">
                        {isAuthenticated ? (
                            <Link
                                to="/documents"
                                className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700"
                            >
                                Go to My Documents
                            </Link>
                        ) : (
                            <div className="space-x-4">
                                <Link
                                    to="/login"
                                    className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700"
                                >
                                    Log In
                                </Link>
                                <Link
                                    to="/register"
                                    className="inline-block bg-gray-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-700"
                                >
                                    Register
                                </Link>
                            </div>
                        )}
                    </div>

                    <div className="mt-16 grid grid-cols-1 gap-10 sm:grid-cols-3">
                        <div className="p-6 bg-white rounded-lg shadow">
                            <h3 className="text-lg font-medium text-gray-900">Real-time Collaboration</h3>
                            <p className="mt-2 text-gray-600">Work together with your team in real-time</p>
                        </div>
                        <div className="p-6 bg-white rounded-lg shadow">
                            <h3 className="text-lg font-medium text-gray-900">Rich Text Editing</h3>
                            <p className="mt-2 text-gray-600">Format your documents with powerful tools</p>
                        </div>
                        <div className="p-6 bg-white rounded-lg shadow">
                            <h3 className="text-lg font-medium text-gray-900">Secure Storage</h3>
                            <p className="mt-2 text-gray-600">Your documents are safe and encrypted</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;