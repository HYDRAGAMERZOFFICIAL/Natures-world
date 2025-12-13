import React from 'react';
import { Link } from '@inertiajs/react';

export default function Header({ isLoggedIn, showCart = true, showOrders = true, showProfile = true }) {
    return (
        <header className="sticky top-0 z-50 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white shadow-lg">
            <nav className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
                <Link href="/" className="text-2xl font-bold flex items-center gap-2 hover:opacity-90 transition">
                    <span className="text-3xl">🌿</span>
                    Nature's World
                </Link>
                <div className="flex gap-6 items-center">
                    <Link href="/shop" className="hover:text-emerald-100 transition font-medium">Shop</Link>
                    {isLoggedIn ? (
                        <>
                            {showCart && <Link href="/cart" className="hover:text-emerald-100 transition font-medium">🛒 Cart</Link>}
                            {showOrders && <Link href="/orders" className="hover:text-emerald-100 transition font-medium">📦 Orders</Link>}
                            {showProfile && <Link href="/profile" className="hover:text-emerald-100 transition font-medium">👤 Profile</Link>}
                        </>
                    ) : (
                        <>
                            <Link href="/login" className="hover:text-emerald-100 transition font-medium">Login</Link>
                            <Link href="/register" className="bg-white text-emerald-600 px-4 py-2 rounded-full font-bold hover:bg-emerald-50 transition">Register</Link>
                        </>
                    )}
                </div>
            </nav>
        </header>
    );
}
