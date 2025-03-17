import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const Navigation = () => {
    const { isAuthenticated, logout } = useAuth();
    return isAuthenticated && <div className="fixed z-100 top-0 right-0 w-full bg-gray-200 p-4">
        <div className="container flex justify-between items-center mx-auto px-4">
            <Link to="/" className="text-2xl font-bold">Typewriter</Link>
            <button onClick={logout} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded cursor-pointer">Logout</button>
        </div>
    </div>;
};

export default Navigation;