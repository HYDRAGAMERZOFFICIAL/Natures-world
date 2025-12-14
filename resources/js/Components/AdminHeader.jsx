import React from 'react';
import { Link } from '@inertiajs/react';
import { useAuth } from '../contexts/AuthContext';

export default function AdminHeader() {
    const { logout } = useAuth();

    const handleLogout = async () => {
        const token = localStorage.getItem('token');
        try {
            await fetch('/api/logout', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
            });
        } catch (error) {
            console.error('Logout error:', error);
        }
        logout();
        window.location.href = '/';
    };

    return (
        <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/5 border-b border-white/10">
            <nav className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                <Link href="/admin" className="text-2xl font-bold flex items-center gap-2 text-white hover:text-emerald-300 transition">
                    <span className="text-3xl">⚙️</span>
                    Admin Panel
                </Link>
                
                <div className="flex gap-6 items-center">
                    <div className="flex gap-4 items-center">
                        <Link href="/admin" className="text-emerald-100 hover:text-emerald-300 transition font-medium">Dashboard</Link>
                        <Link href="/admin/products" className="text-emerald-100 hover:text-emerald-300 transition font-medium">Products</Link>
                        <Link href="/admin/categories" className="text-emerald-100 hover:text-emerald-300 transition font-medium">Categories</Link>
                        <Link href="/admin/orders" className="text-emerald-100 hover:text-emerald-300 transition font-medium">Orders</Link>
                        <Link href="/admin/inventory" className="text-emerald-100 hover:text-emerald-300 transition font-medium">Inventory</Link>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="bg-red-500/20 hover:bg-red-500/30 text-red-300 px-4 py-2 rounded-lg font-semibold transition border border-red-400/50"
                    >
                        Logout
                    </button>
                </div>
            </nav>
        </header>
    );
}
