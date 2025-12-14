import React from 'react';
import { Link } from '@inertiajs/react';
import { useAuth } from '../contexts/AuthContext';

export default function Header({ isLoggedIn, showCart = true, showOrders = true, showProfile = true }) {
    const { isAuthenticated } = useAuth();
    const loggedIn = isAuthenticated || isLoggedIn;
    return (
        <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/5 border-b border-white/10">
            <nav className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
                <Link href="/" className="text-2xl font-bold flex items-center gap-2 text-white hover:text-emerald-300 transition duration-200">
                    <span className="text-3xl">🌿</span>
                    Nature's World
                </Link>
                <div className="flex gap-8 items-center">
                    <Link href="/shop" className="text-emerald-100 hover:text-emerald-300 transition font-medium duration-200">Shop</Link>
                    {loggedIn ? (
                        <>
                            {showCart && <Link href="/cart" className="text-emerald-100 hover:text-emerald-300 transition font-medium duration-200">🛒 Cart</Link>}
                            {showOrders && <Link href="/orders" className="text-emerald-100 hover:text-emerald-300 transition font-medium duration-200">📦 Orders</Link>}
                            {showProfile && <Link href="/profile" className="text-emerald-100 hover:text-emerald-300 transition font-medium duration-200">👤 Profile</Link>}
                        </>
                    ) : (
                        <>
                            <Link href="/login" className="text-emerald-100 hover:text-emerald-300 transition font-medium duration-200">Login</Link>
                            <Link href="/register" className="bg-gradient-to-r from-emerald-400 to-teal-400 text-emerald-900 px-5 py-2 rounded-full font-bold hover:shadow-lg hover:shadow-emerald-400/50 transition duration-200">Register</Link>
                        </>
                    )}
                </div>
            </nav>
        </header>
    );
}
