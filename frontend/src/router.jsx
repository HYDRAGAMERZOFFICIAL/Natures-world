import { createBrowserRouter, Navigate } from 'react-router-dom';
import DefaultLayout from './layouts/DefaultLayout';
import GuestLayout from './layouts/GuestLayout';
import Login from './pages/Login';
import ProductList from './pages/ProductList';
import Register from './pages/Register';

const router = createBrowserRouter([
    {
        path: '/',
        element: <DefaultLayout />,
        children: [
            {
                path: '/',
                element: <Navigate to="/products" />,
            },
            {
                path: '/products',
                element: <ProductList />,
            },
            // Add more protected or public routes here
        ],
    },
    {
        path: '/',
        element: <GuestLayout />,
        children: [
            {
                path: '/login',
                element: <Login />,
            },
            {
                path: '/register',
                element: <Register />,
            },
        ],
    },
    {
        path: '*',
        element: <div>404 - Not Found</div>,
    },
]);

export default router;
