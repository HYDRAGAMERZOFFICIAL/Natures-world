import { Navigate, Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

export default function DefaultLayout() {
    const { token } = useAuth();

    if (!token) {
        return <Navigate to="/login" />;
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />
            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <Outlet />
            </main>
        </div>
    );
}
