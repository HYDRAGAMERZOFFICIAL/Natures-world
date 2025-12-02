import { Link } from 'react-router-dom';

export default function Home() {
    return (
        <div className="bg-nature-background">
            {/* Hero Section */}
            <div className="relative h-screen">
                <div className="absolute inset-0">
                    <img
                        src="https://images.unsplash.com/photo-1470058869958-2a77ade41c02?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
                        alt="Nature Landscape"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/30"></div>
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
                    <div className="max-w-3xl">
                        <h1 className="text-5xl md:text-7xl font-display font-bold text-white mb-6 leading-tight">
                            Embrace the <br />
                            <span className="text-nature-secondary">Power of Nature</span>
                        </h1>
                        <p className="text-xl text-gray-200 mb-10 max-w-2xl font-light">
                            Discover our curated collection of organic, sustainable, and ethically sourced essentials for your body and home.
                        </p>
                        <div className="flex space-x-4">
                            <Link
                                to="/products"
                                className="bg-nature-primary hover:bg-nature-primary/90 text-white px-8 py-4 rounded-sm font-medium tracking-wide transition-all duration-300 transform hover:-translate-y-1 shadow-lg"
                            >
                                SHOP COLLECTION
                            </Link>
                            <Link
                                to="/about"
                                className="bg-white/10 backdrop-blur-md hover:bg-white/20 text-white border border-white/30 px-8 py-4 rounded-sm font-medium tracking-wide transition-all duration-300"
                            >
                                OUR STORY
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Featured Categories */}
            <div className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-display font-bold text-nature-primary mb-4">Curated Categories</h2>
                    <div className="w-24 h-1 bg-nature-accent mx-auto"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        { name: 'Organic Skincare', image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
                        { name: 'Natural Body', image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
                        { name: 'Eco Home', image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' }
                    ].map((category) => (
                        <div key={category.name} className="group relative h-96 overflow-hidden cursor-pointer">
                            <img
                                src={category.image}
                                alt={category.name}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-500"></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <h3 className="text-3xl font-display text-white font-bold tracking-wider border-b-2 border-transparent group-hover:border-nature-accent pb-2 transition-all duration-300">
                                    {category.name}
                                </h3>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
