import React, { useState, useEffect } from 'react';
import AdminHeader from '../../Components/AdminHeader';
import LoadingSpinner from '../../Components/LoadingSpinner';
import { useAuth } from '../../contexts/AuthContext';

export default function AdminCategories() {
    const { isAuthenticated, loading: authLoading } = useAuth();
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
        image: '',
    });

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            window.location.href = '/login';
            return;
        }
        if (!authLoading) {
            fetchCategories();
        }
    }, [authLoading, isAuthenticated, search, page]);

    const fetchCategories = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`/api/admin/categories?search=${search}&page=${page}`, {
                headers: { 'Authorization': `Bearer ${token}` },
            });
            const data = await res.json();
            setCategories(data.data || []);
        } catch (err) {
            setError('Failed to load categories');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        
        try {
            const url = editingId ? `/api/admin/categories/${editingId}` : '/api/admin/categories';
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
                setFormData({ name: '', slug: '', description: '', image: '' });
                fetchCategories();
            } else {
                setError('Failed to save category');
            }
        } catch (err) {
            setError('Error saving category');
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure?')) return;
        
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`/api/admin/categories/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` },
            });

            if (res.ok) {
                fetchCategories();
            }
        } catch (err) {
            setError('Failed to delete category');
        }
    };

    const startEdit = (category) => {
        setEditingId(category.id);
        setFormData({
            name: category.name,
            slug: category.slug,
            description: category.description || '',
            image: category.image || '',
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
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-300 to-teal-300 bg-clip-text text-transparent">🏷️ Category Management</h1>
                        <button
                            onClick={() => {
                                setShowForm(!showForm);
                                setEditingId(null);
                                setFormData({ name: '', slug: '', description: '', image: '' });
                            }}
                            className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2 rounded-lg font-bold transition"
                        >
                            {showForm ? '✕ Cancel' : '+ Add Category'}
                        </button>
                    </div>

                    {error && (
                        <div className="bg-red-500/20 border border-red-400/50 text-red-100 px-4 py-3 rounded-xl mb-6">
                            {error}
                        </div>
                    )}

                    {showForm && (
                        <div className="backdrop-blur-lg bg-white/10 border border-white/30 rounded-xl shadow-lg p-6 mb-8">
                            <h3 className="text-2xl font-bold text-white mb-6">{editingId ? 'Edit Category' : 'Add New Category'}</h3>
                            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input
                                    type="text"
                                    placeholder="Category Name"
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
                                    type="text"
                                    placeholder="Image URL"
                                    value={formData.image}
                                    onChange={(e) => setFormData({...formData, image: e.target.value})}
                                    className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-emerald-200/50 focus:outline-none focus:ring-2 focus:ring-emerald-400 md:col-span-2"
                                />
                                <textarea
                                    placeholder="Description"
                                    value={formData.description}
                                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                                    className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-emerald-200/50 focus:outline-none focus:ring-2 focus:ring-emerald-400 md:col-span-2 resize-none"
                                    rows="3"
                                />
                                <button
                                    type="submit"
                                    className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2 rounded-lg font-bold transition md:col-span-2"
                                >
                                    {editingId ? 'Update Category' : 'Create Category'}
                                </button>
                            </form>
                        </div>
                    )}

                    <div className="backdrop-blur-lg bg-white/10 border border-white/30 rounded-xl shadow-lg p-6">
                        <div className="mb-6">
                            <input
                                type="text"
                                placeholder="Search categories..."
                                value={search}
                                onChange={(e) => {
                                    setSearch(e.target.value);
                                    setPage(1);
                                }}
                                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-emerald-200/50 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {categories.map(category => (
                                <div key={category.id} className="backdrop-blur-sm bg-white/5 border border-white/20 rounded-lg p-4 hover:bg-white/10 transition">
                                    {category.image && (
                                        <img
                                            src={category.image}
                                            alt={category.name}
                                            className="w-full h-32 object-cover rounded-lg mb-3"
                                        />
                                    )}
                                    <h4 className="text-lg font-bold text-emerald-200 mb-1">{category.name}</h4>
                                    <p className="text-emerald-100/60 text-sm mb-3 line-clamp-2">{category.description}</p>
                                    <p className="text-emerald-100/70 text-xs mb-3">
                                        {category.products?.length || 0} products
                                    </p>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => startEdit(category)}
                                            className="flex-1 px-3 py-1 bg-blue-500/20 text-blue-300 rounded hover:bg-blue-500/30 transition text-sm font-semibold"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(category.id)}
                                            className="flex-1 px-3 py-1 bg-red-500/20 text-red-300 rounded hover:bg-red-500/30 transition text-sm font-semibold"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
