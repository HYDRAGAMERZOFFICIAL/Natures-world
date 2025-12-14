import React from 'react';
import { Link } from '@inertiajs/react';

export default function ProductCard({ product }) {
    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(price);
    };

    const stockStatus = product.quantity > 20 ? 'In Stock' : product.quantity > 0 ? 'Low Stock' : 'Out of Stock';
    const stockColor = product.quantity > 20 ? 'bg-emerald-600' : product.quantity > 0 ? 'bg-amber-600' : 'bg-red-600';

    return (
        <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-emerald-300 flex flex-col h-full">
            <div className="relative overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 h-56">
                {product.image ? (
                    <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-6xl">💄</div>
                )}
                <div className={`absolute top-4 right-4 ${stockColor} text-white px-4 py-2 rounded-full text-xs font-bold shadow-md`}>
                    {stockStatus}
                </div>
            </div>
            
            <div className="p-6 flex flex-col flex-grow">
                <h4 className="text-base font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-emerald-600 transition h-14">
                    {product.name}
                </h4>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-grow">
                    {product.description}
                </p>
                
                {product.category && (
                    <p className="text-xs text-emerald-600 font-semibold mb-3 uppercase tracking-wide">
                        {product.category.name}
                    </p>
                )}
                
                <div className="flex justify-between items-end gap-3 mt-auto pt-4 border-t border-gray-100">
                    <div className="flex flex-col">
                        <span className="text-xs text-gray-500 font-medium mb-1">Price</span>
                        <span className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                            {formatPrice(product.price)}
                        </span>
                    </div>
                    <Link 
                        href={`/product/${product.id}`}
                        className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-5 py-3 rounded-lg hover:shadow-lg transition-all font-semibold text-sm flex items-center gap-2 whitespace-nowrap"
                    >
                        View
                        <span>→</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}
