import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "./Navbar";

export default function DefaultLayout() {
    const { user, token } = useAuth();

    if (!token) {
        return <Navigate to="/login" />;
    }

    return (
        <div id="defaultLayout">
            <Navbar />
            <main>
                <Outlet />
            </main>
        </div>
    );
}
