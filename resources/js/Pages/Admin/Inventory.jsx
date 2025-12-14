import React, { useState, useEffect } from 'react';
import AdminHeader from '../../Components/AdminHeader';
import LoadingSpinner from '../../Components/LoadingSpinner';
import { useAuth } from '../../contexts/AuthContext';

export default function AdminInventory() {
    const { isAuthenticated, loading: authLoading } = useAuth();
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [lowStockOnly, setLowStockOnly] = useState(false);
    const [page, setPage] = useState(1);
    const [editingId, setEditingId] = useState(null);
    const [newQuantity, setNewQuantity] = useState('');

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            window.location.href = '/login';
            return;
        }
        if (!authLoading) {
            fetchInventory();
            fetchCategories();
        }
    }, [authLoading, isAuthenticated, search, categoryFilter, lowStockOnly, page]);

    const fetchInventory = async () => {
        try {
            const token = localStorage.getItem('token');
            const query = new URLSearchParams();
            if (search) query.append('search', search);
            if (categoryFilter) query.append('category', categoryFilter);
            if (lowStockOnly) query.append('low_stock', 'true');
            query.append('page', page);

            const res = await fetch(`/api/admin/inventory?${query}`, {
                headers: { 'Authorization': `Bearer ${token}` },
            });
            const data = await res.json();
            setProducts(data.data || []);
        } catch (err) {
            setError('Failed to load inventory');
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/categories', {
                headers: { 'Authorization': `Bearer ${token}` },
            });
            const data = await res.json();
            setCategories(data);
        } catch (err) {
            console.error('Failed to load categories');
        }
    };

    const handleUpdateQuantity = async (productId) => {
        const token = localStorage.getItem('token');
        
        try {
            const res = await fetch(`/api/admin/inventory/${productId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ quantity: parseInt(newQuantity) }),
            });

            if (res.ok) {
                setEditingId(null);
                setNewQuantity('');
                fetchInventory();
            } else {
                setError('Failed to update quantity');
            }
        } catch (err) {
            setError('Error updating quantity');
        }
    };

    const startEdit = (product) => {
        setEditingId(product.id);
        setNewQuantity(product.quantity);
    };

    if (authLoading || loading) {
        return <LoadingSpinner />;
    }

    const lowStockCount = products.filter(p => p.quantity < 10).length;
    const totalValue = products.reduce((sum, p) => sum + (p.price * p.quantity), 0);

    return (
        <div className="min-h-screen relative overflow-hidden" style={{backgroundImage: 'url(/BG/Dashboard.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed'}}>
            <div className="absolute inset-0 bg-gradient-to-b from-emerald-900/40 via-teal-900/35 to-green-900/50"></div>
            
            <div className="relative z-10">
                <AdminHeader />

                <div className="max-w-7xl mx-auto px-4 py-8">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-300 to-teal-300 bg-clip-text text-transparent mb-8">📊 Inventory Management</h1>

                    {error && (
                        <div className="bg-red-500/20 border border-red-400/50 text-red-100 px-4 py-3 rounded-xl mb-6">
                            {error}
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                        <InventoryCard icon="📦" title="Total Products" value={products.length} color="from-blue-400 to-blue-600" />
                        <InventoryCard icon="⚠️" title="Low Stock Items" value={lowStockCount} color="from-red-400 to-red-600" />
                        <InventoryCard icon="💰" title="Inventory Value" value={`$${totalValue.toFixed(2)}`} color="from-emerald-400 to-emerald-600" />
                    </div>

                    <div className="backdrop-blur-lg bg-white/10 border border-white/30 rounded-xl shadow-lg p-6 mb-8">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={search}
                                onChange={(e) => {
                                    setSearch(e.target.value);
                                    setPage(1);
                                }}
                                className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-emerald-200/50 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                            />
                            <select
                                value={categoryFilter}
                                onChange={(e) => {
                                    setCategoryFilter(e.target.value);
                                    setPage(1);
                                }}
                                className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
                            >
                                <option value="">All Categories</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id} className="bg-emerald-900">{cat.name}</option>
                                ))}
                            </select>
                            <button
                                onClick={() => {
                                    setLowStockOnly(!lowStockOnly);
                                    setPage(1);
                                }}
                                className={`px-4 py-2 rounded-lg font-semibold transition ${lowStockOnly ? 'bg-red-500/30 text-red-300 border border-red-400/50' : 'bg-white/10 text-emerald-300 border border-white/20'}`}
                            >
                                {lowStockOnly ? '✓ Low Stock' : 'Low Stock'}
                            </button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-white/20">
                                        <th className="text-left py-3 px-4 text-emerald-300 font-semibold">Product</th>
                                        <th className="text-left py-3 px-4 text-emerald-300 font-semibold">Category</th>
                                        <th className="text-center py-3 px-4 text-emerald-300 font-semibold">Current Stock</th>
                                        <th className="text-right py-3 px-4 text-emerald-300 font-semibold">Unit Price</th>
                                        <th className="text-right py-3 px-4 text-emerald-300 font-semibold">Total Value</th>
                                        <th className="text-left py-3 px-4 text-emerald-300 font-semibold">Status</th>
                                        <th className="text-left py-3 px-4 text-emerald-300 font-semibold">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.map(product => (
                                        <tr key={product.id} className="border-b border-white/10 hover:bg-white/5 transition">
                                            <td className="py-3 px-4 text-emerald-200">{product.name}</td>
                                            <td className="py-3 px-4 text-emerald-200">{product.category?.name || 'N/A'}</td>
                                            <td className="py-3 px-4 text-center">
                                                {editingId === product.id ? (
                                                    <div className="flex items-center justify-center gap-2">
                                                        <input
                                                            type="number"
                                                            value={newQuantity}
                                                            onChange={(e) => setNewQuantity(e.target.value)}
                                                            className="w-16 px-2 py-1 bg-white/10 border border-white/20 rounded text-white text-center focus:outline-none focus:ring-2 focus:ring-emerald-400"
                                                            min="0"
                                                        />
                                                    </div>
                                                ) : (
                                                    <span className="font-semibold text-emerald-300">{product.quantity}</span>
                                                )}
                                            </td>
                                            <td className="py-3 px-4 text-right text-emerald-200">${product.price}</td>
                                            <td className="py-3 px-4 text-right text-emerald-300 font-semibold">${(product.price * product.quantity).toFixed(2)}</td>
                                            <td className="py-3 px-4">
                                                {product.quantity < 5 ? (
                                                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-500/30 text-red-300">Out of Stock</span>
                                                ) : product.quantity < 10 ? (
                                                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-500/30 text-yellow-300">Low Stock</span>
                                                ) : (
                                                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-500/30 text-green-300">In Stock</span>
                                                )}
                                            </td>
                                            <td className="py-3 px-4 flex gap-2">
                                                {editingId === product.id ? (
                                                    <>
                                                        <button
                                                            onClick={() => handleUpdateQuantity(product.id)}
                                                            className="px-3 py-1 bg-green-500/20 text-green-300 rounded hover:bg-green-500/30 transition text-xs font-semibold"
                                                        >
                                                            Save
                                                        </button>
                                                        <button
                                                            onClick={() => setEditingId(null)}
                                                            className="px-3 py-1 bg-gray-500/20 text-gray-300 rounded hover:bg-gray-500/30 transition text-xs font-semibold"
                                                        >
                                                            Cancel
                                                        </button>
                                                    </>
                                                ) : (
                                                    <button
                                                        onClick={() => startEdit(product)}
                                                        className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded hover:bg-blue-500/30 transition text-xs font-semibold"
                                                    >
                                                        Edit
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {products.length === 0 && (
                            <div className="text-center py-8 text-emerald-100/70">
                                No products found
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

function InventoryCard({ icon, title, value, color }) {
    return (
        <div className={`backdrop-blur-lg bg-gradient-to-br ${color} bg-opacity-20 border border-white/30 rounded-xl shadow-lg p-6`}>
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-emerald-100 text-sm font-semibold">{title}</p>
                    <p className="text-white text-3xl font-bold mt-2">{value}</p>
                </div>
                <p className="text-4xl">{icon}</p>
            </div>
        </div>
    );
}
