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
            className="group backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl hover:shadow-2xl hover:shadow-emerald-400/20 transition-all duration-300 overflow-hidden hover:bg-white/15 p-6 hover:scale-105 transform"
        >
            <div className="text-6xl mb-4 group-hover:scale-125 transition-transform duration-300">{icon}</div>
            {category.image && (
                <img 
                    src={category.image} 
                    alt={category.name}
                    className="w-full h-40 object-cover rounded-xl mb-4 group-hover:brightness-125 transition duration-300 border border-white/20"
                />
            )}
            <h4 className="text-xl font-bold text-white mb-2 group-hover:text-emerald-300 transition duration-300">{category.name}</h4>
            <p className="text-emerald-100/80 text-sm line-clamp-2 mb-4 leading-relaxed">{category.description}</p>
            <span className="inline-block text-emerald-300 font-semibold group-hover:text-emerald-200 transition duration-300">Explore →</span>
        </Link>
    );
}
