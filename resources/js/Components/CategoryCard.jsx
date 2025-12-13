import React from 'react';
import { Link } from '@inertiajs/react';

export default function CategoryCard({ category }) {
    const icons = {
        'plants': '🌱',
        'flowers': '🌸',
        'gardening': '🌻',
        'seeds': '🌾',
        'tools': '🔧',
        'accessories': '✨'
    };

    const icon = icons[category.slug?.toLowerCase()] || '🌿';

    return (
        <Link 
            href={`/shop?category=${category.slug}`}
            className="group bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border-2 border-emerald-200 hover:border-emerald-500 p-6 hover:scale-105"
        >
            <div className="text-5xl mb-4 group-hover:scale-125 transition-transform duration-300">{icon}</div>
            {category.image && (
                <img 
                    src={category.image} 
                    alt={category.name}
                    className="w-full h-32 object-cover rounded-lg mb-4 group-hover:brightness-110 transition"
                />
            )}
            <h4 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-emerald-600 transition">{category.name}</h4>
            <p className="text-gray-600 text-sm line-clamp-2 mb-4">{category.description}</p>
            <span className="inline-block text-emerald-600 font-semibold group-hover:text-emerald-700">Explore →</span>
        </Link>
    );
}
