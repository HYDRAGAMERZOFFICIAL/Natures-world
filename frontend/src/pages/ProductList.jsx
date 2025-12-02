import { useEffect, useState } from 'react';
import axiosClient from '../api/axios';

export default function ProductList() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getProducts();
    }, []);

    const getProducts = () => {
        setLoading(true);
        axiosClient.get('/products')
            .then(({ data }) => {
                setProducts(data.data);
                setLoading(false);
            })
            .catch(() => {
                setLoading(false);
            });
    };

    return (
        <div className="bg-nature-background min-h-screen pt-24 pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12">
                    <div>
                        <h1 className="text-4xl font-display font-bold text-nature-primary mb-2">Our Collection</h1>
                        <p className="text-nature-text/60">Curated essentials for your natural lifestyle.</p>
                    </div>
                    <div className="flex space-x-4 mt-4 md:mt-0">
                        <button className="text-sm font-medium text-nature-primary border-b-2 border-nature-primary pb-1">All</button>
                        <button className="text-sm font-medium text-nature-text/40 hover:text-nature-primary transition-colors pb-1">Skincare</button>
                        <button className="text-sm font-medium text-nature-text/40 hover:text-nature-primary transition-colors pb-1">Body</button>
                    </div>
                </div>

                {loading && <div className="text-center text-nature-secondary">Loading nature's gifts...</div>}

                {!loading && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                        {products.map((product) => (
                            <div key={product.id} className="group cursor-pointer">
                                <div className="relative w-full aspect-[4/5] bg-white overflow-hidden rounded-sm mb-4">
                                    <img
                                        src={product.image || 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'}
                                        alt={product.name}
                                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                                    />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500"></div>
                                    <button className="absolute bottom-4 left-1/2 -translate-x-1/2 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 bg-white text-nature-primary px-6 py-2 text-sm font-medium tracking-wide shadow-lg transition-all duration-300 hover:bg-nature-primary hover:text-white">
                                        ADD TO CART
                                    </button>
                                </div>
                                <div className="text-center">
                                    <h3 className="text-lg font-display text-nature-primary mb-1 group-hover:text-nature-accent transition-colors">
                                        {product.name}
                                    </h3>
                                    <p className="text-nature-text/60 text-sm mb-2">Natural & Organic</p>
                                    <p className="text-nature-primary font-medium">${Math.floor(product.price)}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
