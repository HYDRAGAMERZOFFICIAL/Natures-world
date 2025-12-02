import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function GuestLayout() {
    const { token } = useAuth();

    if (token) {
        return <Navigate to="/" />;
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <Outlet />
            </div>
        </div>
    );
}
