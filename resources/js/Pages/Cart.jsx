import React, { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import Header from '../Components/Header';
import EmptyState from '../Components/EmptyState';
import { useAuth } from '../contexts/AuthContext';

export default function Cart() {
    const { isAuthenticated, loading: authLoading } = useAuth();
    const [cartItems, setCartItems] = useState([]);
    const [shippingAddress, setShippingAddress] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('credit_card');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            localStorage.setItem('returnUrl', '/cart');
            window.location.href = '/login';
        }
    }, [isAuthenticated, authLoading]);
    const [orderPlaced, setOrderPlaced] = useState(false);

    useEffect(() => {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        setCartItems(cart);
    }, []);

    const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = total * 0.1;
    const shipping = total > 50 ? 0 : 10;
    const grandTotal = total + tax + shipping;

    const handleRemoveItem = (productId) => {
        const updated = cartItems.filter(item => item.product_id !== productId);
        setCartItems(updated);
        localStorage.setItem('cart', JSON.stringify(updated));
    };

    const handleUpdateQuantity = (productId, newQuantity) => {
        const updated = cartItems.map(item =>
            item.product_id === productId
                ? { ...item, quantity: Math.max(1, newQuantity) }
                : item
        );
        setCartItems(updated);
        localStorage.setItem('cart', JSON.stringify(updated));
    };

    const handlePlaceOrder = async () => {
        if (!shippingAddress || cartItems.length === 0) {
            alert('Please fill in all required fields');
            return;
        }

        setLoading(true);
        try {
            const res = await fetch('/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({
                    items: cartItems.map(item => ({
                        product_id: item.product_id,
                        quantity: item.quantity,
                    })),
                    shipping_address: shippingAddress,
                    payment_method: paymentMethod,
                }),
            });

            if (res.ok) {
                setOrderPlaced(true);
                localStorage.removeItem('cart');
                setCartItems([]);
                setTimeout(() => {
                    window.location.href = '/orders';
                }, 2000);
            } else {
                alert('Failed to place order');
            }
        } catch (error) {
            console.error('Error placing order:', error);
            alert('Error placing order');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen relative overflow-hidden" style={{backgroundImage: 'url(/BG/Dashboard.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed'}}>
            <div className="absolute inset-0 bg-gradient-to-b from-emerald-900/40 via-teal-900/35 to-green-900/50"></div>
            
            <div className="relative z-10">
                <Header />

                <div className="max-w-6xl mx-auto px-4 py-8">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-300 to-teal-300 bg-clip-text text-transparent mb-2">🛒 Shopping Cart</h1>
                    <p className="text-emerald-100 text-lg font-semibold mb-8">Review your items before <span className="text-emerald-300">checkout</span></p>

                {orderPlaced && (
                    <div className="bg-emerald-50 border-l-4 border-emerald-500 p-6 rounded-r-lg mb-6">
                        <p className="text-emerald-800 font-bold text-lg">✓ Order placed successfully! Redirecting to orders...</p>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        {cartItems.length === 0 ? (
                            <EmptyState 
                                icon="🛒"
                                title="Your Cart is Empty"
                                description="Start shopping to add items to your cart"
                                actionHref="/shop"
                                actionText="Continue Shopping"
                            />
                        ) : (
                            <div className="backdrop-blur-lg bg-white/10 border border-white/30 rounded-xl shadow-lg overflow-hidden">
                                <div className="space-y-2">
                                    {cartItems.map((item, index) => (
                                        <div 
                                            key={item.product_id}
                                            className={`flex items-center gap-6 p-6 hover:bg-white/10 transition ${
                                                index !== cartItems.length - 1 ? 'border-b border-white/20' : ''
                                            }`}
                                        >
                                            <div className="flex-1">
                                                <h3 className="font-bold text-lg text-emerald-200 mb-1">{item.name}</h3>
                                                <p className="text-emerald-100/80 text-sm">Unit Price: <span className="text-emerald-300">${item.price.toFixed(2)}</span></p>
                                            </div>
                                            <div className="flex items-center gap-2 border border-white/30 rounded-lg bg-white/10 backdrop-blur-sm">
                                                <button
                                                    onClick={() => handleUpdateQuantity(item.product_id, item.quantity - 1)}
                                                    className="px-3 py-2 text-emerald-300 hover:text-teal-300 font-bold"
                                                >
                                                    −
                                                </button>
                                                <input
                                                    type="number"
                                                    min="1"
                                                    value={item.quantity}
                                                    onChange={(e) => handleUpdateQuantity(item.product_id, parseInt(e.target.value) || 1)}
                                                    className="w-12 text-center font-bold border-0 bg-transparent text-emerald-200"
                                                />
                                                <button
                                                    onClick={() => handleUpdateQuantity(item.product_id, item.quantity + 1)}
                                                    className="px-3 py-2 text-emerald-300 hover:text-teal-300 font-bold"
                                                >
                                                    +
                                                </button>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-lg text-emerald-300">${(item.price * item.quantity).toFixed(2)}</p>
                                                <button
                                                    onClick={() => handleRemoveItem(item.product_id)}
                                                    className="text-red-400 text-sm hover:text-red-300 font-semibold mt-2"
                                                >
                                                    🗑️ Remove
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {cartItems.length > 0 && (
                        <aside className="backdrop-blur-lg bg-white/10 border border-white/30 p-8 rounded-xl shadow-lg h-fit sticky top-24">
                            <h3 className="text-2xl font-bold mb-6 text-white">📋 Order Summary</h3>

                            <div className="space-y-4 pb-6 border-b border-white/20">
                                <div className="flex justify-between text-emerald-100">
                                    <span>Subtotal</span>
                                    <span className="font-semibold text-emerald-300">${total.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-emerald-100">
                                    <span>Tax (10%)</span>
                                    <span className="font-semibold text-emerald-300">${tax.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-emerald-100">
                                    <span>Shipping</span>
                                    <span className="font-semibold">
                                        {shipping === 0 ? (
                                            <span className="text-teal-300">Free 🎉</span>
                                        ) : (
                                            <span className="text-emerald-300">${shipping.toFixed(2)}</span>
                                        )}
                                    </span>
                                </div>
                                {shipping === 0 && (
                                    <p className="text-xs text-teal-300 font-semibold">Free shipping on orders over $50!</p>
                                )}
                            </div>

                            <div className="text-2xl font-bold flex justify-between mb-6 pt-6">
                                <span className="text-white">Total</span>
                                <span className="bg-gradient-to-r from-emerald-300 to-teal-300 bg-clip-text text-transparent">
                                    ${grandTotal.toFixed(2)}
                                </span>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold mb-2 text-emerald-200">📍 Shipping Address</label>
                                    <textarea
                                        value={shippingAddress}
                                        onChange={(e) => setShippingAddress(e.target.value)}
                                        className="w-full px-4 py-3 border-2 border-white/30 bg-white/10 text-emerald-100 rounded-lg focus:border-emerald-300 focus:outline-none transition resize-none placeholder-emerald-400"
                                        rows="3"
                                        placeholder="Enter your shipping address"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold mb-2 text-emerald-200">💳 Payment Method</label>
                                    <select
                                        value={paymentMethod}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                        className="w-full px-4 py-3 border-2 border-white/30 bg-white/10 text-emerald-100 rounded-lg focus:border-emerald-300 focus:outline-none transition"
                                    >
                                        <option value="credit_card">💳 Credit Card</option>
                                        <option value="debit_card">🏧 Debit Card</option>
                                        <option value="paypal">🅿️ PayPal</option>
                                    </select>
                                </div>

                                <button
                                    onClick={handlePlaceOrder}
                                    disabled={loading}
                                    className={`w-full py-4 rounded-lg font-bold text-lg transition-all transform hover:scale-105 ${
                                        loading
                                            ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                                            : 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:shadow-lg'
                                    }`}
                                >
                                    {loading ? '⏳ Processing...' : '✓ Place Order'}
                                </button>

                                <Link
                                    href="/shop"
                                    className="block text-center py-3 border-2 border-white/30 text-emerald-200 rounded-lg font-semibold hover:border-emerald-300 hover:text-emerald-300 transition"
                                >
                                    Continue Shopping
                                </Link>
                            </div>
                        </aside>
                    )}
                </div>
            </div>
            </div>
        </div>
    );
}
