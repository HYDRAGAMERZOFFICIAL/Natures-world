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
        <div className="min-h-screen relative overflow-hidden" style={{backgroundImage: 'url(/BG/Dashboard.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed'}}>
            <div className="absolute inset-0 bg-gradient-to-b from-emerald-900/40 via-teal-900/35 to-green-900/50"></div>

            <style>{`
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                @keyframes fadeInDown {
                    from {
                        opacity: 0;
                        transform: translateY(-30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                @keyframes scaleIn {
                    from {
                        opacity: 0;
                        transform: scale(0.95);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1);
                    }
                }
                [data-animate] {
                    animation-fill-mode: both;
                    animation-duration: 0.8s;
                    animation-timing-function: ease-out;
                }
                [data-animate="fade-up"] {
                    animation-name: fadeInUp;
                }
                [data-animate="scale-in"] {
                    animation-name: scaleIn;
                }
            `}</style>

            <Header isLoggedIn={isLoggedIn} showCart={false} showOrders={false} showProfile={false} />

            <section className="relative z-10 py-32 px-4">
                <div className="max-w-6xl mx-auto">
                    <div data-animate="scale-in" className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-12 md:p-20 hover:bg-white/10 transition-all duration-300">
                        <div className="text-center">
                            <h2 className="text-5xl md:text-7xl font-bold mb-6 text-emerald-50 leading-tight"><span className="bg-gradient-to-r from-emerald-300 to-teal-300 bg-clip-text text-transparent">Welcome to Nature's World</span></h2>
                            <p className="text-lg md:text-2xl mb-10 text-emerald-100 max-w-2xl mx-auto leading-relaxed">Discover <span className="text-emerald-300 font-semibold">premium eco-friendly</span> products that bring nature closer to you. <span className="text-teal-300 font-semibold">Sustainable, organic, and beautiful.</span></p>
                            <Link href="/shop" className="inline-block bg-gradient-to-r from-emerald-400 to-teal-400 text-emerald-900 px-12 py-4 rounded-full font-bold hover:shadow-2xl hover:shadow-emerald-400/50 shadow-lg transition-all duration-200 transform hover:scale-105">
                                Start Shopping →
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            <section className="relative z-10 py-20 px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                        <h3 data-animate="fade-up" className="text-4xl md:text-5xl font-bold text-white mb-3"><span className="bg-gradient-to-r from-emerald-300 to-teal-300 bg-clip-text text-transparent">Explore Categories</span></h3>
                        <p data-animate="fade-up" className="text-emerald-100 text-lg" style={{animationDelay: '0.1s'}}>Find the perfect products for your needs</p>
                    </div>
                    {loading ? (
                        <LoadingSpinner />
                    ) : categories.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {categories.slice(0, 3).map((category, idx) => (
                                <div key={category.id} data-animate="fade-up" style={{animationDelay: `${idx * 0.1}s`}}>
                                    <CategoryCard category={category} />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <EmptyState icon="📂" title="No Categories" description="Check back soon for product categories" actionText={false} />
                    )}
                </div>
            </section>

            <section className="relative z-10 py-20 px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                        <h3 data-animate="fade-up" className="text-4xl md:text-5xl font-bold text-white mb-3"><span className="bg-gradient-to-r from-emerald-300 to-teal-300 bg-clip-text text-transparent">Featured Products</span></h3>
                        <p data-animate="fade-up" className="text-emerald-100 text-lg" style={{animationDelay: '0.1s'}}>Handpicked selections just for you</p>
                    </div>
                    {loading ? (
                        <LoadingSpinner />
                    ) : featuredProducts.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {featuredProducts.map((product, idx) => (
                                <div key={product.id} data-animate="fade-up" style={{animationDelay: `${idx * 0.1}s`}}>
                                    <ProductCard product={product} />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <EmptyState icon="📦" title="No Products" description="Featured products coming soon" actionHref="/shop" actionText="Browse All Products" />
                    )}
                </div>
            </section>

            <section className="relative z-10 py-24 px-4">
                <div className="max-w-6xl mx-auto">
                    <h3 data-animate="fade-up" className="text-4xl md:text-5xl font-bold mb-16 text-center text-white"><span className="bg-gradient-to-r from-emerald-300 to-teal-300 bg-clip-text text-transparent">Why Choose Us?</span></h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div data-animate="fade-up" className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8 hover:bg-white/15 transition-all duration-300 transform hover:scale-105" style={{animationDelay: '0s'}}>
                            <div className="text-5xl mb-4">🌍</div>
                            <h4 className="font-bold mb-3 text-lg text-emerald-300">100% Eco-Friendly</h4>
                            <p className="text-emerald-100 text-sm leading-relaxed">All products are sustainably sourced and environmentally conscious</p>
                        </div>
                        <div data-animate="fade-up" className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8 hover:bg-white/15 transition-all duration-300 transform hover:scale-105" style={{animationDelay: '0.1s'}}>
                            <div className="text-5xl mb-4">🚚</div>
                            <h4 className="font-bold mb-3 text-lg text-emerald-300">Fast Shipping</h4>
                            <p className="text-emerald-100 text-sm leading-relaxed">Quick, reliable delivery to your doorstep worldwide</p>
                        </div>
                        <div data-animate="fade-up" className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8 hover:bg-white/15 transition-all duration-300 transform hover:scale-105" style={{animationDelay: '0.2s'}}>
                            <div className="text-5xl mb-4">⭐</div>
                            <h4 className="font-bold mb-3 text-lg text-emerald-300">Quality Guaranteed</h4>
                            <p className="text-emerald-100 text-sm leading-relaxed">Premium products with 100% satisfaction guarantee</p>
                        </div>
                        <div data-animate="fade-up" className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8 hover:bg-white/15 transition-all duration-300 transform hover:scale-105" style={{animationDelay: '0.3s'}}>
                            <div className="text-5xl mb-4">🛡️</div>
                            <h4 className="font-bold mb-3 text-lg text-emerald-300">Secure Payment</h4>
                            <p className="text-emerald-100 text-sm leading-relaxed">Safe and encrypted transactions for your peace of mind</p>
                        </div>
                    </div>
                </div>
            </section>

            <footer className="relative z-10 border-t border-white/10 py-16 px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
                        <div>
                            <h4 className="font-bold mb-4 text-white text-lg">🌿 Nature's World</h4>
                            <p className="text-emerald-200/60 text-sm leading-relaxed">Your trusted source for eco-friendly and natural products</p>
                        </div>
                        <div>
                            <h4 className="font-bold mb-4 text-white">Quick Links</h4>
                            <ul className="text-emerald-200/60 text-sm space-y-2">
                                <li><Link href="/shop" className="hover:text-emerald-300 transition duration-200">Shop</Link></li>
                                <li><Link href="/about" className="hover:text-emerald-300 transition duration-200">About</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold mb-4 text-white">Support</h4>
                            <ul className="text-emerald-200/60 text-sm space-y-2">
                                <li><a href="#" className="hover:text-emerald-300 transition duration-200">Contact Us</a></li>
                                <li><a href="#" className="hover:text-emerald-300 transition duration-200">FAQ</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold mb-4 text-white">Follow Us</h4>
                            <div className="flex gap-4 text-sm">
                                <a href="#" className="text-emerald-200/60 hover:text-emerald-300 transition duration-200">Facebook</a>
                                <a href="#" className="text-emerald-200/60 hover:text-emerald-300 transition duration-200">Instagram</a>
                            </div>
                        </div>
                    </div>
                    <div className="border-t border-white/10 pt-8 text-center text-emerald-200/60 text-sm">
                        <p>&copy; 2025 Nature's World. All rights reserved. 🌿</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
