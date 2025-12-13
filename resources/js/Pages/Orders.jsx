import React, { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import Header from '../Components/Header';
import LoadingSpinner from '../Components/LoadingSpinner';
import EmptyState from '../Components/EmptyState';
import { useFetchCache } from '../hooks/useFetchCache';

export default function Orders() {
    const { data: ordersData, loading } = useFetchCache('/api/orders');
    const orders = ordersData?.data || [];

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
        <div className="min-h-screen bg-gray-50">
            <Header />

            <div className="max-w-6xl mx-auto px-4 py-8">
                <h1 className="text-4xl font-bold text-gray-800 mb-2">My Orders</h1>
                <p className="text-gray-600 mb-8">Track and manage all your orders</p>

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
                                <div key={order.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition border border-gray-200">
                                    <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 border-b border-gray-200">
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            <div>
                                                <p className="text-gray-600 text-sm font-semibold">Order ID</p>
                                                <p className="font-bold text-lg text-gray-800">#{String(order.id).padStart(5, '0')}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-600 text-sm font-semibold">Date</p>
                                                <p className="font-semibold text-gray-800">
                                                    📅 {new Date(order.created_at).toLocaleDateString('en-US', { 
                                                        year: 'numeric', 
                                                        month: 'short', 
                                                        day: 'numeric' 
                                                    })}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-gray-600 text-sm font-semibold">Status</p>
                                                <p className={`font-bold inline-block px-3 py-1 rounded-full text-sm ${statusInfo.bg} ${statusInfo.text} mt-1`}>
                                                    {statusInfo.icon} {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-gray-600 text-sm font-semibold">Total</p>
                                                <p className="font-bold text-lg bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                                                    ${parseFloat(order.total_amount).toFixed(2)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-6">
                                        <h4 className="font-bold text-gray-800 mb-4 text-lg">📦 Items</h4>
                                        <div className="space-y-2 mb-6">
                                            {order.items && order.items.length > 0 ? (
                                                order.items.map((item, index) => (
                                                    <div key={item.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                                        <div>
                                                            <p className="font-semibold text-gray-800">{item.product?.name || 'Product'}</p>
                                                            <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                                                        </div>
                                                        <p className="font-bold text-emerald-600">${(parseFloat(item.unit_price) * item.quantity).toFixed(2)}</p>
                                                    </div>
                                                ))
                                            ) : (
                                                <p className="text-gray-600">No items in this order</p>
                                            )}
                                        </div>

                                        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mb-6">
                                            <p className="text-sm text-gray-600 font-semibold mb-2">📍 Shipping To:</p>
                                            <p className="text-gray-800 whitespace-pre-wrap">{order.shipping_address}</p>
                                        </div>

                                        <div className="flex gap-4">
                                            <Link 
                                                href="/shop"
                                                className="flex-1 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg font-semibold hover:shadow-lg transition text-center"
                                            >
                                                Continue Shopping
                                            </Link>
                                            <button className="flex-1 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:border-emerald-600 hover:text-emerald-600 transition">
                                                Download Invoice
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
    );
}
