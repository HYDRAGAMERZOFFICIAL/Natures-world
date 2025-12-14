import React, { useState, useEffect, useRef } from 'react';
import AdminHeader from '../../Components/AdminHeader';
import LoadingSpinner from '../../Components/LoadingSpinner';
import { useAuth } from '../../contexts/AuthContext';

export default function OrderDetails({ orderId }) {
    const { isAuthenticated, loading: authLoading } = useAuth();
    const [order, setOrder] = useState(null);
    const [slip, setSlip] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [updatingStatus, setUpdatingStatus] = useState(false);
    const [newStatus, setNewStatus] = useState('');
    const printRef = useRef();

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            window.location.href = '/login';
            return;
        }
        if (!authLoading) {
            fetchOrder();
        }
    }, [authLoading, isAuthenticated]);

    const fetchOrder = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`/api/admin/orders/${orderId}`, {
                headers: { 'Authorization': `Bearer ${token}` },
            });
            const data = await res.json();
            setOrder(data);
            setNewStatus(data.status);
        } catch (err) {
            setError('Failed to load order');
        } finally {
            setLoading(false);
        }
    };

    const fetchOrderSlip = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`/api/admin/orders/${orderId}/slip`, {
                headers: { 'Authorization': `Bearer ${token}` },
            });
            const data = await res.json();
            setSlip(data);
        } catch (err) {
            setError('Failed to generate order slip');
        }
    };

    const handleStatusUpdate = async () => {
        if (!newStatus || newStatus === order.status) return;

        setUpdatingStatus(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`/api/admin/orders/${orderId}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ status: newStatus }),
            });

            if (res.ok) {
                const updatedOrder = await res.json();
                setOrder(updatedOrder);
            } else {
                setError('Failed to update status');
            }
        } catch (err) {
            setError('Error updating status');
        } finally {
            setUpdatingStatus(false);
        }
    };

    const handlePrint = () => {
        window.print();
    };

    if (authLoading || loading) {
        return <LoadingSpinner />;
    }

    if (!order) {
        return (
            <div className="min-h-screen bg-emerald-900">
                <AdminHeader />
                <div className="flex items-center justify-center h-screen">
                    <p className="text-white text-2xl">Order not found</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen relative overflow-hidden" style={{backgroundImage: 'url(/BG/Dashboard.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed'}}>
            <div className="absolute inset-0 bg-gradient-to-b from-emerald-900/40 via-teal-900/35 to-green-900/50"></div>
            
            <div className="relative z-10">
                <AdminHeader />

                <div className="max-w-4xl mx-auto px-4 py-8">
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-300 to-teal-300 bg-clip-text text-transparent">Order #{String(order.id).padStart(8, '0')}</h1>
                        <button
                            onClick={() => {
                                fetchOrderSlip();
                            }}
                            className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2 rounded-lg font-bold transition"
                        >
                            📄 Generate Slip
                        </button>
                    </div>

                    {error && (
                        <div className="bg-red-500/20 border border-red-400/50 text-red-100 px-4 py-3 rounded-xl mb-6">
                            {error}
                        </div>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                        <div className="backdrop-blur-lg bg-white/10 border border-white/30 rounded-xl shadow-lg p-6 lg:col-span-2">
                            <h2 className="text-2xl font-bold text-white mb-4">📦 Order Details</h2>
                            
                            <div className="mb-6">
                                <h3 className="text-lg font-semibold text-emerald-300 mb-3">Items</h3>
                                <div className="space-y-2">
                                    {order.items?.map((item, idx) => (
                                        <div key={idx} className="flex justify-between items-center p-3 bg-white/5 rounded-lg border border-white/10">
                                            <div>
                                                <p className="text-emerald-200 font-semibold">{item.product?.name}</p>
                                                <p className="text-emerald-100/60 text-sm">Qty: {item.quantity}</p>
                                            </div>
                                            <p className="text-emerald-300 font-semibold">${(item.unit_price * item.quantity).toFixed(2)}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="border-t border-white/20 pt-6">
                                <div className="flex justify-between items-center mb-3">
                                    <p className="text-emerald-100">Subtotal</p>
                                    <p className="text-white font-semibold">${order.total_amount}</p>
                                </div>
                                <div className="flex justify-between items-center mb-3">
                                    <p className="text-emerald-100">Tax (10%)</p>
                                    <p className="text-white font-semibold">${(order.total_amount * 0.1).toFixed(2)}</p>
                                </div>
                                <div className="flex justify-between items-center border-t border-white/20 pt-3">
                                    <p className="text-lg font-bold text-emerald-300">Grand Total</p>
                                    <p className="text-2xl font-bold text-emerald-300">${(order.total_amount * 1.1).toFixed(2)}</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="backdrop-blur-lg bg-white/10 border border-white/30 rounded-xl shadow-lg p-6">
                                <h3 className="text-lg font-semibold text-emerald-300 mb-4">👤 Customer</h3>
                                <div className="space-y-2">
                                    <p className="text-emerald-200"><span className="text-emerald-100/60">Name:</span> {order.user?.name}</p>
                                    <p className="text-emerald-200 break-all"><span className="text-emerald-100/60">Email:</span> {order.user?.email}</p>
                                    <p className="text-emerald-200"><span className="text-emerald-100/60">Phone:</span> {order.user?.phone || 'N/A'}</p>
                                </div>
                            </div>

                            <div className="backdrop-blur-lg bg-white/10 border border-white/30 rounded-xl shadow-lg p-6">
                                <h3 className="text-lg font-semibold text-emerald-300 mb-4">📍 Shipping</h3>
                                <p className="text-emerald-200 text-sm break-words">{order.shipping_address}</p>
                            </div>

                            <div className="backdrop-blur-lg bg-white/10 border border-white/30 rounded-xl shadow-lg p-6">
                                <h3 className="text-lg font-semibold text-emerald-300 mb-4">💳 Payment</h3>
                                <p className="text-emerald-200 capitalize">{order.payment_method?.replace('_', ' ')}</p>
                                <p className="text-emerald-100/60 text-sm mt-2">Date: {new Date(order.created_at).toLocaleDateString()}</p>
                            </div>

                            <div className="backdrop-blur-lg bg-white/10 border border-white/30 rounded-xl shadow-lg p-6">
                                <h3 className="text-lg font-semibold text-emerald-300 mb-4">📊 Status</h3>
                                <select
                                    value={newStatus}
                                    onChange={(e) => setNewStatus(e.target.value)}
                                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-400 mb-3"
                                >
                                    <option value="pending" className="bg-emerald-900">Pending</option>
                                    <option value="processing" className="bg-emerald-900">Processing</option>
                                    <option value="shipped" className="bg-emerald-900">Shipped</option>
                                    <option value="completed" className="bg-emerald-900">Completed</option>
                                    <option value="cancelled" className="bg-emerald-900">Cancelled</option>
                                </select>
                                <button
                                    onClick={handleStatusUpdate}
                                    disabled={updatingStatus || newStatus === order.status}
                                    className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white px-4 py-2 rounded-lg font-bold transition"
                                >
                                    {updatingStatus ? 'Updating...' : 'Update Status'}
                                </button>
                            </div>
                        </div>
                    </div>

                    {slip && (
                        <div ref={printRef} className="backdrop-blur-lg bg-white/10 border border-white/30 rounded-xl shadow-lg p-8">
                            <OrderSlipPrint slip={slip} onPrint={handlePrint} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function OrderSlipPrint({ slip, onPrint }) {
    return (
        <div className="print:p-0">
            <div className="flex justify-between items-center mb-6 print:hidden">
                <h2 className="text-2xl font-bold text-white">📄 Order Slip</h2>
                <button
                    onClick={onPrint}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-bold"
                >
                    🖨️ Print
                </button>
            </div>

            <div className="bg-white/5 border border-white/20 rounded-lg p-6 print:border-0 print:bg-white print:text-black print:p-0">
                <div className="text-center mb-6 print:mb-4">
                    <h1 className="text-3xl font-bold text-emerald-300 print:text-black print:text-2xl">🌿 Nature's World</h1>
                    <p className="text-emerald-100 print:text-gray-600">ORDER SLIP</p>
                </div>

                <div className="border-t border-b border-white/20 print:border-black py-4 mb-4 print:mb-3">
                    <div className="flex justify-between mb-2">
                        <span className="text-emerald-100 print:text-gray-700">Order ID:</span>
                        <span className="text-white font-bold print:text-black">{slip.order_id}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-emerald-100 print:text-gray-700">Date:</span>
                        <span className="text-white print:text-black">{slip.order_date}</span>
                    </div>
                </div>

                <div className="mb-6 print:mb-4">
                    <h3 className="text-lg font-bold text-emerald-300 print:text-black mb-3">CUSTOMER INFORMATION</h3>
                    <div className="space-y-1 text-sm print:text-xs">
                        <p><span className="font-semibold print:text-black">Name:</span> <span className="text-emerald-200 print:text-black">{slip.customer.name}</span></p>
                        <p><span className="font-semibold print:text-black">Email:</span> <span className="text-emerald-200 print:text-black">{slip.customer.email}</span></p>
                        <p><span className="font-semibold print:text-black">Phone:</span> <span className="text-emerald-200 print:text-black">{slip.customer.phone}</span></p>
                        <p><span className="font-semibold print:text-black">Address:</span> <span className="text-emerald-200 print:text-black">{slip.customer.address}</span></p>
                    </div>
                </div>

                <div className="mb-6 print:mb-4">
                    <h3 className="text-lg font-bold text-emerald-300 print:text-black mb-3">ORDER ITEMS</h3>
                    <table className="w-full text-sm print:text-xs">
                        <thead>
                            <tr className="border-b border-white/20 print:border-black">
                                <th className="text-left text-emerald-300 print:text-black font-bold py-1">Product</th>
                                <th className="text-center text-emerald-300 print:text-black font-bold py-1">Qty</th>
                                <th className="text-right text-emerald-300 print:text-black font-bold py-1">Unit Price</th>
                                <th className="text-right text-emerald-300 print:text-black font-bold py-1">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {slip.items?.map((item, idx) => (
                                <tr key={idx} className="border-b border-white/10 print:border-gray-300">
                                    <td className="text-emerald-200 print:text-black py-1">{item.product_name}</td>
                                    <td className="text-center text-emerald-200 print:text-black py-1">{item.quantity}</td>
                                    <td className="text-right text-emerald-200 print:text-black py-1">${item.unit_price.toFixed(2)}</td>
                                    <td className="text-right text-emerald-200 print:text-black py-1 font-semibold">${item.total.toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="border-t border-white/20 print:border-black pt-4 print:pt-3">
                    <div className="flex justify-end mb-2">
                        <div className="w-48">
                            <div className="flex justify-between text-emerald-200 print:text-black mb-2">
                                <span>Subtotal:</span>
                                <span className="font-semibold">${slip.totals.subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-emerald-200 print:text-black mb-3">
                                <span>Tax (10%):</span>
                                <span className="font-semibold">${slip.totals.tax.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-emerald-300 print:text-black font-bold border-t border-white/20 print:border-black pt-2">
                                <span>TOTAL:</span>
                                <span>${slip.totals.grand_total.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-6 print:mt-4 pt-6 print:pt-4 border-t border-white/20 print:border-black text-center">
                    <p className="text-emerald-100/60 print:text-gray-600 text-xs">Payment Method: <span className="text-emerald-200 print:text-black capitalize font-semibold">{slip.payment_method?.replace('_', ' ')}</span></p>
                    <p className="text-emerald-100/60 print:text-gray-600 text-xs mt-1">Order Status: <span className="text-emerald-200 print:text-black capitalize font-semibold">{slip.status}</span></p>
                    <p className="text-emerald-100/60 print:text-gray-600 text-xs mt-3">Thank you for your purchase!</p>
                </div>
            </div>
        </div>
    );
}
