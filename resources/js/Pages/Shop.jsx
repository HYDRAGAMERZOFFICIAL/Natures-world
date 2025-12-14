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
        <div className="min-h-screen relative overflow-hidden" style={{backgroundImage: 'url(/BG/Dashboard.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed'}}>
            <div className="absolute inset-0 bg-gradient-to-b from-emerald-900/40 via-teal-900/35 to-green-900/50"></div>
            
            <div className="relative z-10">
                <Header isLoggedIn={isLoggedIn} />

                <div className="max-w-7xl mx-auto px-4 py-8">
                    <div className="mb-12">
                        <h1 className="text-5xl font-bold bg-gradient-to-r from-emerald-300 to-teal-300 bg-clip-text text-transparent mb-2">🛍️ Shop Our Products</h1>
                        <p className="text-emerald-100 text-lg font-semibold">Discover <span className="text-emerald-300">amazing eco-friendly</span> products for every need</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                        <aside className="backdrop-blur-lg bg-white/10 border border-white/30 p-6 rounded-xl shadow-lg h-fit sticky top-20">
                            <h3 className="text-2xl font-bold mb-6 text-white">🔍 Filters</h3>
                        
                            <div className="mb-6">
                                <h4 className="font-semibold text-emerald-200 mb-3">Categories</h4>
                                <button
                                    onClick={() => setSelectedCategory(null)}
                                    className={`block w-full text-left px-4 py-3 rounded-lg mb-2 transition-all font-medium ${
                                        selectedCategory === null
                                            ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md'
                                            : 'bg-white/10 border border-white/20 text-emerald-200 hover:bg-white/15'
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
                                                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md'
                                                : 'bg-white/10 border border-white/20 text-emerald-200 hover:bg-white/15'
                                        }`}
                                    >
                                        <span className="mr-2">🌿</span>{category.name}
                                    </button>
                                ))}
                            </div>

                            <div className="pt-6 border-t border-white/20">
                                <p className="text-sm text-emerald-200">
                                    Showing <span className="font-bold text-emerald-300">{filteredProducts.length}</span> of <span className="font-bold text-emerald-300">{products.length}</span> products
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
        </div>
    );
}
