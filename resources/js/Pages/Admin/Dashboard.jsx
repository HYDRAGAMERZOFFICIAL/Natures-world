import React, { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import { useAuth } from '../../contexts/AuthContext';
import AdminHeader from '../../Components/AdminHeader';
import LoadingSpinner from '../../Components/LoadingSpinner';

export default function AdminDashboard() {
    const { isAuthenticated, loading: authLoading } = useAuth();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            window.location.href = '/login';
            return;
        }

        if (!authLoading) {
            fetchDashboard();
        }
    }, [authLoading, isAuthenticated]);

    const fetchDashboard = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/admin/dashboard', {
                headers: { 'Authorization': `Bearer ${token}` },
            });
            const data = await res.json();
            setStats(data);
        } catch (err) {
            setError('Failed to load dashboard');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (authLoading || loading) {
        return <LoadingSpinner />;
    }

    const dashStats = stats?.stats || {};
    const recentOrders = stats?.recent_orders || [];
    const recentProducts = stats?.recent_products || [];

    return (
        <div className="min-h-screen relative overflow-hidden" style={{backgroundImage: 'url(/BG/Dashboard.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed'}}>
            <div className="absolute inset-0 bg-gradient-to-b from-emerald-900/40 via-teal-900/35 to-green-900/50"></div>
            
            <div className="relative z-10">
                <AdminHeader />

                <div className="max-w-7xl mx-auto px-4 py-8">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-300 to-teal-300 bg-clip-text text-transparent mb-2">📊 Admin Dashboard</h1>
                    <p className="text-emerald-100 text-lg mb-8">Welcome back, manage your e-commerce store</p>

                    {error && (
                        <div className="bg-red-500/20 border border-red-400/50 text-red-100 px-4 py-3 rounded-xl mb-6">
                            {error}
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        <DashCard icon="📦" title="Total Products" value={dashStats.total_products} color="from-blue-400 to-blue-600" />
                        <DashCard icon="🏷️" title="Total Categories" value={dashStats.total_categories} color="from-purple-400 to-purple-600" />
                        <DashCard icon="📋" title="Total Orders" value={dashStats.total_orders} color="from-orange-400 to-orange-600" />
                        <DashCard icon="👥" title="Total Users" value={dashStats.total_users} color="from-pink-400 to-pink-600" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
                        <StatCard icon="💰" label="Total Revenue" value={`$${(dashStats.total_revenue || 0).toFixed(2)}`} bgColor="bg-emerald-500/20" />
                        <StatCard icon="⏳" label="Pending Orders" value={dashStats.pending_orders || 0} bgColor="bg-yellow-500/20" />
                        <StatCard icon="⚙️" label="Processing" value={dashStats.processing_orders || 0} bgColor="bg-blue-500/20" />
                        <StatCard icon="✅" label="Completed" value={dashStats.completed_orders || 0} bgColor="bg-green-500/20" />
                        <StatCard icon="⚠️" label="Low Stock" value={dashStats.low_stock_products || 0} bgColor="bg-red-500/20" />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="backdrop-blur-lg bg-white/10 border border-white/30 rounded-xl shadow-lg p-6">
                            <h3 className="text-2xl font-bold text-white mb-4">📦 Recent Orders</h3>
                            <div className="space-y-2">
                                {recentOrders.length === 0 ? (
                                    <p className="text-emerald-100/70">No recent orders</p>
                                ) : (
                                    recentOrders.map(order => (
                                        <Link
                                            href={`/admin/orders/${order.id}/details`}
                                            key={order.id}
                                            className="flex items-center justify-between p-3 hover:bg-white/10 rounded-lg transition border border-white/10"
                                        >
                                            <div>
                                                <p className="text-emerald-200 font-semibold">{order.user.name}</p>
                                                <p className="text-emerald-100/60 text-sm">Order #{order.id}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-emerald-300 font-semibold">${order.total_amount}</p>
                                                <p className={`text-sm font-semibold ${getStatusColor(order.status)}`}>{order.status}</p>
                                            </div>
                                        </Link>
                                    ))
                                )}
                            </div>
                            <Link href="/admin/orders" className="inline-block mt-4 text-emerald-300 hover:text-emerald-200 font-semibold">
                                View All Orders →
                            </Link>
                        </div>

                        <div className="backdrop-blur-lg bg-white/10 border border-white/30 rounded-xl shadow-lg p-6">
                            <h3 className="text-2xl font-bold text-white mb-4">🆕 Recent Products</h3>
                            <div className="space-y-2">
                                {recentProducts.length === 0 ? (
                                    <p className="text-emerald-100/70">No recent products</p>
                                ) : (
                                    recentProducts.map(product => (
                                        <div key={product.id} className="flex items-center justify-between p-3 hover:bg-white/10 rounded-lg transition border border-white/10">
                                            <div>
                                                <p className="text-emerald-200 font-semibold">{product.name}</p>
                                                <p className="text-emerald-100/60 text-sm">{product.category?.name || 'Uncategorized'}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-emerald-300 font-semibold">${product.price}</p>
                                                <p className="text-emerald-100/60 text-sm">Stock: {product.quantity}</p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                            <Link href="/admin/products" className="inline-block mt-4 text-emerald-300 hover:text-emerald-200 font-semibold">
                                Manage Products →
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function DashCard({ icon, title, value, color }) {
    return (
        <div className={`backdrop-blur-lg bg-gradient-to-br ${color} bg-opacity-20 border border-white/30 rounded-xl shadow-lg p-6`}>
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-emerald-100 text-sm font-semibold">{title}</p>
                    <p className="text-white text-3xl font-bold mt-2">{value || 0}</p>
                </div>
                <p className="text-4xl">{icon}</p>
            </div>
        </div>
    );
}

function StatCard({ icon, label, value, bgColor }) {
    return (
        <div className={`backdrop-blur-lg ${bgColor} border border-white/30 rounded-xl shadow-lg p-4`}>
            <div className="flex items-center gap-3">
                <p className="text-2xl">{icon}</p>
                <div>
                    <p className="text-emerald-100 text-xs font-semibold">{label}</p>
                    <p className="text-white text-xl font-bold">{value}</p>
                </div>
            </div>
        </div>
    );
}

function getStatusColor(status) {
    switch(status) {
        case 'completed': return 'text-green-400';
        case 'pending': return 'text-yellow-400';
        case 'processing': return 'text-blue-400';
        case 'cancelled': return 'text-red-400';
        case 'shipped': return 'text-purple-400';
        default: return 'text-gray-400';
    }
}
