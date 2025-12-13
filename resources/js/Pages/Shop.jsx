import React, { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import Header from '../Components/Header';
import ProductCard from '../Components/ProductCard';
import LoadingSpinner from '../Components/LoadingSpinner';
import EmptyState from '../Components/EmptyState';
import { useFetchCache } from '../hooks/useFetchCache';

export default function Shop() {
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const { data: productsData, loading: productsLoading } = useFetchCache('/api/products');
    const { data: categoriesData, loading: categoriesLoading } = useFetchCache('/api/categories');

    const products = productsData?.data || [];
    const categories = categoriesData || [];
    const loading = productsLoading || categoriesLoading;

    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsLoggedIn(!!token);
    }, []);

    const filteredProducts = selectedCategory
        ? products.filter(p => p.category_id === selectedCategory)
        : products;

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            <Header isLoggedIn={isLoggedIn} />

            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="mb-12">
                    <h1 className="text-5xl font-bold text-gray-800 mb-2">Shop Our Products</h1>
                    <p className="text-gray-600 text-lg">Discover amazing eco-friendly products for every need</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    <aside className="bg-white p-6 rounded-xl shadow-md border border-gray-200 h-fit sticky top-20">
                        <h3 className="text-2xl font-bold mb-6 text-gray-800">Filters</h3>
                        
                        <div className="mb-6">
                            <h4 className="font-semibold text-gray-700 mb-3">Categories</h4>
                            <button
                                onClick={() => setSelectedCategory(null)}
                                className={`block w-full text-left px-4 py-3 rounded-lg mb-2 transition-all font-medium ${
                                    selectedCategory === null
                                        ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                🎯 All Products ({products.length})
                            </button>
                            {categories.map(category => (
                                <button
                                    key={category.id}
                                    onClick={() => setSelectedCategory(category.id)}
                                    className={`block w-full text-left px-4 py-3 rounded-lg mb-2 transition-all font-medium ${
                                        selectedCategory === category.id
                                            ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                >
                                    <span className="mr-2">🌿</span>{category.name}
                                </button>
                            ))}
                        </div>

                        <div className="pt-6 border-t border-gray-200">
                            <p className="text-sm text-gray-500">
                                Showing {filteredProducts.length} of {products.length} products
                            </p>
                        </div>
                    </aside>

                    <main className="lg:col-span-3">
                        {loading ? (
                            <LoadingSpinner />
                        ) : filteredProducts.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredProducts.map(product => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        ) : (
                            <EmptyState 
                                icon="🔍"
                                title="No Products Found"
                                description={`No products available in the "${categories.find(c => c.id === selectedCategory)?.name}" category`}
                                actionHref="/shop"
                                actionText="View All Products"
                            />
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
}
