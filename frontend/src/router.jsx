import { createBrowserRouter } from 'react-router-dom';
import DefaultLayout from './components/DefaultLayout';
import GuestLayout from './components/GuestLayout';
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
                element: <ProductList />,
            },
            {
                path: '/products',
                element: <ProductList />,
            },
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
