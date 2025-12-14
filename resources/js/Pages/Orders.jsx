import React, { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import Header from '../Components/Header';
import LoadingSpinner from '../Components/LoadingSpinner';
import EmptyState from '../Components/EmptyState';
import { useFetchCache } from '../hooks/useFetchCache';
import { useAuth } from '../contexts/AuthContext';

export default function Orders() {
    const { isAuthenticated, loading: authLoading } = useAuth();
    const { data: ordersData, loading } = useFetchCache('/api/orders');
    const orders = ordersData?.data || [];

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            localStorage.setItem('returnUrl', '/orders');
            window.location.href = '/login';
        }
    }, [isAuthenticated, authLoading]);

    const getStatusColor = (status) => {
        switch(status) {
            case 'completed': return { bg: 'bg-emerald-100', text: 'text-emerald-800', icon: '✓' };
            case 'pending': return { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: '⏳' };
            case 'processing': return { bg: 'bg-blue-100', text: 'text-blue-800', icon: '⚙️' };
            case 'cancelled': return { bg: 'bg-red-100', text: 'text-red-800', icon: '✕' };
            default: return { bg: 'bg-gray-100', text: 'text-gray-800', icon: '•' };
        }
    };

    return (
        <div className="min-h-screen relative overflow-hidden" style={{backgroundImage: 'url(/BG/Dashboard.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed'}}>
            <div className="absolute inset-0 bg-gradient-to-b from-emerald-900/40 via-teal-900/35 to-green-900/50"></div>
            
            <div className="relative z-10">
                <Header />

                <div className="max-w-6xl mx-auto px-4 py-8">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-300 to-teal-300 bg-clip-text text-transparent mb-2">📦 My Orders</h1>
                    <p className="text-emerald-100 text-lg font-semibold mb-8">Track and manage <span className="text-emerald-300">all your orders</span></p>

                    {loading ? (
                        <LoadingSpinner />
                    ) : orders.length === 0 ? (
                        <EmptyState 
                            icon="📦"
                            title="No Orders Yet"
                            description="You haven't placed any orders yet. Start shopping to create your first order!"
                            actionHref="/shop"
                            actionText="Start Shopping"
                        />
                    ) : (
                        <div className="space-y-6">
                            {orders.map(order => {
                                const statusInfo = getStatusColor(order.status);
                                return (
                                    <div key={order.id} className="backdrop-blur-lg bg-white/10 border border-white/30 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition">
                                        <div className="bg-gradient-to-r from-emerald-500/20 to-teal-500/20 p-6 border-b border-white/30">
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                <div>
                                                    <p className="text-emerald-200 text-sm font-semibold">Order ID</p>
                                                    <p className="font-bold text-lg text-white">#{String(order.id).padStart(5, '0')}</p>
                                                </div>
                                                <div>
                                                    <p className="text-emerald-200 text-sm font-semibold">Date</p>
                                                    <p className="font-semibold text-emerald-100">
                                                        📅 {new Date(order.created_at).toLocaleDateString('en-US', { 
                                                            year: 'numeric', 
                                                            month: 'short', 
                                                            day: 'numeric' 
                                                        })}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-emerald-200 text-sm font-semibold">Status</p>
                                                    <p className={`font-bold inline-block px-3 py-1 rounded-full text-sm ${statusInfo.bg} ${statusInfo.text} mt-1`}>
                                                        {statusInfo.icon} {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-emerald-200 text-sm font-semibold">Total</p>
                                                    <p className="font-bold text-lg bg-gradient-to-r from-emerald-300 to-teal-300 bg-clip-text text-transparent">
                                                        ${parseFloat(order.total_amount).toFixed(2)}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="p-6">
                                            <h4 className="font-bold text-white mb-4 text-lg">📦 Items</h4>
                                            <div className="space-y-2 mb-6">
                                                {order.items && order.items.length > 0 ? (
                                                    order.items.map((item, index) => (
                                                        <div key={item.id} className="flex justify-between items-center p-3 bg-white/10 border border-white/20 rounded-lg">
                                                            <div>
                                                                <p className="font-semibold text-emerald-200">{item.product?.name || 'Product'}</p>
                                                                <p className="text-sm text-emerald-100">Quantity: {item.quantity}</p>
                                                            </div>
                                                            <p className="font-bold text-emerald-300">${(parseFloat(item.unit_price) * item.quantity).toFixed(2)}</p>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <p className="text-emerald-200">No items in this order</p>
                                                )}
                                            </div>

                                            <div className="bg-emerald-500/20 border border-emerald-300/50 rounded-lg p-4 mb-6">
                                                <p className="text-sm text-emerald-200 font-semibold mb-2">📍 Shipping To:</p>
                                                <p className="text-emerald-100 whitespace-pre-wrap">{order.shipping_address}</p>
                                            </div>

                                            <div className="flex gap-4">
                                                <Link 
                                                    href="/shop"
                                                    className="flex-1 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg font-semibold hover:shadow-lg transition text-center"
                                                >
                                                    Continue Shopping
                                                </Link>
                                                <button className="flex-1 py-3 border-2 border-white/30 text-emerald-200 rounded-lg font-semibold hover:border-emerald-300 hover:text-emerald-100 transition">
                                                    📄 Download Invoice
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
