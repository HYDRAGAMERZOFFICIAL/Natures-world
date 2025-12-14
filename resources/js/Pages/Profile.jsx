import React, { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import Header from '../Components/Header';
import LoadingSpinner from '../Components/LoadingSpinner';
import ErrorAlert from '../Components/ErrorAlert';
import { useFetchCache } from '../hooks/useFetchCache';
import { useAuth } from '../contexts/AuthContext';

export default function Profile() {
    const { isAuthenticated, loading: authLoading, logout } = useAuth();
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState({});
    const [saveLoading, setSaveLoading] = useState(false);
    const [error, setError] = useState(null);
    const { data: user, loading } = useFetchCache('/api/user');

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            localStorage.setItem('returnUrl', '/profile');
            window.location.href = '/login';
        }
    }, [isAuthenticated, authLoading]);

    useEffect(() => {
        if (user) {
            setFormData(user);
        }
    }, [user]);

    const handleLogout = async () => {
        try {
            const token = localStorage.getItem('token');
            await fetch('/api/logout', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            logout();
            window.location.href = '/';
        } catch (error) {
            console.error('Error logging out:', error);
            setError('Failed to logout');
        }
    };

    const handleSaveChanges = async () => {
        setSaveLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/user', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    name: formData.name,
                    phone: formData.phone,
                    address: formData.address,
                }),
            });

            if (res.ok) {
                setEditing(false);
                setError(null);
            } else {
                setError('Failed to save changes');
            }
        } catch (err) {
            setError('Error saving changes');
        } finally {
            setSaveLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen relative overflow-hidden" style={{backgroundImage: 'url(/BG/Dashboard.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed'}}>
                <div className="absolute inset-0 bg-gradient-to-b from-emerald-900/40 via-teal-900/35 to-green-900/50"></div>
                <div className="relative z-10">
                    <Header showCart={false} showOrders={false} />
                    <LoadingSpinner />
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen relative overflow-hidden" style={{backgroundImage: 'url(/BG/Dashboard.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed'}}>
                <div className="absolute inset-0 bg-gradient-to-b from-emerald-900/40 via-teal-900/35 to-green-900/50"></div>
                <div className="relative z-10">
                    <Header showCart={false} showOrders={false} />
                    <div className="max-w-2xl mx-auto px-4 py-16">
                        <ErrorAlert message="Please log in to view your profile" />
                        <Link href="/login" className="text-emerald-300 font-bold hover:text-emerald-200">← Back to Login</Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen relative overflow-hidden" style={{backgroundImage: 'url(/BG/Dashboard.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed'}}>
            <div className="absolute inset-0 bg-gradient-to-b from-emerald-900/40 via-teal-900/35 to-green-900/50"></div>
            
            <div className="relative z-10">
                <Header showCart={false} showOrders={false} />

                <div className="max-w-4xl mx-auto px-4 py-8">
                    <div className="mb-8">
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-300 to-teal-300 bg-clip-text text-transparent mb-2">👤 My Profile</h1>
                        <p className="text-emerald-100 font-semibold">Manage your <span className="text-emerald-300">account information</span> and preferences</p>
                    </div>

                    {error && <ErrorAlert message={error} onDismiss={() => setError(null)} />}

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2">
                            <div className="backdrop-blur-lg bg-white/10 border border-white/30 rounded-xl shadow-lg p-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                    <div>
                                        <label className="block text-sm font-bold text-emerald-200 mb-3">👤 Full Name</label>
                                        <input
                                            type="text"
                                            value={formData.name || ''}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            disabled={!editing}
                                            className={`w-full px-4 py-3 border-2 rounded-lg transition text-emerald-100 ${
                                                editing
                                                    ? 'border-emerald-300 bg-white/10 focus:border-emerald-200 focus:outline-none'
                                                    : 'border-white/30 bg-white/10'
                                            }`}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-emerald-200 mb-3">📧 Email</label>
                                        <input
                                            type="email"
                                            value={formData.email || ''}
                                            disabled
                                            className="w-full px-4 py-3 border-2 border-white/30 rounded-lg bg-white/10 text-emerald-100"
                                        />
                                        <p className="text-xs text-emerald-200/60 mt-2">Email cannot be changed</p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-emerald-200 mb-3">📱 Phone</label>
                                        <input
                                            type="tel"
                                            value={formData.phone || ''}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            disabled={!editing}
                                            className={`w-full px-4 py-3 border-2 rounded-lg transition text-emerald-100 ${
                                                editing
                                                    ? 'border-emerald-300 bg-white/10 focus:border-emerald-200 focus:outline-none'
                                                    : 'border-white/30 bg-white/10'
                                            }`}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-emerald-200 mb-3">🏷️ Account Role</label>
                                        <input
                                            type="text"
                                            value={formData.role || 'user'}
                                            disabled
                                            className="w-full px-4 py-3 border-2 border-white/30 rounded-lg bg-white/10 text-emerald-100 capitalize"
                                        />
                                    </div>
                                </div>

                                <div className="mb-8">
                                    <label className="block text-sm font-bold text-emerald-200 mb-3">📍 Shipping Address</label>
                                    <textarea
                                        value={formData.address || ''}
                                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                        disabled={!editing}
                                        className={`w-full px-4 py-3 border-2 rounded-lg transition resize-none text-emerald-100 ${
                                            editing
                                                ? 'border-emerald-300 bg-white/10 focus:border-emerald-200 focus:outline-none'
                                                : 'border-white/30 bg-white/10'
                                        }`}
                                        rows="4"
                                    />
                                </div>

                                <div className="flex gap-4">
                                    {!editing ? (
                                        <>
                                            <button
                                                onClick={() => setEditing(true)}
                                                className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-3 rounded-lg font-bold hover:shadow-lg transition"
                                            >
                                                ✏️ Edit Profile
                                            </button>
                                            <button
                                                onClick={handleLogout}
                                                className="flex-1 border-2 border-red-400/50 text-red-300 px-6 py-3 rounded-lg font-bold hover:border-red-300/70 hover:text-red-200 transition"
                                            >
                                                🚪 Logout
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <button
                                                onClick={() => {
                                                    setEditing(false);
                                                    setFormData(user);
                                                }}
                                                className="flex-1 bg-gray-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-gray-600 transition"
                                            >
                                                ✕ Cancel
                                            </button>
                                            <button
                                                onClick={handleSaveChanges}
                                                disabled={saveLoading}
                                                className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-3 rounded-lg font-bold hover:shadow-lg transition disabled:bg-gray-400"
                                            >
                                                {saveLoading ? '⏳ Saving...' : '✓ Save Changes'}
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-1">
                            <div className="backdrop-blur-lg bg-emerald-500/10 border border-emerald-300/50 rounded-xl p-6">
                                <h3 className="font-bold text-white mb-4 text-lg">📊 Account Stats</h3>
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-sm text-emerald-200 mb-1">Member Since</p>
                                        <p className="font-bold text-emerald-100">
                                            {new Date(user.created_at).toLocaleDateString('en-US', { 
                                                year: 'numeric', 
                                                month: 'long', 
                                                day: 'numeric' 
                                            })}
                                        </p>
                                    </div>
                                    <div className="border-t border-emerald-300/50 pt-4">
                                        <p className="text-sm text-emerald-200 mb-1">Account Status</p>
                                        <p className="inline-block px-3 py-1 rounded-full bg-emerald-500/30 text-emerald-300 font-bold text-sm">
                                            ✓ Active
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 backdrop-blur-lg bg-white/10 border border-white/30 rounded-xl p-6 shadow-lg">
                                <h3 className="font-bold text-white mb-4">Quick Links</h3>
                                <div className="space-y-2">
                                    <Link href="/shop" className="block py-2 text-emerald-300 hover:text-emerald-200 font-semibold">
                                        🛍️ Shop
                                    </Link>
                                    <Link href="/orders" className="block py-2 text-emerald-300 hover:text-emerald-200 font-semibold">
                                        📦 My Orders
                                    </Link>
                                    <Link href="/cart" className="block py-2 text-emerald-300 hover:text-emerald-200 font-semibold">
                                        🛒 My Cart
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
