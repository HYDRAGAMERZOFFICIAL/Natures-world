import React, { useState } from 'react';
import { Link } from '@inertiajs/react';

export default function Register() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        phone: '',
        address: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (formData.password !== formData.password_confirmation) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        try {
            const res = await fetch('/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.message || 'Registration failed');
                setLoading(false);
                return;
            }

            alert('Registration successful! Please log in.');
            window.location.href = '/login';
        } catch (error) {
            console.error('Error:', error);
            setError('An error occurred. Please try again.');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-green-800 to-teal-900 flex items-center justify-center py-8 p-4 relative overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
                <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-teal-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{animationDelay: '2s'}}></div>
            </div>

            <div className="w-full max-w-md relative z-10">
                <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl p-8 hover:bg-white/15 transition-all duration-300">
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold text-white mb-2">🌿 Nature's World</h1>
                        <h2 className="text-2xl font-semibold text-emerald-100">Join Us Today</h2>
                        <p className="text-emerald-200 text-sm mt-2">Create your account to start shopping</p>
                    </div>

                    {error && (
                        <div className="bg-red-500/20 border border-red-400/50 text-red-100 px-4 py-3 rounded-xl mb-6 backdrop-blur-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleRegister}>
                        <div className="mb-4">
                            <label className="block text-emerald-100 font-semibold mb-2 text-sm">Full Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:bg-white/15 text-white placeholder-emerald-200/50 transition-all"
                                placeholder="John Doe"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-emerald-100 font-semibold mb-2 text-sm">Email Address</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:bg-white/15 text-white placeholder-emerald-200/50 transition-all"
                                placeholder="your@email.com"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-emerald-100 font-semibold mb-2 text-sm">Password</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:bg-white/15 text-white placeholder-emerald-200/50 transition-all"
                                placeholder="••••••••"
                            />
                        </div>

                        <div className="mb-6">
                            <label className="block text-emerald-100 font-semibold mb-2 text-sm">Confirm Password</label>
                            <input
                                type="password"
                                name="password_confirmation"
                                value={formData.password_confirmation}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:bg-white/15 text-white placeholder-emerald-200/50 transition-all"
                                placeholder="••••••••"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-emerald-400 to-teal-400 text-emerald-900 py-3 rounded-xl font-bold hover:shadow-lg hover:shadow-emerald-400/50 disabled:opacity-50 transition-all duration-200 transform hover:scale-105"
                        >
                            {loading ? 'Registering...' : 'Create Account'}
                        </button>
                    </form>

                    <div className="mt-6 pt-6 border-t border-white/10">
                        <p className="text-center text-emerald-200 text-sm">
                            Already have an account?{' '}
                            <Link href="/login" className="text-emerald-300 font-semibold hover:text-emerald-200 transition-colors">
                                Login here
                            </Link>
                        </p>

                        <Link href="/" className="block text-center mt-4 text-emerald-200 hover:text-emerald-100 transition-colors text-sm">
                            ← Back to Home
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
