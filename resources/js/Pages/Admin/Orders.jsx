import React, { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import AdminHeader from '../../Components/AdminHeader';
import LoadingSpinner from '../../Components/LoadingSpinner';
import { useAuth } from '../../contexts/AuthContext';

export default function AdminOrders() {
    const { isAuthenticated, loading: authLoading } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [statusFilter, setStatusFilter] = useState('');
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            window.location.href = '/login';
            return;
        }
        if (!authLoading) {
            fetchOrders();
        }
    }, [authLoading, isAuthenticated, statusFilter, search, page]);

    const fetchOrders = async () => {
        try {
            const token = localStorage.getItem('token');
            const query = new URLSearchParams();
            if (statusFilter) query.append('status', statusFilter);
            if (search) query.append('search', search);
            query.append('page', page);

            const res = await fetch(`/api/admin/orders?${query}`, {
                headers: { 'Authorization': `Bearer ${token}` },
            });
            const data = await res.json();
            setOrders(data.data || []);
        } catch (err) {
            setError('Failed to load orders');
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch(status) {
            case 'completed': return 'bg-green-500/20 text-green-300';
            case 'pending': return 'bg-yellow-500/20 text-yellow-300';
            case 'processing': return 'bg-blue-500/20 text-blue-300';
            case 'cancelled': return 'bg-red-500/20 text-red-300';
            case 'shipped': return 'bg-purple-500/20 text-purple-300';
            default: return 'bg-gray-500/20 text-gray-300';
        }
    };

    if (authLoading || loading) {
        return <LoadingSpinner />;
    }

    return (
        <div className="min-h-screen relative overflow-hidden" style={{backgroundImage: 'url(/BG/Dashboard.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed'}}>
            <div className="absolute inset-0 bg-gradient-to-b from-emerald-900/40 via-teal-900/35 to-green-900/50"></div>
            
            <div className="relative z-10">
                <AdminHeader />

                <div className="max-w-7xl mx-auto px-4 py-8">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-300 to-teal-300 bg-clip-text text-transparent mb-8">📋 Order Management</h1>

                    {error && (
                        <div className="bg-red-500/20 border border-red-400/50 text-red-100 px-4 py-3 rounded-xl mb-6">
                            {error}
                        </div>
                    )}

                    <div className="backdrop-blur-lg bg-white/10 border border-white/30 rounded-xl shadow-lg p-6 mb-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                            <input
                                type="text"
                                placeholder="Search by customer name or email..."
                                value={search}
                                onChange={(e) => {
                                    setSearch(e.target.value);
                                    setPage(1);
                                }}
                                className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-emerald-200/50 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                            />
                            <select
                                value={statusFilter}
                                onChange={(e) => {
                                    setStatusFilter(e.target.value);
                                    setPage(1);
                                }}
                                className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
                            >
                                <option value="">All Statuses</option>
                                <option value="pending" className="bg-emerald-900">Pending</option>
                                <option value="processing" className="bg-emerald-900">Processing</option>
                                <option value="shipped" className="bg-emerald-900">Shipped</option>
                                <option value="completed" className="bg-emerald-900">Completed</option>
                                <option value="cancelled" className="bg-emerald-900">Cancelled</option>
                            </select>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-white/20">
                                        <th className="text-left py-3 px-4 text-emerald-300 font-semibold">Order ID</th>
                                        <th className="text-left py-3 px-4 text-emerald-300 font-semibold">Customer</th>
                                        <th className="text-left py-3 px-4 text-emerald-300 font-semibold">Amount</th>
                                        <th className="text-left py-3 px-4 text-emerald-300 font-semibold">Status</th>
                                        <th className="text-left py-3 px-4 text-emerald-300 font-semibold">Date</th>
                                        <th className="text-left py-3 px-4 text-emerald-300 font-semibold">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.map(order => (
                                        <tr key={order.id} className="border-b border-white/10 hover:bg-white/5 transition">
                                            <td className="py-3 px-4 text-emerald-200 font-semibold">#{String(order.id).padStart(8, '0')}</td>
                                            <td className="py-3 px-4 text-emerald-200">{order.user.name}</td>
                                            <td className="py-3 px-4 text-emerald-300 font-semibold">${order.total_amount}</td>
                                            <td className="py-3 px-4">
                                                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4 text-emerald-100 text-sm">{new Date(order.created_at).toLocaleDateString()}</td>
                                            <td className="py-3 px-4 flex gap-2">
                                                <Link
                                                    href={`/admin/orders/${order.id}/details`}
                                                    className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded hover:bg-blue-500/30 transition text-sm font-semibold"
                                                >
                                                    View
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {orders.length === 0 && (
                            <div className="text-center py-8 text-emerald-100/70">
                                No orders found
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
