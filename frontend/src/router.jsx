
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
