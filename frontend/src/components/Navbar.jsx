import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
    const { user, logout } = useAuth();

    return (
        <nav className="fixed w-full z-50 bg-nature-primary/90 backdrop-blur-md shadow-lg transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20 items-center">
                    <div className="flex items-center">
                        <Link to="/" className="flex-shrink-0 flex items-center group">
                            <span className="text-3xl font-display font-bold text-nature-secondary tracking-wider group-hover:text-nature-accent transition-colors duration-300">
                                Nature's World
                            </span>
                        </Link>
                        <div className="hidden md:ml-10 md:flex md:space-x-8">
                            {['Products', 'About', 'Contact'].map((item) => (
                                <Link
                                    key={item}
                                    to={item === 'Products' ? '/products' : '#'}
                                    className="text-nature-secondary hover:text-nature-accent px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300 relative group"
                                >
                                    {item}
                                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-nature-accent transition-all duration-300 group-hover:w-full"></span>
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center space-x-6">
                        <div className="hidden md:block relative">
                            <input
                                type="text"
                                className="bg-nature-secondary/10 text-nature-secondary placeholder-nature-secondary/50 rounded-full py-2 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-nature-accent focus:bg-nature-secondary/20 transition-all duration-300 w-64"
                                placeholder="Search essentials..."
                            />
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-nature-secondary/50 absolute left-3 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>

                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2 text-nature-secondary">
                                <span className="text-sm hidden lg:block">Hello, {user?.name || 'Guest'}</span>
                            </div>

                            <Link to="/cart" className="relative group text-nature-secondary hover:text-nature-accent transition-colors duration-300">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                </svg>
                                <span className="absolute -top-2 -right-2 bg-nature-accent text-nature-primary text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">0</span>
                            </Link>

                            {user ? (
                                <button
                                    onClick={logout}
                                    className="text-sm text-nature-secondary hover:text-nature-accent transition-colors duration-300"
                                >
                                    Logout
                                </button>
                            ) : (
                                <Link to="/login" className="text-sm text-nature-secondary hover:text-nature-accent transition-colors duration-300">
                                    Sign In
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}
