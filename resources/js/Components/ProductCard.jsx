import React from 'react';
import { Link } from '@inertiajs/react';

export default function ProductCard({ product }) {
    return (
        <div className="group bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-emerald-300">
            <div className="relative overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 h-48">
                {product.image ? (
                    <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-5xl">🌿</div>
                )}
                <div className="absolute top-3 right-3 bg-emerald-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                    {product.quantity > 0 ? '✓ In Stock' : 'Out'}
                </div>
            </div>
            <div className="p-5">
                <h4 className="text-lg font-bold text-gray-800 mb-2 line-clamp-1 group-hover:text-emerald-600 transition">{product.name}</h4>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2 h-10">{product.description}</p>
                <div className="flex justify-between items-center gap-3">
                    <span className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">${product.price}</span>
                    <Link 
                        href={`/product/${product.id}`}
                        className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all font-semibold text-sm"
                    >
                        View →
                    </Link>
                </div>
            </div>
        </div>
    );
}
