import { useEffect, useState } from 'react';
import axiosClient from '../api/axios';

export default function ProductList() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getProducts();
    }, []);

    const getProducts = () => {
        setLoading(true);
        axiosClient.get('/products')
            .then(({ data }) => {
                setProducts(data.data);
                setLoading(false);
            })
            .catch(() => {
                setLoading(false);
            });
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Products</h1>
            </div>

            {loading && <div className="text-center">Loading...</div>}

            {!loading && (
                <div className="grid grid-cols-1 gap-y-10 sm:grid-cols-2 gap-x-6 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
                    {products.map((product) => (
                        <div key={product.id} className="group relative">
                            <div className="w-full aspect-w-1 aspect-h-1 bg-gray-200 rounded-lg overflow-hidden xl:aspect-w-7 xl:aspect-h-8">
                                <img
                                    src={product.image || 'https://via.placeholder.com/300'}
                                    alt={product.name}
                                    className="w-full h-full object-center object-cover group-hover:opacity-75"
                                />
                            </div>
                            <h3 className="mt-4 text-sm text-gray-700">
                                <a href="#">
                                    <span className="absolute inset-0" />
                                    {product.name}
                                </a>
                            </h3>
                            <p className="mt-1 text-lg font-medium text-gray-900">${product.price}</p>
                            <button className="mt-2 w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700">
                                Add to Cart
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
