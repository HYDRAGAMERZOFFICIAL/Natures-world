import React, { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import Header from '../Components/Header';
import LoadingSpinner from '../Components/LoadingSpinner';
import ErrorAlert from '../Components/ErrorAlert';
import { useFetchCache } from '../hooks/useFetchCache';

export default function ProductDetail({ productId }) {
    const [quantity, setQuantity] = useState(1);
    const [addedToCart, setAddedToCart] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [error, setError] = useState(null);
    const { data: product, loading } = useFetchCache(`/api/products/${productId}`);

    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsLoggedIn(!!token);
    }, []);

    const handleAddToCart = () => {
        const token = localStorage.getItem('token');
        
        if (!token) {
            localStorage.setItem('returnUrl', window.location.pathname);
            window.location.href = '/login';
            return;
        }

        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        const existingItem = cart.find(item => item.product_id === parseInt(productId));

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.push({
                product_id: parseInt(productId),
                quantity: quantity,
                price: product.price,
                name: product.name,
            });
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        setAddedToCart(true);
        setTimeout(() => setAddedToCart(false), 3000);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header isLoggedIn={isLoggedIn} showProfile={false} />
                <LoadingSpinner />
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header isLoggedIn={isLoggedIn} showProfile={false} />
                <div className="max-w-6xl mx-auto px-4 py-16">
                    <ErrorAlert message="Product not found" />
                    <Link href="/shop" className="text-emerald-600 font-bold hover:text-emerald-700">← Back to Shop</Link>
                </div>
            </div>
        );
    }

    const outOfStock = product.quantity === 0;

    return (
        <div className="min-h-screen bg-gray-50">
            <Header isLoggedIn={isLoggedIn} showProfile={false} />

            <div className="max-w-6xl mx-auto px-4 py-8">
                <Link href="/shop" className="text-emerald-600 font-bold hover:text-emerald-700 mb-8 inline-block">← Back to Shop</Link>

                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
                        <div className="flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl p-4 h-96">
                            {product.image ? (
                                <img 
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-full object-contain rounded-lg"
                                />
                            ) : (
                                <div className="text-9xl text-gray-300">🌿</div>
                            )}
                        </div>

                        <div className="flex flex-col justify-between">
                            <div>
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <h1 className="text-4xl font-bold text-gray-800 mb-2">{product.name}</h1>
                                        {product.category && (
                                            <p className="text-emerald-600 font-semibold text-lg">📁 {product.category.name}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-6 mb-6">
                                    <p className="text-gray-600 mb-4 leading-relaxed text-lg">{product.description}</p>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm text-gray-600">Stock Available</p>
                                            <p className={`text-2xl font-bold ${outOfStock ? 'text-red-600' : 'text-emerald-600'}`}>
                                                {outOfStock ? 'Out of Stock' : `${product.quantity} units`}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Price per Unit</p>
                                            <p className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">${product.price}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {error && <ErrorAlert message={error} onDismiss={() => setError(null)} />}
                                
                                {addedToCart && (
                                    <div className="bg-emerald-50 border-l-4 border-emerald-500 p-4 rounded-r-lg">
                                        <p className="text-emerald-800 font-bold">✓ Added to cart successfully!</p>
                                    </div>
                                )}

                                {!outOfStock && (
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center border-2 border-gray-200 rounded-lg">
                                            <button
                                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                                className="px-4 py-2 text-gray-600 hover:text-emerald-600 font-bold"
                                            >
                                                −
                                            </button>
                                            <input
                                                type="number"
                                                min="1"
                                                max={product.quantity}
                                                value={quantity}
                                                onChange={(e) => setQuantity(Math.min(product.quantity, Math.max(1, parseInt(e.target.value) || 1)))}
                                                className="w-16 text-center font-bold border-0"
                                            />
                                            <button
                                                onClick={() => setQuantity(Math.min(product.quantity, quantity + 1))}
                                                className="px-4 py-2 text-gray-600 hover:text-emerald-600 font-bold"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                )}

                                <button
                                    onClick={handleAddToCart}
                                    disabled={outOfStock}
                                    className={`w-full py-4 rounded-lg font-bold text-lg transition-all transform hover:scale-105 ${
                                        outOfStock
                                            ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                                            : 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:shadow-lg'
                                    }`}
                                >
                                    {outOfStock ? '❌ Out of Stock' : `🛒 Add ${quantity} to Cart`}
                                </button>

                                <Link 
                                    href="/cart"
                                    className="block text-center py-3 border-2 border-emerald-600 text-emerald-600 rounded-lg font-bold hover:bg-emerald-50 transition"
                                >
                                    View Cart
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
