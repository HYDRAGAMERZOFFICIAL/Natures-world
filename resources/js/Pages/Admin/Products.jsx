import React, { useState, useEffect } from 'react';
import AdminHeader from '../../Components/AdminHeader';
import LoadingSpinner from '../../Components/LoadingSpinner';
import { useAuth } from '../../contexts/AuthContext';

export default function AdminProducts() {
    const { isAuthenticated, loading: authLoading } = useAuth();
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        description: '',
        price: '',
        quantity: '',
        category_id: '',
        image: '',
    });

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            window.location.href = '/login';
            return;
        }
        if (!authLoading) {
            fetchProducts();
            fetchCategories();
        }
    }, [authLoading, isAuthenticated, search, page]);

    const fetchProducts = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`/api/admin/products?search=${search}&page=${page}`, {
                headers: { 'Authorization': `Bearer ${token}` },
            });
            const data = await res.json();
            setProducts(data.data || []);
        } catch (err) {
            setError('Failed to load products');
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        
        try {
            const url = editingId ? `/api/admin/products/${editingId}` : '/api/admin/products';
            const method = editingId ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                setShowForm(false);
                setEditingId(null);
                setFormData({
                    name: '',
                    slug: '',
                    description: '',
                    price: '',
                    quantity: '',
                    category_id: '',
                    image: '',
                });
                fetchProducts();
            } else {
                setError('Failed to save product');
            }
        } catch (err) {
            setError('Error saving product');
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure?')) return;
        
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`/api/admin/products/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` },
            });

            if (res.ok) {
                fetchProducts();
            }
        } catch (err) {
            setError('Failed to delete product');
        }
    };

    const startEdit = (product) => {
        setEditingId(product.id);
        setFormData({
            name: product.name,
            slug: product.slug,
            description: product.description,
            price: product.price,
            quantity: product.quantity,
            category_id: product.category_id,
            image: product.image,
        });
        setShowForm(true);
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
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-300 to-teal-300 bg-clip-text text-transparent">📦 Product Management</h1>
                        <button
                            onClick={() => {
                                setShowForm(!showForm);
                                setEditingId(null);
                                setFormData({
                                    name: '',
                                    slug: '',
                                    description: '',
                                    price: '',
                                    quantity: '',
                                    category_id: '',
                                    image: '',
                                });
                            }}
                            className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2 rounded-lg font-bold transition"
                        >
                            {showForm ? '✕ Cancel' : '+ Add Product'}
                        </button>
                    </div>

                    {error && (
                        <div className="bg-red-500/20 border border-red-400/50 text-red-100 px-4 py-3 rounded-xl mb-6">
                            {error}
                        </div>
                    )}

                    {showForm && (
                        <div className="backdrop-blur-lg bg-white/10 border border-white/30 rounded-xl shadow-lg p-6 mb-8">
                            <h3 className="text-2xl font-bold text-white mb-6">{editingId ? 'Edit Product' : 'Add New Product'}</h3>
                            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input
                                    type="text"
                                    placeholder="Product Name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    required
                                    className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-emerald-200/50 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                                />
                                <input
                                    type="text"
                                    placeholder="Slug"
                                    value={formData.slug}
                                    onChange={(e) => setFormData({...formData, slug: e.target.value})}
                                    required
                                    className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-emerald-200/50 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                                />
                                <input
                                    type="number"
                                    placeholder="Price"
                                    value={formData.price}
                                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                                    required
                                    step="0.01"
                                    className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-emerald-200/50 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                                />
                                <input
                                    type="number"
                                    placeholder="Quantity"
                                    value={formData.quantity}
                                    onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                                    required
                                    className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-emerald-200/50 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                                />
                                <select
                                    value={formData.category_id}
                                    onChange={(e) => setFormData({...formData, category_id: e.target.value})}
                                    required
                                    className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
                                >
                                    <option value="">Select Category</option>
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.id} className="bg-emerald-900">{cat.name}</option>
                                    ))}
                                </select>
                                <input
                                    type="text"
                                    placeholder="Image URL"
                                    value={formData.image}
                                    onChange={(e) => setFormData({...formData, image: e.target.value})}
                                    className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-emerald-200/50 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                                />
                                <textarea
                                    placeholder="Description"
                                    value={formData.description}
                                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                                    required
                                    className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-emerald-200/50 focus:outline-none focus:ring-2 focus:ring-emerald-400 md:col-span-2 resize-none"
                                    rows="3"
                                />
                                <button
                                    type="submit"
                                    className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2 rounded-lg font-bold transition md:col-span-2"
                                >
                                    {editingId ? 'Update Product' : 'Create Product'}
                                </button>
                            </form>
                        </div>
                    )}

                    <div className="backdrop-blur-lg bg-white/10 border border-white/30 rounded-xl shadow-lg p-6">
                        <div className="mb-6">
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={search}
                                onChange={(e) => {
                                    setSearch(e.target.value);
                                    setPage(1);
                                }}
                                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-emerald-200/50 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                            />
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-white/20">
                                        <th className="text-left py-3 px-4 text-emerald-300 font-semibold">Name</th>
                                        <th className="text-left py-3 px-4 text-emerald-300 font-semibold">Category</th>
                                        <th className="text-left py-3 px-4 text-emerald-300 font-semibold">Price</th>
                                        <th className="text-left py-3 px-4 text-emerald-300 font-semibold">Stock</th>
                                        <th className="text-left py-3 px-4 text-emerald-300 font-semibold">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.map(product => (
                                        <tr key={product.id} className="border-b border-white/10 hover:bg-white/5 transition">
                                            <td className="py-3 px-4 text-emerald-200">{product.name}</td>
                                            <td className="py-3 px-4 text-emerald-200">{product.category?.name || 'N/A'}</td>
                                            <td className="py-3 px-4 text-emerald-300 font-semibold">${product.price}</td>
                                            <td className="py-3 px-4">
                                                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${product.quantity < 10 ? 'bg-red-500/20 text-red-300' : 'bg-green-500/20 text-green-300'}`}>
                                                    {product.quantity}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4 flex gap-2">
                                                <button
                                                    onClick={() => startEdit(product)}
                                                    className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded hover:bg-blue-500/30 transition text-sm font-semibold"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(product.id)}
                                                    className="px-3 py-1 bg-red-500/20 text-red-300 rounded hover:bg-red-500/30 transition text-sm font-semibold"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
