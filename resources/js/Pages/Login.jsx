import React, { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login, isAuthenticated } = useAuth();

    useEffect(() => {
        if (isAuthenticated) {
            window.location.href = '/';
        }
    }, [isAuthenticated]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            let data;
            try {
                data = await res.json();
            } catch {
                setError('Server error. Please check the console and contact support.');
                setLoading(false);
                return;
            }

            if (!res.ok) {
                setError(data.error || data.message || 'Login failed');
                setLoading(false);
                return;
            }

            if (data.token && data.user) {
                login(data.user, data.token);
                
                const returnUrl = localStorage.getItem('returnUrl') || '/';
                localStorage.removeItem('returnUrl');
                window.location.href = returnUrl;
            } else {
                setError('Invalid response from server');
                setLoading(false);
            }
        } catch (error) {
            console.error('Error:', error);
            setError('An error occurred. Please try again.');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden" style={{backgroundImage: 'url(/BG/loginregister.webp)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed'}}>
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/50 via-green-800/50 to-teal-900/50"></div>
            
            <style>{`
                @keyframes flipIn {
                    from {
                        opacity: 0;
                        transform: rotateY(-90deg);
                    }
                    to {
                        opacity: 1;
                        transform: rotateY(0);
                    }
                }
                .flip-in {
                    animation: flipIn 0.8s ease-out;
                    transform-style: preserve-3d;
                    perspective: 1000px;
                }
            `}</style>

            <div className="w-full max-w-md relative z-10 flip-in">
                <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl p-8 hover:bg-white/15 transition-all duration-300">
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold text-white mb-2">🌿 Nature's World</h1>
                        <h2 className="text-2xl font-semibold text-emerald-100">Welcome Back</h2>
                        <p className="text-emerald-200 text-sm mt-2">Sign in to explore beautiful products</p>
                    </div>

                    {error && (
                        <div className="bg-red-500/20 border border-red-400/50 text-red-100 px-4 py-3 rounded-xl mb-6 backdrop-blur-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleLogin}>
                        <div className="mb-5">
                            <label className="block text-emerald-100 font-semibold mb-2 text-sm">Email Address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:bg-white/15 text-white placeholder-emerald-200/50 transition-all"
                                placeholder="your@email.com"
                            />
                        </div>

                        <div className="mb-6">
                            <label className="block text-emerald-100 font-semibold mb-2 text-sm">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:bg-white/15 text-white placeholder-emerald-200/50 transition-all"
                                placeholder="••••••••"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-emerald-400 to-teal-400 text-emerald-900 py-3 rounded-xl font-bold hover:shadow-lg hover:shadow-emerald-400/50 disabled:opacity-50 transition-all duration-200 transform hover:scale-105"
                        >
                            {loading ? 'Logging in...' : 'Login'}
                        </button>
                    </form>

                    <div className="mt-6 pt-6 border-t border-white/10">
                        <p className="text-center text-emerald-200 text-sm">
                            Don't have an account?{' '}
                            <Link href="/register" className="text-emerald-300 font-semibold hover:text-emerald-200 transition-colors">
                                Register here
                            </Link>
                        </p>

                        <Link href="/" className="block text-center mt-4 text-emerald-200 hover:text-emerald-100 transition-colors text-sm">
                            ← Back to Home
                        </Link>
                    </div>
                </div>

                <p className="text-center text-emerald-200/60 text-xs mt-6">
                    Demo: admin@example.com | password
                </p>
            </div>
        </div>
    );
}
