import React, { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import Header from '../Components/Header';
import ProductCard from '../Components/ProductCard';
import CategoryCard from '../Components/CategoryCard';
import LoadingSpinner from '../Components/LoadingSpinner';
import EmptyState from '../Components/EmptyState';
import { useFetchCache } from '../hooks/useFetchCache';

export default function Landing() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const { data: productsData, loading: productsLoading } = useFetchCache('/api/products?per_page=6');
    const { data: categoriesData, loading: categoriesLoading } = useFetchCache('/api/categories');

    const featuredProducts = productsData?.data || [];
    const categories = categoriesData || [];
    const loading = productsLoading || categoriesLoading;

    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsLoggedIn(!!token);
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-teal-50">
            <Header isLoggedIn={isLoggedIn} showCart={false} showOrders={false} showProfile={false} />

            <section className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white py-24 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="text-9xl absolute -top-10 -left-10">🌿</div>
                    <div className="text-9xl absolute -bottom-10 -right-10">🌱</div>
                </div>
                <div className="max-w-6xl mx-auto px-4 text-center relative z-10">
                    <h2 className="text-6xl font-bold mb-4 leading-tight">Welcome to Nature's World</h2>
                    <p className="text-xl mb-8 text-emerald-50 max-w-2xl mx-auto">Discover premium eco-friendly products that bring nature closer to you. Sustainable, organic, and beautiful.</p>
                    <Link href="/shop" className="inline-block bg-white text-emerald-600 px-10 py-4 rounded-full font-bold hover:bg-emerald-50 shadow-lg hover:shadow-2xl transition-all transform hover:scale-105">
                        Start Shopping →
                    </Link>
                </div>
            </section>

            <section className="max-w-6xl mx-auto px-4 py-16">
                <div className="text-center mb-12">
                    <h3 className="text-4xl font-bold text-gray-800 mb-2">Explore Categories</h3>
                    <p className="text-gray-600">Find the perfect products for your needs</p>
                </div>
                {loading ? (
                    <LoadingSpinner />
                ) : categories.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {categories.slice(0, 3).map((category) => (
                            <CategoryCard key={category.id} category={category} />
                        ))}
                    </div>
                ) : (
                    <EmptyState icon="📂" title="No Categories" description="Check back soon for product categories" actionText={false} />
                )}
            </section>

            <section className="bg-gradient-to-r from-gray-50 to-gray-100 py-16">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="text-center mb-12">
                        <h3 className="text-4xl font-bold text-gray-800 mb-2">Featured Products</h3>
                        <p className="text-gray-600">Handpicked selections just for you</p>
                    </div>
                    {loading ? (
                        <LoadingSpinner />
                    ) : featuredProducts.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {featuredProducts.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    ) : (
                        <EmptyState icon="📦" title="No Products" description="Featured products coming soon" actionHref="/shop" actionText="Browse All Products" />
                    )}
                </div>
            </section>

            <section className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white py-16">
                <div className="max-w-6xl mx-auto px-4">
                    <h3 className="text-3xl font-bold mb-12 text-center">Why Choose Us?</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-xl p-6 hover:bg-opacity-20 transition">
                            <div className="text-4xl mb-3">🌍</div>
                            <h4 className="font-bold mb-2 text-lg">100% Eco-Friendly</h4>
                            <p className="text-emerald-50 text-sm">All products are sustainably sourced and environmentally conscious</p>
                        </div>
                        <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-xl p-6 hover:bg-opacity-20 transition">
                            <div className="text-4xl mb-3">🚚</div>
                            <h4 className="font-bold mb-2 text-lg">Fast Shipping</h4>
                            <p className="text-emerald-50 text-sm">Quick, reliable delivery to your doorstep worldwide</p>
                        </div>
                        <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-xl p-6 hover:bg-opacity-20 transition">
                            <div className="text-4xl mb-3">⭐</div>
                            <h4 className="font-bold mb-2 text-lg">Quality Guaranteed</h4>
                            <p className="text-emerald-50 text-sm">Premium products with 100% satisfaction guarantee</p>
                        </div>
                        <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-xl p-6 hover:bg-opacity-20 transition">
                            <div className="text-4xl mb-3">🛡️</div>
                            <h4 className="font-bold mb-2 text-lg">Secure Payment</h4>
                            <p className="text-emerald-50 text-sm">Safe and encrypted transactions for your peace of mind</p>
                        </div>
                    </div>
                </div>
            </section>

            <footer className="bg-gray-900 text-white py-12">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                        <div>
                            <h4 className="font-bold mb-4">Nature's World</h4>
                            <p className="text-gray-400 text-sm">Your trusted source for eco-friendly products</p>
                        </div>
                        <div>
                            <h4 className="font-bold mb-4">Quick Links</h4>
                            <ul className="text-gray-400 text-sm space-y-2">
                                <li><Link href="/shop" className="hover:text-emerald-400 transition">Shop</Link></li>
                                <li><Link href="/about" className="hover:text-emerald-400 transition">About</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold mb-4">Support</h4>
                            <ul className="text-gray-400 text-sm space-y-2">
                                <li><a href="#" className="hover:text-emerald-400 transition">Contact Us</a></li>
                                <li><a href="#" className="hover:text-emerald-400 transition">FAQ</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold mb-4">Follow Us</h4>
                            <div className="flex gap-4 text-sm">
                                <a href="#" className="hover:text-emerald-400 transition">Facebook</a>
                                <a href="#" className="hover:text-emerald-400 transition">Instagram</a>
                            </div>
                        </div>
                    </div>
                    <div className="border-t border-gray-800 pt-8 text-center text-gray-400 text-sm">
                        <p>&copy; 2025 Nature's World. All rights reserved. 🌿</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
