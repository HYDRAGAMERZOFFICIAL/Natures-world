import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function GuestLayout() {
    const { token } = useAuth();

    if (token) {
        return <Navigate to="/" />;
    }

    return (
        <div id="guestLayout">
            <Outlet />
        </div>
    );
}
